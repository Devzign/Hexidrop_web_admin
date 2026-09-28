import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import {
  Building2, Eye, X, Phone, Mail, MapPin,
  CreditCard, ShieldCheck, DollarSign, UserCheck, FileText
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [openCompany, setOpenCompany] = useState<Company | null>(null);

  const columns: Column<Company>[] = [
    { key: "name", header: "Company", render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold text-xs font-bold text-brand-navy shadow-sm">
          {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-foreground">{r.name}</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.industry}</div>
        </div>
      </div>
    ) },
    { key: "id", header: "Account", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenCompany(r); }}
        className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
        title="View corporate account"
      >
        <span>{r.id}</span>
        <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
    { key: "manager", header: "Dedicated manager", render: (r) => <span className="font-medium text-foreground">{r.manager}</span> },
    { key: "monthly", header: "Monthly volume", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.monthly.toLocaleString()}</span> },
    { key: "credit", header: "Credit limit", align: "right", render: (r) => <span className="font-medium tabular-nums text-slate-600 dark:text-slate-400">${r.credit.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge tone={r.status === "Active" ? "success" : r.status === "Pending" ? "warning" : "muted"} label={r.status} /> },
    { key: "actions" as keyof Company, header: "", align: "right", render: (r) => (
      <RowActions
        onView={() => setOpenCompany(r)}
        onEdit={() => crud.openEdit(r)}
        onDuplicate={() => crud.duplicate(r)}
        onDelete={() => crud.openDelete(r)}
      />
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
        <DataTable columns={columns} rows={crud.rows} onRowClick={(row) => setOpenCompany(row as Company)} />
      </SectionCard>

      {/* Corporate Account Details Drawer */}
      {openCompany && (
        <BusinessDrawer
          company={openCompany}
          onClose={() => setOpenCompany(null)}
          onEdit={() => {
            const c = openCompany;
            setOpenCompany(null);
            crud.openEdit(c);
          }}
        />
      )}

      <RecordEditor<Company> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit company" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Company), ...next })} />
      <RecordEditor<Company> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="Onboard company" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `BIZ-${2200 + Math.floor(Math.random() * 999)}` } as Company)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Remove company?" description={crud.deleting ? `${crud.deleting.name} will be removed.` : ""} />
    </div>
  );
}

function BusinessDrawer({
  company,
  onClose,
  onEdit,
}: {
  company: Company;
  onClose: () => void;
  onEdit: () => void;
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
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-gold text-sm font-bold text-brand-navy shadow-sm">
              {company.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{company.name}</h3>
                <StatusBadge tone={company.status === "Active" ? "success" : company.status === "Pending" ? "warning" : "muted"} label={company.status} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono font-bold text-foreground">{company.id}</span>
                <span>•</span>
                <span>{company.industry} Sector</span>
                <span>•</span>
                <span>Enterprise Tier</span>
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
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Monthly Spend</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">${company.monthly.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Credit Line</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">${company.credit.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Payment Terms</div>
              <div className="mt-1 text-sm font-bold text-primary">Net 30 Days</div>
            </div>
          </div>

          {/* Account Manager Card */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dedicated Account Manager</div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5" /> Assigned
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                {company.manager.split(" ").map((s) => s[0]).join("")}
              </span>
              <div className="flex-1 text-xs">
                <div className="font-bold text-foreground text-sm">{company.manager}</div>
                <div className="text-muted-foreground">Senior Corporate Logistics Partner</div>
              </div>
              <button
                onClick={() => toast.info(`Direct line connected to ${company.manager}`)}
                className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold text-foreground hover:bg-accent"
              >
                <Phone className="h-3.5 w-3.5 text-primary" /> Contact
              </button>
            </div>
          </div>

          {/* Statutory & Tax Info (Zimbabwe) */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Corporate Tax & Compliance (ZIMRA)</div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> ITF263 Valid
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">BP / Tax Number:</span>
                <div className="mt-0.5 font-mono font-semibold text-foreground">BP002948190</div>
              </div>
              <div>
                <span className="text-muted-foreground">ZIMRA Clearance:</span>
                <div className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">Active until Dec 2026</div>
              </div>
              <div>
                <span className="text-muted-foreground">Billing Currency:</span>
                <div className="mt-0.5 font-semibold text-foreground">USD & ZiG (Dual Currency)</div>
              </div>
              <div>
                <span className="text-muted-foreground">Discount Rate:</span>
                <div className="mt-0.5 font-semibold text-foreground">15% Bulk Discount</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Headquarters:</span>
                <div className="mt-0.5 font-medium text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span>Samora Machel Avenue, Harare Central Business District</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Corporate Sub-Users */}
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Authorized Dispatchers</div>
              <span className="text-xs text-muted-foreground">4 Active Seats</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { name: "Harare Main Depot Logistics", role: "Warehouse Dispatcher", orders: "420 orders/mo" },
                { name: "Bulawayo Branch Office", role: "Branch Coordinator", orders: "180 orders/mo" },
              ].map((seat, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 border border-border/40">
                  <div>
                    <div className="font-semibold text-foreground">{seat.name}</div>
                    <div className="text-[11px] text-muted-foreground">{seat.role}</div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{seat.orders}</span>
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
          <Button
            onClick={onEdit}
            className="flex-1 rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground"
          >
            Edit Corporate Account
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default BusinessPage;
