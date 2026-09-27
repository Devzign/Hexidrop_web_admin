import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { DRIVERS, type Driver } from "@/lib/mock-data";
import { UserPlus, Filter, Download, Star } from "lucide-react";

const DRIVER_FIELDS: FieldDef<Driver>[] = [
  { name: "name", label: "Full name" },
  { name: "phone", label: "Phone" },
  { name: "city", label: "City" },
  { name: "vehicle", label: "Vehicle" },
  { name: "plate", label: "Plate" },
  { name: "status", label: "Status", type: "select", options: ["Online", "On Trip", "Offline"] },
  { name: "rating", label: "Rating", type: "number" },
  { name: "trips", label: "Trips", type: "number" },
  { name: "earnings", label: "Earnings ($)", type: "number" },
  { name: "verified", label: "KYC verified", type: "switch" },
];



export function DriversPage() {
  const crud = useCrud<Driver>(DRIVERS, "Driver");

  const columns: Column<Driver>[] = [
    { key: "id", header: "ID", render: (r) => <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span> },
    { key: "name", header: "Driver", render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground">
          {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-foreground">{r.name}</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.phone}</div>
        </div>
      </div>
    ) },
    { key: "vehicle", header: "Vehicle", render: (r) => (
      <div className="leading-tight">
        <div className="text-[13px] font-medium text-foreground">{r.vehicle}</div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.plate}</div>
      </div>
    ) },
    { key: "city", header: "City", render: (r) => <span className="font-medium text-foreground">{r.city}</span> },
    { key: "verified", header: "KYC", render: (r) => r.verified
      ? <StatusBadge tone="success" label="Verified" />
      : <StatusBadge tone="warning" label="Pending" /> },
    { key: "rating", header: "Rating", render: (r) => (
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground">
        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {r.rating}
      </span>
    ) },
    { key: "trips", header: "Trips", align: "right", render: (r) => <span className="font-semibold tabular-nums text-foreground">{r.trips.toLocaleString()}</span> },
    { key: "earnings", header: "Earnings", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.earnings.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
    { key: "actions", header: "", render: (r) => (
      <RowActions
        onEdit={() => crud.openEdit(r)}
        onDuplicate={() => crud.duplicate(r)}
        onDelete={() => crud.openDelete(r)}
      />
    ) },
  ];

  const online = crud.rows.filter((d) => d.status !== "Offline").length;
  const verified = crud.rows.filter((d) => d.verified).length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Operations", "Drivers"]}
        title="Drivers"
        subtitle="1,284 drivers on the platform · 812 online right now"
        actions={
          <>
            <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent"><Download className="h-4 w-4" /> Export</button>
            <button
              onClick={() => crud.openCreate({ status: "Online", verified: true, rating: 4.8, trips: 0, earnings: 0 })}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >
              <UserPlus className="h-4 w-4" /> Onboard driver
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total drivers" value="1,284" hint="+34 this week" />
        <StatCard label="Online now" value={String(online * 34)} tone="success" hint={`${online} in this view`} />
        <StatCard label="KYC verified" value={String(verified * 53)} hint={`${Math.round(verified / Math.max(crud.rows.length, 1) * 100)}% of fleet`} />
        <StatCard label="Weekly earnings" value="$84,220" tone="gold" hint="Payouts Friday" />
      </div>

      <SectionCard padding="none" actions={<button className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium hover:bg-accent"><Filter className="h-3.5 w-3.5" /> Filter</button>} title="All drivers" subtitle={`${crud.rows.length} shown`}>
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

      <RecordEditor<Driver>
        open={!!crud.editing}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit driver"
        fields={DRIVER_FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Driver), ...next })}
      />
      <RecordEditor<Driver>
        open={!!crud.creating}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="Onboard driver"
        fields={DRIVER_FIELDS}
        value={crud.creating}
        onSubmit={(next) =>
          crud.saveCreate({
            ...crud.creating,
            ...next,
            id: `DRV-${1200 + Math.floor(Math.random() * 999)}`,
          } as Driver)
        }
      />
      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Remove driver?"
        description={crud.deleting ? `${crud.deleting.name} (${crud.deleting.id}) will be removed from the fleet.` : ""}
      />
    </div>
  );
}

function StatCard({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "success" | "gold" }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 shadow-card ${tone === "gold" ? "bg-gradient-gold text-brand-navy border-amber-300/40" : ""}`}>
      <div className={`text-xs font-bold uppercase tracking-wider ${tone === "gold" ? "text-brand-navy/90" : "text-slate-600 dark:text-slate-400"}`}>{label}</div>
      <div className={`mt-1.5 text-2xl font-bold tracking-tight ${tone === "gold" ? "text-brand-navy" : "text-foreground"}`}>{value}</div>
      {hint && (
        <div className={`mt-1 text-xs font-medium ${
          tone === "gold"
            ? "text-brand-navy/80"
            : tone === "success"
            ? "text-emerald-600 dark:text-emerald-400 font-semibold"
            : "text-slate-500 dark:text-slate-400"
        }`}>
          {hint}
        </div>
      )}
    </div>
  );
}

export default DriversPage;
