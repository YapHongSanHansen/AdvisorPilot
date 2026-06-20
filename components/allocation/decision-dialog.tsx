"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  OVERRIDE_REASON_CODES,
  OVERRIDE_REASON_LABELS,
  type OverrideReasonCode,
  type Project,
} from "@/types";
import type { ScoredCandidate } from "@/lib/scoring";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function DecisionDialog({
  open,
  onOpenChange,
  candidate,
  recommendedId,
  recommendedName,
  project,
  candidates,
  onConfirmed,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  candidate: ScoredCandidate | null;
  recommendedId: string;
  recommendedName: string;
  project: Project;
  candidates: ScoredCandidate[];
  onConfirmed: (summary: { employeeName: string; isOverride: boolean }) => void;
}) {
  const [reasonCode, setReasonCode] = useState<OverrideReasonCode | "">("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    if (open) {
      setReasonCode("");
      setStatus("idle");
    }
  }, [open, candidate?.employeeId]);

  if (!candidate) return null;

  const isOverride = candidate.employeeId !== recommendedId;
  const utilPct = Math.round(candidate.projectedUtilization * 100); // H04
  const overCapacity = candidate.projectedUtilization > 1; // H05
  const nearCapacity = !overCapacity && candidate.projectedUtilization > 0.85;
  const firstName = candidate.employeeName.split(" ")[0];

  async function confirm() {
    if (!candidate) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedEmployeeId: candidate.employeeId,
          recommendedEmployeeId: recommendedId,
          isOverride,
          reasonCode: reasonCode || undefined,
          actor: "Demo Manager",
          project,
          candidates,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      onConfirmed({ employeeName: candidate.employeeName, isOverride });
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => onOpenChange(o)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isOverride ? "Override the recommendation?" : "Confirm allocation"}</DialogTitle>
          <DialogDescription>
            Assign <span className="font-medium text-foreground">{candidate.employeeName}</span> to{" "}
            {project.name}.{isOverride && <> Recommended: {recommendedName}.</>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {/* H04 / H05 — projected utilization + overload impact */}
          <div
            className={cn(
              "rounded-lg border px-3 py-2",
              overCapacity
                ? "border-red-300 bg-red-50"
                : nearCapacity
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-200 bg-slate-50",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Projected utilization</span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  overCapacity ? "text-red-600" : nearCapacity ? "text-amber-600" : "text-slate-900",
                )}
              >
                {utilPct}%
              </span>
            </div>
            {overCapacity && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle className="h-3.5 w-3.5" /> This would put {firstName} over 100% capacity.
              </p>
            )}
            {nearCapacity && (
              <p className="mt-1 text-xs text-amber-700">{firstName} would be approaching full capacity.</p>
            )}
          </div>

          {/* H03 — optional override reason codes */}
          {isOverride && (
            <div className="space-y-1.5">
              <label htmlFor="reason" className="font-medium text-slate-900">
                Reason (optional)
              </label>
              <select
                id="reason"
                className={selectClass}
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value as OverrideReasonCode | "")}
              >
                <option value="">— Select a reason —</option>
                {OVERRIDE_REASON_CODES.map((c) => (
                  <option key={c} value={c}>
                    {OVERRIDE_REASON_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-destructive">Could not record the decision. Please try again.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={status === "saving"}>
            Cancel
          </Button>
          <Button
            onClick={confirm}
            disabled={status === "saving"}
            className={isOverride ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
          >
            {status === "saving" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Recording…
              </>
            ) : isOverride ? (
              "Record override"
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
