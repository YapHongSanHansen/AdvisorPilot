import { PageContainer, PageHeader } from "@/components/shared/page-container";
import { getFixtures } from "@/lib/data";
import { toAuditDecisions } from "@/lib/audit/metrics";
import { AuditView } from "@/components/audit/audit-view";

export const dynamic = "force-dynamic";

export default function AuditPage() {
  const { decisions, employees } = getFixtures();

  const auditDecisions = toAuditDecisions(decisions, employees);
  const auditEmployees = employees.map((e) => ({
    id: e.id,
    name: e.name,
    team: e.team,
    assignmentsLast30Days: e.assignmentsLast30Days,
  }));
  const teams = [...new Set(employees.map((e) => e.team))].sort();
  const managers = [...new Set(decisions.map((d) => d.actor))].sort();

  return (
    <PageContainer>
      <PageHeader
        title="Leadership audit"
        description="Override patterns, workload concentration, and decision history. Flags are prompts for review, not findings."
      />
      <AuditView
        decisions={auditDecisions}
        employees={auditEmployees}
        teams={teams}
        managers={managers}
      />
    </PageContainer>
  );
}
