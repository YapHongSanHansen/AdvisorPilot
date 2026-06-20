import type { Employee, Project, WorkStyle } from "@/types";
import { clamp } from "./clamp";

/** D05 — Ratio for a single skill, capped at 1. */
export function skillRatio(employeeLevel: number, requiredLevel: number): number {
  if (requiredLevel <= 0) return 1;
  return clamp(employeeLevel / requiredLevel, 0, 1);
}

/**
 * D06 — skillScore `S`: average skillRatio across every required skill
 * (mandatory + preferred). Mandatory skills also gate; preferred skills only score.
 */
export function skillScore(employee: Employee, project: Project): number {
  const required = { ...project.preferredSkills, ...project.mandatorySkills };
  const entries = Object.entries(required);
  if (entries.length === 0) return 1;
  const sum = entries.reduce(
    (acc, [skill, level]) => acc + skillRatio(employee.skills[skill] ?? 0, level),
    0,
  );
  return sum / entries.length;
}

/** D07 — Projected utilization after taking this project. */
export function projectedUtilization(employee: Employee, project: Project): number {
  if (employee.weeklyCapacity <= 0) return Number.POSITIVE_INFINITY;
  return (employee.allocatedHours + project.requiredHours) / employee.weeklyCapacity;
}

/** D08 — capacityScore `C` = clamp(1 - projectedUtilization). */
export function capacityScore(employee: Employee, project: Project): number {
  return clamp(1 - projectedUtilization(employee, project), 0, 1);
}

/** D09 — Distance on a single work-style dimension. */
export function dimensionDistance(a: number, b: number): number {
  return Math.abs(a - b);
}

const WORK_STYLE_KEYS: (keyof WorkStyle)[] = [
  "ambiguity",
  "communication",
  "pace",
  "collaboration",
];

/** D10 — workStyleScore `W` = 1 - mean dimension distance. */
export function workStyleScore(employee: Employee, project: Project): number {
  const meanDistance =
    WORK_STYLE_KEYS.reduce(
      (acc, key) =>
        acc + dimensionDistance(employee.workStyle[key], project.desiredWorkStyle[key]),
      0,
    ) / WORK_STYLE_KEYS.length;
  return clamp(1 - meanDistance, 0, 1);
}

/** D11 — Recent workload relative to the team average. */
export function relativeLoad(employee: Employee, teamAverageAssignments: number): number {
  return employee.assignmentsLast30Days / Math.max(teamAverageAssignments, 1);
}

/**
 * D12 — distributionScore `D` = 1 / (1 + max(relativeLoad - 1, 0)).
 * At or below the team average → 1. Repeated assignments reduce it gradually,
 * never banning the person, and it can never go negative.
 */
export function distributionScore(employee: Employee, teamAverageAssignments: number): number {
  const load = relativeLoad(employee, teamAverageAssignments);
  return 1 / (1 + Math.max(load - 1, 0));
}
