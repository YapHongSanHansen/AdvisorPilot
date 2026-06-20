"use client";

import { useState } from "react";
import { Loader2, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { seedEmployees } from "@/lib/data/employees";
import { DRAFT_DIMENSIONS, type WorkStyleDraft } from "@/lib/profile/schema";
import { draftToWorkStyle } from "@/lib/profile/validate";
import type { WorkStyle } from "@/types";

const selectClass =
  "h-9 w-56 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type Status = "idle" | "drafting" | "drafted" | "approving" | "approved" | "error";

export function ProfileDrafter() {
  const [employeeId, setEmployeeId] = useState(seedEmployees[0].id);
  const [status, setStatus] = useState<Status>("idle");
  const [draft, setDraft] = useState<WorkStyleDraft | null>(null);
  const [edited, setEdited] = useState<WorkStyle | null>(null);
  const [artifactSource, setArtifactSource] = useState("");

  const employee = seedEmployees.find((e) => e.id === employeeId) ?? seedEmployees[0];

  function reset() {
    setStatus("idle");
    setDraft(null);
    setEdited(null);
    setArtifactSource("");
  }

  async function handleDraft() {
    setStatus("drafting");
    setDraft(null);
    setEdited(null);
    try {
      const res = await fetch("/api/profile/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });
      if (!res.ok) throw new Error("draft failed");
      const data = await res.json();
      setDraft(data.draft);
      setEdited(draftToWorkStyle(data.draft));
      setArtifactSource(data.artifactSource ?? "");
      setStatus("drafted");
    } catch {
      setStatus("error");
    }
  }

  async function handleApprove() {
    if (!edited) return;
    setStatus("approving");
    try {
      const res = await fetch("/api/profile/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, workStyle: edited }),
      });
      if (!res.ok) throw new Error("approve failed");
      setStatus("approved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Draft a work-style profile</CardTitle>
            <CardDescription>
              Drafted from an approved work artifact only. A draft is a suggestion — it never
              affects scoring until the employee approves it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                className={selectClass}
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  reset();
                }}
              >
                {seedEmployees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleDraft} disabled={status === "drafting"}>
                {status === "drafting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Drafting…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Draft from artifact
                  </>
                )}
              </Button>
            </div>
            {status === "error" && (
              <p className="text-sm text-destructive">Could not draft a profile. Please try again.</p>
            )}
            {artifactSource && (
              <p className="text-xs text-muted-foreground">Source: {artifactSource}</p>
            )}
          </CardContent>
        </Card>

        {draft && edited && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Proposed profile</CardTitle>
              <CardDescription>
                Adjust any value, then approve. Confidence reflects how strong the evidence is.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {DRAFT_DIMENSIONS.map((dim) => {
                const d = draft[dim.key];
                return (
                  <div key={dim.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`p-${dim.key}`} className="text-sm font-medium text-slate-900">
                        {dim.label}
                      </label>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="tabular-nums text-muted-foreground">
                          confidence {Math.round(d.confidence * 100)}%
                        </span>
                        <span className="tabular-nums font-medium">
                          {edited[dim.key].toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {/* K07 — employee-editable slider */}
                    <input
                      id={`p-${dim.key}`}
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={edited[dim.key]}
                      onChange={(e) =>
                        setEdited((prev) =>
                          prev ? { ...prev, [dim.key]: Number(e.target.value) } : prev,
                        )
                      }
                      className="w-full accent-emerald-500"
                    />
                    {/* K06 — confidence beside each value */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${Math.round(d.confidence * 100)}%` }}
                      />
                    </div>
                    {d.evidence.length > 0 && (
                      <ul className="space-y-0.5">
                        {d.evidence.map((ev, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            “{ev}”
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
              {/* K08 — explicit approve action */}
              <Button
                onClick={handleApprove}
                disabled={status === "approving" || status === "approved"}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {status === "approved" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Profile approved
                  </>
                ) : status === "approving" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Approve & save profile"
                )}
              </Button>
              {status === "approved" && (
                <p className="text-center text-xs text-emerald-700">
                  Saved. This approved profile will now be used in future recommendations.
                </p>
              )}
            </CardFooter>
          </Card>
        )}
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confirmed profile</CardTitle>
            <CardDescription>{employee.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {DRAFT_DIMENSIONS.map((dim) => (
              <div key={dim.key} className="flex justify-between">
                <span className="text-muted-foreground">{dim.label}</span>
                <span className="tabular-nums">{employee.workStyle[dim.key].toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* K09 — guardrail disclosure */}
        <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          Scoring uses only the employee-approved profile. An unapproved draft never affects
          recommendations.
        </div>
      </aside>
    </div>
  );
}
