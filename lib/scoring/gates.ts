import type { Employee, Project } from "@/types";

export type GateResult = {
  eligible: boolean;
  rejections: string[]; // human-readable reasons a candidate failed a hard gate
};

/** Hours still free this week. */
export function availableHours(employee: Employee): number {
  return employee.weeklyCapacity - employee.allocatedHours;
}

/**
 * D02–D04 — Eligibility gates. ALL must pass before weighted scoring; a high soft
 * score must never hide a failed hard requirement. Returns rejection reasons.
 */
export function evaluateGates(employee: Employee, project: Project): GateResult {
  const rejections: string[] = [];

  // active gate
  if (!employee.active) {
    rejections.push("Not currently active");
  }

  // D02 — available-hours gate
  const free = availableHours(employee);
  if (free < project.requiredHours) {
    rejections.push(`Only ${free}h free, needs ${project.requiredHours}h`);
  }

  // D03 — mandatory-skill gate
  for (const [skill, requiredLevel] of Object.entries(project.mandatorySkills)) {
    const level = employee.skills[skill] ?? 0;
    if (level < requiredLevel) {
      rejections.push(`${skill} at ${level}/${requiredLevel} — below required level`);
    }
  }

  return { eligible: rejections.length === 0, rejections };
}
