import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { VEHICLES } from "@/lib/mock-data";
import { VehicleThumb } from "@/components/public/VehicleIcon";
import {
  Wrench, Eye, X, ShieldCheck, CheckCircle2,
  Calendar, Truck, FileText, DollarSign, Clock
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Maintenance = {
  id: string; plate: string; vehicle: string; date: string; work: string;
  status: "Scheduled" | "In Progress" | "Completed";
};

const INITIAL: Maintenance[] = [
  { plate: "ADK-2145", vehicle: "Courier Bike", date: "Aug 02", work: "Service · brakes" },
  { plate: "ACM-3390", vehicle: "Mini Van", date: "Aug 04", work: "Tyres · alignment" },
  { plate: "ABX-7712", vehicle: "Pickup", date: "Aug 09", work: "Oil change" },
  { plate: "ADT-1105", vehicle: "Truck", date: "Aug 12", work: "Insurance renewal" },
  { plate: "AFR-4488", vehicle: "Large Truck", date: "Aug 18", work: "Full inspection" },
  { plate: "AEP-9820", vehicle: "Bike", date: "Aug 22", work: "Chain replacement" },
].map((m, i) => ({ id: `MNT-${400 + i}`, status: "Scheduled" as const, ...m }));

const FIELDS: FieldDef<Maintenance>[] = [
  { name: "plate", label: "Plate" },
  { name: "vehicle", label: "Vehicle", type: "select", options: VEHICLES.map(v => v.type) },
  { name: "date", label: "Date" },
  { name: "work", label: "Work", full: true },
  { name: "status", label: "Status", type: "select", options: ["Scheduled", "In Progress", "Completed"] },
];

export function FleetPage() {
  const crud = useCrud<Maintenance>(INITIAL, "Maintenance");
  const [openMaintenance, setOpenMaintenance] = useState<Maintenance | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Operations", "Fleet"]}
        title="Fleet Overview"
        subtitle="Utilization, maintenance and health of the entire HexiDrop fleet"
        actions={
          <button
            onClick={() => crud.openCreate({ status: "Scheduled", date: "Aug 01" })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Schedule maintenance
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: "Total vehicles", v: "184" },
          { l: "Active today", v: "142" },
          { l: "In maintenance", v: String(crud.rows.filter(r => r.status !== "Completed").length) },
          { l: "Utilization", v: "78%" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Fleet health" subtitle="Utilization and status by vehicle type">
        <div className="space-y-4">
          {VEHICLES.map((v, i) => {
            const util = 40 + (i * 11) % 55;
            return (
              <div key={v.type}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <VehicleThumb type={v.type} className="h-8 w-11 rounded-lg bg-secondary/60 p-1 border border-border/40" />
                    <div>
                      <span className="font-semibold text-foreground">{v.type}</span>
                      <span className="ml-2 text-xs text-muted-foreground">up to {v.capacity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <StatusBadge tone="success" label={`${[48, 62, 34, 21, 12, 6][i]} active`} />
                    <span className="tabular-nums text-muted-foreground">{util}% utilization</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${util}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Maintenance schedule" subtitle={`${crud.rows.length} scheduled`} padding="none">
        <ul className="grid gap-2 p-5 md:grid-cols-2">
          {crud.rows.map((m) => (
            <li
              key={m.id}
              onClick={() => setOpenMaintenance(m)}
              className="group/card flex items-center gap-3 rounded-xl border bg-secondary/30 px-4 py-3 hover:border-primary/50 hover:bg-secondary/50 cursor-pointer transition-all"
            >
              <VehicleThumb type={m.vehicle} className="h-10 w-14 shrink-0 rounded-lg bg-card p-1 border border-border/50 shadow-sm transition-transform group-hover/card:scale-105" />
              <div className="flex h-10 w-14 flex-col items-center justify-center rounded-lg bg-card border border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground">{m.date.split(" ")[0]}</span>
                <span className="text-sm font-semibold">{m.date.split(" ")[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span>{m.vehicle} · {m.plate}</span>
                  <Eye className="h-3 w-3 text-primary opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{m.work}</div>
              </div>
              <StatusBadge tone={m.status === "Completed" ? "success" : m.status === "In Progress" ? "info" : "warning"} label={m.status} />
              <div onClick={(e) => e.stopPropagation()}>
                <RowActions
                  onView={() => setOpenMaintenance(m)}
                  onEdit={() => crud.openEdit(m)}
                  onDuplicate={() => crud.duplicate(m)}
                  onDelete={() => crud.openDelete(m)}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Maintenance Details Drawer */}
      {openMaintenance && (
        <FleetMaintenanceDrawer
          item={openMaintenance}
          onClose={() => setOpenMaintenance(null)}
          onStatusChange={(status) => {
            crud.saveEdit({ ...openMaintenance, status });
            setOpenMaintenance({ ...openMaintenance, status });
            toast.success(`Job ${openMaintenance.id} updated to ${status}`);
          }}
        />
      )}

      <RecordEditor<Maintenance> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit maintenance" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Maintenance), ...next })} />
      <RecordEditor<Maintenance> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="Schedule maintenance" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `MNT-${500 + Math.floor(Math.random() * 999)}` } as Maintenance)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Cancel maintenance?" description={crud.deleting ? `${crud.deleting.plate} · ${crud.deleting.work} will be removed.` : ""} />
    </div>
  );
}

function FleetMaintenanceDrawer({
  item,
  onClose,
  onStatusChange,
}: {
  item: Maintenance;
  onClose: () => void;
  onStatusChange: (status: Maintenance["status"]) => void;
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
            <div className="flex h-12 w-16 items-center justify-center rounded-2xl bg-secondary/60 border border-border/50 p-1.5 shadow-sm">
              <VehicleThumb type={item.vehicle} className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{item.id}</h3>
                <StatusBadge
                  tone={item.status === "Completed" ? "success" : item.status === "In Progress" ? "info" : "warning"}
                  label={item.status}
                />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{item.vehicle}</span>
                <span>•</span>
                <span className="font-mono font-bold text-foreground">{item.plate}</span>
                <span>•</span>
                <span>{item.date} 2026</span>
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
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Estimated Cost</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">$145.00</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Downtime Est.</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">4 Hours</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Priority</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400">Normal</div>
            </div>
          </div>

          {/* Work Order Description */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Specification</div>
            <div className="text-sm font-semibold text-foreground">{item.work}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard scheduled inspection, parts replacement and road safety diagnostic for HexiDrop active delivery fleet vehicle operating in Zimbabwe.
            </p>
          </div>

          {/* Workshop & Service Center */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Authorized Workshop</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Facility:</span>
                <div className="mt-0.5 font-semibold text-foreground">Graniteside Fleet Hub</div>
              </div>
              <div>
                <span className="text-muted-foreground">Lead Mechanic:</span>
                <div className="mt-0.5 font-semibold text-foreground">Blessing Moyo</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Address:</span>
                <div className="mt-0.5 font-medium text-foreground">Kelvin Road North, Graniteside Industrial, Harare</div>
              </div>
            </div>
          </div>

          {/* Replacement Parts Checklist */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Parts & Operations List</div>
            <div className="space-y-2 text-xs">
              {[
                { name: "Synthetic 10W-40 Motor Oil (4L)", cost: "$38.00", done: true },
                { name: "OEM Oil & Air Filter Set", cost: "$24.00", done: true },
                { name: "Front & Rear Brake Caliper Inspection", cost: "$40.00", done: item.status !== "Scheduled" },
                { name: "Wheel Alignment & Pressure Balance", cost: "$43.00", done: item.status === "Completed" },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 border border-border/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${p.done ? "text-emerald-600" : "text-muted-foreground"}`} />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-foreground">{p.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl text-xs font-semibold"
          >
            Close
          </Button>
          {item.status !== "Completed" ? (
            <Button
              onClick={() => onStatusChange("Completed")}
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white"
            >
              Mark Completed
            </Button>
          ) : (
            <Button
              onClick={() => onStatusChange("In Progress")}
              className="flex-1 rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground"
            >
              Reopen Job
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default FleetPage;
