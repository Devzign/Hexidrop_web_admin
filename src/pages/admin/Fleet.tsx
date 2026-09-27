import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { VEHICLES } from "@/lib/mock-data";



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
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{v.type}</span>
                    <span className="text-xs text-muted-foreground">up to {v.capacity}</span>
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
            <li key={m.id} className="flex items-center gap-3 rounded-xl border bg-secondary/30 px-4 py-3">
              <div className="flex h-10 w-14 flex-col items-center justify-center rounded-lg bg-card">
                <span className="text-[10px] uppercase text-muted-foreground">{m.date.split(" ")[0]}</span>
                <span className="text-sm font-semibold">{m.date.split(" ")[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{m.vehicle} · <span className="font-semibold">{m.plate}</span></div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{m.work}</div>
              </div>
              <StatusBadge tone={m.status === "Completed" ? "success" : m.status === "In Progress" ? "info" : "warning"} label={m.status} />
              <RowActions onEdit={() => crud.openEdit(m)} onDuplicate={() => crud.duplicate(m)} onDelete={() => crud.openDelete(m)} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <RecordEditor<Maintenance> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit maintenance" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Maintenance), ...next })} />
      <RecordEditor<Maintenance> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="Schedule maintenance" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `MNT-${500 + Math.floor(Math.random() * 999)}` } as Maintenance)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Cancel maintenance?" description={crud.deleting ? `${crud.deleting.plate} · ${crud.deleting.work} will be removed.` : ""} />
    </div>
  );
}

export default FleetPage;
