# Privacy, Fairness, and Human Control

## Positioning

Project Atlas is a decision-support tool for project allocation. It is not a performance-rating, promotion, disciplinary, or termination system.

## Data rules

- Use synthetic employee data in the hackathon.
- In a real pilot, collect only data necessary for allocation.
- Do not read private messages, personal email, or non-work accounts.
- Do not infer medical conditions, protected traits, or psychological diagnoses.
- Show employees which data sources affect their profile.
- Let employees correct skills, availability, and work-style preferences.
- Define retention periods for raw artifacts and derived profiles.

## Work-style guardrails

- Describe work preferences, not “good” or “bad” personalities.
- Use project-relevant dimensions only.
- Require employee confirmation before an inferred profile is active.
- Display confidence and supporting evidence.
- Never treat low-confidence values as hard constraints.
- Do not use the profile outside allocation without fresh consent and review.

## Recommendation guardrails

- Hard requirements and availability are checked before fit scoring.
- The ranking formula and weights are visible.
- The score breakdown is stored with each recommendation.
- Managers can override in one click.
- Overload warnings inform but do not secretly block decisions.
- Aggregate flags prompt review; they do not accuse a manager of bias.

## Leadership dashboard rules

- Prefer team-level trends over employee surveillance.
- Require a minimum number of decisions before showing a rate.
- Avoid demographic claims unless a qualified legal/fairness review establishes a lawful method and purpose.
- Restrict raw individual decision logs to authorized reviewers.

## Threats and mitigations

| Risk | Mitigation |
|---|---|
| Employees game their profile | Combine self-report with transparent, reviewable evidence |
| Historical allocation reproduces old patterns | Do not train ranking directly on historical manager choices |
| Managers blindly trust the score | Show evidence and keep explicit human confirmation |
| Managers ignore the tool | Keep overrides easy and make aggregate patterns useful |
| LLM invents profile evidence | Strict schema, source references, confidence, human approval |
| Sensitive work data reaches an AI vendor | Sanitize, minimize, obtain approval, or use mocked/local processing |
| A score becomes a performance label | Limit purpose, access, retention, and downstream use |

## Demo disclaimer

> This prototype uses synthetic data. Recommendations are explainable decision support and require human confirmation. Work-style information is employee-editable and excludes private communications and protected characteristics.

