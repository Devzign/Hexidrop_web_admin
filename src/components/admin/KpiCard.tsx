import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon,
  tone = "default",
  spark,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "gold";
  spark?: number[];
}) {
  const trend = delta?.startsWith("-") ? "down" : "up";
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant",
        tone === "primary" && "bg-gradient-primary border-transparent text-primary-foreground",
        tone === "gold" && "bg-gradient-gold border-transparent text-brand-navy",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              tone === "default" ? "text-slate-600 dark:text-slate-300" : "text-current/90",
            )}
          >
            {label}
          </p>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
          {hint && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                tone === "default" ? "text-slate-500 dark:text-slate-400" : "text-current/80",
              )}
            >
              {hint}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 shrink-0",
              tone === "default"
                ? "bg-secondary/70 shadow-sm"
                : tone === "primary"
                ? "bg-white/20 backdrop-blur-md shadow-inner"
                : "bg-white/30 backdrop-blur-md shadow-sm",
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-xs",
              tone !== "default"
                ? "bg-white/25 text-current backdrop-blur-sm"
                : trend === "up"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300/80 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-600/50"
                : "bg-rose-50 text-rose-900 border border-rose-300/80 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-600/50",
            )}
          >
            {trend === "up" ? "↑" : "↓"} {delta.replace("-", "")}
          </span>
        )}
        {spark && <Sparkline data={spark} tone={tone} />}
      </div>
    </div>
  );
}

function Sparkline({ data, tone }: { data: number[]; tone: "default" | "primary" | "gold" }) {
  const w = 88;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke =
    tone === "default" ? "var(--primary)" : tone === "gold" ? "var(--brand-navy)" : "white";
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default KpiCard;
