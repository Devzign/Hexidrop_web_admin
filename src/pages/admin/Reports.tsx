import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { ExportButton } from "@/components/admin/ExportButton";
import { ChartFrame, chartAxisTick, chartLegendProps, chartTooltipProps } from "@/components/admin/ChartFrame";
import { useCrud } from "@/hooks/use-crud";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { REVENUE_SERIES, TOP_CITIES } from "@/lib/mock-data";



type Report = { id: string; title: string; description: string; schedule: "Daily" | "Weekly" | "Monthly" | "On demand" };

const INITIAL: Report[] = ([
  { title: "Cancellation report", description: "Weekly cancellations by reason and city", schedule: "Weekly" },
  { title: "Vehicle utilization", description: "Fleet usage vs. idle capacity per vehicle type", schedule: "Weekly" },
  { title: "Driver performance", description: "Trips, ratings and acceptance rate per driver", schedule: "Monthly" },
  { title: "Moving jobs summary", description: "House moves, office relocations and heavy items", schedule: "Monthly" },
  { title: "Customer growth", description: "Signups, active customers and churn", schedule: "Monthly" },
  { title: "Peak-hour analysis", description: "Demand distribution across the day", schedule: "Daily" },
] as const).map((r, i) => ({ id: `RPT-${600 + i}`, ...r }));

const FIELDS: FieldDef<Report>[] = [
  { name: "title", label: "Title" },
  { name: "description", label: "Description", full: true },
  { name: "schedule", label: "Schedule", type: "select", options: ["Daily", "Weekly", "Monthly", "On demand"] },
];

export function ReportsPage() {
  const crud = useCrud<Report>(INITIAL, "Report");

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Finance", "Reports"]}
        title="Reports"
        subtitle="Downloadable performance, revenue and operational reports"
        actions={
          <>
            <ExportButton module="reports" label="Download" format="PDF" />
            <ExportButton module="reports" label="Download" format="XLSX" />
            <button onClick={() => crud.openCreate({ schedule: "Weekly" })} className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card">New report</button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Revenue by day" subtitle="Last 14 days">
          <ChartFrame>
            <ResponsiveContainer>
              <BarChart data={REVENUE_SERIES} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={chartAxisTick} axisLine={false} tickLine={false} minTickGap={16} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} width={44} />
                <Tooltip {...chartTooltipProps} />
                <Legend {...chartLegendProps} />
                <Bar dataKey="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </SectionCard>

        <SectionCard title="Orders vs. moving jobs">
          <ChartFrame>
            <ResponsiveContainer>
              <LineChart data={REVENUE_SERIES} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={chartAxisTick} axisLine={false} tickLine={false} minTickGap={16} />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} width={44} />
                <Tooltip {...chartTooltipProps} />
                <Legend {...chartLegendProps} />
                <Line type="monotone" dataKey="orders" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="moving" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
        </SectionCard>
      </div>

      <SectionCard
        title="Cities league table"
        actions={<ExportButton module="reports" label="Export cities" format="CSV" />}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[12px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-border/80">
              <th className="pb-3 pt-1">City</th>
              <th className="pb-3 pt-1 text-right">Orders</th>
              <th className="pb-3 pt-1 text-right">Revenue</th>
              <th className="pb-3 pt-1">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {TOP_CITIES.map((c, i) => (
              <tr key={c.city} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2.5 font-semibold text-foreground">{c.city}</td>
                <td className="py-2.5 text-right font-medium tabular-nums text-foreground">{c.orders.toLocaleString()}</td>
                <td className="py-2.5 text-right font-bold tabular-nums text-foreground">${c.revenue.toLocaleString()}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${40 + i * 8}%` }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{8 + i * 2}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {crud.rows.map((r) => (
          <div key={r.id} className="rounded-2xl border bg-card p-5 shadow-card transition hover:shadow-elegant">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{r.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                <span className="mt-2 inline-flex rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium">{r.schedule}</span>
              </div>
              <RowActions module="reports" recordId={r.id} onEdit={() => crud.openEdit(r)} onDuplicate={() => crud.duplicate(r)} onDelete={() => crud.openDelete(r)} />
            </div>
            <div className="mt-4 flex gap-2">
              <ExportButton module="reports" label={r.title} format="PDF" className="h-8 flex-1 justify-center px-2 text-xs" />
              <ExportButton module="reports" label={r.title} format="XLSX" className="h-8 flex-1 justify-center px-2 text-xs" />
            </div>
          </div>
        ))}
      </div>

      <RecordEditor<Report> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit report" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Report), ...next })} />
      <RecordEditor<Report> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New report" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `RPT-${700 + Math.floor(Math.random() * 999)}` } as Report)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete report?" description={crud.deleting ? `${crud.deleting.title} will be removed.` : ""} />
    </div>
  );
}

export default ReportsPage;
