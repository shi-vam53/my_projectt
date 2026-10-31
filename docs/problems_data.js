// Praxis Client-Side Offline Curriculum & Problem Bank Engine
window.PRAXIS_OFFLINE_DATA = {
  "ROLES": [
    {
      "id": "software-developer",
      "title": "Software Developer",
      "badge": "Application & Systems Architecture",
      "description": "Design high-throughput microservices, clean REST/gRPC APIs, transactional data models, automated test suites, and distributed web applications.",
      "icon": "code",
      "core_skills": [
        "Python / JavaScript / Go",
        "REST & GraphQL APIs",
        "PostgreSQL & Redis",
        "System Design",
        "Unit & Integration Testing",
        "CI/CD & Git"
      ]
    },
    {
      "id": "cloud-engineer",
      "title": "Cloud Engineer",
      "badge": "Cloud Infrastructure & SRE",
      "description": "Master distributed systems resilience, Kubernetes, zero-downtime deployments, Terraform Infrastructure-as-Code, and SLI/SLO error budgets.",
      "icon": "cloud",
      "core_skills": [
        "Kubernetes & Docker",
        "Terraform & IaC",
        "AWS / Cloud Networking",
        "Prometheus & Grafana",
        "Linux & Shell",
        "Incident Response"
      ]
    },
    {
      "id": "data-analyst",
      "title": "Data Analyst",
      "badge": "Data Pipelines & Analytics",
      "description": "Build automated ETL pipelines, analytics data models, high-performance SQL aggregations, anomaly detection models, and executive BI dashboards.",
      "icon": "chart",
      "core_skills": [
        "SQL & Relational Modeling",
        "Python (Pandas / NumPy)",
        "ETL & Data Warehousing",
        "Tableau / BI Dashboards",
        "Statistical Modeling",
        "Data Quality & SLAs"
      ]
    }
  ],
  "QUIZ_QUESTIONS": [
      {
          "id": "q1",
          "question": "At 14:15 UTC, a new release causes p99 latency to jump from 45ms to 2,800ms and 5xx errors to surge to 8%. What is the immediate first action the on-call engineer must take according to standard SRE incident triage?",
          "options": [
              {
                  "id": "a",
                  "text": "SSH into production instances to run live GDB/heap profilers and attach debuggers to inspect memory."
              },
              {
                  "id": "b",
                  "text": "Trigger an immediate rollback or disable the release feature flag, restoring service health before offline diagnosis."
              },
              {
                  "id": "c",
                  "text": "Open a general Slack thread asking team members if anyone has time to review their pull requests."
              },
              {
                  "id": "d",
                  "text": "Double the database max connection pool size and continually restart pods until memory usage drops."
              }
          ],
          "correct": "b",
          "explanation": "Incident triage rule #1 is 'Mitigate first, diagnose offline.' Rolling back or toggling off the feature flag immediately protects customer SLA/SLO while preserving logs/traces for root cause analysis."
      },
      {
          "id": "q2",
          "question": "Your microservice has an agreed SLO of 99.9% availability over a rolling 30-day period. Midway through the month, an outage exhausts 100% of your remaining error budget. According to standard SRE discipline, what operational policy takes effect?",
          "options": [
              {
                  "id": "a",
                  "text": "Change the SLO definition to 99.0% so the service remains in compliance."
              },
              {
                  "id": "b",
                  "text": "Non-critical feature deployments freeze; engineering capacity shifts exclusively to reliability, architectural hardening, and automated test gates."
              },
              {
                  "id": "c",
                  "text": "Increase compute node count on Kubernetes to artificially mask the errors."
              },
              {
                  "id": "d",
                  "text": "Continue shipping planned roadmap features as long as local unit tests pass in CI."
              }
          ],
          "correct": "b",
          "explanation": "An exhausted error budget is the mathematical governor balancing velocity with reliability: new feature releases pause while engineering remediates systemic failure modes."
      },
      {
          "id": "q3",
          "question": "You need to rename a column in a high-traffic PostgreSQL table used by 4 microservices. What is the safest deployment sequence to avoid production downtime?",
          "options": [
              {
                  "id": "a",
                  "text": "Execute 'ALTER TABLE orders RENAME COLUMN status TO order_status;' during peak business hours in production."
              },
              {
                  "id": "b",
                  "text": "Multi-phase expand/contract migration: add new column, dual-write to both columns, backfill legacy rows, update readers, then drop old column after all services upgrade."
              },
              {
                  "id": "c",
                  "text": "Take down the entire database cluster for a 4-hour scheduled outage on Saturday morning for manual script execution."
              },
              {
                  "id": "d",
                  "text": "Write a cron job that copies data between columns every 5 minutes."
              }
          ],
          "correct": "b",
          "explanation": "Zero-downtime database migrations follow the expand/contract (parallel run) pattern to prevent breaking existing microservices reading the legacy schema."
      },
      {
          "id": "q4",
          "question": "Your dashboard shows average response time is 32ms, but customer churn complaints are spiking. You investigate percentiles and discover p50 is 18ms, p95 is 120ms, and p99 is 4,800ms. What does this indicate?",
          "options": [
              {
                  "id": "a",
                  "text": "The system is functioning optimally because the average is well under 100ms."
              },
              {
                  "id": "b",
                  "text": "1% of your requests (frequently heavy queries or high-volume enterprise accounts) are experiencing severe 5-second stalls, which averages hide."
              },
              {
                  "id": "c",
                  "text": "The monitoring agent is broken and emitting false telemetry."
              },
              {
                  "id": "d",
                  "text": "Client internet connections are solely responsible for the delay."
              }
          ],
          "correct": "b",
          "explanation": "Averages conceal tail latency. A p99 of 4,800ms indicates serious head-of-line blocking, connection pool starvation, or unindexed database queries affecting significant traffic."
      },
      {
          "id": "q5",
          "question": "A junior developer requests the production PostgreSQL superuser ('postgres') credentials to inspect why a customer report is showing incorrect sums. What is the correct response under Principle of Least Privilege (PoLP)?",
          "options": [
              {
                  "id": "a",
                  "text": "Share the credentials via encrypted Slack direct message and ask them not to run 'DROP TABLE'."
              },
              {
                  "id": "b",
                  "text": "Reject direct production DB access; provide sanitized data in a staging environment or use read-only query tooling with audited access and masked PII."
              },
              {
                  "id": "c",
                  "text": "Temporarily give them AWS root console access to take a manual snapshot."
              },
              {
                  "id": "d",
                  "text": "Advise them to write a script that dumps the production database to an open S3 bucket."
              }
          ],
          "correct": "b",
          "explanation": "Direct production write or superuser credentials must never be shared. Developers diagnose issues using sanitized staging data or audited read-only interfaces with sensitive PII masked."
      },
      {
          "id": "q6",
          "question": "In a cross-functional engineering team using the RACI framework, a new payment gateway migration is being planned. Who holds the 'Accountable' (A) designation for the technical architecture and delivery?",
          "options": [
              {
                  "id": "a",
                  "text": "The entire engineering department collectively via consensus voting."
              },
              {
                  "id": "b",
                  "text": "The designated Engineering Lead or Staff Architect who makes final technical decisions and owns the outcome."
              },
              {
                  "id": "c",
                  "text": "The external third-party payment vendor support staff."
              },
              {
                  "id": "d",
                  "text": "The junior intern tasked with writing unit tests."
              }
          ],
          "correct": "b",
          "explanation": "In RACI, exactly one individual is Accountable (A) for each deliverable to ensure clear ownership, prevent diffusion of responsibility, and accelerate high-quality architectural decisions."
      },
      {
          "id": "q7",
          "question": "During a 15-minute daily standup, which of the following is the most effective and professional status update?",
          "options": [
              {
                  "id": "a",
                  "text": "Yesterday I worked on tickets. Today I will work on more tickets. No blockers."
              },
              {
                  "id": "b",
                  "text": "Yesterday I completed the Redis cache invalidation on PR #412; today I am writing integration tests for the rate limiter. I need a review from Alex on the auth schema."
              },
              {
                  "id": "c",
                  "text": "Yesterday I spent 4 hours debating whether spaces or tabs are better in Python on social media."
              },
              {
                  "id": "d",
                  "text": "I have several architectural disagreements with the product roadmap that will take 45 minutes to explain right now."
              }
          ],
          "correct": "b",
          "explanation": "Standup updates should be concise, specific, and action-oriented: (1) what was finished, (2) what is being tackled today, and (3) explicit blockers or review dependencies."
      },
      {
          "id": "q8",
          "question": "Why do agile engineering teams use the non-linear Fibonacci sequence (1, 2, 3, 5, 8, 13) for estimating story points rather than literal calendar hours?",
          "options": [
              {
                  "id": "a",
                  "text": "To make sprint planning take longer and confuse project managers."
              },
              {
                  "id": "b",
                  "text": "Because estimation uncertainty grows exponentially with task complexity; relative sizing reflects uncertainty and avoids false precision."
              },
              {
                  "id": "c",
                  "text": "Because story points are directly converted into employee overtime pay at sprint end."
              },
              {
                  "id": "d",
                  "text": "Because standard calendar hours are legally prohibited in agile software contracts."
              }
          ],
          "correct": "b",
          "explanation": "Story points measure relative complexity, risk, and uncertainty. Small tasks are easy to estimate precisely, while large tasks carry exponential uncertainty, which the Fibonacci scale mathematically captures."
      },
      {
          "id": "q9",
          "question": "What is the primary operational advantage of Trunk-Based Development compared to maintaining long-lived feature branches for months?",
          "options": [
              {
                  "id": "a",
                  "text": "It eliminates the need for automated CI tests and code reviews."
              },
              {
                  "id": "b",
                  "text": "It prevents painful merge conflicts ('merge hell'), minimizes blast radius through small incremental PRs, and accelerates feedback loops."
              },
              {
                  "id": "c",
                  "text": "It allows developers to deploy experimental unreviewed code directly to production without testing."
              },
              {
                  "id": "d",
                  "text": "It reduces git repository file size on disk by deleting branch history."
              }
          ],
          "correct": "b",
          "explanation": "Trunk-based development encourages small, frequent rebases onto main. This drastically reduces merge conflicts, keeps code continuously integrated, and enables rapid canary deployments."
      },
      {
          "id": "q10",
          "question": "Which git commit message adheres to Conventional Commit standards and clearly communicates intent to automated release changelog generators?",
          "options": [
              {
                  "id": "a",
                  "text": "Fixed stuff in auth and updated various files"
              },
              {
                  "id": "b",
                  "text": "feat(auth): implement token refresh rotation with Redis blacklist"
              },
              {
                  "id": "c",
                  "text": "WIP commit before weekend please do not review yet"
              },
              {
                  "id": "d",
                  "text": "Updated code according to manager instructions"
              }
          ],
          "correct": "b",
          "explanation": "Conventional Commits use structured types (feat, fix, refactor, chore) and scopes (auth) that automated semantic versioning tools can parse to generate changelogs and determine semantic version bumps."
      },
      {
          "id": "q11",
          "question": "A critical customer bug occurs only on the Production tier, but works fine on the developer's workstation running SQLite. What foundational infrastructure principle was violated?",
          "options": [
              {
                  "id": "a",
                  "text": "Test-Driven Development (TDD)."
              },
              {
                  "id": "b",
                  "text": "Environment Parity (The Twelve-Factor App methodology requiring dev, staging, and prod to use identical database engines and dependencies)."
              },
              {
                  "id": "c",
                  "text": "Agile User Story Mapping."
              },
              {
                  "id": "d",
                  "text": "Scrum Sprint Retrospective Cadence."
              }
          ],
          "correct": "b",
          "explanation": "Twelve-Factor Factor X (Dev/prod parity) mandates that development, staging, and production environments mirror each other in tooling, database backends, and backing services to eliminate 'works on my machine' defects."
      },
      {
          "id": "q12",
          "question": "How should API private keys, database passwords, and third-party webhook signing secrets be handled in production software?",
          "options": [
              {
                  "id": "a",
                  "text": "Hardcoded as constants in public git repositories so all developers have access."
              },
              {
                  "id": "b",
                  "text": "Injected at runtime via secure environment variables managed by a secret vault (e.g. HashiCorp Vault, AWS Secrets Manager) and never committed to version control."
              },
              {
                  "id": "c",
                  "text": "Printed to stdout during application startup logs for easy debugging."
              },
              {
                  "id": "d",
                  "text": "Sent in plaintext via email to all team members during onboarding."
              }
          ],
          "correct": "b",
          "explanation": "Secrets must never be stored in source code. They must be injected dynamically via environment variables from dedicated secret management systems with encryption at rest and audit logging."
      },
      {
          "id": "q13",
          "question": "What is a Canary Release deployment strategy?",
          "options": [
              {
                  "id": "a",
                  "text": "Taking down all production servers and replacing them simultaneously during maintenance windows."
              },
              {
                  "id": "b",
                  "text": "Routing a small percentage (e.g. 2% to 5%) of live production traffic to the new software version while monitoring error rates before expanding rollout to 100%."
              },
              {
                  "id": "c",
                  "text": "Testing code exclusively on a QA engineer's local laptop before shipping to customers."
              },
              {
                  "id": "d",
                  "text": "Deploying code to production without any automated rollback mechanism."
              }
          ],
          "correct": "b",
          "explanation": "Canary deployments introduce new releases to a minimal subset of real users to validate system health, latencies, and logs under real production conditions before full fleet exposure."
      },
      {
          "id": "q14",
          "question": "In a microservices architecture with 15 inter-communicating services, how do engineers trace a single slow HTTP request that traversed multiple API gateways, message queues, and worker daemons?",
          "options": [
              {
                  "id": "a",
                  "text": "By asking all 15 service owners to check their personal terminal logs simultaneously."
              },
              {
                  "id": "b",
                  "text": "By propagating a unique Distributed Trace ID (Correlation ID) across HTTP headers and log records throughout the entire invocation path."
              },
              {
                  "id": "c",
                  "text": "By temporarily disabling firewalls between all microservices."
              },
              {
                  "id": "d",
                  "text": "By restarting all 15 services and seeing if performance improves."
              }
          ],
          "correct": "b",
          "explanation": "Distributed tracing uses a unique Trace ID injected into headers (e.g. W3C TraceContext) across service hops, allowing observability tools (Jaeger, OpenTelemetry) to reconstruct the full end-to-end call waterfall."
      },
      {
          "id": "q15",
          "question": "What is the core distinction between an SLI (Service Level Indicator) and an SLO (Service Level Objective)?",
          "options": [
              {
                  "id": "a",
                  "text": "SLIs are legal contracts with monetary penalties, while SLOs are raw CPU metrics."
              },
              {
                  "id": "b",
                  "text": "An SLI is a quantifiable metric of service performance (e.g. % of HTTP requests returning < 200ms), while an SLO is the internal target percentage the team aims to meet (e.g. 99.5%)."
              },
              {
                  "id": "c",
                  "text": "SLOs only apply to frontend websites, while SLIs only apply to backend databases."
              },
              {
                  "id": "d",
                  "text": "There is no distinction; both terms mean the exact same thing in site reliability engineering."
              }
          ],
          "correct": "b",
          "explanation": "SLI is the measured metric (the reality), SLO is the internal target the engineering team commits to maintain, and SLA is the external commercial contract with customers with financial penalties."
      },
      {
          "id": "q16",
          "question": "Following a SEV-1 production outage, what is the primary goal of authoring a Blameless Postmortem (RCA)?",
          "options": [
              {
                  "id": "a",
                  "text": "Identifying which junior engineer committed the faulty line of code so they can be publicly disciplined."
              },
              {
                  "id": "b",
                  "text": "Uncovering underlying systemic, architectural, and procedural vulnerabilities to prevent recurrence through concrete action items."
              },
              {
                  "id": "c",
                  "text": "Reassuring executives that human errors will never happen again under any circumstances."
              },
              {
                  "id": "d",
                  "text": "Deleting all server log files to prevent external regulatory audits."
              }
          ],
          "correct": "b",
          "explanation": "Blameless postmortems operate on the principle that humans make honest mistakes in complex systems; focusing on systemic safeguards, automated testing, and fail-safes creates resilient engineering organizations."
      },
      {
          "id": "q17",
          "question": "Why must payment processing endpoints and webhook receivers be designed to be strictly Idempotent?",
          "options": [
              {
                  "id": "a",
                  "text": "To make HTTP requests execute twice as fast across cellular networks."
              },
              {
                  "id": "b",
                  "text": "To ensure that network retries or duplicate webhook deliveries do not result in double charges or duplicate database records."
              },
              {
                  "id": "c",
                  "text": "To allow client browsers to bypass HTTPS encryption."
              },
              {
                  "id": "d",
                  "text": "To prevent databases from creating primary keys."
              }
          ],
          "correct": "b",
          "explanation": "In distributed networks, packets drop and clients retry. An idempotent endpoint guarantees that processing the identical request multiple times produces the exact same outcome as processing it once."
      },
      {
          "id": "q18",
          "question": "What problem does the Circuit Breaker pattern solve when an upstream API service calls a failing downstream third-party recommendation service?",
          "options": [
              {
                  "id": "a",
                  "text": "It speeds up slow SQL queries by caching them on the client machine."
              },
              {
                  "id": "b",
                  "text": "It trips open to immediately fail fast and return fallback responses, preventing thread pool exhaustion and cascading failures from bringing down the entire upstream cluster."
              },
              {
                  "id": "c",
                  "text": "It permanently removes the third-party vendor from the company's vendor contract."
              },
              {
                  "id": "d",
                  "text": "It encrypts database connections using TLS 1.3 certificates."
              }
          ],
          "correct": "b",
          "explanation": "When a downstream dependency hangs or fails, caller threads block waiting for timeouts. A circuit breaker trips open after a threshold, shedding load and allowing the caller to degrade gracefully."
      },
      {
          "id": "q19",
          "question": "In an asynchronous event-driven system (e.g. Kafka, RabbitMQ, AWS SQS), what is the function of a Dead Letter Queue (DLQ)?",
          "options": [
              {
                  "id": "a",
                  "text": "It permanently deletes corrupted messages immediately without recording them anywhere."
              },
              {
                  "id": "b",
                  "text": "It isolates messages that repeatedly fail processing after maximum retry attempts, allowing engineering inspection and replay without stalling the main queue."
              },
              {
                  "id": "c",
                  "text": "It compresses log files to save disk storage on production message brokers."
              },
              {
                  "id": "d",
                  "text": "It acts as an in-memory cache for user session cookies."
              }
          ],
          "correct": "b",
          "explanation": "A DLQ prevents 'poison pill' messages from perpetually blocking consumer threads by diverting unprocessable events aside for triage and eventual redelivery."
      },
      {
          "id": "q20",
          "question": "Why do production web applications use database connection pooling (e.g. PgBouncer, HikariCP) instead of opening a new TCP connection on every incoming HTTP request?",
          "options": [
              {
                  "id": "a",
                  "text": "Because modern databases only permit a single TCP connection per cluster."
              },
              {
                  "id": "b",
                  "text": "Because establishing TCP handshakes, TLS negotiation, and PostgreSQL backend processes per request introduces crippling latency and exhausts database memory."
              },
              {
                  "id": "c",
                  "text": "Because connection pools automatically translate SQL queries into GraphQL."
              },
              {
                  "id": "d",
                  "text": "Because database drivers cannot authenticate without third-party connection pools."
              }
          ],
          "correct": "b",
          "explanation": "TCP and database session creation is computationally expensive. Reusing an established pool of warm connections reduces request latency from 50ms to sub-millisecond overhead."
      },
      {
          "id": "q21",
          "question": "In relational databases such as PostgreSQL and MySQL, what ACID durability guarantee does the Write-Ahead Log (WAL) provide?",
          "options": [
              {
                  "id": "a",
                  "text": "It ensures all database passwords are cryptographically salted with SHA-256."
              },
              {
                  "id": "b",
                  "text": "It ensures modifications are written to sequential, append-only disk storage before updating data pages, guaranteeing crash recovery without data loss."
              },
              {
                  "id": "c",
                  "text": "It automatically scales compute instances when read traffic spikes."
              },
              {
                  "id": "d",
                  "text": "It sends email notifications to database administrators whenever a table is queried."
              }
          ],
          "correct": "b",
          "explanation": "WAL guarantees durability (the 'D' in ACID). If power fails or the server crashes, the database replays the sequential WAL records during boot to restore committed transactions."
      },
      {
          "id": "q22",
          "question": "What is the true engineering definition of 'Technical Debt'?",
          "options": [
              {
                  "id": "a",
                  "text": "The monetary cost of cloud hosting bills owed to AWS or Google Cloud."
              },
              {
                  "id": "b",
                  "text": "The implied future rework cost incurred when choosing a quick or suboptimal shortcut now rather than a robust, scalable architecture."
              },
              {
                  "id": "c",
                  "text": "The total salary paid to software engineers during a company fiscal year."
              },
              {
                  "id": "d",
                  "text": "Code that is written in any language other than modern Rust or Go."
              }
          ],
          "correct": "b",
          "explanation": "Technical debt is a metaphor coined by Ward Cunningham: taking technical shortcuts is like borrowing money\u2014it accelerates immediate shipping, but accumulates interest in the form of maintenance drag until repaid."
      },
      {
          "id": "q23",
          "question": "What does a project 'Bus Factor of 1' mean, and how should a healthy engineering team mitigate it?",
          "options": [
              {
                  "id": "a",
                  "text": "Only one team member commutes to the corporate office via public transit."
              },
              {
                  "id": "b",
                  "text": "Critical institutional and operational knowledge is concentrated in a single engineer; teams mitigate this through runbooks, documentation, and paired code reviews."
              },
              {
                  "id": "c",
                  "text": "The project can only handle one customer transaction per second."
              },
              {
                  "id": "d",
                  "text": "The application must be deployed using a single Docker container."
              }
          ],
          "correct": "b",
          "explanation": "A low bus factor is a dangerous operational risk. Cross-training, comprehensive standard operating procedures (SOPs), and shared code ownership ensure continuity if any engineer departs."
      },
      {
          "id": "q24",
          "question": "During an incident review, your manager asks how the team improved MTTD and MTTR this quarter. What do these metrics measure?",
          "options": [
              {
                  "id": "a",
                  "text": "Maximum Time To Deploy and Minimum Time To Rollback."
              },
              {
                  "id": "b",
                  "text": "Mean Time to Detect (time from defect onset until an alert fires) and Mean Time to Resolve (time from alert until customer service is fully restored)."
              },
              {
                  "id": "c",
                  "text": "Monthly Traffic To Database and Monthly Total Ticket Revenue."
              },
              {
                  "id": "d",
                  "text": "Machine Threading Total Duration and Memory Table Thread Retention."
              }
          ],
          "correct": "b",
          "explanation": "MTTD measures detection efficiency (monitoring and anomaly alerts), while MTTR measures recovery speed (automation, rollbacks, and runbook execution)."
      },
      {
          "id": "q25",
          "question": "In high-performing engineering teams, what is the '30-Minute Rule' for unblocking yourself when onboarding or facing a difficult technical bug?",
          "options": [
              {
                  "id": "a",
                  "text": "You must solve any production bug within 30 minutes or immediately tender your resignation."
              },
              {
                  "id": "b",
                  "text": "Invest 30 minutes actively researching logs, documentation, and codebase history; if still stuck, ask teammates with structured context (goal, attempts, exact error, hypothesis)."
              },
              {
                  "id": "c",
                  "text": "Never spend more than 30 minutes per week reviewing peer pull requests."
              },
              {
                  "id": "d",
                  "text": "Turn off all Slack and email notifications after 30 minutes of work every morning."
              }
          ],
          "correct": "b",
          "explanation": "The 30-minute rule balances self-reliance with team efficiency: it encourages thorough individual investigation without letting an engineer waste days spinning their wheels in silence."
      }
  ],
  "PROBLEMS": [
    {
      "id": "prob-01",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Container CrashLoopBackOff & Exit Code 137",
      "category": "Containerization & Kubernetes",
      "scenario": "A newly deployed payment worker pod in Kubernetes keeps crashing every 90 seconds with status 'CrashLoopBackOff' and exit code 137. The container logs show no uncaught exceptions.",
      "task": "Diagnose the exact cause of exit code 137 and write the Kubernetes resource configuration update to prevent premature termination.",
      "help_statement": "Reference Hint: Exit code 137 is 128 + 9 (SIGKILL). In Linux and Kubernetes, this is almost always triggered by the Out-Of-Memory (OOM) Killer when the container's memory exceeds 'resources.limits.memory'. Inspect 'kubectl describe pod' for 'OOMKilled: true' and raise the memory limit with appropriate request buffers.",
      "starter_template": "# 1. Identify Root Cause:\n# Exit code 137 indicates ...\n\n# 2. Kubernetes Pod Spec Fix:\nresources:\n  requests:\n    memory: \"...\"\n    cpu: \"...\"\n  limits:\n    memory: \"...\"\n    cpu: \"...\"",
      "expected_keywords": [
        "oom",
        "sigkill",
        "limits",
        "memory",
        "137"
      ]
    },
    {
      "id": "prob-02",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Database Connection Pool Starvation Under Spike Traffic",
      "category": "Database Architecture",
      "scenario": "During a flash sale, API response times jump from 50ms to 30,000ms. Application logs report 'HikariPool-1 - Connection is not available, request timed out after 30000ms'. Database CPU is only at 14%.",
      "task": "Explain why connection starvation happens despite low DB CPU and provide the architectural fix in the connection lifecycle.",
      "help_statement": "Reference Hint: When DB CPU is low but pool timeouts occur, connections are leaking (checked out but never returned). Ensure every query checkout is wrapped in a try/finally block or Python context manager ('with engine.connect() as conn:'). Also set 'leakDetectionThreshold: 2000ms' to log lingering callers.",
      "starter_template": "def query_user_orders(user_id: str):\n    # Fix connection checkout and ensure release:\n    pass",
      "expected_keywords": [
        "leak",
        "finally",
        "context manager",
        "release",
        "leakdetectionthreshold"
      ]
    },
    {
      "id": "prob-03",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Unindexed Foreign Key Leading to Full Table Scan",
      "category": "SQL & Relational Databases",
      "scenario": "A query 'SELECT * FROM order_items WHERE order_id = $1' takes 4.2 seconds on a table with 12 million rows. EXPLAIN ANALYZE shows 'Seq Scan on order_items (cost=0.00..342110.00)'.",
      "task": "Write the DDL migration statement to optimize this lookup and explain why foreign keys are not automatically indexed in relational databases.",
      "help_statement": "Reference Hint: While Primary Keys automatically create unique B-Tree indexes, Foreign Keys do NOT. Create an index using: 'CREATE INDEX CONCURRENTLY idx_order_items_order_id ON order_items(order_id);'. The 'CONCURRENTLY' keyword prevents table locking in production.",
      "starter_template": "-- Write safe, zero-lock index creation migration:\nCREATE INDEX ...",
      "expected_keywords": [
        "create index",
        "concurrently",
        "b-tree",
        "seq scan",
        "order_id"
      ]
    },
    {
      "id": "prob-04",
      "phase": 1,
      "difficulty": "Basic",
      "title": "HTTP 429 Rate Limiter with RFC 6585 Headers",
      "category": "API Gateway & Traffic Control",
      "scenario": "A public webhook endpoint is being hammered by a rogue partner script sending 400 requests/second. You must implement rate limiting returning HTTP 429 with compliant headers.",
      "task": "Define the required RFC 6585 response headers and explain how a Redis sliding window counter prevents window-boundary burst attacks.",
      "help_statement": "Reference Hint: Standard rate limit headers include 'Retry-After: <seconds>', 'X-RateLimit-Limit: 100', 'X-RateLimit-Remaining: 0', and 'X-RateLimit-Reset: <epoch>'. A sliding window in Redis uses sorted sets (ZADD / ZREMRANGEBYSCORE) using the current millisecond timestamp.",
      "starter_template": "# HTTP 429 Response Headers & Redis Sliding Window Logic:\nheaders = {\n    \"Retry-After\": \"...\",\n    \"X-RateLimit-Limit\": \"...\",\n}",
      "expected_keywords": [
        "retry-after",
        "429",
        "sliding window",
        "redis",
        "zadd"
      ]
    },
    {
      "id": "prob-05",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Transparent Password Hash Upgrade (MD5 to Argon2id)",
      "category": "Authentication & Cryptography",
      "scenario": "A legacy authentication database contains 50,000 user passwords stored as unsalted MD5 hashes. You cannot force all users to reset their passwords at once.",
      "task": "Design a transparent, zero-downtime migration strategy that upgrades password hashes to Argon2id (or Bcrypt) as users log in.",
      "help_statement": "Reference Hint: On login: verify user credentials against legacy hash (if starts with 'md5:'). If valid, immediately compute new Argon2id hash ('argon2.PasswordHasher().hash(plaintext)'), update the DB record, and set 'hash_version = 2'. Subsequent logins use Argon2id.",
      "starter_template": "def authenticate_and_upgrade(username, plain_password):\n    # 1. Fetch user\n    # 2. Check hash version\n    # 3. Upgrade if legacy\n    pass",
      "expected_keywords": [
        "argon2",
        "bcrypt",
        "transparent",
        "login",
        "salt"
      ]
    },
    {
      "id": "prob-06",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Distributed Trace ID Propagation in Microservices",
      "category": "Observability & Telemetry",
      "scenario": "When an order fails in downstream Service C, engineers cannot find the related log entries in Service A or B because logs only contain isolated timestamps.",
      "task": "Implement an HTTP middleware pattern that extracts or generates an 'X-Correlation-ID' / W3C 'traceparent' and attaches it to all outbound HTTP calls and structured log lines.",
      "help_statement": "Reference Hint: In incoming requests, check 'request.headers.get(\"X-Correlation-ID\")' or generate 'uuid.uuid4()'. Store it in context (e.g. Python's 'contextvars' or ThreadLocal MDC). Set the response header and inject it into all outgoing HTTP client headers.",
      "starter_template": "# Middleware implementation for Correlation ID:\nasync def correlation_middleware(request, call_next):\n    pass",
      "expected_keywords": [
        "correlation-id",
        "traceparent",
        "contextvars",
        "uuid",
        "propagate"
      ]
    },
    {
      "id": "prob-07",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Clean Git Feature Branch Rebase & Conflict Resolution",
      "category": "Source Control & Collaboration",
      "scenario": "Your feature branch 'feat/checkout' has diverged from 'main' by 14 commits. A direct merge creates an ugly merge commit and breaks CI tests.",
      "task": "Provide the exact Git CLI commands to rebase onto latest main, resolve conflicts, and safely update the remote branch without destroying teammates' work.",
      "help_statement": "Reference Hint: Commands: 'git checkout feat/checkout', 'git fetch origin', 'git rebase origin/main'. If conflicts occur, edit files, 'git add <file>', and 'git rebase --continue'. To push, NEVER use bare '--force'; always use 'git push --force-with-lease'.",
      "starter_template": "# Git CLI Commands Sequence:\ngit checkout feat/checkout\n# ...",
      "expected_keywords": [
        "rebase",
        "fetch",
        "force-with-lease",
        "continue",
        "origin/main"
      ]
    },
    {
      "id": "prob-08",
      "phase": 1,
      "difficulty": "Basic",
      "title": "CORS Preflight (OPTIONS) Rejection on Custom Headers",
      "category": "Web Security & Protocols",
      "scenario": "Frontend single-page app reports: 'Access to XMLHttpRequest from origin http://app.praxis.dev has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No Access-Control-Allow-Origin header is present'.",
      "task": "Explain what a CORS preflight request is and write the HTTP headers required for a server to permit requests with custom 'Authorization' and 'X-Tenant-ID' headers.",
      "help_statement": "Reference Hint: When browsers send non-simple requests (like custom headers or PUT/DELETE), they first send an HTTP 'OPTIONS' request. The server must reply with HTTP 200/204 and headers: 'Access-Control-Allow-Origin: https://app.praxis.dev', 'Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers: Authorization,Content-Type,X-Tenant-ID'.",
      "starter_template": "# Required CORS Headers:\naccess_control_headers = {\n    \"Access-Control-Allow-Origin\": \"...\",\n    \"Access-Control-Allow-Methods\": \"...\",\n    \"Access-Control-Allow-Headers\": \"...\",\n}",
      "expected_keywords": [
        "options",
        "preflight",
        "access-control-allow-origin",
        "access-control-allow-headers",
        "authorization"
      ]
    },
    {
      "id": "prob-09",
      "phase": 1,
      "difficulty": "Basic",
      "title": "PII & Secret Scrubber for Structured Application Logs",
      "category": "Data Privacy & Compliance",
      "scenario": "An audit discovers that authorization bearer tokens and customer credit card numbers are being printed to Datadog logs whenever an HTTP request fails.",
      "task": "Write a sanitization filter function that regex-masks sensitive values (tokens, passwords, credit card digits) before logs are written to stdout.",
      "help_statement": "Reference Hint: Use regular expressions to redact patterns like 'Bearer [A-Za-z0-9._-]+' -> 'Bearer [REDACTED]' and 'password=[^&\\s]+' -> 'password=[REDACTED]'. In Python, custom 'logging.Filter' or 'json_formatter' intercepts log records before emission.",
      "starter_template": "import re\n\ndef sanitize_log_payload(record_dict: dict) -> dict:\n    # Mask PII and secrets\n    pass",
      "expected_keywords": [
        "regex",
        "redacted",
        "mask",
        "bearer",
        "password"
      ]
    },
    {
      "id": "prob-10",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Kubernetes Liveness vs. Readiness Probe Deadlock",
      "category": "Containerization & Kubernetes",
      "scenario": "A microservice that takes 45 seconds to load an internal cache at startup keeps restarting in an infinite loop every 20 seconds after deployment.",
      "task": "Explain why this probe deadlock occurs and rewrite the Kubernetes probe configuration using appropriate readiness and startup probes.",
      "help_statement": "Reference Hint: If a **liveness probe** fails, Kubernetes restarts the container. If the app needs 45s to warm up but liveness checks after 15s, it will kill it repeatedly! Use a **startupProbe** with 'failureThreshold: 30' and 'periodSeconds: 2' to guard startup, while **readinessProbe** controls traffic routing.",
      "starter_template": "startupProbe:\n  httpGet:\n    path: /health\n    port: 8080\n  initialDelaySeconds: ...\nreadinessProbe:\n  # ...",
      "expected_keywords": [
        "startupprobe",
        "readinessprobe",
        "livenessprobe",
        "initialdelayseconds",
        "warmup"
      ]
    },
    {
      "id": "prob-11",
      "phase": 1,
      "difficulty": "Basic",
      "title": "SQL Injection Defense & Parameterized Query Enforcement",
      "category": "Application Security (OWASP)",
      "scenario": "A legacy search function executes: `query = f\"SELECT * FROM items WHERE name LIKE '%{user_input}%'\"`. An attacker sends `' OR '1'='1` and dumps the entire inventory.",
      "task": "Refactor this query to use parameterized bindings and explain why string formatting causes SQL injection.",
      "help_statement": "Reference Hint: In SQLite/Postgres: `cursor.execute(\"SELECT * FROM items WHERE name LIKE ?\", (f\"%{user_input}%\",))` or `%s` in Postgres. Parameters are sent to the database engine separately from the SQL statement AST, making code injection impossible.",
      "starter_template": "def safe_search_items(cursor, user_input: str):\n    # Use parameterized query:\n    pass",
      "expected_keywords": [
        "parameterized",
        "placeholder",
        "binding",
        "ast",
        "injection"
      ]
    },
    {
      "id": "prob-12",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Graceful Web Server Shutdown on SIGTERM",
      "category": "System Architecture",
      "scenario": "During Kubernetes rolling updates, users experience random HTTP 502 Bad Gateway errors because pods are immediately killed while processing active checkout requests.",
      "task": "Implement a signal handling routine that traps SIGTERM, stops accepting new requests, drains active requests within 15 seconds, and cleanly closes DB connections.",
      "help_statement": "Reference Hint: When Kubernetes terminates a pod, it sends SIGTERM. The app should catch SIGTERM (e.g. `signal.signal(signal.SIGTERM, handler)`), notify the HTTP server to enter draining mode (`server.shutdown()`), await active workers, close connection pools, and exit with code 0.",
      "starter_template": "import signal\nimport sys\n\ndef handle_sigterm(signum, frame):\n    # 1. Stop ingress\n    # 2. Drain active requests\n    # 3. Close database pools\n    pass",
      "expected_keywords": [
        "sigterm",
        "drain",
        "shutdown",
        "exit(0)",
        "connection pool"
      ]
    },
    {
      "id": "prob-13",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Cache Stampede (Thundering Herd) Mitigation",
      "category": "Distributed Caching",
      "scenario": "When the homepage product catalog cache key expires at midnight, 8,000 concurrent requests simultaneously query the primary SQL database, causing database CPU to spike to 100% and crash.",
      "task": "Describe the cache stampede problem and implement a mutex lock (or probabilistic early expiration) pattern in Python/Redis.",
      "help_statement": "Reference Hint: Use Redis distributed mutex: when key is missing, only ONE request acquires lock (`SET lock:catalog token NX EX 10`). That request queries DB and repopulates cache. Other concurrent requests either wait 100ms and re-read cache or serve stale cached data (`stale-while-revalidate`).",
      "starter_template": "def get_product_catalog(redis_client, db):\n    # Implement mutex or stale-while-revalidate:\n    pass",
      "expected_keywords": [
        "mutex",
        "lock",
        "nx",
        "stale-while-revalidate",
        "thundering herd"
      ]
    },
    {
      "id": "prob-14",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Zero-Downtime Expand/Contract Schema Migration",
      "category": "Database DevOps",
      "scenario": "You need to split a `users.full_name` column into `users.first_name` and `users.last_name`. The API cannot experience a single second of downtime during the rollout.",
      "task": "Detail the 5 phases of the Expand/Contract (Parallel Run) migration pattern.",
      "help_statement": "Reference Hint: Phase 1: Expand (Add first_name, last_name as nullable). Phase 2: Dual-write (App writes to both old and new columns). Phase 3: Backfill (Async script splits existing full_name). Phase 4: Switch readers (App reads from new columns). Phase 5: Contract (Deprecate and DROP full_name column).",
      "starter_template": "# 5 Migration Phases:\n# Phase 1 (Expand):\n# Phase 2 (Dual Write):\n# Phase 3 (Backfill):\n# Phase 4 (Read Cutover):\n# Phase 5 (Contract):",
      "expected_keywords": [
        "expand",
        "contract",
        "dual-write",
        "backfill",
        "nullable"
      ]
    },
    {
      "id": "prob-15",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Idempotency Key Implementation for Financial Transactions",
      "category": "Financial APIs & Distributed State",
      "scenario": "A mobile app user with spotty cellular connectivity taps 'Pay $50' twice because the first request timed out on the client side. The user's credit card is charged $100.",
      "task": "Design the server-side Idempotency Key architecture using Redis or database constraints to guarantee exactly-once payment processing.",
      "help_statement": "Reference Hint: Client sends header `Idempotency-Key: <UUID>`. Server stores key in Redis with state 'PROCESSING'. If duplicate request arrives with same key, server returns 409 Conflict or waits. Once payment succeeds, store response payload with TTL (24h). Return cached response for any future replay.",
      "starter_template": "def process_payment(idempotency_key: str, amount_cents: int):\n    # Check idempotency record\n    pass",
      "expected_keywords": [
        "idempotency-key",
        "processing",
        "replay",
        "uuid",
        "exactly-once"
      ]
    },
    {
      "id": "prob-16",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Dead Letter Queue (DLQ) Routing for Poison Pill Messages",
      "category": "Message Queues & Event Streaming",
      "scenario": "A malformed JSON payload in a Kafka/RabbitMQ order queue throws an unhandled `JSONDecodeError`, causing the consumer worker to crash and restart in an infinite loop, halting all subsequent order processing.",
      "task": "Implement dead letter queue routing logic with a maximum retry counter (e.g. 3 attempts) and metadata tagging.",
      "help_statement": "Reference Hint: Inspect message header `x-delivery-count`. If < 3, reject with requeue (`NACK`). If >= 3, publish message to `orders.DLQ` with error headers (`x-exception-message`, `x-original-queue`) and acknowledge (`ACK`) from main queue to unblock traffic.",
      "starter_template": "def handle_message(message, max_retries=3):\n    # Route to DLQ if max retries exceeded:\n    pass",
      "expected_keywords": [
        "dlq",
        "poison pill",
        "ack",
        "nack",
        "max_retries"
      ]
    },
    {
      "id": "prob-17",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Circuit Breaker State Machine (Closed, Open, Half-Open)",
      "category": "Distributed Systems Resilience",
      "scenario": "An external SMS notification provider is experiencing severe outages, timing out after 10 seconds. Your primary checkout API threads are stalling while waiting for SMS confirmation.",
      "task": "Design a 3-state Circuit Breaker pattern that isolates the failing SMS provider and permits quick fallback.",
      "help_statement": "Reference Hint: States: **Closed** (Normal traffic passes). If failure rate > 50% over 10s window -> trip to **Open** (Fail fast immediately without calling external API, return fallback). After cool-down timeout (e.g. 30s) -> **Half-Open** (Allow 3 test requests; if they succeed, reset to Closed; if fail, return to Open).",
      "starter_template": "class CircuitBreaker:\n    def __init__(self, failure_threshold=5, reset_timeout=30):\n        self.state = 'CLOSED' # CLOSED, OPEN, HALF_OPEN\n    \n    def call(self, func, *args, **kwargs):\n        pass",
      "expected_keywords": [
        "closed",
        "open",
        "half-open",
        "fail-fast",
        "fallback"
      ]
    },
    {
      "id": "prob-18",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Linux File Descriptor & Socket Leak Diagnosis",
      "category": "Linux Systems & Networking",
      "scenario": "After running for 4 days, a microservice starts throwing `OSError: [Errno 24] Too many open files` and rejects all incoming connections. CPU and memory are normal.",
      "task": "Explain how file descriptors relate to network sockets in Linux, provide debugging CLI commands, and identify the code-level leak.",
      "help_statement": "Reference Hint: In Linux, network sockets are file descriptors. Run `lsof -p <PID>` or `ls -l /proc/<PID>/fd | wc -l` to count open handles. The bug is typically an HTTP client or DB client opening connections without closing response bodies or reusing pooled session adapters.",
      "starter_template": "# 1. Linux diagnostic commands:\n# lsof -p ...\n\n# 2. Python connection session fix:\nimport requests\n# Ensure connection pooling with requests.Session()",
      "expected_keywords": [
        "lsof",
        "file descriptor",
        "socket",
        "close",
        "session"
      ]
    },
    {
      "id": "prob-19",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Prometheus Metric Types: Counter vs Gauge vs Histogram",
      "category": "Metrics & Telemetry",
      "scenario": "A junior engineer instrumented API latency using a Prometheus Gauge (`api_latency_gauge.set(response_time)`). In Grafana, the latency graph shows erratic zigzag lines and cannot compute p95 percentiles.",
      "task": "Explain why Gauge is inappropriate for request latency and write the correct Prometheus Histogram metric declaration with standard buckets.",
      "help_statement": "Reference Hint: Gauges only store the current instantaneous value (suitable for temperature or memory in MB). Request latency requires a **Histogram** with exponential buckets (`buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]`) to allow `histogram_quantile(0.95, rate(http_latency_bucket[5m]))`.",
      "starter_template": "from prometheus_client import Histogram\n\n# Correct latency histogram instrumentation:\nREQUEST_LATENCY = Histogram(\n    'http_request_duration_seconds',\n    'HTTP request latency in seconds',\n    ['method', 'endpoint'],\n    buckets=[...]\n)",
      "expected_keywords": [
        "histogram",
        "gauge",
        "buckets",
        "histogram_quantile",
        "p95"
      ]
    },
    {
      "id": "prob-20",
      "phase": 1,
      "difficulty": "Basic",
      "title": "Blameless Postmortem & Root Cause Analysis (5 Whys)",
      "category": "Engineering Culture & Operations",
      "scenario": "A developer accidentally ran `DROP DATABASE staging_crm` because their local `.env` file pointed to staging instead of localhost. A manager wants to fire the developer.",
      "task": "Write a blameless postmortem using the '5 Whys' framework that identifies systemic safeguards rather than blaming individual human error.",
      "help_statement": "Reference Hint: Never stop at 'human clicked wrong button'. Ask 5 Whys: Why did it drop staging? Dev had staging credentials. Why? Shared credentials in team wiki. Why? No staging IAM role separation. Action Items: (1) Rotate credentials, (2) Restrict drop permissions via IAM, (3) Block direct connection to staging DB from developer laptops via VPN/bastion.",
      "starter_template": "# Blameless Postmortem:\n# Incident: Staging CRM drop\n# 5 Whys Analysis:\n# Action Items (Preventative, Assigned, Dated):",
      "expected_keywords": [
        "5 whys",
        "blameless",
        "iam",
        "least privilege",
        "action items"
      ]
    },
    {
      "id": "prob-21",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Cascading Thread Pool Exhaustion Across Service Mesh",
      "category": "Distributed Systems",
      "scenario": "Downstream Recommendation Service D experiences a 400ms latency degradation. Within 3 minutes, upstream Gateway Service A, Auth Service B, and Catalog Service C all exhaust their worker thread pools and crash across the entire cluster, causing a total company outage.",
      "task": "Provide an architectural root cause analysis and implement the Bulkhead isolation and timeout budget propagation strategy to prevent cascading collapses.",
      "help_statement": null,
      "starter_template": "# 1. Root Cause Breakdown:\n# ...\n\n# 2. Bulkhead & Timeout Propagation Architecture:\n# ...",
      "expected_keywords": [
        "bulkhead",
        "timeout",
        "cascading",
        "thread pool",
        "isolation"
      ]
    },
    {
      "id": "prob-22",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Distributed Lock Lease Expiry & Fencing Tokens (Redlock)",
      "category": "Concurrency & Distributed State",
      "scenario": "Service Node 1 acquires a Redis distributed lock with a 10-second TTL to generate an invoice. A major Java Garbage Collection pause freezes Node 1 for 12 seconds. Node 2 acquires the lock and begins writing. Node 1 wakes up and also writes, corrupting the financial ledger.",
      "task": "Explain how lock lease expiration breaks mutual exclusion during process pauses and implement Martin Kleppmann's Fencing Token pattern to ensure storage-level safety.",
      "help_statement": null,
      "starter_template": "# Fencing Token Pattern Implementation:\nclass FencingTokenValidator:\n    def __init__(self):\n        self.highest_token = 0\n    \n    def write_to_storage(self, token: int, data: dict):\n        pass",
      "expected_keywords": [
        "fencing token",
        "redlock",
        "lease",
        "gc pause",
        "monotonic"
      ]
    },
    {
      "id": "prob-23",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Read-After-Write Consistency Lag in Distributed Replicas",
      "category": "Database Architecture",
      "scenario": "A user updates their profile picture and is redirected to their profile page. The page still displays the old picture because the read query was routed to an asynchronous read replica with 800ms replication lag. The user files a bug report claiming the upload failed.",
      "task": "Design a Session-Consistent / Read-Your-Own-Writes routing layer that dynamically routes queries to the primary database when a recent write has occurred.",
      "help_statement": null,
      "starter_template": "# Read-Your-Own-Writes Router:\ndef route_database_query(user_id: str, query_type: str, last_write_timestamp: float):\n    pass",
      "expected_keywords": [
        "read-your-own-writes",
        "replication lag",
        "primary",
        "replica",
        "session consistency"
      ]
    },
    {
      "id": "prob-24",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Memory Leak in Event Listener & Closure Retainers",
      "category": "Memory Management & Profiling",
      "scenario": "A long-running Node.js or Python background worker accumulates 4GB of RAM over 12 hours until killed by the kernel. Heap profiling indicates that thousands of request context objects are retained in an event listener registry.",
      "task": "Diagnose how closures and unbound event emitter listeners cause memory retention and refactor the code to use WeakMap / explicit unsubscription.",
      "help_statement": null,
      "starter_template": "# Refactor listener lifecycle to prevent memory leaks:\nclass EventHub:\n    def __init__(self):\n        pass",
      "expected_keywords": [
        "closure",
        "retainer",
        "weakmap",
        "unsubscribe",
        "eventemitter"
      ]
    },
    {
      "id": "prob-25",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Deadlock Resolution in Concurrent Account Transfers",
      "category": "Transaction Isolation & Deadlocks",
      "scenario": "Thread 1 transfers $50 from Account A to Account B (`SELECT ... FOR UPDATE` on A, then B). Thread 2 concurrently transfers $30 from Account B to Account A (`SELECT ... FOR UPDATE` on B, then A). Both threads block indefinitely and PostgreSQL aborts with `ERROR: deadlock detected`.",
      "task": "Explain the circular wait condition and implement deterministic row-lock ordering to eliminate database transfer deadlocks.",
      "help_statement": null,
      "starter_template": "def transfer_funds(db, from_account_id: int, to_account_id: int, amount: float):\n    # Enforce deterministic locking order:\n    pass",
      "expected_keywords": [
        "deadlock",
        "deterministic",
        "circular wait",
        "for update",
        "order by"
      ]
    },
    {
      "id": "prob-26",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Cross-Tenant Data Leak via Thread-Local Context Reuse",
      "category": "Multi-Tenant Security",
      "scenario": "In a multi-tenant SaaS application running on a Gunicorn thread pool, Tenant X occasionally sees Tenant Y's confidential financial metrics because tenant context was stored in a ThreadLocal variable that was not cleared when the thread serviced the next HTTP request.",
      "task": "Identify why thread pool reuse causes cross-tenant data leaks and write a foolproof context management middleware that guarantees context cleanup.",
      "help_statement": null,
      "starter_template": "# Clean Thread-Local / ContextVars Middleware:\nimport contextvars\n\ntenant_context = contextvars.ContextVar('tenant_id', default=None)\n\nasync def tenant_isolation_middleware(request, call_next):\n    pass",
      "expected_keywords": [
        "threadlocal",
        "contextvars",
        "cross-tenant",
        "reset",
        "finally"
      ]
    },
    {
      "id": "prob-27",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Exponential Backoff with Full Jitter for Retries",
      "category": "Networking & Distributed Resilience",
      "scenario": "When an external credit score API recovers from a brief 10-second outage, 15,000 pending client requests retry at exact 2-second intervals, immediately crashing the API again in periodic synchronized waves (retry storm).",
      "task": "Explain why fixed or purely exponential retries synchronize and implement the 'Exponential Backoff with Full Jitter' algorithm recommended by AWS Architecture.",
      "help_statement": null,
      "starter_template": "import random\nimport time\n\ndef calculate_full_jitter_delay(attempt: int, base_delay: float = 1.0, max_delay: float = 30.0) -> float:\n    # Implement Full Jitter: min(max_delay, random.uniform(0, base_delay * (2 ** attempt)))\n    pass",
      "expected_keywords": [
        "jitter",
        "exponential backoff",
        "retry storm",
        "random",
        "synchronization"
      ]
    },
    {
      "id": "prob-28",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Kafka Hot Partitioning & Uneven Consumer Lag",
      "category": "Event Streaming & Distributed Logs",
      "scenario": "In a 12-partition Kafka topic, Partition 4 has 450,000 unconsumed messages and 40-minute consumer lag, while all other 11 partitions have 0 lag. Messages are keyed by `country_code`, and 85% of traffic originates from `US`.",
      "task": "Explain why key hashing creates hot partitions and design a compound partitioning key or salted partition strategy to balance throughput.",
      "help_statement": null,
      "starter_template": "# Compound / Salted Partition Key Strategy:\ndef generate_balanced_partition_key(country_code: str, user_id: str, salt_range: int = 10) -> str:\n    pass",
      "expected_keywords": [
        "hot partition",
        "salt",
        "consumer lag",
        "hash",
        "compound key"
      ]
    },
    {
      "id": "prob-29",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "TCP Half-Open Keep-Alive Mismatch Behind AWS ALB",
      "category": "Cloud Infrastructure & Networking",
      "scenario": "A web app behind an AWS Application Load Balancer reports sporadic `502 Bad Gateway` errors (~0.1% of requests) during steady traffic. ALB access logs show `elb_status_code=502` and `backend_status_code=-`. ALB idle timeout is set to 60s; Gunicorn/Node server keepalive timeout is set to 60s.",
      "task": "Explain the TCP race condition when upstream load balancer and backend server have identical keep-alive timeouts and formulate the timing rule to resolve it.",
      "help_statement": null,
      "starter_template": "# ALB vs Backend Keepalive Timeout Configuration:\n# ALB idle timeout: 60s\n# Backend server keepalive timeout rule: ...",
      "expected_keywords": [
        "keepalive",
        "idle timeout",
        "race condition",
        "alb",
        "502"
      ]
    },
    {
      "id": "prob-30",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Silent Data Truncation on UTF-8 Multi-Byte Emojis",
      "category": "Database Encoding & Character Sets",
      "scenario": "When a customer submits a comment containing an emoji like 'Great service! \ud83d\udc4d', the text stored in MySQL is truncated to 'Great service! ' and all subsequent characters are lost without throwing an error.",
      "task": "Explain the difference between MySQL's legacy `utf8` and standard `utf8mb4` character sets, and provide the ALTER TABLE script to safely upgrade collations.",
      "help_statement": null,
      "starter_template": "-- Migration script to convert database, table, and columns to utf8mb4:\nALTER TABLE ...",
      "expected_keywords": [
        "utf8mb4",
        "utf8",
        "4 bytes",
        "emoji",
        "collation"
      ]
    },
    {
      "id": "prob-31",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Zero-Downtime TLS Certificate Hot-Reloading",
      "category": "Production Cryptography & Nginx",
      "scenario": "Your production Nginx/Envoy proxy terminates HTTPS for 50,000 persistent WebSocket connections. You must rotate the SSL/TLS certificate without dropping active WebSocket connections.",
      "task": "Explain how master-worker process architectures handle configuration reloads (`SIGHUP` or `nginx -s reload`) without breaking existing TCP sockets.",
      "help_statement": null,
      "starter_template": "# Zero-downtime certificate rotation procedure:\n# Command & signal execution sequence:\n# Verification steps:",
      "expected_keywords": [
        "sighup",
        "reload",
        "master",
        "worker",
        "graceful"
      ]
    },
    {
      "id": "prob-32",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Redis Eviction Policy Catastrophe in Mixed Cache/Session Stores",
      "category": "Distributed Caching & In-Memory Stores",
      "scenario": "A company stores both transient HTML cache keys and active user login sessions in the same Redis instance configured with `maxmemory-policy: allkeys-lru`. During a marketing crawl, all active users are logged out unexpectedly.",
      "task": "Explain why `allkeys-lru` evicted user sessions and architect a safe separation strategy or eviction policy configuration (`volatile-lru` vs separate clusters).",
      "help_statement": null,
      "starter_template": "# Redis Architecture Remediation Plan:\n# 1. Why sessions were dropped:\n# 2. Redis cluster separation & maxmemory-policy fix:",
      "expected_keywords": [
        "allkeys-lru",
        "volatile-lru",
        "eviction",
        "sessions",
        "separation"
      ]
    },
    {
      "id": "prob-33",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Goroutine / Asyncio Task Leak in Long-Lived WebSockets",
      "category": "Asynchronous Concurrency",
      "scenario": "A chat microservice handles 10,000 WebSocket connections. When clients disconnect abruptly without sending a TCP close handshake, background heartbeat tasks continue running indefinitely, consuming 100% CPU.",
      "task": "Implement a context cancellation / timeout watchdog pattern that detects dropped sockets and guarantees background task termination.",
      "help_statement": null,
      "starter_template": "import asyncio\n\nasync def websocket_handler(websocket):\n    # Ensure cancellation of background worker tasks on disconnect:\n    pass",
      "expected_keywords": [
        "cancellation",
        "asyncio",
        "disconnect",
        "finally",
        "task.cancel"
      ]
    },
    {
      "id": "prob-34",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Distributed Transaction Rollback via Saga Pattern",
      "category": "Microservices Architecture",
      "scenario": "An e-commerce order workflow spans Order Service, Payment Service, and Inventory Service. Payment succeeds, but Inventory reservation fails due to a stock discrepancy. You cannot use 2-Phase Commit (2PC).",
      "task": "Design a Choreographed or Orchestrated Saga with compensating transactions that cleanly rolls back payment and marks the order as CANCELLED.",
      "help_statement": null,
      "starter_template": "# Saga Orchestrator with Compensating Actions:\nclass OrderSagaOrchestrator:\n    def execute(self, order_id: str):\n        pass",
      "expected_keywords": [
        "saga",
        "compensating transaction",
        "rollback",
        "orchestrator",
        "idempotent"
      ]
    },
    {
      "id": "prob-35",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Log Forgery & CRLF Injection Prevention",
      "category": "Application Security",
      "scenario": "An attacker sends an HTTP header `User-Agent: Mozilla/5.0\r\n2026-10-22 14:10:00 [INFO] Admin user logged in successfully`. The log parsing pipeline ingests this as a genuine admin login event, bypassing SIEM audit rules.",
      "task": "Explain CRLF log injection and implement a sanitizer that strips carriage return (`\\r`) and line feed (`\\n`) bytes from untrusted log fields.",
      "help_statement": null,
      "starter_template": "def sanitize_for_logging(untrusted_input: str) -> str:\n    # Strip CRLF characters to prevent log forgery:\n    pass",
      "expected_keywords": [
        "crlf",
        "injection",
        "log forgery",
        "newline",
        "sanitize"
      ]
    },
    {
      "id": "prob-36",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Kubernetes CFS CPU Throttling Despite Low Average Usage",
      "category": "Linux Kernel & Kubernetes Cgroups",
      "scenario": "A microservice container has `resources.limits.cpu: '1.0'`. Average CPU utilization is only 25%, but p99 latency is severely degraded and Linux kernel metrics report `nr_throttled: 42000` in `/sys/fs/cgroup/cpu/cpu.stat`.",
      "task": "Explain how the Linux Completely Fair Scheduler (CFS) enforces CPU quotas over 100ms periods and why multi-threaded bursts trigger throttling.",
      "help_statement": null,
      "starter_template": "# Analysis of CFS Quota (cpu.cfs_quota_us vs cpu.cfs_period_us):\n# Why bursts cause throttling at 25% avg CPU:\n# Recommended Kubernetes resource tuning:",
      "expected_keywords": [
        "cfs",
        "cgroup",
        "throttling",
        "period",
        "burst"
      ]
    },
    {
      "id": "prob-37",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Circular Dependency Deadlock on Cold Cluster Startup",
      "category": "System Architecture & Resilience",
      "scenario": "During a total data center cold boot, Authentication Service requires Organization Service to validate tenant tokens, while Organization Service requires Authentication Service to start its internal HTTP client. Neither service can pass health checks, and the cluster remains down.",
      "task": "Identify why synchronous inter-service dependencies create cold boot deadlocks and re-architect the startup sequence to break circular dependencies.",
      "help_statement": null,
      "starter_template": "# Cold Boot Decoupling Architecture:\n# 1. Break synchronous bootstrap coupling:\n# 2. Asynchronous / Cached local validation design:",
      "expected_keywords": [
        "circular dependency",
        "cold boot",
        "decouple",
        "asynchronous",
        "health check"
      ]
    },
    {
      "id": "prob-38",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Surrogate-Key (Cache-Tag) Edge Cache Invalidation",
      "category": "CDN & Edge Architecture",
      "scenario": "An article page cached across Cloudflare/Fastly edge nodes includes product pricing widgets. Purging the entire CDN cache causes origin overload, but waiting for TTL (24h) displays stale prices.",
      "task": "Design a Surrogate-Key (Cache-Tag) invalidation architecture where backend services issue targeted PURGE requests only for affected product tags.",
      "help_statement": null,
      "starter_template": "# Surrogate-Key Header Generation & Targeted Purge:\n# Response Headers:\n# Edge Purge API Payload:",
      "expected_keywords": [
        "surrogate-key",
        "cache-tag",
        "purge",
        "cdn",
        "invalidation"
      ]
    },
    {
      "id": "prob-39",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "Unbounded In-Memory Query Aggregation Causing Stop-the-World GC",
      "category": "High-Performance Data Processing",
      "scenario": "An API endpoint calculates monthly tax summaries by executing `SELECT * FROM transactions WHERE user_id = $1` and loading all 1.2 million rows into an in-memory list. The server freezes for 8 seconds during Garbage Collection, failing health probes.",
      "task": "Refactor the endpoint to use database-level streaming cursors / chunked generators to achieve constant O(1) memory usage.",
      "help_statement": null,
      "starter_template": "def stream_transaction_aggregates(cursor, user_id: str, batch_size: int = 1000):\n    # Implement generator yielding batches to maintain constant memory:\n    pass",
      "expected_keywords": [
        "generator",
        "stream",
        "cursor",
        "constant memory",
        "chunk"
      ]
    },
    {
      "id": "prob-40",
      "phase": 2,
      "difficulty": "Intermediate",
      "title": "BGP Route Flapping & Multi-AZ Split-Brain Partitioning",
      "category": "Site Reliability & Network Consensus",
      "scenario": "A cross-availability-zone network link flutters (flaps) intermittently. Two database nodes in different AZs lose communication with each other but both still see customer traffic, leading to conflicting write splits (split-brain).",
      "task": "Explain how quorum-based consensus (Raft/Paxos) with fencing prevents split-brain and formulate the minimum node count rule for high availability.",
      "help_statement": null,
      "starter_template": "# Quorum Consensus Architecture:\n# Minimum node formula (2F + 1):\n# Split-brain fencing mechanism:",
      "expected_keywords": [
        "quorum",
        "split-brain",
        "raft",
        "fencing",
        "consensus"
      ]
    }
  ],
  "MISSIONS": [
    {
      "id": "cloud-indep-01",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #01",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #1, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-02",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #02",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #2, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-03",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #03",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #3, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-04",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #04",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #4, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-05",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #05",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #5, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-06",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #06",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #6, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-07",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #07",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #7, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-08",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #08",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #8, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-09",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #09",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #9, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-10",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #10",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #10, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-11",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #11",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #11, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-12",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #12",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #12, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-13",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #13",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #13, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-14",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #14",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #14, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-15",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #15",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #15, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-16",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #16",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #16, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-17",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #17",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #17, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-18",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #18",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #18, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-19",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #19",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #19, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-20",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #20",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #20, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-21",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #21",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #21, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-22",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #22",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #22, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-23",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #23",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #23, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-24",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #24",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #24, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-25",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #25",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #25, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-26",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #26",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #26, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-27",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #27",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #27, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-28",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #28",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #28, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-29",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #29",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #29, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-30",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #30",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #30, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-31",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #31",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #31, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-32",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #32",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #32, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-33",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #33",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #33, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-34",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #34",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #34, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-35",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #35",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #35, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-36",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #36",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #36, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-37",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #37",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #37, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-38",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #38",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #38, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-39",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #39",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #39, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-40",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #40",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #40, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-41",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #41",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #41, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-42",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #42",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #42, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-43",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #43",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #43, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-44",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #44",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #44, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-45",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #45",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #45, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-46",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #46",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #46, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-47",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #47",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #47, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-48",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #48",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #48, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-49",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #49",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #49, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-indep-50",
      "track_id": "cloud-engineer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Cloud Engineer Independent Infrastructure Incident #50",
      "problem_brief": "Autonomous production simulation for cloud-engineer: Investigate telemetry anomaly #50, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "cloud-sre-01",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Junior SRE / Cloud Associate",
      "estimated_time_mins": 30,
      "title": "Incident 1402: Latency & 5xx Spike After Release v2.4.0",
      "problem_brief": "At 14:15 UTC, the Payments API automated paging alert triggered. p99 response times spiked from 110ms to 4,850ms, and 504 Gateway Timeout errors rose from 0.01% to 8.7% of all checkout traffic. Investigate the timeline, telemetry, logs, release notes, and runbook. Determine the trigger, distinguish facts from assumptions, recommend a safe immediate action, define verification criteria, and propose one preventative improvement."
    },
    {
      "id": "cloud-sre-02",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Junior SRE / Cloud Associate",
      "estimated_time_mins": 25,
      "title": "Incident 1488: CrashLoopBackOff & OOMKilled Flapping in Billing Service",
      "problem_brief": "Kubernetes pods for billing-gateway are flapping in CrashLoopBackOff with Exit Code 137 (OOMKilled). Memory utilization climbs linearly from 120MB to the 1024MB container limit every 8 minutes before the Linux kernel terminates the process. Review the pod events, memory profile heap snapshot, Helm memory resources diff, and application cache logs. Identify the memory leak trigger, prescribe immediate resource relief, and outline permanent leak remediation."
    },
    {
      "id": "cloud-sre-03",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level SRE / Associate",
      "estimated_time_mins": 30,
      "title": "Incident 1520: Intermittent DNS Resolution Cascades & CoreDNS Throttling",
      "problem_brief": "During flash sales, downstream microservices report intermittent 'EAI_AGAIN (getaddrinfo ENOTFOUND)' connection drops reaching 3.4% of API calls. Kubernetes worker node CPU is below 40%, but CoreDNS latency spiked to 2,400ms. Inspect the CoreDNS logs, conntrack table metrics, and pod /etc/resolv.conf search domains. Diagnose the root cause without guided hints, provide safe operational mitigation, and propose a resilient cluster DNS architecture."
    },
    {
      "id": "cloud-sre-04",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Ingress Triage: SSL/TLS Handshake Failures on Ingress Controller",
      "problem_brief": "Resolve expired wildcard TLS certificate secrets without restarting ingress pods."
    },
    {
      "id": "cloud-sre-05",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Capacity Planning: Node Autoscaler Thrashing & Spot Instance Eviction Storm",
      "problem_brief": "Tune Cluster Autoscaler cooldown periods and implement mixed instance spot pools."
    },
    {
      "id": "cloud-sre-06",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Network Security: Misconfigured Kubernetes NetworkPolicy Leaking Database Port",
      "problem_brief": "Author default-deny NetworkPolicies restricting database access to backend pods."
    },
    {
      "id": "cloud-sre-07",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Infrastructure as Code: Terraform State Lock Contention & Drift Remediation",
      "problem_brief": "Recover locked DynamoDB state tables and reconcile out-of-band console changes."
    },
    {
      "id": "cloud-sre-08",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Storage Triage: PersistentVolumeClaim ReadWriteOnce Deadlock Across AZs",
      "problem_brief": "Remediate multi-AZ pod scheduling conflicts with EBS volume attachments."
    },
    {
      "id": "cloud-sre-09",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "CI/CD Pipeline: GitHub Actions Runner Disk Saturation & Cache Invalidation",
      "problem_brief": "Clean up dangling Docker build cache layers and enforce automated ephemeral disk GC."
    },
    {
      "id": "cloud-sre-10",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Secrets Management: HashiCorp Vault Token Expiration & Pod Injection Failure",
      "problem_brief": "Renew Vault Agent lease tokens and diagnose sidecar container init crashes."
    },
    {
      "id": "cloud-sre-11",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Chaos Engineering: Network Partition Simulation & Kafka Broker Rebalance",
      "problem_brief": "Test Kafka ISR replica resilience during cross-rack availability zone network splits."
    },
    {
      "id": "cloud-sre-12",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Observability: Prometheus High Cardinality TSDB Disk Exhaustion",
      "problem_brief": "Drop unbounded user_id metric labels to prevent Prometheus memory crashes."
    },
    {
      "id": "cloud-sre-13",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Service Mesh: Istio Envoy Sidecar CPU Saturation on mTLS Handshakes",
      "problem_brief": "Tune Envoy worker thread allocations and enable mutual TLS session ticket caching."
    },
    {
      "id": "cloud-sre-14",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Disaster Recovery: Multi-Region PostgreSQL Read Replica Promotion Runbook",
      "problem_brief": "Execute controlled failover of AWS Aurora read replica to primary cluster."
    },
    {
      "id": "cloud-sre-15",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Kubernetes Upgrade: Deprecated API Version Eviction in EKS 1.28 Migration",
      "problem_brief": "Migrate Ingress networking.k8s.io/v1beta1 manifests prior to cluster control plane upgrade."
    },
    {
      "id": "cloud-sre-16",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Cost Optimization: Orphaned EBS Volumes & Unattached Cloud NAT Gateways",
      "problem_brief": "Automate audit script identifying unused cloud resources saving $14k/month."
    },
    {
      "id": "cloud-sre-17",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Security Incident: Overprivileged IAM Role Assumption via Pod Metadata Service",
      "problem_brief": "Enforce IMDSv2 and block pod access to 169.254.169.254 AWS metadata endpoint."
    },
    {
      "id": "cloud-sre-18",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Zero-Downtime Release: Flagger Canary Traffic Shifting Stalling at 20%",
      "problem_brief": "Diagnose metric threshold mismatch halting automated progressive canary progression."
    },
    {
      "id": "cloud-sre-19",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Linux Kernel: Epoll Socket Starvation & TCP SYN Flood Defense",
      "problem_brief": "Tune sysctl somaxconn, tcp_max_syn_backlog, and enable SYN cookies under DDoS."
    },
    {
      "id": "cloud-sre-20",
      "track_id": "cloud-engineer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Error Budget Review: SEV-1 Outage Postmortem & Freeze Action Plan",
      "problem_brief": "Facilitate blameless postmortem and establish engineering hardening priorities."
    },
    {
      "id": "data-analyst-01",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Junior Product Data Analyst",
      "estimated_time_mins": 30,
      "title": "Anomaly Investigation: 35% Mobile Checkout Drop",
      "problem_brief": "Yesterday's daily executive briefing showed total checkout conversion dropped from 4.8% to 3.1% week-over-week. The VP of Growth believes user sentiment dropped following a pricing change. Dive into the segmented dataset, device breakdowns, and event instrumentation to test the hypothesis and uncover the true driver."
    },
    {
      "id": "data-analyst-02",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Junior Product Data Analyst",
      "estimated_time_mins": 30,
      "title": "Cohort Retention Degradation Post-Onboarding Redesign",
      "problem_brief": "Two weeks ago, the Growth team replaced the minimalist 1-step sign-up flow with an interactive 6-step gamified onboarding tutorial. While initial sign-ups rose 4%, Day 7 (D7) cohort retention plummeted from 42% to 26%. Analyze the segmented cohort retention curves, step-by-step tutorial abandonment rates, and time-to-first-value telemetry. Identify where users churn, test the friction hypothesis, and deliver executive recommendations."
    },
    {
      "id": "data-analyst-03",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Product Data Analyst",
      "estimated_time_mins": 35,
      "title": "Experimentation Audit: Sample Ratio Mismatch (SRM) in Checkout A/B Test",
      "problem_brief": "The Growth team is celebrating an A/B test of the checkout flow showing Variant B has a +14.2% lift in average order value (AOV) with p < 0.01. However, looking at the sample allocation count shows Control received 54,200 users while Variant B received only 45,800 users (54.2% vs 45.8%), despite configuring a 50/50 split. Perform a Chi-Square goodness-of-fit test for Sample Ratio Mismatch (SRM), investigate the redirect loop telemetry, and advise leadership on whether to ship."
    },
    {
      "id": "data-analyst-04",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Pipeline Failure: Airflow DAG Deadlock Causing Stale Executive Revenue Dashboard",
      "problem_brief": "Clear upstream task instance dependencies and optimize task concurrency limits."
    },
    {
      "id": "data-analyst-05",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Data Modeling: Refactoring dbt Staging Model to Fix Duplicate Row Inflation",
      "problem_brief": "Add unique surrogate key and dedup logic using ROW_NUMBER window function."
    },
    {
      "id": "data-analyst-06",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "SQL Performance: Eliminating Full Table Scan on 2 Billion Row Event Table",
      "problem_brief": "Add date partition pruning and cluster keys to reduce warehouse query cost by 85%."
    },
    {
      "id": "data-analyst-07",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Metric Reconciliation: Resolving Gross Margin Variance Between Stripe and Warehouse",
      "problem_brief": "Reconcile payment processor fee deductions and currency exchange rate timing."
    },
    {
      "id": "data-analyst-08",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Data Contract: Upstream Schema Drift Breaking Downstream Marketing Attribution",
      "problem_brief": "Establish JSON schema validation contract on Kafka ingest topic to alert on drift."
    },
    {
      "id": "data-analyst-09",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Churn Analysis: Survival Analysis Model for Enterprise SaaS Customer Churn",
      "problem_brief": "Compute Kaplan-Meier curve and identify top leading indicators of customer downgrade."
    },
    {
      "id": "data-analyst-10",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Data Privacy: Masking Personally Identifiable Information (PII) in Analytics Marts",
      "problem_brief": "Implement SHA-256 salted hashing on email and IP addresses for GDPR compliance."
    },
    {
      "id": "data-analyst-11",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Executive KPI: Building an Executive Net Revenue Retention (NRR) Dashboard",
      "problem_brief": "Design SQL query calculating expansion, contraction, and churn across customer tiers."
    },
    {
      "id": "data-analyst-12",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Fraud Detection: Identifying Anomalous Velocity Patterns in Payment Gateway Logs",
      "problem_brief": "Write SQL window function flagging users with > 5 card attempts within 60 seconds."
    },
    {
      "id": "data-analyst-13",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "A/B Testing: Correcting for Variance Drift in Multi-Variant Pricing Experiments",
      "problem_brief": "Apply Bonferroni correction for multiple hypothesis testing across 4 treatment variants."
    },
    {
      "id": "data-analyst-14",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Data Freshness: SLA Violation Investigation for Real-Time Inventory Updates",
      "problem_brief": "Diagnose CDC (Change Data Capture) lag in Debezium connector to warehouse."
    },
    {
      "id": "data-analyst-15",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Dimensional Modeling: Implementing SCD-2 for Customer Subscription Tier Changes",
      "problem_brief": "Build slowly changing dimension table tracking valid_from and valid_to timestamps."
    },
    {
      "id": "data-analyst-16",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Marketing Mix: Multi-Touch Attribution Model Divergence Investigation",
      "problem_brief": "Compare First-Touch, Last-Touch, and Linear attribution models across ad campaigns."
    },
    {
      "id": "data-analyst-17",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Data Quality: Establishing Automated Great Expectations Assertions in CI",
      "problem_brief": "Configure automated schema tests asserting non-null constraints on order IDs."
    },
    {
      "id": "data-analyst-18",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Cohort Heatmap: Diagnosing Sudden Day-7 Drop-off in Android App Users",
      "problem_brief": "Investigate push notification permission prompt changes causing day-7 retention dip."
    },
    {
      "id": "data-analyst-19",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Operational BI: Designing a Real-Time SRE Incident SLA Response Dashboard",
      "problem_brief": "Build SQL rollup tracking MTTA (Mean Time to Acknowledge) and MTTR (Mean Time to Resolve)."
    },
    {
      "id": "data-analyst-20",
      "track_id": "data-analyst",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Analytics Strategy: Quarter-End Data Accuracy Sign-Off & Governance Audit",
      "problem_brief": "Conduct cross-departmental audit certifying metric definitions for financial filings."
    },
    {
      "id": "data-indep-01",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #01",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #1, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-02",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #02",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #2, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-03",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #03",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #3, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-04",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #04",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #4, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-05",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #05",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #5, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-06",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #06",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #6, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-07",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #07",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #7, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-08",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #08",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #8, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-09",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #09",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #9, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-10",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #10",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #10, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-11",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #11",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #11, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-12",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #12",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #12, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-13",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #13",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #13, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-14",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #14",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #14, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-15",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #15",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #15, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-16",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #16",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #16, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-17",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #17",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #17, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-18",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #18",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #18, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-19",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #19",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #19, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-20",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #20",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #20, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-21",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #21",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #21, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-22",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #22",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #22, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-23",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #23",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #23, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-24",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #24",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #24, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-25",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #25",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #25, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-26",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #26",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #26, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-27",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #27",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #27, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-28",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #28",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #28, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-29",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #29",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #29, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-30",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #30",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #30, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-31",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #31",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #31, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-32",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #32",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #32, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-33",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #33",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #33, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-34",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #34",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #34, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-35",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #35",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #35, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-36",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #36",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #36, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-37",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #37",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #37, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-38",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #38",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #38, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-39",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #39",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #39, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-40",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #40",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #40, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-41",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #41",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #41, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-42",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #42",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #42, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-43",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #43",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #43, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-44",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #44",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #44, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-45",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #45",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #45, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-46",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #46",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #46, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-47",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #47",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #47, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-48",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #48",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #48, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-49",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #49",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #49, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "data-indep-50",
      "track_id": "data-analyst",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Data Analyst Independent Analytics Audit #50",
      "problem_brief": "Autonomous production simulation for data-analyst: Investigate telemetry anomaly #50, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-01",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Junior Software Engineer",
      "estimated_time_mins": 35,
      "title": "Bug Triage: Double-Charge on Stripe Webhook Retries",
      "problem_brief": "Customers are complaining about being billed twice for their monthly subscription renewals. The Stripe webhook handler was recently refactored to support async processing. Investigate the pull request diff, unit test suite, and webhook server logs to identify the race condition/idempotency failure, write a mitigation plan, and design the fix."
    },
    {
      "id": "swe-02",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Junior Software Engineer",
      "estimated_time_mins": 30,
      "title": "Bug 2204: EventEmitter Memory Leak & Unhandled Rejection in Notification Worker",
      "problem_brief": "The notification microservice terminates with `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 error listeners added`. When Redis socket reconnects, unhandled promise rejections trigger process crash. Review the socket connection pool, unit test suite, and listener lifecycle. Fix the dangling listener leak, handle rejection safely, and design an automated leak test."
    },
    {
      "id": "swe-03",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Software Engineer",
      "estimated_time_mins": 35,
      "title": "Security Triage: SQL Injection & Filter Bypass in Product Search API",
      "problem_brief": "An internal penetration audit discovered that an attacker can inject arbitrary SQL fragments into the `/api/v2/products/search?category=electronics' OR '1'='1` query parameter, bypassing tenant isolation filters. The backend constructs SQL with dynamic string concatenation. Refactor the repository layer to use parameterized queries, ensure backward compatibility for valid special characters, and write security regression test cases."
    },
    {
      "id": "swe-04",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Performance: N+1 Query Cascade in User Activity Feed API",
      "problem_brief": "Eliminate N+1 database queries by refactoring to batch JOINs and eager loading."
    },
    {
      "id": "swe-05",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Concurrency: Distributed Locking & Race Condition in Flash Sale Inventory",
      "problem_brief": "Prevent overselling by implementing Redis Redlock distributed synchronization."
    },
    {
      "id": "swe-06",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Resilience: Circuit Breaker Implementation for Unstable 3rd-Party Tax Service",
      "problem_brief": "Wrap synchronous external API calls in circuit breakers to preserve thread pools."
    },
    {
      "id": "swe-07",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Data Modeling: Zero-Downtime Database Migration for User Phone Numbers",
      "problem_brief": "Execute expand-and-contract column migration without locking table or breaking APIs."
    },
    {
      "id": "swe-08",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Architecture: Rate Limiter Token Bucket Middleware for Public REST API",
      "problem_brief": "Protect public endpoints against denial of service using sliding window token buckets."
    },
    {
      "id": "swe-09",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Caching: Redis Cache Stampede & Cache Penetration Mitigation",
      "problem_brief": "Implement probabilistic early expiration (XFetch) and Bloom filters for non-existent keys."
    },
    {
      "id": "swe-10",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "AuthN/AuthZ: JWT Refresh Token Rotation & Replay Attack Defense",
      "problem_brief": "Enforce single-use refresh token families and revoke compromised user sessions."
    },
    {
      "id": "swe-11",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Observability: Structured JSON Logging & Distributed Trace Context Propagation",
      "problem_brief": "Instrument HTTP requests with OpenTelemetry traceparent headers and JSON logging."
    },
    {
      "id": "swe-12",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Error Handling: Global Error Handling Middleware & RFC 7807 Problem Details",
      "problem_brief": "Standardize application exception payloads using the RFC 7807 specification."
    },
    {
      "id": "swe-13",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Messaging: Dead Letter Queue (DLQ) & Idempotent Consumer in RabbitMQ",
      "problem_brief": "Handle poison pill messages gracefully without stalling message consumption pipelines."
    },
    {
      "id": "swe-14",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "API Versioning: Deprecating v1 Endpoints with Sunset Headers & Contract Tests",
      "problem_brief": "Implement graceful API deprecation with Sunset headers and schema compatibility checks."
    },
    {
      "id": "swe-15",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Microservices: Saga Pattern Implementation for Multi-Service Order Fulfillment",
      "problem_brief": "Coordinate distributed transactions across inventory, payment, and shipping services."
    },
    {
      "id": "swe-16",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Security: Cross-Site Request Forgery (CSRF) & SameSite Cookie Hardening",
      "problem_brief": "Implement cryptographic CSRF tokens and SameSite=Lax cookie policies on auth cookies."
    },
    {
      "id": "swe-17",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Performance: Server-Sent Events (SSE) Memory Accumulation in Live Dashboard",
      "problem_brief": "Prevent client connection leaks and backpressure buffer overflows in real-time streams."
    },
    {
      "id": "swe-18",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Testing: Property-Based Testing for Currency Conversion & Cent Rounding",
      "problem_brief": "Use Hypothesis to detect floating point cent discrepancies across exchange rates."
    },
    {
      "id": "swe-19",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Database: PostgreSQL Connection Pool Deadlock under High Transaction Volume",
      "problem_brief": "Establish deterministic transaction lock ordering to eliminate DB graph cycles."
    },
    {
      "id": "swe-20",
      "track_id": "software-developer",
      "type": "guided",
      "difficulty": "Mid-Level Specialist",
      "estimated_time_mins": 35,
      "title": "Deployment: Zero-Downtime Blue-Green Switchover for Core Monolith API",
      "problem_brief": "Execute DNS traffic cutover with pre-warmed connection pools and backward-compatible DB."
    },
    {
      "id": "swe-indep-01",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #01",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #1, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-02",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #02",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #2, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-03",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #03",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #3, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-04",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #04",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #4, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-05",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #05",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #5, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-06",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #06",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #6, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-07",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #07",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #7, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-08",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #08",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #8, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-09",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #09",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #9, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-10",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #10",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #10, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-11",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #11",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #11, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-12",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #12",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #12, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-13",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #13",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #13, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-14",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #14",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #14, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-15",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #15",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #15, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-16",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #16",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #16, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-17",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #17",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #17, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-18",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #18",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #18, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-19",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #19",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #19, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-20",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #20",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #20, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-21",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #21",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #21, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-22",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #22",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #22, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-23",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #23",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #23, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-24",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #24",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #24, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-25",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #25",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #25, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-26",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #26",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #26, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-27",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #27",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #27, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-28",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #28",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #28, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-29",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #29",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #29, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-30",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #30",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #30, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-31",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #31",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #31, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-32",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #32",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #32, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-33",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #33",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #33, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-34",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #34",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #34, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-35",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #35",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #35, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-36",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #36",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #36, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-37",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #37",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #37, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-38",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #38",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #38, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-39",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #39",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #39, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-40",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #40",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #40, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-41",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #41",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #41, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-42",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #42",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #42, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-43",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #43",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #43, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-44",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #44",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #44, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-45",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #45",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #45, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-46",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #46",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #46, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-47",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #47",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #47, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-48",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #48",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #48, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-49",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #49",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #49, formulate hypothesis, define safe mitigation, and provide verification criteria."
    },
    {
      "id": "swe-indep-50",
      "track_id": "software-developer",
      "type": "independent",
      "difficulty": "Senior Specialist",
      "estimated_time_mins": 45,
      "title": "Software Developer Independent Production Challenge #50",
      "problem_brief": "Autonomous production simulation for software-developer: Investigate telemetry anomaly #50, formulate hypothesis, define safe mitigation, and provide verification criteria."
    }
  ]
};
