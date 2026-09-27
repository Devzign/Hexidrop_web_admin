import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const tones = {
  success:
    "bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-xs dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-600/50",
  warning:
    "bg-amber-50 text-amber-900 border border-amber-300/80 shadow-xs dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-600/50",
  destructive:
    "bg-rose-50 text-rose-900 border border-rose-300/80 shadow-xs dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-600/50",
  info:
    "bg-sky-50 text-sky-900 border border-sky-300/80 shadow-xs dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-600/50",
  muted:
    "bg-slate-100 text-slate-800 border border-slate-300/80 shadow-xs dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-600/50",
  primary:
    "bg-emerald-50 text-emerald-900 border border-emerald-300/80 shadow-xs dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-600/50",
} as const;

export type Tone = keyof typeof tones;

export function StatusBadge({
  label,
  tone = "muted",
  dot = true,
  className,
}: {
  label: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  const dotColor: Record<Tone, string> = {
    success: "bg-emerald-600 dark:bg-emerald-400",
    warning: "bg-amber-600 dark:bg-amber-400",
    destructive: "bg-rose-600 dark:bg-rose-400",
    info: "bg-sky-600 dark:bg-sky-400",
    muted: "bg-slate-500 dark:bg-slate-400",
    primary: "bg-emerald-600 dark:bg-emerald-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-normal",
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor[tone])} />}
      {label}
    </span>
  );
}

const STATUS_TONE: Record<string, Tone> = {
  Completed: "success",
  Delivered: "success",
  Success: "success",
  Online: "success",
  Confirmed: "success",
  "In Transit": "info",
  "In Progress": "info",
  "On Trip": "info",
  Assigned: "primary",
  Scheduled: "primary",
  Packing: "warning",
  Pending: "warning",
  Refunded: "muted",
  Offline: "muted",
  Cancelled: "destructive",
  Failed: "destructive",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return <StatusBadge label={status} tone={STATUS_TONE[status] ?? "muted"} />;
}
