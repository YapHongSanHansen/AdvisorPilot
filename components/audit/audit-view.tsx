"use client";

import { useMemo, useState } from "react";
import { Percent, ListChecks, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OverrideTrendChart } from "./override-trend-chart";
import {
  computeAuditMetrics,
  computeConcentration,
  type AuditDecision,
  type AuditEmployee,
} from "@/lib/audit/metrics";
import { OVERRIDE_REASON_LABELS } from "@/types";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AuditView({
  decisions,
  employees,
  teams,
  managers,
}: {
  decisions: AuditDecision[];
  employees: AuditEmployee[];
  teams: string[];
  managers: string[];
}) {
  const [team, setTeam] = useState("all");
  const [manager, setManager] = useState("all");

  const filtered = useMemo(
    () =>
      decisions.filter(
        (d) => (team === "all" || d.team === team) && (manager === "all" || d.actor === manager),
      ),
    [decisions, team, manager],
  );
  const metrics = useMemo(() => computeAuditMetrics(filtered), [filtered]);
  const teamEmployees = useMemo(
    () => employees.filter((e) => team === "all" || e.team === team),
    [employees, team],
  );
  const concentration = useMemo(() => computeConcentration(teamEmployees), [teamEmployees]);

  return (
    <div className="space-y-6">
      {/* J05 — filters */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Team</span>
          <select className={selectClass} value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">All teams</option>
            {teams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Manager</span>
          <select
            className={selectClass}
            value={manager}
            onChange={(e) => setManager(e.target.value)}
          >
            <option value="all">All managers</option>
            {managers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* J06 / J07 / J09 — review flags (prompts, not findings) */}
      {metrics.highOverrideFlag && (
        <ReviewFlag
          title={`Override rate ${Math.round(metrics.overrideRate * 100)}% over ${metrics.total} decisions`}
          body="Above the 30% review threshold."
        />
      )}
      {concentration.flag && (
        <ReviewFlag
          title={`Workload concentration ${Math.round(concentration.topShare * 100)}%`}
          body={`The busiest ${concentration.topCount} of ${concentration.population} hold most recent assignments — above the 40% review threshold.`}
        />
      )}

      {/* J01 / J04 — cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Override rate"
          value={`${Math.round(metrics.overrideRate * 100)}%`}
          icon={Percent}
          hint={`${metrics.overrides} of ${metrics.total} decisions`}
          accent={metrics.highOverrideFlag ? "amber" : "slate"}
        />
        <MetricCard label="Total decisions" value={metrics.total} icon={ListChecks} />
        <MetricCard
          label="Workload concentration"
          value={`${Math.round(concentration.topShare * 100)}%`}
          icon={ShieldAlert}
          hint={`busiest ${concentration.topCount} of ${concentration.population}`}
          accent={concentration.flag ? "amber" : "slate"}
        />
        <MetricCard label="Overrides" value={metrics.overrides} />
      </div>

      {/* J02 trend + J03 reasons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Override rate trend</CardTitle>
          </CardHeader>
          <CardContent>
            <OverrideTrendChart data={metrics.trend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Override reasons</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.reasonSummary.length === 0 ? (
              <p className="text-sm text-muted-foreground">No override reasons recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {metrics.reasonSummary.map((r) => (
                  <li key={r.code} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-700">{r.label}</span>
                    <span className="font-medium tabular-nums">{r.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* J08 — decision history table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision history</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No decisions recorded yet. Accept or override a recommendation to populate this.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-3 font-normal">Employee</th>
                    <th className="py-2 pr-3 font-normal">Team</th>
                    <th className="py-2 pr-3 font-normal">Project</th>
                    <th className="py-2 pr-3 font-normal">Decision</th>
                    <th className="py-2 pr-3 font-normal">Reason</th>
                    <th className="py-2 font-normal">Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.history.map((d) => (
                    <tr key={d.id} className="border-b border-slate-100">
                      <td className="py-2 pr-3 font-medium text-slate-900">{d.employeeName}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{d.team}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{d.project}</td>
                      <td className="py-2 pr-3">
                        {d.isOverride ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Override
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Accepted
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {d.reasonCode ? OVERRIDE_REASON_LABELS[d.reasonCode] : "—"}
                      </td>
                      <td className="py-2 text-muted-foreground">{d.actor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewFlag({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div className="text-sm">
        <p className="font-medium text-amber-900">{title}</p>
        <p className="text-amber-800">{body}</p>
        {/* J09 */}
        <p className="mt-1 text-xs text-amber-700">
          This is a prompt for human review, not a finding of misconduct.
        </p>
      </div>
    </div>
  );
}
