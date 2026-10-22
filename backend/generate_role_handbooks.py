"""Generate Role-Specific 12-Page Foundations & Architecture Handbooks in PDF.

Generates 3 publication-grade documents:
1. Software Developer Foundations Handbook
2. Cloud Engineer & SRE Systems Handbook
3. Data Analyst & Analytics Engineering Handbook
"""

from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and stamp 'Page X of Y' and header."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "PRAXIS | WORKPLACE SIMULATION PLATFORM")
            self.setFont("Helvetica", 8)
            role_header = getattr(self, "_role_header", "Role-Specific Engineering Handbook")
            self.drawRightString(612 - 54, 750, role_header)
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 612 - 54, 744)

        # Footer (All pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 38, "CONFIDENTIAL & PROPRIETARY — PRAXIS ENGINEERING CURRICULUM")
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(612 - 54, 38, page_str)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)

        self.restoreState()


ROLE_CONFIGS = {
    "software-developer": {
        "title": "Software Developer Foundations Handbook",
        "subtitle": "Full-Stack & Backend Systems Architecture, API Design, Git Protocols & Clean Code Standards",
        "header_title": "Software Developer Foundations Handbook",
        "primary_color": "#1e40af", # Blue
        "accent_color": "#3b82f6",
        "light_color": "#eff6ff",
        "lead_paragraph": "A definitive field reference for junior and transitioning software engineers navigating modern web services, distributed backend systems, clean application architectures, rigorous testing, and collaborative git workflows.",
        "chapters": [
            {
                "num": 1,
                "title": "Software Engineering Team Structure & Stakeholder Dynamics",
                "tagline": "How modern cross-functional product squads collaborate to deliver reliable user features.",
                "body": "In modern software organizations, engineers operate inside cross-functional squads comprising Product Managers (PMs), Product Designers (UX/UI), QA Engineers, and fellow developers. The PM governs the 'why' and 'what' (prioritized customer problem statements), whereas the engineering team exclusively governs the 'how' (technical architecture, system design, scalability, and code quality). Technical decisions must balance rapid delivery against technical debt accrual.",
                "callout_title": "Golden Communication Standard",
                "callout_body": "Never state 'the feature is almost done' without defining concrete criteria. Specify 'PR open and reviewed; awaiting integration test green status and stage smoke testing.'",
                "table_data": [
                    ["Role", "Primary Responsibility", "Critical Interface with Developers"],
                    ["Product Manager (PM)", "Product strategy, user requirements & PRDs", "Feature scope negotiation, acceptance criteria"],
                    ["Staff / Tech Lead", "System architecture & technical standard setting", "Design reviews, non-functional requirement validation"],
                    ["Frontend Engineer", "Client rendering, state machines & Web Vitals", "API contract agreements, mock payloads, error states"],
                    ["Backend Engineer", "API routes, business logic & persistence tier", "Database indexing, schema migrations, concurrency control"],
                    ["QA Engineer", "Automated regression testing & test matrix", "Edge-case analysis, synthetic test fixture alignment"]
                ]
            },
            {
                "num": 2,
                "title": "The Modern Agile Cadence & Software Sprint Ceremonies",
                "tagline": "From sprint planning to retrospectives: mastering the two-week engineering heartbeat.",
                "body": "Agile is not bureaucratic overhead; it is a rapid feedback loop designed to mitigate uncertainty. Teams execute in 2-week iterations (sprints). The sprint backlog represents a committed forecast. Work is decomposed into User Stories accompanied by verifiable Acceptance Criteria (Gherkin style: Given-When-Then). Engineers are expected to raise blockers immediately rather than waiting for ceremonies.",
                "callout_title": "The 3 Standup Questions vs Impact Framing",
                "callout_body": "Instead of saying 'I worked on tickets yesterday', frame as: 'Completed auth token refresh logic; today pairing on the idempotency middleware. No blockers, on track for sprint demo.'",
                "table_data": [
                    ["Ceremony", "Frequency & Duration", "Software Engineer's Deliverable"],
                    ["Sprint Planning", "Every 2 weeks (90 mins)", "Estimate user stories with Fibonacci story points; decompose into tasks"],
                    ["Daily Standup", "Daily (15 mins)", "Share progress towards sprint goal, flag blockers, identify pairing needs"],
                    ["Backlog Refinement", "Weekly (45 mins)", "Clarify acceptance criteria, flag technical spikes, identify edge cases"],
                    ["Sprint Review & Demo", "End of Sprint (45 mins)", "Demonstrate working code in staging environment to stakeholders"],
                    ["Retrospective", "End of Sprint (45 mins)", "Blameless analysis of what went well, what stalled, and action items"]
                ]
            },
            {
                "num": 3,
                "title": "Git Hygiene, Conventional Commits & Code Review Etiquette",
                "tagline": "Trunk-based development, atomic commits, and creating high-empathy pull requests.",
                "body": "Your Git commit history is the living ledger of your application's architecture. Elite engineering organizations employ Trunk-Based Development with short-lived feature branches (< 24 hours). Commits must be atomic, bisectable, and formatted according to the Conventional Commits specification (e.g. feat:, fix:, refactor:, test:, chore:). Pull Requests should remain small (< 400 lines) to ensure high review quality and rapid merge velocity.",
                "callout_title": "Pull Request Etiquette Rule",
                "callout_body": "Always self-review your PR before requesting peer reviews. Provide screenshots or video for UI changes, and include curl commands or test outputs for API changes.",
                "table_data": [
                    ["Commit Prefix", "Semantic Intent", "Example Git Commit"],
                    ["feat(auth)", "New user-facing functionality", "feat(auth): implement rotating refresh token rotation on logout"],
                    ["fix(billing)", "Bug remediation with zero feature creep", "fix(billing): handle floating-point cent rounding in invoice tax"],
                    ["refactor(db)", "Code structure change without behavioral drift", "refactor(db): extract connection pool singleton into dependency injector"],
                    ["test(users)", "Adding or correcting automated test suites", "test(users): add parameterized edge cases for unicode email validation"],
                    ["perf(search)", "Targeted latency or resource optimization", "perf(search): add composite b-tree index on (org_id, created_at)"]
                ]
            },
            {
                "num": 4,
                "title": "Software Architecture Tiers, Microservices & Data Modeling",
                "tagline": "Designing scalable, decoupled, and maintainable application architectures.",
                "body": "Modern web applications adhere to Clean Architecture principles: Separation of Concerns, Inversion of Control, and Explicit Domain Boundaries. Software is segmented into Presentation (API routes/controllers), Application (orchestration & use-cases), Domain (pure business entities and invariant rules), and Infrastructure (databases, message queues, third-party HTTP clients).",
                "callout_title": "Idempotency in API Systems",
                "callout_body": "Any state-changing POST/PATCH request must accept an 'Idempotency-Key' header. If a network blip occurs, the client retries safely without causing duplicate charges or data corruption.",
                "table_data": [
                    ["Architectural Layer", "Primary Responsibility", "Forbidden Anti-Pattern"],
                    ["Controller / Presentation", "Request deserialization, HTTP status codes, validation", "Executing raw SQL queries or complex business logic inside route handlers"],
                    ["Domain Services", "Pure core business rules, entity invariants, calculations", "Importing database drivers or framework-specific HTTP contexts"],
                    ["Data Access (Repository)", "Query optimization, connection pooling, transactions", "Leaking database entities directly into external public API payloads"],
                    ["Caching Tier (Redis)", "Sub-millisecond reads, distributed locks, session storage", "Treating cache as permanent storage without cache invalidation strategies"]
                ]
            },
            {
                "num": 5,
                "title": "Automated Testing Pyramid, CI/CD Gates & Quality Assurance",
                "tagline": "Building trust through unit, integration, and contract test automation.",
                "body": "Reliability cannot be tested into software at the end; it must be designed into the codebase from the initial commit. The Test Automation Pyramid mandates a broad base of fast, isolated Unit Tests (pure logic), a focused mid-tier of Integration Tests (database queries, repository contracts, Redis caching), and a narrow top tier of End-to-End (E2E) workflow tests running in ephemeral environments.",
                "callout_title": "Continuous Integration (CI) Invariant",
                "callout_body": "A broken CI build on 'main' halts all feature work. The engineer who merged the breaking commit is immediately responsible for fixing forward or reverting within 10 minutes.",
                "table_data": [
                    ["Testing Tier", "Execution Speed", "Targeted Failure Mode", "Mocking Strategy"],
                    ["Unit Tests", "< 1 ms per test", "Logic branches, math errors, edge-case null checks", "Mocks all network and disk I/O"],
                    ["Integration Tests", "10 - 200 ms per test", "SQL syntax, migration locks, schema mismatches", "Real Dockerized Postgres / Redis testcontainers"],
                    ["Contract Tests", "50 - 500 ms per test", "API schema drift between frontend and backend", "Pact / OpenAPI schema validator"],
                    ["End-to-End (E2E)", "5 - 30 s per test", "Broken user checkout, state machine regression", "Synthetic headless browser runs (Playwright)"]
                ]
            },
            {
                "num": 6,
                "title": "Application Telemetry: Logging, APM, Tracing & Profiling",
                "tagline": "Instruments of truth: observing real-time production software performance.",
                "body": "Engineers cannot fix what they cannot observe. Modern production software must emit structured JSON logs with correlated trace identifiers (`trace_id`, `span_id`). Application Performance Monitoring (APM) instruments call stacks to pinpoint CPU hotspots, database query N+1 bottlenecks, and third-party API latency spikes. Unstructured log strings (e.g. `console.log('error here')`) are strictly prohibited.",
                "callout_title": "Structured Logging Imperative",
                "callout_body": "Always emit JSON logs with key metadata: {'timestamp': '2026-10-22T08:00:00Z', 'level': 'ERROR', 'trace_id': 'abc-123', 'user_id': 'u_456', 'error_code': 'DB_LOCK_TIMEOUT'}.",
                "table_data": [
                    ["Telemetry Pillar", "Key Tooling", "Diagnostic Utility for Software Engineers"],
                    ["Structured Logs", "Winston / Loguru / ELK", "Contextual forensics: exact parameters and error traces during failures"],
                    ["APM & Distributed Traces", "Datadog / OpenTelemetry / Jaeger", "End-to-end request hop analysis: isolating slow DB queries and microservice latency"],
                    ["Application Metrics", "Prometheus / StatsD", "Time-series counters (requests/sec), gauges (pool active), histograms (p99 duration)"],
                    ["Crash Reporting", "Sentry / Bugsnag", "Real-time exception grouping, user session breadcrumbs, stack frame mapping"]
                ]
            },
            {
                "num": 7,
                "title": "Production Debugging, Concurrency & Incident Triage",
                "tagline": "How elite engineers diagnose race conditions, deadlocks, and cascading outages.",
                "body": "When production incidents occur, engineers must transition into systematic triage mode: Mitigate First, Diagnose Offline. Common software failure modes include thread pool exhaustion, database connection deadlocks, unindexed table scans causing query queueing, and unbounded memory allocations triggering out-of-memory (OOM) process termination.",
                "callout_title": "The Circuit Breaker & Bulkhead Patterns",
                "callout_body": "When calling upstream services, always wrap client calls in circuit breakers. If an external API slows down, fail fast immediately to preserve internal thread pools and prevent cascading failure.",
                "table_data": [
                    ["Failure Symptom", "Underlying Root Cause", "Immediate Engineering Remediation"],
                    ["Database Lock Timeout", "Concurrent transactions updating rows in differing order", "Enforce strict alphabetical lock ordering across all queries"],
                    ["High Latency on List API", "N+1 query problem loading foreign keys in a loop", "Replace loop with batch JOIN or eager loading with IN clause"],
                    ["Process OOM (Exit 137)", "Reading entire 5GB file/query into memory at once", "Refactor to streaming chunk reader / database cursors"],
                    ["504 Gateway Timeout", "Synchronous third-party HTTP call in critical path", "Decouple into background asynchronous queue (Celery/Kafka)"]
                ]
            },
            {
                "num": 8,
                "title": "Application Security Baseline: OWASP Top 10 & Secret Hygiene",
                "tagline": "Writing bulletproof software resistant to injection, auth bypass, and data leaks.",
                "body": "Security is not a downstream QA checklist; it is an intrinsic software engineering discipline. Every incoming parameter is untrusted until sanitized and validated. Developers must protect against the OWASP Top 10 vulnerabilities: Broken Access Control, Cryptographic Failures, Injection (SQLi/XSS), and Insecure Design. Hardcoded secrets in codebases represent severe security incidents.",
                "callout_title": "Zero Secrets in Git Rule",
                "callout_body": "Never commit API keys, database passwords, or JWT signing secrets to git repositories. Always use environment variables injected via Vault or Kubernetes Secrets, backed by pre-commit hooks.",
                "table_data": [
                    ["Vulnerability", "Attack Vector", "Mandatory Engineering Defense"],
                    ["SQL Injection (SQLi)", "Tainted string interpolation in SQL queries", "Parameterized queries, prepared statements, typed ORM models"],
                    ["Cross-Site Scripting (XSS)", "Unsanitized user text injected into browser DOM", "Context-aware HTML escaping, Content Security Policy (CSP) headers"],
                    ["Broken Object Level Auth (BOLA)", "User accessing /api/invoices/999 without tenant check", "Enforce row-level ownership validation on every database query"],
                    ["CSRF & Session Hijacking", "Malicious site forging authenticated state changes", "HttpOnly, Secure, SameSite=Strict cookie flags + CSRF tokens"]
                ]
            },
            {
                "num": 9,
                "title": "Software Engineering Lexicon: 40 Essential Industry Terms",
                "tagline": "The precise vocabulary required to communicate fluently in production engineering teams.",
                "body": "Fluency in industry vocabulary enables high-bandwidth, precise technical collaboration without ambiguity. Master these 40 terms to understand architecture RFCs, system design discussions, and production incident postmortems.",
                "callout_title": "Lexicon Invariant",
                "callout_body": "Use precise architectural terminology during design reviews. Distinguish clearly between 'Authentication' (who you are) and 'Authorization' (what you can do).",
                "table_data": [
                    ["Term", "Industry Definition & Practical Engineering Context"],
                    ["Idempotency", "A property of an API operation where making multiple identical requests has the exact same side-effect as a single request."],
                    ["Database Index", "A b-tree data structure that improves the speed of data retrieval operations on a database table at the cost of slower writes."],
                    ["Connection Pooling", "A cache of database connections maintained so that connections can be reused rather than opened and closed for every query."],
                    ["Race Condition", "A bug where the system's output depends on the timing or sequence of uncontrollable events like concurrent thread execution."],
                    ["Deadlock", "A situation where two or more concurrent transactions are unable to proceed because each holds a lock the other needs."],
                    ["N+1 Query Problem", "A performance anti-pattern where an application executes 1 query to retrieve N records, and then N additional queries for child data."],
                    ["Circuit Breaker", "A software design pattern used to detect failures and encapsulate the logic of preventing a failure from constantly recurring."],
                    ["Backpressure", "A mechanism that allows a receiving system to signal to a sending system that it is overwhelmed and needs it to slow down."],
                    ["Eventual Consistency", "A consistency model used in distributed systems where all replicas will eventually converge to the same state."],
                    ["Clean Architecture", "A software design philosophy that isolates core business domain logic from frameworks, UI, and persistence tiers."]
                ]
            },
            {
                "num": 10,
                "title": "The First 90 Days Survival Guide for Junior Software Developers",
                "tagline": "Your week-by-week playbook for onboarding, building credibility, and shipping impact.",
                "body": "Your first 90 days establish your reputation as a reliable, curious, and rigorous engineer. Success is measured not by how fast you write code, but by how reliably you learn the domain, adhere to team standards, write comprehensive tests, and communicate proactively.",
                "callout_title": "The 30-Minute Blocked Rule",
                "callout_body": "When stuck, spend 30 minutes researching and isolating the problem. If still blocked, ask your mentor: document what you tried, what you expected, what happened, and your working hypothesis.",
                "table_data": [
                    ["Timeline Milestone", "Key Objective & Deliverable", "Success Metric"],
                    ["Week 1: Setup & Environment", "Clone repo, run full test suite locally, execute first non-prod deploy", "Environment working without mentor intervention; zero secrets leaked"],
                    ["Week 2: First Production Bug", "Pick up a well-scoped bugfix ticket, write reproduction test, open PR", "PR merged with clean commit message and passing CI pipeline"],
                    ["Day 30: Feature Contributor", "Deliver first full user story including database migration and tests", "Code shipped to production with zero regressions or rollbacks"],
                    ["Day 60: System Understanding", "Document a tribal knowledge workflow; shadow an on-call engineer", "Conducted architecture walkthrough of one core microservice"],
                    ["Day 90: Autonomous Developer", "Own a full sprint feature from refinement to deployment and monitoring", "Proactively proposed test improvements; trusted peer reviewer"]
                ]
            }
        ]
    },

    "cloud-engineer": {
        "title": "Cloud Engineer & SRE Systems Handbook",
        "subtitle": "Cloud Infrastructure, Kubernetes, Zero-Downtime Deployments, Observability & Incident Triage",
        "header_title": "Cloud Engineer & SRE Systems Handbook",
        "primary_color": "#065f46", # Emerald / Green
        "accent_color": "#059669",
        "light_color": "#ecfdf5",
        "lead_paragraph": "A definitive field reference for junior and transitioning Cloud & Platform Engineers mastering Kubernetes orchestrations, Infrastructure-as-Code (Terraform), production observability, incident triage, and reliability engineering.",
        "chapters": [
            {
                "num": 1,
                "title": "Cloud Engineering Hierarchy, Platform Teams & Shared Responsibility",
                "tagline": "Operating high-availability infrastructure across public clouds and hybrid environments.",
                "body": "Modern Cloud and Site Reliability Engineers (SRE) operate as platform enablers. Under the Cloud Shared Responsibility Model, the cloud provider manages physical hardware, hypervisors, and data centers, while the cloud engineer manages network topologies (VPCs, CIDRs), IAM policies, container runtimes, encryption in-transit and at-rest, and operational reliability.",
                "callout_title": "The SRE Golden Principle",
                "callout_body": "Treat operations as a software problem. If an administrative task must be executed more than twice, automate it with code or Terraform rather than performing manual console clicks.",
                "table_data": [
                    ["Role", "Primary Responsibility", "Critical SRE Deliverable"],
                    ["Platform / SRE Director", "Multi-region cloud budget, compliance & organizational SLOs", "Reliability roadmaps, vendor contracts, disaster recovery drills"],
                    ["Cloud Architect", "Global network topology, security boundaries, multi-cloud strategy", "Reference architectures, VPC peering/transit gateway designs"],
                    ["Site Reliability Engineer (SRE)", "Service Level Objectives (SLOs), automated remediation, error budgets", "Alert tuning, blameless postmortems, capacity planning"],
                    ["DevOps / CI/CD Engineer", "Deployment pipelines, container image caching, build runners", "Fast automated PR gates, artifact signing, release automation"],
                    ["Security Engineer (SecOps)", "Vulnerability scanning, least privilege IAM, zero trust policies", "Kube-bench audits, secrets rotation, network security policies"]
                ]
            },
            {
                "num": 2,
                "title": "SRE Cadence, Toil Reduction & Error Budget Policies",
                "tagline": "Balancing velocity against stability through mathematical error budgets.",
                "body": "Google SRE doctrine mandates that SREs spend no more than 50% of their engineering capacity on repetitive operational 'toil' (manual deployments, ticket handling, cert renewals). The remaining 50% must be dedicated to engineering projects (automation, reliability tooling, fault injection). When a service exhausts its monthly Error Budget, feature releases halt to prioritize hardening.",
                "callout_title": "The Error Budget Equation",
                "callout_body": "If an API has a 99.9% availability SLO over 30 days, its allowed downtime is exactly 43.2 minutes. Every outage subtracts minutes from this budget.",
                "table_data": [
                    ["SRE Ceremony", "Frequency & Focus", "Cloud Engineer's Deliverable"],
                    ["Error Budget Review", "Monthly (60 mins)", "Review SLO compliance per tier-1 service; decide feature freeze/unfreeze"],
                    ["On-Call Handover", "Weekly (30 mins)", "Review alerts fired, runbook gaps identified, ongoing degraded states"],
                    ["Production Readiness Review", "Pre-launch gate", "Verify health checks, Prometheus metrics, backup restores, runbook docs"],
                    ["Disaster Recovery GameDay", "Quarterly (Half-day)", "Simulate regional cloud failover or database master crash in staging"],
                    ["Blameless Postmortem", "Post SEV-1 incident", "Document root cause, timeline, contributing factors, and preventative PRs"]
                ]
            },
            {
                "num": 3,
                "title": "Infrastructure-as-Code (IaC), Terraform & GitOps Workflows",
                "tagline": "Declaring cloud infrastructure as auditable, version-controlled state.",
                "body": "Manual modifications made in cloud web consoles ('ClickOps') are catastrophic anti-patterns causing configuration drift. All infrastructure must be declared as code using Terraform, OpenTofu, or Pulumi. State files must be locked remotely with DynamoDB/S3 to prevent concurrent execution races. GitOps engines (ArgoCD / Flux) continuously reconcile Git state with live Kubernetes clusters.",
                "callout_title": "Terraform State Locking Invariant",
                "callout_body": "Never run 'terraform apply' locally against production. Apply changes through an auditable CI/CD runner with plan artifacts generated and peer-reviewed in pull requests.",
                "table_data": [
                    ["IaC Concept", "Purpose & Mechanism", "Operational Best Practice"],
                    ["Remote State Backend", "Stores Terraform state in S3 with KMS encryption", "Enforce state versioning and DynamoDB lock tables to stop split-brain"],
                    ["Terraform Modules", "Reusable infrastructure blueprints (VPC, EKS, RDS)", "Version tag modules semantically; avoid hardcoding resource names"],
                    ["Drift Detection", "Automated daily scheduled Terraform plans", "Alert immediately when manual console changes diverge from Git repo"],
                    ["GitOps Reconciliation", "ArgoCD watching Git repository branch", "Automatically sync manifests; enforce self-heal against manual kubectl edits"]
                ]
            },
            {
                "num": 4,
                "title": "Kubernetes Architecture, Pod Lifecycles & Networking",
                "tagline": "Mastering container orchestration, resource limits, and service meshes.",
                "body": "Kubernetes reconciles desired state against observed state via control plane controllers. Pods must define precise CPU/memory `requests` (used for scheduling) and `limits` (enforced by Linux cgroups). Exceeding memory limits triggers Linux Kernel OOM killer (Exit Code 137). Networking is governed by Ingress Controllers (NGINX/Traefik), ClusterIP services, and CoreDNS lookups.",
                "callout_title": "Kubernetes Resource Limits Rule",
                "callout_body": "Always set memory requests equal to memory limits to prevent node overcommit evictions. Configure graceful termination with preStop hooks and terminationGracePeriodSeconds.",
                "table_data": [
                    ["K8s Object", "Operational Role", "Common Failure Mode"],
                    ["Pod", "Atomic unit of deployment containing 1+ containers", "CrashLoopBackOff due to unhandled startup exceptions or missing secrets"],
                    ["Deployment", "Manages replica sets, rolling updates, and rollbacks", "Rollout stalls if maxSurge/maxUnavailable are misconfigured"],
                    ["Horizontal Pod Autoscaler", "Scales replicas based on CPU, memory, or custom metrics", "Flapping/thrashing: pods scaling up and down rapidly without cooldown"],
                    ["Service & Ingress", "L4/L7 load balancing and external routing to pods", "502 Bad Gateway if pod readiness probes fail or port numbers mismatch"],
                    ["PersistentVolumeClaim", "Binds external storage (EBS, Ceph) to stateful pods", "VolumeAttachment lock errors during cross-AZ pod rescheduling"]
                ]
            },
            {
                "num": 5,
                "title": "CI/CD Deployment Strategies: Rolling, Canary & Blue/Green",
                "tagline": "Eliminating deployment downtime through progressive traffic shifting.",
                "body": "Zero-downtime releases require deliberate deployment strategies. Rolling updates replace old pods incrementally. Blue/Green deployments provision two identical environments and switch DNS/Load Balancer targets instantly. Canary releases route 1% to 10% of real production traffic to the new version while Prometheus continuously monitors error rates; automated rollbacks trigger if anomalies appear.",
                "callout_title": "Canary Rollback Threshold",
                "callout_body": "If Canary 5xx error rate exceeds baseline by 0.5% or p99 latency spikes > 200ms within 5 minutes, immediately abort traffic shift and reroute 100% to stable.",
                "table_data": [
                    ["Strategy", "Pros", "Cons", "Ideal Use Case"],
                    ["Rolling Update", "Zero extra compute required; default in K8s", "Multiple versions run simultaneously; requires backward-compatible DB", "Standard stateless microservices"],
                    ["Blue / Green", "Instant cutover and immediate one-click rollback", "Doubles compute cost during deployment window", "Monolithic apps and complex database migrations"],
                    ["Canary Release", "Limits blast radius to small % of users; automated", "Requires advanced ingress routing (Istio/Flagger) & telemetry", "High-traffic Tier-1 APIs with strict SLA"],
                    ["Feature Flags", "Decouples code deployment from feature release", "Accumulates technical debt if flags are not cleaned up promptly", "A/B testing, gradual product rollouts"]
                ]
            },
            {
                "num": 6,
                "title": "The Observability Triad: Prometheus, Grafana & Distributed Tracing",
                "tagline": "Transforming system telemetry into actionable operational intelligence.",
                "body": "Observability consists of three foundational pillars: Metrics (numerical time-series for alerting), Logs (contextual event records for forensics), and Distributed Tracing (request journey across microservices). The Four Golden Signals (Latency, Traffic, Errors, Saturation) provide immediate visibility into system health. Alerts must be actionable and route to on-call engineers via PagerDuty.",
                "callout_title": "Alerting Hygiene Invariant",
                "callout_body": "Never page an engineer for an informational warning. Page only if customer impact is occurring or imminent and human action is required immediately. Everything else belongs in Slack.",
                "table_data": [
                    ["Golden Signal", "Prometheus Metric Example", "Alert Threshold Best Practice"],
                    ["Latency", "histogram_quantile(0.99, rate(http_req_duration_seconds_bucket[5m]))", "Alert when p99 latency > 1,000ms for 3 consecutive evaluation cycles"],
                    ["Traffic", "sum(rate(http_requests_total[1m]))", "Alert on anomalous traffic drop (> 50% drop vs 7-day seasonal baseline)"],
                    ["Errors", "sum(rate(http_requests_total{status=~'5..'}[5m])) / sum(...) * 100", "Alert when 5xx error rate > 1.0% over rolling 5-minute window"],
                    ["Saturation", "node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes", "Alert when available memory < 15% or disk usage > 85%"]
                ]
            },
            {
                "num": 7,
                "title": "Incident Command System (ICS), Severity Levels & War Rooms",
                "tagline": "How high-performing engineering teams organize during live production crises.",
                "body": "During a Severity-1 outage, normal organizational hierarchy dissolves. The Incident Commander (IC) takes absolute charge of the response. The IC assigns roles: Operations Lead (executes runbooks and changes), Communications Lead (updates status pages and executives), and Scribe (documents timeline). No change is executed without IC verbal approval.",
                "callout_title": "Rule of Incident Triage",
                "callout_body": "Mitigate first, diagnose root cause offline. Restoring customer service (via rollback, pod restart, or traffic shed) takes precedence over finding the exact bug.",
                "table_data": [
                    ["Severity", "Definition & Impact", "Response SLA", "War Room Protocols"],
                    ["SEV-1 (Critical)", "Core service down for all users; data loss or security breach", "5 min acknowledge, 15 min response", "Live war room opened; IC appointed; hourly customer updates"],
                    ["SEV-2 (Major)", "Significant degradation for major customer segment; workaround exists", "15 min acknowledge, 30 min response", "Dedicated Slack incident channel; on-call team assembled"],
                    ["SEV-3 (Minor)", "Low-impact edge-case bug; non-critical admin tool affected", "Next business day response", "Handled via standard Jira ticketing sprint backlog"]
                ]
            },
            {
                "num": 8,
                "title": "Cloud Security, Zero Trust, IAM & Secrets Management",
                "tagline": "Enforcing Principle of Least Privilege across cloud environments.",
                "body": "Cloud security operates under the Zero Trust principle: 'Never trust, always verify.' Cloud resources and human operators must be granted only the minimum permissions required (Principle of Least Privilege). Long-lived AWS access keys are strictly forbidden; short-lived tokens (AWS IAM Roles Anywhere / OIDC) must be utilized. HashiCorp Vault or AWS Secrets Manager injects dynamic credentials.",
                "callout_title": "Zero Public S3 / Database Invariant",
                "callout_body": "No database, Redis cache, or storage bucket should ever be exposed to the public internet (0.0.0.0/0). Enforce VPC Private Subnets, Security Groups, and CloudTrail audit logging.",
                "table_data": [
                    ["Security Dimension", "Threat Vector", "Mandatory SRE Control"],
                    ["IAM Permissions", "Over-privileged admin credentials leaked in CI logs", "Least-privilege scoped policies; enforce MFA and role assumption"],
                    ["Secrets Management", "Plaintext API tokens committed to GitHub repository", "HashiCorp Vault / AWS Secrets Manager; rotate secrets every 90 days"],
                    ["Network Perimeter", "Unrestricted inbound port 22 (SSH) open to internet", "Bastion hosts with AWS SSM Session Manager; zero direct public SSH"],
                    ["Container Vulnerabilities", "Base images containing unpatched CVEs", "Trivy / Clair automated scanning in CI; block image pushes on High/Critical"]
                ]
            },
            {
                "num": 9,
                "title": "Cloud & SRE Lexicon: 40 Essential Infrastructure Terms",
                "tagline": "The essential vocabulary required to manage distributed cloud systems.",
                "body": "Mastering infrastructure terminology enables precise operational dialogue during incident triage, architecture design reviews, and vendor negotiations. Learn these 40 terms thoroughly.",
                "callout_title": "Vocabulary Standard",
                "callout_body": "Distinguish strictly between SLI (Service Level Indicator, what is measured), SLO (Service Level Objective, target goal), and SLA (Service Level Agreement, legal contract with penalties).",
                "table_data": [
                    ["Term", "Industry Definition & Practical Engineering Context"],
                    ["SLI / SLO / SLA", "Indicator (metric), Objective (internal reliability target), Agreement (contractual commitment to customers with financial penalties)."],
                    ["Error Budget", "The maximum allowable downtime or error rate a service can accumulate before feature deployments are frozen."],
                    ["Toil", "Repetitive, manual, automatable operational work devoid of enduring engineering value that scales linearly with service size."],
                    ["Infrastructure as Code (IaC)", "Managing and provisioning computer data centers through machine-readable definition files rather than manual configuration."],
                    ["CrashLoopBackOff", "A Kubernetes pod state where a container repeatedly crashes immediately after startup, prompting exponential backoff restarts."],
                    ["OOMKilled (Exit 137)", "The Linux kernel terminating a container process because its physical memory usage exceeded its cgroup memory limit."],
                    ["Ingress Controller", "A specialized load balancer that manages external HTTP/HTTPS traffic routing to services within a Kubernetes cluster."],
                    ["Circuit Breaker", "A resiliency pattern that prevents an application from repeatedly trying to execute an operation that's likely to fail."],
                    ["Zero Trust", "A security framework requiring all users and microservices to be authenticated, authorized, and continuously validated."],
                    ["GitOps", "A operational framework that takes DevOps best practices used for application development and applies them to infrastructure automation."]
                ]
            },
            {
                "num": 10,
                "title": "The First 90 Days Survival Guide for Junior Cloud & SRE Engineers",
                "tagline": "Your roadmap for navigating production access, avoiding outages, and earning trust.",
                "body": "As a junior cloud engineer, your primary goal is to develop deep systems empathy, respect production blast radiuses, and master telemetry before executing state changes. Never run a command you do not understand on a production terminal.",
                "callout_title": "The Production Terminal Safeguard",
                "callout_body": "Before pressing 'Enter' on any kubectl or terraform command in production, pause and ask: 'What happens if this fails? What is my rollback command?' Always have a peer verify your plan.",
                "table_data": [
                    ["Timeline Milestone", "Key Objective & Deliverable", "Success Metric"],
                    ["Week 1: Tooling & Read-Only Access", "Configure AWS CLI, kubectl contexts, VPN access, and audit Dashboards", "Successfully queried Grafana metrics and Kubernetes pods in staging"],
                    ["Week 2: First Staging Deploy", "Deploy a microservice update through CI/CD to staging; inspect logs", "Executed clean deployment; verified health check endpoints"],
                    ["Day 30: Runbook Authoring", "Identify a tribal knowledge task; author an official documented runbook", "Runbook approved by senior SRE; used by team in production"],
                    ["Day 60: Shadow On-Call", "Shadow senior SRE during primary on-call rotation; participate in triage", "Assisted in writing 2 postmortems; accurately diagnosed alert causes"],
                    ["Day 90: Production Contributor", "Safely execute Terraform PR adding new cloud infrastructure in prod", "Zero downtime; plan reviewed and verified against drift"]
                ]
            }
        ]
    },

    "data-analyst": {
        "title": "Data Analyst & Analytics Engineering Handbook",
        "subtitle": "Modern Data Stack, SQL Optimization, ETL Pipelines, Data Contracts & Executive BI Dashboards",
        "header_title": "Data Analyst & Analytics Engineering Handbook",
        "primary_color": "#7c2d12", # Amber / Brown / Orange
        "accent_color": "#d97706",
        "light_color": "#fffbeb",
        "lead_paragraph": "A definitive field reference for junior and transitioning Data Analysts and Analytics Engineers navigating modern data warehouses, high-performance SQL, dbt data modeling, automated ETL/ELT pipelines, data governance, and executive business intelligence.",
        "chapters": [
            {
                "num": 1,
                "title": "Data Team Structure, Business Stakeholders & Decision Support",
                "tagline": "How data practitioners partner with product, marketing, finance, and engineering.",
                "body": "In high-performing data organizations, Data Analysts do not function as 'ad-hoc query vending machines'. Analysts act as strategic thought partners who translate fuzzy business queries into rigorous statistical hypotheses and actionable executive metrics. Analysts collaborate with Data Engineers (who build raw ingest pipelines) and Analytics Engineers (who build dbt transformation models).",
                "callout_title": "The Data Request Rule",
                "callout_body": "When a stakeholder asks for 'a dump of all user transactions in Excel', probe for the underlying decision: 'What business problem are you trying to solve? Let's design a dashboard answering that directly.'",
                "table_data": [
                    ["Role", "Primary Domain", "Critical Interface with Analysts"],
                    ["VP of Product / Business", "Revenue growth, retention, OKRs & strategic priorities", "Executive summary dashboards, cohort retention analysis"],
                    ["Data Engineer", "Ingestion pipelines, raw Kafka/Spark streams, warehouse uptime", "Raw data schemas, API ingestion SLAs, data lake partitioning"],
                    ["Analytics Engineer", "dbt transformation models, clean dimensional data marts", "Testing contracts, star schemas, reusable metric definitions"],
                    ["Data Analyst", "Exploratory analysis, SQL queries, dashboard design, A/B testing", "Translating data insights into operational business recommendations"],
                    ["Machine Learning Engineer", "Predictive algorithms, recommendation models, feature stores", "Feature validation, training dataset labeling, target metric definitions"]
                ]
            },
            {
                "num": 2,
                "title": "Analytics Agile, Sprint Planning & Managing Ad-Hoc Requests",
                "tagline": "Balancing long-term data warehouse modeling against urgent stakeholder requests.",
                "body": "A major challenge in data analytics is managing the onslaught of ad-hoc 'urgent' queries from marketing, finance, and executives. Elite data teams protect their capacity by implementing a 70/30 resource allocation: 70% of sprint capacity is committed to planned roadmap projects (e.g. churn model, self-serve data marts), while 30% is allocated to an 'On-Call Data Triage' rotation for immediate business requests.",
                "callout_title": "Ad-Hoc Ticket Protocol",
                "callout_body": "Every incoming ad-hoc data request must have an assigned business impact rating and target decision deadline. Unprioritized Slack messages are routed through the team Jira backlog.",
                "table_data": [
                    ["Ceremony", "Frequency & Focus", "Data Analyst's Deliverable"],
                    ["Data Sprint Planning", "Every 2 weeks (60 mins)", "Estimate data modeling and dashboard tickets; assign ad-hoc rotation"],
                    ["Daily Data Standup", "Daily (15 mins)", "Review active analyses, identify upstream data quality blocks"],
                    ["Metric Definition Review", "Monthly (45 mins)", "Cross-functional consensus on core metric formulas (e.g. definition of 'Active User')"],
                    ["Executive Insights Briefing", "Monthly (30 mins)", "Present key trends, anomaly findings, and strategic recommendations to leadership"],
                    ["Data Retrospective", "End of Sprint (45 mins)", "Analyze pipeline breakages, dashboard adoption rates, and ad-hoc volume"]
                ]
            },
            {
                "num": 3,
                "title": "Version-Controlled SQL, dbt (Data Build Tool) & Git Workflows",
                "tagline": "Applying software engineering rigor to data transformations.",
                "body": "Analytics code belongs in Git, not floating in unversioned BI query tabs. dbt (data build tool) enables analysts to write modular, reusable SQL select statements with built-in version control, lineage graphing, and automated testing. Every query runs through pull request reviews where data schemas, column naming conventions, and query performance are validated before deploying to production.",
                "callout_title": "The Single Source of Truth Invariant",
                "callout_body": "Never compute core business metrics (e.g. Gross Merchandise Value) with custom inline SQL in multiple dashboards. Define the metric once in a centralized dbt model and reference it everywhere.",
                "table_data": [
                    ["dbt Concept", "Function & Mechanism", "Data Analyst Best Practice"],
                    ["Staging Models (stg_)", "Clean, rename, and cast raw source table fields", "1-to-1 with raw source tables; zero business joins or aggregations here"],
                    ["Intermediate Models (int_)", "Complex joins, business logic calculations, window functions", "Decompose intricate transformations into testable modular steps"],
                    ["Marts Models (fct_ / dim_)", "Dimensional star schemas optimized for BI consumption", "Fast querying; documented business definitions for every column"],
                    ["Generic Schema Tests", "Automated validations: not_null, unique, accepted_values", "Run on every CI pull request to prevent duplicate keys or missing foreign IDs"]
                ]
            },
            {
                "num": 4,
                "title": "The Modern Data Stack: Data Warehouses & Dimensional Modeling",
                "tagline": "Architecting Snowflake, BigQuery, and Databricks with Kimball Star Schemas.",
                "body": "Modern Cloud Data Warehouses (Snowflake, BigQuery, Amazon Redshift) employ columnar storage architectures designed for high-throughput analytical scans. Analysts structure data using Kimball Dimensional Modeling: Fact Tables (representing numeric business events: orders, clicks, payments) and Dimension Tables (representing context: users, products, dates).",
                "callout_title": "Columnar Storage Performance Rule",
                "callout_body": "Never run 'SELECT *' on production tables with hundreds of columns and billions of rows. Only select the exact columns needed to minimize data scan costs and execution times.",
                "table_data": [
                    ["Data Modeling Component", "Characteristics & Purpose", "Example Columns"],
                    ["Fact Table (fct_orders)", "Narrow, deep table containing measurable numeric business events and foreign keys", "order_id, user_id, product_id, order_timestamp, amount_cents, discount_cents"],
                    ["Dimension Table (dim_users)", "Wide, descriptive table containing context and attributes", "user_id, signup_date, acquisition_channel, country_code, subscription_tier"],
                    ["Slowly Changing Dimension (SCD-2)", "Tracks historical attribute changes over time using validity dates", "user_id, plan_name, is_current, valid_from_timestamp, valid_to_timestamp"],
                    ["Aggregate Rollup Mart", "Pre-calculated daily or monthly summaries for executive reporting", "report_date, department_id, total_revenue, active_headcount, gross_margin_pct"]
                ]
            },
            {
                "num": 5,
                "title": "High-Performance SQL Mastery: Window Functions & Query Tuning",
                "tagline": "Writing clean, efficient, and cost-effective analytical SQL queries.",
                "body": "Advanced SQL is the core technical weapon of the data analyst. Mastery of Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM OVER PARTITION) enables cohort analysis, running totals, and deduplication without costly self-joins. Analysts must understand execution query plans (EXPLAIN), partition pruning, and cluster keys to avoid table scan timeouts.",
                "callout_title": "The Safe Deduplication Pattern",
                "callout_body": "Use ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) WHERE row_num = 1 to guarantee deterministic, exact deduplication across mutable source logs.",
                "table_data": [
                    ["SQL Technique", "Syntax Pattern", "Common Analytics Use Case"],
                    ["LAG / LEAD", "LAG(revenue, 1) OVER (PARTITION BY store_id ORDER BY month)", "Computing Month-over-Month (MoM) revenue growth percentages"],
                    ["Running Total", "SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at)", "Calculating cumulative customer lifetime value (LTV) progression"],
                    ["Cohort Grouping", "MIN(order_date) OVER (PARTITION BY user_id)", "Establishing first purchase date for cohort retention heatmaps"],
                    ["Partition Pruning", "WHERE date_partition >= CURRENT_DATE - INTERVAL '30 days'", "Scanning only relevant storage micro-partitions; reducing query cost by 90%"]
                ]
            },
            {
                "num": 6,
                "title": "Data Quality, Testing Contracts & Observability",
                "tagline": "Detecting anomalies, silent pipeline corruptions, and schema drift.",
                "body": "The worst data failure is not a crashed pipeline; it is a silently corrupted pipeline that completes successfully and populates executive dashboards with false numbers. Data Observability monitors four core pillars: Freshness (is the data up to date?), Volume (did we receive the expected row count?), Schema (did a column name or type change?), and Distribution (are null rates or averages anomalous?).",
                "callout_title": "Upstream Schema Contract",
                "callout_body": "Software engineers must never alter production database column names or types without notifying data teams. Enforce Schema Contracts in CI to prevent broken downstream pipelines.",
                "table_data": [
                    ["Data Failure Mode", "Root Cause", "Automated Detection Defense"],
                    ["Stale Executive Dashboard", "Airflow ETL job hung without alerting on-call", "Data Freshness SLA alerts (warn if max(created_at) > 4 hours old)"],
                    ["Duplicate Revenue Numbers", "Upstream retry triggered duplicate webhook ingest", "Unique primary key constraint tests running on dbt models"],
                    ["Sudden 0% Conversion Rate", "Frontend event tracking SDK was dropped in mobile release", "Volume anomaly detection alerting on drop in tracked events/hour"],
                    ["Corrupted Currency Calculations", "Upstream API changed response from USD to Cents", "Range check tests: assert transaction_amount between $0.01 and $10,000"]
                ]
            },
            {
                "num": 7,
                "title": "A/B Testing, Experimentation & Statistical Rigor",
                "tagline": "Distinguishing true business signals from statistical noise.",
                "body": "Modern product teams rely on controlled A/B experimentation to validate feature changes. Analysts must enforce rigorous statistical methodology: calculating required sample sizes before launch, establishing statistical power (typically 80%) and significance (alpha = 0.05), and guarding against common pitfalls like p-hacking or early stopping.",
                "callout_title": "The Peeking Problem Invariant",
                "callout_body": "Never declare an A/B test winner after 2 days just because p < 0.05. Tests must run for full business cycle iterations (minimum 14 days) to capture weekday vs weekend user variances.",
                "table_data": [
                    ["Experimentation Term", "Mathematical Definition", "Practical Business Meaning"],
                    ["Null Hypothesis (H0)", "The assumption that the new feature has no effect on the target metric", "Baseline assumption that treatment and control have identical performance"],
                    ["P-Value", "The probability of observing results as extreme assuming H0 is true", "Threshold for statistical significance (p < 0.05 indicates < 5% chance of false positive)"],
                    ["Sample Size Determination", "Calculated based on Minimum Detectable Effect (MDE) and variance", "Ensures enough users enter the test to detect meaningful revenue changes"],
                    ["Sample Ratio Mismatch (SRM)", "Chi-square goodness-of-fit test comparing observed vs expected traffic split", "Detects engineering bugs where users are dropped or assigned unequally (e.g. 48/52 split)"]
                ]
            },
            {
                "num": 8,
                "title": "Data Governance, Security, PII Masking & Compliance",
                "tagline": "Protecting customer privacy under GDPR, CCPA, and enterprise security standards.",
                "body": "Data practitioners hold access to the organization's most sensitive customer records. Analysts must strictly adhere to data governance standards: Personally Identifiable Information (PII) such as passwords, credit cards, social security numbers, and email addresses must be masked or hashed before reaching analytical layers. Access to raw production tables is governed by Role-Based Access Control (RBAC).",
                "callout_title": "The PII Invariant",
                "callout_body": "Never export customer names, phone numbers, or credit card digits to local CSV files or unencrypted spreadsheets. Always use anonymized customer surrogate keys (e.g. user_hash).",
                "table_data": [
                    ["Data Classification", "Examples", "Mandatory Storage & Query Policy"],
                    ["Restricted / PII", "Customer name, physical address, national ID, phone number", "Column-level encryption; masked by default in all analytics queries"],
                    ["Confidential", "Transaction amounts, internal salaries, gross margins", "Restricted to authorized finance and leadership analytical groups"],
                    ["Internal Operational", "Page view logs, web clickstreams, service latencies", "Accessible to all internal engineering and data teams"],
                    ["Public", "Public marketing website blog posts, published whitepapers", "No access restrictions"]
                ]
            },
            {
                "num": 9,
                "title": "Data & Analytics Lexicon: 40 Essential Industry Terms",
                "tagline": "The essential vocabulary required to speak the language of analytics.",
                "body": "Mastering analytics terminology enables seamless collaboration with data engineers, executives, and product leaders. Learn these 40 terms thoroughly.",
                "callout_title": "Metric Definition Discipline",
                "callout_body": "Never use the word 'Churn' without clarifying whether it refers to Customer Logo Churn (% of customers lost) or Net Revenue Churn (% of MRR lost).",
                "table_data": [
                    ["Term", "Industry Definition & Practical Engineering Context"],
                    ["Grain", "The level of detail represented by a single row in a table (e.g. one row per transaction vs one row per customer per day)."],
                    ["Dimensional Modeling", "A design technique for data warehouses using Fact and Dimension tables to optimize for analytical queries."],
                    ["Star Schema", "A database structure consisting of one central fact table referencing multiple surrounding dimension tables."],
                    ["dbt (Data Build Tool)", "A transformation tool that allows analysts to write data pipeline queries as modular SQL models with version control."],
                    ["Window Function", "A SQL function that performs calculations across a set of table rows that are related to the current row without collapsing them."],
                    ["Cohort Analysis", "A study that groups users by a shared characteristic (e.g. signup month) to track behavioral trends and retention over time."],
                    ["Sample Ratio Mismatch (SRM)", "A statistical check verifying that an A/B test split (e.g. 50/50) matches the actual traffic received without assignment bias."],
                    ["Data Lineage", "The lifecycle path that tracks data from its raw ingestion origin, through transformations, to its final dashboard destination."],
                    ["ELT vs ETL", "Extract-Load-Transform (modern pattern loading raw data directly into the warehouse before transforming) vs Extract-Transform-Load."],
                    ["Slowly Changing Dimension (SCD)", "A methodology used to track and preserve historical changes to dimension records over time."]
                ]
            },
            {
                "num": 10,
                "title": "The First 90 Days Survival Guide for Junior Data Analysts",
                "tagline": "Your roadmap for mastering the company data model, building trust, and driving decisions.",
                "body": "Your first 90 days as a data analyst are about building deep domain intuition, understanding upstream quirks in raw data, and earning trust by verifying every query total against official finance reports before publishing dashboards.",
                "callout_title": "The Sanity Check Rule",
                "callout_body": "Before sharing any dashboard or query result with stakeholders, always sanity check the numbers: Does the total match the company billing report? Do row counts look physically plausible?",
                "table_data": [
                    ["Timeline Milestone", "Key Objective & Deliverable", "Success Metric"],
                    ["Week 1: Data Access & Warehouse Setup", "Obtain warehouse permissions; configure dbt profile and BI tool access", "Executed first SELECT query against staging data warehouse"],
                    ["Week 2: Shadowing & Entity Learning", "Map out the core entities: Users, Orders, Products, and Payments", "Created an entity relationship sketch; understood primary keys and foreign joins"],
                    ["Day 30: First Business Analysis", "Answer a prioritized ad-hoc stakeholder question with SQL and documentation", "Delivered clear, verified findings with zero arithmetic or join errors"],
                    ["Day 60: dbt Model Contribution", "Author a new dbt mart model with schema tests and documentation", "PR reviewed and merged into the production analytics repository"],
                    ["Day 90: Executive Dashboard Launch", "Build and publish an automated executive KPI dashboard for product or marketing", "Dashboard adopted by leadership for weekly business review meetings"]
                ]
            }
        ]
    }
}


def build_role_handbook_pdf(role_id: str, output_path: Path) -> int:
    """Build a publication-quality 12-page role handbook PDF for a specific role."""
    config = ROLE_CONFIGS.get(role_id)
    if not config:
        # Default to software developer if invalid
        config = ROLE_CONFIGS["software-developer"]
        role_id = "software-developer"

    output_path.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # Custom typography
    title_style = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        textColor=colors.HexColor("#0f172a"),
        alignment=0,
    )
    subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor(config["primary_color"]),
        alignment=0,
    )
    h1_style = ParagraphStyle(
        "ChapterH1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4,
    )
    h2_style = ParagraphStyle(
        "ChapterH2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor(config["primary_color"]),
        spaceAfter=3,
    )
    body_style = ParagraphStyle(
        "ChapterBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )
    callout_title_style = ParagraphStyle(
        "CalloutTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor(config["primary_color"]),
    )
    callout_body_style = ParagraphStyle(
        "CalloutBody",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1e293b"),
    )
    table_cell_header = ParagraphStyle(
        "CellHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )
    table_cell_body = ParagraphStyle(
        "CellBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(
        Paragraph("PRAXIS ENGINEERING PLATFORM &bull; INDUSTRY READINESS SERIES", ParagraphStyle(
            "Badge", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=colors.HexColor(config["primary_color"])
        ))
    )
    story.append(Spacer(1, 10))
    story.append(Paragraph(config["title"], title_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph(config["subtitle"], subtitle_style))
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=3, color=colors.HexColor(config["primary_color"]), spaceAfter=20))

    story.append(
        Paragraph(
            config["lead_paragraph"],
            ParagraphStyle("CoverLead", fontName="Helvetica", fontSize=10.5, leading=15, textColor=colors.HexColor("#475569"))
        )
    )
    story.append(Spacer(1, 20))

    meta_data = [
        [Paragraph("<b>Curriculum Track:</b>", table_cell_body), Paragraph(config["title"].replace(" Foundations Handbook", ""), table_cell_body)],
        [Paragraph("<b>Audience:</b>", table_cell_body), Paragraph("Junior Engineers, Transitioning Developers, Technical Interns", table_cell_body)],
        [Paragraph("<b>Platform Version:</b>", table_cell_body), Paragraph("Praxis Workplace Simulation v2.4 (Enterprise Edition)", table_cell_body)],
        [Paragraph("<b>Core Assessment:</b>", table_cell_body), Paragraph("5 MEQ Knowledge Check & 40 Production Engineering Problems", table_cell_body)],
        [Paragraph("<b>Publication Date:</b>", table_cell_body), Paragraph("October 2026 Edition &bull; Confidential & Proprietary", table_cell_body)],
    ]
    meta_table = Table(meta_data, colWidths=[150, 354])
    meta_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(config["light_color"])),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(config["accent_color"])),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ])
    )
    story.append(meta_table)

    story.append(Spacer(1, 25))
    story.append(
        Paragraph(
            "<b>NOTICE TO LEARNERS:</b> This handbook serves as the foundational text for the Praxis Workplace Simulation. Thorough review of all 10 chapters is required prior to taking the 5-Question Readiness Assessment and accessing the 40 Production Problems (20 Basic with Help Statements + 20 Intermediate).",
            ParagraphStyle("CoverNotice", fontName="Helvetica", fontSize=8.5, leading=12, textColor=colors.HexColor("#64748b"))
        )
    )
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: TABLE OF CONTENTS & SYLLABUS OVERVIEW
    # =========================================================================
    story.append(Paragraph("TABLE OF CONTENTS & CURRICULUM SYLLABUS", h1_style))
    story.append(Paragraph("Overview of the 10 Core Knowledge Domains in this Handbook", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=14))

    toc_data = [
        [Paragraph("<b>Ch.</b>", table_cell_header), Paragraph("<b>Chapter Title</b>", table_cell_header), Paragraph("<b>Target Page</b>", table_cell_header)]
    ]
    for ch in config["chapters"]:
        toc_data.append([
            Paragraph(f"<b>{ch['num']}</b>", table_cell_body),
            Paragraph(f"<b>{ch['title']}</b><br/><font color='#64748b'>{ch['tagline']}</font>", table_cell_body),
            Paragraph(f"Page {ch['num'] + 2} of 12", table_cell_body),
        ])

    toc_table = Table(toc_data, colWidths=[30, 404, 70])
    toc_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(config["primary_color"])),
            ("ALIGN", (0, 0), (0, -1), "CENTER"),
            ("ALIGN", (2, 0), (2, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ])
    )
    story.append(toc_table)
    story.append(Spacer(1, 14))
    story.append(
        Paragraph(
            "<b>Learning Invariant:</b> The 5-question knowledge check draws questions directly from these 10 chapters. Each syllabus topic corresponds to practical scenarios in the 40 production problems.",
            ParagraphStyle("TocNote", fontName="Helvetica-Oblique", fontSize=8, leading=11, textColor=colors.HexColor("#475569"))
        )
    )
    story.append(PageBreak())

    # =========================================================================
    # PAGES 3 to 12: CHAPTERS 1 to 10
    # =========================================================================
    for idx, ch in enumerate(config["chapters"]):
        # Chapter header
        story.append(Paragraph(f"CHAPTER {ch['num']}: {ch['title'].upper()}", h1_style))
        story.append(Paragraph(ch["tagline"], subtitle_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor(config["accent_color"]), spaceAfter=10))

        # Core narrative
        story.append(Paragraph(ch["body"], body_style))
        story.append(Spacer(1, 6))

        # Callout box
        callout_data = [
            [Paragraph(f"<b>FIELD STANDARD: {ch['callout_title'].upper()}</b>", callout_title_style)],
            [Paragraph(ch["callout_body"], callout_body_style)]
        ]
        callout_table = Table(callout_data, colWidths=[504])
        callout_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(config["light_color"])),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(config["accent_color"])),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ])
        )
        story.append(callout_table)
        story.append(Spacer(1, 10))

        # Data table
        headers = [Paragraph(f"<b>{col}</b>", table_cell_header) for col in ch["table_data"][0]]
        rows = []
        num_cols = len(ch["table_data"][0])
        col_widths = [110, 194, 200] if num_cols == 3 else [100, 130, 134, 140] if num_cols == 4 else [100, 404]

        rows.append(headers)
        for r in ch["table_data"][1:]:
            rows.append([Paragraph(str(cell), table_cell_body) for cell in r])

        data_table = Table(rows, colWidths=col_widths)
        data_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(config["primary_color"])),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ])
        )
        story.append(data_table)

        # Ensure page break after each chapter except the very last one
        if idx < len(config["chapters"]) - 1:
            story.append(PageBreak())

    # Build canvas
    canvas_maker = NumberedCanvas
    # Set custom header attribute on canvas
    def canvas_factory(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        c._role_header = config["header_title"]
        return c

    doc.build(story, canvasmaker=canvas_factory)
    return 12


def build_all_role_handbooks(assets_dir: Path) -> dict[str, Path]:
    """Generate all 3 role handbooks plus the generic fallback."""
    assets_dir.mkdir(parents=True, exist_ok=True)
    generated = {}

    role_mapping = {
        "software-developer": "Software_Developer_Handbook.pdf",
        "cloud-engineer": "Cloud_Engineer_Handbook.pdf",
        "data-analyst": "Data_Analyst_Handbook.pdf",
    }

    for role_id, filename in role_mapping.items():
        pdf_path = assets_dir / filename
        build_role_handbook_pdf(role_id, pdf_path)
        generated[role_id] = pdf_path
        print(f"Generated 12-page role handbook: {pdf_path}")

    # Also build generic handbook if needed
    generic_path = assets_dir / "Praxis_Industry_Foundations_Handbook.pdf"
    if not generic_path.is_file():
        build_role_handbook_pdf("software-developer", generic_path)
        generated["generic"] = generic_path

    return generated


if __name__ == "__main__":
    out_dir = Path(__file__).resolve().parents[1] / "frontend" / "assets"
    build_all_role_handbooks(out_dir)
