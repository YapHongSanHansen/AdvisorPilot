import type { Employee, Project, ScoreBreakdown } from "@/types";
import { availableHours } from "./gates";
import { projectedUtilization, relativeLoad } from "./components";

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

/**
 * D18 — Up to three plain-language, evidence-cited reasons per candidate
 * (strongest signals first). Every reason ties to visible evidence — never
 * "the AI thinks this person is best".
 */
export function buildReasons(
  employee: Employee,
  project: Project,
  scores: ScoreBreakdown,
  teamAverageAssignments: number,
): string[] {
  const util = projectedUtilization(employee, project);
  const load = relativeLoad(employee, teamAverageAssignments);

  const reasons: { strength: number; text: string }[] = [
    {
      strength: scores.skill,
      text:
        scores.skill >= 0.999
          ? "Meets all required skills"
          : `Strong skill match (${pct(scores.skill)})`,
    },
    {
      strength: scores.capacity,
      text: `${availableHours(employee)}h available — projected ${pct(util)} utilization`,
    },
    {
      strength: scores.workStyle,
      text: `Work-style fit ${pct(scores.workStyle)}`,
    },
    {
      strength: scores.distribution,
      text:
        load <= 1
          ? "Recent workload at or below the team average"
          : `Recent workload ${load.toFixed(1)}× the team average`,
    },
  ];

  return reasons
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 3)
    .map((r) => r.text);
}

/** Risk notes shown beside an eligible candidate (e.g. high projected utilization). */
export function buildRisks(employee: Employee, project: Project): string[] {
  const risks: string[] = [];
  const util = projectedUtilization(employee, project);
  if (util > 1) {
    risks.push(`Would exceed capacity — projected ${pct(util)}`);
  } else if (util > 0.85) {
    risks.push(`High projected utilization (${pct(util)})`);
  }
  return risks;
}
