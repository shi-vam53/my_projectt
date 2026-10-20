# WorkSim backend

## Setup and run

From the repository root:

```bash
python -m pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; interactive OpenAPI docs are at `/docs`.
Track and mission content is loaded from the repository's `tracks/` and `missions/` JSON directories. SQLite submissions default to `backend/worksim.sqlite3`; set `WORKSIM_DB_PATH` to use another location.

## Routes

- `GET /api/tracks` — track card/index data.
- `GET /api/tracks/{track_id}` — track glossary and readiness quiz.
- `GET /api/missions?track_id=...&type=...` — mission summaries, with optional filters.
- `GET /api/missions/{mission_id}` — full mission evidence plus a normalized `submission_template`.
- `POST /api/submissions` — validates the mission's required answer fields, scores its embedded rubric, and stores the submission.
- `GET /api/submissions/{submission_id}` — retrieves a saved submission and evaluation.
- `GET /health` — process health check.

Example submission:

```json
{
  "mission_id": "cloud-sre-01",
  "answers": {
    "incident_timeline": "14:10 UTC release deployed; ...",
    "hypothesis": "Facts: ... Assumptions: ...",
    "safe_mitigation_plan": "Follow the runbook and roll back ...",
    "verification_steps": "p99 < 150 ms and 5xx < 0.05% for 15+ minutes ...",
    "follow_up_improvement": "Move audit logging to an asynchronous queue ..."
  }
}
```

Every rubric dimension receives a 0–100 score from explicit evidence checks. The overall score is the weighted mean of the mission's rubric; dimension-level strengths, gaps, and check rationales are returned and persisted. The deterministic engine is designed for coaching and transparency, not as a replacement for human review.

## Tests

```bash
pytest -q backend/test_api.py
```
