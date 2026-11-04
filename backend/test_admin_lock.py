"""Test admin panel locking and authorized access for user shivam / password shivam."""

from fastapi.testclient import TestClient
import pytest
from backend.main import create_app


@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)


def test_admin_panel_authentication_and_lock(client):
    # 1. Non-admin user cannot access admin login
    res_fail_user = client.post("/api/admin/login", json={"username": "maya_lin", "password": "password123"})
    assert res_fail_user.status_code == 401
    assert "Invalid administrator credentials" in res_fail_user.json()["detail"]

    # 2. Wrong password for shivam is rejected
    res_fail_pwd = client.post("/api/admin/login", json={"username": "shivam", "password": "wrongpassword"})
    assert res_fail_pwd.status_code == 401
    assert "Invalid administrator credentials" in res_fail_pwd.json()["detail"]

    # 3. Authorized admin user shivam / shivam succeeds
    res_ok = client.post("/api/admin/login", json={"username": "shivam", "password": "shivam"})
    assert res_ok.status_code == 200
    data = res_ok.json()
    assert data["user"]["username"] == "shivam"
    assert data["user"]["is_admin"] is True
    assert "token" in data

    # 4. Standard auth login as shivam / shivam also yields is_admin = True
    res_auth = client.post("/api/auth/login", json={"username": "shivam", "password": "shivam"})
    assert res_auth.status_code == 200
    assert res_auth.json()["user"]["is_admin"] is True

    # 5. Regular registered user has is_admin = False
    reg_user = client.post("/api/auth/register", json={"username": "candidate_jane", "password": "password123", "full_name": "Jane Doe"})
    if reg_user.status_code == 201:
        assert reg_user.json()["user"]["is_admin"] is False


def test_no_api_keys_leaked_in_endpoints(client):
    # Ensure health, roles, and info endpoints never leak any secret API keys
    for ep in ["/health", "/api/roles", "/api/admin/google-sheet"]:
        res = client.get(ep)
        body = res.text
        assert "gsk_" not in body
        assert "eyJhbGci" not in body
        assert "sb_publishable" not in body
