# WorkSim Technical Specification & System Contract

Version: 1.0.0
Author: Architect Agent (Chat 1)
Target Audience: Frontend Engineer (Chat 2), Backend Engineer (Chat 3), Content/QA Engineer (Chat 4)

---

## 1. Domain Entities & Schemas

### 1.1 Track Schema (`tracks/<track_id>.json`)
```json
{
  "id": "cloud-engineer",
  "title": "Cloud Engineer / SRE",
  "summary": "Practice incident response, observability, infrastructure changes, and post-mortems.",
  "industry_glossary": [
    {"term": "SLA/SLO", "definition": "Service Level Agreement and Objective defining acceptable reliability thresholds."},
    {"term": "5xx Errors", "definition": "Server-side HTTP errors indicating failure within the application or upstream dependencies."},
    {"term": "Runbook", "definition": "A standard operating procedure document for diagnosing and resolving common operational issues."}
  ],
  "readiness_quiz": [
    {
      "id": "q1",
      "question": "When latency spikes immediately after a deployment, what should be your immediate first instinct?",
      "options": [
        "A) Delete the database cluster immediately",
        "B) Check the release notes and recent deployment diffs to evaluate rollback options",
        "C) Ignore the alerts for 24 hours",
        "D) Rewrite the application in another programming language"
      ],
      "correct_answer": "B",
      "explanation": "Checking recent deployment diffs and release notes allows you to quickly assess if the deployment caused the regression and whether a safe rollback or feature flag toggle is warranted."
    }
  ]
}
```

### 1.2 Mission Schema (`missions/<mission_id>.json`)
```json
{
  "id": "cloud-sre-01",
  "track_id": "cloud-engineer",
  "type": "guided",
  "difficulty": "Junior/Fresher",
  "estimated_time_mins": 35,
  "title": "Latency and 5xx Errors Spike Post-Deployment",
  "problem_brief": "At 14:15 UTC, automated alerts triggered for the Payments API. p99 latency surged from 120ms to 4,200ms, and 504 Gateway Timeout errors rose to 8.4%. Investigate the evidence, identify the trigger, recommend a safe mitigation, and outline your verification plan.",
  "context": {
    "service": "payments-gateway-v2",
    "deployment_time": "14:10 UTC",
    "affected_users": "Roughly 8% of checkout transactions"
  },
  "evidence_tabs": [
    {
      "id": "timeline",
      "label": "Incident Timeline",
      "type": "timeline",
      "data": [...]
    },
    {
      "id": "metrics",
      "label": "Telemetry & Metrics",
      "type": "chart_or_table",
      "data": [...]
    },
    {
      "id": "logs",
      "label": "Application Logs",
      "type": "log_stream",
      "data": [...]
    },
    {
      "id": "release_notes",
      "label": "Release Notes & Diffs",
      "type": "markdown",
      "content": "..."
    },
    {
      "id": "runbook",
      "label": "Service Runbook",
      "type": "markdown",
      "content": "..."
    }
  ],
  "submission_template": {
    "incident_timeline": "Provide a bulleted sequence of key events.",
    "hypothesis": "What is the primary cause? Distinguish factual evidence from assumptions.",
    "safe_mitigation_plan": "What action should be taken right now? Specify approvals or rollback steps.",
    "verification_steps": "How will you confirm the problem is resolved without causing secondary damage?",
    "follow_up_improvement": "What one preventative measure should be implemented for the future?"
  },
  "rubric": {
    "dimensions": [
      {
        "id": "evidence_accuracy",
        "name": "Accurate Evidence Usage",
        "weight": 25,
        "criteria": "Did the candidate accurately reference timestamps, log errors, and release details rather than guessing?"
      },
      {
        "id": "plausibility_and_distinction",
        "name": "Plausible Hypothesis & Assumptions",
        "weight": 25,
        "criteria": "Does the hypothesis directly connect the upstream database connection pool exhaustion or external API timeout to the release, clearly labeling unconfirmed assumptions?"
      },
      {
        "id": "safety_and_constraints",
        "name": "Safe Mitigation Plan",
        "weight": 25,
        "criteria": "Is the immediate remediation safe (e.g. rollback or feature flag disable) rather than risky ad-hoc hotfixing in production without approvals?"
      },
      {
        "id": "verification_and_followup",
        "name": "Verification & Preventive Measures",
        "weight": 25,
        "criteria": "Are metrics to monitor post-fix defined (p99 latency < 200ms, 0% 5xx) and is an actionable long-term improvement proposed?"
      }
    ]
  }
}
```

---

## 2. User Interface Requirements (for Agent 2 - Frontend Developer)

1. **Visual Style**:
   - Dark sidebar (`#111827` / `#1f2937`) with navigation links (Career Tracks, Missions, Submissions, Practice Rubric).
   - Crisp, bright content area (`#f9fafb` background) with high-contrast typography.
   - Rounded cards (`border-radius: 12px` / `0.75rem`), subtle borders, soft shadows.
   - Warm pastel accents (amber, indigo, soft emerald).
2. **Key Views**:
   - **Track Selection & Overview**: 3 track cards (Software Developer, Cloud Engineer, Data Analyst) with summary, skills, and "Start Track" button.
   - **Role Knowledge & 5-Question Check**: Modal or dedicated page showing industry glossary + 5 interactive multiple-choice questions with instant rationale explanations upon answering.
   - **Mission Workspace**:
     - Left / Top section: Problem brief, mission metadata (Difficulty, Estimated time, Track badge).
     - Center section: Interactive Evidence Tabs (Incident Timeline, Telemetry Metrics, Raw Logs with search filter, Release Notes, Runbook).
     - Right / Bottom section: Structured Submission Form with fields:
       1. Incident Timeline
       2. Hypothesis (Facts vs Assumptions)
       3. Safe Mitigation Plan
       4. Verification Steps
       5. Follow-up Improvement
     - Actions: "Save Local Draft" (auto-saves to `localStorage`), "Clear Form", "Submit for Rubric Evaluation".
   - **Rubric Evaluation Feedback Modal/Drawer**:
     - Shows scores across the 4 rubric dimensions with qualitative feedback and recommendations for improvement.

---

## 3. Backend API Contract (for Agent 3 - Backend Developer)

Endpoints to be implemented in `backend/main.py` (FastAPI or lightweight Python server):

* `GET /api/tracks`: List all available tracks.
* `GET /api/tracks/{track_id}`: Get track details, glossary, and 5-question readiness check.
* `GET /api/missions`: List missions (filterable by `track_id` and `type`).
* `GET /api/missions/{mission_id}`: Get full mission details with evidence tabs.
* `POST /api/submissions`: Submit learner responses.
  - Body: `{ "mission_id": "cloud-sre-01", "answers": { ... } }`
  - Evaluates submission against the mission's rubric dimensions.
  - Returns rubric scores (0-100), dimensional breakdown, strengths, areas for improvement, and approval status.
* `GET /api/submissions/{submission_id}`: Retrieve saved submission & evaluation result.

---

## 4. Evaluation Rubric Guidelines (Non-Binary Evaluation)

Submissions must **never** be graded as simple "right or wrong". The evaluation must assess:
1. **Evidence Grounding**: References specific facts from the provided logs, metrics, or diffs.
2. **Sound Engineering Reasoning**: Distinguishes verified observations from hypotheses.
3. **Operational Safety**: Prioritizes service stability, risk mitigation, and standard change control.
4. **Validation Rigor**: Specifies what signals confirm health before declaring the incident resolved.
