import type {
  Employee,
  Project,
  RankedCandidate,
  ScoreBreakdown,
  ScoringWeights,
} from "@/types";
import { DEFAULT_SCORING_WEIGHTS } from "@/types";
import { availableHours, evaluateGates } from "./gates";
import {
  capacityScore,
  distributionScore,
  projectedUtilization,
  skillScore,
  workStyleScore,
} from "./components";
import { buildReasons, buildRisks } from "./reasons";
import { weightTotal } from "./weights";

/** A scored candidate plus capacity facts used for tie-breaking and the UI. */
export type ScoredCandidate = RankedCandidate & {
  team: string;
  availableHours: number;
  projectedUtilization: number;
};

export type RankingResult = {
  top: ScoredCandidate[]; // D16 — top three eligible candidates
  eligible: ScoredCandidate[]; // all eligible, ranked
  ineligible: ScoredCandidate[]; // filtered out, with rejection reasons in `risks`
};

/** Average recent assignments across the employee's team. */
function teamAverageAssignments(employees: Employee[], team: string): number {
  const peers = employees.filter((e) => e.team === team);
  if (peers.length === 0) return 0;
  return peers.reduce((sum, e) => sum + e.assignmentsLast30Days, 0) / peers.length;
}

/**
 * D14 — Final weighted score, normalized by the weight total so it always stays
 * 0..100 even with custom weights. With the default weights (sum = 1) this is
 * exactly 100 × (0.55S + 0.25C + 0.15W + 0.05D).
 */
export function finalScore(
  scores: Pick<ScoreBreakdown, "skill" | "capacity" | "workStyle" | "distribution">,
  weights: ScoringWeights,
): number {
  const total = weightTotal(weights) || 1;
  const weighted =
    weights.skill * scores.skill +
    weights.capacity * scores.capacity +
    weights.workStyle * scores.workStyle +
    weights.distribution * scores.distribution;
  return 100 * (weighted / total);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function scoreOne(
  employee: Employee,
  project: Project,
  employees: Employee[],
  weights: ScoringWeights,
): ScoredCandidate {
  const teamAvg = teamAverageAssignments(employees, employee.team);

  const breakdown: ScoreBreakdown = {
    skill: skillScore(employee, project),
    capacity: capacityScore(employee, project),
    workStyle: workStyleScore(employee, project),
    distribution: distributionScore(employee, teamAvg),
    finalScore: 0,
  };
  breakdown.finalScore = round1(finalScore(breakdown, weights));

  const gate = evaluateGates(employee, project);

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    team: employee.team,
    eligible: gate.eligible,
    scores: breakdown,
    reasons: buildReasons(employee, project, breakdown, teamAvg),
    risks: gate.eligible ? buildRisks(employee, project) : gate.rejections,
    availableHours: availableHours(employee),
    projectedUtilization: projectedUtilization(employee, project),
  };
}

/**
 * D02–D18 — Rank candidates for a project: gates → component scores → final
 * weighted score → sort → deterministic tie-break → top three.
 * Pure and deterministic: same inputs always produce the same ranking.
 */
export function rankCandidates(
  project: Project,
  employees: Employee[],
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS,
): RankingResult {
  const scored = employees.map((e) => scoreOne(e, project, employees, weights));

  const eligible = scored
    .filter((c) => c.eligible)
    .sort(
      (a, b) =>
        // D15 — by final score, descending
        b.scores.finalScore - a.scores.finalScore ||
        // D17 — tie-break: more available capacity wins, then stable by id
        b.availableHours - a.availableHours ||
        a.employeeId.localeCompare(b.employeeId),
    );

  const ineligible = scored.filter((c) => !c.eligible);

  return { top: eligible.slice(0, 3), eligible, ineligible };
}
