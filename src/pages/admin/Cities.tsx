import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { ZW_CITIES } from "@/lib/mock-data";
import { useMapConfig } from "@/hooks/use-map-config";
import { ZonePolygonMap } from "@/components/maps/ZonePolygonMap";
import { MapConfigModal } from "@/components/maps/MapConfigModal";
import { HARARE_ZONES } from "@/lib/geo-data";
import { KeyRound, Plus } from "lucide-react";

type City = {
  id: string;
  name: string;
  zones: number;
  drivers: number;
  status: "Active" | "Partial" | "Paused";
};

const INITIAL: City[] = ZW_CITIES.map((c, i) => ({
  id: `CTY-${100 + i}`,
  name: c,
  zones: 4 + (i % 6),
  drivers: i * 12 + 32,
  status: (i === 5 ? "Partial" : "Active") as City["status"],
}));

const FIELDS: FieldDef<City>[] = [
  { name: "name", label: "City" },
  { name: "zones", label: "Zones", type: "number" },
  { name: "drivers", label: "Drivers", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Partial", "Paused"] },
];

export function CitiesPage() {
  const crud = useCrud<City>(INITIAL, "City");
  const mapConfig = useMapConfig();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(HARARE_ZONES[0].id);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Business", "Cities & Zones"]}
        title="Cities & Operational Zones"
        subtitle="Manage geographic boundaries, service sectors, and delivery geofences across Zimbabwe"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfigModalOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent transition"
            >
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Map Settings</span>
            </button>
            <button
              onClick={() => crud.openCreate({ status: "Active", zones: 4, drivers: 0 })}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Add city
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Operational Cities List */}
        <SectionCard
          title="Operational cities"
          subtitle={`${crud.rows.length} cities active`}
          className="lg:col-span-1"
          padding="none"
        >
          <ul className="divide-y max-h-[580px] overflow-y-auto">
            {crud.rows.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-accent/30 transition">
                <div>
                  <div className="text-sm font-semibold text-foreground">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.zones} operational zones · {c.drivers} registered drivers
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    tone={c.status === "Active" ? "success" : c.status === "Partial" ? "warning" : "muted"}
                    label={c.status}
                  />
                  <RowActions
                    onEdit={() => crud.openEdit(c)}
                    onDuplicate={() => crud.duplicate(c)}
                    onDelete={() => crud.openDelete(c)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Real Interactive Zone Map */}
        <SectionCard
          title="Harare Operational Geofences & Zones"
          subtitle={`${HARARE_ZONES.length} live delivery sectors · Real GPS boundaries`}
          className="lg:col-span-2"
          padding="none"
        >
          <ZonePolygonMap
            config={mapConfig}
            zones={HARARE_ZONES}
            selectedZoneId={selectedZoneId}
            onSelectZone={(z) => setSelectedZoneId(z.id)}
            height="540px"
          />
        </SectionCard>
      </div>

      <RecordEditor<City>
        open={Boolean(crud.editing)}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit city"
        fields={FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as City), ...next })}
      />
      <RecordEditor<City>
        open={Boolean(crud.creating)}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="Add city"
        fields={FIELDS}
        value={crud.creating}
        onSubmit={(next) =>
          crud.saveCreate({
            ...crud.creating,
            ...next,
            id: `CTY-${200 + Math.floor(Math.random() * 999)}`,
          } as City)
        }
      />
      <ConfirmDelete
        open={Boolean(crud.deleting)}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Remove city?"
        description={
          crud.deleting ? `${crud.deleting.name} will be removed from operational coverage.` : ""
        }
      />

      <MapConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        config={mapConfig}
      />
    </div>
  );
}

export default CitiesPage;
