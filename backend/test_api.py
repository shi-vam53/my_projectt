"""Endpoint and persistence tests for the WorkSim API.

Run from the repository root after installing backend/requirements.txt:
    pytest -q backend/test_api.py
"""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from backend.main import create_app


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture
def client(tmp_path):
    app = create_app(
        project_root=REPOSITORY_ROOT,
        database_path=tmp_path / "test-worksim.sqlite3",
    )
    with TestClient(app) as test_client:
        yield test_client


def _strong_cloud_answers():
    return {
        "incident_timeline": (
            "14:10 UTC release v2.4.0 completed; at 14:13:21 UTC HikariPool reported a connection timeout. "
            "At 14:14:10 UTC DB connection pool exhausted (Active: 100, Idle: 0, Waiting: 42), and at "
            "14:15 UTC 504 Gateway Timeout errors were dispatched. p99 reached 4,850 ms and errors hit 8.7%."
        ),
        "hypothesis": (
            "Facts: the logs show the pool at 100 active connections and the release notes added "
            "synchronous persistSyncAuditLog writes in v2.4.0. The likely cause is synchronous audit logging "
            "saturating the connection pool in the payment path. Assumption: database CPU or disk I/O may "
            "also contribute, but that is unverified. The regression began after the deployment."
        ),
        "safe_mitigation_plan": (
            "Follow the runbook: roll back to release-v2.3.9 with the approved Helm rollback, or set "
            "Consul ENABLE_SYNC_AUDIT_LOG=false. Do not restart the database primary or increase the pool; "
            "avoid an untested hotfix."
        ),
        "verification_steps": (
            "Watch all pods until p99 latency is below 150ms and the 5xx error rate is below 0.05% for "
            "15+ minutes. Confirm the pool is no longer saturated and run a representative checkout."
        ),
        "follow_up_improvement": (
            "Move audit logging off the synchronous request path to an asynchronous durable Kafka or "
            "background worker queue, and add load/regression coverage."
        ),
    }


def test_health_and_track_endpoints(client):
    assert client.get("/health").json() == {"status": "ok"}

    response = client.get("/api/tracks")
    assert response.status_code == 200
    tracks = response.json()
    assert {track["id"] for track in tracks} == {
        "cloud-engineer",
        "software-developer",
        "data-analyst",
    }
    assert all("title" in track and "summary" in track for track in tracks)
    # Quiz answer keys are available on the detail route, not the card index.
    assert all("readiness_quiz" not in track for track in tracks)

    detail = client.get("/api/tracks/cloud-engineer")
    assert detail.status_code == 200
    track = detail.json()
    assert len(track["industry_glossary"]) >= 1
    assert len(track["readiness_quiz"]) == 5
    assert track["readiness_quiz"][0]["correct_answer"]

    assert client.get("/api/tracks/not-a-track").status_code == 404


def test_mission_list_filters_and_full_mission_detail(client):
    all_missions = client.get("/api/missions")
    assert all_missions.status_code == 200
    assert len(all_missions.json()) == 3

    cloud_missions = client.get("/api/missions", params={"track_id": "cloud-engineer"})
    assert [mission["id"] for mission in cloud_missions.json()] == ["cloud-sre-01"]

    guided_missions = client.get("/api/missions", params={"type": "guided"})
    assert len(guided_missions.json()) == 3

    detail = client.get("/api/missions/cloud-sre-01")
    assert detail.status_code == 200
    mission = detail.json()
    assert len(mission["evidence_tabs"]) == 5
    assert "logs" in {tab["id"] for tab in mission["evidence_tabs"]}
    assert "submission_template" in mission
    assert "incident_timeline" in mission["submission_template"]
    assert "submission_fields" in mission

    swe_detail = client.get("/api/missions/swe-01").json()
    assert "bug_analysis" in swe_detail["submission_template"]
    assert client.get("/api/missions/not-a-mission").status_code == 404


def test_submission_validation_scoring_persistence_and_retrieval(client):
    incomplete = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": {"incident_timeline": "14:10 UTC release deployed"}},
    )
    assert incomplete.status_code == 422
    validation = incomplete.json()["detail"]
    assert "hypothesis" in validation["missing_fields"]

    response = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": _strong_cloud_answers()},
    )
    assert response.status_code == 201
    submission = response.json()
    assert submission["submission_id"]
    assert submission["mission_id"] == "cloud-sre-01"
    assert 0 <= submission["overall_score"] <= 100
    assert submission["score"] == submission["overall_score"]
    assert len(submission["dimensions"]) == 4
    assert all(0 <= dimension["score"] <= 100 for dimension in submission["dimensions"])
    assert submission["strengths"]
    assert submission["areas_for_improvement"]
    assert submission["approval_status"] in {"approved", "conditional", "needs_revision"}
    assert submission["overall_score"] >= 85

    saved = client.get(f"/api/submissions/{submission['submission_id']}")
    assert saved.status_code == 200
    assert saved.json() == submission
    assert client.get("/api/submissions/unknown-submission").status_code == 404


def test_submission_rejects_empty_required_answer_and_unknown_mission(client):
    answers = _strong_cloud_answers()
    answers["hypothesis"] = "   "
    response = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": answers},
    )
    assert response.status_code == 422
    assert response.json()["detail"]["empty_fields"] == ["hypothesis"]

    unknown = client.post(
        "/api/submissions",
        json={"mission_id": "missing", "answers": {"answer": "text"}},
    )
    assert unknown.status_code == 404


def test_non_cloud_mission_rubrics_are_evaluated(client):
    swe_answers = {
        "bug_analysis": (
            "Stripe retried duplicate webhook evt_109283 after timeout. The findByStripeEventId pre-check "
            "was removed and stripe_event_id has no UNIQUE constraint; concurrent Promise.all handlers race."
        ),
        "fix_implementation": (
            "Add a UNIQUE constraint on stripe_event_id and use an atomic INSERT ON CONFLICT upsert keyed "
            "by the Stripe event ID for idempotency."
        ),
        "testing_plan": (
            "Dispatch two parallel webhooks with the same event ID; assert exactly one payment and one receipt."
        ),
        "customer_remediation": (
            "Run a read-only SELECT/GROUP BY audit query to isolate duplicate charges, then issue targeted, "
            "reviewed refunds with an audit log; do not mass refund."
        ),
    }
    swe = client.post("/api/submissions", json={"mission_id": "swe-01", "answers": swe_answers})
    assert swe.status_code == 201
    assert len(swe.json()["dimensions"]) == 4
    assert swe.json()["overall_score"] >= 85

    analyst_answers = {
        "executive_summary": (
            "BLUF for the VP of Growth: the pricing hypothesis is not supported; Desktop and Android are "
            "stable while only iOS v4.3 collapsed."
        ),
        "data_analysis": (
            "Desktop conversion was 5.2% to 5.3%, Android 4.4% to 4.3%, and iOS v4.3 fell from 4.6% to 0.4%."
        ),
        "immediate_recommendations": (
            "Mobile engineering should disable Apple Pay temporarily or ship a reviewed iOS hotfix with a fallback."
        ),
        "future_instrumentation": (
            "Add a checkout funnel and crash-rate alert, staged cohort rollout, and release-health guardrail."
        ),
    }
    analyst = client.post(
        "/api/submissions",
        json={"mission_id": "data-analyst-01", "answers": analyst_answers},
    )
    assert analyst.status_code == 201
    assert len(analyst.json()["dimensions"]) == 4
    assert all(0 <= dimension["score"] <= 100 for dimension in analyst.json()["dimensions"])
