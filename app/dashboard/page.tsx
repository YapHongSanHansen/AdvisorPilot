import { Users, FolderKanban, Clock, AlertTriangle } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFixtures } from "@/lib/data";
import { computeDashboardMetrics } from "@/lib/dashboard/metrics";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TeamCapacityChart } from "@/components/dashboard/team-capacity-chart";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";

// Reads in-memory fixtures (incl. decisions recorded at runtime), so render per-request.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { employees, projects, decisions } = getFixtures();
  const m = computeDashboardMetrics(employees, projects, decisions);

  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        description="Capacity, workload distribution, and recent decisions across teams."
      />

      {/* I01–I03 — summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="People" value={m.totalPeople} icon={Users} hint={`${m.openProjects} open projects`} />
        <MetricCard label="Open projects" value={m.openProjects} icon={FolderKanban} />
        <MetricCard
          label="Available hours / week"
          value={m.totalAvailableHours}
          icon={Clock}
          accent="emerald"
        />
        <MetricCard
          label="Near / over capacity"
          value={m.overloadedCount}
          icon={AlertTriangle}
          accent={m.overloadedCount > 0 ? "amber" : "slate"}
          hint="≥ 85% utilized"
        />
      </div>

      {/* I04–I05 — charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamCapacityChart data={m.teamCapacity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workload distribution (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkloadDistributionChart data={m.workloadDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* I06–I07 — lists */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Near capacity</CardTitle>
          </CardHeader>
          <CardContent>
            {m.nearCapacity.length === 0 ? (
              <p className="text-sm text-muted-foreground">Everyone has healthy capacity.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {m.nearCapacity.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.team} · {r.available} h free
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-amber-600">
                      {Math.round(r.utilization * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent decisions</CardTitle>
          </CardHeader>
          <CardContent>
            {m.recentDecisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No allocation decisions yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {m.recentDecisions.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{d.employee}</p>
                      <p className="text-xs text-muted-foreground">{d.project}</p>
                    </div>
                    {d.isOverride && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Override
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
