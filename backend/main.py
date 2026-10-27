"""Praxis REST API.

Run from the repository root with:
    uvicorn backend.main:app --reload

Mission and track JSON remain the source of truth. Evaluation results and user
accounts are persisted in SQLite (override the path with WORKSIM_DB_PATH).
"""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import sqlite3
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field

from .generate_handbook import build_handbook_pdf
from .generate_role_handbooks import build_role_handbook_pdf, ROLE_CONFIGS
from .certificate import generate_certificate_pdf
from .problems import ROLES, QUIZ_QUESTIONS, PROBLEMS, evaluate_problem_submission
from .rubric import evaluate_submission
from .sheet_sync import GOOGLE_SHEET_ID, GOOGLE_SHEET_URL, generate_users_csv, sync_users_to_workspace_file


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = Path(__file__).resolve().parent / "worksim.sqlite3"
HANDBOOK_PATH = PROJECT_ROOT / "frontend" / "assets" / "Praxis_Industry_Foundations_Handbook.pdf"
_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$")


def _hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    if salt is None:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return key.hex(), salt


def _verify_password(password: str, stored_hash: str, salt: str) -> bool:
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return secrets.compare_digest(key.hex(), stored_hash)


def _now_utc() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


# ==============================================================================
# PYDANTIC SCHEMAS
# ==============================================================================

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=100)
    full_name: str = Field(min_length=2, max_length=100)


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=1, max_length=100)


class SelectRoleRequest(BaseModel):
    role: str = Field(min_length=1, max_length=50)


class QuizSubmitRequest(BaseModel):
    answers: dict[str, str] = Field(description="Dictionary of question_id -> selected_option_id")


class ProblemSubmitRequest(BaseModel):
    solution: str = Field(min_length=10, max_length=30000)


class SubmissionRequest(BaseModel):
    """Validated request shape for a learner mission submission."""

    model_config = ConfigDict(extra="forbid")

    mission_id: str = Field(
        min_length=1,
        max_length=100,
        pattern=r"^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$",
        description="ID of the mission being submitted",
    )
    answers: dict[str, Any] = Field(
        min_length=1,
        max_length=50,
        description="Answer values keyed by submission field ID",
    )


class ReviewRequest(BaseModel):
    """Request shape for a human reviewer in the admin/reviewer portal."""

    model_config = ConfigDict(extra="ignore")

    status: str = Field(
        min_length=1,
        max_length=50,
        pattern=r"^(approved|needs_revision|conditional|pending)$",
        description="Review status: 'approved' or 'needs_revision'",
    )
    notes: str = Field(default="", max_length=10000, description="Reviewer comments and coaching notes")


# ==============================================================================
# DATA CATALOG & STORE
# ==============================================================================

class DataCatalog:
    """Reads tracks and missions from the repository's JSON data directories."""

    def __init__(self, project_root: str | Path = PROJECT_ROOT) -> None:
        self.project_root = Path(project_root).resolve()
        self.tracks_dir = self.project_root / "tracks"
        self.missions_dir = self.project_root / "missions"

    @staticmethod
    def _read_json(path: Path) -> dict[str, Any]:
        try:
            with path.open("r", encoding="utf-8") as stream:
                value = json.load(stream)
        except (OSError, json.JSONDecodeError) as exc:
            raise RuntimeError(f"Unable to load catalog file {path.name}: {exc}") from exc
        if not isinstance(value, dict):
            raise RuntimeError(f"Catalog file {path.name} must contain a JSON object")
        return value

    def _all(self, directory: Path) -> list[dict[str, Any]]:
        if not directory.is_dir():
            return []
        return [self._read_json(path) for path in sorted(directory.glob("*.json"))]

    def list_tracks(self) -> list[dict[str, Any]]:
        tracks = self._all(self.tracks_dir)
        return [
            {key: value for key, value in track.items() if key not in {"industry_glossary", "readiness_quiz"}}
            for track in tracks
        ]

    def get_track(self, track_id: str) -> dict[str, Any] | None:
        if not _ID_PATTERN.fullmatch(track_id):
            return None
        path = self.tracks_dir / f"{track_id}.json"
        if not path.is_file():
            return None
        track = self._read_json(path)
        if track.get("id") != track_id:
            raise RuntimeError(f"Track ID in {path.name} does not match its filename")
        return track

    def list_missions(self) -> list[dict[str, Any]]:
        return self._all(self.missions_dir)

    def get_mission(self, mission_id: str) -> dict[str, Any] | None:
        if not _ID_PATTERN.fullmatch(mission_id):
            return None
        path = self.missions_dir / f"{mission_id}.json"
        if not path.is_file():
            return None
        mission = self._read_json(path)
        if mission.get("id") != mission_id:
            raise RuntimeError(f"Mission ID in {path.name} does not match its filename")
        return mission


class SubmissionStore:
    """SQLite repository for candidate answers, users, and progress results."""

    def __init__(self, database_path: str | Path) -> None:
        self.database_path = Path(database_path).expanduser().resolve()
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self.initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA busy_timeout = 10000")
        return connection

    def initialize(self) -> None:
        connection = self._connect()
        try:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS submissions (
                    submission_id TEXT PRIMARY KEY,
                    mission_id TEXT NOT NULL,
                    answers_json TEXT NOT NULL,
                    result_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                "CREATE INDEX IF NOT EXISTS idx_submissions_mission_id ON submissions(mission_id)"
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    full_name TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    password_salt TEXT NOT NULL,
                    role TEXT,
                    role_locked INTEGER DEFAULT 0,
                    quiz_passed INTEGER DEFAULT 0,
                    quiz_score INTEGER DEFAULT 0,
                    created_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS sessions (
                    token TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS user_progress (
                    user_id TEXT NOT NULL,
                    problem_id TEXT NOT NULL,
                    status TEXT NOT NULL,
                    solution TEXT NOT NULL,
                    score INTEGER NOT NULL,
                    feedback TEXT,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, problem_id)
                )
                """
            )
            connection.commit()
        finally:
            connection.close()

    def create_user(self, username: str, password: str, full_name: str) -> tuple[dict[str, Any], str]:
        uname = username.strip().casefold()
        if not uname or len(uname) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters")

        user_id = str(uuid4())
        pwd_hash, pwd_salt = _hash_password(password)
        now = _now_utc()

        connection = self._connect()
        try:
            connection.execute(
                """
                INSERT INTO users (user_id, username, full_name, password_hash, password_salt, role, role_locked, quiz_passed, quiz_score, created_at)
                VALUES (?, ?, ?, ?, ?, NULL, 0, 0, 0, ?)
                """,
                (user_id, uname, full_name.strip(), pwd_hash, pwd_salt, now),
            )
            token = secrets.token_hex(24)
            connection.execute(
                "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
                (token, user_id, now),
            )
            connection.commit()
        except sqlite3.IntegrityError:
            raise ValueError(f"Username '{uname}' is already registered.")
        finally:
            connection.close()

        try:
            sync_users_to_workspace_file(self.database_path, PROJECT_ROOT / "frontend" / "assets" / "Praxis_Registered_Users.csv")
        except Exception:
            pass

        user = {
            "user_id": user_id,
            "username": uname,
            "full_name": full_name.strip(),
            "role": None,
            "role_locked": False,
            "quiz_passed": False,
            "quiz_score": 0,
            "created_at": now,
        }
        self.sync_users_to_ledger()
        return user, token

    def authenticate_user(self, username: str, password: str) -> tuple[dict[str, Any], str]:
        uname = username.strip().casefold()
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM users WHERE username = ?",
                (uname,),
            ).fetchone()
            if row is None:
                raise ValueError("Invalid username or password.")

            if not _verify_password(password, row["password_hash"], row["password_salt"]):
                raise ValueError("Invalid username or password.")

            token = secrets.token_hex(24)
            connection.execute(
                "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
                (token, row["user_id"], _now_utc()),
            )
            connection.commit()

            user = {
                "user_id": row["user_id"],
                "username": row["username"],
                "full_name": row["full_name"],
                "role": row["role"],
                "role_locked": bool(row["role_locked"]),
                "quiz_passed": bool(row["quiz_passed"]),
                "quiz_score": row["quiz_score"],
                "created_at": row["created_at"],
            }
            return user, token
        finally:
            connection.close()

    def get_user_by_token(self, token: str) -> dict[str, Any] | None:
        if not token:
            return None
        connection = self._connect()
        try:
            row = connection.execute(
                """
                SELECT u.* FROM users u
                JOIN sessions s ON u.user_id = s.user_id
                WHERE s.token = ?
                """,
                (token,),
            ).fetchone()
            if row is None:
                return None
            return {
                "user_id": row["user_id"],
                "username": row["username"],
                "full_name": row["full_name"],
                "role": row["role"],
                "role_locked": bool(row["role_locked"]),
                "quiz_passed": bool(row["quiz_passed"]),
                "quiz_score": row["quiz_score"],
                "created_at": row["created_at"],
            }
        finally:
            connection.close()

    def lock_user_role(self, user_id: str, role: str) -> dict[str, Any]:
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM users WHERE user_id = ?",
                (user_id,),
            ).fetchone()
            if row is None:
                raise ValueError("User not found.")
            if row["role_locked"]:
                raise PermissionError("Role is permanently locked and cannot be modified.")

            connection.execute(
                "UPDATE users SET role = ?, role_locked = 1 WHERE user_id = ?",
                (role, user_id),
            )
            connection.commit()

            updated = connection.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
            res = {
                "user_id": updated["user_id"],
                "username": updated["username"],
                "full_name": updated["full_name"],
                "role": updated["role"],
                "role_locked": bool(updated["role_locked"]),
                "quiz_passed": bool(updated["quiz_passed"]),
                "quiz_score": updated["quiz_score"],
                "created_at": updated["created_at"],
            }
            try:
                self.sync_users_to_ledger()
            except Exception:
                pass
            return res
        finally:
            connection.close()

    def update_user_quiz(self, user_id: str, passed: bool, score: int) -> None:
        connection = self._connect()
        try:
            connection.execute(
                "UPDATE users SET quiz_passed = ?, quiz_score = ? WHERE user_id = ?",
                (1 if passed else 0, score, user_id),
            )
            connection.commit()
            try:
                self.sync_users_to_ledger()
            except Exception:
                pass
        finally:
            connection.close()

    def export_users_csv(self) -> str:
        connection = self._connect()
        try:
            rows = connection.execute(
                "SELECT user_id, username, full_name, role, role_locked, quiz_passed, quiz_score, created_at FROM users ORDER BY created_at ASC"
            ).fetchall()
        finally:
            connection.close()

        role_display = {
            "software-developer": "Software Developer",
            "cloud-engineer": "Cloud Engineer",
            "data-analyst": "Data Analyst",
            "cloud-sre": "Cloud Engineer",
            "backend-eng": "Software Developer",
            "data-ai": "Data Analyst",
            "fullstack-prod": "Software Developer",
        }

        lines = [
            "User ID,Username,Full Name,Career Track,Role Locked,Readiness Quiz Status,Quiz Score,Registered At (UTC),Platform"
        ]
        for r in rows:
            track = role_display.get(r["role"], r["role"] or "Pending Selection")
            locked = "Yes (Permanent)" if r["role_locked"] else "No"
            quiz_status = "Passed (5/5)" if r["quiz_passed"] else "Incomplete"
            quiz_score = f"{r['quiz_score']}/5" if r["quiz_passed"] else "0/5"
            lines.append(
                f"{r['user_id']},{r['username']},{r['full_name']},{track},{locked},{quiz_status},{quiz_score},{r['created_at']},Praxis Workplace Simulation"
            )
        return "\r\n".join(lines)

    def sync_users_to_ledger(self) -> Path:
        ledger_file = self.database_path.parent / "registered_users_ledger.csv"
        csv_content = self.export_users_csv()
        ledger_file.write_text(csv_content, encoding="utf-8")
        return ledger_file

    def get_user_progress(self, user_id: str) -> dict[str, dict[str, Any]]:
        connection = self._connect()
        try:
            rows = connection.execute(
                "SELECT problem_id, status, score, updated_at FROM user_progress WHERE user_id = ?",
                (user_id,),
            ).fetchall()
            return {
                row["problem_id"]: {
                    "status": row["status"],
                    "score": row["score"],
                    "updated_at": row["updated_at"],
                }
                for row in rows
            }
        finally:
            connection.close()

    def save_problem_progress(self, user_id: str, problem_id: str, status: str, solution: str, score: int, feedback: str) -> None:
        connection = self._connect()
        try:
            connection.execute(
                """
                INSERT INTO user_progress (user_id, problem_id, status, solution, score, feedback, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, problem_id) DO UPDATE SET
                    status = excluded.status,
                    solution = excluded.solution,
                    score = excluded.score,
                    feedback = excluded.feedback,
                    updated_at = excluded.updated_at
                """,
                (user_id, problem_id, status, solution, score, feedback, _now_utc()),
            )
            connection.commit()
        finally:
            connection.close()

    def save(self, submission: dict[str, Any]) -> None:
        connection = self._connect()
        try:
            connection.execute(
                """
                INSERT INTO submissions (submission_id, mission_id, answers_json, result_json, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    submission["submission_id"],
                    submission["mission_id"],
                    json.dumps(submission["answers"], ensure_ascii=False),
                    json.dumps(submission, ensure_ascii=False),
                    submission["created_at"],
                ),
            )
            connection.commit()
        finally:
            connection.close()

    def get(self, submission_id: str) -> dict[str, Any] | None:
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT result_json FROM submissions WHERE submission_id = ?",
                (submission_id,),
            ).fetchone()
        finally:
            connection.close()
        if row is None:
            return None
        return json.loads(row["result_json"])

    def list_all(self, limit: int = 50, mission_id: str | None = None) -> list[dict[str, Any]]:
        connection = self._connect()
        try:
            if mission_id:
                rows = connection.execute(
                    "SELECT result_json FROM submissions WHERE mission_id = ? ORDER BY created_at DESC LIMIT ?",
                    (mission_id, limit),
                ).fetchall()
            else:
                rows = connection.execute(
                    "SELECT result_json FROM submissions ORDER BY created_at DESC LIMIT ?",
                    (limit,),
                ).fetchall()
        finally:
            connection.close()
        return [json.loads(row["result_json"]) for row in rows]

    def update_review(self, submission_id: str, reviewer_status: str, reviewer_notes: str) -> dict[str, Any] | None:
        sub = self.get(submission_id)
        if sub is None:
            return None
        sub["reviewer_status"] = reviewer_status
        sub["reviewer_notes"] = reviewer_notes
        sub["reviewed_at"] = _now_utc()
        connection = self._connect()
        try:
            connection.execute(
                "UPDATE submissions SET result_json = ? WHERE submission_id = ?",
                (json.dumps(sub, ensure_ascii=False), submission_id),
            )
            connection.commit()
        finally:
            connection.close()
        return sub


def _submission_fields(mission: dict[str, Any]) -> list[str]:
    fields = mission.get("submission_fields")
    if isinstance(fields, list):
        return [str(field["id"]) for field in fields if isinstance(field, dict) and field.get("id")]
    template = mission.get("submission_template")
    if isinstance(template, dict):
        return [str(field_id) for field_id in template]
    return []


def _has_answer_content(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, dict):
        return any(_has_answer_content(item) for item in value.values())
    if isinstance(value, (list, tuple)):
        return any(_has_answer_content(item) for item in value)
    return True


def _mission_submission_template(mission: dict[str, Any]) -> dict[str, Any]:
    existing = mission.get("submission_template")
    if isinstance(existing, dict):
        return existing
    template: dict[str, Any] = {}
    for field in mission.get("submission_fields", []):
        if not isinstance(field, dict) or not field.get("id"):
            continue
        template[str(field["id"])] = (
            field.get("placeholder") or field.get("guidance") or field.get("label") or ""
        )
    return template


def _mission_summary(mission: dict[str, Any]) -> dict[str, Any]:
    summary_keys = (
        "id",
        "title",
        "role",
        "track_id",
        "difficulty",
        "estimated_time",
        "scenario",
        "key_skills",
        "deliverables",
    )
    return {key: mission[key] for key in summary_keys if key in mission}


# ==============================================================================
# FASTAPI APP FACTORY
# ==============================================================================

def create_app(
    project_root: str | Path | None = None,
    database_path: str | Path | None = None,
) -> FastAPI:
    root = Path(project_root).resolve() if project_root is not None else PROJECT_ROOT
    db_path = database_path or os.environ.get("WORKSIM_DB_PATH") or DEFAULT_DATABASE_PATH
    catalog = DataCatalog(root)
    store = SubmissionStore(db_path)

    # Ensure 12-page handbook PDF exists
    if not HANDBOOK_PATH.is_file():
        try:
            build_handbook_pdf(HANDBOOK_PATH)
        except Exception:
            pass

    application = FastAPI(
        title="Praxis API",
        version="1.0.0",
        description="Praxis Workplace Simulation & Engineering Problem Bank API.",
    )
    application.state.catalog = catalog
    application.state.submission_store = store

    # Security Headers Middleware
    @application.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
        allow_headers=["*"],
    )

    def _resolve_user(authorization: str | None) -> dict[str, Any] | None:
        if not authorization or not authorization.startswith("Bearer "):
            return None
        token = authorization[7:].strip()
        return store.get_user_by_token(token)

    def _require_user(authorization: str | None) -> dict[str, Any]:
        user = _resolve_user(authorization)
        if not user:
            raise HTTPException(status_code=401, detail="Authentication token required.")
        return user

    # --------------------------------------------------------------------------
    # HEALTH & ROLES
    # --------------------------------------------------------------------------
    @application.get("/health", tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @application.get("/api/roles", tags=["roles"])
    def list_roles() -> list[dict[str, Any]]:
        return ROLES

    GOOGLE_SHEET_ID = "1KxTxJ4cb8ZA3YB7j0_YNIUumB7qPbCs4kbTQ1cm-xr0"
    GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1KxTxJ4cb8ZA3YB7j0_YNIUumB7qPbCs4kbTQ1cm-xr0/edit?usp=drivesdk"

    @application.get("/api/admin/users/csv", tags=["admin"])
    def get_registered_users_csv():
        from fastapi.responses import Response
        csv_text = store.export_users_csv()
        return Response(
            content=csv_text,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=Praxis_Registered_Users_Master_Ledger.csv"},
        )

    @application.get("/api/admin/google-sheet", tags=["admin"])
    def get_google_sheet_info() -> dict[str, Any]:
        csv_text = store.export_users_csv()
        lines = [line for line in csv_text.strip().split("\n") if line.strip()]
        total_users = max(0, len(lines) - 1)
        return {
            "sheet_id": GOOGLE_SHEET_ID,
            "web_view_link": GOOGLE_SHEET_URL,
            "total_users": total_users,
            "message": "Live Google Sheet actively records all user registrations."
        }

    # --------------------------------------------------------------------------
    # AUTHENTICATION & ROLE LOCKING
    # --------------------------------------------------------------------------
    @application.post("/api/auth/register", status_code=201, tags=["auth"])
    def register(payload: RegisterRequest) -> dict[str, Any]:
        try:
            user, token = store.create_user(payload.username, payload.password, payload.full_name)
            return {"user": user, "token": token}
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @application.post("/api/auth/login", tags=["auth"])
    def login(payload: LoginRequest) -> dict[str, Any]:
        try:
            user, token = store.authenticate_user(payload.username, payload.password)
            return {"user": user, "token": token}
        except ValueError as exc:
            raise HTTPException(status_code=401, detail=str(exc)) from exc

    @application.get("/api/auth/me", tags=["auth"])
    def get_me(authorization: str | None = Header(default=None)) -> dict[str, Any]:
        user = _require_user(authorization)
        return {"user": user}

    @application.post("/api/auth/select-role", tags=["auth"])
    def select_role(
        payload: SelectRoleRequest,
        authorization: str | None = Header(default=None),
    ) -> dict[str, Any]:
        user = _require_user(authorization)
        role_aliases = {
            "cloud-sre": "cloud-engineer",
            "backend-eng": "software-developer",
            "data-ai": "data-analyst",
            "fullstack-prod": "software-developer",
        }
        valid_role_ids = {r["id"] for r in ROLES} | set(role_aliases.keys())
        if payload.role not in valid_role_ids:
            raise HTTPException(status_code=400, detail=f"Invalid role. Choose from {sorted(valid_role_ids)}")

        try:
            updated_user = store.lock_user_role(user["user_id"], payload.role)
            return {"user": updated_user, "message": "Role locked successfully and cannot be modified."}
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail=str(exc)) from exc
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    ROLE_HANDBOOK_FILENAMES = {
        "software-developer": "Software_Developer_Handbook.pdf",
        "cloud-engineer": "Cloud_Engineer_Handbook.pdf",
        "data-analyst": "Data_Analyst_Handbook.pdf",
        "backend-eng": "Software_Developer_Handbook.pdf",
        "cloud-sre": "Cloud_Engineer_Handbook.pdf",
        "data-ai": "Data_Analyst_Handbook.pdf",
    }

    def _get_role_pdf_path(role: str | None) -> tuple[Path, str]:
        assets_dir = PROJECT_ROOT / "frontend" / "assets"
        if role and role in ROLE_HANDBOOK_FILENAMES:
            fname = ROLE_HANDBOOK_FILENAMES[role]
            target_path = assets_dir / fname
            if not target_path.is_file():
                build_role_handbook_pdf(role, target_path)
            return target_path, fname
        if not HANDBOOK_PATH.is_file():
            build_handbook_pdf(HANDBOOK_PATH)
        return HANDBOOK_PATH, "Praxis_Industry_Foundations_Handbook.pdf"

    # --------------------------------------------------------------------------
    # 12-PAGE ROLE-SPECIFIC KNOWLEDGE PDF HANDBOOK DELIVERY
    # --------------------------------------------------------------------------
    @application.get("/api/handbook/download", tags=["handbook"])
    def download_handbook(
        role: str | None = Query(default=None),
        authorization: str | None = Header(default=None),
    ):
        user = _resolve_user(authorization) if authorization else None
        target_role = role or (user.get("role") if user else None)
        pdf_path, filename = _get_role_pdf_path(target_role)
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=filename,
        )

    @application.get("/api/handbook/{role_id}/download", tags=["handbook"])
    def download_role_handbook(role_id: str):
        pdf_path, filename = _get_role_pdf_path(role_id)
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=filename,
        )

    @application.get("/api/handbook/pdf", tags=["handbook"])
    def view_handbook(
        role: str | None = Query(default=None),
        authorization: str | None = Header(default=None),
    ):
        user = _resolve_user(authorization) if authorization else None
        target_role = role or (user.get("role") if user else None)
        pdf_path, _ = _get_role_pdf_path(target_role)
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
        )

    @application.get("/api/handbook/info", tags=["handbook"])
    def get_handbook_info(
        role: str | None = Query(default=None),
        authorization: str | None = Header(default=None),
    ) -> dict[str, Any]:
        user = _resolve_user(authorization) if authorization else None
        target_role = role or (user.get("role") if user else None)
        if target_role and target_role in ROLE_CONFIGS:
            cfg = ROLE_CONFIGS[target_role]
            return {
                "role": target_role,
                "title": cfg["title"],
                "subtitle": cfg["subtitle"],
                "lead_paragraph": cfg["lead_paragraph"],
                "chapters": [
                    {
                        "num": ch["num"],
                        "title": ch["title"],
                        "tagline": ch["tagline"],
                        "body": ch["body"],
                        "callout_title": ch["callout_title"],
                        "callout_body": ch["callout_body"],
                        "table_data": ch["table_data"],
                    }
                    for ch in cfg["chapters"]
                ],
            }
        # Fallback to software-developer config
        cfg = ROLE_CONFIGS["software-developer"]
        return {
            "role": "software-developer",
            "title": cfg["title"],
            "subtitle": cfg["subtitle"],
            "lead_paragraph": cfg["lead_paragraph"],
            "chapters": [
                {
                    "num": ch["num"],
                    "title": ch["title"],
                    "tagline": ch["tagline"],
                    "body": ch["body"],
                    "callout_title": ch["callout_title"],
                    "callout_body": ch["callout_body"],
                    "table_data": ch["table_data"],
                }
                for ch in cfg["chapters"]
            ],
        }

    # --------------------------------------------------------------------------
    # COMPLETION CERTIFICATE GENERATION (PDF)
    # --------------------------------------------------------------------------
    @application.get("/api/certificate/download", tags=["certificate"])
    def download_certificate(
        authorization: str | None = Header(default=None),
        learner_name: str | None = Query(default=None),
        role: str | None = Query(default=None),
    ):
        user = _resolve_user(authorization) if authorization else None
        name = learner_name or (user.get("full_name") if user else None) or (user.get("username") if user else "Engineering Practitioner")
        user_role = role or (user.get("role") if user else None) or "Software Developer"
        role_display = {
            "software-developer": "Software Developer & Systems Specialist",
            "cloud-engineer": "Cloud Engineer & SRE Specialist",
            "data-analyst": "Data Analyst & Analytics Specialist",
            "cloud-sre": "Cloud Engineer & SRE Specialist",
            "backend-eng": "Software Developer & Systems Specialist",
            "data-ai": "Data Analyst & Analytics Specialist",
        }.get(user_role, user_role)

        cert_id = f"PX-CERT-{(user.get('user_id') if user else 'DEMO')[:8].upper()}"
        today_str = datetime.now(timezone.utc).strftime("%B %d, %Y")

        assets_dir = PROJECT_ROOT / "frontend" / "assets"
        cert_path = assets_dir / f"Praxis_Certificate_{cert_id}.pdf"
        generate_certificate_pdf(cert_path, name, role_display, cert_id, today_str)

        return FileResponse(
            cert_path,
            media_type="application/pdf",
            filename=f"Praxis_Certificate_{name.replace(' ', '_')}.pdf",
        )

    # --------------------------------------------------------------------------
    # 5-QUESTION READINESS QUIZ
    # --------------------------------------------------------------------------
    @application.get("/api/quiz/questions", tags=["quiz"])
    def get_quiz_questions() -> list[dict[str, Any]]:
        # Return questions without revealing correct answer
        return [
            {
                "id": q["id"],
                "question": q["question"],
                "options": q["options"],
            }
            for q in QUIZ_QUESTIONS
        ]

    @application.post("/api/quiz/submit", tags=["quiz"])
    def submit_quiz(
        payload: QuizSubmitRequest,
        authorization: str | None = Header(default=None),
    ) -> dict[str, Any]:
        user = _require_user(authorization)
        user_answers = payload.answers
        results = []
        score = 0

        for q in QUIZ_QUESTIONS:
            qid = q["id"]
            selected = user_answers.get(qid, "").casefold()
            correct = q["correct"].casefold()
            is_correct = (selected == correct)
            if is_correct:
                score += 1
            results.append({
                "id": qid,
                "selected": selected,
                "correct": correct,
                "is_correct": is_correct,
                "explanation": q["explanation"],
            })

        passed = (score >= 4)
        store.update_user_quiz(user["user_id"], passed=passed, score=score)

        return {
            "score": score,
            "total": len(QUIZ_QUESTIONS),
            "percentage": int((score / len(QUIZ_QUESTIONS)) * 100),
            "passed": passed,
            "results": results,
            "message": "Congratulations! You passed the Readiness Assessment." if passed else "Score was below 80%. Review the handbook and try again.",
        }

    # --------------------------------------------------------------------------
    # 40 PRODUCTION PROBLEMS
    # --------------------------------------------------------------------------
    @application.get("/api/problems", tags=["problems"])
    def list_problems(
        authorization: str | None = Header(default=None),
    ) -> list[dict[str, Any]]:
        user = _resolve_user(authorization)
        user_progress = store.get_user_progress(user["user_id"]) if user else {}

        items = []
        for prob in PROBLEMS:
            prog = user_progress.get(prob["id"], {})
            item = {
                "id": prob["id"],
                "phase": prob["phase"],
                "difficulty": prob["difficulty"],
                "title": prob["title"],
                "category": prob["category"],
                "scenario": prob["scenario"],
                "task": prob["task"],
                "help_statement": prob["help_statement"],
                "starter_template": prob["starter_template"],
                "status": prog.get("status", "pending"),
                "score": prog.get("score", 0),
            }
            items.append(item)
        return items

    @application.get("/api/problems/{problem_id}", tags=["problems"])
    def get_problem(
        problem_id: str,
        authorization: str | None = Header(default=None),
    ) -> dict[str, Any]:
        match = next((p for p in PROBLEMS if p["id"] == problem_id), None)
        if match is None:
            raise HTTPException(status_code=404, detail=f"Problem '{problem_id}' was not found")

        user = _resolve_user(authorization)
        user_progress = store.get_user_progress(user["user_id"]) if user else {}
        prog = user_progress.get(problem_id, {})

        return {
            "id": match["id"],
            "phase": match["phase"],
            "difficulty": match["difficulty"],
            "title": match["title"],
            "category": match["category"],
            "scenario": match["scenario"],
            "task": match["task"],
            "help_statement": match["help_statement"],
            "starter_template": match["starter_template"],
            "status": prog.get("status", "pending"),
            "score": prog.get("score", 0),
        }

    @application.post("/api/problems/{problem_id}/submit", tags=["problems"])
    def submit_problem(
        problem_id: str,
        payload: ProblemSubmitRequest,
        authorization: str | None = Header(default=None),
    ) -> dict[str, Any]:
        user = _require_user(authorization)
        match = next((p for p in PROBLEMS if p["id"] == problem_id), None)
        if match is None:
            raise HTTPException(status_code=404, detail=f"Problem '{problem_id}' was not found")

        evaluation = evaluate_problem_submission(match, payload.solution)
        store.save_problem_progress(
            user_id=user["user_id"],
            problem_id=problem_id,
            status=evaluation["status"],
            solution=payload.solution,
            score=evaluation["score"],
            feedback=evaluation["feedback"],
        )

        return {
            "problem_id": problem_id,
            "status": evaluation["status"],
            "score": evaluation["score"],
            "passed": evaluation["passed"],
            "feedback": evaluation["feedback"],
        }

    # --------------------------------------------------------------------------
    # LEGACY MISSION SIMULATION ENDPOINTS
    # --------------------------------------------------------------------------
    @application.get("/api/tracks", tags=["tracks"])
    def list_tracks() -> list[dict[str, Any]]:
        return catalog.list_tracks()

    @application.get("/api/tracks/{track_id}", tags=["tracks"])
    def get_track(track_id: str) -> dict[str, Any]:
        track = catalog.get_track(track_id)
        if track is None:
            raise HTTPException(status_code=404, detail=f"Track '{track_id}' was not found")
        return track

    @application.get("/api/missions", tags=["missions"])
    def list_missions(
        track_id: str | None = Query(default=None),
        mission_type: str | None = Query(default=None, alias="type"),
    ) -> list[dict[str, Any]]:
        missions = catalog.list_missions()
        if track_id is not None:
            missions = [mission for mission in missions if mission.get("track_id") == track_id]
        if mission_type is not None:
            requested_type = mission_type.casefold()
            missions = [
                mission
                for mission in missions
                if str(mission.get("type") or mission.get("mission_type") or mission.get("difficulty") or "").casefold() == requested_type
            ]
        return [_mission_summary(mission) for mission in missions]

    @application.get("/api/missions/{mission_id}", tags=["missions"])
    def get_mission(mission_id: str) -> dict[str, Any]:
        mission = catalog.get_mission(mission_id)
        if mission is None:
            raise HTTPException(status_code=404, detail=f"Mission '{mission_id}' was not found")
        response = deepcopy(mission)
        response["submission_template"] = _mission_submission_template(mission)
        return response

    @application.post("/api/submissions", status_code=201, tags=["submissions"])
    def create_submission(payload: SubmissionRequest) -> dict[str, Any]:
        mission = catalog.get_mission(payload.mission_id)
        if mission is None:
            raise HTTPException(status_code=404, detail=f"Mission '{payload.mission_id}' was not found")

        for key, val in payload.answers.items():
            if isinstance(val, str) and len(val) > 30000:
                raise HTTPException(status_code=422, detail=f"Field '{key}' exceeds maximum allowed length of 30,000 characters.")

        required_fields = _submission_fields(mission)
        missing_fields = [field_id for field_id in required_fields if field_id not in payload.answers]
        empty_fields = [
            field_id
            for field_id in required_fields
            if field_id in payload.answers and not _has_answer_content(payload.answers[field_id])
        ]
        if missing_fields or empty_fields:
            raise HTTPException(
                status_code=422,
                detail={
                    "message": "Complete every required submission field before requesting rubric evaluation.",
                    "missing_fields": missing_fields,
                    "empty_fields": empty_fields,
                    "required_fields": required_fields,
                },
            )

        try:
            evaluation = evaluate_submission(mission, payload.answers)
        except ValueError as exc:
            raise HTTPException(status_code=500, detail="Mission rubric is not configured correctly") from exc

        submission_id = str(uuid4())
        created_at = _now_utc()
        result = {
            "submission_id": submission_id,
            "mission_id": payload.mission_id,
            "answers": payload.answers,
            "score": evaluation["overall_score"],
            "overall_score": evaluation["overall_score"],
            "dimensions": evaluation["dimensions"],
            "strengths": evaluation["strengths"],
            "areas_for_improvement": evaluation["areas_for_improvement"],
            "approval_status": evaluation["approval_status"],
            "approval_message": evaluation["approval_message"],
            "evaluation_note": evaluation["evaluation_note"],
            "engine_version": evaluation["engine_version"],
            "created_at": created_at,
            "evaluation": evaluation,
        }
        store.save(result)
        return result

    @application.get("/api/submissions", tags=["submissions"])
    def list_submissions(limit: int = 50, mission_id: str | None = None) -> list[dict[str, Any]]:
        return store.list_all(limit=limit, mission_id=mission_id)

    @application.get("/api/submissions/{submission_id}", tags=["submissions"])
    def get_submission(submission_id: str) -> dict[str, Any]:
        if not re.fullmatch(r"^[A-Za-z0-9-]{1,64}$", submission_id):
            raise HTTPException(status_code=400, detail="Invalid submission ID format")
        submission = store.get(submission_id)
        if submission is None:
            raise HTTPException(status_code=404, detail=f"Submission '{submission_id}' was not found")
        return submission

    @application.patch("/api/submissions/{submission_id}/review", tags=["submissions"])
    def review_submission(submission_id: str, payload: ReviewRequest) -> dict[str, Any]:
        if not re.fullmatch(r"^[A-Za-z0-9-]{1,64}$", submission_id):
            raise HTTPException(status_code=400, detail="Invalid submission ID format")
        updated = store.update_review(submission_id, payload.status, payload.notes)
        if updated is None:
            raise HTTPException(status_code=404, detail=f"Submission '{submission_id}' was not found")
        return updated

    frontend_dir = root / "frontend"
    if frontend_dir.exists():
        application.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")

    return application


app = create_app()
