import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/data";
import { decisionRequestSchema } from "@/lib/validation/decision";
import { DEFAULT_SCORING_WEIGHTS } from "@/types";
import type { AuditEvent, Decision, Project, RankedCandidate } from "@/types";

/**
 * POST /api/decisions — record an accept or override.
 * H06 saves a recommendation snapshot, H07 the selected employee, H08 actor/timestamp/
 * override flag; also logs an audit event and reflects the new commitment on the
 * selected employee so the dashboard updates.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = decisionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid decision", issues: parsed.error.issues }, { status: 400 });
  }

  const { selectedEmployeeId, recommendedEmployeeId, isOverride, reasonCode, actor } = parsed.data;
  const project = parsed.data.project as Project;
  const candidates = parsed.data.candidates as RankedCandidate[];

  const fx = getFixtures();
  const ts = Date.now();
  const now = new Date(ts).toISOString();

  const decision: Decision = {
    id: `dec-${ts}`,
    projectId: project?.id ?? "unknown",
    recommendationId: `rec-${ts}`,
    projectSnapshot: project,
    candidates,
    weights: DEFAULT_SCORING_WEIGHTS,
    recommendedEmployeeId,
    selectedEmployeeId,
    isOverride,
    reasonCode,
    actor,
    decidedAt: now,
  };
  fx.decisions.unshift(decision);

  // Reflect the new commitment on the selected employee (capacity + recent assignments).
  const employee = fx.employees.find((e) => e.id === selectedEmployeeId);
  if (employee && project) {
    employee.allocatedHours += project.requiredHours;
    employee.assignmentsLast30Days += 1;
  }

  const event: AuditEvent = {
    id: `evt-${ts}`,
    type: isOverride ? "override_recorded" : "decision_recorded",
    at: now,
    actor,
    projectId: decision.projectId,
    employeeId: selectedEmployeeId,
    detail: isOverride ? `Override${reasonCode ? `: ${reasonCode}` : ""}` : "Accepted recommendation",
  };
  fx.auditEvents.unshift(event);

  const projectedUtilization =
    employee && employee.weeklyCapacity > 0
      ? employee.allocatedHours / employee.weeklyCapacity
      : null;

  return NextResponse.json({ ok: true, decision, projectedUtilization });
}
