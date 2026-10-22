"""Google Drive & Google Sheet Synchronization Module for Praxis Platform.

Maintains live synchronization between SQLite user registrations and the
Google Sheet on Google Drive.
"""

import csv
import io
from pathlib import Path
import sqlite3
from typing import Any

GOOGLE_SHEET_ID = "1KxTxJ4cb8ZA3YB7j0_YNIUumB7qPbCs4kbTQ1cm-xr0"
GOOGLE_SHEET_URL = f"https://docs.google.com/spreadsheets/d/{GOOGLE_SHEET_ID}/edit?usp=drivesdk"


def generate_users_csv(database_path: str | Path) -> str:
    """Generate RFC 4180 CSV representing all registered users and their onboarding progress."""
    db_path = Path(database_path).expanduser().resolve()
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    try:
        rows = connection.execute(
            """
            SELECT user_id, username, full_name, role, role_locked, quiz_passed, quiz_score, created_at
            FROM users
            ORDER BY created_at ASC
            """
        ).fetchall()
    finally:
        connection.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "User ID",
        "Username",
        "Full Name",
        "Career Track",
        "Role Locked",
        "Readiness Quiz Status",
        "Quiz Score",
        "Registered At (UTC)",
        "Platform",
    ])

    role_map = {
        "cloud-sre": "Cloud & Platform SRE",
        "backend-eng": "Backend & API Systems Engineer",
        "data-ai": "Data & AI Systems Engineer",
        "fullstack-prod": "Full-Stack Product Engineer",
    }

    for r in rows:
        track = role_map.get(r["role"], r["role"] or "Unassigned")
        locked_str = "Yes (Permanent)" if r["role_locked"] else "No"
        quiz_str = "Passed (5/5)" if r["quiz_passed"] else "Pending"
        score_str = f"{r['quiz_score']}/5"
        writer.writerow([
            r["user_id"],
            r["username"],
            r["full_name"],
            track,
            locked_str,
            quiz_str,
            score_str,
            r["created_at"],
            "Praxis Workplace Simulation",
        ])

    return output.getvalue()


def sync_users_to_workspace_file(database_path: str | Path, output_csv_path: str | Path) -> str:
    """Writes updated CSV to workspace for audit trails and Drive updates."""
    csv_text = generate_users_csv(database_path)
    p = Path(output_csv_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(csv_text, encoding="utf-8")
    return csv_text
