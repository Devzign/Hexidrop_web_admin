import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { CheckCircle2, MinusCircle, ShieldAlert } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import {
  ROLES, MODULES, ACTIONS,
  allowedActionsFor, visibleModulesFor,
  type Role as PermRole, type Module, type Action,
} from "@/lib/permissions";
import { cn } from "@/lib/utils";



type RoleCard = { id: string; name: string; members: number; description: string };

const INITIAL: RoleCard[] = [
  { name: "Admin", members: 6, description: "Full system access, security and finance controls" },
  { name: "Operations Manager", members: 4, description: "Dispatch, fleet, drivers and reports" },
  { name: "Finance", members: 2, description: "Payments, payouts, refunds and reports" },
  { name: "Support", members: 8, description: "Tickets, refunds, customer accounts" },
  { name: "Dispatcher", members: 3, description: "Order routing and driver assignment" },
  { name: "Marketing", members: 2, description: "CMS, broadcasts and campaigns" },
].map((r, i) => ({ id: `ROL-${20 + i}`, ...r }));

const FIELDS: FieldDef<RoleCard>[] = [
  { name: "name", label: "Role name" },
  { name: "members", label: "Members", type: "number" },
  { name: "description", label: "Description", full: true },
];

const ACTION_TONE: Record<Action, string> = {
  view: "bg-info/15 text-info",
  create: "bg-success/15 text-success",
  edit: "bg-warning/15 text-warning-foreground",
  delete: "bg-destructive/15 text-destructive",
  export: "bg-primary/15 text-primary",
};

export function RolesPage() {
  const crud = useCrud<RoleCard>(INITIAL, "Role");
  const [reviewRole, setReviewRole] = useState<PermRole>("Admin");
  const [onlyGaps, setOnlyGaps] = useState(false);

  const rows = useMemo(() => {
    return MODULES.map((m) => {
      const allowed = allowedActionsFor(reviewRole, m);
      const missing = ACTIONS.filter((a) => !allowed.includes(a));
      return { module: m, allowed, missing };
    });
  }, [reviewRole]);

  const visibleRows = onlyGaps ? rows.filter((r) => r.missing.length > 0) : rows;
  const coverage = useMemo(() => {
    const total = MODULES.length * ACTIONS.length;
    const granted = rows.reduce((sum, r) => sum + r.allowed.length, 0);
    return { granted, total, pct: Math.round((granted / total) * 100) };
  }, [rows]);
  const visibleModuleCount = visibleModulesFor(reviewRole).length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Platform", "Roles & Permissions"]}
        title="Roles & Permissions"
        subtitle="Fine-grained access control for the operations team"
        actions={
          <button
            onClick={() => crud.openCreate({ members: 0 })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            New role
          </button>
        }
      />

      {/* Role review — pick a role, inspect coverage & gaps */}
      <SectionCard
        title="Role settings review"
        subtitle="Inspect every module and action for the selected role — missing permissions are highlighted"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border bg-muted/40 p-0.5 text-xs">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setReviewRole(r)}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-medium transition-colors",
                    reviewRole === r
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1 text-xs font-medium">
              <input
                type="checkbox"
                checked={onlyGaps}
                onChange={(e) => setOnlyGaps(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              Only gaps
            </label>
          </div>
        }
      >
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <ReviewStat label="Visible modules" value={`${visibleModuleCount} / ${MODULES.length}`} />
          <ReviewStat label="Actions granted" value={`${coverage.granted} / ${coverage.total}`} />
          <ReviewStat label="Coverage" value={`${coverage.pct}%`} tone="primary" />
          <ReviewStat
            label="Gaps"
            value={String(rows.reduce((n, r) => n + r.missing.length, 0))}
            tone={reviewRole === "Admin" ? "success" : "warning"}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left">
                <th className="border-b border-border/80 bg-slate-100/90 dark:bg-slate-800/90 px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Module
                </th>
                {ACTIONS.map((a) => (
                  <th
                    key={a}
                    className="border-b border-border/80 bg-slate-100/90 dark:bg-slate-800/90 px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200"
                  >
                    {a}
                  </th>
                ))}
                <th className="border-b border-border/80 bg-slate-100/90 dark:bg-slate-800/90 px-4 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Missing
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => {
                const noAccess = r.allowed.length === 0;
                return (
                  <tr
                    key={r.module}
                    className={cn(
                      "border-b border-border/60 last:border-b-0",
                      noAccess && "bg-destructive/5",
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="font-mono text-xs">{r.module}</span>
                        {noAccess && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                            <ShieldAlert className="h-3 w-3" /> No access
                          </span>
                        )}
                      </div>
                    </td>
                    {ACTIONS.map((a) => {
                      const on = r.allowed.includes(a);
                      return (
                        <td key={a} className="px-3 py-2.5 text-center">
                          {on ? (
                            <span
                              className={cn(
                                "inline-flex h-6 items-center gap-1 rounded-full px-2 text-[10px] font-semibold",
                                ACTION_TONE[a],
                              )}
                              data-testid={`perm-${r.module}-${a}`}
                            >
                              <CheckCircle2 className="h-3 w-3" /> yes
                            </span>
                          ) : (
                            <span
                              className="inline-flex h-6 items-center gap-1 rounded-full bg-muted px-2 text-[10px] font-medium text-muted-foreground/70"
                              data-testid={`perm-${r.module}-${a}-missing`}
                            >
                              <MinusCircle className="h-3 w-3" /> —
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                      {r.missing.length === 0
                        ? "—"
                        : r.missing.map((a) => (
                            <span
                              key={a}
                              className="ml-1 inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium"
                            >
                              {a}
                            </span>
                          ))}
                    </td>
                  </tr>
                );
              })}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={ACTIONS.length + 2} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No gaps for {reviewRole} — every listed module has all actions granted.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {crud.rows.map((r) => (
          <div key={r.id} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.members} members</div>
                </div>
              </div>
              <RowActions module="roles" recordId={r.id} onEdit={() => crud.openEdit(r)} onDuplicate={() => crud.duplicate(r)} onDelete={() => crud.openDelete(r)} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{r.description}</p>
            <button
              onClick={() => setReviewRole(r.name as PermRole)}
              className="mt-3 text-[11px] font-semibold text-primary hover:underline"
            >
              Review permissions →
            </button>
          </div>
        ))}
      </div>

      <RecordEditor<RoleCard> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit role" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as RoleCard), ...next })} />
      <RecordEditor<RoleCard> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New role" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `ROL-${40 + Math.floor(Math.random() * 999)}` } as RoleCard)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete role?" description={crud.deleting ? `${crud.deleting.name} will be removed. Members will need to be reassigned.` : ""} />
    </div>
  );
}

function ReviewStat({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "primary" | "success" | "warning" }) {
  const toneCls = {
    muted: "bg-muted/40",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  }[tone];
  return (
    <div className={cn("rounded-xl border px-4 py-3", toneCls)}>
      <div className="text-[11px] font-semibold uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default RolesPage;
