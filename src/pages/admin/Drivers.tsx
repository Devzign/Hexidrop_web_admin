import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { DRIVERS, type Driver } from "@/lib/mock-data";
import {
  UserPlus, Filter, Download, Star, Eye, X, Phone,
  ShieldCheck, CheckCircle2, FileText, Truck, DollarSign
} from "lucide-react";
import { toast } from "sonner";

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
  const [openDriver, setOpenDriver] = useState<Driver | null>(null);

  const columns: Column<Driver>[] = [
    { key: "id", header: "ID", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenDriver(r); }}
        className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
        title="View driver profile"
      >
        <span>{r.id}</span>
        <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
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
        onView={() => setOpenDriver(r)}
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
        <DataTable columns={columns} rows={crud.rows} onRowClick={(row) => setOpenDriver(row as Driver)} />
      </SectionCard>

      {/* Driver Details Drawer */}
      {openDriver && (
        <DriverDrawer
          driver={openDriver}
          onClose={() => setOpenDriver(null)}
          onVerifyToggle={() => {
            crud.saveEdit({ ...openDriver, verified: !openDriver.verified });
          }}
        />
      )}

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

function DriverDrawer({
  driver,
  onClose,
  onVerifyToggle,
}: {
  driver: Driver;
  onClose: () => void;
  onVerifyToggle: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <aside
        className="relative flex h-full w-full max-w-[560px] flex-col overflow-hidden bg-card shadow-elegant border-l animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-sm">
              {driver.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{driver.name}</h3>
                <OrderStatusBadge status={driver.status} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono font-medium">{driver.id}</span>
                <span>•</span>
                <span>{driver.city}, Zimbabwe</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {driver.rating}
                </span>
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
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Trips Done</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">{driver.trips.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Gross Earnings</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">${driver.earnings.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Acceptance</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">96.8%</div>
            </div>
          </div>

          {/* Assigned Vehicle */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Vehicle</span>
              <StatusBadge tone="success" label="Roadworthy" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div className="flex-1 leading-tight">
                <div className="text-sm font-bold text-foreground">{driver.vehicle}</div>
                <div className="mt-0.5 font-mono text-xs text-muted-foreground font-semibold">Plate: {driver.plate}</div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>ZTSA Insp: <span className="font-semibold text-foreground">Valid</span></div>
                <div>Expiry: <span className="font-semibold text-foreground">Dec 2026</span></div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact & Location</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Mobile Phone:</span>
                <div className="mt-0.5 font-semibold text-foreground">{driver.phone}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Operational City:</span>
                <div className="mt-0.5 font-semibold text-foreground">{driver.city}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Payout Method:</span>
                <div className="mt-0.5 font-semibold text-foreground">EcoCash Zimbabwe</div>
              </div>
              <div>
                <span className="text-muted-foreground">Account Status:</span>
                <div className="mt-0.5 font-semibold text-foreground">{driver.status}</div>
              </div>
            </div>
          </div>

          {/* Zimbabwe KYC & Verification Documents */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Zimbabwe KYC Documents</div>
              {driver.verified ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> All Verified
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Action Required</span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: "National ID (Metal/Plastic Card)", status: driver.verified ? "Verified" : "Pending", date: "Checked" },
                { name: "Driver's License (Class 2/4)", status: driver.verified ? "Verified" : "Pending", date: "Checked" },
                { name: "ZTSA Road Safety Certificate", status: driver.verified ? "Verified" : "Pending", date: "Checked" },
                { name: "CID Police Clearance (Fingerprints)", status: driver.verified ? "Verified" : "Pending", date: "Checked" },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 border border-border/40">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{doc.name}</span>
                  </div>
                  <StatusBadge tone={doc.status === "Verified" ? "success" : "warning"} label={doc.status} />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onVerifyToggle();
                  toast.success(driver.verified ? "Driver KYC marked as Pending" : "Driver KYC Approved successfully!");
                }}
                className={`w-full h-8 rounded-lg text-xs font-semibold transition-colors border ${
                  driver.verified
                    ? "border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {driver.verified ? "Revoke / Request Re-verification" : "Approve All Driver KYC Documents"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          <a
            href={`tel:${driver.phone}`}
            className="h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-xl border bg-card text-sm font-semibold hover:bg-accent text-foreground"
          >
            <Phone className="h-4 w-4 text-emerald-600" />
            Call driver
          </a>
          <button
            onClick={() => {
              toast.info(`Driver ${driver.id} status updated`);
            }}
            className="h-9 flex-1 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-sm"
          >
            Dispatch order
          </button>
        </div>
      </aside>
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
