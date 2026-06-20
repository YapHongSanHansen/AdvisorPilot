"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** J02 — running override rate (%) over the sequence of decisions. */
export function OverrideTrendChart({ data }: { data: { index: number; rate: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No decisions yet.
      </div>
    );
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="index" allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rate"
            name="Override rate %"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
