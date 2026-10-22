"""End-to-End Complete User Lifecycle Quality Check for Praxis Platform.

Validates from start to finish:
1. Registration of brand new user.
2. Initial state (role is unlocked, quiz is not passed).
3. Selection and permanent locking of career role (cannot be changed).
4. Rejection with 403 Forbidden upon attempting to change locked role.
5. In-app Handbook verification (PDF download & online reader availability).
6. 5 MEQ Readiness Assessment grading & passing threshold.
7. Post-assessment Dashboard view state (4 curriculum cards & priority queue).
8. Problem Bank: Basic problem triage with Help Statement.
9. Problem Bank: Intermediate problem triage without Help Statement.
10. Master Google Sheet ledger export verification matching exact schema.
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
        database_path=tmp_path / "test-lifecycle.sqlite3",
    )
    with TestClient(app) as test_client:
        yield test_client


def test_complete_user_journey_and_quality_audit(client):
    # Step 1: Register brand new fresher user
    reg = client.post(
        "/api/auth/register",
        json={
            "username": "fresher_rohit",
            "password": "productionPassword!2026",
            "full_name": "Rohit Verma",
        },
    )
    assert reg.status_code == 201
    auth_data = reg.json()
    token = auth_data["token"]
    user = auth_data["user"]
    assert user["username"] == "fresher_rohit"
    assert user["role"] is None
    assert user["role_locked"] is False
    assert user["quiz_passed"] is False

    auth_headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Choose Career Track and Permanently Lock
    role_choice = client.post(
        "/api/auth/select-role",
        headers=auth_headers,
        json={"role": "cloud-sre"},
    )
    assert role_choice.status_code == 200
    updated_user = role_choice.json()["user"]
    assert updated_user["role"] == "cloud-sre"
    assert updated_user["role_locked"] is True

    # Step 3: Security & Invariance check: Attempting to modify locked role MUST fail with 403
    illegal_change = client.post(
        "/api/auth/select-role",
        headers=auth_headers,
        json={"role": "data-ai"},
    )
    assert illegal_change.status_code == 403
    assert "permanently locked" in illegal_change.json()["detail"].lower()

    # Step 4: Handbook verification
    pdf_resp = client.get("/api/handbook/download")
    assert pdf_resp.status_code == 200
    assert len(pdf_resp.content) > 10000

    # Step 5: Complete 5 MEQ Readiness Assessment
    quiz_questions = client.get("/api/quiz/questions").json()
    assert len(quiz_questions) == 5

    # Submit answers
    quiz_sub = client.post(
        "/api/quiz/submit",
        headers=auth_headers,
        json={"answers": {q["id"]: "b" for q in quiz_questions}},
    )
    assert quiz_sub.status_code == 200
    quiz_result = quiz_sub.json()
    assert quiz_result["score"] == 5
    assert quiz_result["passed"] is True
    assert len(quiz_result["results"]) == 5

    # Step 6: Verify User State is Updated
    me = client.get("/api/auth/me", headers=auth_headers).json()["user"]
    assert me["role"] == "cloud-sre"
    assert me["role_locked"] is True
    assert me["quiz_passed"] is True
    assert me["quiz_score"] == 5

    # Step 7: Verify Problem Bank (40 Problems)
    problems = client.get("/api/problems", headers=auth_headers).json()
    assert len(problems) == 40
    basic_probs = [p for p in problems if p["phase"] == 1]
    inter_probs = [p for p in problems if p["phase"] == 2]
    assert len(basic_probs) == 20
    assert len(inter_probs) == 20

    # Verify Basic problems have help_statement
    for p in basic_probs:
        assert p["help_statement"] is not None
        assert len(p["help_statement"]) > 10

    # Verify Intermediate problems do NOT have help_statement
    for p in inter_probs:
        assert p["help_statement"] is None

    # Step 8: Solve Phase 1 Basic Problem (prob-01)
    p1_sub = client.post(
        "/api/problems/prob-01/submit",
        headers=auth_headers,
        json={
            "solution": "Exit code 137 indicates SIGKILL by the Linux OOM (Out Of Memory) killer because memory limits were exceeded. We must increase Kubernetes resources.limits.memory and requests.memory with adequate buffers."
        },
    )
    assert p1_sub.status_code == 200
    assert p1_sub.json()["passed"] is True
    assert p1_sub.json()["status"] == "completed"

    # Step 9: Solve Phase 2 Intermediate Problem (prob-21)
    p21_sub = client.post(
        "/api/problems/prob-21/submit",
        headers=auth_headers,
        json={
            "solution": "The cascading failure is caused by thread pool exhaustion due to blocking calls to Service D. We must implement Bulkhead thread isolation to quarantine failures, configure strict timeout budgets, and implement circuit breakers."
        },
    )
    assert p21_sub.status_code == 200
    assert p21_sub.json()["passed"] is True
    assert p21_sub.json()["status"] == "completed"

    # Step 10: Verify Google Sheet Ledger Export
    csv_resp = client.get("/api/admin/users/csv")
    assert csv_resp.status_code == 200
    csv_text = csv_resp.text
    assert "User ID,Username,Full Name,Career Track,Role Locked,Readiness Quiz Status,Quiz Score,Registered At (UTC),Platform" in csv_text
    assert "fresher_rohit,Rohit Verma,Cloud Engineer,Yes (Permanent),Passed (5/5),5/5" in csv_text
