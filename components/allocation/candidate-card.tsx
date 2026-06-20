"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/shared/score-bar";
import { DEFAULT_SCORING_WEIGHTS } from "@/types";
import type { ScoredCandidate } from "@/lib/scoring";

const WEIGHT_ROWS = [
  { key: "skill", label: "Skill match", weight: DEFAULT_SCORING_WEIGHTS.skill },
  { key: "capacity", label: "Capacity", weight: DEFAULT_SCORING_WEIGHTS.capacity },
  { key: "workStyle", label: "Work-style fit", weight: DEFAULT_SCORING_WEIGHTS.workStyle },
  { key: "distribution", label: "Workload distribution", weight: DEFAULT_SCORING_WEIGHTS.distribution },
] as const;

export function CandidateCard({
  candidate,
  rank,
  recommended,
  selected,
  onSelect,
}: {
  candidate: ScoredCandidate;
  rank: number;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const util = Math.round(candidate.projectedUtilization * 100);

  return (
    <Card
      className={cn(
        "relative flex flex-col",
        recommended ? "ring-2 ring-emerald-500" : selected ? "ring-2 ring-slate-300" : undefined,
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{candidate.employeeName}</CardTitle>
              {recommended && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
                  Recommended
                </span>
              )}
              {selected && !recommended && (
                <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Selected
                </span>
              )}
            </div>
            <CardDescription>
              {candidate.team} · rank #{rank}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold tabular-nums text-slate-900">
              {candidate.scores.finalScore}
            </div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* G03 — available & projected capacity */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Available" value={`${candidate.availableHours} h`} />
          <Stat label="Projected utilization" value={`${util}%`} danger={util > 100} />
        </div>

        {/* G04–G07 — component score bars */}
        <div className="space-y-2">
          <ScoreBar label="Skill match" value={candidate.scores.skill} />
          <ScoreBar label="Capacity" value={candidate.scores.capacity} />
          <ScoreBar label="Work-style fit" value={candidate.scores.workStyle} />
          <ScoreBar label="Workload distribution" value={candidate.scores.distribution} />
        </div>

        {candidate.risks.length > 0 && (
          <ul className="space-y-1">
            {candidate.risks.map((r, i) => (
              <li key={i} className="text-xs text-amber-600">
                ⚠ {r}
              </li>
            ))}
          </ul>
        )}

        {/* G08 — plain-language reasons */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-900">Why this candidate</p>
          <ul className="space-y-1">
            {candidate.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* G10 — expandable "Why this score?" */}
        <div className="rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-slate-900"
          >
            Why this score?
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <div className="border-t border-slate-200 px-3 py-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left font-normal">Factor</th>
                    <th className="text-right font-normal">Score</th>
                    <th className="text-right font-normal">Weight</th>
                    <th className="text-right font-normal">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {WEIGHT_ROWS.map((row) => (
                    <tr key={row.key}>
                      <td className="py-0.5">{row.label}</td>
                      <td className="py-0.5 text-right tabular-nums">
                        {candidate.scores[row.key].toFixed(2)}
                      </td>
                      <td className="py-0.5 text-right tabular-nums text-muted-foreground">
                        ×{row.weight}
                      </td>
                      <td className="py-0.5 text-right tabular-nums">
                        {(candidate.scores[row.key] * row.weight * 100).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200 font-medium">
                    <td className="py-1">Final</td>
                    <td />
                    <td />
                    <td className="py-1 text-right tabular-nums">{candidate.scores.finalScore}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>

      {/* G12 — accept / choose-another */}
      <CardFooter>
        {recommended ? (
          <Button onClick={onSelect} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {selected ? "Accepted ✓" : "Accept recommendation"}
          </Button>
        ) : (
          <Button variant="outline" onClick={onSelect} className="w-full">
            {selected ? "Selected ✓" : "Choose this instead"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-base font-semibold tabular-nums",
          danger ? "text-red-600" : "text-slate-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}
