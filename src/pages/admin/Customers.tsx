import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { CUSTOMERS, type Customer } from "@/lib/mock-data";
import {
  Download, UserPlus, Filter, Eye, X, Phone, Mail,
  MapPin, Wallet, Package, CreditCard, Send, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

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
  const [openCustomer, setOpenCustomer] = useState<Customer | null>(null);

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
    { key: "id", header: "ID", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenCustomer(r); }}
        className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
        title="View customer details"
      >
        <span>{r.id}</span>
        <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
    { key: "phone", header: "Phone", render: (r) => <span className="text-[13px] font-medium tabular-nums text-foreground">{r.phone}</span> },
    { key: "city", header: "City", render: (r) => <span className="font-medium text-foreground">{r.city}</span> },
    { key: "type", header: "Type", render: (r) => <StatusBadge tone={r.type === "Business" ? "primary" : "muted"} label={r.type} dot={false} /> },
    { key: "orders", header: "Orders", align: "right", render: (r) => <span className="font-semibold tabular-nums text-foreground">{r.orders}</span> },
    { key: "spend", header: "Spend", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.spend.toLocaleString()}</span> },
    { key: "wallet", header: "Wallet", align: "right", render: (r) => <span className="font-semibold tabular-nums text-foreground">${r.wallet.toFixed(2)}</span> },
    { key: "joined", header: "Joined", render: (r) => <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.joined}</span> },
    { key: "actions", header: "", render: (r) => (
      <RowActions
        onView={() => setOpenCustomer(r)}
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
        <DataTable columns={columns} rows={crud.rows} onRowClick={(row) => setOpenCustomer(row as Customer)} />
      </SectionCard>

      {/* Customer Details Drawer */}
      {openCustomer && (
        <CustomerDrawer
          customer={openCustomer}
          onClose={() => setOpenCustomer(null)}
        />
      )}

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

function CustomerDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
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
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-base font-bold text-foreground">
              {customer.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{customer.name}</h3>
                <StatusBadge tone={customer.type === "Business" ? "primary" : "muted"} label={customer.type} dot={false} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono font-medium">{customer.id}</span>
                <span>•</span>
                <span>Member since {customer.joined}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Orders</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">{customer.orders}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Lifetime Spend</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">${customer.spend.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Wallet Balance</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400 font-mono">
                ${customer.wallet.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Contact & Zimbabwean Address */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact & Address</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Email:</span>
                <div className="mt-0.5 font-semibold text-foreground truncate">{customer.email}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <div className="mt-0.5 font-semibold text-foreground">{customer.phone}</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Primary Delivery Address (Zimbabwe format):</span>
                <div className="mt-0.5 font-medium text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>24 Enterprise Road, Newlands, {customer.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders History */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Orders</div>
              <span className="text-xs text-muted-foreground">Last 3 deliveries</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { id: "HXD-5819", route: "Newlands → Avondale", date: "Yesterday, 14:20", amount: "$16.50", status: "Delivered" },
                { id: "HXD-5742", route: "Borrowdale → CBD", date: "24 Sep 2026", amount: "$22.00", status: "Delivered" },
                { id: "HXD-5690", route: "Harare Airport → Eastlea", date: "21 Sep 2026", amount: "$35.00", status: "Delivered" },
              ].map((ord) => (
                <div key={ord.id} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5 border border-border/40">
                  <div>
                    <div className="font-mono font-bold text-foreground">{ord.id}</div>
                    <div className="text-[11px] text-muted-foreground">{ord.route} • {ord.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold tabular-nums text-foreground">{ord.amount}</div>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Payment Method</div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2.5 border border-border/40">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                EC
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-foreground">EcoCash Zimbabwe</div>
                <div className="text-muted-foreground">{customer.phone}</div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Default</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          <a
            href={`tel:${customer.phone}`}
            className="h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-xl border bg-card text-sm font-semibold hover:bg-accent text-foreground"
          >
            <Phone className="h-4 w-4 text-emerald-600" />
            Call customer
          </a>
          <button
            onClick={() => {
              toast.success(`In-app message sent to ${customer.name}`);
            }}
            className="h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-sm"
          >
            <Send className="h-4 w-4" />
            Send notification
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CustomersPage;
