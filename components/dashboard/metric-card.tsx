import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "slate",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: "emerald" | "amber" | "slate";
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "amber"
        ? "text-amber-600"
        : "text-slate-400";

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-2 py-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && <Icon className={cn("h-5 w-5 shrink-0", accentClass)} />}
      </CardContent>
    </Card>
  );
}
