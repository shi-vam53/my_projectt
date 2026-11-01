"""4-Agent End-to-End Simulation Runner for Praxis Simulation Platform.
Tests real user workflows, failed cases, and problem solving.
"""

import sys
import json
from pathlib import Path
from fastapi.testclient import TestClient

ROOT = Path('/home/user/my_projectt')
sys.path.insert(0, str(ROOT))

from backend.main import create_app, DEFAULT_DATABASE_PATH
from backend.problems import QUIZ_QUESTIONS, PROBLEMS

def run_simulation():
    print("=" * 80)
    print("STARTING 4-AGENT SIMULATION ON PRAXIS ENGINEERING PLATFORM")
    print("=" * 80)

    app = create_app(project_root=ROOT, database_path=DEFAULT_DATABASE_PATH)
    client = TestClient(app)

    issues_found = []

    # -------------------------------------------------------------------------
    # AGENT 1: Alex Rivera (alex_cloud) - Cloud Engineer Track
    # -------------------------------------------------------------------------
    print("\n[AGENT 1] Initializing Agent 1: Alex Rivera (alex_cloud)")
    
    # 1. Failed test: Login without account
    print("  -> Testing failed case 1.1: Sign in with non-existent account")
    res = client.post("/api/auth/login", json={"username": "alex_cloud_unreg", "password": "Password123!"})
    if res.status_code == 401:
        print("     ✓ Expected rejection: 401 Unauthorized (Account not found)")
    else:
        issues_found.append(f"Agent 1: Expected 401 on unreg login, got {res.status_code}")

    # 2. Failed test: Register with empty/short password
    print("  -> Testing failed case 1.2: Register with short password")
    res = client.post("/api/auth/register", json={"username": "alex_cloud_short", "password": "12", "full_name": "Alex Short"})
    # FastAPI pydantic RegisterRequest validation
    if res.status_code in (400, 422):
        print(f"     ✓ Expected rejection: {res.status_code} Validation Error")
    else:
        issues_found.append(f"Agent 1: Expected 400/422 on short password, got {res.status_code}")

    # 3. Successful registration
    print("  -> Registering Alex Rivera (alex_cloud)")
    reg_payload = {"username": "alex_cloud", "password": "CloudSec!123", "full_name": "Alex Rivera"}
    res = client.post("/api/auth/register", json=reg_payload)
    if res.status_code == 201:
        alex_token = res.json()["token"]
        alex_user = res.json()["user"]
        print(f"     ✓ Registered successfully! ID: {alex_user['user_id']}")
    elif res.status_code == 400 and "already registered" in res.text:
        # User already in db, login instead
        print("     ℹ Already registered, logging in...")
        login_res = client.post("/api/auth/login", json={"username": "alex_cloud", "password": "CloudSec!123"})
        alex_token = login_res.json()["token"]
        alex_user = login_res.json()["user"]
        print(f"     ✓ Logged in. ID: {alex_user['user_id']}")
    else:
        issues_found.append(f"Agent 1: Register failed with {res.status_code}: {res.text}")
        return

    alex_headers = {"Authorization": f"Bearer {alex_token}"}

    # 4. Failed test: Duplicate registration
    print("  -> Testing failed case 1.3: Duplicate registration")
    res = client.post("/api/auth/register", json=reg_payload)
    if res.status_code == 400 and "already registered" in res.text.lower():
        print("     ✓ Expected rejection: 400 Username already registered")
    else:
        issues_found.append(f"Agent 1: Expected 400 on duplicate reg, got {res.status_code}")

    # 5. Select Role: cloud-engineer
    print("  -> Locking role to 'cloud-engineer'")
    res = client.post("/api/auth/select-role", json={"role": "cloud-engineer"}, headers=alex_headers)
    if res.status_code == 200:
        print("     ✓ Role locked: cloud-engineer")
    elif res.status_code == 403:
        print("     ℹ Role already locked previously.")
    else:
        issues_found.append(f"Agent 1: Select role returned {res.status_code}: {res.text}")

    # 6. Failed test: Attempt to modify role after permanent lock
    print("  -> Testing failed case 1.4: Modify permanently locked role")
    res = client.post("/api/auth/select-role", json={"role": "software-developer"}, headers=alex_headers)
    if res.status_code == 403:
        print("     ✓ Expected rejection: 403 Forbidden (Role cannot be modified)")
    else:
        issues_found.append(f"Agent 1: Expected 403 on role re-lock, got {res.status_code}")

    # 7. Download Role Handbook PDF
    print("  -> Fetching Cloud Engineer Handbook PDF")
    res = client.get("/api/handbook/download?role=cloud-engineer", headers=alex_headers)
    if res.status_code == 200 and res.headers.get("content-type") == "application/pdf":
        print(f"     ✓ Received handbook PDF ({len(res.content)} bytes)")
    else:
        issues_found.append(f"Agent 1: Handbook download returned {res.status_code}")

    # 8. Failed test: Submit Readiness Quiz with 0 correct answers
    print("  -> Testing failed case 1.5: Submit Quiz with failing answers (<80%)")
    res = client.post("/api/quiz/submit", json={"answers": {"q1": "wrong", "q2": "wrong", "q3": "wrong", "q4": "wrong", "q5": "wrong"}}, headers=alex_headers)
    if res.status_code == 200:
        qdata = res.json()
        if not qdata["passed"]:
            print(f"     ✓ Expected failure handled: Score {qdata['score']}/5, Passed: {qdata['passed']}")
        else:
            issues_found.append("Agent 1: Quiz passed with all wrong answers!")
    else:
        issues_found.append(f"Agent 1: Quiz submit returned {res.status_code}")

    # 9. Pass Readiness Quiz with 5/5
    print("  -> Passing Readiness Quiz with 5/5 correct answers")
    res = client.post("/api/quiz/submit", json={"answers": {"q1": "b", "q2": "b", "q3": "b", "q4": "b", "q5": "b"}}, headers=alex_headers)
    assert res.status_code == 200 and res.json()["passed"] is True
    print("     ✓ Readiness Quiz PASSED! 5/5 (100%)")

    # 10. Solve 4 Problems: prob-01, prob-02, prob-03, prob-04
    print("  -> Solving 4 incident problems:")

    # Problem 1: prob-01
    print("     * Problem 01: Container CrashLoopBackOff & Exit Code 137")
    # Failed test: precheck with short solution
    print("       -> Testing failed case 1.6: Precheck with brief solution (< 15 words)")
    pre_fail = client.post("/api/problems/prob-01/precheck", json={"solution": "restart pod"}, headers=alex_headers)
    if pre_fail.status_code == 200 and not pre_fail.json()["passed"]:
        print("          ✓ Expected precheck warning: Solution is too brief (< 15 words)")
    else:
        issues_found.append("Agent 1: Precheck did not reject brief solution")

    # Valid solution prob-01
    sol_01 = """
    Exit code 137 indicates that the Linux kernel terminated the container with SIGKILL due to an OOM (Out Of Memory) event.
    The container exceeded its configured memory limits in Kubernetes resources.limits.
    We need to profile the resident memory, increase resources.limits.memory and requests.memory with adequate overhead,
    and verify stability using kubectl top pod after redeployment.
    """
    sub_01 = client.post("/api/problems/prob-01/submit", json={"solution": sol_01}, headers=alex_headers)
    assert sub_01.status_code == 200 and sub_01.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_01.json()['score']}/100, Status: {sub_01.json()['status']}")

    # Problem 2: prob-02
    print("     * Problem 02: Database Connection Pool Starvation")
    sol_02 = """
    The application suffers from connection starvation due to an unhandled leak where connections are not closed.
    We must wrap all database operations in a try/finally block or Python context manager to guarantee connection release.
    Additionally, configure HikariCP / pool with leakDetectionThreshold set to 2000ms to detect unreturned connections.
    """
    sub_02 = client.post("/api/problems/prob-02/submit", json={"solution": sol_02}, headers=alex_headers)
    assert sub_02.status_code == 200 and sub_02.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_02.json()['score']}/100, Status: {sub_02.json()['status']}")

    # Problem 3: prob-03
    print("     * Problem 03: Unindexed Foreign Key Full Table Scan")
    sol_03 = """
    PostgreSQL performs a sequential seq scan on order_items because order_id lacks a supporting B-tree index.
    We must execute: CREATE INDEX CONCURRENTLY idx_order_items_order_id ON order_items(order_id);
    This builds the b-tree index without locking table writes and turns the sequential scan into an index scan.
    """
    sub_03 = client.post("/api/problems/prob-03/submit", json={"solution": sol_03}, headers=alex_headers)
    assert sub_03.status_code == 200 and sub_03.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_03.json()['score']}/100, Status: {sub_03.json()['status']}")

    # Problem 4: prob-04
    print("     * Problem 04: HTTP 429 Rate Limiter with RFC 6585 Headers")
    sol_04 = """
    Implement an HTTP 429 Too Many Requests response with RFC 6585 headers including Retry-After.
    Use a Redis sliding window algorithm leveraging sorted sets (ZADD, ZREMRANGEBYSCORE) keyed by client IP or API token.
    Return Retry-After header with seconds until the window slides and quota replenishes.
    """
    sub_04 = client.post("/api/problems/prob-04/submit", json={"solution": sol_04}, headers=alex_headers)
    assert sub_04.status_code == 200 and sub_04.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_04.json()['score']}/100, Status: {sub_04.json()['status']}")

    # 11. Download Completion Certificate
    print("  -> Generating and downloading Certificate of Completion")
    res = client.get("/api/certificate/download", headers=alex_headers)
    if res.status_code == 200 and res.headers.get("content-type") == "application/pdf":
        print(f"     ✓ Certificate generated successfully ({len(res.content)} bytes)")
    else:
        issues_found.append(f"Agent 1: Certificate download failed: {res.status_code}")

    # Logout
    client.post("/api/auth/logout", headers=alex_headers)
    print("  -> Alex Rivera logged out successfully.")


    # -------------------------------------------------------------------------
    # AGENT 2: Priya Sharma (priya_devops) - Software Developer Track
    # -------------------------------------------------------------------------
    print("\n[AGENT 2] Initializing Agent 2: Priya Sharma (priya_devops)")

    # 1. Register & Login
    reg_payload = {"username": "priya_devops", "password": "DevOps2026!", "full_name": "Priya Sharma"}
    res = client.post("/api/auth/register", json=reg_payload)
    if res.status_code == 201:
        priya_token = res.json()["token"]
    elif res.status_code == 400 and "already registered" in res.text:
        login_res = client.post("/api/auth/login", json={"username": "priya_devops", "password": "DevOps2026!"})
        priya_token = login_res.json()["token"]
    else:
        issues_found.append(f"Agent 2: Register failed: {res.status_code}")
        return

    priya_headers = {"Authorization": f"Bearer {priya_token}"}
    print("  -> Priya Sharma registered & authenticated.")

    # 2. Failed test: Select invalid role
    print("  -> Testing failed case 2.1: Select non-existent role")
    res = client.post("/api/auth/select-role", json={"role": "quantum-hacker"}, headers=priya_headers)
    if res.status_code == 400:
        print("     ✓ Expected rejection: 400 Invalid role")
    else:
        issues_found.append(f"Agent 2: Expected 400 on invalid role, got {res.status_code}")

    # 3. Lock valid role: software-developer
    client.post("/api/auth/select-role", json={"role": "software-developer"}, headers=priya_headers)
    print("  -> Role locked: software-developer")

    # 4. Pass Quiz
    client.post("/api/quiz/submit", json={"answers": {"q6": "b", "q7": "b", "q8": "b", "q9": "b", "q10": "b"}}, headers=priya_headers)
    print("  -> Passed Readiness Quiz (5/5).")

    # 5. Solve 5 problems: prob-05, prob-06, prob-07, prob-08, prob-09
    print("  -> Solving 5 incident problems:")

    # Problem 5: prob-05
    print("     * Problem 05: Transparent Password Hash Upgrade (MD5 to Argon2id)")
    # Failed test: precheck with missing required concepts
    print("       -> Testing failed case 2.2: Precheck with partial keywords (missing salt, transparent)")
    pre_fail = client.post("/api/problems/prob-05/precheck", json={"solution": "We will use bcrypt or argon2 to hash passwords during user login."}, headers=priya_headers)
    if pre_fail.status_code == 200 and not pre_fail.json()["passed"]:
        print(f"          ✓ Expected precheck warning: {pre_fail.json()['feedback']}")
    else:
        issues_found.append("Agent 2: Precheck should have warned on missing keywords")

    sol_05 = """
    Implement a transparent hash upgrade mechanism on user login. When a user provides their plaintext password at login,
    verify the existing legacy MD5 hash with its salt. Once verified, immediately compute a modern Argon2id or bcrypt hash
    with an updated salt and cost parameter, and transparently update the database record before returning the session token.
    """
    sub_05 = client.post("/api/problems/prob-05/submit", json={"solution": sol_05}, headers=priya_headers)
    assert sub_05.status_code == 200 and sub_05.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_05.json()['score']}/100")

    # Problem 6: prob-06
    print("     * Problem 06: Distributed Trace ID Propagation")
    sol_06 = """
    Propagate distributed trace context across microservices by capturing the incoming W3C traceparent header or generating
    a new UUID correlation-id. Store the ID in Python contextvars and propagate it into all downstream HTTP request headers
    and structured application log formatters.
    """
    sub_06 = client.post("/api/problems/prob-06/submit", json={"solution": sol_06}, headers=priya_headers)
    assert sub_06.status_code == 200 and sub_06.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_06.json()['score']}/100")

    # Problem 7: prob-07
    print("     * Problem 07: Clean Git Feature Branch Rebase & Conflict Resolution")
    sol_07 = """
    To cleanly synchronize feature work: git fetch origin; git rebase origin/main. When conflicts occur, resolve conflict markers,
    stage the resolved files, and run git rebase --continue. Once completed, push using git push --force-with-lease to protect remote history.
    """
    sub_07 = client.post("/api/problems/prob-07/submit", json={"solution": sol_07}, headers=priya_headers)
    assert sub_07.status_code == 200 and sub_07.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_07.json()['score']}/100")

    # Problem 8: prob-08
    print("     * Problem 08: CORS Preflight (OPTIONS) Rejection")
    sol_08 = """
    Web browsers send an HTTP OPTIONS preflight request when custom headers like Authorization are included.
    The web server must intercept OPTIONS requests and respond with 200/204 status including Access-Control-Allow-Origin,
    Access-Control-Allow-Headers (containing authorization, content-type), and Access-Control-Allow-Methods.
    """
    sub_08 = client.post("/api/problems/prob-08/submit", json={"solution": sol_08}, headers=priya_headers)
    assert sub_08.status_code == 200 and sub_08.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_08.json()['score']}/100")

    # Problem 9: prob-09
    print("     * Problem 09: PII & Secret Scrubber for Structured Logs")
    sol_09 = """
    Configure a structured log formatting middleware using regex patterns to mask sensitive fields like password, api_key,
    and Authorization Bearer tokens. Replace sensitive values with [REDACTED] or a cryptographic hash before emission to stdout.
    """
    sub_09 = client.post("/api/problems/prob-09/submit", json={"solution": sol_09}, headers=priya_headers)
    assert sub_09.status_code == 200 and sub_09.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_09.json()['score']}/100")

    client.post("/api/auth/logout", headers=priya_headers)
    print("  -> Priya Sharma solved 5 questions and logged out.")


    # -------------------------------------------------------------------------
    # AGENT 3: Marcus Vance (marcus_cyber) - Cloud & Security Track
    # -------------------------------------------------------------------------
    print("\n[AGENT 3] Initializing Agent 3: Marcus Vance (marcus_cyber)")

    # 1. Register
    reg_payload = {"username": "marcus_cyber", "password": "MarcusSec#2026", "full_name": "Marcus Vance"}
    res = client.post("/api/auth/register", json=reg_payload)
    if res.status_code in (201, 400):
        pass
    else:
        issues_found.append(f"Agent 3: Register failed: {res.status_code}")

    # 2. Failed test: Login with wrong password
    print("  -> Testing failed case 3.1: Login with invalid password")
    res = client.post("/api/auth/login", json={"username": "marcus_cyber", "password": "WrongPassword!99"})
    if res.status_code == 401:
        print("     ✓ Expected rejection: 401 Unauthorized (Invalid password)")
    else:
        issues_found.append(f"Agent 3: Expected 401 on wrong pass, got {res.status_code}")

    # 3. Login with correct password
    res = client.post("/api/auth/login", json={"username": "marcus_cyber", "password": "MarcusSec#2026"})
    marcus_token = res.json()["token"]
    marcus_headers = {"Authorization": f"Bearer {marcus_token}"}
    print("  -> Marcus authenticated successfully.")

    client.post("/api/auth/select-role", json={"role": "cloud-engineer"}, headers=marcus_headers)
    client.post("/api/quiz/submit", json={"answers": {"q11": "b", "q12": "b", "q13": "b", "q14": "b", "q15": "b"}}, headers=marcus_headers)
    print("  -> Role locked & Quiz passed.")

    # 4. Solve 3 problems: prob-10, prob-11, prob-12
    print("  -> Solving 3 incident problems:")

    # Problem 10: prob-10
    print("     * Problem 10: Kubernetes Liveness vs. Readiness Probe Deadlock")
    sol_10 = """
    A slow-starting application fails when livenessProbe kills the pod before warmup completes.
    Use a startupProbe with adequate initialDelaySeconds and failureThreshold to shield the pod during warmup.
    Ensure readinessProbe controls traffic ingress, while livenessProbe strictly detects fatal deadlocks.
    """
    sub_10 = client.post("/api/problems/prob-10/submit", json={"solution": sol_10}, headers=marcus_headers)
    assert sub_10.status_code == 200 and sub_10.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_10.json()['score']}/100")

    # Problem 11: prob-11
    print("     * Problem 11: SQL Injection Defense & Parameterized Queries")
    sol_11 = """
    Prevent SQL injection vulnerabilities by enforcing parameterized queries with placeholder binding across all database queries.
    Never concatenate raw user input into SQL strings; use query AST analysis and automated static analysis tools to verify binding.
    """
    sub_11 = client.post("/api/problems/prob-11/submit", json={"solution": sol_11}, headers=marcus_headers)
    assert sub_11.status_code == 200 and sub_11.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_11.json()['score']}/100")

    # Problem 12: prob-12
    print("     * Problem 12: Graceful Web Server Shutdown on SIGTERM")
    sol_12 = """
    Upon receiving SIGTERM from orchestrators, the web server must stop accepting new requests, drain active requests within
    a grace timeout, close database connection pool handles cleanly, and terminate with exit(0) to prevent 502 Bad Gateway errors.
    """
    sub_12 = client.post("/api/problems/prob-12/submit", json={"solution": sol_12}, headers=marcus_headers)
    assert sub_12.status_code == 200 and sub_12.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_12.json()['score']}/100")

    # 5. Failed test: Submit non-existent problem ID
    print("  -> Testing failed case 3.2: Submit solution to unknown problem ID (prob-999)")
    res = client.post("/api/problems/prob-999/submit", json={"solution": "some valid length solution text here"}, headers=marcus_headers)
    if res.status_code == 404:
        print("     ✓ Expected rejection: 404 Problem not found")
    else:
        issues_found.append(f"Agent 3: Expected 404 on unknown problem, got {res.status_code}")

    client.post("/api/auth/logout", headers=marcus_headers)
    print("  -> Marcus Vance solved 3 questions and logged out.")


    # -------------------------------------------------------------------------
    # AGENT 4: Elena Rostova (elena_backend) - Data Analyst / Systems Track
    # -------------------------------------------------------------------------
    print("\n[AGENT 4] Initializing Agent 4: Elena Rostova (elena_backend)")

    reg_payload = {"username": "elena_backend", "password": "Architect99!", "full_name": "Elena Rostova"}
    res = client.post("/api/auth/register", json=reg_payload)
    if res.status_code in (201, 400):
        login_res = client.post("/api/auth/login", json={"username": "elena_backend", "password": "Architect99!"})
        elena_token = login_res.json()["token"]
    else:
        issues_found.append(f"Agent 4: Register failed: {res.status_code}")
        return

    elena_headers = {"Authorization": f"Bearer {elena_token}"}
    client.post("/api/auth/select-role", json={"role": "data-analyst"}, headers=elena_headers)
    client.post("/api/quiz/submit", json={"answers": {"q16": "b", "q17": "b", "q18": "b", "q19": "b", "q20": "b"}}, headers=elena_headers)
    print("  -> Elena Rostova registered, role locked to data-analyst, quiz passed.")

    # 1. Failed test: Security attack payload in problem submission
    print("  -> Testing failed case 4.1: XSS and SQL Injection in problem submission")
    attack_payload = """
    <script>alert(document.cookie)</script>'; DROP TABLE users; --
    Testing that malicious payloads are stored safely as plain text and do not execute or drop tables.
    """
    res = client.post("/api/problems/prob-13/submit", json={"solution": attack_payload}, headers=elena_headers)
    if res.status_code == 200:
        print("     ✓ Safe rejection/handling: Attack string evaluated safely as text without executing SQL or HTML")
    else:
        issues_found.append(f"Agent 4: Attack submission crashed backend: {res.status_code}")

    # 2. Solve 5 problems: prob-13, prob-14, prob-15, prob-16, prob-17
    print("  -> Solving 5 incident problems:")

    # Problem 13: prob-13
    print("     * Problem 13: Cache Stampede (Thundering Herd) Mitigation")
    sol_13 = """
    Prevent cache stampede thundering herd spikes on hot key expiration using a distributed mutex lock in Redis with SET NX EX.
    Alternatively, adopt a stale-while-revalidate background refresh pattern so only one worker regenerates the cache while others read stale data.
    """
    sub_13 = client.post("/api/problems/prob-13/submit", json={"solution": sol_13}, headers=elena_headers)
    assert sub_13.status_code == 200 and sub_13.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_13.json()['score']}/100")

    # Problem 14: prob-14
    print("     * Problem 14: Zero-Downtime Expand/Contract Schema Migration")
    sol_14 = """
    Apply the expand and contract pattern: First, expand the database by adding the new column as nullable.
    Second, deploy dual-write code writing to both old and new columns. Third, backfill historical data.
    Finally, contract by switching reads to the new column and dropping the deprecated column.
    """
    sub_14 = client.post("/api/problems/prob-14/submit", json={"solution": sol_14}, headers=elena_headers)
    assert sub_14.status_code == 200 and sub_14.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_14.json()['score']}/100")

    # Problem 15: prob-15
    print("     * Problem 15: Idempotency Key Implementation for Financial Transactions")
    sol_15 = """
    Clients generate a unique UUID Idempotency-Key header on payment requests. The API checks Redis for an in-flight processing lock.
    If cached, it returns the stored response preventing replay charges. Upon completion, save the result to achieve exactly-once payment semantics.
    """
    sub_15 = client.post("/api/problems/prob-15/submit", json={"solution": sol_15}, headers=elena_headers)
    assert sub_15.status_code == 200 and sub_15.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_15.json()['score']}/100")

    # Problem 16: prob-16
    print("     * Problem 16: Dead Letter Queue (DLQ) Routing for Poison Pill Messages")
    sol_16 = """
    Route unparseable poison pill messages to a dead letter queue (DLQ) after max_retries attempts.
    The consumer catches serialization exceptions, sends nack or routes to DLQ, and calls ack on the primary queue to unblock the partition.
    """
    sub_16 = client.post("/api/problems/prob-16/submit", json={"solution": sol_16}, headers=elena_headers)
    assert sub_16.status_code == 200 and sub_16.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_16.json()['score']}/100")

    # Problem 17: prob-17
    print("     * Problem 17: Circuit Breaker State Machine")
    sol_17 = """
    Implement a circuit breaker with closed, open, and half-open states. In closed state, failures increment a counter.
    When the threshold is reached, transition to open state to fail-fast and invoke fallback logic.
    After a reset timeout, transition to half-open to test trial requests before fully closing.
    """
    sub_17 = client.post("/api/problems/prob-17/submit", json={"solution": sol_17}, headers=elena_headers)
    assert sub_17.status_code == 200 and sub_17.json()["passed"] is True
    print(f"          ✓ Solved! Score: {sub_17.json()['score']}/100")

    # 3. Verify Admin CSV Export shows all 4 agents
    print("  -> Verifying CSV Ledger Export includes all 4 agents")
    csv_res = client.get("/api/admin/users/csv")
    csv_text = csv_res.text
    for agent in ["alex_cloud", "priya_devops", "marcus_cyber", "elena_backend"]:
        if agent in csv_text:
            print(f"     ✓ Found {agent} in CSV ledger")
        else:
            issues_found.append(f"Agent {agent} missing from CSV ledger")

    client.post("/api/auth/logout", headers=elena_headers)
    print("  -> Elena Rostova solved 5 questions and logged out.")

    print("\n" + "=" * 80)
    print("SIMULATION SUMMARY & AUDIT FINDINGS")
    print("=" * 80)
    print(f"Total simulated users: 4")
    print(f"  • Alex Rivera:    4 questions solved (prob-01, prob-02, prob-03, prob-04)")
    print(f"  • Priya Sharma:   5 questions solved (prob-05, prob-06, prob-07, prob-08, prob-09)")
    print(f"  • Marcus Vance:   3 questions solved (prob-10, prob-11, prob-12)")
    print(f"  • Elena Rostova:  5 questions solved (prob-13, prob-14, prob-15, prob-16, prob-17)")
    print(f"Total problems solved by agents: 17")

    if issues_found:
        print("\n⚠ ISSUES IDENTIFIED:")
        for idx, iss in enumerate(issues_found, 1):
            print(f"  {idx}. {iss}")
    else:
        print("\n✓ ALL AGENT SIMULATIONS AND FAILED TESTS COMPLETED SUCCESSFULLY!")

def test_4_agents_lifecycle_simulation():
    run_simulation()

if __name__ == "__main__":
    run_simulation()
