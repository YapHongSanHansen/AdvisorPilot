import type { Decision, Employee, OverrideReasonCode } from "@/types";
import { OVERRIDE_REASON_LABELS } from "@/types";

// Aggregate-review thresholds (from 03-SCORING-AND-DATA). These are prompts for human
// review, never findings of misconduct.
export const OVERRIDE_RATE_FLAG = 0.3; // > 30% override rate
export const MIN_DECISIONS_FOR_FLAG = 10; // over at least 10 decisions
export const CONCENTRATION_FLAG = 0.4; // > 40% of assignments held by the top 20%
export const TOP_FRACTION = 0.2;

export type AuditDecision = {
  id: string;
  employeeId: string;
  employeeName: string;
  team: string;
  project: string;
  isOverride: boolean;
  reasonCode?: OverrideReasonCode;
  actor: string;
  decidedAt: string;
};

export type AuditEmployee = {
  id: string;
  name: string;
  team: string;
  assignmentsLast30Days: number;
};

/** Map full decision records to the lightweight shape the audit UI needs. */
export function toAuditDecisions(decisions: Decision[], employees: Employee[]): AuditDecision[] {
  const byId = new Map(employees.map((e) => [e.id, e]));
  return decisions.map((d) => {
    const emp = byId.get(d.selectedEmployeeId);
    return {
      id: d.id,
      employeeId: d.selectedEmployeeId,
      employeeName: emp?.name ?? d.selectedEmployeeId,
      team: emp?.team ?? "—",
      project: d.projectSnapshot?.name ?? "—",
      isOverride: d.isOverride,
      reasonCode: d.reasonCode,
      actor: d.actor,
      decidedAt: d.decidedAt,
    };
  });
}

export type AuditMetrics = {
  total: number;
  overrides: number;
  overrideRate: number; // 0..1
  trend: { index: number; rate: number }[]; // running override rate (%) by decision order
  reasonSummary: { code: OverrideReasonCode; label: string; count: number }[];
  history: AuditDecision[]; // newest first
  highOverrideFlag: boolean; // J06
};

export function computeAuditMetrics(decisions: AuditDecision[]): AuditMetrics {
  const chrono = [...decisions].sort((a, b) => a.decidedAt.localeCompare(b.decidedAt));
  let overridesSoFar = 0;
  const trend = chrono.map((d, i) => {
    if (d.isOverride) overridesSoFar += 1;
    return { index: i + 1, rate: Math.round((overridesSoFar / (i + 1)) * 100) };
  });

  const total = decisions.length;
  const overrides = decisions.filter((d) => d.isOverride).length;
  const overrideRate = total === 0 ? 0 : overrides / total;

  const counts = new Map<OverrideReasonCode, number>();
  for (const d of decisions) {
    if (d.isOverride && d.reasonCode) {
      counts.set(d.reasonCode, (counts.get(d.reasonCode) ?? 0) + 1);
    }
  }
  const reasonSummary = [...counts.entries()]
    .map(([code, count]) => ({ code, label: OVERRIDE_REASON_LABELS[code], count }))
    .sort((a, b) => b.count - a.count);

  const history = [...decisions].sort((a, b) => b.decidedAt.localeCompare(a.decidedAt));
  const highOverrideFlag = total >= MIN_DECISIONS_FOR_FLAG && overrideRate > OVERRIDE_RATE_FLAG;

  return { total, overrides, overrideRate, trend, reasonSummary, history, highOverrideFlag };
}

export type Concentration = {
  topShare: number; // 0..1 share of assignments held by the busiest TOP_FRACTION
  topCount: number;
  population: number;
  flag: boolean; // J07
};

/** Workload concentration: share of recent assignments held by the busiest 20%. */
export function computeConcentration(employees: AuditEmployee[]): Concentration {
  const ranked = [...employees].sort(
    (a, b) => b.assignmentsLast30Days - a.assignmentsLast30Days,
  );
  const total = ranked.reduce((s, e) => s + e.assignmentsLast30Days, 0);
  const topCount = ranked.length === 0 ? 0 : Math.max(1, Math.ceil(ranked.length * TOP_FRACTION));
  const topAssignments = ranked.slice(0, topCount).reduce((s, e) => s + e.assignmentsLast30Days, 0);
  const topShare = total === 0 ? 0 : topAssignments / total;
  return { topShare, topCount, population: ranked.length, flag: topShare > CONCENTRATION_FLAG };
}
