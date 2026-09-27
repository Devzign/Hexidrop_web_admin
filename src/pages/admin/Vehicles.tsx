import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { VEHICLES, DRIVERS } from "@/lib/mock-data";
import { Car, Truck, Package } from "lucide-react";



type Row = {
  id: string; type: string; plate: string; capacity: string;
  driver: string; status: string; insurance: string; nextService: string;
};

const VEHICLE_FIELDS: FieldDef<Row>[] = [
  { name: "type", label: "Type", type: "select", options: VEHICLES.map((v) => v.type) },
  { name: "plate", label: "Plate" },
  { name: "capacity", label: "Capacity" },
  { name: "driver", label: "Assigned to" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Maintenance", "Idle"] },
  { name: "insurance", label: "Insurance until", type: "date" },
  { name: "nextService", label: "Next service", type: "date" },
];

const INITIAL_ROWS: Row[] = Array.from({ length: 18 }).map((_, i) => {
  const v = VEHICLES[i % VEHICLES.length];
  const d = DRIVERS[i % DRIVERS.length];
  return {
    id: `VEH-${2200 + i}`,
    type: v.type, plate: v.plate + "-" + (i + 1), capacity: v.capacity,
    driver: d.name,
    status: (["Active", "Active", "Maintenance", "Idle", "Active"] as const)[i % 5],
    insurance: `2026-${(1 + i % 12).toString().padStart(2, "0")}-14`,
    nextService: `2026-08-${(1 + (i * 3) % 27).toString().padStart(2, "0")}`,
  };
});

export function VehiclesPage() {
  const crud = useCrud<Row>(INITIAL_ROWS, "Vehicle");

  const columns: Column<Row>[] = [
    { key: "id", header: "ID", render: (r) => <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span> },
    { key: "type", header: "Type", render: (r) => (
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
          {r.type.includes("Truck") ? <Truck className="h-4 w-4" /> : r.type.includes("Bike") ? <Package className="h-4 w-4" /> : <Car className="h-4 w-4" />}
        </span>
        <span className="text-[13px] font-semibold text-foreground">{r.type}</span>
      </div>
    ) },
    { key: "plate", header: "Plate", render: (r) => <span className="text-[13px] font-semibold text-foreground">{r.plate}</span> },
    { key: "capacity", header: "Capacity" },
    { key: "driver", header: "Assigned to" },
    { key: "insurance", header: "Insurance until" },
    { key: "nextService", header: "Next service" },
    { key: "status", header: "Status", render: (r) => (
      <StatusBadge tone={r.status === "Active" ? "success" : r.status === "Maintenance" ? "warning" : "muted"} label={r.status} />
    ) },
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
        breadcrumb={["Operations", "Vehicles"]}
        title="Vehicles"
        subtitle="Fleet configuration and vehicle assignments"
        actions={
          <button
            onClick={() => crud.openCreate({ status: "Active", type: VEHICLES[0].type, capacity: VEHICLES[0].capacity })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Add vehicle
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {VEHICLES.map((v, i) => (
          <div key={v.type} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {v.type.includes("Truck") ? <Truck className="h-5 w-5" /> : v.type.includes("Bike") ? <Package className="h-5 w-5" /> : <Car className="h-5 w-5" />}
            </div>
            <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{v.type}</div>
            <div className="mt-0.5 text-2xl font-semibold tabular-nums">{[48, 62, 34, 21, 12, 6][i]}</div>
            <div className="text-[11px] text-muted-foreground">up to {v.capacity}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Fleet register" subtitle={`${crud.rows.length} vehicles`} padding="none">
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

      <RecordEditor<Row>
        open={!!crud.editing}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit vehicle"
        fields={VEHICLE_FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Row), ...next })}
      />
      <RecordEditor<Row>
        open={!!crud.creating}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="Add vehicle"
        fields={VEHICLE_FIELDS}
        value={crud.creating}
        onSubmit={(next) =>
          crud.saveCreate({
            ...crud.creating,
            ...next,
            id: `VEH-${2300 + Math.floor(Math.random() * 999)}`,
          } as Row)
        }
      />
      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Retire vehicle?"
        description={crud.deleting ? `${crud.deleting.plate} will be removed from the fleet register.` : ""}
      />
    </div>
  );
}

export default VehiclesPage;
