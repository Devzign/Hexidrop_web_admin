import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";



type Company = {
  id: string; name: string; industry: string; manager: string;
  monthly: number; credit: number; status: "Active" | "Pending" | "Paused";
};

const INITIAL: Company[] = [
  { id: "BIZ-2101", name: "Zimplats Holdings", industry: "Mining", manager: "Tafadzwa Moyo", monthly: 42800, credit: 60000, status: "Active" },
  { id: "BIZ-2102", name: "Delta Beverages", industry: "FMCG", manager: "Chipo Ncube", monthly: 68240, credit: 100000, status: "Active" },
  { id: "BIZ-2103", name: "Econet Wireless", industry: "Telecom", manager: "Tinashe Chikafu", monthly: 31200, credit: 45000, status: "Active" },
  { id: "BIZ-2104", name: "OK Zimbabwe", industry: "Retail", manager: "Rutendo Sibanda", monthly: 22400, credit: 30000, status: "Active" },
  { id: "BIZ-2105", name: "Meikles Hospitality", industry: "Hospitality", manager: "Farai Mukamuri", monthly: 8800, credit: 15000, status: "Pending" },
  { id: "BIZ-2106", name: "Innscor Africa", industry: "F&B", manager: "Nyasha Dube", monthly: 18600, credit: 25000, status: "Active" },
  { id: "BIZ-2107", name: "Nyaradzo Group", industry: "Insurance", manager: "Kudzai Mhlanga", monthly: 4200, credit: 10000, status: "Paused" },
];

const FIELDS: FieldDef<Company>[] = [
  { name: "name", label: "Company", full: true },
  { name: "industry", label: "Industry" },
  { name: "manager", label: "Dedicated manager" },
  { name: "monthly", label: "Monthly volume", type: "number" },
  { name: "credit", label: "Credit limit", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Pending", "Paused"] },
];

export function BusinessPage() {
  const crud = useCrud<Company>(INITIAL, "Company");

  const columns: Column<Company>[] = [
    { key: "name", header: "Company", render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold text-xs font-bold text-brand-navy">
          {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-foreground">{r.name}</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.industry}</div>
        </div>
      </div>
    ) },
    { key: "id", header: "Account", render: (r) => <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span> },
    { key: "manager", header: "Dedicated manager", render: (r) => <span className="font-medium text-foreground">{r.manager}</span> },
    { key: "monthly", header: "Monthly volume", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.monthly.toLocaleString()}</span> },
    { key: "credit", header: "Credit limit", align: "right", render: (r) => <span className="font-medium tabular-nums text-slate-600 dark:text-slate-400">${r.credit.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge tone={r.status === "Active" ? "success" : r.status === "Pending" ? "warning" : "muted"} label={r.status} /> },
    { key: "actions" as keyof Company, header: "", align: "right", render: (r) => (
      <RowActions onEdit={() => crud.openEdit(r)} onDuplicate={() => crud.duplicate(r)} onDelete={() => crud.openDelete(r)} />
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Business", "Business Accounts"]}
        title="Business Accounts"
        subtitle="Corporate customers with negotiated pricing, credit and dedicated managers"
        actions={
          <button
            onClick={() => crud.openCreate({ status: "Pending", monthly: 0, credit: 0, industry: "Retail", manager: "Unassigned" })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Onboard company
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: "Corporate accounts", v: String(crud.rows.length) },
          { l: "Monthly recurring", v: `$${(crud.rows.reduce((a, r) => a + r.monthly, 0) / 1000).toFixed(0)}K` },
          { l: "Outstanding credit", v: `$${(crud.rows.reduce((a, r) => a + r.credit, 0) / 1000).toFixed(0)}K` },
          { l: "Active", v: String(crud.rows.filter((r) => r.status === "Active").length) },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Corporate accounts" padding="none">
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

      <RecordEditor<Company> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit company" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Company), ...next })} />
      <RecordEditor<Company> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="Onboard company" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `BIZ-${2200 + Math.floor(Math.random() * 999)}` } as Company)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Remove company?" description={crud.deleting ? `${crud.deleting.name} will be removed.` : ""} />
    </div>
  );
}

export default BusinessPage;
