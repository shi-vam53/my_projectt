"""Automated verification suite for Auth, Role Locking, Handbook, Quiz, and 40 Problems.
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
        database_path=tmp_path / "test-auth.sqlite3",
    )
    with TestClient(app) as test_client:
        yield test_client


def test_auth_registration_and_login_flow(client):
    # 1. Register new user
    reg_res = client.post(
        "/api/auth/register",
        json={"username": "alexdev", "password": "securepassword123", "full_name": "Alex Mercer"},
    )
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "token" in reg_data
    assert reg_data["user"]["username"] == "alexdev"
    assert reg_data["user"]["role"] is None
    assert reg_data["user"]["role_locked"] is False

    # 2. Login with credentials
    login_res = client.post(
        "/api/auth/login",
        json={"username": "alexdev", "password": "securepassword123"},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    token = login_data["token"]

    # 3. Verify /api/auth/me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["user"]["username"] == "alexdev"


def test_role_selection_and_permanent_lock(client):
    # Register user
    reg_res = client.post(
        "/api/auth/register",
        json={"username": "srejane", "password": "securepassword123", "full_name": "Jane SRE"},
    )
    token = reg_res.json()["token"]

    # Select role first time -> should succeed
    role_res = client.post(
        "/api/auth/select-role",
        headers={"Authorization": f"Bearer {token}"},
        json={"role": "cloud-sre"},
    )
    assert role_res.status_code == 200
    user_data = role_res.json()["user"]
    assert user_data["role"] == "cloud-sre"
    assert user_data["role_locked"] is True

    # Attempt to change role a second time -> MUST be rejected with 403 Forbidden!
    second_res = client.post(
        "/api/auth/select-role",
        headers={"Authorization": f"Bearer {token}"},
        json={"role": "backend-eng"},
    )
    assert second_res.status_code == 403
    assert "permanently locked" in second_res.json()["detail"].lower()


def test_handbook_download_and_pdf_endpoints(client):
    down_res = client.get("/api/handbook/download")
    assert down_res.status_code == 200
    assert down_res.headers.get("content-type") == "application/pdf"
    assert len(down_res.content) > 10000

    view_res = client.get("/api/handbook/pdf")
    assert view_res.status_code == 200
    assert view_res.headers.get("content-type") == "application/pdf"


def test_quiz_questions_and_submission(client):
    reg = client.post(
        "/api/auth/register",
        json={"username": "quizuser", "password": "password123", "full_name": "Quiz Learner"},
    )
    token = reg.json()["token"]

    # Get questions
    q_res = client.get("/api/quiz/questions")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) == 5

    # Submit passing answers (all 'b' are correct in our 5 questions)
    answers = {q["id"]: "b" for q in questions}
    sub_res = client.post(
        "/api/quiz/submit",
        headers={"Authorization": f"Bearer {token}"},
        json={"answers": answers},
    )
    assert sub_res.status_code == 200
    res_data = sub_res.json()
    assert res_data["score"] == 5
    assert res_data["passed"] is True


def test_problems_listing_and_submission(client):
    reg = client.post(
        "/api/auth/register",
        json={"username": "problemdev", "password": "password123", "full_name": "Problem Dev"},
    )
    token = reg.json()["token"]

    # List problems
    prob_res = client.get("/api/problems", headers={"Authorization": f"Bearer {token}"})
    assert prob_res.status_code == 200
    problems = prob_res.json()
    assert len(problems) == 40

    # Verify first 20 have help_statement, and 21-40 do NOT
    for p in problems[:20]:
        assert p["help_statement"] is not None
        assert p["phase"] == 1
    for p in problems[20:]:
        assert p["help_statement"] is None
        assert p["phase"] == 2

    # Submit solution for prob-01
    sol = """
    Exit code 137 indicates SIGKILL by the Linux OOM (Out Of Memory) killer because memory limits were exceeded.
    We need to increase Kubernetes resources.limits.memory and requests.memory with adequate buffers.
    """
    submit_res = client.post(
        "/api/problems/prob-01/submit",
        headers={"Authorization": f"Bearer {token}"},
        json={"solution": sol},
    )
    assert submit_res.status_code == 200
    sub_data = submit_res.json()
    assert sub_data["passed"] is True
    assert sub_data["status"] == "completed"
