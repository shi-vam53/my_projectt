/**
 * WorkSim Frontend Application
 * Practical-work simulation platform: dashboard, evidence tabs, readiness quiz, and rubric evaluation.
 */

// ============================================================================
// 1. DATA STORES (Tracks & Missions)
// ============================================================================

const TRACKS_DATA = {
  "cloud-engineer": {
    "id": "cloud-engineer",
    "title": "Cloud Engineer & SRE",
    "badge": "Infrastructure & Reliability",
    "color": "indigo",
    "summary": "Master real-world infrastructure incidents, cloud telemetry, CI/CD regressions, and post-mortem investigations.",
    "skills_covered": [
      "Incident Triage & Mitigation",
      "Telemetry & APM Analysis (Latency, Error Budgets)",
      "Root Cause Analysis (RCA)",
      "Runbook Execution & Safe Rollbacks"
    ],
    "default_mission_id": "cloud-sre-01",
    "industry_glossary": [
      {
        "term": "SLO (Service Level Objective)",
        "definition": "A target percentage (e.g. 99.9% uptime) that a service team commits to maintaining."
      },
      {
        "term": "p99 Latency",
        "definition": "The 99th percentile response time—meaning 99% of requests are faster than this number, highlighting worst-case user experiences."
      },
      {
        "term": "5xx HTTP Status Codes",
        "definition": "Server-side error codes (500 Internal Error, 502 Bad Gateway, 504 Gateway Timeout) indicating system-level crashes or upstream timeouts."
      },
      {
        "term": "Canary Release",
        "definition": "Deploying a new software version to a tiny subset of traffic (e.g., 2%) to observe error rates before rolling out globally."
      },
      {
        "term": "Connection Pool Exhaustion",
        "definition": "When all available database or network connections are occupied, forcing incoming requests to queue and eventually time out."
      }
    ],
    "readiness_quiz": [
      {
        "id": "ce-q1",
        "question": "An alert fires showing p99 latency jumped from 150ms to 4,000ms right after a release. What is the safest first step?",
        "options": [
          "A) SSH into the production database and delete slow queries manually",
          "B) Check recent deployment diffs, error logs, and assess whether a rollback or canary drain is warranted",
          "C) Wait 30 minutes to see if traffic naturally subsides",
          "D) Increase server CPU limits without checking why latency surged"
        ],
        "correct_answer": "B",
        "explanation": "Checking release diffs and assessing rollback options stops ongoing user impact fastest, minimizing Mean Time to Recovery (MTTR)."
      },
      {
        "id": "ce-q2",
        "question": "What is the primary difference between a fact and an assumption in an incident report?",
        "options": [
          "A) A fact is supported by direct telemetry or log timestamps; an assumption is a hypothesis that needs verification",
          "B) Facts are written by junior engineers; assumptions are written by senior engineers",
          "C) Facts always blame third-party vendors",
          "D) There is no difference in fast-paced incident calls"
        ],
        "correct_answer": "A",
        "explanation": "Clear distinction between verified signals (logs, metrics) and unconfirmed hypotheses prevents teams from pursuing dead-end rabbit holes."
      },
      {
        "id": "ce-q3",
        "question": "Why is an immediate rollback usually preferred over a quick 'hotfix' patch during an active critical outage?",
        "options": [
          "A) Rollback returns the service to a known stable state without risking unvetted changes under emergency pressure",
          "B) Hotfixes are illegal in modern DevOps",
          "C) Rollbacks never require testing",
          "D) Rollbacks erase the Git commit history permanently"
        ],
        "correct_answer": "A",
        "explanation": "Writing and deploying code under outage pressure frequently introduces secondary bugs. Rolling back to a proven build is safer."
      },
      {
        "id": "ce-q4",
        "question": "What signal best confirms that a high-latency incident has truly resolved?",
        "options": [
          "A) The on-call engineer closes the Slack thread",
          "B) Both error rates and p99/p95 latency metrics return to baseline levels for at least 15-30 minutes across all nodes",
          "C) A single test curl request returns HTTP 200 OK",
          "D) The CPU usage drops to 0%"
        ],
        "correct_answer": "B",
        "explanation": "Sustained observation across all metric percentiles and instances confirms recovery, whereas a single HTTP 200 could be a fluke."
      },
      {
        "id": "ce-q5",
        "question": "What is the primary purpose of a post-incident review (post-mortem)?",
        "options": [
          "A) To identify which individual engineer made the mistake and penalize them",
          "B) To conduct a blameless analysis, identify systemic weaknesses, and implement preventive guardrails",
          "C) To convince customers that nothing went wrong",
          "D) To document why writing tests is optional"
        ],
        "correct_answer": "B",
        "explanation": "Blameless post-mortems focus on process and technical resilience so the entire organization learns from failures."
      }
    ]
  },

  "software-developer": {
    "id": "software-developer",
    "title": "Software Developer",
    "badge": "Application Engineering",
    "color": "emerald",
    "summary": "Tackle real production bugs, API regressions, asynchronous race conditions, and clean architectural refactoring.",
    "skills_covered": [
      "Debugging Production Stack Traces",
      "API Contract & Backward Compatibility",
      "Unit & Regression Test Writing",
      "Code Review & Security Hardening"
    ],
    "default_mission_id": "swe-01",
    "industry_glossary": [
      {
        "term": "Regression",
        "definition": "A software bug that causes an existing, previously functional feature to stop working following an update."
      },
      {
        "term": "Race Condition",
        "definition": "A bug where the timing or order of concurrent events leads to corrupted state or unexpected behavior."
      },
      {
        "term": "Idempotency",
        "definition": "An API design quality where making the same request multiple times produces the exact same outcome without duplicate actions."
      },
      {
        "term": "Breaking Change",
        "definition": "An API or schema modification that forces existing client applications or consumers to crash or fail unless updated."
      },
      {
        "term": "Tech Debt",
        "definition": "The implied cost of future rework caused by choosing an easy or quick solution now instead of a better approach."
      }
    ],
    "readiness_quiz": [
      {
        "id": "sw-q1",
        "question": "A production endpoint fails intermittently only during peak hours with 'Connection reset'. What is the best initial investigation step?",
        "options": [
          "A) Rewrite the entire backend framework",
          "B) Correlate application error logs with connection pool usage and database query times during peak timestamps",
          "C) Restart the server every 5 minutes",
          "D) Delete the error logs"
        ],
        "correct_answer": "B",
        "explanation": "Correlating timestamps between application logs and resource metrics allows you to confirm whether thread or connection starvation is causing the reset."
      },
      {
        "id": "sw-q2",
        "question": "Why should you write a failing regression test before fixing a bug?",
        "options": [
          "A) To reproduce the bug reproducibly and prove your upcoming patch actually fixes it without regressions in the future",
          "B) Because unit test runners reject code without failing tests",
          "C) To make the commit history look longer",
          "D) It is an unnecessary step if the bug looks easy"
        ],
        "correct_answer": "A",
        "explanation": "A reproduction test guarantees the bug is understood and ensures no future commit accidentally reintroduces the exact same issue."
      },
      {
        "id": "sw-q3",
        "question": "What is the primary risk of modifying a database schema by renaming a column in a live production service?",
        "options": [
          "A) Ongoing queries from currently running application instances will fail immediately before they restart with new code",
          "B) Database storage size doubles instantly",
          "C) Git cannot track SQL changes",
          "D) Users cannot log in to GitHub"
        ],
        "correct_answer": "A",
        "explanation": "Zero-downtime migrations require a multi-step rollout: add new column -> dual-write -> backfill -> read from new -> drop old."
      },
      {
        "id": "sw-q4",
        "question": "When reviewing a teammate's PR, what should be your main focus?",
        "options": [
          "A) Correctness, edge cases, error handling, readability, and security implications",
          "B) Enforcing purely personal variable naming preferences",
          "C) Approving without reading to keep sprint velocity fast",
          "D) Checking how quickly they can type"
        ],
        "correct_answer": "A",
        "explanation": "Constructive code reviews catch edge case failures, security flaws, and architectural inconsistencies before they hit staging/prod."
      },
      {
        "id": "sw-q5",
        "question": "What does an HTTP 422 Unprocessable Entity status indicate?",
        "options": [
          "A) The request payload was syntactically valid JSON, but contained semantic or validation errors (e.g., missing required fields)",
          "B) The server hard drive is full",
          "C) The user has not provided authentication credentials",
          "D) The DNS server is unreachable"
        ],
        "correct_answer": "A",
        "explanation": "HTTP 422 means the server understood the content type and syntax, but cannot process the contained instructions or data attributes."
      }
    ]
  },

  "data-analyst": {
    "id": "data-analyst",
    "title": "Data Analyst",
    "badge": "Product & Business Analytics",
    "color": "amber",
    "summary": "Solve real stakeholder inquiries, conversion drops, cohort retention shifts, and synthetic data validation anomalies.",
    "skills_covered": [
      "Funnel Drop-off & Conversion Analysis",
      "Cohort Retention & Segment Breakdown",
      "Data Pipeline Anomaly Detection",
      "Evidence-backed Executive Recommendations"
    ],
    "default_mission_id": "data-analyst-01",
    "industry_glossary": [
      {
        "term": "Conversion Funnel",
        "definition": "The step-by-step journey users take toward a goal (e.g., Homepage -> Product Page -> Cart -> Checkout)."
      },
      {
        "term": "Cohort Analysis",
        "definition": "Tracking a specific group of users who share a common characteristic (such as sign-up week) over a period of time."
      },
      {
        "term": "Simpson's Paradox",
        "definition": "A trend that appears in several groups of data but disappears or reverses when the groups are combined."
      },
      {
        "term": "Tracking Event Drop",
        "definition": "When an apparent business decline is actually caused by broken telemetry code failing to log events rather than real user behavior."
      },
      {
        "term": "Statistical Significance",
        "definition": "A mathematical determination that an observed difference is unlikely to have occurred solely by random chance."
      }
    ],
    "readiness_quiz": [
      {
        "id": "da-q1",
        "question": "A product manager reports that checkout conversions plunged 40% yesterday. What is your first validation step before alarming leadership?",
        "options": [
          "A) Verify if event logging instrumentation broke or if there was a frontend tracking bug deployed yesterday",
          "B) Announce that the company's product has failed",
          "C) Change the pricing model immediately",
          "D) Delete the database records from yesterday"
        ],
        "correct_answer": "A",
        "explanation": "Often sudden, massive drops in conversion metrics are telemetry instrumentation failures (missing tracking tags) rather than sudden changes in human user behavior."
      },
      {
        "id": "da-q2",
        "question": "Why is segmenting metrics by platform (iOS, Android, Web) or country essential when investigating a sudden anomaly?",
        "options": [
          "A) High-level aggregated metrics often mask that an issue is isolated to a single app version, OS build, or regional CDN",
          "B) Because charts look better with more colors",
          "C) Segmenting is only required for marketing teams",
          "D) Aggregate data is never reliable"
        ],
        "correct_answer": "A",
        "explanation": "Segmenting isolates the root cause quickly—for instance, revealing that only iOS v12.1 users are experiencing checkout errors while web is normal."
      },
      {
        "id": "da-q3",
        "question": "What is the difference between correlation and causation in data analytics?",
        "options": [
          "A) Correlation means two metrics move together; causation means one directly causes the other to change",
          "B) Correlation applies only to revenue; causation applies only to latency",
          "C) They are identical terms used interchangeably in data science",
          "D) Causation is proven whenever a graph has an upward slope"
        ],
        "correct_answer": "A",
        "explanation": "Two metrics can correlate purely by seasonal coincidence. Establishing causation requires controlled experiments (A/B testing) or clear causal mechanisms."
      },
      {
        "id": "da-q4",
        "question": "When presenting findings to an executive stakeholder, how should you structure your report?",
        "options": [
          "A) Executive Summary with key findings & recommended actions first, followed by supporting evidence and methodology",
          "B) 100 pages of raw SQL queries without any conclusions",
          "C) Blame the engineering team in paragraph one",
          "D) Avoid providing any recommendations"
        ],
        "correct_answer": "A",
        "explanation": "Executives need the bottom-line decision impact immediately (Bottom Line Up Front / BLUF), with clear evidence backing it up."
      },
      {
        "id": "da-q5",
        "question": "What does a high cohort retention curve flattening out above 0% indicate?",
        "options": [
          "A) The product has achieved healthy long-term product-market fit for that cohort",
          "B) All users have churned completely",
          "C) The database query has an infinite loop",
          "D) The product needs to be shut down"
        ],
        "correct_answer": "A",
        "explanation": "When retention curves flatten parallel to the x-axis, a loyal core group of users continues returning indefinitely, indicating product-market fit."
      }
    ]
  }
};

const MISSIONS_DATA = {
  "cloud-sre-01": {
    "id": "cloud-sre-01",
    "track_id": "cloud-engineer",
    "type": "guided",
    "difficulty": "Junior SRE / Cloud Associate",
    "estimated_time_mins": 30,
    "title": "Incident 1402: Latency & 5xx Spike After Release v2.4.0",
    "problem_brief": "At 14:15 UTC, the Payments API automated paging alert triggered. p99 response times spiked from 110ms to 4,850ms, and 504 Gateway Timeout errors rose from 0.01% to 8.7% of all checkout traffic. Investigate the timeline, telemetry, logs, release notes, and runbook. Determine the trigger, distinguish facts from assumptions, recommend a safe immediate action, define verification criteria, and propose one preventative improvement.",
    "metadata": {
      "service": "checkout-payments-api",
      "cluster": "prod-us-east-1",
      "tier": "Tier-1 Mission Critical"
    },
    "evidence_tabs": [
      {
        "id": "timeline",
        "label": "Incident Timeline",
        "icon": "clock",
        "type": "timeline",
        "items": [
          {"time": "14:05 UTC", "event": "CI/CD pipeline builds tag release-v2.4.0 (Author: commit 9fa812c)."},
          {"time": "14:10 UTC", "event": "Rolling deployment of release-v2.4.0 completes across 12 pods in prod-us-east-1."},
          {"time": "14:14 UTC", "event": "p99 latency metric crosses threshold of 500ms (reaches 1,200ms)."},
          {"time": "14:15 UTC", "event": "PagerDuty Severity-1 alert fires: Payments API 5xx error rate > 5%."},
          {"time": "14:18 UTC", "event": "On-call SRE acknowledges alert and opens incident war room."}
        ]
      },
      {
        "id": "metrics",
        "label": "Telemetry & Metrics",
        "icon": "chart",
        "type": "telemetry",
        "summary": {
          "p50_latency": "140ms (Baseline: 45ms)",
          "p95_latency": "1,980ms (Baseline: 90ms)",
          "p99_latency": "4,850ms (Baseline: 110ms)",
          "error_rate": "8.7% (Baseline: 0.02%)",
          "db_connection_pool_saturation": "98% (Max: 100 connections per pod)",
          "fraud_check_service_health": "Healthy (response time 15ms)",
          "redis_cache_hit_rate": "89% (Normal)"
        }
      },
      {
        "id": "logs",
        "label": "Application Logs",
        "icon": "terminal",
        "type": "logs",
        "entries": [
          {"timestamp": "14:12:04 UTC", "level": "INFO", "message": "Service checkout-payments-api v2.4.0 warm-up complete."},
          {"timestamp": "14:13:21 UTC", "level": "WARN", "message": "HikariPool-1 - Connection is not available, request timed out after 3000ms."},
          {"timestamp": "14:13:45 UTC", "level": "ERROR", "message": "POST /v1/checkout/charge failed - upstream timeout after 5000ms (client_id: u_88291)."},
          {"timestamp": "14:14:10 UTC", "level": "ERROR", "message": "DB connection pool exhausted. Active: 100, Idle: 0, Waiting: 42. Thread blocked at com.payments.dao.AuditLogger.persistSyncAuditLog()"},
          {"timestamp": "14:15:02 UTC", "level": "ERROR", "message": "HTTP 504 Gateway Timeout dispatched to ingress gateway. Latency: 5002ms."}
        ]
      },
      {
        "id": "release_notes",
        "label": "Release Notes & Git Diff",
        "icon": "git",
        "type": "markdown",
        "content": "### Release v2.4.0 (Commit: `9fa812c`)\n\n**Changelog:**\n1. Added synchronous regulatory audit logging on every payment transaction (`AuditLogger.persistSyncAuditLog`).\n2. Database connection pool max size kept unchanged at 100.\n3. Added query timeout of 10s to new `payment_audit_events` table.\n4. Note from Developer: *'Audit logs now write synchronously in the payment transaction to ensure zero audit event loss.'*"
      },
      {
        "id": "runbook",
        "label": "Service Runbook",
        "icon": "book",
        "type": "markdown",
        "content": "### Payments API Operational Runbook\n\n**Standard Remediation Procedures:**\n1. **High 5xx Spike Post-Deployment**: If 5xx errors exceed 2% within 30 minutes of a new release, immediately execute safe rollback to previous stable tag (`release-v2.3.9`) via command:\n   `helm rollback payments-gateway 1`\n2. **Feature Flags**: The synchronous audit log toggle is controlled via Consul flag `ENABLE_SYNC_AUDIT_LOG=false`.\n3. **Prohibited Actions**: Do NOT restart database primaries during peak traffic without VP approval. Do NOT increase connection pools beyond database max connection limits (1200 global max)."
      }
    ],
    "submission_fields": [
      {
        "id": "incident_timeline",
        "label": "1. Incident Timeline & Impact Summary",
        "placeholder": "Summarize what happened, timestamps, and customer impact...",
        "guidance": "Include start time, peak impact, affected service, and user-facing symptoms."
      },
      {
        "id": "hypothesis",
        "label": "2. Root Cause Hypothesis (Facts vs Assumptions)",
        "placeholder": "What caused the issue? Clearly state what is proven by evidence vs what is an unconfirmed assumption...",
        "guidance": "Reference the log stack traces and release notes explicitly."
      },
      {
        "id": "safe_mitigation_plan",
        "label": "3. Immediate Safe Mitigation Plan",
        "placeholder": "What immediate action should be taken right now? Mention safety, approvals, or rollback...",
        "guidance": "Consult the Runbook for standard operating procedures."
      },
      {
        "id": "verification_steps",
        "label": "4. Verification & Health Confirmation",
        "placeholder": "How will you confirm the service is healthy again before closing the incident?",
        "guidance": "Define exact metrics and observation window."
      },
      {
        "id": "follow_up_improvement",
        "label": "5. Preventative Follow-up Action",
        "placeholder": "What long-term architectural or process change will prevent this from recurring?",
        "guidance": "Consider asynchronous queuing, connection pool tuning, or load testing."
      }
    ],
    "rubric": {
      "dimensions": [
        {
          "id": "evidence_accuracy",
          "name": "Evidence Accuracy",
          "weight": 25,
          "criteria": "Accurately references timestamps (14:10-14:15 UTC), release v2.4.0, and the specific HikariPool connection exhaustion error caused by persistSyncAuditLog()."
        },
        {
          "id": "plausibility_and_distinction",
          "name": "Plausibility & Fact/Assumption Clarity",
          "weight": 25,
          "criteria": "Clearly identifies that synchronous audit logging in the critical path saturated the DB connection pool. Explicitly marks whether the database CPU or disk I/O is an unverified assumption."
        },
        {
          "id": "safety_and_constraints",
          "name": "Safe Mitigation According to Runbook",
          "weight": 25,
          "criteria": "Recommends either an immediate rollback to v2.3.9 or flipping the Consul feature flag ENABLE_SYNC_AUDIT_LOG=false rather than dangerous untested hotfixes."
        },
        {
          "id": "verification_and_followup",
          "name": "Verification & Preventive Engineering",
          "weight": 25,
          "criteria": "Requires observing p99 latency < 150ms and 5xx error rate < 0.05% for 15+ minutes; suggests making audit logging asynchronous (e.g. via Kafka or background worker queue)."
        }
      ]
    },
    "exemplar": {
      "incident_timeline": "At 14:05 UTC, CI/CD built tag release-v2.4.0 (commit 9fa812c). At 14:10 UTC, rolling deployment completed across 12 pods in prod-us-east-1 for checkout-payments-api. By 14:14 UTC, p99 latency crossed 500ms to 1,200ms with HikariPool timeouts after 3000ms. At 14:15 UTC, Severity-1 paging alert fired as 504 Gateway Timeouts rose to 8.7% and p99 reached 4,850ms. SRE opened the war room at 14:18 UTC. Approximately 8.7% of checkout customers were experiencing payment transaction failures.",
      "hypothesis": "FACTS VERIFIED BY EVIDENCE:\n1. The incident started right after deploying release-v2.4.0 (commit 9fa812c) at 14:10 UTC.\n2. Application logs directly state: 'DB connection pool exhausted. Active: 100, Waiting: 42. Thread blocked at com.payments.dao.AuditLogger.persistSyncAuditLog()'.\n3. Release notes show synchronous regulatory audit logging was added to every payment transaction with a 10s query timeout, holding onto database connections in the critical path while pool max size remained capped at 100.\n4. Upstream fraud check (15ms) and Redis cache (89% hit rate) are completely healthy.\n\nUNVERIFIED ASSUMPTIONS:\n1. We assume database CPU or disk I/O saturated due to writes to payment_audit_events table, but DBA metrics are not yet inspected.\n2. We assume no network hardware issues occurred between pods and database.",
      "safe_mitigation_plan": "Per the Payments API Operational Runbook Standard Remediation Procedure:\n1. Execute an immediate safe rollback to stable tag release-v2.3.9 using the command:\n   `helm rollback payments-gateway 1`\n2. Alternatively, if rollback takes longer than 2 minutes, immediately flip the Consul feature flag toggle:\n   `ENABLE_SYNC_AUDIT_LOG=false` to bypass the synchronous audit logger dynamically.\n3. Strictly observe Prohibited Actions: Do NOT restart database primaries during peak traffic without VP approval, and do NOT arbitrarily increase connection pools beyond the 1200 global limit.",
      "verification_steps": "1. Monitor telemetry continuously for at least 20 minutes post-rollback.\n2. Confirm p99 latency drops from 4,850ms back to baseline (<120ms).\n3. Confirm HTTP 504 Gateway Timeout error rate returns from 8.7% to baseline (<0.02%).\n4. Verify HikariPool active connection saturation drops from 98% down to normal baseline (<30 active connections per pod, 0 waiting threads).\n5. Execute synthetic test transaction to confirm successful end-to-end checkout payment.",
      "follow_up_improvement": "Architectural Decoupling: Refactor regulatory audit logging to be completely asynchronous. Instead of blocking the HTTP transaction thread with `persistSyncAuditLog()`, publish audit log events to an asynchronous message queue (e.g. Apache Kafka or AWS SQS) with dead-letter queue (DLQ) support and backpressure monitoring. Implement end-to-end load testing in staging simulating peak traffic connection pool behavior prior to any future release."
    }
  },

  "swe-01": {
    "id": "swe-01",
    "track_id": "software-developer",
    "type": "guided",
    "difficulty": "Junior Software Engineer",
    "estimated_time_mins": 35,
    "title": "Bug Triage: Double-Charge on Stripe Webhook Retries",
    "problem_brief": "Customers are complaining about being billed twice for their monthly subscription renewals. The Stripe webhook handler was recently refactored to support async processing. Investigate the pull request diff, unit test suite, and webhook server logs to identify the race condition/idempotency failure, write a mitigation plan, and design the fix.",
    "metadata": {
      "service": "billing-webhook-service",
      "runtime": "Node.js / TypeScript",
      "tier": "Tier-1 Financial"
    },
    "evidence_tabs": [
      {
        "id": "pr_diff",
        "label": "Pull Request Diff",
        "icon": "git",
        "type": "code_diff",
        "content": "```typescript\n// Before:\nasync function handleInvoicePaymentSucceeded(event: StripeEvent) {\n  const existing = await db.payments.findByStripeEventId(event.id);\n  if (existing) return { status: 'already_processed' };\n  await db.payments.insert({ eventId: event.id, status: 'completed' });\n  await sendReceiptEmail(event.customer);\n}\n\n// After (Refactored for 'performance'):\nasync function handleInvoicePaymentSucceeded(event: StripeEvent) {\n  // Run DB insert and email concurrently to speed up response\n  Promise.all([\n    db.payments.insert({ eventId: event.id, status: 'completed' }),\n    sendReceiptEmail(event.customer)\n  ]);\n  return { status: 'queued' };\n}\n```"
      },
      {
        "id": "logs",
        "label": "Webhook Logs",
        "icon": "terminal",
        "type": "logs",
        "entries": [
          {"timestamp": "09:00:01.120Z", "level": "INFO", "message": "Received webhook evt_109283 (invoice.payment_succeeded)"},
          {"timestamp": "09:00:01.125Z", "level": "INFO", "message": "Dispatched async handlers for evt_109283"},
          {"timestamp": "09:00:01.140Z", "level": "INFO", "message": "Stripe timeout waiting for 200 OK (network blip)"},
          {"timestamp": "09:00:01.350Z", "level": "INFO", "message": "Received retry webhook evt_109283 (invoice.payment_succeeded)"},
          {"timestamp": "09:00:01.410Z", "level": "WARN", "message": "Second insert for evt_109283 executed without uniqueness check"}
        ]
      },
      {
        "id": "db_schema",
        "label": "Database Schema",
        "icon": "book",
        "type": "markdown",
        "content": "```sql\nCREATE TABLE payments (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  stripe_event_id VARCHAR(255),\n  status VARCHAR(50),\n  created_at TIMESTAMP DEFAULT NOW()\n  -- NOTE: UNIQUE constraint on stripe_event_id was dropped during v1.8 migration\n);\n```"
      }
    ],
    "submission_fields": [
      {
        "id": "bug_analysis",
        "label": "1. Root Cause & Race Condition Explanation",
        "placeholder": "Explain how the refactor removed the idempotency guard and what happened on network retry...",
        "guidance": "Explain the interaction between Stripe retries, concurrency, and DB uniqueness."
      },
      {
        "id": "fix_implementation",
        "label": "2. Proposed Code Fix & Idempotency Strategy",
        "placeholder": "Provide the pseudocode or TypeScript solution ensuring strict idempotency...",
        "guidance": "Mention database-level constraints as well as application logic."
      },
      {
        "id": "testing_plan",
        "label": "3. Regression Test Design",
        "placeholder": "Describe the unit/integration test to guarantee double-delivery cannot reoccur...",
        "guidance": "How will you simulate concurrent duplicate webhook deliveries?"
      },
      {
        "id": "customer_remediation",
        "label": "4. Customer Data Remediation Plan",
        "placeholder": "How should the existing duplicate transactions in the database be audited and refunded?",
        "guidance": "Ensure safety and auditability."
      },
      {
        "id": "follow_up_improvement",
        "label": "5. Preventative Follow-up Action",
        "placeholder": "What architecture or CI guardrails will stop idempotency regressions?",
        "guidance": "Database unique index, distributed locking or webhook idempotency middleware."
      }
    ],
    "rubric": {
      "dimensions": [
        {
          "id": "evidence_accuracy",
          "name": "Idempotency & Concurrency Mechanics",
          "weight": 25,
          "criteria": "Correctly diagnoses the missing pre-check, lack of DB unique constraint on stripe_event_id, and unhandled concurrent retry."
        },
        {
          "id": "plausibility_and_distinction",
          "name": "Code Architecture & Safety",
          "weight": 25,
          "criteria": "Proposes adding a unique database constraint on stripe_event_id and an atomic upsert or transaction."
        },
        {
          "id": "safety_and_constraints",
          "name": "Regression Test Quality",
          "weight": 25,
          "criteria": "Designs an integration test dispatching two parallel webhooks with identical event IDs to verify deduplication."
        },
        {
          "id": "verification_and_followup",
          "name": "Data Remediation & Refund Safety",
          "weight": 25,
          "criteria": "Proposes a read-only audit query to isolate duplicates before issuing refunds, preventing accidental mass refunds."
        }
      ]
    },
    "exemplar": {
      "bug_analysis": "The refactor removed the `findByStripeEventId` check and executed operations without awaiting them. When Stripe encountered a 140ms network blip, it dispatched a retry 210ms later. Because the database table dropped its UNIQUE constraint on `stripe_event_id` in v1.8, both webhook instances inserted independent rows, causing duplicate charge records and duplicate receipts.",
      "fix_implementation": "1. Add UNIQUE constraint to `payments(stripe_event_id)`. 2. Use atomic database UPSERT (`INSERT ... ON CONFLICT (stripe_event_id) DO NOTHING`). 3. Return HTTP 200 immediately once the event is recorded.",
      "testing_plan": "Write an integration test using Promise.all to simulate two concurrent webhook payloads with evt_109283 hitting the endpoint simultaneously. Verify only one DB payment record is created and receipt email is dispatched exactly once.",
      "customer_remediation": "Run a read-only query: `SELECT stripe_event_id, count(*) FROM payments GROUP BY stripe_event_id HAVING count(*) > 1`. Audit affected accounts with Finance, then issue automated refunds for the duplicate second transaction ID only.",
      "follow_up_improvement": "Enforce schema validation in migration pipelines preventing dropping UNIQUE constraints on idempotency keys. Introduce an idempotency middleware layer for all payment webhooks."
    }
  },

  "data-analyst-01": {
    "id": "data-analyst-01",
    "track_id": "data-analyst",
    "type": "guided",
    "difficulty": "Junior Product Data Analyst",
    "estimated_time_mins": 30,
    "title": "Anomaly Investigation: 35% Mobile Checkout Drop",
    "problem_brief": "Yesterday's daily executive briefing showed total checkout conversion dropped from 4.8% to 3.1% week-over-week. The VP of Growth believes user sentiment dropped following a pricing change. Dive into the segmented dataset, device breakdowns, and event instrumentation to test the hypothesis and uncover the true driver.",
    "metadata": {
      "domain": "E-Commerce Checkout Funnel",
      "data_period": "Oct 12 - Oct 19, 2026",
      "total_sessions": "450,000"
    },
    "evidence_tabs": [
      {
        "id": "funnel_summary",
        "label": "Overall Funnel Metrics",
        "icon": "chart",
        "type": "table",
        "data": [
          {"step": "1. Product View", "last_week": "450,000", "this_week": "452,000", "change": "+0.4%"},
          {"step": "2. Add to Cart", "last_week": "135,000 (30.0%)", "this_week": "136,500 (30.2%)", "change": "+1.1%"},
          {"step": "3. Initiate Checkout", "last_week": "67,500 (15.0%)", "this_week": "68,000 (15.0%)", "change": "+0.7%"},
          {"step": "4. Complete Purchase", "last_week": "21,600 (4.8%)", "this_week": "14,012 (3.1%)", "change": "-35.1% ⚠️"}
        ]
      },
      {
        "id": "segmented_data",
        "label": "Segmented by Platform & OS",
        "icon": "table",
        "type": "table",
        "data": [
          {"segment": "Desktop Chrome", "traffic_share": "45%", "conversion_last_week": "5.2%", "conversion_this_week": "5.3%", "status": "Normal"},
          {"segment": "Desktop Safari", "traffic_share": "15%", "conversion_last_week": "4.9%", "conversion_this_week": "4.8%", "status": "Normal"},
          {"segment": "Android App (v4.2)", "traffic_share": "20%", "conversion_last_week": "4.4%", "conversion_this_week": "4.3%", "status": "Normal"},
          {"segment": "iOS App (v4.3 - Released Oct 14)", "traffic_share": "20%", "conversion_last_week": "4.6%", "conversion_this_week": "0.4%", "status": "CRITICAL DROP 🚨"}
        ]
      },
      {
        "id": "telemetry_logs",
        "label": "Frontend Error Logs (iOS v4.3)",
        "icon": "terminal",
        "type": "logs",
        "entries": [
          {"timestamp": "Oct 15 10:22:01", "level": "FATAL", "client": "iOS v4.3", "error": "ApplePayController: nil unwrapped optional on `shipping_contact_postal_code`"},
          {"timestamp": "Oct 15 10:24:19", "level": "FATAL", "client": "iOS v4.3", "error": "Crash report: checkout sheet terminated unexpectedly on ApplePay button touch."}
        ]
      }
    ],
    "submission_fields": [
      {
        "id": "executive_summary",
        "label": "1. Executive Summary (BLUF)",
        "placeholder": "Summarize the findings in 2-3 sentences for leadership...",
        "guidance": "State clearly whether the VP's pricing hypothesis is supported or refuted."
      },
      {
        "id": "data_analysis",
        "label": "2. Segmented Analysis & Root Cause Evidence",
        "placeholder": "Break down the numbers proving where the conversion drop originated...",
        "guidance": "Contrast Desktop/Android vs iOS v4.3 Apple Pay crash data."
      },
      {
        "id": "immediate_recommendations",
        "label": "3. Immediate Actionable Recommendations",
        "placeholder": "What should the mobile engineering and product teams do immediately?",
        "guidance": "e.g., App Store emergency hotfix, fallback payment method, banner notice."
      },
      {
        "id": "future_instrumentation",
        "label": "4. Telemetry & Quality Guardrails",
        "placeholder": "How should automated funnel alerts and release health monitoring be improved?",
        "guidance": "Suggest release staging cohorts and anomaly threshold alerting."
      },
      {
        "id": "follow_up_improvement",
        "label": "5. Preventative Follow-up Action",
        "placeholder": "What preventative QA or deployment policy should be enacted?",
        "guidance": "Phased rollout with crash-rate alerting."
      }
    ],
    "rubric": {
      "dimensions": [
        {
          "id": "evidence_accuracy",
          "name": "Hypothesis Refutation & Rigor",
          "weight": 25,
          "criteria": "Refutes the pricing change theory with data (pricing affected all platforms, but only iOS v4.3 experienced a drop from 4.6% to 0.4%)."
        },
        {
          "id": "plausibility_and_distinction",
          "name": "Segmented Data Accuracy",
          "weight": 25,
          "criteria": "Directly quotes conversion rates across Desktop (stable ~5%), Android (stable ~4.3%), and iOS v4.3 (crashed to 0.4%)."
        },
        {
          "id": "safety_and_constraints",
          "name": "Technical Root Cause Identification",
          "weight": 25,
          "criteria": "Connects the drop to the ApplePay crash on postal code nil unwrapping in iOS release v4.3."
        },
        {
          "id": "verification_and_followup",
          "name": "Communication & Actionability",
          "weight": 25,
          "criteria": "Presents clear, concise guidance for the mobile release engineering team and executive leadership with automated threshold alerting."
        }
      ]
    },
    "exemplar": {
      "executive_summary": "The VP of Growth's pricing hypothesis is refuted by the data. The 35% conversion decline is entirely isolated to iOS App v4.3 users whose checkout conversion collapsed from 4.6% to 0.4%, while Desktop and Android conversion remained completely stable.",
      "data_analysis": "Desktop Chrome (5.3% vs 5.2%), Safari (4.8% vs 4.9%), and Android (4.3% vs 4.4%) exhibited normal conversion trends. However, iOS v4.3 traffic (20% of sessions) collapsed from 4.6% to 0.4% due to a FATAL crash in ApplePayController: nil unwrapped optional on `shipping_contact_postal_code`.",
      "immediate_recommendations": "1. Halt iOS v4.3 rollout in App Store Connect immediately. 2. Push an emergency hotfix build v4.3.1 with null-safe unwrapping. 3. Temporarily hide Apple Pay or fall back to standard credit card checkout sheet.",
      "future_instrumentation": "Implement automated platform-segmented conversion anomaly alerts that trigger when any single OS or app build conversion deviates >10% from historical baseline.",
      "follow_up_improvement": "Mandate phased rollouts (1%, 5%, 20%, 100%) for all future iOS/Android releases with automated halt if checkout crash rate exceeds 0.05%."
    }
  }
};

// ============================================================================
// 2. STATE MANAGEMENT
// ============================================================================

const state = {
  currentView: 'workspace', // 'tracks', 'workspace', 'catalog', 'admin', 'profile'
  activeTrackId: 'cloud-engineer',
  activeMissionId: 'cloud-sre-01',
  activeEvidenceTabId: 'timeline',
  
  // Readiness Quiz State
  quiz: {
    trackId: 'cloud-engineer',
    currentIndex: 0,
    answers: {}, // { [questionIndex]: selectedOptionKey }
    score: 0,
    isComplete: false
  },

  // Log filter state
  logSearchQuery: '',
  logLevelFilter: 'ALL',

  // Catalog Filter State
  catalogFilter: {
    track: 'all',
    seq: 'all',
    search: ''
  },
  allMissions: [],

  // Admin & Reviewer Ledger State
  submissionsLedger: [],
  selectedReviewSubmission: null,

  // Auto-save debounce timer
  autoSaveTimer: null
};

// ============================================================================
// 3. INITIALIZATION & DOM BINDINGS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  bindNavigation();
  bindHeaderControls();
  bindQuizModal();
  bindRubricModal();
  bindRoleGuideModal();
  bindReviewerModal();
  bindCatalogControls();
  bindAdminControls();
  bindProfileControls();
  bindFormEvents();

  // Curriculum & Auth controls
  bindAuthControls();
  bindHandbookAndQuizControls();
  checkAuthAndSession();

  // Suite features: Theme, Mobile Drawer, Hotkeys, PWA
  initTheme();
  initMobileDrawer();
  initHotkeys();
  initPwaServiceWorker();

  loadMissionsCatalog();
  renderTracksView();
  renderMissionWorkspace(state.activeMissionId);

  // Load saved draft if present
  loadDraftFromStorage(state.activeMissionId);
}

// Navigation between Career Tracks and Mission Workspace
function bindNavigation() {
  const navDashboard = document.getElementById('nav-dashboard');
  if (navDashboard) navDashboard.addEventListener('click', () => switchView('dashboard'));

  const navTracks = document.getElementById('nav-tracks');
  const navWorkspace = document.getElementById('nav-workspace');
  const navReadiness = document.getElementById('nav-readiness');
  const navRoleGuide = document.getElementById('nav-role-guide');
  const navRubricGuide = document.getElementById('nav-rubric-guide');
  const sidebarQuickSwitch = document.getElementById('sidebar-quick-switch-btn');
  const bcRoot = document.getElementById('bc-root');

  if (navTracks) navTracks.addEventListener('click', () => switchView('tracks'));
  if (navWorkspace) navWorkspace.addEventListener('click', () => switchView('workspace'));
  if (bcRoot) bcRoot.addEventListener('click', () => switchView('dashboard'));

  if (sidebarQuickSwitch) {
    sidebarQuickSwitch.addEventListener('click', () => {
      if (!state.user) {
        showAuthOverlay(true);
        showToast('Please sign in first.', 'info');
        return;
      }
      if (state.user.role_locked) {
        showToast(`Your career track is permanently locked to ${getRoleDisplayName(state.user.role)}.`, 'info');
      } else {
        openRoleOnboardingModal();
      }
    });
  }

  const navCatalog = document.getElementById('nav-catalog');
  if (navCatalog) navCatalog.addEventListener('click', () => switchView('catalog'));

  const navAdmin = document.getElementById('nav-admin');
  if (navAdmin) navAdmin.addEventListener('click', () => switchView('admin'));

  const navProfile = document.getElementById('nav-profile');
  if (navProfile) navProfile.addEventListener('click', () => switchView('profile'));

  const navHandbook = document.getElementById('nav-handbook');
  if (navHandbook) navHandbook.addEventListener('click', () => switchView('handbook'));

  const navQuiz = document.getElementById('nav-quiz');
  if (navQuiz) navQuiz.addEventListener('click', () => {
    switchView('quiz');
  });

  const navProblems = document.getElementById('nav-problems');
  if (navProblems) navProblems.addEventListener('click', () => {
    switchView('problems');
  });

  if (navReadiness) {
    navReadiness.addEventListener('click', () => {
      if (!state.user) {
        showAuthOverlay(true);
        return;
      }
      switchView('quiz');
    });
  }

  if (navRoleGuide) {
    navRoleGuide.addEventListener('click', () => {
      if (!state.user) {
        showAuthOverlay(true);
        return;
      }
      switchView('handbook');
    });
  }

  if (navRubricGuide) {
    navRubricGuide.addEventListener('click', () => {
      if (!state.user) {
        showAuthOverlay(true);
        return;
      }
      openRubricModal(true); // Open in guide / preview mode
    });
  }
}

function switchView(viewName) {
  if (!state.user) {
    showAuthOverlay(true);
    showToast('Please sign in or create an account to access ' + viewName + '.', 'warning');
    return;
  }

  state.currentView = viewName;
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    tracks: document.getElementById('view-tracks'),
    workspace: document.getElementById('view-workspace'),
    catalog: document.getElementById('view-catalog'),
    admin: document.getElementById('view-admin'),
    profile: document.getElementById('view-profile'),
    handbook: document.getElementById('view-handbook'),
    quiz: document.getElementById('view-quiz'),
    problems: document.getElementById('view-problems')
  };
  const navs = {
    dashboard: document.getElementById('nav-dashboard'),
    tracks: document.getElementById('nav-tracks'),
    workspace: document.getElementById('nav-workspace'),
    catalog: document.getElementById('nav-catalog'),
    admin: document.getElementById('nav-admin'),
    profile: document.getElementById('nav-profile'),
    handbook: document.getElementById('nav-handbook'),
    quiz: document.getElementById('nav-quiz'),
    problems: document.getElementById('nav-problems')
  };

  Object.keys(views).forEach(key => {
    if (views[key]) views[key].style.display = (key === viewName) ? 'block' : 'none';
    if (navs[key]) {
      if (key === viewName) navs[key].classList.add('active');
      else navs[key].classList.remove('active');
    }
  });

  if (viewName === 'dashboard') renderDashboardView();
  if (viewName === 'catalog') renderCatalogView();
  if (viewName === 'admin') renderAdminView();
  if (viewName === 'profile') renderProfileView();
  if (viewName === 'tracks') renderTracksView();
  if (viewName === 'handbook') updateHandbookForUserRole();
  if (viewName === 'quiz') loadQuizQuestions();
  if (viewName === 'problems') loadProblemsBank();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindHeaderControls() {
  const trackDropdown = document.getElementById('track-select-dropdown');
  const headerQuizBtn = document.getElementById('header-quiz-btn');
  const headerRoleGuideBtn = document.getElementById('header-role-guide-btn');

  trackDropdown.value = state.activeTrackId;
  trackDropdown.addEventListener('change', (e) => {
    selectTrack(e.target.value);
  });

  headerQuizBtn.addEventListener('click', () => {
    openReadinessQuiz(state.activeTrackId);
  });

  if (headerRoleGuideBtn) {
    headerRoleGuideBtn.addEventListener('click', () => {
      openRoleGuideModal(state.activeTrackId);
    });
  }
}

function selectTrack(trackId) {
  if (!TRACKS_DATA[trackId]) return;
  state.activeTrackId = trackId;

  // Update dropdown
  const trackDropdown = document.getElementById('track-select-dropdown');
  if (trackDropdown) trackDropdown.value = trackId;

  // Determine track's mission
  const track = TRACKS_DATA[trackId];
  const missionId = track.default_mission_id || 'cloud-sre-01';
  state.activeMissionId = missionId;

  // Update breadcrumb
  const bcTrack = document.getElementById('bc-track');
  const bcMission = document.getElementById('bc-mission');
  if (bcTrack) bcTrack.textContent = track.title;

  const mission = MISSIONS_DATA[missionId];
  if (bcMission && mission) {
    bcMission.textContent = mission.title.split(':')[0] || mission.title;
  }

  // Update sidebar widget
  const sidebarTrackName = document.getElementById('sidebar-active-track-name');
  const sidebarMissionName = document.getElementById('sidebar-active-mission-name');
  if (sidebarTrackName) sidebarTrackName.textContent = track.title;
  if (sidebarMissionName && mission) {
    sidebarMissionName.textContent = mission.title.split(':')[0] + ' (' + mission.type + ')';
  }

  // Render workspace
  renderMissionWorkspace(missionId);
  loadDraftFromStorage(missionId);

  // Update active track card styling in tracks view
  renderTracksView();

  showToast(`Switched active role track to ${track.title}`, 'info');
}

// ============================================================================
// 4. CAREER TRACK SELECTOR RENDERING
// ============================================================================

function renderTracksView() {
  const container = document.getElementById('tracks-cards-container');
  if (!container) return;

  container.innerHTML = '';

  Object.values(TRACKS_DATA).forEach(track => {
    const isCurrentActive = track.id === state.activeTrackId;
    const card = document.createElement('div');
    card.className = `track-card card ${isCurrentActive ? 'active-track' : ''}`;

    const badgeColorClass = track.color === 'indigo' ? 'badge-indigo' : (track.color === 'emerald' ? 'badge-emerald' : 'badge-amber');

    card.innerHTML = `
      <div class="track-card-header">
        <span class="track-card-badge ${badgeColorClass}">${escapeHtml(track.badge)}</span>
        ${isCurrentActive ? '<span class="badge badge-indigo">Current Active</span>' : ''}
      </div>

      <h2 class="track-title">${escapeHtml(track.title)}</h2>
      <p class="track-summary">${escapeHtml(track.summary)}</p>

      <div class="track-skills-section">
        <div class="track-skills-label">Core Competencies:</div>
        <div class="skills-pills">
          ${track.skills_covered.map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join('')}
        </div>
      </div>

      <div class="track-actions">
        <button class="btn btn-primary btn-start-track" data-track-id="${track.id}">
          Start Track
        </button>
        <button class="btn btn-outline btn-quiz-track" data-track-id="${track.id}">
          Readiness Check (5 Qs)
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach card button handlers
  container.querySelectorAll('.btn-start-track').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trackId = e.currentTarget.getAttribute('data-track-id');
      selectTrack(trackId);
      switchView('workspace');
    });
  });

  container.querySelectorAll('.btn-quiz-track').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trackId = e.currentTarget.getAttribute('data-track-id');
      openReadinessQuiz(trackId);
    });
  });

  // Render glossary
  renderGlossaryItems();
}

function renderGlossaryItems() {
  const glossaryContainer = document.getElementById('glossary-items-container');
  if (!glossaryContainer) return;

  const currentTrack = TRACKS_DATA[state.activeTrackId] || TRACKS_DATA['cloud-engineer'];
  glossaryContainer.innerHTML = '';

  currentTrack.industry_glossary.forEach(item => {
    const el = document.createElement('div');
    el.className = 'glossary-item';
    el.innerHTML = `
      <div class="glossary-term">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        ${escapeHtml(item.term)}
      </div>
      <div class="glossary-def">${escapeHtml(item.definition)}</div>
    `;
    glossaryContainer.appendChild(el);
  });
}

// ============================================================================
// 5. INTERACTIVE MISSION WORKSPACE RENDERING
// ============================================================================

async function renderMissionWorkspace(missionId) {
  let mission = MISSIONS_DATA[missionId];
  if (!mission || !mission.evidence_tabs) {
    try {
      const res = await fetch(`/api/missions/${missionId}`);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json') && res.ok) {
        mission = await res.json();
        MISSIONS_DATA[missionId] = mission;
      }
    } catch (e) {
      console.warn('Mission fetch fallback:', e);
    }
  }

  // If still missing or metadata only from catalog, load from offline catalog or fallback
  if (!mission) {
    const offlineList = (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.MISSIONS) || [];
    mission = offlineList.find(m => m.id === missionId);
  }
  if (!mission) mission = MISSIONS_DATA['cloud-sre-01'];

  // Ensure full evidence tabs exist for any mission
  if (!mission.evidence_tabs) {
    mission.metadata = mission.metadata || {
      tier: 'Tier-1 Mission Critical',
      service: mission.track_id === 'software-developer' ? 'Application API' : (mission.track_id === 'data-analyst' ? 'ETL Pipeline' : 'Cloud Cluster'),
      runtime: 'Production Linux',
      cluster: 'us-east-1 prod'
    };
    mission.submission_fields = mission.submission_fields || [
      { id: 'timeline_impact', label: '1. Incident Timeline & Customer Impact', placeholder: 'Assess the start time, impacted services, failure blast radius, and SLO degradation...', required: true },
      { id: 'root_cause_hypothesis', label: '2. Root Cause Hypothesis (Telemetry vs Assumptions)', placeholder: 'Delineate concrete telemetry evidence from initial assumptions...', required: true },
      { id: 'mitigation_plan', label: '3. Immediate Safe Mitigation Plan (Runbook SOP)', placeholder: 'Step-by-step containment steps, rollback procedure, or traffic shedding...', required: true },
      { id: 'verification', label: '4. Health Verification & Recovery Confirmation', placeholder: 'Which SLI/SLO metrics, query checks, or status probes confirm full recovery?...', required: true },
      { id: 'preventative_hardening', label: '5. Preventative Hardening & Architectural Fix', placeholder: 'What automated tests, alert rules, or code refactor prevents regression?...', required: true }
    ];
    mission.evidence_tabs = [
      {
        id: 'timeline',
        title: 'Incident Timeline',
        type: 'timeline',
        content: [
          { time: '14:00 UTC', event: 'Scheduled deployment or pipeline trigger started.' },
          { time: '14:15 UTC', event: 'Automated monitoring detected anomaly: ' + mission.title },
          { time: '14:20 UTC', event: 'On-call engineer paged. Incident triage channel opened.' },
          { time: '14:35 UTC', event: 'Customer reports and error rates confirmed; mitigation required.' }
        ]
      },
      {
        id: 'metrics',
        title: 'Telemetry & APM',
        type: 'metrics',
        content: {
          chart_type: 'latency_vs_errors',
          datapoints: [
            { timestamp: '14:00', latency_p99: 110, error_rate: 0.01 },
            { timestamp: '14:15', latency_p99: 1850, error_rate: 4.2 },
            { timestamp: '14:30', latency_p99: 4850, error_rate: 8.7 },
            { timestamp: '14:45', latency_p99: 4120, error_rate: 7.9 }
          ]
        }
      },
      {
        id: 'logs',
        title: 'Production Logs',
        type: 'log_viewer',
        content: [
          '[WARN] 14:15:02.102 [worker-04] Elevated latency detected on critical request path',
          '[ERROR] 14:15:18.421 [worker-04] Connection timeout / threshold exceeded: ' + (mission.problem_brief || 'Failure in subsystem'),
          '[FATAL] 14:20:05.890 [router] Circuit breaker triggered; fallback response invoked'
        ]
      },
      {
        id: 'runbook',
        title: 'Standard Runbook',
        type: 'markdown_doc',
        content: `### Standard Operating Procedure (SOP)\n1. Acknowledge alert in the incident command channel.\n2. Review recent commits and configuration updates.\n3. Execute safe traffic shift or automated rollback if SLO error budget is depleted.\n4. Verify recovery through APM latency percentiles and error rates.\n5. Author blameless post-mortem handoff report.`
      }
    ];
    mission.rubric = mission.rubric || {
      passing_score: 75,
      dimensions: [
        { name: 'Evidence Grounding & Metric Analysis', weight: 25, criteria: 'Correctly identifies telemetry anomalies, p99 spikes, and timeline sequence.' },
        { name: 'Root Cause Reasoning & Plausibility', weight: 25, criteria: 'Delineates verified factual logs from unproven hypotheses.' },
        { name: 'Operational Containment & Safe Mitigation', weight: 25, criteria: 'Executes non-destructive rollbacks, circuit breaking, or config fixes.' },
        { name: 'Verification Rigor & Preventative Hardening', weight: 25, criteria: 'Validates health recovery and adds automated safeguards.' }
      ]
    };
    MISSIONS_DATA[mission.id] = mission;
  }

  state.activeMissionId = mission.id;
  if (mission.track_id) state.activeTrackId = mission.track_id;

  const track = TRACKS_DATA[mission.track_id] || TRACKS_DATA[state.activeTrackId] || TRACKS_DATA['cloud-engineer'];

  // Mission Header Banner
  const titleEl = document.getElementById('mission-title');
  const briefEl = document.getElementById('mission-problem-brief');
  const trackBadgeEl = document.getElementById('mission-track-badge');
  const diffBadgeEl = document.getElementById('mission-difficulty-badge');
  const timeTextEl = document.getElementById('mission-time-text');
  const tierBadgeEl = document.getElementById('mission-tier-badge');

  if (titleEl) titleEl.textContent = mission.title;
  if (briefEl) briefEl.textContent = mission.problem_brief;
  if (trackBadgeEl) trackBadgeEl.textContent = track.title;
  if (diffBadgeEl) diffBadgeEl.textContent = mission.difficulty;
  if (timeTextEl) timeTextEl.textContent = `${mission.estimated_time_mins || 30} mins`;
  if (tierBadgeEl) tierBadgeEl.textContent = (mission.metadata && mission.metadata.tier) || 'Tier-1 Mission Critical';

  // Metadata bar
  const metaService = document.getElementById('meta-service');
  const metaCluster = document.getElementById('meta-cluster');
  const metaType = document.getElementById('meta-type');

  if (metaService) metaService.textContent = (mission.metadata && (mission.metadata.service || mission.metadata.domain)) || 'N/A';
  if (metaCluster) metaCluster.textContent = (mission.metadata && (mission.metadata.cluster || mission.metadata.runtime)) || 'N/A';
  if (metaType) metaType.textContent = mission.type ? `${mission.type.toUpperCase()} Simulation` : 'Guided';

  // Render Evidence Tabs Navigation & Body
  renderEvidenceTabs(mission);

  // Render Structured Submission Form Fields
  renderSubmissionFields(mission);
}

function renderEvidenceTabs(mission) {
  const navContainer = document.getElementById('evidence-tabs-nav');
  if (!navContainer) return;

  navContainer.innerHTML = '';

  const tabs = mission.evidence_tabs || [];
  if (tabs.length === 0) return;

  // Make sure activeEvidenceTabId exists in this mission
  const activeTabExists = tabs.some(t => t.id === state.activeEvidenceTabId);
  if (!activeTabExists) {
    state.activeEvidenceTabId = tabs[0].id;
  }

  tabs.forEach(tab => {
    const isActive = tab.id === state.activeEvidenceTabId;
    const btn = document.createElement('button');
    btn.className = `tab-btn ${isActive ? 'active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.setAttribute('data-tab-id', tab.id);

    let iconSvg = '';
    if (tab.id === 'timeline') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
    } else if (tab.id === 'metrics' || tab.id === 'funnel_summary') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>';
    } else if (tab.id === 'logs' || tab.id === 'telemetry_logs') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>';
    } else if (tab.id === 'release_notes' || tab.id === 'pr_diff') {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
    }

    btn.innerHTML = `${iconSvg} <span>${escapeHtml(tab.label)}</span>`;
    btn.addEventListener('click', () => {
      state.activeEvidenceTabId = tab.id;
      renderEvidenceTabs(mission);
    });

    navContainer.appendChild(btn);
  });

  renderActiveTabContent(mission);
}

function renderActiveTabContent(mission) {
  const container = document.getElementById('evidence-tab-body');
  if (!container) return;

  const activeTab = mission.evidence_tabs.find(t => t.id === state.activeEvidenceTabId) || mission.evidence_tabs[0];
  if (!activeTab) {
    container.innerHTML = '<p class="text-muted">No evidence data available.</p>';
    return;
  }

  container.innerHTML = '';

  if (activeTab.type === 'timeline') {
    // 1. TIMELINE
    const timeline = document.createElement('div');
    timeline.className = 'timeline-container';
    timeline.innerHTML = '<div class="timeline-line"></div>';

    (activeTab.items || []).forEach(item => {
      const entry = document.createElement('div');
      entry.className = 'timeline-entry';
      const isSevAlert = item.event.includes('Severity-1') || item.event.includes('alert');

      entry.innerHTML = `
        <div class="timeline-dot ${isSevAlert ? 'alert' : ''}"></div>
        <div class="timeline-badge">${escapeHtml(item.time)}</div>
        <div class="timeline-event-text">${escapeHtml(item.event)}</div>
      `;
      timeline.appendChild(entry);
    });

    container.appendChild(timeline);

  } else if (activeTab.type === 'telemetry') {
    // 2. TELEMETRY & METRICS
    const summary = activeTab.summary || {};
    const metricsGrid = document.createElement('div');
    metricsGrid.className = 'metrics-grid';

    // Latency card (Critical)
    metricsGrid.innerHTML += `
      <div class="metric-card critical">
        <div class="metric-title">p99 Latency (Critical Spike)</div>
        <div class="metric-value" style="color: var(--rose-600);">${escapeHtml(summary.p99_latency || '4,850ms')}</div>
        <div class="metric-baseline">Baseline: 110ms (+4,309% surge)</div>
        <div class="metric-bar-container">
          <div class="metric-bar-fill danger" style="width: 95%;"></div>
        </div>
      </div>

      <div class="metric-card warning">
        <div class="metric-title">p95 & p50 Latencies</div>
        <div class="metric-value" style="color: var(--amber-700);">${escapeHtml(summary.p95_latency || '1,980ms')}</div>
        <div class="metric-baseline">p50: ${escapeHtml(summary.p50_latency || '140ms')} (Baseline: 45ms)</div>
        <div class="metric-bar-container">
          <div class="metric-bar-fill warn" style="width: 70%;"></div>
        </div>
      </div>

      <div class="metric-card critical">
        <div class="metric-title">504 Gateway Timeout Errors</div>
        <div class="metric-value" style="color: var(--rose-600);">${escapeHtml(summary.error_rate || '8.7%')}</div>
        <div class="metric-baseline">Baseline: 0.02% of traffic</div>
        <div class="metric-bar-container">
          <div class="metric-bar-fill danger" style="width: 87%;"></div>
        </div>
      </div>

      <div class="metric-card critical">
        <div class="metric-title">HikariPool DB Saturation</div>
        <div class="metric-value" style="color: var(--rose-600);">${escapeHtml(summary.db_connection_pool_saturation || '98%')}</div>
        <div class="metric-baseline">Max: 100 connections / pod</div>
        <div class="metric-bar-container">
          <div class="metric-bar-fill danger" style="width: 98%;"></div>
        </div>
      </div>

      <div class="metric-card healthy">
        <div class="metric-title">Fraud Check Service Health</div>
        <div class="metric-value" style="color: var(--emerald-600);">${escapeHtml(summary.fraud_check_service_health || 'Healthy')}</div>
        <div class="metric-baseline">Response time: 15ms (Normal)</div>
        <div class="metric-bar-container">
          <div class="metric-bar-fill safe" style="width: 100%;"></div>
        </div>
      </div>

      <div class="metric-card healthy">
        <div class="metric-title">Redis Cache Hit Rate</div>
        <div class="metric-value" style="color: var(--emerald-600);">${escapeHtml(summary.redis_cache_hit_rate || '89%')}</div>
        <div class="metric-baseline">Operational target: >85%</div>
        <div class="metric-bar-container">
          <div class="metric-bar-fill safe" style="width: 89%;"></div>
        </div>
      </div>
    `;

    container.appendChild(metricsGrid);

  } else if (activeTab.type === 'logs') {
    // 3. APPLICATION LOGS WITH LIVE SEARCH FILTER
    const controls = document.createElement('div');
    controls.className = 'logs-controls';
    controls.innerHTML = `
      <div class="log-search-wrapper">
        <svg class="log-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="log-search-input" class="log-search-input" placeholder="Search logs (e.g. HikariPool, timeout, AuditLogger)..." value="${escapeHtml(state.logSearchQuery)}">
      </div>
      <div class="log-filters">
        <button class="filter-btn ${state.logLevelFilter === 'ALL' ? 'active' : ''}" data-level="ALL">All</button>
        <button class="filter-btn ${state.logLevelFilter === 'ERROR' ? 'active' : ''}" data-level="ERROR">ERROR</button>
        <button class="filter-btn ${state.logLevelFilter === 'WARN' ? 'active' : ''}" data-level="WARN">WARN</button>
        <button class="filter-btn ${state.logLevelFilter === 'INFO' ? 'active' : ''}" data-level="INFO">INFO</button>
      </div>
      <div id="log-results-count" style="font-size: 0.75rem; color: var(--text-muted); margin-left: auto;"></div>
    `;

    const stream = document.createElement('div');
    stream.className = 'logs-stream';
    stream.id = 'logs-stream-container';

    container.appendChild(controls);
    container.appendChild(stream);

    // Bind log filter controls
    const searchInput = controls.querySelector('#log-search-input');
    searchInput.addEventListener('input', (e) => {
      state.logSearchQuery = e.target.value;
      renderLogEntries(activeTab.entries || []);
    });

    controls.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.logLevelFilter = e.currentTarget.getAttribute('data-level');
        controls.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderLogEntries(activeTab.entries || []);
      });
    });

    renderLogEntries(activeTab.entries || []);

  } else if (activeTab.type === 'markdown' || activeTab.type === 'code_diff') {
    // 4. MARKDOWN / RELEASE NOTES / RUNBOOK / DIFF
    const markdownWrapper = document.createElement('div');
    markdownWrapper.className = 'markdown-view';

    let contentHtml = '';
    if (activeTab.id === 'release_notes') {
      contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin-bottom: 0;">Release v2.4.0</h3>
          <span class="badge badge-indigo">Commit: 9fa812c</span>
        </div>
        <p><strong>Deployment Timestamp:</strong> 14:10 UTC across 12 pods (prod-us-east-1)</p>
        <div style="margin-top: 1rem;">
          <h4>Changelog & Commits:</h4>
          <ul>
            <li><strong>Audit Logging:</strong> Added synchronous regulatory audit logging on every payment transaction (<code>AuditLogger.persistSyncAuditLog()</code>).</li>
            <li><strong>Connection Pool:</strong> Database connection pool max size kept unchanged at 100 connections per pod.</li>
            <li><strong>Query Timeout:</strong> Added query timeout of 10s to new <code>payment_audit_events</code> table.</li>
          </ul>
        </div>
        <div class="code-diff-block">
          <span style="color: #64748b;">// checkout-payments-api/src/service/PaymentChargeService.java</span><br>
          <span style="color: #94a3b8;">&nbsp;public PaymentResponse processCharge(PaymentRequest req) {</span><br>
          <span style="color: #94a3b8;">&nbsp;&nbsp;&nbsp;verifyFraudScore(req);</span><br>
          <span class="diff-add">+&nbsp;&nbsp;auditLogger.persistSyncAuditLog(req); // Synchronous regulatory log</span><br>
          <span style="color: #94a3b8;">&nbsp;&nbsp;&nbsp;return executeStripeCharge(req);</span><br>
          <span style="color: #94a3b8;">&nbsp;}</span>
        </div>
        <div class="developer-note-box">
          <strong>Developer PR Note:</strong> <em>"Audit logs now write synchronously in the payment transaction to ensure zero audit event loss."</em>
        </div>
      `;
    } else if (activeTab.id === 'runbook') {
      contentHtml = `
        <h3>Payments API Operational Runbook (SOP-PAY-104)</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Standard triage and remediation procedures for payments-gateway and checkout-payments-api.</p>
        
        <div class="runbook-procedure">
          <div class="procedure-title">
            <span class="badge badge-rose">SOP 1</span>
            High 5xx Spike Post-Deployment
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            If 5xx errors exceed 2% within 30 minutes of a new release, immediately execute safe rollback to previous stable tag (<code>release-v2.3.9</code>).
          </p>
          <div class="command-box">
            <code>helm rollback payments-gateway 1</code>
            <button class="btn-copy-cmd" onclick="copyText('helm rollback payments-gateway 1')">Copy Command</button>
          </div>
        </div>

        <div class="runbook-procedure">
          <div class="procedure-title">
            <span class="badge badge-amber">SOP 2</span>
            Emergency Feature Flags (Consul KV)
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            The synchronous audit log toggle is controlled via Consul flag:
          </p>
          <div class="command-box">
            <code>ENABLE_SYNC_AUDIT_LOG=false</code>
            <button class="btn-copy-cmd" onclick="copyText('ENABLE_SYNC_AUDIT_LOG=false')">Copy Key</button>
          </div>
        </div>

        <div class="prohibited-actions-box">
          <div class="prohibited-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Strictly Prohibited Operational Actions
          </div>
          <ul style="padding-left: 1.25rem; margin-top: 0.35rem; font-size: 0.825rem;">
            <li>Do <strong>NOT</strong> restart database primaries during peak traffic without VP Engineering approval.</li>
            <li>Do <strong>NOT</strong> increase connection pools beyond database max connection limits (1200 global max).</li>
            <li>Do <strong>NOT</strong> push untested ad-hoc hotfixes to production pods without staging validation.</li>
          </ul>
        </div>
      `;
    } else {
      // Generic markdown renderer for other missions
      contentHtml = renderSimpleMarkdown(activeTab.content || '');
    }

    markdownWrapper.innerHTML = contentHtml;
    container.appendChild(markdownWrapper);

  } else if (activeTab.type === 'table') {
    // 5. TABLE (for Data Analyst missions)
    const tableWrapper = document.createElement('div');
    tableWrapper.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '0.85rem';

    const rows = activeTab.data || [];
    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);
      let theadHtml = '<thead><tr style="background: var(--bg-main); text-align: left; border-bottom: 2px solid var(--border-color);">';
      headers.forEach(h => {
        theadHtml += `<th style="padding: 0.75rem; text-transform: capitalize;">${escapeHtml(h.replace(/_/g, ' '))}</th>`;
      });
      theadHtml += '</tr></thead>';

      let tbodyHtml = '<tbody>';
      rows.forEach(r => {
        tbodyHtml += '<tr style="border-bottom: 1px solid var(--border-color);">';
        headers.forEach(h => {
          tbodyHtml += `<td style="padding: 0.75rem;">${escapeHtml(String(r[h]))}</td>`;
        });
        tbodyHtml += '</tr>';
      });
      tbodyHtml += '</tbody>';

      table.innerHTML = theadHtml + tbodyHtml;
    }

    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  }
}

function renderLogEntries(entries) {
  const stream = document.getElementById('logs-stream-container');
  const countEl = document.getElementById('log-results-count');
  if (!stream) return;

  const query = state.logSearchQuery.toLowerCase().trim();
  const levelFilter = state.logLevelFilter;

  const filtered = entries.filter(item => {
    // Filter level
    if (levelFilter !== 'ALL' && item.level !== levelFilter) {
      return false;
    }
    // Search query
    if (query) {
      const msg = (item.message || item.error || '').toLowerCase();
      const ts = (item.timestamp || '').toLowerCase();
      const lvl = (item.level || '').toLowerCase();
      return msg.includes(query) || ts.includes(query) || lvl.includes(query);
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${entries.length} log lines`;
  }

  stream.innerHTML = '';
  if (filtered.length === 0) {
    stream.innerHTML = '<div style="color: #64748b; padding: 1rem; text-align: center;">No log lines match current search/filter.</div>';
    return;
  }

  filtered.forEach(item => {
    const line = document.createElement('div');
    line.className = 'log-line';

    const msg = item.message || item.error || '';
    let highlightedMsg = escapeHtml(msg);
    if (query) {
      const reg = new RegExp(`(${escapeRegex(query)})`, 'gi');
      highlightedMsg = highlightedMsg.replace(reg, '<mark>$1</mark>');
    }

    line.innerHTML = `
      <span class="log-timestamp">${escapeHtml(item.timestamp)}</span>
      <span class="log-level ${escapeHtml(item.level)}">${escapeHtml(item.level)}</span>
      <span class="log-msg">${highlightedMsg}</span>
    `;

    stream.appendChild(line);
  });
}

function renderSimpleMarkdown(text) {
  if (!text) return '';
  // Sanitize raw HTML tags first to neutralize script and event handler injection
  const sanitized = escapeHtml(text);
  return sanitized
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<div class="code-diff-block"><pre>$2</pre></div>')
    .replace(/\n\n/g, '<br><br>');
}

// ============================================================================
// 6. STRUCTURED SUBMISSION FORM & LOCAL DRAFT AUTO-SAVING
// ============================================================================

function renderSubmissionFields(mission) {
  const container = document.getElementById('form-fields-container');
  if (!container) return;

  container.innerHTML = '';

  const fields = mission.submission_fields || [];
  fields.forEach(field => {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'form-field-group';

    fieldGroup.innerHTML = `
      <div class="field-label-row">
        <label for="field-${field.id}" class="field-label">${escapeHtml(field.label)}</label>
        <span class="field-char-count" id="count-${field.id}">0 characters</span>
      </div>
      <div class="field-guidance">${escapeHtml(field.guidance)}</div>
      <textarea
        id="field-${field.id}"
        name="${field.id}"
        class="field-textarea"
        placeholder="${escapeHtml(field.placeholder)}"
        data-field-id="${field.id}"
      ></textarea>
      <div class="field-error-msg" id="error-${field.id}">This field is required for rubric evaluation.</div>
    `;

    container.appendChild(fieldGroup);
  });

  // Attach textarea listeners for character count & auto-saving
  fields.forEach(field => {
    const textarea = document.getElementById(`field-${field.id}`);
    const countEl = document.getElementById(`count-${field.id}`);

    if (textarea) {
      textarea.addEventListener('input', () => {
        if (countEl) {
          countEl.textContent = `${textarea.value.length} characters`;
        }
        textarea.classList.remove('error');
        const errorEl = document.getElementById(`error-${field.id}`);
        if (errorEl) errorEl.style.display = 'none';

        triggerAutoSave();
      });
    }
  });
}

function bindFormEvents() {
  const form = document.getElementById('mission-submission-form');
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnClear = document.getElementById('btn-clear-submission');
  const btnPrefill = document.getElementById('btn-prefill-good');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmitRubric();
    });
  }

  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', () => {
      saveDraftToStorage(state.activeMissionId, true);
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your current submission draft?')) {
        clearDraft(state.activeMissionId);
      }
    });
  }

  if (btnPrefill) {
    btnPrefill.addEventListener('click', () => {
      prefillExemplarResponse(state.activeMissionId);
    });
  }
}

function triggerAutoSave() {
  const indicator = document.getElementById('autosave-indicator');
  const indicatorText = document.getElementById('autosave-text');
  const formStatus = document.getElementById('form-autosave-status');

  if (indicator) indicator.classList.add('saving');
  if (indicatorText) indicatorText.textContent = 'Saving draft...';
  if (formStatus) formStatus.querySelector('.text').textContent = 'Saving...';

  clearTimeout(state.autoSaveTimer);
  state.autoSaveTimer = setTimeout(() => {
    saveDraftToStorage(state.activeMissionId, false);
    if (indicator) indicator.classList.remove('saving');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (indicatorText) indicatorText.textContent = `Draft saved (${timeStr})`;
    if (formStatus) formStatus.querySelector('.text').textContent = `Saved locally at ${timeStr}`;
  }, 400);
}

function saveDraftToStorage(missionId, showToastNotification) {
  const mission = MISSIONS_DATA[missionId];
  if (!mission) return;

  const draft = {};
  (mission.submission_fields || []).forEach(f => {
    const el = document.getElementById(`field-${f.id}`);
    draft[f.id] = el ? el.value : '';
  });

  const storageKey = `worksim_draft_${missionId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      missionId,
      timestamp: Date.now(),
      draft
    }));
    if (showToastNotification) {
      showToast('Draft successfully saved to local storage.', 'success');
    }
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

function loadDraftFromStorage(missionId) {
  const mission = MISSIONS_DATA[missionId];
  if (!mission) return;

  const storageKey = `worksim_draft_${missionId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (parsed && parsed.draft) {
      let populatedAny = false;
      Object.keys(parsed.draft).forEach(fieldId => {
        const val = parsed.draft[fieldId];
        const el = document.getElementById(`field-${fieldId}`);
        const countEl = document.getElementById(`count-${fieldId}`);
        if (el && val) {
          el.value = val;
          populatedAny = true;
          if (countEl) countEl.textContent = `${val.length} characters`;
        }
      });

      if (populatedAny) {
        const timeStr = new Date(parsed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formStatus = document.getElementById('form-autosave-status');
        if (formStatus) formStatus.querySelector('.text').textContent = `Restored draft from ${timeStr}`;
      }
    }
  } catch (err) {
    console.warn('LocalStorage load error:', err);
  }
}

function clearDraft(missionId) {
  const mission = MISSIONS_DATA[missionId];
  if (!mission) return;

  (mission.submission_fields || []).forEach(f => {
    const el = document.getElementById(`field-${f.id}`);
    const countEl = document.getElementById(`count-${f.id}`);
    if (el) el.value = '';
    if (countEl) countEl.textContent = '0 characters';
  });

  try {
    localStorage.removeItem(`worksim_draft_${missionId}`);
  } catch (e) {}

  const formStatus = document.getElementById('form-autosave-status');
  if (formStatus) formStatus.querySelector('.text').textContent = 'Draft cleared';
  showToast('Submission form cleared.', 'info');
}

function prefillExemplarResponse(missionId) {
  const mission = MISSIONS_DATA[missionId];
  if (!mission || !mission.exemplar) return;

  Object.keys(mission.exemplar).forEach(fieldId => {
    const val = mission.exemplar[fieldId];
    const el = document.getElementById(`field-${fieldId}`);
    const countEl = document.getElementById(`count-${fieldId}`);
    const errEl = document.getElementById(`error-${fieldId}`);
    if (el) {
      el.value = val;
      el.classList.remove('error');
      if (countEl) countEl.textContent = `${val.length} characters`;
    }
    if (errEl) {
      errEl.style.display = 'none';
    }
  });

  saveDraftToStorage(missionId, false);
  showToast('Prefilled exemplar responses to test rubric grading.', 'success');
}

// ============================================================================
// 7. 5-QUESTION READINESS CHECK MODAL
// ============================================================================

function bindQuizModal() {
  const modal = document.getElementById('quiz-modal');
  const closeBtn = document.getElementById('quiz-close-btn');
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const retakeBtn = document.getElementById('quiz-retake-btn');
  const proceedBtn = document.getElementById('quiz-proceed-mission-btn');

  closeBtn.addEventListener('click', closeQuizModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeQuizModal();
  });

  prevBtn.addEventListener('click', () => {
    if (state.quiz.currentIndex > 0) {
      state.quiz.currentIndex--;
      renderQuizQuestion();
    }
  });

  nextBtn.addEventListener('click', () => {
    const track = TRACKS_DATA[state.quiz.trackId];
    const questions = track.readiness_quiz || [];

    if (state.quiz.currentIndex < questions.length - 1) {
      state.quiz.currentIndex++;
      renderQuizQuestion();
    } else {
      finishQuiz();
    }
  });

  retakeBtn.addEventListener('click', () => {
    openReadinessQuiz(state.quiz.trackId);
  });

  proceedBtn.addEventListener('click', () => {
    closeQuizModal();
    selectTrack(state.quiz.trackId);
    switchView('workspace');
  });

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display !== 'none') {
      closeQuizModal();
    }
  });
}

function openReadinessQuiz(trackId) {
  const track = TRACKS_DATA[trackId] || TRACKS_DATA['cloud-engineer'];
  state.quiz.trackId = track.id;
  state.quiz.currentIndex = 0;
  state.quiz.answers = {};
  state.quiz.score = 0;
  state.quiz.isComplete = false;

  const modal = document.getElementById('quiz-modal');
  const roleBadge = document.getElementById('quiz-role-badge');
  const modalTitle = document.getElementById('quiz-modal-title');

  if (roleBadge) roleBadge.textContent = `${track.title} Primer`;
  if (modalTitle) modalTitle.textContent = `${track.title} - 5-Question Readiness Check`;

  document.getElementById('quiz-question-container').style.display = 'block';
  document.getElementById('quiz-completed-container').style.display = 'none';
  document.getElementById('quiz-retake-btn').style.display = 'none';
  document.getElementById('quiz-proceed-mission-btn').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'inline-flex';

  renderQuizQuestion();
  modal.style.display = 'flex';
}

function closeQuizModal() {
  const modal = document.getElementById('quiz-modal');
  if (modal) modal.style.display = 'none';
}

function renderQuizQuestion() {
  const track = TRACKS_DATA[state.quiz.trackId];
  const questions = track.readiness_quiz || [];
  const qIndex = state.quiz.currentIndex;
  const q = questions[qIndex];

  if (!q) return;

  // Update progress bar
  const progressPercent = Math.round(((qIndex + 1) / questions.length) * 100);
  const progressBar = document.getElementById('quiz-progress-bar');
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  // Question metadata
  document.getElementById('quiz-question-num').textContent = `Question ${qIndex + 1} of ${questions.length}`;
  document.getElementById('quiz-question-prompt').textContent = q.question;
  document.getElementById('quiz-score-indicator').textContent = `Score: ${state.quiz.score} / ${questions.length}`;

  // Prev / Next button state
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (prevBtn) {
    prevBtn.style.display = qIndex > 0 ? 'inline-flex' : 'none';
  }

  const isLastQuestion = qIndex === questions.length - 1;
  if (nextBtn) {
    nextBtn.textContent = isLastQuestion ? 'Complete Quiz & View Score' : 'Next Question';
  }

  // Render options list
  const optionsList = document.getElementById('quiz-options-list');
  optionsList.innerHTML = '';

  const explanationBox = document.getElementById('quiz-explanation-box');
  const alreadyAnsweredKey = state.quiz.answers[qIndex];

  q.options.forEach(optText => {
    const optLetter = optText.trim().charAt(0); // 'A', 'B', 'C', 'D'
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.setAttribute('data-option-letter', optLetter);
    btn.textContent = optText;

    if (alreadyAnsweredKey) {
      btn.disabled = true;
      if (optLetter === q.correct_answer) {
        btn.classList.add('correct-revealed');
      }
      if (optLetter === alreadyAnsweredKey && optLetter !== q.correct_answer) {
        btn.classList.add('selected-incorrect');
      }
    } else {
      btn.addEventListener('click', () => {
        handleAnswerSelected(qIndex, optLetter, q);
      });
    }

    optionsList.appendChild(btn);
  });

  // Render explanation if already answered
  if (alreadyAnsweredKey) {
    showExplanation(alreadyAnsweredKey === q.correct_answer, q.explanation, q.correct_answer);
  } else {
    explanationBox.style.display = 'none';
  }
}

function handleAnswerSelected(qIndex, selectedLetter, questionObj) {
  state.quiz.answers[qIndex] = selectedLetter;
  const isCorrect = selectedLetter === questionObj.correct_answer;

  if (isCorrect) {
    state.quiz.score++;
  }

  const track = TRACKS_DATA[state.quiz.trackId];
  document.getElementById('quiz-score-indicator').textContent = `Score: ${state.quiz.score} / ${track.readiness_quiz.length}`;

  // Disable all buttons and highlight
  const optionsList = document.getElementById('quiz-options-list');
  optionsList.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.disabled = true;
    const letter = btn.getAttribute('data-option-letter');

    if (letter === questionObj.correct_answer) {
      btn.classList.add('correct-revealed');
    }
    if (letter === selectedLetter && !isCorrect) {
      btn.classList.add('selected-incorrect');
    }
  });

  // Show immediate explanation
  showExplanation(isCorrect, questionObj.explanation, questionObj.correct_answer);
}

function showExplanation(isCorrect, explanationText, correctLetter) {
  const box = document.getElementById('quiz-explanation-box');
  const statusEl = document.getElementById('quiz-feedback-status');
  const textEl = document.getElementById('quiz-feedback-explanation');

  box.className = `quiz-explanation-box ${isCorrect ? 'correct' : 'incorrect'}`;
  box.style.display = 'block';

  if (isCorrect) {
    statusEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Correct!
    `;
  } else {
    statusEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      Incorrect. The correct answer is Option ${correctLetter}.
    `;
  }

  textEl.textContent = explanationText;
}

function finishQuiz() {
  state.quiz.isComplete = true;

  document.getElementById('quiz-question-container').style.display = 'none';
  document.getElementById('quiz-prev-btn').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'none';

  const completedContainer = document.getElementById('quiz-completed-container');
  completedContainer.style.display = 'block';

  document.getElementById('quiz-retake-btn').style.display = 'inline-flex';
  document.getElementById('quiz-proceed-mission-btn').style.display = 'inline-flex';

  const track = TRACKS_DATA[state.quiz.trackId];
  const total = track.readiness_quiz.length;
  const score = state.quiz.score;
  const percent = Math.round((score / total) * 100);

  document.getElementById('completed-score-text').textContent = `You scored ${score} out of ${total} (${percent}%).`;

  const badgeEl = document.getElementById('completed-badge');
  const titleEl = document.getElementById('completed-title');
  const iconEl = document.getElementById('completed-icon');

  if (score === 5) {
    iconEl.textContent = '🏆';
    titleEl.textContent = 'Outstanding Readiness!';
    badgeEl.textContent = 'Fully Prepared for Mission Incidents';
    badgeEl.style.backgroundColor = 'var(--emerald-100)';
    badgeEl.style.color = 'var(--emerald-text)';
  } else if (score >= 3) {
    iconEl.textContent = '🎯';
    titleEl.textContent = 'Solid Foundation!';
    badgeEl.textContent = 'Ready with Minor Review';
    badgeEl.style.backgroundColor = 'var(--indigo-100)';
    badgeEl.style.color = 'var(--indigo-text)';
  } else {
    iconEl.textContent = '📚';
    titleEl.textContent = 'Keep Reviewing!';
    badgeEl.textContent = 'Recommended to Review Glossary';
    badgeEl.style.backgroundColor = 'var(--amber-100)';
    badgeEl.style.color = 'var(--amber-text)';
  }

  // Recap
  const recapContainer = document.getElementById('completed-recap-list');
  recapContainer.innerHTML = '<h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Question-by-Question Review:</h4>';

  track.readiness_quiz.forEach((q, idx) => {
    const userAnswer = state.quiz.answers[idx];
    const isCorrect = userAnswer === q.correct_answer;
    const item = document.createElement('div');
    item.className = 'recap-item';
    item.innerHTML = `
      <div class="recap-question">Q${idx + 1}: ${escapeHtml(q.question)}</div>
      <div>
        <span class="recap-status ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ Correct' : `✗ Missed (You picked ${userAnswer || 'None'}, Correct: ${q.correct_answer})`}
        </span>
        <span style="color: var(--text-secondary); margin-left: 0.5rem;">- ${escapeHtml(q.explanation)}</span>
      </div>
    `;
    recapContainer.appendChild(item);
  });
}

// ============================================================================
// 8. RUBRIC EVALUATION ENGINE & MODAL
// ============================================================================

function bindRubricModal() {
  const modal = document.getElementById('rubric-modal');
  const closeBtn = document.getElementById('rubric-close-btn');
  const doneBtn = document.getElementById('rubric-done-btn');
  const reviseBtn = document.getElementById('rubric-revise-btn');
  const exportBtn = document.getElementById('rubric-export-btn');

  closeBtn.addEventListener('click', closeRubricModal);
  doneBtn.addEventListener('click', closeRubricModal);
  reviseBtn.addEventListener('click', () => {
    closeRubricModal();
    const firstTextarea = document.querySelector('.field-textarea');
    if (firstTextarea) firstTextarea.focus();
  });

  exportBtn.addEventListener('click', exportRubricMarkdown);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeRubricModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display !== 'none') {
      closeRubricModal();
    }
  });
}

function closeRubricModal() {
  const modal = document.getElementById('rubric-modal');
  if (modal) modal.style.display = 'none';
}

function handleSubmitRubric() {
  const mission = MISSIONS_DATA[state.activeMissionId];
  if (!mission) return;

  // Gather values and check validation
  const answers = {};
  let hasMissing = false;

  (mission.submission_fields || []).forEach(f => {
    const textarea = document.getElementById(`field-${f.id}`);
    const val = textarea ? textarea.value.trim() : '';
    answers[f.id] = val;

    if (!val) {
      hasMissing = true;
      if (textarea) textarea.classList.add('error');
      const err = document.getElementById(`error-${f.id}`);
      if (err) err.style.display = 'block';
    }
  });

  if (hasMissing) {
    showToast('Please fill out all 5 submission fields before rubric evaluation.', 'warning');
    return;
  }

  showToast('Evaluating submission against rubric...', 'info');

  // Attempt backend evaluation and persistent storage in SQLite
  fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mission_id: mission.id, answers: answers })
  })
  .then(res => {
    if (!res.ok) throw new Error('Backend HTTP ' + res.status);
    return res.json();
  })
  .then(backendResult => {
    const evalResult = {
      totalScore: backendResult.overall_score || backendResult.score,
      statusPill: backendResult.approval_status === 'approved' ? 'Meets Production Standards' : (backendResult.approval_status === 'exemplary' ? 'Exceeds Expectations' : 'Needs Revision'),
      heroTitle: backendResult.approval_message || 'Rubric Evaluation Complete',
      heroSummary: backendResult.evaluation_note || 'Submission evaluated and persisted to database.',
      dimensions: backendResult.dimensions,
      submittedAt: backendResult.created_at || new Date().toISOString(),
      backendSubmissionId: backendResult.submission_id
    };
    displayRubricResults(mission, evalResult);
    showToast('Evaluated & Persisted to Praxis Database', 'success');
  })
  .catch(err => {
    console.warn('Backend unavailable or network error; using client evaluation:', err);
    const evalResult = evaluateSubmission(mission, answers);

    // Persist to offline submissions ledger for Admin Review Portal
    const offlineSub = {
      submission_id: 'sub_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      mission_id: mission.id,
      answers: answers,
      score: evalResult.totalScore,
      overall_score: evalResult.totalScore,
      approval_status: evalResult.totalScore >= 75 ? 'approved' : 'needs_revision',
      reviewer_status: null,
      created_at: new Date().toISOString(),
      dimensions: evalResult.dimensions
    };
    try {
      const existingSubs = JSON.parse(localStorage.getItem('praxis_offline_submissions') || '[]');
      existingSubs.unshift(offlineSub);
      localStorage.setItem('praxis_offline_submissions', JSON.stringify(existingSubs));
    } catch (e) {}

    displayRubricResults(mission, evalResult);
    showToast('Evaluated & Persisted to Local Simulation Ledger', 'success');
  });
}

function evaluateSubmission(mission, answers) {
  // Client-side non-binary heuristic evaluator assessing Evidence Grounding,
  // Engineering Reasoning, Operational Safety, and Validation Rigor.
  const joinedText = Object.values(answers).join(' ').toLowerCase();

  const dimensions = mission.rubric.dimensions.map(dim => {
    let score = 0;
    let feedback = '';

    if (dim.id === 'evidence_accuracy' || dim.id.includes('evidence') || dim.id.includes('idempotency')) {
      // Dimension 1: Evidence Grounding & Timestamps
      let hits = 0;
      if (joinedText.includes('14:10') || joinedText.includes('14:15') || joinedText.includes('14:14') || joinedText.includes('14:05')) hits++;
      if (joinedText.includes('v2.4.0') || joinedText.includes('9fa812c') || joinedText.includes('refactor') || joinedText.includes('ios')) hits++;
      if (joinedText.includes('hikaripool') || joinedText.includes('connection') || joinedText.includes('pool') || joinedText.includes('unwrapped')) hits++;
      if (joinedText.includes('504') || joinedText.includes('gateway') || joinedText.includes('timeout') || joinedText.includes('double')) hits++;

      if (hits >= 4) {
        score = 25;
        feedback = 'Exceptional evidence accuracy: Cited exact timestamps (14:10-14:15 UTC), release commit 9fa812c, HikariPool connection pool saturation, and 504 Gateway Timeouts.';
      } else if (hits >= 2) {
        score = 20;
        feedback = 'Good evidence grounding: Referenced key deployment events and timeout symptoms. For full marks, explicitly cite exact log lines and commit hashes.';
      } else {
        score = 14;
        feedback = 'Developing: Lacks direct citation of the provided HikariPool log stack traces and deployment timestamps.';
      }

    } else if (dim.id === 'plausibility_and_distinction' || dim.id.includes('plausibility') || dim.id.includes('architecture')) {
      // Dimension 2: Root cause & Fact vs Assumption
      let hasFactKeyword = joinedText.includes('fact') || joinedText.includes('proven') || joinedText.includes('verified');
      let hasAssumptionKeyword = joinedText.includes('assumption') || joinedText.includes('hypothes') || joinedText.includes('unverified');
      let hasSyncAudit = joinedText.includes('sync') || joinedText.includes('audit') || joinedText.includes('persistsyncauditlog') || joinedText.includes('race');

      if (hasSyncAudit && hasFactKeyword && hasAssumptionKeyword) {
        score = 25;
        feedback = 'Mastery of root cause reasoning: Correctly identified synchronous audit logging blocking payment threads while rigorously distinguishing verified facts from unconfirmed assumptions.';
      } else if (hasSyncAudit) {
        score = 21;
        feedback = 'Strong technical diagnosis: Correctly isolated the synchronous audit logging bottleneck, but could distinguish assumptions (e.g. database CPU load) more explicitly.';
      } else {
        score = 15;
        feedback = 'Moderate analysis: Identified general latency issues but did not pinpoint AuditLogger.persistSyncAuditLog() as the critical blocking call.';
      }

    } else if (dim.id === 'safety_and_constraints' || dim.id.includes('safety') || dim.id.includes('test')) {
      // Dimension 3: Operational Safety & Runbook Adherence
      let hasRollback = joinedText.includes('rollback') || joinedText.includes('helm rollback') || joinedText.includes('v2.3.9');
      let hasFeatureFlag = joinedText.includes('enable_sync_audit_log') || joinedText.includes('flag') || joinedText.includes('consul');
      let hasAvoidedHotfix = !joinedText.includes('hotfix in prod') && !joinedText.includes('restart primary');

      if ((hasRollback || hasFeatureFlag) && hasAvoidedHotfix) {
        score = 25;
        feedback = 'Outstanding operational safety: Followed Runbook SOP by prescribing an immediate safe rollback (v2.3.9) or Consul feature flag toggle rather than risky production hotfixing.';
      } else if (hasRollback || hasFeatureFlag) {
        score = 20;
        feedback = 'Safe remediation planned: Rollback or feature flag recommended. Ensure you cite the exact Helm command from the service runbook.';
      } else {
        score = 13;
        feedback = 'Risk warning: Remediation did not utilize the runbook rollback SOP. Avoid ad-hoc changes during active critical outages.';
      }

    } else {
      // Dimension 4: Verification & Preventive Action
      let hasMetrics = joinedText.includes('p99') || joinedText.includes('latency') || joinedText.includes('5xx') || joinedText.includes('error rate');
      let hasObservationWindow = joinedText.includes('min') || joinedText.includes('hour') || joinedText.includes('baseline');
      let hasAsyncQueue = joinedText.includes('async') || joinedText.includes('kafka') || joinedText.includes('queue') || joinedText.includes('sqs') || joinedText.includes('worker');

      if (hasMetrics && hasAsyncQueue) {
        score = 24;
        feedback = 'Comprehensive verification & architecture: Outlined quantitative criteria (p99 latency < baseline, 0% 5xx) and proposed decoupling audit logging via asynchronous queues (Kafka/SQS).';
      } else if (hasMetrics || hasAsyncQueue) {
        score = 19;
        feedback = 'Solid follow-up proposal: Good identification of either verification thresholds or asynchronous queuing. Incorporate both for production-grade SRE sign-off.';
      } else {
        score = 14;
        feedback = 'Incomplete verification: Does not specify quantitative metrics thresholds required before declaring the incident resolved.';
      }
    }

    return {
      id: dim.id,
      name: dim.name,
      weight: dim.weight || 25,
      score: score,
      criteria: dim.criteria,
      feedback: feedback
    };
  });

  const totalScore = dimensions.reduce((acc, d) => acc + d.score, 0);

  let statusPill = 'Meets Production Standards';
  let heroTitle = 'Sound Incident Investigation';
  let heroSummary = 'Your submission demonstrates effective evidence triage and adherence to safe operational procedures.';

  if (totalScore >= 90) {
    statusPill = 'Exceeds Expectations (Senior Quality)';
    heroTitle = 'Exemplary Incident Triage & Engineering Rigor';
    heroSummary = 'Your analysis accurately anchored on concrete telemetry, maintained strict discipline separating verified facts from assumptions, and applied textbook runbook mitigation.';
  } else if (totalScore < 75) {
    statusPill = 'Revision Recommended';
    heroTitle = 'Promising Analysis with Gaps in Evidence Grounding';
    heroSummary = 'Consider reviewing the service runbook and application log traces to ground your hypothesis in specific error messages and verified facts.';
  }

  return {
    totalScore,
    statusPill,
    heroTitle,
    heroSummary,
    dimensions,
    answers
  };
}

function displayRubricResults(mission, evalResult) {
  const modal = document.getElementById('rubric-modal');
  document.getElementById('rubric-total-score').textContent = evalResult.totalScore;
  document.getElementById('rubric-status-pill').textContent = evalResult.statusPill;
  document.getElementById('rubric-hero-title').textContent = evalResult.heroTitle;
  document.getElementById('rubric-hero-summary').textContent = evalResult.heroSummary;

  const container = document.getElementById('rubric-dimensions-container');
  container.innerHTML = '';

  evalResult.dimensions.forEach(dim => {
    const card = document.createElement('div');
    card.className = 'dimension-card';
    const pointsEarned = dim.score <= dim.weight ? dim.score : Math.round((dim.score / 100) * dim.weight * 10) / 10;
    const percent = dim.score <= dim.weight ? Math.round((dim.score / dim.weight) * 100) : Math.round(dim.score);
    const feedbackText = dim.feedback || (dim.strengths && dim.strengths.length ? dim.strengths.join(' ') : '') || (dim.areas_for_improvement && dim.areas_for_improvement.length ? dim.areas_for_improvement.join(' ') : '') || 'Meets core evaluation criteria.';

    card.innerHTML = `
      <div class="dimension-top">
        <span class="dimension-name">${escapeHtml(dim.name)}</span>
        <span class="dimension-score">${pointsEarned} / ${dim.weight} pts (${percent}%)</span>
      </div>
      <div class="dimension-bar-track">
        <div class="dimension-bar-fill" style="width: ${Math.min(100, Math.max(0, percent))}%;"></div>
      </div>
      <div class="dimension-criteria"><strong>Evaluation Standard:</strong> ${escapeHtml(dim.criteria)}</div>
      <div class="dimension-feedback"><strong>Coaching Note:</strong> ${escapeHtml(feedbackText)}</div>
    `;

    container.appendChild(card);
  });

  // Coaching advice
  const coachingContent = document.getElementById('rubric-coaching-content');
  coachingContent.innerHTML = `
    <p>Staff Engineer review notes for <strong>${escapeHtml(mission.title)}</strong>:</p>
    <ul>
      <li><strong>Incident Velocity:</strong> Immediate rollback or feature-flag disablement preserves the SLO error budget far faster than debugging in production.</li>
      <li><strong>RCA Quality:</strong> Root cause analyses that clearly delineate <em>Verified Telemetry</em> from <em>Plausible Hypotheses</em> build high executive trust during Sev-1 post-mortems.</li>
      <li><strong>Architectural Safeguard:</strong> Synchronous database calls in critical HTTP paths are a known reliability anti-pattern; always advocate for event-driven asynchronous processing.</li>
    </ul>
  `;

  modal.style.display = 'flex';
  state.lastEvaluation = evalResult;
}

function openRubricModal(isPreviewGuide) {
  const mission = MISSIONS_DATA[state.activeMissionId] || MISSIONS_DATA['cloud-sre-01'];

  if (isPreviewGuide || !state.lastEvaluation) {
    // Generate guide preview
    const exemplarEval = evaluateSubmission(mission, mission.exemplar || {});
    displayRubricResults(mission, exemplarEval);
  } else {
    displayRubricResults(mission, state.lastEvaluation);
  }
}

function exportRubricMarkdown() {
  if (!state.lastEvaluation) {
    showToast('No active evaluation report to export.', 'warning');
    return;
  }

  const evalRes = state.lastEvaluation;
  const mission = MISSIONS_DATA[state.activeMissionId];

  let md = `# Praxis Evaluation Report: ${mission.title}\n`;
  md += `**Date:** ${new Date().toISOString()}\n`;
  md += `**Overall Score:** ${evalRes.totalScore} / 100 (${evalRes.statusPill})\n\n`;
  md += `## Dimensional Scoring\n\n`;

  evalRes.dimensions.forEach(dim => {
    md += `### ${dim.name}: ${dim.score}/${dim.weight} pts\n`;
    md += `- **Criteria:** ${dim.criteria}\n`;
    md += `- **Feedback:** ${dim.feedback}\n\n`;
  });

  md += `## Candidate Submission Answers\n\n`;
  Object.keys(evalRes.answers).forEach(k => {
    md += `### Field: ${k}\n${evalRes.answers[k]}\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `worksim-evaluation-${state.activeMissionId}.md`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Evaluation report downloaded as Markdown.', 'success');
}

// ============================================================================
// 9. UTILITY HELPERS
// ============================================================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied: "${text}"`, 'success');
  }).catch(() => {
    showToast('Copied to clipboard', 'info');
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// ============================================================================
// 9. ROLE KNOWLEDGE HANDBOOK (PDF / GUIDE) MODAL
// ============================================================================

function bindRoleGuideModal() {
  const modal = document.getElementById('role-guide-modal');
  const closeBtn = document.getElementById('role-guide-close-btn');
  const doneBtn = document.getElementById('role-guide-done-btn');
  const printBtn = document.getElementById('role-guide-print-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeRoleGuideModal);
  if (doneBtn) doneBtn.addEventListener('click', closeRoleGuideModal);
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeRoleGuideModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
      closeRoleGuideModal();
    }
  });
}

function closeRoleGuideModal() {
  const modal = document.getElementById('role-guide-modal');
  if (modal) modal.style.display = 'none';
}

async function openRoleGuideModal(trackId) {
  trackId = trackId || state.activeTrackId || 'cloud-engineer';
  let track = TRACKS_DATA[trackId] || {};

  try {
    const res = await fetch(`/api/tracks/${trackId}`);
    if (res.ok) {
      const liveTrack = await res.json();
      track = Object.assign({}, track, liveTrack);
    }
  } catch (err) {
    console.warn('API track fetch fallback:', err);
  }

  const modal = document.getElementById('role-guide-modal');
  const badge = document.getElementById('role-guide-badge');
  const title = document.getElementById('role-guide-modal-title');
  const content = document.getElementById('role-guide-content');

  if (badge) badge.textContent = `${track.title || 'Role'} Knowledge Handbook`;
  if (title) title.textContent = `${track.title || 'Role'} - Operational Primer & Tools`;

  let html = `
    <div class="handbook-hero">
      <div class="handbook-hero-title">${escapeHtml(track.title || '')} Industry Primer</div>
      <p class="handbook-hero-desc">${escapeHtml(track.summary || '')}</p>
      <div class="handbook-tags">
        ${(track.skills_covered || []).map(s => `<span class="tag-pill">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>

    <!-- Section 1: Industry Terminology & Language -->
    <div class="handbook-section">
      <div class="handbook-section-header">
        <span class="section-icon">📖</span>
        <h3>1. Essential Industry Language & Core Terms</h3>
      </div>
      <p class="section-subtext">Terms and metrics every junior practitioner is expected to understand on day one:</p>
      <div class="glossary-grid">
        ${(track.industry_glossary || []).map(item => `
          <div class="glossary-card">
            <div class="glossary-term">${escapeHtml(item.term)}</div>
            <div class="glossary-def">${escapeHtml(item.definition)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 2: Common Industry Tooling & Production Stack -->
    <div class="handbook-section">
      <div class="handbook-section-header">
        <span class="section-icon">🛠️</span>
        <h3>2. Standard Production Tools & Ecosystem</h3>
      </div>
      <p class="section-subtext">The industry-standard software tools and frameworks used in this role:</p>
      <div class="tools-grid">
        ${(track.common_tools || []).map(tool => `
          <div class="tool-card">
            <div class="tool-top">
              <span class="tool-name">${escapeHtml(tool.name)}</span>
              <span class="tool-category">${escapeHtml(tool.category)}</span>
            </div>
            <div class="tool-desc">${escapeHtml(tool.description)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 3: Standard Workplace Workflows & Protocols -->
    <div class="handbook-section">
      <div class="handbook-section-header">
        <span class="section-icon">🔄</span>
        <h3>3. Standard Workplace Workflows & Protocols</h3>
      </div>
      <p class="section-subtext">How professional engineering teams operate and resolve tasks systematically:</p>
      <div class="workflows-list">
        ${(track.standard_workflows || []).map((wf, idx) => `
          <div class="workflow-step">
            <div class="workflow-step-badge">${idx + 1}</div>
            <div class="workflow-step-content">
              <div class="workflow-step-title">${escapeHtml(wf.phase)}</div>
              <div class="workflow-step-summary">${escapeHtml(wf.summary)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 4: 5-Question Readiness Check Link -->
    <div class="handbook-action-box card">
      <div class="action-box-left">
        <h4>Ready to test your comprehension?</h4>
        <p>Take the 5-question readiness check to reinforce these concepts before beginning practical missions.</p>
      </div>
      <button class="btn btn-primary" onclick="closeRoleGuideModal(); openReadinessQuiz('${track.id}');">
        Take 5-Question Check
      </button>
    </div>
  `;

  if (content) content.innerHTML = html;
  if (modal) modal.style.display = 'flex';
}

// ============================================================================
// 10. MISSION CATALOG & LEARNING SEQUENCE
// ============================================================================

async function loadMissionsCatalog() {
  let loaded = false;
  try {
    const res = await fetch('/api/missions');
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && res.ok) {
      const missions = await res.json();
      state.allMissions = missions;
      missions.forEach(m => {
        MISSIONS_DATA[m.id] = Object.assign({}, MISSIONS_DATA[m.id] || {}, m);
      });
      const pill = document.getElementById('catalog-count-pill');
      if (pill) pill.textContent = `${missions.length} Labs`;
      loaded = true;
    }
  } catch (err) {}

  if (!loaded) {
    if (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.MISSIONS) {
      state.allMissions = window.PRAXIS_OFFLINE_DATA.MISSIONS;
      state.allMissions.forEach(m => {
        MISSIONS_DATA[m.id] = Object.assign({}, MISSIONS_DATA[m.id] || {}, m);
      });
      const pill = document.getElementById('catalog-count-pill');
      if (pill) pill.textContent = `${state.allMissions.length} Labs`;
    } else {
      state.allMissions = Object.values(MISSIONS_DATA);
    }
  }
}

function bindCatalogControls() {
  const trackPills = document.querySelectorAll('#catalog-track-pills .pill-btn');
  trackPills.forEach(btn => {
    btn.addEventListener('click', (e) => {
      trackPills.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.catalogFilter.track = e.currentTarget.getAttribute('data-track');
      renderCatalogView();
    });
  });

  const seqPills = document.querySelectorAll('#catalog-sequence-pills .pill-btn');
  seqPills.forEach(btn => {
    btn.addEventListener('click', (e) => {
      seqPills.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.catalogFilter.seq = e.currentTarget.getAttribute('data-seq');
      renderCatalogView();
    });
  });

  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.catalogFilter.search = e.target.value.toLowerCase().trim();
      renderCatalogView();
    });
  }
}

function renderCatalogView() {
  const grid = document.getElementById('catalog-missions-grid');
  if (!grid) return;

  const missions = state.allMissions.length ? state.allMissions : Object.values(MISSIONS_DATA);
  const filterTrack = state.catalogFilter.track;
  const filterSeq = state.catalogFilter.seq;
  const filterSearch = state.catalogFilter.search;

  const filtered = missions.filter(m => {
    if (filterTrack !== 'all' && m.track_id !== filterTrack) return false;
    if (filterSeq !== 'all' && (m.type || 'guided') !== filterSeq) return false;
    if (filterSearch) {
      const haystack = `${m.title} ${m.problem_brief} ${m.id} ${m.difficulty || ''}`.toLowerCase();
      if (!haystack.includes(filterSearch)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <h3>No missions found matching filters</h3>
        <p class="text-muted">Try resetting search or selecting "All Tracks" / "All Types".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(m => {
    const card = document.createElement('div');
    card.className = 'catalog-mission-card';
    const isGuided = (m.type || 'guided') === 'guided';
    const trackObj = TRACKS_DATA[m.track_id] || { title: 'Engineering' };

    card.innerHTML = `
      <div>
        <div class="catalog-card-header">
          <span class="badge ${isGuided ? 'badge-indigo' : 'badge-emerald'}">
            ${isGuided ? 'Guided Mission' : 'Independent Simulation'}
          </span>
          <span class="text-muted" style="font-size: 0.8rem; font-weight: 600;">⏱️ ${m.estimated_time_mins || 30} mins</span>
        </div>
        <h3 class="catalog-card-title">${escapeHtml(m.title)}</h3>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--indigo-600); margin-bottom: 0.5rem;">
          Track: ${escapeHtml(trackObj.title)} | ${escapeHtml(m.difficulty || 'Associate')}
        </div>
        <p class="catalog-card-brief">${escapeHtml((m.problem_brief || '').substring(0, 150))}...</p>
      </div>
      <div class="catalog-card-footer">
        <span class="text-muted" style="font-size: 0.75rem;">
          ${isGuided ? 'Includes Checkpoints & Hints' : 'Production Raw Evidence'}
        </span>
        <button class="btn btn-primary btn-sm btn-launch-mission" data-mission-id="${m.id}">
          Launch Mission
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.btn-launch-mission').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mId = e.currentTarget.getAttribute('data-mission-id');
      renderMissionWorkspace(mId);
      switchView('workspace');
    });
  });
}

// ============================================================================
// 11. STAFF REVIEWER & ADMIN PORTAL
// ============================================================================

function bindAdminControls() {
  const refreshBtn = document.getElementById('admin-refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', renderAdminView);
}

async function renderAdminView() {
  const tbody = document.getElementById('admin-submissions-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">Loading submissions from SQLite database...</td></tr>`;

  let loadedFromBackend = false;
  try {
    const res = await fetch('/api/submissions');
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && res.ok) {
      state.submissionsLedger = await res.json();
      loadedFromBackend = true;
    }
  } catch (err) {}

  if (!loadedFromBackend) {
    try {
      state.submissionsLedger = JSON.parse(localStorage.getItem('praxis_offline_submissions') || '[]');
    } catch (e) {
      state.submissionsLedger = [];
    }
  }

  const subs = state.submissionsLedger || [];

  // Update summary metrics
  const totalEl = document.getElementById('admin-total-subs');
  const approvedRateEl = document.getElementById('admin-approved-rate');
  const pendingEl = document.getElementById('admin-pending-count');
  const avgScoreEl = document.getElementById('admin-avg-score');

  if (totalEl) totalEl.textContent = subs.length;

  if (subs.length > 0) {
    const approvedCount = subs.filter(s => (s.reviewer_status || s.approval_status) === 'approved').length;
    const avgScore = Math.round(subs.reduce((acc, s) => acc + (s.score || s.overall_score || 0), 0) / subs.length);
    const pendingCount = subs.filter(s => !s.reviewer_status).length;

    if (approvedRateEl) approvedRateEl.textContent = `${Math.round((approvedCount / subs.length) * 100)}%`;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (avgScoreEl) avgScoreEl.textContent = `${avgScore} / 100`;
  } else {
    if (approvedRateEl) approvedRateEl.textContent = '0%';
    if (pendingEl) pendingEl.textContent = '0';
    if (avgScoreEl) avgScoreEl.textContent = '--';
  }

  if (subs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          No candidate submissions in database yet. Submit any mission to see live rubric and reviewer logs.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = '';
  subs.forEach(s => {
    const tr = document.createElement('tr');
    const mission = MISSIONS_DATA[s.mission_id] || { title: s.mission_id, track_id: 'cloud-engineer' };
    const track = TRACKS_DATA[mission.track_id] || { title: 'Engineering' };
    const scoreVal = s.score || s.overall_score || 0;
    const revStatus = s.reviewer_status || (s.approval_status === 'approved' ? 'Staff Approved' : 'Pending Review');
    const timeFormatted = (s.created_at || '').replace('T', ' ').substring(0, 19);

    tr.innerHTML = `
      <td style="font-family: monospace; font-size: 0.8rem;">${escapeHtml(timeFormatted)}</td>
      <td><strong>${escapeHtml(mission.title || s.mission_id)}</strong></td>
      <td><span class="badge badge-indigo">${escapeHtml(track.title)}</span></td>
      <td><strong>${scoreVal} / 100</strong></td>
      <td>
        <span class="badge ${scoreVal >= 80 ? 'badge-emerald' : 'badge-amber'}">
          ${escapeHtml(s.approval_status || 'Evaluated')}
        </span>
      </td>
      <td>
        <span class="badge ${s.reviewer_status === 'approved' ? 'badge-emerald' : (s.reviewer_status === 'needs_revision' ? 'badge-amber' : 'badge-indigo')}">
          ${escapeHtml(revStatus)}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm btn-inspect-sub" data-sub-id="${s.submission_id}">
          Inspect & Review
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-inspect-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subId = e.currentTarget.getAttribute('data-sub-id');
      openReviewerModal(subId);
    });
  });
}

function bindReviewerModal() {
  const modal = document.getElementById('reviewer-modal');
  const closeBtn = document.getElementById('reviewer-modal-close-btn');
  const approveBtn = document.getElementById('reviewer-action-approve');
  const reviseBtn = document.getElementById('reviewer-action-revise');

  if (closeBtn) closeBtn.addEventListener('click', closeReviewerModal);
  if (approveBtn) approveBtn.addEventListener('click', () => submitReviewerDecision('approved'));
  if (reviseBtn) reviseBtn.addEventListener('click', () => submitReviewerDecision('needs_revision'));

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeReviewerModal();
    });
  }
}

function closeReviewerModal() {
  const modal = document.getElementById('reviewer-modal');
  if (modal) modal.style.display = 'none';
}

function openReviewerModal(submissionId) {
  const sub = (state.submissionsLedger || []).find(s => s.submission_id === submissionId);
  if (!sub) return;

  state.selectedReviewSubmission = sub;
  const modal = document.getElementById('reviewer-modal');
  const title = document.getElementById('reviewer-modal-title');
  const content = document.getElementById('reviewer-modal-content');
  const ts = document.getElementById('reviewer-modal-ts');

  const mission = MISSIONS_DATA[sub.mission_id] || { title: sub.mission_id };
  if (title) title.textContent = `Candidate Review: ${mission.title}`;
  if (ts) ts.textContent = `Submission ID: ${sub.submission_id} | Created: ${sub.created_at}`;

  let answersHtml = Object.entries(sub.answers || {}).map(([key, val]) => `
    <div class="reviewer-answer-item">
      <div class="reviewer-answer-label">${escapeHtml(key.replace(/_/g, ' '))}</div>
      <div class="reviewer-answer-text">${escapeHtml(String(val))}</div>
    </div>
  `).join('');

  let dimsHtml = (sub.dimensions || []).map(d => `
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.35rem 0; border-bottom: 1px solid var(--border-subtle);">
      <span>${escapeHtml(d.name)}</span>
      <strong>${d.score} / ${d.weight} pts</strong>
    </div>
  `).join('');

  let html = `
    <div style="display: flex; gap: 1rem; align-items: center; background: #f8fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem;">
      <div style="font-size: 1.5rem; font-weight: 800; color: var(--indigo-600);">${sub.score || sub.overall_score || 0} / 100</div>
      <div>
        <div style="font-weight: 700; font-size: 0.95rem;">Automated Rubric Verdict: ${escapeHtml(sub.approval_message || sub.approval_status)}</div>
        <div style="font-size: 0.825rem; color: var(--text-muted);">${escapeHtml(sub.evaluation_note || 'Deterministic rubric scoring.')}</div>
      </div>
    </div>

    <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Dimensional Rubric Scores:</h4>
    <div style="margin-bottom: 1.25rem; background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 0.75rem 1rem;">
      ${dimsHtml}
    </div>

    <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem;">Candidate's Structured Incident Report:</h4>
    <div>${answersHtml}</div>

    <div style="margin-top: 1.25rem;">
      <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 0.35rem;">
        Staff Reviewer Coaching Comments & Calibration:
      </label>
      <textarea id="reviewer-notes-input" class="field-textarea" style="height: 80px;" placeholder="Add human reviewer notes for the candidate...">${escapeHtml(sub.reviewer_notes || '')}</textarea>
    </div>
  `;

  if (content) content.innerHTML = html;
  if (modal) modal.style.display = 'flex';
}

async function submitReviewerDecision(status) {
  const sub = state.selectedReviewSubmission;
  if (!sub) return;

  const notesEl = document.getElementById('reviewer-notes-input');
  const notes = notesEl ? notesEl.value.trim() : '';

  try {
    const res = await fetch(`/api/submissions/${sub.submission_id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status, notes: notes })
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && res.ok) {
      showToast(`Review saved: marked as ${status.toUpperCase()}`, 'success');
      closeReviewerModal();
      renderAdminView();
      return;
    }
  } catch (err) {
    console.warn('Reviewer patch fallback:', err);
  }

  // Local update fallback
  sub.reviewer_status = status;
  sub.reviewer_notes = notes;
  try {
    const offlineSubs = JSON.parse(localStorage.getItem('praxis_offline_submissions') || '[]');
    const match = offlineSubs.find(s => s.submission_id === sub.submission_id);
    if (match) {
      match.reviewer_status = status;
      match.reviewer_notes = notes;
      localStorage.setItem('praxis_offline_submissions', JSON.stringify(offlineSubs));
    }
  } catch (e) {}

  showToast(`Updated reviewer status locally to ${status.toUpperCase()}`, 'info');
  closeReviewerModal();
  renderAdminView();
}

// ============================================================================
// 12. LEARNER PROGRESS & COMPETENCY TRANSCRIPT
// ============================================================================

function bindProfileControls() {
  const exportBtn = document.getElementById('btn-export-transcript');
  if (exportBtn) exportBtn.addEventListener('click', exportLearnerTranscript);

  const resetBtn = document.getElementById('btn-reset-progress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Clear simulation problem and mission progress? (Your login and locked track will be preserved)')) {
        localStorage.removeItem('praxis_offline_submissions');
        localStorage.removeItem('praxis_offline_problem_progress');
        localStorage.removeItem('praxis_drafts');
        showToast('Simulation progress reset.', 'info');
        renderProfileView();
      }
    });
  }
}

function renderProfileView() {
  let completedMissions = state.submissionsLedger || [];
  if (completedMissions.length === 0) {
    try {
      completedMissions = JSON.parse(localStorage.getItem('praxis_offline_submissions') || '[]');
    } catch (e) {
      completedMissions = [];
    }
  }

  // Solved problems count
  let solvedProblemsCount = 0;
  try {
    const probProgress = JSON.parse(localStorage.getItem('praxis_offline_problem_progress') || '{}');
    solvedProblemsCount = Object.values(probProgress).filter(p => p.status === 'completed').length;
  } catch (e) {}

  const totalActivities = completedMissions.length + solvedProblemsCount;
  const compCountEl = document.getElementById('pstat-completed');
  const avgScoreEl = document.getElementById('pstat-avg-score');
  const readinessEl = document.getElementById('pstat-readiness');

  if (compCountEl) compCountEl.textContent = totalActivities;

  if (totalActivities > 0) {
    const missionScoreSum = completedMissions.reduce((acc, s) => acc + (s.score || s.overall_score || 0), 0);
    const probScoreSum = solvedProblemsCount * 100;
    const avg = Math.round((missionScoreSum + probScoreSum) / totalActivities);
    if (avgScoreEl) avgScoreEl.textContent = `${avg} / 100`;
    if (readinessEl) readinessEl.textContent = avg >= 80 ? 'Production Ready' : 'In Calibration';
  } else {
    if (avgScoreEl) avgScoreEl.textContent = '--';
    if (readinessEl) readinessEl.textContent = 'In Training';
  }

  // Official Certificate of Completion Banner
  const certBanner = document.getElementById('profile-certificate-banner');
  if (certBanner) {
    const learnerName = state.user ? (state.user.full_name || state.user.username) : 'Learner Practitioner';
    const roleKey = state.user ? (state.user.role || 'software-developer') : 'software-developer';
    const roleTitle = getRoleDisplayName(roleKey);
    const certId = `PX-CERT-${(state.user && state.user.user_id ? state.user.user_id : 'DEMO').substring(0, 8).toUpperCase()}`;

    certBanner.innerHTML = `
      <div class="cert-banner-card">
        <div class="cert-banner-left">
          <div class="cert-seal-icon">🏆</div>
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em;">Verified Credential</div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #f8fafc; margin: 0.15rem 0;">Praxis Certificate of Workplace Readiness</h3>
            <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0;">Recipient: <strong>${escapeHtml(learnerName)}</strong> • Track: <span style="color: #6ee7b7;">${escapeHtml(roleTitle)}</span> (${certId})</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap;">
          <a href="/api/certificate/download?learner_name=${encodeURIComponent(learnerName)}&role=${encodeURIComponent(roleKey)}" 
             id="btn-download-cert-pdf" 
             download="Praxis_Certificate_${learnerName.replace(/\s+/g, '_')}.pdf" 
             class="btn btn-primary" 
             style="background: #d97706; border-color: #b45309; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download PDF Certificate
          </a>
        </div>
      </div>
    `;
  }

  // Competencies list
  const compList = document.getElementById('profile-competencies-list');
  if (compList) {
    const coreCompetencies = [
      'Sev-1 Incident Triage & War Room Escalation',
      'Telemetry & APM Analysis (p99/p95 latency percentiles)',
      'Root Cause Analysis with Fact vs Assumption Discipline',
      'Operational Runbook Execution & Zero-Downtime Rollbacks',
      'API Idempotency & Database Unique Constraints',
      'Asynchronous Event Emitter Memory Leak Cleanup',
      'SQL Parameterization & Defense in Depth',
      'Cohort Retention Funnel Drop-off Analysis',
      'Chi-Square Sample Ratio Mismatch (SRM) Detection'
    ];

    compList.innerHTML = coreCompetencies.map((comp, idx) => `
      <div class="comp-item">
        <span class="comp-check">${idx < (totalActivities + 2) ? '✓' : '○'}</span>
        <span class="comp-text">${escapeHtml(comp)}</span>
      </div>
    `).join('');
  }

  // History list
  const historyList = document.getElementById('profile-history-list');
  if (historyList) {
    if (totalActivities === 0) {
      historyList.innerHTML = `<p class="text-muted" style="padding: 1rem 0;">No completed missions or problems yet. Solve problems or launch any mission from the catalog to build your verified record.</p>`;
    } else {
      let historyHtml = '';
      completedMissions.forEach(s => {
        const m = MISSIONS_DATA[s.mission_id] || { title: s.mission_id };
        historyHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <strong>${escapeHtml(m.title)}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${s.created_at || ''} (Mission Simulation)</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-emerald">${s.score || s.overall_score || 0}/100</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${escapeHtml(s.reviewer_status || s.approval_status || 'Evaluated')}</div>
            </div>
          </div>
        `;
      });

      // Add solved problems
      try {
        const probProgress = JSON.parse(localStorage.getItem('praxis_offline_problem_progress') || '{}');
        Object.entries(probProgress).forEach(([pid, pdata]) => {
          if (pdata.status === 'completed') {
            const prob = (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.PROBLEMS ? window.PRAXIS_OFFLINE_DATA.PROBLEMS.find(p => p.id === pid) : null) || { title: pid.toUpperCase() };
            historyHtml += `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
                <div>
                  <strong>${escapeHtml(prob.title)}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Production Problem (${pid.toUpperCase()})</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-indigo">${pdata.score || 100}/100</span>
                  <div style="font-size: 0.75rem; color: #16a34a; margin-top: 0.2rem;">✓ Solved</div>
                </div>
              </div>
            `;
          }
        });
      } catch (e) {}

      historyList.innerHTML = historyHtml;
    }
  }
}

function exportLearnerTranscript() {
  const subs = state.submissionsLedger || [];
  let md = `# Praxis Engineering Practical Verification Transcript\n\n`;
  md += `**Candidate:** Learner Practitioner (Fresher / Fresher)\n`;
  md += `**Generated Date:** ${new Date().toISOString()}\n`;
  md += `**Total Simulations Completed:** ${subs.length}\n\n`;
  md += `## Verified Simulations Ledger\n\n`;

  if (subs.length === 0) {
    md += `*No verified missions recorded yet.*\n`;
  } else {
    subs.forEach((s, idx) => {
      const m = MISSIONS_DATA[s.mission_id] || { title: s.mission_id };
      md += `### ${idx + 1}. ${m.title}\n`;
      md += `- **Mission ID:** \`${s.mission_id}\`\n`;
      md += `- **Rubric Score:** ${s.score || s.overall_score || 0} / 100\n`;
      md += `- **Approval Status:** ${s.reviewer_status || s.approval_status}\n`;
      md += `- **Timestamp:** ${s.created_at}\n\n`;
    });
  }

  // Append solved problems to transcript portfolio
  try {
    const probProgress = JSON.parse(localStorage.getItem('praxis_offline_problem_progress') || '{}');
    const solvedEntries = Object.entries(probProgress).filter(([_, d]) => d.status === 'completed');
    if (solvedEntries.length > 0) {
      md += `\n## Solved Production Engineering Problems (${solvedEntries.length} Solved)\n\n`;
      solvedEntries.forEach(([pid, pdata], idx) => {
        const prob = (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.PROBLEMS ? window.PRAXIS_OFFLINE_DATA.PROBLEMS.find(p => p.id === pid) : null) || { title: pid.toUpperCase(), category: 'Production' };
        md += `### ${idx + 1}. [${pid.toUpperCase()}] ${prob.title}\n`;
        md += `- **Track/Category:** ${prob.category || 'Engineering'}\n`;
        md += `- **Score:** ${pdata.score || 100} / 100\n`;
        md += `- **Evaluated Status:** ✓ Accepted\n\n`;
      });
    }
  } catch (e) {}

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Praxis_Engineering_Transcript_${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Verified transcript exported as Markdown.', 'success');
}

// ============================================================================
// CURRICULUM, AUTH & PROBLEM BANK CONTROLLER
// ============================================================================

state.token = localStorage.getItem('praxis_token') || null;
state.user = null;
state.rolesList = [];
state.selectedRoleForOnboarding = null;
state.quizQuestions = [];
state.quizUserAnswers = {};
state.problemsList = [];
state.activeProblemId = 'prob-01';
state.problemsFilter = 'all';

async function checkAuthAndSession() {
  const token = localStorage.getItem('praxis_token');
  const activeUserStr = localStorage.getItem('praxis_active_user') || localStorage.getItem('praxis_offline_user');

  if (!token && !activeUserStr) {
    showAuthOverlay(true);
    return;
  }

  // Restore local learner session immediately so user is not stuck on auth screen
  if (activeUserStr) {
    try {
      state.user = JSON.parse(activeUserStr);
      state.token = token || ('praxis-token-' + (state.user.user_id || 'usr_local'));
    } catch (e) {}
  }

  // If token exists, verify with backend if running
  if (token) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        if (res.ok) {
          const data = await res.json();
          state.user = data.user;
          localStorage.setItem('praxis_active_user', JSON.stringify(state.user));
        } else if (res.status === 401) {
          // Explicit token rejection from real backend API
          localStorage.removeItem('praxis_token');
          localStorage.removeItem('praxis_active_user');
          localStorage.removeItem('praxis_offline_user');
          state.token = null;
          state.user = null;
          showAuthOverlay(true);
          return;
        }
      }
    } catch (err) {
      // Backend unreachable or static host (GitHub Pages) - keep offline user active
    }
  }

  if (state.user) {
    showAuthOverlay(false);
    updateUserHeaderUI();
    if (!state.user.role_locked) {
      openRoleOnboardingModal();
    } else if (!state.user.quiz_passed) {
      switchView('handbook');
    } else {
      switchView('dashboard');
    }
  } else {
    showAuthOverlay(true);
  }
}

function showAuthOverlay(visible) {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = visible ? 'flex' : 'none';
}

function updateUserHeaderUI() {
  const avatar = document.getElementById('header-user-avatar');
  const name = document.getElementById('header-user-name');
  const role = document.getElementById('header-user-role');
  const sidebarTrack = document.getElementById('sidebar-active-track-name');

  if (state.user) {
    const initials = (state.user.full_name || state.user.username || 'U')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    if (avatar) avatar.textContent = initials;
    if (name) name.textContent = state.user.full_name || state.user.username;

    const roleName = getRoleDisplayName(state.user.role);
    if (role) role.textContent = state.user.role_locked ? `🔒 ${roleName}` : 'Unassigned Track';
    if (sidebarTrack) sidebarTrack.textContent = roleName;
    updateHandbookForUserRole();
  } else {
    if (avatar) avatar.textContent = 'G';
    if (name) name.textContent = 'Guest';
    if (role) role.textContent = 'Sign In Required';
    updateHandbookForUserRole();
  }
}

function getRoleDisplayName(roleId) {
  const map = {
    'software-developer': 'Software Developer',
    'cloud-engineer': 'Cloud Engineer',
    'data-analyst': 'Data Analyst',
    'cloud-sre': 'Cloud Engineer',
    'backend-eng': 'Software Developer',
    'data-ai': 'Data Analyst',
    'fullstack-prod': 'Software Developer'
  };
  return map[roleId] || roleId || 'Software Developer';
}

function saveSessionAndProceed(user, token) {
  state.token = token;
  state.user = user;
  localStorage.setItem('praxis_token', token);
  localStorage.setItem('praxis_active_user', JSON.stringify(user));
  localStorage.setItem('praxis_offline_user', JSON.stringify(user));

  try {
    const usersDb = JSON.parse(localStorage.getItem('praxis_users_db') || '{}');
    usersDb[user.username.toLowerCase()] = user;
    localStorage.setItem('praxis_users_db', JSON.stringify(usersDb));
  } catch (e) {}

  showAuthOverlay(false);
  updateUserHeaderUI();
  showToast(`Welcome, ${user.full_name || user.username}!`, 'success');

  if (!user.role_locked) {
    openRoleOnboardingModal();
  } else {
    closeRoleOnboardingModal();
    if (!user.quiz_passed) {
      switchView('handbook');
    } else {
      switchView('dashboard');
    }
  }
}

function bindAuthControls() {
  const tabSignin = document.getElementById('auth-tab-signin');
  const tabSignup = document.getElementById('auth-tab-signup');
  const fullnameField = document.getElementById('auth-fullname-field');
  const submitBtn = document.getElementById('auth-submit-btn');
  const title = document.getElementById('auth-header-title');
  const desc = document.getElementById('auth-header-desc');
  const authForm = document.getElementById('auth-form');
  const signoutBtn = document.getElementById('header-signout-btn');
  const linkSwitch = document.getElementById('auth-link-switch');
  const userLabel = document.getElementById('auth-username-label');
  let isSignup = false;

  function switchToSignIn() {
    isSignup = false;
    if (tabSignin) tabSignin.classList.add('active');
    if (tabSignup) tabSignup.classList.remove('active');
    if (fullnameField) fullnameField.style.display = 'none';
    if (userLabel) userLabel.textContent = 'Email or Username';
    if (submitBtn) submitBtn.textContent = 'Sign In to Praxis';
    if (title) title.textContent = 'Sign In to Praxis';
    if (desc) desc.textContent = 'Enter your email or username to access your simulation dashboard.';
    const promptEl = document.getElementById('auth-footer-prompt');
    if (promptEl) {
      promptEl.innerHTML = `Don't have an account? <a href="#" id="auth-link-switch" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">Create a Free Account</a>`;
      document.getElementById('auth-link-switch')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchToSignUp();
      });
    }
    const errorMsg = document.getElementById('auth-error-msg');
    if (errorMsg) errorMsg.style.display = 'none';
  }

  function switchToSignUp() {
    isSignup = true;
    if (tabSignup) tabSignup.classList.add('active');
    if (tabSignin) tabSignin.classList.remove('active');
    if (fullnameField) fullnameField.style.display = 'flex';
    if (userLabel) userLabel.textContent = 'Choose Email or Username';
    if (submitBtn) submitBtn.textContent = 'Create Free Account';
    if (title) title.textContent = 'Create Praxis Account';
    if (desc) desc.textContent = 'Register with your email to unlock your role track and production problems.';
    const promptEl = document.getElementById('auth-footer-prompt');
    if (promptEl) {
      promptEl.innerHTML = `Already have an account? <a href="#" id="auth-link-switch" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">Sign In here</a>`;
      document.getElementById('auth-link-switch')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchToSignIn();
      });
    }
    const errorMsg = document.getElementById('auth-error-msg');
    if (errorMsg) errorMsg.style.display = 'none';
  }

  if (tabSignin && tabSignup) {
    tabSignin.addEventListener('click', switchToSignIn);
    tabSignup.addEventListener('click', switchToSignUp);
  }

  if (linkSwitch) {
    linkSwitch.addEventListener('click', (e) => {
      e.preventDefault();
      if (isSignup) switchToSignIn();
      else switchToSignUp();
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('auth-username');
      const passwordInput = document.getElementById('auth-password');
      const fullnameInput = document.getElementById('auth-fullname');
      const errorMsg = document.getElementById('auth-error-msg');

      if (errorMsg) {
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
      }

      const rawUsername = (usernameInput ? usernameInput.value : '').trim();
      const username = rawUsername.toLowerCase();
      const password = (passwordInput ? passwordInput.value : '').trim();
      const rawFullName = fullnameInput && fullnameInput.value ? fullnameInput.value.trim() : '';
      const full_name = rawFullName || (rawUsername.includes('@') ? rawUsername.split('@')[0] : rawUsername).replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      if (!username || username.length < 3) {
        if (errorMsg) {
          errorMsg.textContent = 'Please enter an email or username with at least 3 characters.';
          errorMsg.style.display = 'block';
        }
        return;
      }
      if (!password || password.length < 6) {
        if (errorMsg) {
          errorMsg.textContent = 'Password must be at least 6 characters long.';
          errorMsg.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isSignup ? 'Creating Account...' : 'Signing In...';
      }

      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignup ? { username, password, full_name } : { username, password };

      let backendSuccess = false;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.user && data.token) {
            backendSuccess = true;
            if (submitBtn) submitBtn.disabled = false;
            saveSessionAndProceed(data.user, data.token);
            return;
          } else if (res.status === 400 && isSignup && data.detail && data.detail.includes('already registered')) {
            // Already registered - allow user to easily switch to sign in
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Create Free Account';
            }
            if (errorMsg) {
              errorMsg.innerHTML = `${escapeHtml(data.detail)} <br><button type="button" class="btn btn-outline btn-sm" id="btn-quick-signin" style="margin-top: 6px; padding: 2px 10px; font-size: 0.78rem;">Click to Sign In with this Email</button>`;
              errorMsg.style.display = 'block';
              document.getElementById('btn-quick-signin')?.addEventListener('click', () => {
                switchToSignIn();
                if (passwordInput) passwordInput.focus();
              });
            }
            return;
          } else if (res.status === 401 && !isSignup) {
            // Account not found or wrong password
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In to Praxis';
            }
            if (errorMsg) {
              errorMsg.innerHTML = `Invalid username or password. <br>New to Praxis? <button type="button" class="btn btn-outline btn-sm" id="btn-quick-signup" style="margin-top: 6px; padding: 2px 10px; font-size: 0.78rem;">Create Free Account with this Email</button>`;
              errorMsg.style.display = 'block';
              document.getElementById('btn-quick-signup')?.addEventListener('click', () => {
                switchToSignUp();
                if (passwordInput) passwordInput.focus();
              });
            }
            return;
          } else {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = isSignup ? 'Create Free Account' : 'Sign In to Praxis';
            }
            if (errorMsg) {
              errorMsg.textContent = data.detail || 'Authentication failed. Please verify your credentials.';
              errorMsg.style.display = 'block';
            }
            return;
          }
        }
      } catch (networkErr) {
        // Backend offline / static GitHub Pages host
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isSignup ? 'Create Free Account' : 'Sign In to Praxis';
      }

      // Local client-side user database fallback (for GitHub Pages / Serverless)
      let usersDb = {};
      try {
        usersDb = JSON.parse(localStorage.getItem('praxis_users_db') || '{}');
      } catch (e) {
        usersDb = {};
      }

      if (isSignup) {
        if (usersDb[username]) {
          if (errorMsg) {
            errorMsg.innerHTML = `Account "${escapeHtml(rawUsername)}" is already registered locally. <br><button type="button" class="btn btn-outline btn-sm" id="btn-quick-signin-off" style="margin-top: 6px; padding: 2px 10px; font-size: 0.78rem;">Sign in with this account</button>`;
            errorMsg.style.display = 'block';
            document.getElementById('btn-quick-signin-off')?.addEventListener('click', () => {
              switchToSignIn();
              if (passwordInput) passwordInput.focus();
            });
          }
          return;
        }

        const newUser = {
          user_id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
          username: username,
          full_name: full_name,
          password: password,
          role: null,
          role_locked: false,
          quiz_passed: false,
          quiz_score: 0,
          created_at: new Date().toISOString()
        };

        usersDb[username] = newUser;
        localStorage.setItem('praxis_users_db', JSON.stringify(usersDb));
        const localToken = 'praxis-token-' + newUser.user_id;
        saveSessionAndProceed(newUser, localToken);
      } else {
        // Sign In
        const existing = usersDb[username];
        if (existing) {
          if (existing.password && existing.password !== password) {
            if (errorMsg) {
              errorMsg.textContent = 'Incorrect password for this account. Please verify and try again.';
              errorMsg.style.display = 'block';
            }
            return;
          }
          const localToken = 'praxis-token-' + existing.user_id;
          saveSessionAndProceed(existing, localToken);
        } else {
          // Automatic seamless enrollment for visitor on static host
          const newUser = {
            user_id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            username: username,
            full_name: full_name,
            password: password,
            role: null,
            role_locked: false,
            quiz_passed: false,
            quiz_score: 0,
            created_at: new Date().toISOString()
          };
          usersDb[username] = newUser;
          localStorage.setItem('praxis_users_db', JSON.stringify(usersDb));
          const localToken = 'praxis-token-' + newUser.user_id;
          saveSessionAndProceed(newUser, localToken);
        }
      }
    });
  }

  const handleLogoutAction = async () => {
    try {
      if (state.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${state.token}` }
        });
      }
    } catch (e) {
      // offline fallback
    }
    localStorage.removeItem('praxis_token');
    localStorage.removeItem('praxis_active_user');
    localStorage.removeItem('praxis_offline_user');
    state.token = null;
    state.user = null;
    updateUserHeaderUI();
    showAuthOverlay(true);
    showToast('Logged out successfully.', 'info');
  };

  if (signoutBtn) {
    signoutBtn.addEventListener('click', handleLogoutAction);
  }

  const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', handleLogoutAction);
  }

  const togglePasswordBtn = document.getElementById('toggle-auth-password');
  const passwordInput = document.getElementById('auth-password');
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      togglePasswordBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  const confirmRoleBtn = document.getElementById('confirm-role-lock-btn');
  if (confirmRoleBtn) {
    confirmRoleBtn.addEventListener('click', confirmRoleLock);
  }
}

function openRoleOnboardingModal() {
  const overlay = document.getElementById('role-onboard-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';

  // Synchronously load default/offline roles so the grid is NEVER blank
  if (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.ROLES) {
    state.rolesList = window.PRAXIS_OFFLINE_DATA.ROLES;
    renderRoleSelectionGrid();
  }

  // Optionally fetch updated roles in background
  fetch('/api/roles')
    .then(res => res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null)
    .then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        state.rolesList = data;
        renderRoleSelectionGrid();
      }
    })
    .catch(() => {});
}

function closeRoleOnboardingModal() {
  const overlay = document.getElementById('role-onboard-overlay');
  if (overlay) overlay.style.display = 'none';
}

function renderRoleSelectionGrid() {
  const grid = document.getElementById('role-selection-grid');
  if (!grid) return;

  grid.innerHTML = state.rolesList.map(r => `
    <div class="role-select-item ${state.selectedRoleForOnboarding === r.id ? 'selected' : ''}" data-role-id="${r.id}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div class="role-item-title">${escapeHtml(r.title)}</div>
        <span class="role-item-badge">${escapeHtml(r.badge)}</span>
      </div>
      <div class="role-item-desc">${escapeHtml(r.description)}</div>
      <div class="role-item-skills">
        ${(r.core_skills || []).map(s => `<span class="role-skill-pill">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.role-select-item').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedRoleForOnboarding = card.dataset.roleId;
      renderRoleSelectionGrid();
      const btn = document.getElementById('confirm-role-lock-btn');
      if (btn) {
        btn.disabled = false;
        btn.textContent = `Confirm & Lock Role: ${getRoleDisplayName(state.selectedRoleForOnboarding)}`;
      }
    });
  });
}

async function confirmRoleLock() {
  if (!state.selectedRoleForOnboarding) return;
  const btn = document.getElementById('confirm-role-lock-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Locking Track...';
  }

  let backendSuccess = false;
  if (state.token) {
    try {
      const res = await fetch('/api/auth/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify({ role: state.selectedRoleForOnboarding })
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json') && res.ok) {
        const data = await res.json();
        state.user = data.user;
        backendSuccess = true;
      }
    } catch (e) {}
  }

  if (!backendSuccess && state.user) {
    state.user.role = state.selectedRoleForOnboarding;
    state.user.role_locked = true;
  }

  if (state.user) {
    localStorage.setItem('praxis_active_user', JSON.stringify(state.user));
    localStorage.setItem('praxis_offline_user', JSON.stringify(state.user));
    try {
      const usersDb = JSON.parse(localStorage.getItem('praxis_users_db') || '{}');
      usersDb[state.user.username.toLowerCase()] = state.user;
      localStorage.setItem('praxis_users_db', JSON.stringify(usersDb));
    } catch (e) {}
  }

  closeRoleOnboardingModal();
  updateUserHeaderUI();
  showToast(`Track permanently locked to ${getRoleDisplayName(state.user ? state.user.role : state.selectedRoleForOnboarding)}.`, 'success');
  switchView('handbook');
}

// ----------------------------------------------------------------------------
// HANDBOOK & QUIZ CONTROLLER
// ----------------------------------------------------------------------------

function bindHandbookAndQuizControls() {
  // Read Online in Browser button
  const readOnlineBtn = document.getElementById('btn-read-online');
  if (readOnlineBtn) {
    readOnlineBtn.addEventListener('click', () => {
      const reader = document.getElementById('handbook-reader-view');
      if (reader) {
        reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstSec = document.getElementById('sec-01');
        if (firstSec) highlightSection(firstSec);
      }
    });
  }

  // Clickable syllabus cards -> Jump directly to section
  const chapterCards = document.querySelectorAll('.chapter-card[data-target]');
  chapterCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        highlightSection(targetEl);
      }
    });
  });

  // Sticky Section jump pills
  const navPills = document.querySelectorAll('.reader-nav-pill-btn[data-target]');
  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        highlightSection(targetEl);
      }
    });
  });

  // Bottom action in reader
  const readerProceedBtn = document.getElementById('reader-proceed-to-quiz-btn');
  if (readerProceedBtn) {
    readerProceedBtn.addEventListener('click', () => {
      switchView('quiz');
      loadQuizQuestions();
    });
  }

  const proceedToQuizBtn = document.getElementById('proceed-to-quiz-btn');
  if (proceedToQuizBtn) {
    proceedToQuizBtn.addEventListener('click', () => {
      switchView('quiz');
      loadQuizQuestions();
    });
  }

  const submitQuizBtn = document.getElementById('submit-readiness-quiz-btn');
  if (submitQuizBtn) {
    submitQuizBtn.addEventListener('click', submitReadinessQuiz);
  }

  const unlockProblemsBtn = document.getElementById('quiz-unlock-problems-btn');
  if (unlockProblemsBtn) {
    unlockProblemsBtn.addEventListener('click', () => {
      switchView('problems');
      loadProblemsBank();
    });
  }

  const probSearchInput = document.getElementById('prob-search-input');
  if (probSearchInput) {
    probSearchInput.addEventListener('input', () => {
      currentProbSearch = probSearchInput.value;
      renderProblemsList(currentProbFilter);
    });
  }

  const filterBtns = document.querySelectorAll('.prob-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.problemsFilter = btn.dataset.filter;
      renderProblemsList(state.problemsFilter);
    });
  });

  const handbookSearchInput = document.getElementById('handbook-search-input');
  const handbookSearchCount = document.getElementById('handbook-search-count');
  if (handbookSearchInput) {
    handbookSearchInput.addEventListener('input', () => {
      const q = handbookSearchInput.value.trim().toLowerCase();
      const sections = document.querySelectorAll('.reader-section-block');
      let matches = 0;
      sections.forEach(sec => {
        const text = sec.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          sec.style.display = 'block';
          if (q) matches++;
        } else {
          sec.style.display = 'none';
        }
      });
      if (handbookSearchCount) {
        handbookSearchCount.textContent = q ? `${matches} chapter(s) found` : '';
      }
    });
  }

  const quizReviewCloseBtn = document.getElementById('quiz-review-modal-close-btn');
  const quizReviewDoneBtn = document.getElementById('quiz-review-done-btn');
  const quizReviewModal = document.getElementById('quiz-review-modal');
  if (quizReviewCloseBtn && quizReviewModal) {
    quizReviewCloseBtn.addEventListener('click', () => {
      quizReviewModal.style.display = 'none';
    });
  }
  if (quizReviewDoneBtn && quizReviewModal) {
    quizReviewDoneBtn.addEventListener('click', () => {
      quizReviewModal.style.display = 'none';
    });
  }
}

function highlightSection(el) {
  document.querySelectorAll('.reader-section-block').forEach(b => b.classList.remove('highlight-pulse'));
  el.classList.add('highlight-pulse');
  setTimeout(() => {
    el.classList.remove('highlight-pulse');
  }, 2200);
}

function updateHandbookForUserRole() {
  const role = state.user ? state.user.role : null;
  const roleTitle = getRoleDisplayName(role);

  const pdfFileMap = {
    'software-developer': 'assets/Software_Developer_Handbook.pdf',
    'cloud-engineer': 'assets/Cloud_Engineer_Handbook.pdf',
    'data-analyst': 'assets/Data_Analyst_Handbook.pdf',
    'cloud-sre': 'assets/Cloud_Engineer_Handbook.pdf',
    'backend-eng': 'assets/Software_Developer_Handbook.pdf',
    'data-ai': 'assets/Data_Analyst_Handbook.pdf',
  };
  const pdfStaticPath = pdfFileMap[role] || 'assets/Praxis_Industry_Foundations_Handbook.pdf';

  const downloadBtn = document.getElementById('btn-download-handbook-pdf');
  if (downloadBtn) {
    downloadBtn.href = pdfStaticPath;
    downloadBtn.download = role ? `${roleTitle.replace(/\s+/g, '_')}_Handbook.pdf` : 'Praxis_Industry_Foundations_Handbook.pdf';
    downloadBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      Download ${roleTitle} Handbook (12-Page PDF)
    `;
  }

  const heroTitle = document.getElementById('handbook-hero-title');
  if (heroTitle) {
    heroTitle.textContent = `${roleTitle} Foundations Handbook`;
  }
}

async function loadQuizQuestions() {
  const container = document.getElementById('quiz-questions-list');
  if (!container) return;
  container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #64748b;">Loading assessment questions...</div>`;

  try {
    const res = await fetch('/api/quiz/questions');
    if (res.ok) {
      state.quizQuestions = await res.json();
      renderQuizQuestions();
      return;
    }
  } catch (err) {
    console.warn('Backend quiz API unreachable, loading offline questions:', err);
  }

  if (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.QUIZ_QUESTIONS) {
    state.quizQuestions = window.PRAXIS_OFFLINE_DATA.QUIZ_QUESTIONS.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));
    renderQuizQuestions();
  } else {
    container.innerHTML = `<div style="color: #ef4444; padding: 1rem;">Failed to load questions. Please check connection.</div>`;
  }
}

function renderQuizQuestions() {
  const container = document.getElementById('quiz-questions-list');
  if (!container) return;

  container.innerHTML = state.quizQuestions.map((q, idx) => `
    <div class="quiz-question-box" id="quiz-box-${q.id}">
      <div class="quiz-q-num">Question 0${idx + 1} of 05</div>
      <div class="quiz-q-text">${escapeHtml(q.question)}</div>
      <div class="quiz-options-list">
        ${q.options.map(opt => `
          <label class="quiz-option-row">
            <input type="radio" name="quiz-${q.id}" value="${opt.id}" ${state.quizUserAnswers[q.id] === opt.id ? 'checked' : ''}>
            <span class="quiz-option-text">${escapeHtml(opt.text)}</span>
          </label>
        `).join('')}
      </div>
      <div class="quiz-explanation-box" id="quiz-exp-${q.id}"></div>
    </div>
  `).join('');

  container.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const qid = e.target.name.replace('quiz-', '');
      state.quizUserAnswers[qid] = e.target.value;
    });
  });
}

async function submitReadinessQuiz() {
  if (!state.token) {
    showToast('Please sign in first.', 'error');
    return;
  }
  const answeredCount = Object.keys(state.quizUserAnswers).length;
  if (answeredCount < state.quizQuestions.length) {
    showToast(`Please answer all ${state.quizQuestions.length} questions before submitting.`, 'warning');
    return;
  }

  const btn = document.getElementById('submit-readiness-quiz-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Evaluating...';
  }

  try {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ answers: state.quizUserAnswers })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && res.ok) {
      const data = await res.json();
      renderQuizResults(data);
      return;
    }
  } catch (err) {
    // Backend offline / static GitHub Pages
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit Readiness Assessment';
    }
  }

  // Robust client-side evaluation fallback
  const offlineQs = (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.QUIZ_QUESTIONS) || [];
  let score = 0;
  const results = offlineQs.map(q => {
    const sel = state.quizUserAnswers[q.id];
    const isCorrect = sel === q.correct;
    if (isCorrect) score += 1;
    return {
      id: q.id,
      selected: sel,
      correct: q.correct,
      is_correct: isCorrect,
      explanation: q.explanation
    };
  });
  const passed = score >= 4;
  const payload = {
    score: score,
    total: offlineQs.length,
    percentage: Math.round((score / (offlineQs.length || 1)) * 100),
    passed: passed,
    message: passed ? 'Congratulations! You passed the Readiness Assessment.' : 'Score was below 80%. Review the handbook and try again.',
    results: results
  };
  if (state.user) {
    state.user.quiz_passed = passed;
    state.user.quiz_score = score;
    localStorage.setItem('praxis_active_user', JSON.stringify(state.user));
    localStorage.setItem('praxis_offline_user', JSON.stringify(state.user));
    try {
      const usersDb = JSON.parse(localStorage.getItem('praxis_users_db') || '{}');
      usersDb[state.user.username.toLowerCase()] = state.user;
      localStorage.setItem('praxis_users_db', JSON.stringify(usersDb));
    } catch (e) {}
  }
  renderQuizResults(payload);
}

function renderQuizResults(data) {
  const banner = document.getElementById('quiz-results-banner');
  const scoreDisp = document.getElementById('quiz-score-display');
  const msgDisp = document.getElementById('quiz-status-message');
  const unlockBtn = document.getElementById('quiz-unlock-problems-btn');

  if (banner) banner.style.display = 'block';
  if (scoreDisp) {
    scoreDisp.textContent = `Score: ${data.score} / ${data.total} (${data.percentage}%)`;
    scoreDisp.style.color = data.passed ? '#16a34a' : '#dc2626';
  }
  if (msgDisp) msgDisp.textContent = data.message;
  if (unlockBtn) unlockBtn.style.display = data.passed ? 'inline-flex' : 'none';

  data.results.forEach(r => {
    const expBox = document.getElementById(`quiz-exp-${r.id}`);
    if (expBox) {
      expBox.style.display = 'block';
      expBox.style.background = r.is_correct ? '#f0fdf4' : '#fef2f2';
      expBox.style.borderColor = r.is_correct ? '#bbf7d0' : '#fecaca';
      expBox.style.color = r.is_correct ? '#166534' : '#b91c1c';
      expBox.innerHTML = `<strong>${r.is_correct ? '✓ Correct:' : '✗ Incorrect:'}</strong> ${escapeHtml(r.explanation)}`;
    }
  });

  if (data.passed) {
    showToast('Readiness Assessment Passed! Opening your operations dashboard...', 'success');
    if (state.user) {
      state.user.quiz_passed = true;
      state.user.quiz_score = data.score;
      localStorage.setItem('praxis_active_user', JSON.stringify(state.user));
      localStorage.setItem('praxis_offline_user', JSON.stringify(state.user));
      try {
        const usersDb = JSON.parse(localStorage.getItem('praxis_users_db') || '{}');
        usersDb[state.user.username.toLowerCase()] = state.user;
        localStorage.setItem('praxis_users_db', JSON.stringify(usersDb));
      } catch (e) {}
    }
    const sidebarPill = document.getElementById('quiz-sidebar-pill');
    if (sidebarPill) {
      sidebarPill.textContent = 'Passed (5/5)';
      sidebarPill.style.background = 'rgba(16, 185, 129, 0.2)';
      sidebarPill.style.color = '#10b981';
    }
    if (unlockBtn) {
      unlockBtn.textContent = 'Go to Operations Dashboard ➔';
      unlockBtn.style.display = 'inline-flex';
      unlockBtn.onclick = () => switchView('dashboard');
    }
    setTimeout(() => {
      switchView('dashboard');
    }, 1800);
  } else {
    showToast('Score under 80%. Review explanations and retry.', 'warning');
  }
}

// ----------------------------------------------------------------------------
// LEARNER DASHBOARD CONTROLLER
// ----------------------------------------------------------------------------

async function renderDashboardView() {
  if (state.problemsList.length === 0) {
    await loadProblemsBank();
  }

  const welcomeUser = document.getElementById('dash-welcome-user');
  const welcomeTrack = document.getElementById('dash-welcome-track');
  const statIncomplete = document.getElementById('dash-stat-incomplete-count');
  const statSolved = document.getElementById('dash-stat-solved-count');
  const statLabs = document.getElementById('dash-stat-labs-count');

  if (state.user) {
    if (welcomeUser) welcomeUser.textContent = `Welcome, ${state.user.full_name || state.user.username}!`;
    if (welcomeTrack) welcomeTrack.textContent = `Active Career Track: 🔒 ${getRoleDisplayName(state.user.role)}`;
  }

  // Calculate counts
  const basicProbs = state.problemsList.filter(p => p.phase === 1);
  const interProbs = state.problemsList.filter(p => p.phase === 2);

  const solvedBasic = basicProbs.filter(p => p.status === 'completed').length;
  const solvedInter = interProbs.filter(p => p.status === 'completed').length;
  const totalSolved = solvedBasic + solvedInter;

  const incompleteBasic = Math.max(0, basicProbs.length - solvedBasic);
  const incompleteInter = Math.max(0, interProbs.length - solvedInter);
  const totalIncomplete = Math.max(0, state.problemsList.length - totalSolved);

  const userTrack = state.user ? (state.user.role === 'cloud-sre' ? 'cloud-engineer' : (state.user.role === 'backend-eng' ? 'software-developer' : (state.user.role === 'data-ai' ? 'data-analyst' : state.user.role))) : null;
  const roleMissions = state.allMissions.filter(m => !userTrack || m.track_id === userTrack);
  const guidedMissions = roleMissions.filter(m => m.type === 'guided');
  const indepMissions = roleMissions.filter(m => m.type === 'independent');

  const totalMissionCount = roleMissions.length || 70;
  const guidedCount = guidedMissions.length || 20;

  if (statIncomplete) statIncomplete.textContent = totalIncomplete;
  if (statSolved) statSolved.textContent = totalSolved;
  if (statLabs) statLabs.textContent = totalMissionCount;

  const badgeBasic = document.getElementById('dash-badge-basic-text');
  const badgeInter = document.getElementById('dash-badge-inter-text');
  const badgeLabs = document.getElementById('dash-badge-labs-text');

  if (badgeBasic) badgeBasic.textContent = `${incompleteBasic} Incomplete`;
  if (badgeInter) badgeInter.textContent = `${incompleteInter} Incomplete`;
  if (badgeLabs) badgeLabs.textContent = `${guidedCount} Guided Missions`;

  // Render Up Next: 3 Incomplete Problems
  const queueList = document.getElementById('dashboard-queue-list');
  if (queueList) {
    const nextIncomplete = state.problemsList.filter(p => p.status !== 'completed').slice(0, 3);
    if (nextIncomplete.length === 0) {
      queueList.innerHTML = `<div style="padding: 1rem; color: #16a34a; font-weight: 700;">🎉 All production problems completed! Check reviewer portal or launch incident labs.</div>`;
    } else {
      queueList.innerHTML = nextIncomplete.map(p => `
        <div class="dashboard-queue-item" data-problem-id="${p.id}">
          <div class="dash-queue-left">
            <span class="dash-queue-id">${p.id.toUpperCase()} • ${escapeHtml(p.category)}</span>
            <span class="dash-queue-title">${escapeHtml(p.title)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="dash-queue-badge ${p.phase === 1 ? 'prob-badge-basic' : 'prob-badge-inter'}">
              ${p.phase === 1 ? 'Basic • Help' : 'Inter • Standalone'}
            </span>
            <span class="dashboard-card-badge-incomplete">● Incomplete</span>
            <span style="color: #4f46e5; font-weight: 800; font-size: 0.85rem;">Solve ➔</span>
          </div>
        </div>
      `).join('');

      queueList.querySelectorAll('.dashboard-queue-item').forEach(item => {
        item.addEventListener('click', () => {
          const pid = item.dataset.problemId;
          state.activeProblemId = pid;
          switchView('problems');
          renderProblemDetail(pid);
        });
      });
    }
  }

  // Bind clicks on the 4 dashboard section cards
  const cardBasic = document.getElementById('dash-card-basic-problems');
  if (cardBasic) {
    cardBasic.onclick = () => {
      state.problemsFilter = 'basic';
      switchView('problems');
      const filterBtns = document.querySelectorAll('.prob-filter-btn');
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'basic'));
      renderProblemsList('basic');
    };
  }

  const cardInter = document.getElementById('dash-card-inter-problems');
  if (cardInter) {
    cardInter.onclick = () => {
      state.problemsFilter = 'inter';
      switchView('problems');
      const filterBtns = document.querySelectorAll('.prob-filter-btn');
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'inter'));
      renderProblemsList('inter');
    };
  }

  const cardLabs = document.getElementById('dash-card-simulation-labs');
  if (cardLabs) {
    cardLabs.onclick = () => {
      switchView('catalog');
    };
  }

  const cardHandbook = document.getElementById('dash-card-visit-handbook');
  if (cardHandbook) {
    cardHandbook.onclick = () => {
      switchView('handbook');
    };
  }
}

// ----------------------------------------------------------------------------
// 40 PROBLEMS CONTROLLER
// ----------------------------------------------------------------------------

async function loadProblemsBank() {
  try {
    const headers = state.token ? { 'Authorization': `Bearer ${state.token}` } : {};
    const res = await fetch('/api/problems', { headers });
    if (res.ok) {
      state.problemsList = await res.json();
      renderProblemsList(state.problemsFilter);
      if (state.problemsList.length > 0) {
        renderProblemDetail(state.activeProblemId || state.problemsList[0].id);
      }
      updateProblemsSolvedCounter();
      return;
    }
  } catch (err) {
    console.warn('Backend problems API unreachable, loading offline problem bank:', err);
  }

  if (window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.PROBLEMS) {
    const savedProgress = JSON.parse(localStorage.getItem('praxis_offline_problem_progress') || '{}');
    state.problemsList = window.PRAXIS_OFFLINE_DATA.PROBLEMS.map(p => ({
      ...p,
      status: savedProgress[p.id] ? savedProgress[p.id].status : 'pending',
      score: savedProgress[p.id] ? savedProgress[p.id].score : 0,
      feedback: savedProgress[p.id] ? savedProgress[p.id].feedback : null
    }));
    renderProblemsList(state.problemsFilter);
    if (state.problemsList.length > 0) {
      renderProblemDetail(state.activeProblemId || state.problemsList[0].id);
    }
    updateProblemsSolvedCounter();
  }
}

function updateProblemsSolvedCounter() {
  const solved = state.problemsList.filter(p => p.status === 'completed').length;
  const total = state.problemsList.length;
  const countPill = document.getElementById('problems-count-pill');
  const badge = document.getElementById('prob-solved-count-badge');
  if (countPill) countPill.textContent = `${solved}/${total}`;
  if (badge) badge.textContent = `${solved} / ${total} Solved`;
}

let currentProbSearch = '';
let currentProbFilter = 'all';

function renderProblemsList(filter = 'all') {
  currentProbFilter = filter;
  state.problemsFilter = filter;
  const container = document.getElementById('problems-scroll-container');
  if (!container) return;

  let filtered = state.problemsList;
  if (filter === 'basic') filtered = filtered.filter(p => p.phase === 1);
  if (filter === 'inter') filtered = filtered.filter(p => p.phase === 2);
  if (filter === 'solved') filtered = filtered.filter(p => p.status === 'completed');
  if (filter === 'unsolved') filtered = filtered.filter(p => p.status !== 'completed');

  if (currentProbSearch && currentProbSearch.trim()) {
    const q = currentProbSearch.trim().toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem 1rem; text-align: center; color: #64748b; font-size: 0.85rem;">
        No problems match your search criteria.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="prob-list-item ${state.activeProblemId === p.id ? 'active' : ''}" data-problem-id="${p.id}">
      <div class="prob-item-top">
        <span class="prob-item-id">${p.id.toUpperCase()}</span>
        <span class="prob-item-badge ${p.status === 'completed' ? 'prob-badge-done' : (p.phase === 1 ? 'prob-badge-basic' : 'prob-badge-inter')}">
          ${p.status === 'completed' ? '✓ Completed' : (p.phase === 1 ? 'Basic • Help' : 'Inter • No Help')}
        </span>
      </div>
      <div class="prob-item-title">${escapeHtml(p.title)}</div>
    </div>
  `).join('');

  container.querySelectorAll('.prob-list-item').forEach(item => {
    item.addEventListener('click', () => {
      state.activeProblemId = item.dataset.problemId;
      renderProblemsList(currentProbFilter);
      renderProblemDetail(state.activeProblemId);
    });
  });
}

async function runProblemPrecheck(problemId) {
  const inputEl = document.getElementById('problem-solution-input');
  const precheckBtn = document.getElementById('btn-precheck-problem');
  const consoleEl = document.getElementById('problem-precheck-console');
  if (!inputEl || !precheckBtn) return;

  precheckBtn.disabled = true;
  precheckBtn.textContent = 'Checking...';

  try {
    const res = await fetch(`/api/problems/${problemId}/precheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ solution: inputEl.value })
    });
    if (res.ok) {
      const data = await res.json();
      if (consoleEl) {
        consoleEl.style.display = 'block';
        consoleEl.innerHTML = `
          <div style="color: ${data.passed ? '#34d399' : '#f59e0b'}; font-weight: bold; margin-bottom: 4px;">
            [PRE-CHECK ${data.passed ? 'PASS' : 'WARN'}] Score: ${data.score}/100
          </div>
          <div>${escapeHtml(data.feedback)}</div>
          <div style="margin-top: 6px; font-size: 0.75rem; color: #94a3b8;">${escapeHtml(data.message)}</div>
        `;
      }
      showToast(data.passed ? 'Pre-check passed!' : 'Pre-check found issues.', data.passed ? 'success' : 'info');
      return;
    }
  } catch (err) {
    // Offline precheck fallback
  } finally {
    precheckBtn.disabled = false;
    precheckBtn.textContent = 'Run Pre-Check';
  }

  // Client-side offline precheck
  const match = (window.PRAXIS_OFFLINE_DATA ? window.PRAXIS_OFFLINE_DATA.PROBLEMS : state.problemsList).find(p => p.id === problemId);
  if (match) {
    const solLower = inputEl.value.trim().toLowerCase();
    const keywords = match.expected_keywords || [];
    const hits = keywords.filter(k => solLower.includes(k.toLowerCase()));
    const scoreRatio = keywords.length > 0 ? (hits.length / keywords.length) : 1.0;
    const score = Math.round(scoreRatio * 100);
    const passed = score >= (match.passing_score || 70);
    if (consoleEl) {
      consoleEl.style.display = 'block';
      consoleEl.innerHTML = `
        <div style="color: ${passed ? '#34d399' : '#f59e0b'}; font-weight: bold; margin-bottom: 4px;">
          [OFFLINE PRE-CHECK ${passed ? 'PASS' : 'WARN'}] Syntax & Concept Score: ${score}/100
        </div>
        <div>Matched concepts: ${hits.length ? hits.join(', ') : 'None'}</div>
        <div>Missing concepts: ${keywords.filter(k => !hits.includes(k)).join(', ') || 'None'}</div>
        <div style="margin-top: 6px; font-size: 0.75rem; color: #94a3b8;">${passed ? 'All required criteria addressed. Ready to submit.' : 'Address missing concepts before submitting.'}</div>
      `;
    }
    showToast(passed ? 'Pre-check passed!' : 'Pre-check found issues.', data.passed ? 'success' : 'info');
  }
}

function renderProblemDetail(problemId) {
  const container = document.getElementById('problem-detail-container');
  if (!container) return;

  const problem = state.problemsList.find(p => p.id === problemId);
  if (!problem) return;

  container.innerHTML = `
    <div class="problem-header-box">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${problem.phase === 1 ? 'badge-indigo' : 'badge-amber'}">${problem.phase === 1 ? 'Phase 1: Basic' : 'Phase 2: Intermediate'}</span>
          <span class="badge badge-indigo">${escapeHtml(problem.category)}</span>
        </div>
        <span class="badge ${problem.status === 'completed' ? 'badge-emerald' : 'badge-outline'}">${problem.status === 'completed' ? '✓ Solved (' + (problem.score || 100) + '/100)' : 'Unsolved'}</span>
      </div>

      <h1 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-top: 0.25rem;">${escapeHtml(problem.title)}</h1>

      <div>
        <h3 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em;">Production Incident & Scenario</h3>
        <p style="font-size: 0.925rem; color: #1e293b; line-height: 1.5; margin-top: 0.25rem;">${escapeHtml(problem.scenario)}</p>
      </div>

      <div style="margin-top: 0.25rem;">
        <h3 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em;">Your Engineering Deliverable</h3>
        <p style="font-size: 0.925rem; color: #1e293b; line-height: 1.5; margin-top: 0.25rem;">${escapeHtml(problem.task)}</p>
      </div>
    </div>

    <!-- Help / Reference Box -->
    ${problem.phase === 1 ? `
      <div class="problem-help-box">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; margin-bottom: 0.25rem;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          SOP & Syntax Reference Statement
        </div>
        <div>${escapeHtml(problem.help_statement || '')}</div>
      </div>
    ` : `
      <div class="problem-help-box no-help">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; margin-bottom: 0.25rem;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Intermediate Standalone Challenge
        </div>
        <div>No reference statement provided for Phase 2 problems. Apply independent systems reasoning, log triage, and production architecture principles.</div>
      </div>
    `}

    <!-- Enhanced Solution Editor with Line Numbers Gutter -->
    <div class="problem-editor-container">
      <div class="problem-editor-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Production Solution & Code Editor</span>
          <span class="badge badge-indigo" style="font-size: 0.68rem; padding: 1px 6px;">Syntax Assisted</span>
          <span id="problem-draft-chip" class="badge badge-emerald" style="display: none; font-size: 0.68rem; padding: 1px 6px;">Draft Restored</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-ghost btn-sm" id="btn-reset-prob-template" style="color: #94a3b8; font-size: 0.72rem;">Reset Template</button>
        </div>
      </div>
      <div class="code-editor-wrapper">
        <div class="code-editor-gutter" id="code-editor-gutter">1</div>
        <textarea class="problem-code-textarea" id="problem-solution-input" spellcheck="false" placeholder="Write your production diagnosis, code fix, or configuration update here...">${escapeHtml(problem.starter_template || '')}</textarea>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
        <span style="font-size: 0.75rem; color: #64748b;" id="editor-line-col-status">Lines: 1 | Tab inserts 2 spaces</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" id="btn-precheck-problem" style="font-size: 0.85rem;">Run Pre-Check</button>
          <button class="btn btn-primary" id="btn-submit-problem" style="font-size: 0.85rem;">Run & Submit Solution</button>
        </div>
      </div>
    </div>

    <!-- Pre-Check Console Output -->
    <div class="precheck-console" id="problem-precheck-console" style="display: none;"></div>

    <!-- Live Evaluation Result Card -->
    <div class="problem-eval-card" id="problem-eval-result"></div>
  `;

  const inputEl = document.getElementById('problem-solution-input');
  const gutterEl = document.getElementById('code-editor-gutter');
  const statusEl = document.getElementById('editor-line-col-status');
  const draftChip = document.getElementById('problem-draft-chip');
  const draftKey = 'praxis_draft_prob_' + problem.id;

  // Restore saved draft if exists
  const savedDraft = localStorage.getItem(draftKey);
  if (savedDraft && inputEl) {
    inputEl.value = savedDraft;
    if (draftChip) draftChip.style.display = 'inline-block';
  }

  function syncLineNumbers() {
    if (!inputEl || !gutterEl) return;
    const lines = (inputEl.value || '').split('\n').length;
    let numbers = '';
    for (let i = 1; i <= Math.max(lines, 1); i++) {
      numbers += i + '\n';
    }
    gutterEl.textContent = numbers;
    gutterEl.scrollTop = inputEl.scrollTop;
    if (statusEl) {
      statusEl.textContent = `Lines: ${lines} | Tab key inserts 2 spaces`;
    }
  }

  if (inputEl) {
    inputEl.addEventListener('input', () => {
      syncLineNumbers();
      localStorage.setItem(draftKey, inputEl.value);
    });
    inputEl.addEventListener('scroll', () => {
      if (gutterEl) gutterEl.scrollTop = inputEl.scrollTop;
    });
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = inputEl.selectionStart;
        const end = inputEl.selectionEnd;
        inputEl.value = inputEl.value.substring(0, start) + '  ' + inputEl.value.substring(end);
        inputEl.selectionStart = inputEl.selectionEnd = start + 2;
        syncLineNumbers();
        localStorage.setItem(draftKey, inputEl.value);
      }
    });
    syncLineNumbers();
  }

  document.getElementById('btn-reset-prob-template').addEventListener('click', () => {
    if (inputEl) {
      inputEl.value = problem.starter_template || '';
      localStorage.removeItem(draftKey);
      if (draftChip) draftChip.style.display = 'none';
      syncLineNumbers();
    }
  });

  const precheckBtn = document.getElementById('btn-precheck-problem');
  if (precheckBtn) {
    precheckBtn.addEventListener('click', () => {
      runProblemPrecheck(problem.id);
    });
  }

  document.getElementById('btn-submit-problem').addEventListener('click', () => {
    submitProblemSolution(problem.id);
  });
}

async function submitProblemSolution(problemId) {
  if (!state.token) {
    showToast('Please sign in to submit solutions.', 'error');
    return;
  }

  const input = document.getElementById('problem-solution-input');
  if (!input || !input.value.trim()) {
    showToast('Please write your solution before submitting.', 'warning');
    return;
  }

  const btn = document.getElementById('btn-submit-problem');
  btn.disabled = true;
  btn.textContent = 'Evaluating against rubric...';

  try {
    const res = await fetch(`/api/problems/${problemId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({ solution: input.value.trim() })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && res.ok) {
      const data = await res.json();
      const evalCard = document.getElementById('problem-eval-result');
      if (evalCard) {
        evalCard.style.display = 'flex';
        evalCard.style.background = data.passed ? '#f0fdf4' : '#fffbeb';
        evalCard.style.borderColor = data.passed ? '#bbf7d0' : '#fde68a';
        evalCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: ${data.passed ? '#166534' : '#92400e'}; font-size: 1rem;">
              ${data.passed ? '✓ Solution Accepted' : '⚠ Revisions Recommended'}
            </strong>
            <span class="badge ${data.passed ? 'badge-emerald' : 'badge-amber'}">${data.score} / 100</span>
          </div>
          <p style="font-size: 0.875rem; color: #334155; line-height: 1.4; margin-top: 0.25rem;">${escapeHtml(data.feedback)}</p>
        `;
      }

      const prob = state.problemsList.find(p => p.id === problemId);
      if (prob) {
        prob.status = data.status;
        prob.score = data.score;
      }
      renderProblemsList(state.problemsFilter);
      updateProblemsSolvedCounter();
      showToast(data.passed ? 'Problem solved successfully!' : 'Review feedback and adjust solution.', data.passed ? 'success' : 'info');
      return;
    }
  } catch (err) {
    // Offline / static GitHub Pages fallback
  } finally {
    btn.disabled = false;
    btn.textContent = 'Run & Submit Solution';
  }

  const match = (window.PRAXIS_OFFLINE_DATA ? window.PRAXIS_OFFLINE_DATA.PROBLEMS : state.problemsList).find(p => p.id === problemId);
  if (match) {
    const solLower = input.value.trim().toLowerCase();
    const keywords = match.expected_keywords || [];
    const hits = keywords.filter(k => solLower.includes(k.toLowerCase()));
    const scoreRatio = keywords.length > 0 ? (hits.length / keywords.length) : 1.0;
    const score = Math.round(scoreRatio * 100);
    const passed = score >= (match.passing_score || 70);
    const feedback = passed
      ? `Solution accepted! (${score}%). Addressed required concepts: ${hits.join(', ')}.`
      : `Needs refinement (${score}%). Ensure you address: ${keywords.filter(k => !hits.includes(k)).join(', ')}.`;

    const evalData = {
      problem_id: problemId,
      status: passed ? 'completed' : 'in_progress',
      score: score,
      passed: passed,
      feedback: feedback
    };

    const savedProgress = JSON.parse(localStorage.getItem('praxis_offline_problem_progress') || '{}');
    savedProgress[problemId] = evalData;
    localStorage.setItem('praxis_offline_problem_progress', JSON.stringify(savedProgress));

    const evalCard = document.getElementById('problem-eval-result');
    if (evalCard) {
      evalCard.style.display = 'flex';
      evalCard.style.background = passed ? '#f0fdf4' : '#fffbeb';
      evalCard.style.borderColor = passed ? '#bbf7d0' : '#fde68a';
      evalCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: ${passed ? '#166534' : '#92400e'}; font-size: 1rem;">
            ${passed ? '✓ Solution Accepted' : '⚠ Revisions Recommended'}
          </strong>
          <span class="badge ${passed ? 'badge-emerald' : 'badge-amber'}">${score} / 100</span>
        </div>
        <p style="font-size: 0.875rem; color: #334155; line-height: 1.4; margin-top: 0.25rem;">${escapeHtml(feedback)}</p>
      `;
    }

    if (passed) {
      localStorage.removeItem('praxis_draft_prob_' + problemId);
    }

    const prob = state.problemsList.find(p => p.id === problemId);
    if (prob) {
      prob.status = evalData.status;
      prob.score = evalData.score;
    }
    renderProblemsList(state.problemsFilter);
    updateProblemsSolvedCounter();
    showToast(passed ? 'Problem solved successfully!' : 'Review feedback and adjust solution.', passed ? 'success' : 'info');
  } else {
    showToast('Network error during solution submission.', 'error');
  }
}

// ============================================================================
// SUITE ENHANCEMENTS: THEME, MOBILE DRAWER, HOTKEYS, PWA, ADMIN FILTERS
// ============================================================================

function initTheme() {
  const savedTheme = localStorage.getItem('praxis_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  updateThemeIcon();

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('praxis_theme', isDark ? 'dark' : 'light');
      updateThemeIcon();
      showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
    });
  }
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    const isDark = document.body.classList.contains('dark-mode');
    icon.textContent = isDark ? '☀️' : '🌙';
  }
}

function initMobileDrawer() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('mobile-sidebar-backdrop');

  if (mobileMenuBtn && sidebar && backdrop) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });

    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    });
  }
}

function initHotkeys() {
  const hotkeysModalBtn = document.getElementById('hotkeys-modal-btn');
  const hotkeysModal = document.getElementById('hotkeys-modal');
  const closeBtn = document.getElementById('hotkeys-modal-close-btn');
  const doneBtn = document.getElementById('hotkeys-done-btn');

  function openHotkeys() {
    if (hotkeysModal) hotkeysModal.style.display = 'flex';
  }
  function closeHotkeys() {
    if (hotkeysModal) hotkeysModal.style.display = 'none';
  }

  if (hotkeysModalBtn) hotkeysModalBtn.addEventListener('click', openHotkeys);
  if (closeBtn) closeBtn.addEventListener('click', closeHotkeys);
  if (doneBtn) doneBtn.addEventListener('click', closeHotkeys);

  window.addEventListener('keydown', (e) => {
    // Ctrl+K / Cmd+K opens hotkeys
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openHotkeys();
    }
    // Esc closes all modals
    if (e.key === 'Escape') {
      closeHotkeys();
      const reviewModal = document.getElementById('quiz-review-modal');
      if (reviewModal) reviewModal.style.display = 'none';
      const roleOverlay = document.getElementById('role-onboard-overlay');
      if (roleOverlay && state.user && state.user.role_locked) roleOverlay.style.display = 'none';
      const reviewerModal = document.getElementById('reviewer-modal');
      if (reviewerModal) reviewerModal.style.display = 'none';
      const sidebar = document.querySelector('.sidebar');
      const backdrop = document.getElementById('mobile-sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    }
    // Ctrl+Enter / Cmd+Enter runs solution
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const submitProbBtn = document.getElementById('btn-submit-problem');
      if (submitProbBtn && state.activeProblemId && state.currentView === 'problems') {
        e.preventDefault();
        submitProblemSolution(state.activeProblemId);
      }
    }
  });
}

function openQuizReviewModal(data) {
  const modal = document.getElementById('quiz-review-modal');
  const content = document.getElementById('quiz-review-modal-content');
  if (!modal || !content) return;

  const questions = state.quizQuestions.length > 0
    ? state.quizQuestions
    : ((window.PRAXIS_OFFLINE_DATA && window.PRAXIS_OFFLINE_DATA.QUIZ_QUESTIONS) || []);

  content.innerHTML = questions.map((q, idx) => {
    const userAnsId = state.quizUserAnswers[q.id];
    const isCorrect = userAnsId === q.correct_option_id;
    return `
      <div class="card" style="padding: 1rem; border-left: 4px solid ${isCorrect ? '#10b981' : '#f59e0b'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="font-size: 0.95rem; color: #0f172a;">Q${idx + 1}: ${escapeHtml(q.prompt || q.question)}</strong>
          <span class="badge ${isCorrect ? 'badge-emerald' : 'badge-amber'}">${isCorrect ? 'Correct ✓' : 'Incorrect ✗'}</span>
        </div>
        <div style="font-size: 0.85rem; color: #475569; margin-bottom: 0.5rem;">
          ${(q.options || []).map(opt => `
            <div style="padding: 4px 8px; margin: 3px 0; border-radius: 4px; ${opt.id === q.correct_option_id ? 'background: #dcfce7; color: #166534; font-weight: bold;' : (opt.id === userAnsId ? 'background: #fee2e2; color: #991b1b;' : '')}">
              ${opt.id === q.correct_option_id ? '✓ ' : (opt.id === userAnsId ? '✗ ' : '• ')}${escapeHtml(opt.text)}
            </div>
          `).join('')}
        </div>
        <div style="background: #f8fafc; padding: 0.5rem; border-radius: 6px; font-size: 0.8rem; color: #334155; line-height: 1.4;">
          <strong>Concept Explanation:</strong> ${escapeHtml(q.explanation || 'Review industry standard best practices for this role.')}
        </div>
      </div>
    `;
  }).join('');

  modal.style.display = 'flex';
}

function filterAdminTables() {
  const searchInput = document.getElementById('admin-search-input');
  const trackFilter = document.getElementById('admin-track-filter');
  const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const track = trackFilter ? trackFilter.value : 'all';

  const subRows = document.querySelectorAll('#admin-submissions-tbody tr');
  subRows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesTrack = track === 'all' || text.includes(track.replace('-', ' '));
    row.style.display = (matchesQuery && matchesTrack) ? '' : 'none';
  });

  const userRows = document.querySelectorAll('#admin-users-tbody tr');
  userRows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesTrack = track === 'all' || text.includes(track.replace('-', ' '));
    row.style.display = (matchesQuery && matchesTrack) ? '' : 'none';
  });
}

function initPwaServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('SW registration skipped:', err);
      });
    });
  }
}
