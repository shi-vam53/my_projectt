"""Security & Vulnerability Penetration Test Suite for Praxis Platform.

Covers:
- SQL Injection vectors (SQLi)
- Directory & Path Traversal vectors (LFI/Path Traversal)
- Stored & Reflected Cross-Site Scripting (XSS)
- Input Validation & Payload Size Floods
- HTTP Security Headers Verification
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
        database_path=tmp_path / "test-security.sqlite3",
    )
    with TestClient(app) as test_client:
        yield test_client


def _valid_cloud_answers():
    return {
        "incident_timeline": "14:10 UTC deploy completed; 14:13 UTC HikariPool connection timeout; 14:15 UTC 504 errors.",
        "hypothesis": "Facts: HikariPool connection pool exhausted at 100 connections due to sync audit logging in v2.4.0. Assumptions: DB disk I/O.",
        "safe_mitigation_plan": "Helm rollback to release-v2.3.9 or set ENABLE_SYNC_AUDIT_LOG=false per Runbook SOP.",
        "verification_steps": "Monitor p99 latency < 120ms and 5xx error rate < 0.02% for 20 minutes.",
        "follow_up_improvement": "Decouple regulatory audit logging asynchronously using Kafka/SQS worker queues.",
    }


# ==============================================================================
# 1. SQL INJECTION (SQLi) PENETRATION TESTS
# ==============================================================================

@pytest.mark.parametrize("payload", [
    "' OR '1'='1",
    "'; DROP TABLE submissions; --",
    "' UNION SELECT 'admin', 'password', '1', '2', '3' --",
    "1' OR 1=1 #",
    "admin'--",
    "1'; EXEC xp_cmdshell('dir');--",
])
def test_sqli_in_submission_id_does_not_leak_or_crash(client, payload):
    """Verify parameterized queries neutralize SQL injection attempts in submission lookups."""
    res = client.get(f"/api/submissions/{payload}")
    # Must fail safely with 400 (rejected by format validator) or 404 (not found)
    assert res.status_code in {400, 404}


def test_sqli_in_answers_payload_is_treated_as_plain_text(client):
    """Verify malicious SQL payloads inside answer fields do not execute SQL commands."""
    answers = _valid_cloud_answers()
    answers["hypothesis"] = "'; DROP TABLE submissions; SELECT * FROM submissions WHERE '1'='1"

    post_res = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": answers},
    )
    assert post_res.status_code == 201
    data = post_res.json()
    submission_id = data["submission_id"]

    # Verify table was NOT dropped and data is retrieved cleanly
    get_res = client.get(f"/api/submissions/{submission_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["answers"]["hypothesis"] == answers["hypothesis"]


# ==============================================================================
# 2. PATH TRAVERSAL / LFI PENETRATION TESTS
# ==============================================================================

@pytest.mark.parametrize("traversal_path", [
    "../../../../etc/passwd",
    "..%2F..%2F..%2Fetc%2Fpasswd",
    "....//....//etc/passwd",
    "tracks/../../etc/shadow",
    "cloud-engineer/../../../etc/passwd",
])
def test_path_traversal_in_track_and_mission_ids_blocked(client, traversal_path):
    """Verify regex pattern check blocks path traversal and directory escape attempts."""
    track_res = client.get(f"/api/tracks/{traversal_path}")
    assert track_res.status_code == 404

    mission_res = client.get(f"/api/missions/{traversal_path}")
    assert mission_res.status_code == 404


# ==============================================================================
# 3. CROSS-SITE SCRIPTING (XSS) STORAGE TESTS
# ==============================================================================

def test_xss_polyglots_stored_verbatim_without_server_side_execution(client):
    """Verify script injection payloads are stored verbatim without server-side execution."""
    xss_payload = "<script>alert('XSS')</script><img src=x onerror=alert(1)>"
    answers = _valid_cloud_answers()
    answers["follow_up_improvement"] = xss_payload

    post_res = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": answers},
    )
    assert post_res.status_code == 201
    submission_id = post_res.json()["submission_id"]

    get_res = client.get(f"/api/submissions/{submission_id}")
    assert get_res.status_code == 200
    assert get_res.json()["answers"]["follow_up_improvement"] == xss_payload


# ==============================================================================
# 4. INPUT VALIDATION & PAYLOAD FLOOD GUARDRAILS
# ==============================================================================

def test_oversized_answer_field_rejected(client):
    """Verify answer fields exceeding 30,000 characters are rejected with 422 Unprocessable Entity."""
    answers = _valid_cloud_answers()
    answers["hypothesis"] = "A" * 35000  # 35KB in single field

    res = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": answers},
    )
    assert res.status_code == 422
    assert "exceeds maximum allowed length" in res.json()["detail"]


def test_invalid_mission_id_format_rejected(client):
    """Verify invalid mission IDs containing special symbols are rejected by schema."""
    answers = _valid_cloud_answers()
    res = client.post(
        "/api/submissions",
        json={"mission_id": "cloud<script>", "answers": answers},
    )
    assert res.status_code == 422


def test_invalid_reviewer_status_rejected(client):
    """Verify review status only accepts permitted whitelist values."""
    # First create valid submission
    answers = _valid_cloud_answers()
    sub_res = client.post(
        "/api/submissions",
        json={"mission_id": "cloud-sre-01", "answers": answers},
    )
    sub_id = sub_res.json()["submission_id"]

    # Try invalid status
    invalid_patch = client.patch(
        f"/api/submissions/{sub_id}/review",
        json={"status": "malicious_status_injection", "notes": "note"},
    )
    assert invalid_patch.status_code == 422


# ==============================================================================
# 5. HTTP SECURITY HEADERS VERIFICATION
# ==============================================================================

def test_http_security_headers_present(client):
    """Verify essential security headers are set on all responses."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "SAMEORIGIN"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"
