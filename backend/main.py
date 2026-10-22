"""WorkSim REST API.

Run from the repository root with:
    uvicorn backend.main:app --reload

Mission and track JSON remain the source of truth. Evaluation results are
persisted in SQLite (override the path with WORKSIM_DB_PATH).
"""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import sqlite3
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field

from .rubric import evaluate_submission


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = Path(__file__).resolve().parent / "worksim.sqlite3"
_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$")


class SubmissionRequest(BaseModel):
    """Validated request shape for a learner submission."""

    model_config = ConfigDict(extra="forbid")

    mission_id: str = Field(min_length=1, description="ID of the mission being submitted")
    answers: dict[str, Any] = Field(min_length=1, description="Answer values keyed by submission field ID")


class ReviewRequest(BaseModel):
    """Request shape for a human reviewer in the admin/reviewer portal."""

    model_config = ConfigDict(extra="ignore")

    status: str = Field(min_length=1, description="Review status: 'approved' or 'needs_revision'")
    notes: str = Field(default="", description="Reviewer comments and coaching notes")


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
        # The collection endpoint is a lightweight card/index view. The full
        # glossary and readiness quiz are returned by GET /api/tracks/{track_id}.
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
    """Small SQLite repository for candidate answers and evaluation results."""

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
    """Return required learner-answer IDs from either supported mission schema."""
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
    """Provide a canonical template while preserving the source mission schema."""
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
        "track_id",
        "type",
        "difficulty",
        "estimated_time_mins",
        "title",
        "problem_brief",
        "metadata",
        "context",
    )
    return {key: mission[key] for key in summary_keys if key in mission}


def _now_utc() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def create_app(
    project_root: str | Path | None = None,
    database_path: str | Path | None = None,
) -> FastAPI:
    """Build an API instance; dependency injection keeps endpoint tests isolated."""
    root = Path(project_root).resolve() if project_root is not None else PROJECT_ROOT
    db_path = database_path or os.environ.get("WORKSIM_DB_PATH") or DEFAULT_DATABASE_PATH
    catalog = DataCatalog(root)
    store = SubmissionStore(db_path)

    application = FastAPI(
        title="WorkSim API",
        version="1.0.0",
        description="Career-track and practical-mission API with transparent rubric scoring.",
    )
    application.state.catalog = catalog
    application.state.submission_store = store

    # Suitable for the companion local frontend; no cookies or credentials are
    # enabled, so wildcard origins do not expose credentialed browser requests.
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    @application.get("/health", tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

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
                if str(mission.get("type", "")).casefold() == requested_type
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
        submission = store.get(submission_id)
        if submission is None:
            raise HTTPException(status_code=404, detail=f"Submission '{submission_id}' was not found")
        return submission

    @application.patch("/api/submissions/{submission_id}/review", tags=["submissions"])
    def review_submission(submission_id: str, payload: ReviewRequest) -> dict[str, Any]:
        updated = store.update_review(submission_id, payload.status, payload.notes)
        if updated is None:
            raise HTTPException(status_code=404, detail=f"Submission '{submission_id}' was not found")
        return updated

    frontend_dir = root / "frontend"
    if frontend_dir.exists():
        application.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")

    return application


app = create_app()
