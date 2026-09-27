import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { ZW_CITIES } from "@/lib/mock-data";



type City = {
  id: string; name: string; zones: number; drivers: number;
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

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Business", "Cities & Zones"]}
        title="Cities & Zones"
        subtitle="Operational areas, delivery zones and restricted regions"
        actions={
          <button
            onClick={() => crud.openCreate({ status: "Active", zones: 4, drivers: 0 })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Add city
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Operational cities" subtitle={`${crud.rows.length} cities`} className="lg:col-span-1" padding="none">
          <ul className="divide-y">
            {crud.rows.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.zones} zones · {c.drivers} drivers</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={c.status === "Active" ? "success" : c.status === "Partial" ? "warning" : "muted"} label={c.status} />
                  <RowActions onEdit={() => crud.openEdit(c)} onDuplicate={() => crud.duplicate(c)} onDelete={() => crud.openDelete(c)} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Zone map" subtitle="Harare · 12 delivery zones" className="lg:col-span-2" padding="none">
          <div className="relative map-grid h-[520px] overflow-hidden rounded-b-2xl">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[
                { d: "M10,15 L35,10 L40,30 L15,35 Z", c: "var(--chart-1)" },
                { d: "M40,30 L65,25 L70,50 L45,55 Z", c: "var(--chart-2)" },
                { d: "M15,35 L40,30 L45,55 L20,60 Z", c: "var(--chart-3)" },
                { d: "M65,25 L88,32 L82,58 L70,50 Z", c: "var(--chart-4)" },
                { d: "M20,60 L45,55 L50,80 L25,85 Z", c: "var(--chart-5)" },
                { d: "M50,80 L75,75 L80,95 L55,98 Z", c: "var(--chart-1)" },
                { d: "M45,55 L70,50 L75,75 L50,80 Z", c: "var(--chart-2)" },
              ].map((z, i) => (
                <g key={i}>
                  <path d={z.d} fill={z.c} fillOpacity={0.25} stroke={z.c} strokeWidth={0.4} />
                </g>
              ))}
            </svg>
            <div className="absolute bottom-3 right-3 rounded-xl border bg-card/95 px-3 py-2 text-xs shadow-card backdrop-blur">
              Polygon editor · click to adjust vertices
            </div>
          </div>
        </SectionCard>
      </div>

      <RecordEditor<City> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit city" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as City), ...next })} />
      <RecordEditor<City> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="Add city" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `CTY-${200 + Math.floor(Math.random() * 999)}` } as City)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Remove city?" description={crud.deleting ? `${crud.deleting.name} will be removed from operations.` : ""} />
    </div>
  );
}

export default CitiesPage;
