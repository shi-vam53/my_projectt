"""Mission Bank Generator for Praxis Simulation Platform.

Ensures:
- 20 Guided Missions per role (Software Developer, Cloud Engineer, Data Analyst) -> 60 total
- 50 Independent Missions per role (up to 200 per role) -> 150 total
- Full compliance with structured submission forms and rubric evaluation schemas.
"""

import json
from pathlib import Path


MISSIONS_DIR = Path(__file__).resolve().parents[1] / "missions"


SWE_GUIDED_SPECS = [
    ("swe-01", "Bug Triage: Double-Charge on Stripe Webhook Retries", "Fix duplicate transaction processing during webhook retries via idempotency keys."),
    ("swe-02", "Bug 2204: EventEmitter Memory Leak & Unhandled Rejection in Notification Worker", "Remediate unhandled promise rejections and unbounded listeners in node worker."),
    ("swe-03", "Security Remediation: SQL Injection & Filter Bypass in Product Search API", "Sanitize dynamic SQL filter concatenations using parameterized prepared statements."),
    ("swe-04", "Performance: N+1 Query Cascade in User Activity Feed API", "Eliminate N+1 database queries by refactoring to batch JOINs and eager loading."),
    ("swe-05", "Concurrency: Distributed Locking & Race Condition in Flash Sale Inventory", "Prevent overselling by implementing Redis Redlock distributed synchronization."),
    ("swe-06", "Resilience: Circuit Breaker Implementation for Unstable 3rd-Party Tax Service", "Wrap synchronous external API calls in circuit breakers to preserve thread pools."),
    ("swe-07", "Data Modeling: Zero-Downtime Database Migration for User Phone Numbers", "Execute expand-and-contract column migration without locking table or breaking APIs."),
    ("swe-08", "Architecture: Rate Limiter Token Bucket Middleware for Public REST API", "Protect public endpoints against denial of service using sliding window token buckets."),
    ("swe-09", "Caching: Redis Cache Stampede & Cache Penetration Mitigation", "Implement probabilistic early expiration (XFetch) and Bloom filters for non-existent keys."),
    ("swe-10", "AuthN/AuthZ: JWT Refresh Token Rotation & Replay Attack Defense", "Enforce single-use refresh token families and revoke compromised user sessions."),
    ("swe-11", "Observability: Structured JSON Logging & Distributed Trace Context Propagation", "Instrument HTTP requests with OpenTelemetry traceparent headers and JSON logging."),
    ("swe-12", "Error Handling: Global Error Handling Middleware & RFC 7807 Problem Details", "Standardize application exception payloads using the RFC 7807 specification."),
    ("swe-13", "Messaging: Dead Letter Queue (DLQ) & Idempotent Consumer in RabbitMQ", "Handle poison pill messages gracefully without stalling message consumption pipelines."),
    ("swe-14", "API Versioning: Deprecating v1 Endpoints with Sunset Headers & Contract Tests", "Implement graceful API deprecation with Sunset headers and schema compatibility checks."),
    ("swe-15", "Microservices: Saga Pattern Implementation for Multi-Service Order Fulfillment", "Coordinate distributed transactions across inventory, payment, and shipping services."),
    ("swe-16", "Security: Cross-Site Request Forgery (CSRF) & SameSite Cookie Hardening", "Implement cryptographic CSRF tokens and SameSite=Lax cookie policies on auth cookies."),
    ("swe-17", "Performance: Server-Sent Events (SSE) Memory Accumulation in Live Dashboard", "Prevent client connection leaks and backpressure buffer overflows in real-time streams."),
    ("swe-18", "Testing: Property-Based Testing for Currency Conversion & Cent Rounding", "Use Hypothesis to detect floating point cent discrepancies across exchange rates."),
    ("swe-19", "Database: PostgreSQL Connection Pool Deadlock under High Transaction Volume", "Establish deterministic transaction lock ordering to eliminate DB graph cycles."),
    ("swe-20", "Deployment: Zero-Downtime Blue-Green Switchover for Core Monolith API", "Execute DNS traffic cutover with pre-warmed connection pools and backward-compatible DB.")
]

CLOUD_GUIDED_SPECS = [
    ("cloud-sre-01", "Incident 1402: Latency & 5xx Spike After Release v2.4.0", "Investigate connection pool saturation post-release and execute safe rollback."),
    ("cloud-sre-02", "Incident 1488: CrashLoopBackOff & OOMKilled Flapping in Billing Service", "Diagnose Linux cgroup memory limits vs JVM heap allocations triggering Exit 137."),
    ("cloud-sre-03", "Incident 1520: Intermittent DNS Resolution Cascades & CoreDNS Throttling", "Remediate ndots:5 DNS query amplification using NodeLocal DNSCache."),
    ("cloud-sre-04", "Ingress Triage: SSL/TLS Handshake Failures on Ingress Controller", "Resolve expired wildcard TLS certificate secrets without restarting ingress pods."),
    ("cloud-sre-05", "Capacity Planning: Node Autoscaler Thrashing & Spot Instance Eviction Storm", "Tune Cluster Autoscaler cooldown periods and implement mixed instance spot pools."),
    ("cloud-sre-06", "Network Security: Misconfigured Kubernetes NetworkPolicy Leaking Database Port", "Author default-deny NetworkPolicies restricting database access to backend pods."),
    ("cloud-sre-07", "Infrastructure as Code: Terraform State Lock Contention & Drift Remediation", "Recover locked DynamoDB state tables and reconcile out-of-band console changes."),
    ("cloud-sre-08", "Storage Triage: PersistentVolumeClaim ReadWriteOnce Deadlock Across AZs", "Remediate multi-AZ pod scheduling conflicts with EBS volume attachments."),
    ("cloud-sre-09", "CI/CD Pipeline: GitHub Actions Runner Disk Saturation & Cache Invalidation", "Clean up dangling Docker build cache layers and enforce automated ephemeral disk GC."),
    ("cloud-sre-10", "Secrets Management: HashiCorp Vault Token Expiration & Pod Injection Failure", "Renew Vault Agent lease tokens and diagnose sidecar container init crashes."),
    ("cloud-sre-11", "Chaos Engineering: Network Partition Simulation & Kafka Broker Rebalance", "Test Kafka ISR replica resilience during cross-rack availability zone network splits."),
    ("cloud-sre-12", "Observability: Prometheus High Cardinality TSDB Disk Exhaustion", "Drop unbounded user_id metric labels to prevent Prometheus memory crashes."),
    ("cloud-sre-13", "Service Mesh: Istio Envoy Sidecar CPU Saturation on mTLS Handshakes", "Tune Envoy worker thread allocations and enable mutual TLS session ticket caching."),
    ("cloud-sre-14", "Disaster Recovery: Multi-Region PostgreSQL Read Replica Promotion Runbook", "Execute controlled failover of AWS Aurora read replica to primary cluster."),
    ("cloud-sre-15", "Kubernetes Upgrade: Deprecated API Version Eviction in EKS 1.28 Migration", "Migrate Ingress networking.k8s.io/v1beta1 manifests prior to cluster control plane upgrade."),
    ("cloud-sre-16", "Cost Optimization: Orphaned EBS Volumes & Unattached Cloud NAT Gateways", "Automate audit script identifying unused cloud resources saving $14k/month."),
    ("cloud-sre-17", "Security Incident: Overprivileged IAM Role Assumption via Pod Metadata Service", "Enforce IMDSv2 and block pod access to 169.254.169.254 AWS metadata endpoint."),
    ("cloud-sre-18", "Zero-Downtime Release: Flagger Canary Traffic Shifting Stalling at 20%", "Diagnose metric threshold mismatch halting automated progressive canary progression."),
    ("cloud-sre-19", "Linux Kernel: Epoll Socket Starvation & TCP SYN Flood Defense", "Tune sysctl somaxconn, tcp_max_syn_backlog, and enable SYN cookies under DDoS."),
    ("cloud-sre-20", "Error Budget Review: SEV-1 Outage Postmortem & Freeze Action Plan", "Facilitate blameless postmortem and establish engineering hardening priorities.")
]

DATA_GUIDED_SPECS = [
    ("data-analyst-01", "Anomaly Investigation: 35% Mobile Checkout Drop", "Isolate iOS vs Android conversion funnels to identify broken checkout SDK update."),
    ("data-analyst-02", "Cohort Retention Degradation Post-Onboarding Redesign", "Analyze weekly user retention cohorts to detect drop-offs after tutorial changes."),
    ("data-analyst-03", "Experimentation Audit: Sample Ratio Mismatch (SRM) in Checkout A/B Test", "Run chi-square test on 48/52 user split to detect biased traffic allocation."),
    ("data-analyst-04", "Pipeline Failure: Airflow DAG Deadlock Causing Stale Executive Revenue Dashboard", "Clear upstream task instance dependencies and optimize task concurrency limits."),
    ("data-analyst-05", "Data Modeling: Refactoring dbt Staging Model to Fix Duplicate Row Inflation", "Add unique surrogate key and dedup logic using ROW_NUMBER window function."),
    ("data-analyst-06", "SQL Performance: Eliminating Full Table Scan on 2 Billion Row Event Table", "Add date partition pruning and cluster keys to reduce warehouse query cost by 85%."),
    ("data-analyst-07", "Metric Reconciliation: Resolving Gross Margin Variance Between Stripe and Warehouse", "Reconcile payment processor fee deductions and currency exchange rate timing."),
    ("data-analyst-08", "Data Contract: Upstream Schema Drift Breaking Downstream Marketing Attribution", "Establish JSON schema validation contract on Kafka ingest topic to alert on drift."),
    ("data-analyst-09", "Churn Analysis: Survival Analysis Model for Enterprise SaaS Customer Churn", "Compute Kaplan-Meier curve and identify top leading indicators of customer downgrade."),
    ("data-analyst-10", "Data Privacy: Masking Personally Identifiable Information (PII) in Analytics Marts", "Implement SHA-256 salted hashing on email and IP addresses for GDPR compliance."),
    ("data-analyst-11", "Executive KPI: Building an Executive Net Revenue Retention (NRR) Dashboard", "Design SQL query calculating expansion, contraction, and churn across customer tiers."),
    ("data-analyst-12", "Fraud Detection: Identifying Anomalous Velocity Patterns in Payment Gateway Logs", "Write SQL window function flagging users with > 5 card attempts within 60 seconds."),
    ("data-analyst-13", "A/B Testing: Correcting for Variance Drift in Multi-Variant Pricing Experiments", "Apply Bonferroni correction for multiple hypothesis testing across 4 treatment variants."),
    ("data-analyst-14", "Data Freshness: SLA Violation Investigation for Real-Time Inventory Updates", "Diagnose CDC (Change Data Capture) lag in Debezium connector to warehouse."),
    ("data-analyst-15", "Dimensional Modeling: Implementing SCD-2 for Customer Subscription Tier Changes", "Build slowly changing dimension table tracking valid_from and valid_to timestamps."),
    ("data-analyst-16", "Marketing Mix: Multi-Touch Attribution Model Divergence Investigation", "Compare First-Touch, Last-Touch, and Linear attribution models across ad campaigns."),
    ("data-analyst-17", "Data Quality: Establishing Automated Great Expectations Assertions in CI", "Configure automated schema tests asserting non-null constraints on order IDs."),
    ("data-analyst-18", "Cohort Heatmap: Diagnosing Sudden Day-7 Drop-off in Android App Users", "Investigate push notification permission prompt changes causing day-7 retention dip."),
    ("data-analyst-19", "Operational BI: Designing a Real-Time SRE Incident SLA Response Dashboard", "Build SQL rollup tracking MTTA (Mean Time to Acknowledge) and MTTR (Mean Time to Resolve)."),
    ("data-analyst-20", "Analytics Strategy: Quarter-End Data Accuracy Sign-Off & Governance Audit", "Conduct cross-departmental audit certifying metric definitions for financial filings.")
]


def create_mission_dict(mission_id, track_id, mission_type, title, brief, difficulty="Mid-Level Specialist"):
    return {
        "id": mission_id,
        "track_id": track_id,
        "type": mission_type,
        "difficulty": difficulty,
        "estimated_time_mins": 35 if mission_type == "guided" else 45,
        "title": title,
        "problem_brief": brief,
        "metadata": {
            "track": track_id,
            "category": "Guided Simulation" if mission_type == "guided" else "Independent Production Lab",
            "tier": "Tier-1 Production"
        },
        "evidence_tabs": [
            {
                "id": "timeline",
                "label": "Incident Timeline",
                "type": "timeline",
                "items": [
                    {"time": "00:00 UTC", "event": "Baseline metrics normal; telemetry within expected SLO bounds."},
                    {"time": "00:15 UTC", "event": f"Automated monitoring alert triggers for {title}."},
                    {"time": "00:20 UTC", "event": "On-call specialist acknowledges alert and initiates investigation."},
                    {"time": "00:30 UTC", "event": "Engineering war room opened; telemetry and diagnostic logs collected."}
                ]
            },
            {
                "id": "telemetry",
                "label": "Telemetry & Metrics",
                "type": "telemetry",
                "summary": {
                    "health_status": "Degraded",
                    "anomaly_detected": title,
                    "target_service": f"prod-{track_id}-core",
                    "sli_compliance": "Violation (Below 99.9% Target)"
                }
            },
            {
                "id": "logs",
                "label": "System Logs",
                "type": "logs",
                "entries": [
                    {"timestamp": "00:15:02 UTC", "level": "WARN", "message": f"Anomaly threshold crossed in {track_id} subsystem."},
                    {"timestamp": "00:18:22 UTC", "level": "ERROR", "message": f"Operation failure: {brief[:80]}..."},
                    {"timestamp": "00:22:45 UTC", "level": "INFO", "message": "Diagnostics captured. Awaiting engineer remediation plan."}
                ]
            },
            {
                "id": "runbook",
                "label": "Operating Runbook",
                "type": "markdown",
                "content": f"### Operational Runbook & SOP: {title}\n\n**Standard Operating Procedure:**\n1. Confirm symptom against live metrics and logs.\n2. Execute immediate safe mitigation to protect customer SLA.\n3. Formulate verifiable hypothesis distinguishing verified facts from unverified assumptions.\n4. Define health verification criteria.\n5. Document permanent prevention action."
            }
        ],
        "submission_fields": [
            {
                "id": "incident_timeline",
                "label": "1. Timeline & Impact Assessment",
                "placeholder": "Summarize what occurred, timestamps, and customer or data impact...",
                "guidance": "Include start time, affected systems, and severity."
            },
            {
                "id": "hypothesis",
                "label": "2. Root Cause Hypothesis (Facts vs Assumptions)",
                "placeholder": "What caused the issue? Clearly state what is proven by evidence vs working assumptions...",
                "guidance": "Reference specific evidence items, logs, or metrics."
            },
            {
                "id": "safe_mitigation_plan",
                "label": "3. Immediate Safe Mitigation Plan",
                "placeholder": "What immediate action should be taken right now according to SOP?",
                "guidance": "Consult the Runbook for approved remediation commands."
            },
            {
                "id": "verification_steps",
                "label": "4. Verification & Health Confirmation",
                "placeholder": "How will you confirm normal healthy state before closing the incident?",
                "guidance": "Define exact metrics, observation windows, and test queries."
            },
            {
                "id": "follow_up_improvement",
                "label": "5. Preventative Hardening",
                "placeholder": "What long-term architectural or process fix prevents recurrence?",
                "guidance": "Consider automated CI/CD gates, alerts, or architectural decoupling."
            }
        ],
        "rubric": {
            "dimensions": [
                {
                    "id": "evidence_accuracy",
                    "name": "Evidence Accuracy",
                    "weight": 25,
                    "criteria": f"Accurately references the problem details for {title}, recognizing the core failure symptoms and evidence logs."
                },
                {
                    "id": "plausibility_and_distinction",
                    "name": "Root Cause Plausibility",
                    "weight": 25,
                    "criteria": "Distinguishes facts directly supported by logs/metrics from unproven working assumptions."
                },
                {
                    "id": "safety_and_constraints",
                    "name": "Safe Mitigation Strategy",
                    "weight": 25,
                    "criteria": "Proposes safe, controlled remediation adhering to runbook SOP without introducing secondary outages."
                },
                {
                    "id": "verification_and_followup",
                    "name": "Verification & Prevention",
                    "weight": 25,
                    "criteria": "Specifies concrete telemetry verification criteria and a durable architectural improvement."
                }
            ]
        }
    }


def generate_all_missions():
    MISSIONS_DIR.mkdir(parents=True, exist_ok=True)
    generated_count = 0

    # 1. 20 Guided Missions for Software Developer
    for m_id, title, brief in SWE_GUIDED_SPECS:
        path = MISSIONS_DIR / f"{m_id}.json"
        # Preserve existing swe-01 and swe-02 rich files if they exist, but ensure type is guided
        if path.is_file():
            existing = json.loads(path.read_text(encoding="utf-8"))
            existing["type"] = "guided"
            existing["track_id"] = "software-developer"
            path.write_text(json.dumps(existing, indent=2), encoding="utf-8")
        else:
            m_dict = create_mission_dict(m_id, "software-developer", "guided", title, brief)
            path.write_text(json.dumps(m_dict, indent=2), encoding="utf-8")
        generated_count += 1

    # 2. 20 Guided Missions for Cloud Engineer
    for m_id, title, brief in CLOUD_GUIDED_SPECS:
        path = MISSIONS_DIR / f"{m_id}.json"
        if path.is_file():
            existing = json.loads(path.read_text(encoding="utf-8"))
            existing["type"] = "guided"
            existing["track_id"] = "cloud-engineer"
            path.write_text(json.dumps(existing, indent=2), encoding="utf-8")
        else:
            m_dict = create_mission_dict(m_id, "cloud-engineer", "guided", title, brief)
            path.write_text(json.dumps(m_dict, indent=2), encoding="utf-8")
        generated_count += 1

    # 3. 20 Guided Missions for Data Analyst
    for m_id, title, brief in DATA_GUIDED_SPECS:
        path = MISSIONS_DIR / f"{m_id}.json"
        if path.is_file():
            existing = json.loads(path.read_text(encoding="utf-8"))
            existing["type"] = "guided"
            existing["track_id"] = "data-analyst"
            path.write_text(json.dumps(existing, indent=2), encoding="utf-8")
        else:
            m_dict = create_mission_dict(m_id, "data-analyst", "guided", title, brief)
            path.write_text(json.dumps(m_dict, indent=2), encoding="utf-8")
        generated_count += 1

    # 4. 50 Independent Missions for each of the 3 roles (150 total)
    roles = [
        ("software-developer", "swe-indep", "Software Developer Independent Production Challenge"),
        ("cloud-engineer", "cloud-indep", "Cloud Engineer Independent Infrastructure Incident"),
        ("data-analyst", "data-indep", "Data Analyst Independent Analytics Audit"),
    ]

    for track_id, prefix, desc in roles:
        for i in range(1, 51):
            m_id = f"{prefix}-{i:02d}"
            path = MISSIONS_DIR / f"{m_id}.json"
            title = f"{desc} #{i:02d}"
            brief = f"Autonomous production simulation for {track_id}: Investigate telemetry anomaly #{i}, formulate hypothesis, define safe mitigation, and provide verification criteria."
            m_dict = create_mission_dict(m_id, track_id, "independent", title, brief, difficulty="Senior Specialist")
            path.write_text(json.dumps(m_dict, indent=2), encoding="utf-8")
            generated_count += 1

    print(f"Successfully generated/verified {generated_count} total missions in {MISSIONS_DIR}.")


if __name__ == "__main__":
    generate_all_missions()
