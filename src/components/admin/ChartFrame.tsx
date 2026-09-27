import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standardized chart container used across all analytics screens.
 * Fixed heights keep dashboards visually consistent regardless of the
 * chart library used inside.
 */
export function ChartFrame({
  height = "md",
  children,
  className,
}: {
  height?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
}) {
  const h = height === "sm" ? "h-[180px]" : height === "lg" ? "h-[340px]" : "h-[280px]";
  return <div className={cn("w-full", h, className)}>{children}</div>;
}

/** Standard legend styling (colors + spacing) applied through wrapperStyle. */
export const chartLegendProps = {
  wrapperStyle: { fontSize: 11, paddingTop: 8 } as const,
  iconType: "circle" as const,
  verticalAlign: "bottom" as const,
  height: 28,
};

/** Standard tooltip content styling. */
export const chartTooltipProps = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 12,
  },
};

/** Shared axis tick styling. */
export const chartAxisTick = { fontSize: 11, fill: "var(--muted-foreground)" };
