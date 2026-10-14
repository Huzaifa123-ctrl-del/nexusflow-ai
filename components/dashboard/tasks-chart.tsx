"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(160 60% 42%)"];

export function TasksChart({ todo, doing, done }: { todo: number; doing: number; done: number }) {
  const data = [
    { name: "To do", value: todo },
    { name: "Doing", value: doing },
    { name: "Done", value: done },
  ];
  return (
    <div className="h-64 w-full" role="img" aria-label={`Tasks: ${todo} to do, ${doing} doing, ${done} done`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            cursor={{ fill: "hsl(var(--accent))" }}
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
