# WorkSim (CareerSim) - Practical Work Simulation Platform

A realistic workplace simulation platform designed to bridge the gap between academic/interview learning and real-world job readiness for students and freshers.

---

## 🎯 Core Concept
Instead of theoretical tests or toy coding puzzles, learners practice realistic workplace missions across three career tracks:
1. **Cloud Engineer / SRE**
2. **Software Developer**
3. **Data Analyst**

Each mission simulates real work artifacts:
* Synthetic logs & telemetry metrics
* Incident timelines & release notes
* Architecture diagrams & runbooks
* Code snippets & configuration diffs

Learners submit structured professional work (e.g., incident response reports, architectural decisions, root cause hypotheses, mitigation plans) evaluated against a multi-dimensional rubric—not a naive binary pass/fail.

---

## 🏗️ Repository Architecture & Multi-Agent Division

This project is built collaboratively by multiple AI agents in parallel:

```
├── SPEC.md                    # Canonical system specification & schema contract
├── tracks/                    # Track guides, glossaries, and 5-question readiness checks
│   ├── cloud-engineer.json    # Infrastructure, SRE tools, and incident triage
│   ├── software-developer.json# Application engineering, idempotency, testing
│   └── data-analyst.json      # Product analytics, cohort retention, experimentation
├── missions/                  # Fictional workplace missions with synthetic evidence
│   ├── cloud-sre-01.json      # Sev-1 Latency & 5xx incident simulation (Guided)
│   ├── cloud-sre-02.json      # K8s CrashLoopBackOff & OOMKilled leak (Guided)
│   ├── cloud-sre-03.json      # DNS Resolution cascade & CoreDNS throttling (Independent)
│   ├── swe-01.json            # Stripe webhook idempotency race condition (Guided)
│   ├── swe-02.json            # EventEmitter leak & unhandled rejection (Guided)
│   ├── swe-03.json            # SQL Injection & filter bypass triage (Independent)
│   ├── data-analyst-01.json   # 35% Mobile checkout drop anomaly (Guided)
│   ├── data-analyst-02.json   # Cohort retention degradation post-redesign (Guided)
│   └── data-analyst-03.json   # Sample Ratio Mismatch (SRM) A/B test audit (Independent)
├── frontend/                  # Web UI (Vanilla JS, CSS variables, zero-build)
│   ├── index.html             # Multi-view dashboard (Catalog, Workspace, Admin, Profile)
│   ├── styles.css             # Dark sidebar, bright cards, print styles
│   └── app.js                 # Client state machine, catalog filtering, API connector
└── backend/                   # API & Rubric Evaluation (FastAPI + SQLite)
    ├── main.py                # REST API endpoints & static file hosting
    ├── rubric.py              # Multi-dimensional heuristic rubric evaluator
    ├── test_api.py            # Automated test suite (5/5 passing)
    └── requirements.txt       # Dependencies
```

---

## 🤖 Multi-Agent Team Roles & Branching Strategy

| Role | Arena Chat | Responsibilities | Target Branch |
| :--- | :--- | :--- | :--- |
| **Lead Architect (Chat 1)** | Current Chat | Scaffolding, Schemas, `SPEC.md`, Sample Missions | `main` |
| **Frontend Engineer (Chat 2)** | Chat 2 | Dark sidebar dashboard, Track selection, 5-question quiz, Mission workspace, Evidence tabs, Structured submission form | `feature/frontend` ➔ `main` |
| **Backend & AI Evaluator (Chat 3)** | Chat 3 | REST API (FastAPI), Mission loader, Draft storage, Rubric-based evaluation engine | `feature/backend` ➔ `main` |
| **QA & Content Curator (Chat 4)** | Chat 4 | Synthetic mission evidence, test suites, edge case verification | `feature/qa-content` ➔ `main` |

---

## 📋 Schema Summary
See [SPEC.md](./SPEC.md) for complete data schemas and API specifications.
