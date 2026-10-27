# Praxis | Practical Workplace Simulation Platform

[![Live on GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://shi-vam53.github.io/my_projectt/)
[![Python 3.13](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python)](https://fastapi.tiangolo.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Tests Passing](https://img.shields.io/badge/Tests-30%2F30%20Passing-brightgreen?style=for-the-badge&logo=pytest)](./backend)
[![ReportLab 12p PDF](https://img.shields.io/badge/Handbook-12%20Pages%20PDF-indigo?style=for-the-badge)](./docs/assets)

---

## ⚡ Quick 10-Line Overview: What is Praxis?

1. **Praxis** is a complete, practical engineering work simulation platform that trains graduates and freshers on real workplace problems instead of abstract coding puzzles.
2. Learners start through an **authentication gate** (sign up or login) where individual sessions, scores, and problem attempts are saved.
3. Learners select one of **3 Career Tracks** (Software Developer, Cloud Engineer, or Data Analyst), which is permanently locked on their profile to simulate joining a company engineering squad.
4. Each track delivers a publication-grade **12-page role-specific PDF handbook** and in-app reader covering agile ceremonies, system architecture, Git hygiene, CI/CD, and 40 industry terms.
5. Learners take a **5-question readiness assessment (MEQs)** with immediate score calculations, percentage ratings, and detailed explanations for every option.
6. Passing (≥ 80%) unlocks the **Learner Operations Dashboard**, featuring progress metrics, 4 structured curriculum cards, and an "Up Next" priority queue.
7. Learners tackle **40 production problems**: the first **20 Basic Problems** include reference/help statements with syntax and runbook SOPs, followed by **20 Intermediate Problems** without help statements for autonomous problem-solving.
8. The platform also offers **210 simulation missions** (60 guided missions with step-by-step logs, metrics, and runbooks + 150 independent incident labs).
9. Learners complete structured 5-field engineering handoff reports and receive **automated rubric-based evaluations** with scores, strengths, and targeted improvement notes.
10. The platform is **live on GitHub Pages** with instant browser execution (`localStorage`), and connects to a **FastAPI + SQLite backend** with automatic Google Sheet registration synchronization.

🌐 **Live Website URL:** [https://shi-vam53.github.io/my_projectt/](https://shi-vam53.github.io/my_projectt/)

---

## 🚀 The Staged Learner Lifecycle

Praxis enforces a disciplined, realistic engineering onboarding progression:

```
┌─────────────────────────┐
│  1. Learner Auth Gate   │ ➔ Sign Up or Login with password hashing & session management
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 2. Career Track Choice  │ ➔ Software Developer, Cloud Engineer, or Data Analyst (Permanently Locked)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 3. 12-Page Role Manual  │ ➔ Publication-quality ReportLab PDF download & in-app interactive reader
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 4. 5 MEQ Knowledge Test │ ➔ 5 multiple-choice questions on industry practices (≥ 80% passing gate)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 5. Operations Dashboard │ ➔ Track badge, progress counters, 4 curriculum cards, priority queue
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 6. 40 Real Problems     │ ➔ Phase 1: 20 Basic (with Help) ➔ Phase 2: 20 Intermediate (without Help)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 7. 210 Incident Labs    │ ➔ 60 Guided (20/track) + 150 Independent missions with rubric feedback
└─────────────────────────┘
```

---

## 💼 The 3 Career Tracks

Learners choose one of three tracks during onboarding. Once selected, the track is permanently locked to simulate realistic team ownership:

### 1. Software Developer (`software-developer`)
* **Focus:** Full-Stack & Backend Systems Architecture, API Design, Data Modeling, Concurrency, and CI/CD Automation.
* **Core Competencies:** Python, JavaScript, REST & GraphQL APIs, PostgreSQL, Redis distributed caching, Idempotency keys, Race conditions, Unit & Integration testing.
* **Handbook:** `Software_Developer_Handbook.pdf` (12 pages on Clean Architecture, API contracts, ORM tuning, and testing pyramids).

### 2. Cloud Engineer (`cloud-engineer`)
* **Focus:** Cloud Infrastructure & SRE, Kubernetes Orchestration, Zero-Downtime Deployments, Terraform IaC, Observability, and Incident Triage.
* **Core Competencies:** Kubernetes pod lifecycles, Linux cgroups, Terraform state locking, Prometheus & Grafana alerting, SLI/SLO error budgets, Ingress TLS routing.
* **Handbook:** `Cloud_Engineer_Handbook.pdf` (12 pages on SRE toil reduction, multi-region failover, IMDSv2 security, and Incident Command).

### 3. Data Analyst (`data-analyst`)
* **Focus:** Modern Data Stack, High-Performance SQL, dbt Data Modeling, Automated ETL Pipelines, Data Contracts, and Executive BI Dashboards.
* **Core Competencies:** SQL Window Functions, Kimball Star Schemas, dbt transformations, Airflow DAG debugging, A/B test sample ratio mismatch (SRM), PII masking.
* **Handbook:** `Data_Analyst_Handbook.pdf` (12 pages on Columnar data warehouses, slowly changing dimensions, metric definitions, and executive reporting).

---

## 📚 12-Page Role-Specific Knowledge Handbooks

Generated with **ReportLab Platypus** using a custom two-pass `NumberedCanvas` that dynamically formats headers, decorative borders, and footers (`Page X of 12`):

| File Name | Role | Primary Color | Core Chapters Covered |
| :--- | :--- | :--- | :--- |
| **`Software_Developer_Handbook.pdf`** | Software Developer | Royal Blue (`#1e40af`) | Clean Architecture, Idempotency, Test Pyramid, N+1 Queries, Security, 40-Term Lexicon, First 90 Days |
| **`Cloud_Engineer_Handbook.pdf`** | Cloud Engineer | Emerald Green (`#065f46`) | SRE Toil, Terraform State, Kubernetes Pods, Observability Triad, Incident Command, First 90 Days |
| **`Data_Analyst_Handbook.pdf`** | Data Analyst | Amber / Bronze (`#7c2d12`) | Modern Data Stack, Kimball Schemas, Window Functions, dbt Testing, A/B Experimentation, First 90 Days |

* **Dynamic Delivery:** Accessible via `GET /api/handbook/download?role={role}` or directly from the `docs/assets/` directory on GitHub Pages.
* **Interactive Online Reader:** In-app browser viewer with 10 jump pills, smooth scrolling, and visual highlight pulses.

---

## 🧪 5-Question Readiness Assessment (MEQs)

Before accessing the production problem bank, learners take a 5-question multiple choice assessment testing operational readiness:
* **Immediate Evaluation:** Displays score, percentage, and pass/fail indicator.
* **Comprehensive Explanations:** Explains the architectural rationale behind both correct and incorrect answers.
* **Passing Gate:** Achieving 80% (4 out of 5) transitions the user directly to their personalized Operations Dashboard.

---

## 💻 40 Production Engineering Problems

The problem bank provides 40 real-world engineering challenges split into two distinct learning phases:

### Phase 1: 20 Basic Problems (`prob-01` to `prob-20`) — *With Reference & Help Statements*
Each problem features a scenario, an expected task, starter code/template, and an explicit **Reference / Help Statement** offering standard syntax, operating commands, and SOP advice.
* `prob-01`: Kubernetes Exit Code 137 (OOMKilled) container memory limits
* `prob-02`: PostgreSQL composite B-Tree index optimization on `(org_id, created_at)`
* `prob-03`: Redis connection pool exhaustion & connection cleanup
* `prob-04`: Sliding window rate limiter middleware implementation
* `prob-05`: Kafka consumer group rebalance storm mitigation
* `prob-06` to `prob-20`: CORS preflights, Docker multi-stage builds, idempotency keys, JWT rotation, and cache stampede defenses.

### Phase 2: 20 Intermediate Problems (`prob-21` to `prob-40`) — *Without Help Statements*
Advanced distributed systems and incident scenarios where learners apply independent engineering reasoning without reference hints (`help_statement: None`).
* `prob-21`: Cascading failure & thread pool exhaustion across microservices
* `prob-22`: Distributed lock lease expiration race condition during long GC pauses
* `prob-23`: Multi-region database replication lag & read-your-own-writes consistency
* `prob-24`: Database transaction deadlock detection and deterministic lock ordering
* `prob-25`: Saga pattern compensations & rollback handling across distributed payments
* `prob-26` to `prob-40`: WebSocket memory leaks, schema migration lockouts, circuit breakers, and zero-downtime blue/green switchovers.

---

## 🚨 210 Practical Simulation Missions

Beyond isolated problems, Praxis provides comprehensive workplace simulation labs:

* **60 Guided Missions (20 per Role):**
  * `swe-01` to `swe-20` (Software Developer)
  * `cloud-sre-01` to `cloud-sre-20` (Cloud Engineer)
  * `data-analyst-01` to `data-analyst-20` (Data Analyst)
  * *Features:* Multi-tab evidence viewer (Incident Timeline, Telemetry & APM graphs, Application Logs, Git Diffs, Runbook SOPs).
* **150 Independent Missions (50 per Role):**
  * `swe-indep-01` to `swe-indep-50`
  * `cloud-indep-01` to `cloud-indep-50`
  * `data-indep-01` to `data-indep-50`
  * *Features:* Autonomous incident triage and production system audits.
* **Structured Submission Form:** Every mission requires 5 structured fields:
  1. *Timeline & Impact Assessment*
  2. *Root Cause Hypothesis (Facts vs Assumptions)*
  3. *Immediate Safe Mitigation Plan (Runbook SOP)*
  4. *Verification & Health Confirmation*
  5. *Preventative Hardening / Architectural Fix*
* **Multi-Dimensional Rubric Evaluator:** Scores submissions against 4 weighted criteria (*Evidence Accuracy*, *Root Cause Plausibility*, *Safe Mitigation*, *Verification & Prevention*), providing numerical marks, strengths, and actionable feedback.

---

## 📊 Live Google Sheet Master Ledger

When users sign up on the platform, their details are recorded and synced to a centralized Google Sheet ledger:

* **Spreadsheet Name:** `Praxis_Registered_Users_Master_Ledger`
* **File ID:** `1KxTxJ4cb8ZA3YB7j0_YNIUumB7qPbCs4kbTQ1cm-xr0`
* **Direct Google Sheet Link:** [View Praxis Master Ledger](https://docs.google.com/spreadsheets/d/1KxTxJ4cb8ZA3YB7j0_YNIUumB7qPbCs4kbTQ1cm-xr0/edit?usp=drivesdk)
* **Schema Columns:** `User ID`, `Username`, `Full Name`, `Career Track`, `Role Locked`, `Readiness Quiz Status`, `Quiz Score`, `Registered At (UTC)`, `Platform`
* **Admin Export:** Immediate CSV download via `GET /api/admin/users/csv`.

---

## 🌐 Dual-Mode Deployment Architecture

Praxis is engineered with dual-mode resilience:

```
               ┌────────────────────────────────────────────────────────┐
               │                  Praxis Web Frontend                   │
               └───────────┬────────────────────────────────┬───────────┘
                           │                                │
            (If running with FastAPI)            (If hosted on GitHub Pages)
                           │                                │
                           ▼                                ▼
              ┌─────────────────────────┐      ┌─────────────────────────┐
              │   FastAPI Backend API   │      │   Offline Engine Data   │
              │   (Port 8000 / SQLite)  │      │   (problems_data.js)    │
              ├─────────────────────────┤      ├─────────────────────────┤
              │ • PBKDF2-SHA256 Auth    │      │ • Client-side Auth      │
              │ • SQLite Persistence    │      │ • LocalStorage Progress │
              │ • ReportLab PDF Engine  │      │ • Keyword Rubric Eval   │
              │ • Google Sheet Sync     │      │ • Static PDF Downloads  │
              └─────────────────────────┘      └─────────────────────────┘
```

1. **GitHub Pages (`/docs` branch deployment):** 100% serverless client-side mode powered by `problems_data.js`. All quizzes, role locks, problem evaluations, and PDF downloads work directly in the browser.
2. **Full-Stack Mode (FastAPI + SQLite):** Complete client-server architecture with salted password hashing, REST endpoints, parameterized SQLite queries, and security headers.

---

## 🛠️ Repository Directory Structure

```
my_projectt/
├── docs/                      # GitHub Pages static production distribution
│   ├── index.html             # Single-page application entry point
│   ├── styles.css             # Production stylesheet with CSS variables
│   ├── app.js                 # Frontend application state machine
│   ├── problems_data.js       # Offline curriculum bank & client evaluation engine
│   └── assets/                # Pre-rendered 12-page role handbook PDFs
│       ├── Software_Developer_Handbook.pdf
│       ├── Cloud_Engineer_Handbook.pdf
│       └── Data_Analyst_Handbook.pdf
├── frontend/                  # Development frontend source
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── problems_data.js
│   └── assets/
├── backend/                   # FastAPI backend application
│   ├── main.py                # REST API endpoints & static middleware
│   ├── problems.py            # Canonical definition of 3 roles, 5 MEQs, and 40 problems
│   ├── rubric.py              # Heuristic rubric evaluation engine
│   ├── generate_role_handbooks.py # 12-page PDF ReportLab compilation script
│   ├── generate_missions_bank.py  # 210-mission generator script
│   ├── worksim.sqlite3        # SQLite persistence database
│   ├── registered_users_ledger.csv # Local CSV synchronization ledger
│   ├── test_api.py            # Catalog, mission, and submission tests
│   ├── test_security.py       # SQLi, XSS, Path Traversal, and Header tests
│   ├── test_auth_and_curriculum.py # Auth, role lock, quiz, and problem tests
│   ├── test_e2e_lifecycle.py  # End-to-end user journey verification test
│   └── requirements.txt       # Python package dependencies
├── missions/                  # 210 JSON mission specifications (guided & independent)
└── tracks/                    # Track definitions for the 3 career paths
```

---

## 🏃 Local Setup & Development

### 1. Prerequisites
* Python 3.10+
* Git

### 2. Clone Repository
```bash
git clone https://github.com/shi-vam53/my_projectt.git
cd my_projectt
```

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 4. Run the Backend API & Frontend Server
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Open your browser at:
👉 **`http://localhost:8000`**

---

## 🛡️ Automated Test Suite & Security

The platform includes **30 automated tests** executed via `pytest`:

```bash
pytest backend/ -v
```

### Test Coverage Highlights:
* **Penetration Security (`test_security.py`):**
  * Parameterized SQL Injection payloads (`' OR 1=1`, `UNION SELECT`, `DROP TABLE`).
  * Directory traversal resistance (`../../../../etc/passwd`, encoded `%2F`).
  * XSS polyglot safe storage and rendering.
  * Oversized payload body protection (422 payload limit).
  * HTTP Security Headers verification (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`).
* **Authentication & Curriculum (`test_auth_and_curriculum.py`):**
  * PBKDF2-SHA256 password salting and token issuance.
  * Permanent role lock enforcement (`403 Forbidden` on role mutation).
  * 12-page PDF handbook download and streaming.
  * 5 MEQ readiness scoring and threshold validation.
  * Phase 1 (with help) and Phase 2 (without help) problem evaluations.
  * Google Sheet CSV ledger consistency.
* **End-to-End Lifecycle (`test_e2e_lifecycle.py`):**
  * Complete lifecycle test simulating a student registering, locking a career track, studying the manual, passing the quiz, unlocking the dashboard, solving problems, and checking the admin export.

```
============================== 30 passed in 2.24s ==============================
```

---

## 📄 License & Attribution

Developed for practical engineering training and technical workplace readiness.  
* **Platform:** Praxis Workplace Simulation Platform  
* **Repository:** [shi-vam53/my_projectt](https://github.com/shi-vam53/my_projectt)  
* **Live Demo:** [https://shi-vam53.github.io/my_projectt/](https://shi-vam53.github.io/my_projectt/)
