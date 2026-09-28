import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { VEHICLES, ZW_CITIES } from "@/lib/mock-data";
import { VehicleThumb } from "@/components/public/VehicleIcon";
import { toast } from "sonner";



type Rate = {
  id: string; type: string; base: number; perKm: number; perMin: number; minimum: number; cancelFee: number;
};
type Peak = { id: string; range: string; multiplier: string };
type Surcharge = { id: string; label: string; value: string };
type CityMod = { id: string; city: string; modifier: string };

const RATES: Rate[] = VEHICLES.map((v, i) => ({
  id: `RT-${100 + i}`,
  type: v.type,
  base: +(2 + i * 0.8).toFixed(2),
  perKm: +(0.6 + i * 0.4).toFixed(2),
  perMin: +(0.08 + i * 0.05).toFixed(2),
  minimum: +(3 + i * 1.2).toFixed(2),
  cancelFee: +(1 + i * 0.5).toFixed(2),
}));
const PEAKS: Peak[] = [
  { id: "PK-1", range: "07:00 – 09:30", multiplier: "1.4×" },
  { id: "PK-2", range: "12:00 – 13:30", multiplier: "1.2×" },
  { id: "PK-3", range: "17:00 – 19:30", multiplier: "1.6×" },
  { id: "PK-4", range: "21:00 – 05:00", multiplier: "1.3×" },
];
const SURCHARGES: Surcharge[] = [
  { id: "SC-1", label: "Night charge (21:00 – 05:00)", value: "+$1.20" },
  { id: "SC-2", label: "Waiting (per min after 5 min free)", value: "+$0.20" },
  { id: "SC-3", label: "Return trip", value: "+30% of fare" },
  { id: "SC-4", label: "Fragile handling", value: "+$1.50" },
  { id: "SC-5", label: "Extra stop", value: "+$1.80 per stop" },
];
const CITIES: CityMod[] = ZW_CITIES.slice(0, 6).map((c, i) => ({
  id: `CM-${i}`,
  city: c,
  modifier: `×${(0.9 + i * 0.05).toFixed(2)}`,
}));

const RATE_FIELDS: FieldDef<Rate>[] = [
  { name: "type", label: "Vehicle", full: true },
  { name: "base", label: "Base fare", type: "number" },
  { name: "perKm", label: "Per km", type: "number" },
  { name: "perMin", label: "Per min", type: "number" },
  { name: "minimum", label: "Minimum", type: "number" },
  { name: "cancelFee", label: "Cancel fee", type: "number" },
];
const PEAK_FIELDS: FieldDef<Peak>[] = [
  { name: "range", label: "Time range", full: true },
  { name: "multiplier", label: "Multiplier" },
];
const SURCHARGE_FIELDS: FieldDef<Surcharge>[] = [
  { name: "label", label: "Label", full: true },
  { name: "value", label: "Value" },
];
const CITY_FIELDS: FieldDef<CityMod>[] = [
  { name: "city", label: "City" },
  { name: "modifier", label: "Modifier" },
];

export function PricingPage() {
  const rates = useCrud<Rate>(RATES, "Rate");
  const peaks = useCrud<Peak>(PEAKS, "Peak window");
  const surcharges = useCrud<Surcharge>(SURCHARGES, "Surcharge");
  const cities = useCrud<CityMod>(CITIES, "City modifier");

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Business", "Pricing"]}
        title="Pricing Management"
        subtitle="Vehicle rates, distance pricing, peak-hour multipliers and surcharges"
        actions={
          <button
            onClick={() => toast.success("Pricing published", { description: "All changes are live." })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Publish changes
          </button>
        }
      />

      <SectionCard
        title="Vehicle base pricing"
        subtitle="Per-city rate cards"
        actions={
          <button
            onClick={() => rates.openCreate({ type: "New vehicle", base: 0, perKm: 0, perMin: 0, minimum: 0, cancelFee: 0 })}
            className="h-8 rounded-lg border px-2.5 text-xs font-semibold hover:bg-accent"
          >
            Add rate
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="text-left text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-border/80">
                <th className="pb-3 pt-1">Vehicle</th>
                <th className="pb-3 pt-1 text-right">Base fare</th>
                <th className="pb-3 pt-1 text-right">Per km</th>
                <th className="pb-3 pt-1 text-right">Per min</th>
                <th className="pb-3 pt-1 text-right">Minimum</th>
                <th className="pb-3 pt-1 text-right">Cancel fee</th>
                <th className="pb-3 pt-1 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rates.rows.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-foreground">
                    <div className="flex items-center gap-3">
                      <VehicleThumb type={v.type} className="h-8 w-11 rounded-lg bg-secondary/60 p-1 border border-border/40" />
                      <span>{v.type}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium tabular-nums text-foreground">${v.base.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium tabular-nums text-foreground">${v.perKm.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium tabular-nums text-foreground">${v.perMin.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium tabular-nums text-foreground">${v.minimum.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium tabular-nums text-foreground">${v.cancelFee.toFixed(2)}</td>
                  <td className="py-3 text-right">
                    <RowActions onEdit={() => rates.openEdit(v)} onDuplicate={() => rates.duplicate(v)} onDelete={() => rates.openDelete(v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          title="Peak hour multiplier"
          actions={
            <button
              onClick={() => peaks.openCreate({ range: "00:00 – 00:00", multiplier: "1.0×" })}
              className="h-7 rounded-md border px-2 text-[11px] font-semibold hover:bg-accent"
            >
              Add
            </button>
          }
        >
          <div className="space-y-3">
            {peaks.rows.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border bg-secondary/30 px-4 py-2.5">
                <span className="text-sm">{p.range}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-primary">{p.multiplier}</span>
                  <RowActions onEdit={() => peaks.openEdit(p)} onDelete={() => peaks.openDelete(p)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Surcharges"
          actions={
            <button
              onClick={() => surcharges.openCreate({ label: "New surcharge", value: "+$0.00" })}
              className="h-7 rounded-md border px-2 text-[11px] font-semibold hover:bg-accent"
            >
              Add
            </button>
          }
        >
          <ul className="space-y-2 text-sm">
            {surcharges.rows.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0">
                <span className="text-muted-foreground">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{s.value}</span>
                  <RowActions onEdit={() => surcharges.openEdit(s)} onDelete={() => surcharges.openDelete(s)} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="City modifiers"
          actions={
            <button
              onClick={() => cities.openCreate({ city: "New City", modifier: "×1.00" })}
              className="h-7 rounded-md border px-2 text-[11px] font-semibold hover:bg-accent"
            >
              Add
            </button>
          }
        >
          <div className="space-y-2 text-sm">
            {cities.rows.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border px-4 py-2">
                <span>{c.city}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">{c.modifier}</span>
                  <RowActions onEdit={() => cities.openEdit(c)} onDelete={() => cities.openDelete(c)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <RecordEditor<Rate> open={!!rates.editing} onOpenChange={(v) => !v && rates.setEditing(null)} title="Edit rate" fields={RATE_FIELDS} value={rates.editing} onSubmit={(next) => rates.saveEdit({ ...(rates.editing as Rate), ...next })} />
      <RecordEditor<Rate> open={!!rates.creating} onOpenChange={(v) => !v && rates.setCreating(null)} title="Add rate" fields={RATE_FIELDS} value={rates.creating} onSubmit={(next) => rates.saveCreate({ ...rates.creating, ...next, id: `RT-${200 + Math.floor(Math.random() * 999)}` } as Rate)} />
      <ConfirmDelete open={!!rates.deleting} onOpenChange={(v) => !v && rates.setDeleting(null)} onConfirm={rates.confirmDelete} title="Remove rate?" />

      <RecordEditor<Peak> open={!!peaks.editing} onOpenChange={(v) => !v && peaks.setEditing(null)} title="Edit peak window" fields={PEAK_FIELDS} value={peaks.editing} onSubmit={(next) => peaks.saveEdit({ ...(peaks.editing as Peak), ...next })} />
      <RecordEditor<Peak> open={!!peaks.creating} onOpenChange={(v) => !v && peaks.setCreating(null)} title="Add peak window" fields={PEAK_FIELDS} value={peaks.creating} onSubmit={(next) => peaks.saveCreate({ ...peaks.creating, ...next, id: `PK-${Math.floor(Math.random() * 999)}` } as Peak)} />
      <ConfirmDelete open={!!peaks.deleting} onOpenChange={(v) => !v && peaks.setDeleting(null)} onConfirm={peaks.confirmDelete} title="Remove peak window?" />

      <RecordEditor<Surcharge> open={!!surcharges.editing} onOpenChange={(v) => !v && surcharges.setEditing(null)} title="Edit surcharge" fields={SURCHARGE_FIELDS} value={surcharges.editing} onSubmit={(next) => surcharges.saveEdit({ ...(surcharges.editing as Surcharge), ...next })} />
      <RecordEditor<Surcharge> open={!!surcharges.creating} onOpenChange={(v) => !v && surcharges.setCreating(null)} title="Add surcharge" fields={SURCHARGE_FIELDS} value={surcharges.creating} onSubmit={(next) => surcharges.saveCreate({ ...surcharges.creating, ...next, id: `SC-${Math.floor(Math.random() * 999)}` } as Surcharge)} />
      <ConfirmDelete open={!!surcharges.deleting} onOpenChange={(v) => !v && surcharges.setDeleting(null)} onConfirm={surcharges.confirmDelete} title="Remove surcharge?" />

      <RecordEditor<CityMod> open={!!cities.editing} onOpenChange={(v) => !v && cities.setEditing(null)} title="Edit city modifier" fields={CITY_FIELDS} value={cities.editing} onSubmit={(next) => cities.saveEdit({ ...(cities.editing as CityMod), ...next })} />
      <RecordEditor<CityMod> open={!!cities.creating} onOpenChange={(v) => !v && cities.setCreating(null)} title="Add city modifier" fields={CITY_FIELDS} value={cities.creating} onSubmit={(next) => cities.saveCreate({ ...cities.creating, ...next, id: `CM-${Math.floor(Math.random() * 999)}` } as CityMod)} />
      <ConfirmDelete open={!!cities.deleting} onOpenChange={(v) => !v && cities.setDeleting(null)} onConfirm={cities.confirmDelete} title="Remove city modifier?" />
    </div>
  );
}

export default PricingPage;
