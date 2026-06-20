# Demo and Pitch Plan

## Three-minute storyline

### 0:00–0:30 — Problem

> Managers often allocate people using spreadsheets and memory. The safest choice is repeatedly giving critical work to the same top performers, creating burnout while other capable staff remain underused.

### 0:30–0:50 — Product promise

> Project Atlas combines skills, real capacity, work preferences, and recent workload to recommend a balanced project team. Managers remain in control, while leadership gains an audit trail of allocation patterns.

### 0:50–2:10 — Live workflow

1. Open the dashboard and point out overloaded staff and unused capacity.
2. Create an urgent project with required hours and skills.
3. Generate the top three candidates.
4. Explain why the obvious senior employee is not ranked first: capacity and repeated allocation.
5. Expand the recommended candidate's score breakdown.
6. Override the recommendation to the overloaded employee.
7. Show the projected-capacity warning and confirm.
8. Open leadership analytics and show the recorded override and changed trend.

### 2:10–2:35 — Architecture and trust

> The ranking is deterministic and explainable. An optional language model can draft work-style preferences from approved work artifacts, but employees review them and the model never makes the final assignment.

### 2:35–3:00 — Impact

> Atlas turns manpower planning into a measurable resource-optimization loop: understand demand, rank available capability, keep a human decision, and learn from allocation patterns. This reduces planning time, overload, and wasted talent.

## Seeded demo scenario

- **Project:** Payment outage stabilization.
- **Needs:** backend 0.8, database 0.7, 12 hours, high urgency.
- **Candidate 1:** strongest skills but 95% utilized and heavily assigned recently.
- **Candidate 2:** sufficient skills, 55% utilized, strong urgent-task fit; recommended.
- **Candidate 3:** available but misses a mandatory database threshold; shown as ineligible.

## Metrics to present as prototype targets

- Time to create an allocation recommendation.
- Reduction in assignments above 100% projected capacity.
- Workload concentration across the team.
- Manager acceptance and override rate.
- Planning time saved compared with spreadsheets.

Do not claim measured business savings unless the team has actually run a pilot.

## Judge questions

### Why is this AI?

The core optimization is transparent scoring. AI is used only where it adds value: drafting structured work-style evidence and generating explanations. Keeping the final ranking deterministic makes the system safer and auditable.

### What if the recommendation is wrong?

Managers can override immediately. The system records inputs and impact, and leadership sees aggregate patterns rather than blocking daily work.

### Is this employee surveillance?

The prototype uses synthetic data. A real implementation would use approved work artifacts only, exclude private communication, and require employee review of inferred preferences.

### How will you validate the weights?

Start with skills-heavy defaults, test retrospectively on consented project outcomes, interview managers and employees, and tune by project type. Weights remain visible and versioned.

### What is the business value?

Faster resource planning, fewer overloaded employees, better use of available capability, and an auditable explanation for staffing decisions.

## Backup plan

- Keep static fixture data bundled with the app.
- Add a reset button that restores the exact demo scenario.
- Record a short walkthrough in case connectivity fails.
- Keep screenshots of recommendation and audit screens in the pitch deck.

