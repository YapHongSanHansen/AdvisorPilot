"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CandidateCard } from "./candidate-card";
import type { Project } from "@/types";
import type { RankingResult, ScoredCandidate } from "@/lib/scoring";

type Payload = { project: Project; result: RankingResult };
const STORAGE_KEY = "atlas:lastRecommendation";

export function RecommendationView() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Payload;
        setPayload(parsed);
        setSelectedId(parsed.result.top[0]?.employeeId ?? null);
      }
    } catch {
      // ignore malformed storage
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (!payload) return <EmptyState />;

  const { project, result } = payload;

  // G11 — no valid candidate
  if (result.eligible.length === 0) {
    return <NoValidCandidates project={project} closest={result.ineligible} />;
  }

  const recommendedId = result.top[0]?.employeeId;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Top {result.top.length} of {result.eligible.length}{" "}
        {result.eligible.length === 1 ? "eligible candidate" : "eligible candidates"} for{" "}
        <span className="font-medium text-foreground">{project.name}</span>.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {result.top.map((candidate, i) => (
          <CandidateCard
            key={candidate.employeeId}
            candidate={candidate}
            rank={i + 1}
            recommended={candidate.employeeId === recommendedId}
            selected={candidate.employeeId === selectedId}
            onSelect={() => setSelectedId(candidate.employeeId)}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No recommendation yet. Start a new allocation to rank candidates.
        </p>
        <Link href="/allocate" className={cn(buttonVariants())}>
          New allocation
        </Link>
      </CardContent>
    </Card>
  );
}

function NoValidCandidates({
  project,
  closest,
}: {
  project: Project;
  closest: ScoredCandidate[];
}) {
  const top = [...closest]
    .sort((a, b) => b.scores.finalScore - a.scores.finalScore)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <Card className="border-amber-300 bg-amber-50">
        <CardContent className="py-5">
          <p className="font-medium text-amber-900">No eligible candidate for {project.name}.</p>
          <p className="mt-1 text-sm text-amber-800">
            No one currently passes all hard requirements (availability + mandatory skills). The
            closest people are shown below for context — they are not valid recommendations.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {top.map((c) => (
          <Card key={c.employeeId} className="opacity-80">
            <CardContent className="space-y-2 py-4">
              <p className="font-medium text-slate-900">{c.employeeName}</p>
              <p className="text-xs text-muted-foreground">{c.team}</p>
              <ul className="space-y-1">
                {c.risks.map((r, i) => (
                  <li key={i} className="text-xs text-red-600">
                    ✕ {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Link href="/allocate" className={cn(buttonVariants({ variant: "outline" }))}>
        Adjust requirements
      </Link>
    </div>
  );
}
