"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Fixed display order so colours are stable across renders.
const PERSONA_ORDER = [
  "Digital Native",
  "Bill Payer",
  "On-the-Go Professional",
  "First-Timer",
];

const BASE_COLORS: Record<string, string> = {
  "Digital Native": "#fdba74",
  "Bill Payer": "#fcd34d",
  "On-the-Go Professional": "#fca5a5",
  "First-Timer": "#bfdbfe",
};

const MATCHED_COLOR = "#ea580c"; // brand-600

export default function PersonaChart({
  clusterSizes,
  matchedPersona,
}: {
  clusterSizes: Record<string, number>;
  matchedPersona: string;
}) {
  const data = PERSONA_ORDER.filter((p) => p in clusterSizes).map((p) => ({
    name: p,
    value: Math.round((clusterSizes[p] ?? 0) * 1000) / 10, // % with 1 decimal
    matched: p === matchedPersona,
  }));

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={42}
              outerRadius={72}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell
                  key={d.name}
                  fill={d.matched ? MATCHED_COLOR : BASE_COLORS[d.name]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number, n: string) => [`${v}%`, n]}
              contentStyle={{ borderRadius: 12, fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full space-y-1.5 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                backgroundColor: d.matched ? MATCHED_COLOR : BASE_COLORS[d.name],
              }}
            />
            <span
              className={
                d.matched ? "font-semibold text-slate-900" : "text-slate-600"
              }
            >
              {d.name}
            </span>
            <span className="ml-auto tabular-nums text-slate-500">
              {d.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
