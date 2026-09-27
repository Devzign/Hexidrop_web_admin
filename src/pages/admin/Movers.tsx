import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { MOVING_JOBS, MOVER_TEAMS, type MovingJob } from "@/lib/mock-data";
import { PackageCheck, Boxes, Home, Building2, Camera, ClipboardCheck } from "lucide-react";

const MOVER_FIELDS: FieldDef<MovingJob>[] = [
  { name: "customer", label: "Customer" },
  { name: "team", label: "Team", type: "select", options: MOVER_TEAMS },
  { name: "type", label: "Type", type: "select", options: ["House Move", "Office Relocation", "Furniture", "Heavy Item"] },
  { name: "from", label: "From", full: true },
  { name: "to", label: "To", full: true },
  { name: "crew", label: "Crew size", type: "number" },
  { name: "price", label: "Price ($)", type: "number" },
  { name: "date", label: "Date", type: "date" },
  { name: "status", label: "Status", type: "select", options: ["Scheduled", "In Progress", "Packing", "Delivered", "Confirmed"] },
];



export function MoversPage() {
  const crud = useCrud<MovingJob>(MOVING_JOBS, "Moving job");
  const columns: Column<MovingJob>[] = [
    { key: "id", header: "Job", render: (r) => <span className="font-mono text-[13px] font-semibold">{r.id}</span> },
    { key: "customer", header: "Customer" },
    { key: "team", header: "Team", render: (r) => <StatusBadge tone="primary" label={r.team} dot={false} /> },
    { key: "type", header: "Type", render: (r) => <StatusBadge tone="muted" label={r.type} dot={false} /> },
    { key: "route", header: "Route", render: (r) => (
      <div className="text-[12px] leading-tight">
        <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" /><span className="truncate">{r.from}</span></div>
        <div className="mt-0.5 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-destructive" /><span className="truncate">{r.to}</span></div>
      </div>
    ) },
    { key: "crew", header: "Crew", align: "center", render: (r) => (
      <div className="flex -space-x-1.5 justify-center">
        {Array.from({ length: Math.min(r.crew, 4) }).map((_, i) => (
          <span key={i} className="h-6 w-6 rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground ring-2 ring-card flex items-center justify-center">{i + 1}</span>
        ))}
        {r.crew > 4 && <span className="h-6 w-6 rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-card flex items-center justify-center">+{r.crew - 4}</span>}
      </div>
    ) },
    { key: "price", header: "Price", align: "right", render: (r) => <span className="font-semibold tabular-nums">${r.price.toLocaleString()}</span> },
    { key: "date", header: "Date", render: (r) => <span className="text-[12px] text-muted-foreground">{r.date}</span> },
    { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
    { key: "actions", header: "", render: (r) => (
      <RowActions
        onEdit={() => crud.openEdit(r)}
        onDuplicate={() => crud.duplicate(r)}
        onDelete={() => crud.openDelete(r)}
      />
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Operations", "Movers & Packers"]}
        title="Movers & Packers"
        subtitle="Dedicated relocation crews for house moves, office moves and heavy items"
        actions={
          <>
            <button className="h-9 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">Damage reports</button>
            <button
              onClick={() => crud.openCreate({ type: "House Move", status: "Scheduled", crew: 3, price: 0, date: new Date().toISOString().slice(0, 10) })}
              className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >Schedule job</button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <TypeStat icon={<Home className="h-5 w-5" />} label="House moves" value="28" tone="primary" />
        <TypeStat icon={<Building2 className="h-5 w-5" />} label="Office relocations" value="12" tone="info" />
        <TypeStat icon={<PackageCheck className="h-5 w-5" />} label="Furniture" value="6" tone="warning" />
        <TypeStat icon={<Boxes className="h-5 w-5" />} label="Heavy items" value="4" tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Moving teams" subtitle={`${MOVER_TEAMS.length} active crews`} padding="none">
          <ul className="divide-y">
            {MOVER_TEAMS.map((t, i) => (
              <li key={t} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {t.split(" ")[1]?.[0] ?? t[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-[11px] text-muted-foreground">{4 + (i % 3)} crew · {['Harare','Bulawayo','Mutare','Gweru'][i % 4]}</div>
                </div>
                <StatusBadge tone={i % 3 === 0 ? "info" : "success"} label={i % 3 === 0 ? "On job" : "Available"} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Job checklist" subtitle="MOV-892 · Team Baobab" className="lg:col-span-2">
          <ul className="space-y-2.5">
            {[
              { t: "Site survey and quotation", d: true },
              { t: "Packing materials delivered", d: true },
              { t: "Pickup photos captured", d: true, icon: <Camera className="h-3.5 w-3.5" /> },
              { t: "Furniture disassembly", d: true },
              { t: "Loading and transit", d: true },
              { t: "Unloading and placement", d: false },
              { t: "Delivery photos captured", d: false, icon: <Camera className="h-3.5 w-3.5" /> },
              { t: "Customer signature", d: false, icon: <ClipboardCheck className="h-3.5 w-3.5" /> },
              { t: "Damage report", d: false },
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border bg-secondary/30 px-3 py-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-md ${s.d ? "bg-success text-success-foreground" : "border bg-card text-muted-foreground"}`}>
                  {s.d ? "✓" : ""}
                </span>
                <span className={`flex-1 text-sm ${s.d ? "" : "text-muted-foreground"}`}>{s.t}</span>
                {s.icon}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Moving jobs" subtitle={`${crud.rows.length} scheduled or in progress`} padding="none">
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

      <RecordEditor<MovingJob>
        open={!!crud.editing}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit moving job"
        fields={MOVER_FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as MovingJob), ...next })}
      />
      <RecordEditor<MovingJob>
        open={!!crud.creating}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="Schedule moving job"
        fields={MOVER_FIELDS}
        value={crud.creating}
        onSubmit={(next) =>
          crud.saveCreate({
            ...crud.creating,
            ...next,
            id: `MOV-${900 + Math.floor(Math.random() * 999)}`,
          } as MovingJob)
        }
      />
      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Cancel moving job?"
        description={crud.deleting ? `${crud.deleting.id} will be cancelled and removed.` : ""}
      />
    </div>
  );
}

function TypeStat({
  icon, label, value, tone,
}: {
  icon: React.ReactNode; label: string; value: string;
  tone: "primary" | "info" | "warning" | "success";
}) {
  const t = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/12 text-success",
  } as const;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t[tone]}`}>{icon}</div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default MoversPage;
