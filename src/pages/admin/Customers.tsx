import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { CUSTOMERS, type Customer } from "@/lib/mock-data";
import { Download, UserPlus, Filter } from "lucide-react";

const CUSTOMER_FIELDS: FieldDef<Customer>[] = [
  { name: "name", label: "Full name" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "city", label: "City" },
  { name: "type", label: "Type", type: "select", options: ["Personal", "Business"] },
  { name: "orders", label: "Orders", type: "number" },
  { name: "spend", label: "Spend ($)", type: "number" },
  { name: "wallet", label: "Wallet ($)", type: "number" },
  { name: "joined", label: "Joined", type: "date" },
];



export function CustomersPage() {
  const crud = useCrud<Customer>(CUSTOMERS, "Customer");
  const columns: Column<Customer>[] = [
    { key: "name", header: "Customer", render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-xs font-semibold text-foreground">
          {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-foreground">{r.name}</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.email}</div>
        </div>
      </div>
    ) },
    { key: "id", header: "ID", render: (r) => <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span> },
    { key: "phone", header: "Phone", render: (r) => <span className="text-[13px] font-medium tabular-nums text-foreground">{r.phone}</span> },
    { key: "city", header: "City", render: (r) => <span className="font-medium text-foreground">{r.city}</span> },
    { key: "type", header: "Type", render: (r) => <StatusBadge tone={r.type === "Business" ? "primary" : "muted"} label={r.type} dot={false} /> },
    { key: "orders", header: "Orders", align: "right", render: (r) => <span className="font-semibold tabular-nums text-foreground">{r.orders}</span> },
    { key: "spend", header: "Spend", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.spend.toLocaleString()}</span> },
    { key: "wallet", header: "Wallet", align: "right", render: (r) => <span className="font-semibold tabular-nums text-foreground">${r.wallet.toFixed(2)}</span> },
    { key: "joined", header: "Joined", render: (r) => <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.joined}</span> },
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
        breadcrumb={["Operations", "Customers"]}
        title="Customers"
        subtitle="18,428 total customers · 142 new this week"
        actions={
          <>
            <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent"><Download className="h-4 w-4" /> Export</button>
            <button
              onClick={() => crud.openCreate({ type: "Personal", orders: 0, spend: 0, wallet: 0, joined: new Date().toISOString().slice(0, 10) })}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >
              <UserPlus className="h-4 w-4" /> Add customer
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: "Total", v: "18,428" }, { l: "Business accounts", v: "384" },
          { l: "Repeat rate", v: "62%" }, { l: "Avg. order value", v: "$18.40" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{s.l}</div>
            <div className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard padding="none" title="All customers" subtitle={`${crud.rows.length} shown`} actions={<button className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium"><Filter className="h-3.5 w-3.5" /> Filter</button>}>
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

      <RecordEditor<Customer>
        open={!!crud.editing}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit customer"
        fields={CUSTOMER_FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Customer), ...next })}
      />
      <RecordEditor<Customer>
        open={!!crud.creating}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="Add customer"
        fields={CUSTOMER_FIELDS}
        value={crud.creating}
        onSubmit={(next) =>
          crud.saveCreate({
            ...crud.creating,
            ...next,
            id: `CUS-${5300 + Math.floor(Math.random() * 999)}`,
          } as Customer)
        }
      />
      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Delete customer?"
        description={crud.deleting ? `${crud.deleting.name} will be permanently removed.` : ""}
      />
    </div>
  );
}

export default CustomersPage;
