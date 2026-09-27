import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, ShieldX, Filter } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ExportButton } from "@/components/admin/ExportButton";
import { subscribeAudit, clearAudit, formatRelativeTime, type AuditEntry } from "@/lib/audit-log";
import { ROLES } from "@/lib/permissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";



const LOGINS = [
  { u: "Kudzai Moyo", ip: "196.4.72.14", loc: "Harare, ZW", device: "Chrome · macOS", ok: true, t: "Today 07:22" },
  { u: "Chipo Ncube", ip: "196.4.180.4", loc: "Harare, ZW", device: "Safari · iPhone", ok: true, t: "Today 06:58" },
  { u: "Tafadzwa Moyo", ip: "41.220.212.7", loc: "Bulawayo, ZW", device: "Chrome · Windows", ok: true, t: "Yesterday 21:11" },
  { u: "unknown@…", ip: "45.90.128.9", loc: "Unknown", device: "curl", ok: false, t: "Yesterday 19:32" },
];

export function AuditLogsPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [outcome, setOutcome] = useState<"all" | "allowed" | "denied">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | (typeof ROLES)[number]>("all");
  const [, forceTick] = useState(0);

  useEffect(() => subscribeAudit(setEntries), []);
  // Re-render every 30s to refresh "Xm ago" labels.
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (outcome !== "all" && e.outcome !== outcome) return false;
      if (roleFilter !== "all" && e.role !== roleFilter) return false;
      return true;
    });
  }, [entries, outcome, roleFilter]);

  const stats = useMemo(() => ({
    total: entries.length,
    denied: entries.filter((e) => e.outcome === "denied").length,
    allowed: entries.filter((e) => e.outcome === "allowed").length,
  }), [entries]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Platform", "Audit Logs"]}
        title="Audit Logs"
        subtitle="Every allowed and denied module/action attempt across the console"
        actions={
          <>
            <button
              onClick={() => { clearAudit(); toast.success("Audit trail cleared"); }}
              className="h-9 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent"
            >
              Clear
            </button>
            <ExportButton
              module="audit-logs"
              label="Download"
              format="CSV"
              variant="primary"
              onExport={() => {
                const rows = [
                  ["timestamp", "user", "role", "module", "action", "route", "outcome", "detail"],
                  ...filtered.map((e) => [
                    new Date(e.ts).toISOString(),
                    e.user, e.role, e.module, e.action, e.route, e.outcome, e.detail ?? "",
                  ]),
                ];
                // In a real app, trigger a download. Here we just log.
                console.info("[audit-export]", rows.length - 1, "rows");
              }}
            />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total events" value={stats.total} tone="muted" icon={<Filter className="h-4 w-4" />} />
        <StatCard label="Allowed" value={stats.allowed} tone="success" icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Denied" value={stats.denied} tone="destructive" icon={<ShieldX className="h-4 w-4" />} />
      </div>

      <SectionCard
        title="Permission attempts"
        subtitle={`${filtered.length} of ${entries.length} events`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border bg-muted/40 p-0.5 text-xs">
              {(["all", "allowed", "denied"] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setOutcome(o)}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-medium capitalize transition-colors",
                    outcome === o ? "bg-card shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="h-8 rounded-lg border bg-card px-2 text-xs font-medium"
            >
              <option value="all">All roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        }
        padding="none"
      >
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            No events yet — navigate around the console or use row actions to generate entries.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="text-left">
                  {["When", "User", "Role", "Module", "Action", "Route", "Outcome", "Detail"].map((h) => (
                    <th key={h} className="border-b border-border/80 bg-slate-100/90 dark:bg-slate-800/90 px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b border-border/70 last:border-b-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40" data-testid="audit-row">
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatRelativeTime(e.ts)}</td>
                    <td className="px-4 py-2.5 font-semibold text-foreground">{e.user}</td>
                    <td className="px-4 py-2.5"><StatusBadge tone="muted" label={e.role} dot={false} /></td>
                    <td className="px-4 py-2.5 font-semibold text-xs text-foreground">{e.module}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold capitalize text-foreground">{e.action}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{e.route}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge
                        tone={e.outcome === "allowed" ? "success" : "destructive"}
                        label={e.outcome}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{e.detail ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Login history" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {["User", "IP", "Location", "Device", "Status", "Time"].map((h) => (
                  <th key={h} className="border-b border-border/80 bg-slate-100/90 dark:bg-slate-800/90 px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGINS.map((l, i) => (
                <tr key={i} className="border-b border-border/70 last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{l.u}</td>
                  <td className="px-4 py-2.5 text-xs font-medium text-foreground">{l.ip}</td>
                  <td className="px-4 py-2.5 text-foreground">{l.loc}</td>
                  <td className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{l.device}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge tone={l.ok ? "success" : "destructive"} label={l.ok ? "Success" : "Blocked"} />
                  </td>
                  <td className="px-4 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{l.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value, tone, icon }: { label: string; value: number; tone: "success" | "destructive" | "muted"; icon: React.ReactNode }) {
  const toneCls = {
    success: "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300",
    destructive: "bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300",
    muted: "bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:text-slate-200",
  }[tone];
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneCls)}>{icon}</div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{label}</div>
        <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{value.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default AuditLogsPage;
