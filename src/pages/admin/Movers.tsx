import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { MOVING_JOBS, MOVER_TEAMS, type MovingJob } from "@/lib/mock-data";
import {
  PackageCheck, Boxes, Home, Building2, Camera, ClipboardCheck,
  Eye, X, Truck, Phone, MapPin, Users, Calendar, ShieldCheck, DollarSign
} from "lucide-react";
import { toast } from "sonner";

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
  const [openJob, setOpenJob] = useState<MovingJob | null>(null);

  const columns: Column<MovingJob>[] = [
    { key: "id", header: "Job", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenJob(r); }}
        className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
        title="View moving job details"
      >
        <span>{r.id}</span>
        <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
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
        onView={() => setOpenJob(r)}
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
        <DataTable columns={columns} rows={crud.rows} onRowClick={(row) => setOpenJob(row as MovingJob)} />
      </SectionCard>

      {/* Moving Job Details Drawer */}
      {openJob && (
        <MoverJobDrawer
          job={openJob}
          onClose={() => setOpenJob(null)}
        />
      )}

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

function MoverJobDrawer({ job, onClose }: { job: MovingJob; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <aside
        className="relative flex h-full w-full max-w-[580px] flex-col overflow-hidden bg-card shadow-elegant border-l animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-sm">
              <Boxes className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{job.id}</h3>
                <OrderStatusBadge status={job.status} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{job.type}</span>
                <span>•</span>
                <span>{job.date}</span>
                <span>•</span>
                <span className="font-semibold text-primary">{job.team}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Job Price</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">${job.price.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Crew Allocated</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">{job.crew} Packers</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Est. Duration</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-primary font-semibold">5 - 7 Hours</div>
            </div>
          </div>

          {/* Customer & Team Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Customer</div>
              <div className="mt-1.5 text-sm font-bold text-foreground">{job.customer}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">+263 77 241 8902</div>
              <div className="mt-2 text-[11px] text-muted-foreground font-medium">Zimbabwe Residential Move</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Dedicated Crew</div>
              <div className="mt-1.5 text-sm font-bold text-foreground">{job.team}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Lead: Tinashe Chitepo</div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-3 w-3" /> Insured & Vetted
              </div>
            </div>
          </div>

          {/* Relocation Route */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Relocation Route</div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 h-3 w-3 rounded-full bg-primary shrink-0 ring-4 ring-primary/10" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Origin (Pickup)</div>
                  <div className="text-sm font-semibold text-foreground">{job.from}</div>
                </div>
              </div>
              <div className="ml-1.5 h-4 border-l-2 border-dashed border-border" />
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 h-3 w-3 rounded-full bg-destructive shrink-0 ring-4 ring-destructive/10" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Destination (Dropoff)</div>
                  <div className="text-sm font-semibold text-foreground">{job.to}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Move Checklist Status */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Checklist</div>
              <span className="text-xs font-semibold text-foreground">3 of 5 Steps Complete</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { title: "Pre-move Survey & Inventory Assessment", done: true },
                { title: "Packaging Material Delivery (Boxes, Bubble Wrap)", done: true },
                { title: "Furniture Dismantling & Protected Loading", done: true },
                { title: "Direct Transit to Destination Address", done: job.status === "In Progress" || job.status === "Delivered" },
                { title: "Reassembly, Placement & Final Client Sign-off", done: job.status === "Delivered" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2.5 rounded-lg bg-secondary/30 px-3 py-2 border border-border/40">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                    step.done ? "bg-emerald-600 text-white" : "border bg-card text-muted-foreground"
                  }`}>
                    {step.done ? "✓" : idx + 1}
                  </span>
                  <span className={`flex-1 font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          <button
            onClick={() => {
              toast.info(`Calling team supervisor for ${job.id}`);
            }}
            className="h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-xl border bg-card text-sm font-semibold hover:bg-accent text-foreground"
          >
            <Phone className="h-4 w-4 text-emerald-600" />
            Call crew lead
          </button>
          <button
            onClick={() => {
              toast.success(`Tracking coordinates refreshed for ${job.team}`);
            }}
            className="h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-sm"
          >
            <Truck className="h-4 w-4" />
            Track moving truck
          </button>
        </div>
      </aside>
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
