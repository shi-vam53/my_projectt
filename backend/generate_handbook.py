"""Generate the 12-page Praxis Industry Foundations & Engineering Handbook PDF.

Uses ReportLab Platypus to produce a clean, publication-grade document covering:
- Organizational hierarchy & stakeholder communication
- Agile & sprint operations
- Git hygiene, PR etiquette & code reviews
- Environment tiers (Dev, Stage, Prod, Ephemeral)
- CI/CD, canary releases & feature flags
- Observability: Metrics, Structured Logging, Distributed Tracing
- SRE, SLOs, Error Budgets & Incident Response
- Production security, Zero Trust & compliance
- 40+ vital industry keywords & acronyms
- The First 90-Days Junior Engineer Playbook
"""

from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
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
            self.drawRightString(612 - 54, 750, "Industry Foundations & Production Handbook")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 612 - 54, 744)

        # Footer (All pages)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 38, "CONFIDENTIAL & PROPRIETARY — PRAXIS ENGINEERING FOUNDATION")
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(612 - 54, 38, page_str)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)

        self.restoreState()


def build_handbook_pdf(output_path: Path) -> int:
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
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#0f172a"),
        alignment=0,
    )
    subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#4338ca"),
        alignment=0,
    )
    h1_style = ParagraphStyle(
        "ChapterHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=10,
    )
    h2_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=8,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )
    bullet_style = ParagraphStyle(
        "BulletText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b"),
        leftIndent=14,
        spaceAfter=4,
    )
    callout_style = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#312e81"),
    )
    code_inline_style = ParagraphStyle(
        "CodeTerm",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f766e"),
    )

    story = []

    def make_callout(text: str, bg_color="#eef2ff", border_color="#6366f1"):
        p = Paragraph(text, callout_style)
        t = Table([[p]], colWidths=[504])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(bg_color)),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor(border_color)),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ]))
        return t

    # --------------------------------------------------------------------------
    # PAGE 1: COVER & EXECUTIVE ORIENTATION
    # --------------------------------------------------------------------------
    story.append(Spacer(1, 30))
    story.append(Paragraph("PRAXIS ENGINEERING MANUAL", ParagraphStyle("Label", fontName="Helvetica-Bold", fontSize=11, textColor=colors.HexColor("#4f46e5"), leading=14)))
    story.append(Spacer(1, 8))
    story.append(Paragraph("The Production Engineering & Industry Foundations Handbook", title_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("A Practitioner's Guide to Corporate Software Engineering, Culture, and Operations", subtitle_style))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#4f46e5"), spaceAfter=14))

    story.append(Paragraph(
        "<b>Executive Overview:</b> Theoretical computer science curricula teach data structures, algorithms, and toy programming assignments in isolated environments where code is written once and submitted for grading. In contrast, corporate production engineering takes place within living distributed systems where software must handle continuous traffic, concurrent deployments, unexpected outages, strict regulatory compliance, and multi-team collaboration.",
        body_style,
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "This handbook bridges the gap between university theory and day-one workplace execution. As an engineer entering Praxis, you will learn the mental models, vocabulary, standards, and operational rituals required to ship reliable code, handle on-call responsibilities, collaborate across disciplines, and safeguard customer data.",
        body_style,
    ))
    story.append(Spacer(1, 10))

    story.append(make_callout(
        "<b>The Praxis Core Tenet:</b> In production, code clarity, observability, automated verification, and safe rollback mechanisms matter far more than clever or unreadable hacks. A bug in staging is a routine learning event; an unmitigated error in production damages customer trust and brand equity.",
        "#f8fafc", "#cbd5e1"
    ))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Handbook Structure & Progression:</b>", h2_style))
    chapters = [
        ("Section 1: Organizational Topology", "Engineering structures, RACI matrices, and functional cross-collaboration."),
        ("Section 2: The Agile Lifecycle", "Sprints, backlog refinement, user story estimation, and ticket states."),
        ("Section 3: Professional Version Control", "Trunk-based development, semantic commits, and pull request hygiene."),
        ("Section 4: Environment Tiers & Isolation", "Dev, QA, Staging, Ephemeral, and Production boundaries."),
        ("Section 5: CI/CD & Safe Deployments", "Automated gates, Canary releases, Blue/Green, and feature flagging."),
        ("Section 6: Observability (Logs, Metrics, Traces)", "Telemetry instrumentation, distributed tracing, and p99 profiling."),
        ("Section 7: SRE, SLOs & Incident Response", "SLAs, error budgets, SEV categorization, and blameless postmortems."),
        ("Section 8: Enterprise Security & Compliance", "Least Privilege, Zero Trust, OWASP principles, and data privacy."),
        ("Sections 9-10: Essential Industry Lexicon", "40+ mission-critical architectural and operational acronyms decoded."),
        ("Section 11: The First 90 Days Playbook", "Concrete habits for unblocking yourself and thriving in engineering teams."),
    ]
    chap_table_data = [[Paragraph(f"<b>{title}</b>", body_style), Paragraph(desc, body_style)] for title, desc in chapters]
    chap_table = Table(chap_table_data, colWidths=[180, 324])
    chap_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
    ]))
    story.append(chap_table)

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 2: TECH ORGANIZATION TOPOLOGY
    # --------------------------------------------------------------------------
    story.append(Paragraph("01. Modern Engineering Organization Topology", h1_style))
    story.append(Paragraph(
        "Software in high-growth companies is built by cross-functional teams rather than isolated individuals. Understanding who owns which decisions prevents friction, accelerates feature delivery, and ensures accountability.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    roles = [
        ("Engineering Manager (EM)", "People manager focused on career growth, team capacity, sprint velocity, unblocking bottlenecks, and ensuring psychological safety."),
        ("Product Manager (PM)", "Owns the 'Why' and 'What'. Discovers customer needs, writes Product Requirement Documents (PRDs), defines acceptance criteria, and manages feature prioritization."),
        ("Product Designer (UI/UX)", "Designs user flows, wireframes, component design systems (e.g., Figma), conducts usability testing, and verifies accessibility (a11y)."),
        ("Tech Lead / Staff Engineer", "Owns the 'How' and long-term technical architecture. Authors Architecture Decision Records (ADRs), guides senior engineers, and guards system scalability."),
        ("Software Engineer (SWE)", "Writes modular, tested, clean application code, authors pull requests, designs database schemas, and participates in code reviews."),
        ("Site Reliability Engineer (SRE)", "Ensures availability, latency, performance, monitoring, and capacity planning. Builds automated infrastructure and manages deployment pipelines."),
        ("Quality Assurance / SDET", "Automates regression, integration, and performance load tests, validating that releases meet critical business standards."),
        ("Security Operations (SecOps)", "Performs vulnerability scans, static/dynamic code analysis (SAST/DAST), code audits, secret rotation, and incident triage."),
    ]
    role_table_data = [[Paragraph(f"<b>{r[0]}</b>", body_style), Paragraph(r[1], body_style)] for r in roles]
    rt = Table(role_table_data, colWidths=[150, 354])
    rt.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
    ]))
    story.append(rt)
    story.append(Spacer(1, 8))

    story.append(Paragraph("The RACI Framework in Production Decisions", h2_style))
    story.append(Paragraph(
        "Engineering teams use the RACI matrix to clarify roles for key production deliverables: <b>R (Responsible)</b> = The engineer implementing the change; <b>A (Accountable)</b> = The lead who approves and signs off; <b>C (Consulted)</b> = SMEs (DBA, Security, SRE) who provide input; <b>I (Informed)</b> = Stakeholders notified upon rollout.",
        body_style,
    ))
    story.append(Spacer(1, 6))
    story.append(make_callout(
        "<b>Rule of Thumb:</b> Never deploy architectural changes or introduce third-party libraries without consulting your Tech Lead and Security team. Documenting decisions in an ADR saves hundreds of hours of rework.",
        "#f0fdf4", "#22c55e"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 3: THE AGILE DELIVERY ENGINE
    # --------------------------------------------------------------------------
    story.append(Paragraph("02. The Agile Delivery Engine & Work Tracking", h1_style))
    story.append(Paragraph(
        "Modern engineering teams work in 1- to 2-week iterations known as <b>Sprints</b>. Work is organized into backlogs and tracked using tools like Jira, Linear, or GitHub Projects.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("Core Scrum & Kanban Ceremonies", h2_style))
    ceremonies = [
        ("Sprint Planning", "At the beginning of each cycle, the team reviews the backlog, breaks user stories into engineering tasks, and commits to a specific deliverable scope."),
        ("Daily Standup (15 mins)", "Engineers provide three concise updates: (1) What was completed yesterday, (2) What is planned for today, and (3) Any blockers preventing forward progress."),
        ("Backlog Refinement / Grooming", "Engineers and PMs review upcoming feature proposals, clarify ambiguous acceptance criteria, identify dependencies, and assign story points."),
        ("Sprint Retrospective", "A blameless review at sprint conclusion addressing: What went well? What slowed us down? What concrete action items will we implement next cycle?"),
    ]
    for name, desc in ceremonies:
        story.append(Paragraph(f"• <b>{name}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Story Pointing & Estimation (Fibonacci Sequence)", h2_style))
    story.append(Paragraph(
        "Story points measure relative complexity and uncertainty, not literal calendar hours. Common scale: <b>1 point</b> (trivial change, e.g. text copy or config bump), <b>2 points</b> (routine task with clear patterns), <b>3 points</b> (moderate feature with tests), <b>5 points</b> (significant logic spanning multiple components), <b>8+ points</b> (too large; must be decomposed into smaller sub-tasks).",
        body_style,
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Ticket Lifecycle & Status Progression", h2_style))
    story.append(Paragraph(
        "Every production task progresses through a standard workflow: <b>Backlog ➔ In Progress ➔ Pull Request / Code Review ➔ Staging QA ➔ Ready for Deploy ➔ Production Verified ➔ Closed</b>. Moving a ticket prematurely before tests pass or validation completes creates tracking chaos.",
        body_style,
    ))
    story.append(Spacer(1, 6))
    story.append(make_callout(
        "<b>Pro-Tip on Standups:</b> Never say 'I worked on tickets.' State your specific technical goal, such as: 'Yesterday I finished the Redis token cache migration; today I am writing integration tests for the rate limiter. I need a review from @Alex on PR #214.'",
        "#eff6ff", "#3b82f6"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 4: PROFESSIONAL VERSION CONTROL & CODE REVIEWS
    # --------------------------------------------------------------------------
    story.append(Paragraph("03. Version Control Hygiene & Pull Request Etiquette", h1_style))
    story.append(Paragraph(
        "In production teams, Git is not just backup storage; it is the official audit trail of why, when, and how your software evolved.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("Trunk-Based Development vs. Long-Lived Branches", h2_style))
    story.append(Paragraph(
        "High-performing teams practice <b>Trunk-Based Development</b>: engineers create short-lived feature branches (lasting hours to 2 days maximum), rebase frequently onto <code>main</code>, and merge often via automated CI checks. Long-lived feature branches lead to painful merge conflicts ('merge hell') and risky, high-blast-radius releases.",
        body_style,
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Conventional Commit Standards", h2_style))
    story.append(Paragraph("Every commit should follow the Conventional Commits specification:", body_style))
    commits = [
        ("feat(auth):", "Adds a new user-facing capability (e.g. <code>feat(billing): add stripe webhook handler</code>)."),
        ("fix(database):", "Patches an unexpected bug or error (e.g. <code>fix(db): handle connection pool timeout</code>)."),
        ("refactor(api):", "Modifies code structure without altering external behavior or adding features."),
        ("test(gateway):", "Adds missing unit or integration tests without changing application logic."),
        ("chore(deps):", "Routine maintenance, dependency upgrades, or CI config changes."),
    ]
    for tag, desc in commits:
        story.append(Paragraph(f"• <b><code>{tag}</code></b> {desc}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("The Anatomy of a World-Class Pull Request", h2_style))
    story.append(Paragraph(
        "A junior engineer submits a PR with the title 'fixes stuff' and no description. A senior engineer provides complete context: (1) <b>Problem & Context:</b> What Jira ticket does this resolve? (2) <b>Solution Approach:</b> High-level architecture of changes, (3) <b>Verification & Testing:</b> CLI output or screenshots proving it works, and (4) <b>Rollback Plan:</b> What flag or command undoes this if an alert fires in production?",
        body_style,
    ))
    story.append(Spacer(1, 6))

    story.append(make_callout(
        "<b>Code Review Golden Rule:</b> Critique the code, never the person. Use prefixes like <i>'Nit: (optional style tweak)'</i>, <i>'Question: help me understand the concurrency model here'</i>, or <i>'Blocking: this query lacks an index and will table-scan in production.'</i>",
        "#fdf4ff", "#a855f7"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 5: ENVIRONMENT TIERS & ISOLATION
    # --------------------------------------------------------------------------
    story.append(Paragraph("04. Environment Tiers & Infrastructure Parity", h1_style))
    story.append(Paragraph(
        "Code progresses through distinct, isolated runtime environments before reaching paying users. Never test or debug experimental logic in production.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    envs = [
        ("Localhost / Dev Container", "Developer workstation running local servers, mock databases, and unit test suites. Fast feedback loop, zero risk to external data."),
        ("Ephemeral / Preview Env", "On-demand environments spun up automatically for each pull request (e.g. Vercel preview or Kubernetes namespace). Enables PMs and designers to test the branch before merge."),
        ("Staging / UAT (User Acceptance)", "A near-replica of production architecture with sanitised test data, external sandbox APIs (e.g. Stripe test keys), and realistic network latencies. Final gate for regression testing."),
        ("Production (Prod)", "Live environment serving real customer traffic and real financial transactions. Strictly locked down; access requires multi-factor authentication (MFA) and audit logging."),
    ]
    for env, desc in envs:
        story.append(Paragraph(f"• <b>{env}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("The Twelve-Factor App: Config & Environment Parity", h2_style))
    story.append(Paragraph(
        "Never hardcode environment-specific URLs, API keys, or credentials into source code. Store configuration in environment variables injected at deployment time. Code that runs in Staging should be identical (same Docker container image tag) to code deployed to Production; only the injected environment variables differ.",
        body_style,
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Secrets Management Anti-Patterns", h2_style))
    story.append(Paragraph(
        "Accidentally committing an AWS key, JWT secret, or database password to Git is an immediate security incident requiring key revocation. Production secrets must be managed via encrypted vaults (AWS Secrets Manager, HashiCorp Vault, Doppler, or GCP Secret Manager), never stored in plaintext <code>.env</code> files tracked in Git.",
        body_style,
    ))
    story.append(Spacer(1, 6))

    story.append(make_callout(
        "<b>Blast Radius Principle:</b> Design systems so that failures are quarantined. A crash in the notification worker service must never take down the primary authentication or checkout API.",
        "#fffbeb", "#f59e0b"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 6: CI/CD & SAFE DEPLOYMENT STRATEGIES
    # --------------------------------------------------------------------------
    story.append(Paragraph("05. CI/CD Pipelines & Modern Deployment Strategies", h1_style))
    story.append(Paragraph(
        "High-performing engineering teams deploy multiple times per day using automated delivery pipelines that eliminate manual human error.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("Continuous Integration vs. Continuous Delivery vs. Continuous Deployment", h2_style))
    cicd = [
        ("Continuous Integration (CI)", "Automated pipeline that triggers on every commit: runs linters (Ruff, ESLint), static type checkers (mypy, TypeScript), unit test suites, and vulnerability scanners."),
        ("Continuous Delivery (CD)", "Automated generation of verified build artifacts (Docker images, binaries) and automated release to staging, awaiting manual approval before production rollout."),
        ("Continuous Deployment", "Every commit that passes all automated test gates is deployed directly to production without manual intervention. Requires mature observability and automated canary analysis."),
    ]
    for term, desc in cicd:
        story.append(Paragraph(f"• <b>{term}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Zero-Downtime Deployment Patterns", h2_style))
    patterns = [
        ("Rolling Update", "Containers are incrementally replaced one-by-one. The load balancer stops routing to old instances as new healthy instances pass health check probes."),
        ("Blue/Green Deployment", "Two identical production environments exist. 'Blue' serves live traffic. You deploy new version to 'Green'. Once verified, the load balancer router instantly flips traffic from Blue to Green."),
        ("Canary Release", "Route 2% of live traffic to the new version while 98% remains on stable. Monitor error rates, memory usage, and latency for 15 minutes. If metrics remain healthy, ramp to 10%, 50%, and 100%."),
        ("Feature Flags (Dark Launching)", "Code is merged and deployed to production with functionality hidden behind a dynamic toggle (e.g. LaunchDarkly). Allows testing in prod with internal users before turning on globally."),
    ]
    for pat, desc in patterns:
        story.append(Paragraph(f"• <b>{pat}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(make_callout(
        "<b>SOP Standard:</b> Always decouple deployment from feature release. Deploying code (shipping the bytes) should be a low-risk non-event; releasing features to users is controlled independently via feature toggles.",
        "#f0fdf4", "#16a34a"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 7: OBSERVABILITY
    # --------------------------------------------------------------------------
    story.append(Paragraph("06. Production Observability: Telemetry in the Wild", h1_style))
    story.append(Paragraph(
        "You cannot fix what you cannot measure. When an incident occurs at 2:00 AM, observability is the only lens through which engineers understand internal system state.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("The Three Pillars of Observability", h2_style))
    pillars = [
        ("1. Metrics (Aggregated Numerics)", "Numeric measurements collected over time intervals. Key primitives include <b>Counters</b> (monotonically increasing requests), <b>Gauges</b> (current memory in MB), and <b>Histograms</b> (latency distributions). Fast to query, cheap to store."),
        ("2. Structured Logs (Events & Context)", "Structured JSON log entries containing contextual metadata: timestamp, log level (DEBUG, INFO, WARN, ERROR), service name, customer ID, and trace ID. Human-readable and indexable in systems like Datadog, Elasticsearch, or Loki."),
        ("3. Distributed Tracing (Request Journeys)", "Tracks a single user request as it traverses 10+ microservices. Propagates a <code>Trace-ID</code> and child <code>Span-IDs</code> across HTTP/gRPC boundaries to pinpoint exact millisecond bottlenecks."),
    ]
    for pil, desc in pillars:
        story.append(Paragraph(f"{pil}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Why Average Latency is a Trap: p50 vs. p95 vs. p99", h2_style))
    story.append(Paragraph(
        "Never report 'average latency is 40ms'. Averages hide catastrophic outliers. If 99 requests take 10ms but 1 request stalls for 10,000ms, the average is 109ms (which looks acceptable), but 1% of your highest-value customers experienced a total freeze. Production teams monitor <b>p95</b> and <b>p99 percentiles</b> (the maximum latency experienced by 95% and 99% of requests).",
        body_style,
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("The Four Golden Signals (Google SRE)", h2_style))
    signals = [
        ("Latency", "The time taken to service a request, segmented by successful vs. failed requests."),
        ("Traffic", "Demand placed on the system (e.g. HTTP requests per second or network I/O)."),
        ("Errors", "Rate of failed requests (e.g. HTTP 5xx responses or uncaught exceptions)."),
        ("Saturation", "How full the service is (e.g. CPU utilization, DB pool connection exhaustion)."),
    ]
    for sig, desc in signals:
        story.append(Paragraph(f"• <b>{sig}:</b> {desc}", bullet_style))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 8: RELIABILITY ENGINEERING & INCIDENTS
    # --------------------------------------------------------------------------
    story.append(Paragraph("07. Reliability Engineering, SLAs & Incident Triage", h1_style))
    story.append(Paragraph(
        "No distributed system achieves 100% uptime. SRE is the discipline of treating operational reliability as a software problem with mathematically defined boundaries.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("SLI, SLO, SLA & Error Budgets", h2_style))
    sre_terms = [
        ("Service Level Indicator (SLI)", "A quantifiable metric of service performance (e.g. '% of HTTP requests returning < 200ms without 5xx errors')."),
        ("Service Level Objective (SLO)", "The target reliability goal agreed upon by engineering and product (e.g. '99.9% of requests succeed over a rolling 30-day window')."),
        ("Service Level Agreement (SLA)", "The formal legal contract with customers specifying financial penalties or credits if the service breaches reliability thresholds (e.g. 99.5%)."),
        ("Error Budget", "The permissible downtime or failure rate (100% - SLO). For a 99.9% SLO, you have an error budget of 0.1% (approx. 43 minutes of downtime per month). When the error budget is exhausted, feature deployments freeze and all focus shifts to reliability bugs."),
    ]
    for st, desc in sre_terms:
        story.append(Paragraph(f"• <b>{st}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Incident Severity Levels & On-Call Protocol", h2_style))
    sevs = [
        ("SEV-1 (Critical Outage)", "Complete core system failure affecting all users (e.g. payment processing down). Requires immediate all-hands war room, updates every 15 minutes to executive leadership."),
        ("SEV-2 (Major Degradation)", "High-impact issue affecting a substantial subset of customers with no immediate workaround (e.g. mobile app search returning 500 errors)."),
        ("SEV-3 (Minor Incident)", "Non-critical feature broken or workaround available (e.g. export CSV failing for certain accounts). Handled during normal business hours."),
    ]
    for sev, desc in sevs:
        story.append(Paragraph(f"• <b>{sev}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(make_callout(
        "<b>The Blameless Postmortem:</b> When things break, never ask 'Who caused this?' Ask 'What systemic failure allowed a human error to bypass our safeguards?' Human error is never the root cause; lack of automated validation, poor runbooks, or missing rollback safety is.",
        "#fdf2f8", "#ec4899"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 9: ENTERPRISE SECURITY & COMPLIANCE
    # --------------------------------------------------------------------------
    story.append(Paragraph("08. Enterprise Security, Zero Trust & Compliance", h1_style))
    story.append(Paragraph(
        "Security is not a department; it is a fundamental property of every line of code you commit. Modern architectures assume the network is already hostile.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("Fundamental Security Principles", h2_style))
    principles = [
        ("Principle of Least Privilege (PoLP)", "A service, database user, or human engineer should possess only the absolute minimum permissions necessary to perform their specific job—nothing more. Avoid granting <code>admin</code> or <code>root</code> roles."),
        ("Zero Trust Architecture", "Never trust internal network boundaries. Authenticate and authorize every single inter-service request using mutual TLS (mTLS) and cryptographically signed tokens (JWTs)."),
        ("Defense in Depth", "Layer multiple defense mechanisms: WAF rate limiting at the edge, input sanitization in the API layer, parameterized queries at the ORM layer, and disk encryption at rest."),
        ("Sanitize All Inputs (OWASP Top 10)", "Never concatenate strings into SQL queries. Always use parameterized queries or trusted ORMs. Sanitize user-generated content to prevent Cross-Site Scripting (XSS)."),
    ]
    for prin, desc in principles:
        story.append(Paragraph(f"• <b>{prin}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Personally Identifiable Information (PII) & Compliance", h2_style))
    story.append(Paragraph(
        "Regulatory standards such as GDPR, HIPAA, and SOC 2 mandate strict treatment of customer data. Never log passwords, credit card numbers, social security numbers, or sensitive medical information in application logs. Ensure databases support customer data deletion requests ('Right to be Forgotten').",
        body_style,
    ))
    story.append(Spacer(1, 6))

    story.append(make_callout(
        "<b>Security Golden Rule:</b> If you discover a security vulnerability or active exploit in production, do not discuss it in public Slack channels. Immediately escalate to your company's dedicated incident response team (e.g. #sec-ops-private) according to your security handbook.",
        "#fef2f2", "#ef4444"
    ))

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 10: INDUSTRY LEXICON - ARCHITECTURAL TERMS
    # --------------------------------------------------------------------------
    story.append(Paragraph("09. The Essential Industry Lexicon (Architectural)", h1_style))
    story.append(Paragraph(
        "Every production team uses domain jargon. Master these 20 architectural and infrastructure terms to navigate technical design reviews with confidence.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    lexicon_arch = [
        ("Idempotency", "Property where an operation can be applied multiple times without changing the result beyond the initial application (crucial for payment APIs and webhook retries)."),
        ("Circuit Breaker", "Design pattern that halts requests to a failing downstream service after a threshold of errors, preventing cascading resource exhaustion across the cluster."),
        ("Eventual Consistency", "Database consistency model where all replicas will eventually yield the same value, but immediate reads right after write may return slightly stale data."),
        ("Dead Letter Queue (DLQ)", "A secondary queue holding messages that failed processing after maximum retry attempts, allowing manual inspection and replay without losing data."),
        ("Backpressure", "Mechanism where a downstream consumer signals an upstream producer to slow down message rate when internal buffers are nearing capacity."),
        ("CDN (Content Delivery Network)", "Geographically distributed network of edge proxy servers caching static assets (images, JS) near end-users to reduce origin server load."),
        ("WAF (Web Application Firewall)", "Edge security filter protecting APIs against common web exploits such as SQL injection, cross-site scripting, and bot scraping floods."),
        ("Rate Limiting & Throttling", "Restricting the number of requests a client can make in a given timeframe (e.g., Token Bucket algorithm allowing max 100 req/min)."),
        ("Database Connection Pooling", "Maintaining a cache of open database connections (e.g., HikariCP, PgBouncer) so queries reuse existing connections rather than paying high TCP handshake costs."),
        ("Write-Ahead Logging (WAL)", "Technique where database modifications are recorded to append-only disk logs before writing to data files, guaranteeing ACID durability upon crash."),
    ]
    lex_table_data = [[Paragraph(f"<b>{k[0]}</b>", code_inline_style), Paragraph(k[1], body_style)] for k in lexicon_arch]
    lt = Table(lex_table_data, colWidths=[140, 364])
    lt.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
    ]))
    story.append(lt)

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 11: INDUSTRY LEXICON - OPERATIONAL & CULTURAL TERMS
    # --------------------------------------------------------------------------
    story.append(Paragraph("10. The Essential Industry Lexicon (Operations & Culture)", h1_style))
    story.append(Paragraph(
        "Engineering culture has its own distinct operational vernacular. Understanding these terms will help you decode everyday Slack conversations, tickets, and team retrospectives.",
        body_style,
    ))
    story.append(Spacer(1, 4))

    lexicon_ops = [
        ("Technical Debt ('Tech Debt')", "The implied cost of additional rework caused by choosing an easy or shortcut solution now instead of a better, scalable approach."),
        ("Yak Shaving", "A chain of seemingly unrelated, tedious micro-tasks you must complete before you can make progress on your original engineering goal."),
        ("Bike-Shedding", "The tendency of teams to spend disproportionate time debating minor, trivial details (like button color) while ignoring difficult, vital architectural issues."),
        ("Bus Factor", "The minimum number of team members that, if suddenly unavailable (e.g. hit by a bus), would stall the project due to undocumented institutional knowledge."),
        ("Runbook / SOP", "A step-by-step Standard Operating Procedure document detailing exact commands and steps to diagnose, mitigate, and resolve common production failure modes."),
        ("MTTR & MTTD", "<b>Mean Time to Detect (MTTD):</b> Time between incident onset and alert firing. <b>Mean Time to Resolve (MTTR):</b> Time from alert to full system restoration."),
        ("RCA (Root Cause Analysis)", "Formal investigation determining the foundational systemic vulnerabilities that triggered an incident, leading to preventive action items."),
        ("Feature Freeze", "A temporary policy period (e.g. Black Friday or holiday peak) where no non-critical code changes are deployed to minimize risk of outages."),
        ("Dark Launch", "Deploying new backend logic to production that handles real shadow traffic silently in the background before exposing the UI to users."),
        ("Graceful Degradation", "System architecture that continues operating with limited functionality when components fail (e.g. Netflix showing default recommendations if ML service dies)."),
    ]
    lex2_table_data = [[Paragraph(f"<b>{k[0]}</b>", code_inline_style), Paragraph(k[1], body_style)] for k in lexicon_ops]
    lt2 = Table(lex2_table_data, colWidths=[140, 364])
    lt2.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#f1f5f9")),
    ]))
    story.append(lt2)

    story.append(PageBreak())

    # --------------------------------------------------------------------------
    # PAGE 12: THE FIRST 90 DAYS BLUEPRINT
    # --------------------------------------------------------------------------
    story.append(Paragraph("11. The First 90 Days Survival & Acceleration Guide", h1_style))
    story.append(Paragraph(
        "Transitioning from academic coursework to corporate production engineering can feel overwhelming. Follow these five high-leverage principles to establish credibility quickly:",
        body_style,
    ))
    story.append(Spacer(1, 4))

    tips = [
        ("The 30-Minute Rule for Being Stuck", "When blocked on an issue: spend 30 minutes researching logs, searching the codebase, and reading internal documentation. If still stuck after 30 minutes, ask for help! When asking, document: (1) What you are trying to accomplish, (2) What you tried, (3) The exact error message, and (4) Your current hypothesis."),
        ("Improve Documentation as You Onboard", "As a newcomer, you have fresh eyes. When you encounter out-of-date README steps or missing local setup scripts, submit a pull request fixing them immediately. Your teammates will appreciate it."),
        ("Read Code 3x More Than You Write", "Before implementing a new feature or endpoint, inspect how three existing endpoints in the codebase handle error validation, database transactions, and logging. Follow established project conventions."),
        ("Ship Small, High-Frequency Pull Requests", "Avoid working in isolation for two weeks and dumping a 2,000-line PR on your teammates. Break tasks into clean, logical PRs of 150-300 lines. They get reviewed in minutes and carry much lower deployment risk."),
        ("Own Your Outages and Mistakes", "Every senior engineer has broken production at least once. If your PR triggers an alert, don't hide it or make excuses. Acknowledge it immediately in the incident channel, trigger a rollback, and assist in authoring the blameless postmortem."),
    ]
    for title, desc in tips:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))
    story.append(make_callout(
        "<b>Welcome to Praxis:</b> You are now ready to take your Industry Readiness Assessment (5 MEQ Evaluation Questions) and begin tackling real production engineering missions. Strive for excellence, embrace blameless learning, and build systems that stand the test of scale.",
        "#eef2ff", "#4f46e5"
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    return 12


if __name__ == "__main__":
    out = Path(__file__).resolve().parents[1] / "frontend" / "assets" / "Praxis_Industry_Foundations_Handbook.pdf"
    pages = build_handbook_pdf(out)
    print(f"Generated handbook at {out} with {pages} pages.")
