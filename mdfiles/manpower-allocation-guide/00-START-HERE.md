# Project Atlas — AI-Assisted Manpower Allocation

## One-line pitch

Project Atlas helps managers assign the right people to projects without overloading the same top performers, while giving leadership visibility into capacity, fit, and repeated override patterns.

## The problem

Many teams still allocate people using spreadsheets, memory, and personal preference. This causes:

- overloaded high performers;
- underused employees;
- mismatched skills or working styles;
- slow staffing decisions;
- decisions that cannot be explained or audited.

## The MVP

The hackathon prototype supports one complete journey:

1. A manager creates a project and enters its requirements.
2. The system filters out unavailable employees.
3. It ranks eligible employees using skills, capacity, work-style fit, and workload distribution.
4. The manager sees a plain-language explanation for each recommendation.
5. The manager accepts or overrides the recommendation.
6. The system records the decision and updates a leadership dashboard.

## What makes it fit Track 3

- **Resource:** employee time and capability.
- **Waste:** idle talent, overload, burnout risk, and manual planning time.
- **Monitoring:** capacity and allocation dashboards.
- **Optimization:** ranked allocation recommendations.
- **Smart scheduling:** project-to-employee matching.
- **Data insight:** workload concentration and override trends.

## Success measures for the demo

- Generate a recommendation in under 3 seconds using seeded data.
- Never recommend someone who lacks required availability.
- Show the top three candidates with understandable reasons.
- Demonstrate that repeated assignment to one person lowers their future ranking.
- Record manager overrides without blocking the manager.
- Show leadership-level capacity and override analytics.

## Documentation map

| File | Purpose |
|---|---|
| `01-PRODUCT-GUIDELINE.md` | Scope, users, stories, and acceptance criteria |
| `02-SYSTEM-ARCHITECTURE.md` | Components, data flow, APIs, and deployment |
| `03-SCORING-AND-DATA.md` | Data model and transparent ranking algorithm |
| `04-TECH-STACK.md` | Recommended tools and fallback choices |
| `05-PHASES.md` | Build phases and milestones |
| `06-15-MINUTE-TASKS.md` | Atomic implementation checklist |
| `07-PRIVACY-FAIRNESS.md` | Guardrails for employee data and recommendations |
| `08-DEMO-PLAN.md` | Demo script, pitch structure, and contingency plan |

## Scope rule

If a feature does not improve the create → rank → decide → audit journey, postpone it. A polished allocation loop beats a sprawling HR platform.

