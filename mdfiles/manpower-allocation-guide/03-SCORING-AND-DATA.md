# Scoring and Data Design

## Important terminology

Call the fourth factor **workload distribution**, not demographic bias. The MVP measures repeated allocation and overload. It must not infer or score race, religion, gender, disability, age, or other protected characteristics.

## Candidate eligibility gates

A candidate is eligible only if:

- available hours are at least the project's required hours;
- all mandatory skills meet their minimum proficiency;
- the employee is active and belongs to an allowed team/location;
- no hard scheduling conflict exists.

Gates run before weighted scoring. A high soft score must never hide a failed hard requirement.

## Scores

All component scores are normalized from 0 to 1.

- `S`: skill match.
- `C`: capacity health after allocation.
- `W`: work-style fit.
- `D`: workload distribution health.

Recommended hackathon formula:

```text
finalScore = 100 × (0.55S + 0.25C + 0.15W + 0.05D)
```

The default weights prioritize job capability. Keep the values configurable and show them in the interface.

## Component calculations

### Skill match `S`

For each required skill:

```text
skillRatio = min(employeeLevel / requiredLevel, 1)
S = weighted average of skillRatio
```

Mandatory skills are gates; preferred skills contribute to the score.

### Capacity health `C`

```text
projectedUtilization = (allocatedHours + projectHours) / weeklyCapacity
C = clamp(1 - projectedUtilization, 0, 1)
```

For presentation, consider 70–85% utilization healthy. Add an explicit warning above 100%.

### Work-style fit `W`

Use four job-related, employee-editable dimensions:

- ambiguity tolerance;
- communication detail;
- delivery pace;
- collaboration preference.

```text
distance = mean(abs(employeeDimension - projectDimension))
W = 1 - distance
```

These values describe preferences, not personality quality or performance potential.

### Workload distribution `D`

Use bounded values so the score can never become negative:

```text
relativeLoad = employeeAssignmentsLast30Days / max(teamAverageAssignmentsLast30Days, 1)
D = 1 / (1 + max(relativeLoad - 1, 0))
```

An employee at or below the team average gets `D = 1`. Repeated assignments reduce `D` gradually rather than banning the person.

## Example

| Candidate | Skills | Capacity | Work style | Distribution | Final |
|---|---:|---:|---:|---:|---:|
| Aisha | 0.95 | 0.80 | 0.85 | 0.90 | 89.5 |
| Ben | 0.90 | 0.60 | 0.90 | 0.65 | 81.3 |
| Chen | 0.82 | 0.90 | 0.70 | 1.00 | 83.1 |

## Minimal entities

### Employee

```ts
type Employee = {
  id: string;
  name: string;
  team: string;
  weeklyCapacity: number;
  allocatedHours: number;
  skills: Record<string, number>;
  workStyle: {
    ambiguity: number;
    communication: number;
    pace: number;
    collaboration: number;
  };
  assignmentsLast30Days: number;
};
```

### Project

```ts
type Project = {
  id: string;
  name: string;
  requiredHours: number;
  mandatorySkills: Record<string, number>;
  preferredSkills: Record<string, number>;
  desiredWorkStyle: Employee["workStyle"];
  urgency: "low" | "medium" | "high";
};
```

### Decision snapshot

Store project inputs, candidate scores, weights, selected employee, whether it was an override, optional reason code, actor, and timestamp. Saving the snapshot makes later audits truthful even if profiles change.

## Override reason codes

- Domain experience not captured.
- Client continuity.
- Scheduling information changed.
- Employee preference.
- Recommendation data incorrect.
- Other.

Ordinary overrides remain one click. Ask for review only when aggregate thresholds are crossed.

## Aggregate review examples

- Override rate above 30% over at least 10 decisions.
- More than 40% of team assignments concentrated on the same 20% of employees.
- Selected employee would exceed 100% projected capacity.

These are prompts for human investigation, not proof of misconduct.
