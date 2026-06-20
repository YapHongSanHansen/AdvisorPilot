import type { Decision, Employee, Project } from "@/types";

/** An employee at or above this current utilization is flagged near/over capacity. */
export const NEAR_CAPACITY_THRESHOLD = 0.85;

export function utilization(e: Employee): number {
  if (e.weeklyCapacity <= 0) return 0;
  return e.allocatedHours / e.weeklyCapacity;
}

export function availableHours(e: Employee): number {
  return Math.max(0, e.weeklyCapacity - e.allocatedHours);
}

export type TeamCapacity = {
  team: string;
  capacity: number;
  allocated: number;
  available: number;
};
export type WorkloadPoint = { name: string; assignments: number };
export type NearCapacityRow = {
  id: string;
  name: string;
  team: string;
  utilization: number;
  available: number;
};
export type RecentDecision = {
  id: string;
  project: string;
  employee: string;
  isOverride: boolean;
  decidedAt: string;
};

export type DashboardMetrics = {
  totalPeople: number;
  openProjects: number;
  totalAvailableHours: number;
  overloadedCount: number;
  teamCapacity: TeamCapacity[];
  workloadDistribution: WorkloadPoint[];
  nearCapacity: NearCapacityRow[];
  recentDecisions: RecentDecision[];
};

/** I08 — derive every dashboard metric from the shared fixtures. Pure. */
export function computeDashboardMetrics(
  employees: Employee[],
  projects: Project[],
  decisions: Decision[],
): DashboardMetrics {
  const active = employees.filter((e) => e.active);

  const totalAvailableHours = active.reduce((sum, e) => sum + availableHours(e), 0);
  const overloaded = active.filter((e) => utilization(e) >= NEAR_CAPACITY_THRESHOLD);

  const teamMap = new Map<string, TeamCapacity>();
  for (const e of active) {
    const t = teamMap.get(e.team) ?? { team: e.team, capacity: 0, allocated: 0, available: 0 };
    t.capacity += e.weeklyCapacity;
    t.allocated += e.allocatedHours;
    t.available += availableHours(e);
    teamMap.set(e.team, t);
  }
  const teamCapacity = [...teamMap.values()].sort((a, b) => a.team.localeCompare(b.team));

  const workloadDistribution: WorkloadPoint[] = [...active]
    .map((e) => ({ name: e.name.split(" ")[0], assignments: e.assignmentsLast30Days }))
    .sort((a, b) => b.assignments - a.assignments);

  const nearCapacity: NearCapacityRow[] = [...overloaded]
    .map((e) => ({
      id: e.id,
      name: e.name,
      team: e.team,
      utilization: utilization(e),
      available: availableHours(e),
    }))
    .sort((a, b) => b.utilization - a.utilization);

  const nameById = new Map(employees.map((e) => [e.id, e.name]));
  const recentDecisions: RecentDecision[] = [...decisions]
    .sort((a, b) => b.decidedAt.localeCompare(a.decidedAt))
    .slice(0, 6)
    .map((d) => ({
      id: d.id,
      project: d.projectSnapshot.name,
      employee: nameById.get(d.selectedEmployeeId) ?? d.selectedEmployeeId,
      isOverride: d.isOverride,
      decidedAt: d.decidedAt,
    }));

  return {
    totalPeople: active.length,
    openProjects: projects.length,
    totalAvailableHours,
    overloadedCount: overloaded.length,
    teamCapacity,
    workloadDistribution,
    nearCapacity,
    recentDecisions,
  };
}
