# Delivery Phases

## Phase 0 — Align the team (30 minutes)

**Outcome:** everyone can explain the same problem and demo journey.

- Confirm the one-line pitch.
- Assign product/UI, frontend, data/scoring, and pitch owners.
- Agree on seeded demo data and the definition of done.

**Exit check:** no one is building payroll, recruitment, or full HR features.

## Phase 1 — Build the skeleton (60–90 minutes)

**Outcome:** navigable app with realistic mock content.

- Initialize project and styling.
- Add navigation and four routes.
- Define TypeScript types.
- Add employee and project fixtures.

**Exit check:** every required screen opens and uses shared data.

## Phase 2 — Build the allocation engine (90–120 minutes)

**Outcome:** project inputs produce deterministic ranked candidates.

- Implement eligibility gates.
- Implement the four component scores.
- Add weighted total and reason codes.
- Test overloaded, unqualified, and tied candidates.

**Exit check:** repeated runs on the same data produce the same ranking.

## Phase 3 — Complete the manager journey (90 minutes)

**Outcome:** manager can create, compare, decide, and override.

- Build project requirement form.
- Build top-three candidate cards.
- Add score breakdown and explanations.
- Add accept and override actions.

**Exit check:** a judge can finish the workflow without verbal guidance.

## Phase 4 — Add leadership visibility (60–90 minutes)

**Outcome:** allocation decisions update meaningful aggregate analytics.

- Add capacity and workload charts.
- Add override trend and reason summary.
- Add review-threshold flags.
- Add a decision history table.

**Exit check:** one override visibly changes at least one dashboard metric.

## Phase 5 — Add resilience and polish (60 minutes)

**Outcome:** demo is reliable and understandable.

- Add empty, loading, and error states.
- Add demo reset.
- Verify responsive layout.
- Add privacy and “decision support” labels.

**Exit check:** demo works offline or with the prepared fixture fallback.

## Phase 6 — Rehearse and package (45–60 minutes)

**Outcome:** a confident three-minute presentation.

- Reset and run the demo three times.
- Time the pitch.
- Prepare one architecture slide and one impact slide.
- Record a backup walkthrough.

## Post-hackathon phases

1. Validate scoring with managers and employees.
2. Pilot with one team using historical, consented data.
3. Measure allocation time, overtime, utilization, and override quality.
4. Add approved integrations and role-based access.
5. Run fairness, security, and privacy reviews before wider deployment.

