# Product Guideline

## Product goal

Reduce time spent assigning staff and reduce workload concentration while preserving manager authority.

## Users

### Manager

- Creates projects and staffing requirements.
- Reviews ranked candidates and explanations.
- Accepts or overrides a recommendation.

### Leadership / CEO

- Sees capacity, utilization, concentration, and override trends.
- Investigates patterns rather than individual one-off decisions.

### Employee — optional MVP view

- Reviews and corrects their skills and preferred work-style profile.
- Sees current assignments and capacity.

## Core user stories

1. As a manager, I can enter project duration, required hours, skills, urgency, and preferred work style.
2. As a manager, I can see eligible employees ranked with a score breakdown.
3. As a manager, I can accept a recommendation or select another employee.
4. As leadership, I can see whether workload is concentrated on a small group.
5. As leadership, I can see aggregate override patterns and their stated reasons.
6. As an employee, I can correct an inferred work-style profile before it is used.

## Required screens

1. **Overview dashboard:** headcount, available capacity, overloaded staff, open projects, workload distribution.
2. **New allocation:** project requirement form.
3. **Recommendations:** top three candidates, scores, risks, and explanations.
4. **Decision dialog:** accept or override; reason is optional for ordinary decisions.
5. **Audit dashboard:** trends by team and manager, with filters.

## Recommendation explanation example

> Aisha ranks first because she meets all required skills, has 18 available hours, and matches the project's collaborative work style. Her recent allocation level is near the team average.

Avoid explanations such as “the AI thinks Aisha is the best.” Every reason must connect to visible evidence.

## Functional requirements

- Normalize scores to the range 0–100.
- Treat required capacity and mandatory skills as gates.
- Keep scoring weights visible and configurable.
- Store the score breakdown used for every decision.
- Permit one-click override.
- Show the immediate impact of an override, such as projected utilization.
- Trigger review only for aggregate patterns, not every override.

## Non-functional requirements

- Responsive at laptop and tablet widths.
- Seeded demo works without external integrations.
- No private messages or personal conversations are analyzed.
- Recommendations are reproducible from saved inputs.
- Role-based views separate manager and leadership information.

## Out of scope for the hackathon

- Payroll, attendance, recruitment, performance appraisal, or promotion decisions.
- Automatic assignment without human confirmation.
- Reading private Slack/Teams messages.
- Training a custom machine-learning model.
- Enterprise SSO and production HR-system integrations.
- Predicting protected traits or psychological diagnoses.

## Definition of done

The MVP is done when seeded employees and projects can complete the full allocation loop, the result is explainable, the override is recorded, the dashboard updates, and the demo can be reset reliably.

