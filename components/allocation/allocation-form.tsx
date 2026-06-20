"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SKILLS, SKILL_LABELS, PROFICIENCY_LEVELS } from "@/lib/data/skills";
import {
  allocationFormSchema,
  type AllocationFormValues,
} from "@/lib/validation/project";

const URGENCIES = ["low", "medium", "high"] as const;

const WORK_STYLE_DIMS: {
  key: keyof AllocationFormValues["workStyle"];
  label: string;
  low: string;
  high: string;
}[] = [
  { key: "ambiguity", label: "Ambiguity tolerance", low: "Needs clarity", high: "Thrives in ambiguity" },
  { key: "communication", label: "Communication detail", low: "Concise", high: "Detailed" },
  { key: "pace", label: "Delivery pace", low: "Steady", high: "Fast" },
  { key: "collaboration", label: "Collaboration", low: "Independent", high: "Highly collaborative" },
];

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AllocationForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationFormSchema),
    defaultValues: {
      name: "",
      requiredHours: 16,
      urgency: "medium",
      skills: [{ skill: "frontend", level: 3 }],
      workStyle: { ambiguity: 0.5, communication: 0.5, pace: 0.5, collaboration: 0.5 },
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });
  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      const payload = await res.json();
      sessionStorage.setItem("atlas:lastRecommendation", JSON.stringify(payload));
      router.push("/recommendations");
    } catch {
      setStatus("error");
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* F01 / F02 — project basics */}
        <Card>
          <CardHeader>
            <CardTitle>Project</CardTitle>
            <CardDescription>What needs staffing?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" placeholder="e.g. Customer Portal Refresh" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="requiredHours">Required hours / week</Label>
                <Input
                  id="requiredHours"
                  type="number"
                  min={1}
                  {...register("requiredHours", { valueAsNumber: true })}
                />
                {errors.requiredHours && (
                  <p className="text-sm text-destructive">{errors.requiredHours.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="urgency">Urgency</Label>
                <select id="urgency" className={selectClass} {...register("urgency")}>
                  {URGENCIES.map((u) => (
                    <option key={u} value={u}>
                      {u[0].toUpperCase() + u.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* F03–F05 — required skills */}
        <Card>
          <CardHeader>
            <CardTitle>Required skills</CardTitle>
            <CardDescription>
              Mandatory skills gate eligibility. Set the minimum proficiency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  {i === 0 && <Label>Skill</Label>}
                  <select className={selectClass} {...register(`skills.${i}.skill`)}>
                    {SKILLS.map((s) => (
                      <option key={s} value={s}>
                        {SKILL_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-40 space-y-1.5">
                  {i === 0 && <Label>Min level</Label>}
                  <select
                    className={selectClass}
                    {...register(`skills.${i}.level`, { valueAsNumber: true })}
                  >
                    {PROFICIENCY_LEVELS.map((p) => (
                      <option key={p.level} value={p.level}>
                        {p.level} · {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i)}
                  disabled={fields.length === 1}
                  aria-label="Remove skill"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.skills?.message && (
              <p className="text-sm text-destructive">{errors.skills.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ skill: "backend", level: 3 })}
            >
              <Plus className="h-4 w-4" /> Add skill
            </Button>
          </CardContent>
        </Card>

        {/* F06 — work-style sliders */}
        <Card>
          <CardHeader>
            <CardTitle>Preferred work style</CardTitle>
            <CardDescription>
              Describes how this project prefers to work (0–1). Not a measure of quality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {WORK_STYLE_DIMS.map((dim) => (
              <div key={dim.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`ws-${dim.key}`}>{dim.label}</Label>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {(values.workStyle?.[dim.key] ?? 0).toFixed(2)}
                  </span>
                </div>
                <input
                  id={`ws-${dim.key}`}
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full accent-emerald-500"
                  {...register(`workStyle.${dim.key}`, { valueAsNumber: true })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{dim.low}</span>
                  <span>{dim.high}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* F09 / F10 — submit, loading & failure */}
        <div className="space-y-3">
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              Could not generate recommendations. Please try again.
            </div>
          )}
          <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Ranking candidates…
              </>
            ) : (
              "Generate recommendations"
            )}
          </Button>
        </div>
      </form>

      {/* F08 — live summary panel */}
      <aside className="h-fit lg:sticky lg:top-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <SummaryRow label="Project" value={values.name || "—"} />
            <SummaryRow
              label="Required hours"
              value={Number.isFinite(values.requiredHours) ? `${values.requiredHours} h` : "—"}
            />
            <SummaryRow label="Urgency" value={values.urgency} />
            <Separator />
            <div>
              <p className="mb-1 font-medium text-foreground">Skills</p>
              <ul className="space-y-1">
                {(values.skills ?? []).map((s, i) => (
                  <li key={i} className="flex justify-between text-muted-foreground">
                    <span>{SKILL_LABELS[s.skill] ?? s.skill}</span>
                    <span>min {s.level}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <p className="mb-1 font-medium text-foreground">Work style</p>
              <ul className="space-y-1">
                {WORK_STYLE_DIMS.map((d) => (
                  <li key={d.key} className="flex justify-between text-muted-foreground">
                    <span>{d.label}</span>
                    <span className="tabular-nums">
                      {(values.workStyle?.[d.key] ?? 0).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize text-foreground">{value}</span>
    </div>
  );
}
