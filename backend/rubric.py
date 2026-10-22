"""Deterministic, evidence-oriented rubric scoring for WorkSim missions.

The evaluator is deliberately transparent: each mission's own rubric dimensions
are scored with explicit, inspectable keyword/signal checks. It does not claim to
replace a human reviewer or an LLM-based semantic review.
"""

from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Any, Iterable


@dataclass(frozen=True)
class RubricCheck:
    """One inspectable scoring signal.

    Each item in ``pattern_groups`` is a semantic signal, and patterns within a
    group are alternatives. A check can therefore receive partial credit when a
    response addresses some, but not all, of its requested signals.
    """

    id: str
    criterion: str
    pattern_groups: tuple[tuple[str, ...], ...]
    strength: str
    improvement: str
    weight: float = 1.0

    def score(self, answer_text: str) -> float:
        if not self.pattern_groups:
            return 0.0
        matched = 0
        for alternatives in self.pattern_groups:
            if any(re.search(pattern, answer_text, flags=re.IGNORECASE | re.DOTALL) for pattern in alternatives):
                matched += 1
        return matched / len(self.pattern_groups)


# Regex helpers are kept readable so that rubric changes can be reviewed as
# content, not hidden in an opaque scoring model.
def _check(
    check_id: str,
    criterion: str,
    groups: Iterable[Iterable[str]],
    strength: str,
    improvement: str,
    weight: float = 1.0,
) -> RubricCheck:
    return RubricCheck(
        id=check_id,
        criterion=criterion,
        pattern_groups=tuple(tuple(group) for group in groups),
        strength=strength,
        improvement=improvement,
        weight=weight,
    )


RULES_BY_DIMENSION: dict[str, tuple[RubricCheck, ...]] = {
    # Cloud SRE: anchor the report in the actual incident, then assess reasoning,
    # the runbook-safe action, quantitative verification, and prevention.
    "evidence_accuracy": (
        _check(
            "incident_timestamps",
            "References at least one concrete UTC incident timestamp.",
            ((r"\b14:(?:05|10|1[2-5]|18)\b",),),
            "You anchored the timeline to a concrete timestamp from the incident evidence.",
            "Add an exact UTC timestamp (for example, 14:10, 14:14, or 14:15) so the sequence is auditable.",
        ),
        _check(
            "log_or_error_signal",
            "Cites a specific application log, pool signal, or HTTP error.",
            ((
                r"HikariPool",
                r"connection is not available",
                r"DB connection pool exhausted",
                r"pool.{0,24}(?:exhaust|saturat|100)",
                r"active\s*:\s*100",
                r"waiting\s*:\s*42",
                r"504(?:\s+Gateway)?",
                r"upstream timeout",
            ),),
            "You cited a concrete log or error signal rather than relying only on a general description.",
            "Quote a specific error or pool statistic, such as HikariPool exhaustion, Active: 100, Waiting: 42, or the 504 timeout.",
        ),
        _check(
            "release_and_change",
            "Connects the release to the synchronous audit-logging change.",
            (
                (r"\bv?2\.4\.0\b", r"9fa812c"),
                (r"persistSyncAuditLog", r"synchronous.{0,20}audit", r"sync.{0,20}audit", r"audit.{0,20}synchronous"),
            ),
            "You linked release v2.4.0 / its audit-logging change to the regression.",
            "Name the deployed release and the synchronous persistSyncAuditLog audit write called out in the diff.",
        ),
        _check(
            "quantitative_impact",
            "Includes a mission-specific latency, error-rate, or pool metric.",
            ((
                r"4[,.]?850\s*ms",
                r"8\.7\s*%",
                r"p99.{0,30}(?:4[,.]?850|4850)",
                r"98\s*%?.{0,20}(?:pool|connection)",
                r"504\s+Gateway",
            ),),
            "You included a quantitative impact signal from the telemetry.",
            "Include a key measured impact, such as p99 at 4,850 ms, 8.7% 504s, or 98% pool saturation.",
        ),
    ),
    "plausibility_and_distinction": (
        _check(
            "causal_chain",
            "Explains how synchronous audit logging in the payment path can exhaust the DB connection pool.",
            (
                (r"synchron|\bsync\b",),
                (r"audit",),
                (r"connection pool|HikariPool|pool.{0,20}(?:exhaust|saturat)|pool",),
            ),
            "You connected synchronous audit logging to connection-pool pressure as a plausible causal chain.",
            "Spell out the causal chain: synchronous audit writes block the payment path and consume the constrained connection pool.",
        ),
        _check(
            "facts_identified",
            "Separates observed facts from interpretation.",
            ((r"\bfacts?\b", r"observed", r"confirmed", r"logs? show", r"evidence shows"),),
            "You explicitly identified observations supported by the logs or metrics.",
            "Label the directly observed log or metric facts separately from your causal interpretation.",
        ),
        _check(
            "assumptions_identified",
            "Labels unverified assumptions or hypotheses.",
            ((r"\bassumptions?\b", r"unverified", r"hypothes", r"not confirmed", r"cannot confirm", r"unknown"),),
            "You marked at least one causal detail as an assumption or something still to verify.",
            "Call out what is not yet proven—for example, whether database CPU or disk I/O contributed.",
        ),
        _check(
            "release_correlation",
            "Connects the timing of the release with the incident without overstating unproven causes.",
            (
                (r"v?2\.4\.0|release",),
                (r"after|following|since|correlat|deployment|deployed",),
            ),
            "You connected the regression to the recent deployment while leaving room to verify the causal mechanism.",
            "Explicitly connect the 14:10 release to the 14:14–14:15 degradation, and avoid presenting unverified details as facts.",
        ),
    ),
    "safety_and_constraints": (
        _check(
            "runbook_safe_action",
            "Recommends the documented rollback or synchronous-audit feature-flag action.",
            ((
                r"\broll(?:\s|-)?back\b",
                r"release[- ]?v?2\.3\.9",
                r"\bv2\.3\.9\b",
                r"ENABLE_SYNC_AUDIT_LOG\s*=\s*false",
                r"(?:disable|turn off|set).{0,50}(?:sync|audit|ENABLE_SYNC_AUDIT_LOG)",
            ),),
            "You chose a runbook-aligned rollback or feature-flag mitigation.",
            "Choose the documented rollback to v2.3.9 or set Consul ENABLE_SYNC_AUDIT_LOG=false; avoid an untested production hotfix.",
        ),
        _check(
            "runbook_constraints",
            "Shows awareness of the runbook and operational guardrails.",
            ((
                r"runbook",
                r"Consul",
                r"helm rollback",
                r"approval|approved|change control",
                r"do not restart|don't restart|avoid.{0,20}restart",
                r"do not increase|don't increase|avoid.{0,20}increase.{0,20}pool",
                r"no untested hotfix|avoid.{0,20}hotfix|not.{0,20}hotfix",
            ),),
            "You acknowledged the runbook or a relevant production safety constraint.",
            "State the relevant runbook guardrail (no database-primary restart or unsafe pool increase without approval).",
        ),
    ),
    "verification_and_followup": (
        _check(
            "p99_threshold",
            "Defines the p99 recovery target below 150 ms.",
            ((
                r"p99.{0,30}(?:<|under|below|less than)\s*150\s*ms",
                r"(?:<|under|below|less than)\s*150\s*ms.{0,30}p99",
                r"p99.{0,30}150\s*ms.{0,20}(?:target|threshold|baseline|recover|healthy)",
            ),),
            "You gave a specific p99 recovery threshold.",
            "Set a measurable p99 target of less than 150 ms and name the dashboard or service scope to watch.",
        ),
        _check(
            "error_rate_threshold",
            "Defines the 5xx recovery target below 0.05% (or an equivalent zero-error target).",
            ((
                r"(?:5xx|error rate).{0,35}(?:<|under|below|less than)\s*0\.05\s*%",
                r"(?:5xx|error rate).{0,35}(?:0(?:\.0+)?\s*%|zero)",
                r"(?:<|under|below|less than)\s*0\.05\s*%.{0,35}(?:5xx|error rate)",
            ),),
            "You defined a quantitative error-rate recovery target.",
            "Specify a 5xx target below 0.05% (or zero) rather than relying on a qualitative 'errors are down' check.",
        ),
        _check(
            "sustained_observation_window",
            "Requires sustained healthy metrics for at least 15 minutes.",
            ((r"15\s*(?:\+|or more)?\s*(?:minutes?|mins?)\b", r"quarter[- ]hour", r"0\.25\s*hours?"),),
            "You included a sustained observation window before closing the incident.",
            "Require the health thresholds to hold continuously for at least 15 minutes before declaring recovery.",
        ),
        _check(
            "preventive_async_design",
            "Proposes moving audit logging off the synchronous request path.",
            (
                (r"asynchron|\basync\b|background worker|message queue|Kafka",),
                (r"audit|logging|audit event",),
            ),
            "You proposed an actionable asynchronous audit-logging improvement.",
            "Move audit events to an asynchronous worker or durable queue (for example Kafka) and add a regression/load test.",
        ),
    ),

    # Software engineering mission: identify the idempotency/race defect, make
    # the database the concurrency-safe authority, and protect existing users.
    "idempotency_understanding": (
        _check(
            "duplicate_delivery",
            "Identifies Stripe's retry / duplicate delivery for the same event.",
            (
                (r"Stripe|webhook",),
                (r"retry|re-deliver|duplicate|redeliver",),
                (r"evt_109283|event id|event_id|same event",),
            ),
            "You recognized that a network timeout can cause Stripe to redeliver the same event.",
            "Name the duplicate delivery/retry and explain that both requests carry the same Stripe event ID.",
        ),
        _check(
            "missing_idempotency_guard",
            "Finds the removed pre-check and missing database uniqueness protection.",
            (
                (r"findByStripeEventId|pre.?check|already_processed|idempotency guard|idempotent",),
                (r"unique constraint|unique index|UNIQUE|uniqueness",),
            ),
            "You identified both the application-level idempotency gap and the missing unique constraint.",
            "Call out that the pre-check was removed and stripe_event_id has no UNIQUE constraint, so duplicates can be inserted.",
        ),
        _check(
            "concurrent_race",
            "Explains the concurrent race / unawaited async handler behavior.",
            ((r"race condition|concurr|parallel|Promise\.all|unawaited|not awaited|async handlers",),),
            "You explained how concurrent or fire-and-forget processing leaves a race window.",
            "Explain that both deliveries can pass the check before either insert commits, especially with concurrent/unawaited work.",
        ),
    ),
    "architectural_robustness": (
        _check(
            "database_unique_constraint",
            "Adds a database uniqueness constraint on stripe_event_id.",
            ((r"unique constraint|unique index|UNIQUE",), (r"stripe[_ ]event[_ ]id",)),
            "You made the database enforce uniqueness on stripe_event_id.",
            "Add a database-level UNIQUE constraint/index on stripe_event_id so concurrent retries cannot both insert.",
        ),
        _check(
            "atomic_write",
            "Uses an atomic upsert, insert-on-conflict, or transaction for deduplication.",
            ((r"upsert|on conflict|insert.{0,20}conflict|atomic|transaction|serializable",),),
            "You proposed an atomic write path instead of relying on a check-then-insert sequence.",
            "Use an atomic INSERT ... ON CONFLICT/upsert or transaction and treat the duplicate-key result as already processed.",
        ),
        _check(
            "stable_idempotency_key",
            "Uses the Stripe event ID as the idempotency key and acknowledges only after durable handling.",
            ((r"stripe[_ ]event[_ ]id|event id|event_id|evt_109283",), (r"idempotenc|dedup|already processed",)),
            "You used the stable Stripe event ID as the deduplication/idempotency key.",
            "Key idempotency on the Stripe event ID and return success only after the durable write/queue acceptance is confirmed.",
        ),
    ),
    "test_verification": (
        _check(
            "parallel_duplicate_test",
            "Tests two concurrent webhook requests with the same event ID.",
            ((r"parallel|concurr|simultaneous|two requests|two webhooks",), (r"same event|same id|identical|evt_109283|duplicate",)),
            "You described a concurrency test that submits the same event more than once.",
            "Dispatch two parallel webhooks with the same event ID to exercise the race, not just sequential requests.",
        ),
        _check(
            "single_effect_assertion",
            "Asserts exactly one durable payment/side effect after duplicate delivery.",
            ((r"assert|expect|verify|check",), (r"exactly one|one payment|one charge|one receipt|no duplicate|single",)),
            "You specified an assertion that the duplicate event produces only one payment/side effect.",
            "Assert that exactly one payment record and one intended side effect are created, while retries return a safe duplicate response.",
        ),
    ),
    "customer_data_safety": (
        _check(
            "read_only_duplicate_audit",
            "Audits duplicate charges with a read-only query before remediation.",
            ((r"read.only|SELECT|audit query|read-only query",), (r"duplicate|GROUP BY|count\s*\(|stripe_event_id",)),
            "You proposed a read-only, evidence-based audit before touching customer records.",
            "Start with a read-only query grouping payments by customer/event/charge to identify confirmed duplicates.",
        ),
        _check(
            "controlled_refund",
            "Makes refunds targeted, verified, and auditable rather than mass-issued.",
            ((r"refund|remediat",), (r"manual|review|approval|targeted|verified|idempotent|audit log",)),
            "You treated customer remediation as a controlled, auditable action.",
            "Refund only confirmed duplicate transactions after review/approval; keep an audit trail and avoid a blind mass refund.",
        ),
    ),

    # Data-analysis mission: test the stakeholder theory, quantify the segment
    # where the issue lives, and connect it to client-side crash evidence.
    "hypothesis_evaluation": (
        _check(
            "pricing_theory_tested",
            "Explicitly tests/refutes the pricing-change explanation.",
            ((
                r"pricing.{0,45}(?:not|does not|doesn't|unlikely|unsupported|refut|not explain|weak explanation)",
                r"(?:not|does not|doesn't|unlikely|refut).{0,35}pricing",
                r"pricing (?:change|theory|hypothesis).{0,35}(?:false|unsupported|not the cause)",
            ),),
            "You evaluated the VP's pricing hypothesis instead of accepting it without testing.",
            "State whether the pricing theory is supported; the cross-platform data points to a platform-specific issue, not a global price effect.",
        ),
        _check(
            "cross_platform_contrast",
            "Contrasts stable desktop/Android results with the isolated iOS regression.",
            ((r"desktop|web",), (r"android",), (r"iOS",), (r"only|isolated|platform|stable|while|whereas|contrast",)),
            "You used the unaffected platforms as a comparison group to challenge the global pricing explanation.",
            "Compare stable Desktop and Android conversions with the isolated iOS v4.3 collapse.",
        ),
    ),
    "segmentation_depth": (
        _check(
            "desktop_conversion",
            "Quotes the stable desktop conversion rate around 5%.",
            ((r"desktop|web",), (r"5\.[234]\s*%|~?5\s*%",)),
            "You quantified desktop as stable at approximately 5% conversion.",
            "Include the desktop baseline/current rate (about 5.2% to 5.3%) as a stable comparison.",
        ),
        _check(
            "android_conversion",
            "Quotes the stable Android conversion rate around 4.3%.",
            ((r"android",), (r"4\.[34]\s*%|stable",)),
            "You quantified Android as stable around 4.3%.",
            "Include the Android rate (4.4% to 4.3%) to show the drop is not broad-based.",
        ),
        _check(
            "ios_conversion",
            "Quotes iOS v4.3 collapsing from 4.6% to 0.4%.",
            ((r"iOS",), (r"v?4\.3",), (r"0\.4\s*%?",), (r"4\.6\s*%?",)),
            "You quantified the iOS v4.3 conversion collapse to 0.4% from a 4.6% baseline.",
            "State the iOS v4.3 change explicitly: 4.6% to 0.4%.",
        ),
    ),
    "technical_acumen": (
        _check(
            "applepay_crash",
            "Identifies the Apple Pay checkout crash on iOS v4.3.",
            ((r"iOS",), (r"v?4\.3",), (r"Apple\s?Pay|ApplePay",), (r"crash|fatal|terminated|exception",)),
            "You connected the regression to an Apple Pay crash in the affected iOS release.",
            "Name the Apple Pay checkout crash and tie it to iOS v4.3.",
        ),
        _check(
            "postal_code_nil_root_cause",
            "Names the nil/unwrapped postal-code field from the fatal log.",
            ((r"shipping_contact_postal_code|postal.?code",), (r"nil|null|unwrapped optional|optional.{0,20}(?:unwrap|nil)|unwrap",)),
            "You identified the shipping-contact postal-code nil-unwrapping failure from the logs.",
            "Cite the nil optional on shipping_contact_postal_code as the technical trigger, not just a generic payment failure.",
        ),
        _check(
            "crash_log_evidence",
            "Anchors the technical diagnosis to the timestamped fatal log.",
            ((r"Oct\s*15|10:22:01|10:24:19",), (r"FATAL|fatal|crash report|log",)),
            "You tied the root cause to a specific timestamped fatal/crash log entry.",
            "Reference the Oct 15 10:22:01 or 10:24:19 fatal log to make the diagnosis traceable.",
        ),
    ),
    "executive_clarity": (
        _check(
            "leadership_summary",
            "Frames the finding clearly for the VP/executive audience.",
            ((r"BLUF|executive summary|leadership|VP of Growth|bottom line|recommendation",),),
            "You presented a leadership-oriented takeaway rather than only raw technical detail.",
            "Lead with a brief executive summary that states the business impact and whether the pricing theory holds.",
        ),
        _check(
            "immediate_action",
            "Gives a concrete, actionable response for mobile/product teams.",
            ((r"hotfix|rollback|roll back|disable.{0,25}Apple.?Pay|Apple.?Pay.{0,25}disable|fallback|workaround|fix",), (r"iOS|mobile|engineering|product|release",)),
            "You proposed a concrete near-term action for the mobile/product teams.",
            "Name an immediate action such as an iOS hotfix/rollback, Apple Pay fallback, or a customer-facing notice, with an owner.",
        ),
        _check(
            "preventive_guardrail",
            "Adds a telemetry, staged-release, or funnel-quality guardrail.",
            ((r"telemetry|instrumentation|alert|funnel|monitor",), (r"staged|canary|cohort|threshold|guardrail|release health|crash.rate",)),
            "You included a preventative telemetry or release-health guardrail.",
            "Add an automated funnel/crash alert and a staged cohort/release-health check to catch this regression earlier.",
        ),
    ),
}


STOPWORDS = {
    "about", "after", "again", "also", "among", "because", "before", "being", "between",
    "both", "could", "does", "each", "from", "have", "into", "more", "most", "other",
    "over", "should", "than", "that", "their", "there", "these", "they", "this", "those",
    "through", "under", "using", "with", "would", "your", "will", "what", "when", "where",
    "which", "while", "into", "does", "need", "requires", "candidate", "clearly", "provide",
    "proposes", "proposed", "mission", "evidence", "specific", "accurately", "directly",
}


def _tokens(text: str) -> list[str]:
    return [
        token.lower()
        for token in re.findall(r"[a-zA-Z][a-zA-Z0-9_]{2,}", text)
        if token.lower() not in STOPWORDS
    ]


def _generic_checks(dimension: dict[str, Any]) -> tuple[RubricCheck, ...]:
    """Graceful fallback for missions that add a rubric dimension later."""
    rubric_text = f"{dimension.get('name', '')} {dimension.get('criteria', '')}"
    salient: list[str] = []
    for token in _tokens(rubric_text):
        if token not in salient:
            salient.append(token)
        if len(salient) == 10:
            break
    token_groups = tuple((rf"\b{re.escape(token)}\w*\b",) for token in salient)
    checks: list[RubricCheck] = []
    if token_groups:
        checks.append(
            _check(
                "rubric_criteria_alignment",
                "Uses key concepts named in this mission's rubric criteria.",
                token_groups,
                "Your response addressed several of the concepts named in the rubric.",
                "Reuse the rubric's key concepts and connect each one to a concrete finding or action.",
                weight=2.0,
            )
        )
    checks.extend(
        (
            _check(
                "evidence_anchor",
                "Grounds claims in measurable or traceable evidence.",
                (
                    (r"timestamp|log|metric|chart|trace|query|release|error|test|record|sample",),
                    (r"\d|%|ms\b|\bUTC\b|\b[A-Z]{2,}\b",),
                ),
                "You included at least one traceable evidence anchor.",
                "Add a named log, metric, timestamp, test, or record rather than making an unsupported claim.",
            ),
            _check(
                "reasoning_and_uncertainty",
                "Explains reasoning and distinguishes certainty where relevant.",
                ((r"because|therefore|indicates|suggests|caus|result|reason",),),
                "You provided a rationale for the conclusion or recommendation.",
                "Explain why the evidence supports your conclusion and label remaining uncertainty.",
            ),
        )
    )
    return tuple(checks)


def _answer_text(answers: dict[str, Any]) -> str:
    parts: list[str] = []
    for key, value in answers.items():
        if isinstance(value, str):
            rendered = value
        elif value is None:
            rendered = ""
        else:
            rendered = str(value)
        parts.append(f"{key.replace('_', ' ')}: {rendered}")
    return "\n".join(parts)


def evaluate_submission(mission: dict[str, Any], answers: dict[str, Any]) -> dict[str, Any]:
    """Score answers against the rubric embedded in a mission JSON document.

    Dimension scores are percentages from 0 to 100. The overall score is the
    weighted mean from the mission's rubric, and every check includes a traceable
    rationale so the result is reviewable instead of a binary right/wrong mark.
    """
    rubric = mission.get("rubric") or {}
    dimensions = rubric.get("dimensions") or []
    if not dimensions:
        raise ValueError(f"Mission {mission.get('id', '<unknown>')} does not define rubric dimensions")

    text = _answer_text(answers)
    evaluated_dimensions: list[dict[str, Any]] = []
    total_weight = sum(max(0.0, float(dimension.get("weight", 0) or 0)) for dimension in dimensions)
    if total_weight <= 0:
        total_weight = float(len(dimensions))

    mission_id = str(mission.get("id", ""))
    is_cloud_sre_01 = mission_id == "cloud-sre-01"

    for dimension in dimensions:
        dimension_id = str(dimension.get("id", "unknown_dimension"))
        if dimension_id in {"evidence_accuracy", "plausibility_and_distinction", "safety_and_constraints", "verification_and_followup"} and not is_cloud_sre_01:
            checks = _generic_checks(dimension)
        else:
            checks = RULES_BY_DIMENSION.get(dimension_id) or _generic_checks(dimension)
        check_results: list[dict[str, Any]] = []
        strengths: list[str] = []
        improvements: list[str] = []
        weighted_score = 0.0
        check_weight_total = 0.0

        for check in checks:
            ratio = max(0.0, min(1.0, check.score(text)))
            weight = max(0.0, float(check.weight))
            weighted_score += ratio * weight
            check_weight_total += weight
            status = "met" if ratio >= 0.999 else "partial" if ratio > 0 else "not_met"
            if ratio >= 0.999:
                strengths.append(check.strength)
                feedback = check.strength
            else:
                improvements.append(check.improvement)
                feedback = check.improvement
                if ratio > 0:
                    feedback = f"Partial credit: {check.improvement}"
            check_results.append(
                {
                    "id": check.id,
                    "criterion": check.criterion,
                    "score": round(ratio * 100, 2),
                    "status": status,
                    "feedback": feedback,
                }
            )

        score = (weighted_score / check_weight_total * 100.0) if check_weight_total else 0.0
        dimension_weight = max(0.0, float(dimension.get("weight", 0) or 0))
        evaluated_dimensions.append(
            {
                "id": dimension_id,
                "name": dimension.get("name", dimension_id.replace("_", " ").title()),
                "weight": dimension_weight,
                "criteria": dimension.get("criteria", ""),
                "score": round(score, 2),
                "strengths": strengths,
                "areas_for_improvement": improvements,
                "checks": check_results,
            }
        )

    if total_weight == float(len(dimensions)) and not any(float(d.get("weight", 0) or 0) > 0 for d in dimensions):
        overall_score = sum(dimension["score"] for dimension in evaluated_dimensions) / len(evaluated_dimensions)
    else:
        overall_score = sum(
            dimension["score"] * dimension["weight"] for dimension in evaluated_dimensions
        ) / total_weight

    weakest_dimension_score = min(dimension["score"] for dimension in evaluated_dimensions)
    if overall_score >= 85 and weakest_dimension_score >= 60:
        approval_status = "approved"
        approval_message = "Strong, balanced evidence across the rubric; ready to advance, subject to normal human review."
    elif overall_score >= 65 and weakest_dimension_score >= 40:
        approval_status = "conditional"
        approval_message = "Promising work with targeted gaps; revise the listed areas before treating the handoff as complete."
    else:
        approval_status = "needs_revision"
        approval_message = "The submission needs more evidence or operational detail before it is ready for handoff."

    all_strengths = [
        strength
        for dimension in evaluated_dimensions
        for strength in dimension["strengths"]
    ]
    all_improvements = [
        improvement
        for dimension in evaluated_dimensions
        for improvement in dimension["areas_for_improvement"]
    ]
    # Keep feedback usable in the API and avoid returning duplicate boilerplate.
    strengths = list(dict.fromkeys(all_strengths))[:8]
    areas_for_improvement = list(dict.fromkeys(all_improvements))[:8]
    if not strengths:
        strengths = ["You completed all required response fields, providing a structured starting point for review."]
    if not areas_for_improvement:
        areas_for_improvement = [
            "For a stronger handoff, attach a named dashboard, query, log line, or test result to each key claim."
        ]

    return {
        "overall_score": round(max(0.0, min(100.0, overall_score)), 2),
        "dimensions": evaluated_dimensions,
        "strengths": strengths,
        "areas_for_improvement": areas_for_improvement,
        "approval_status": approval_status,
        "approval_message": approval_message,
        "evaluation_note": (
            "Scores are generated by transparent, deterministic rubric checks over the mission's evidence and criteria; "
            "they are coaching feedback, not a substitute for human review."
        ),
        "engine_version": "worksim-rubric-1.0.0",
    }
