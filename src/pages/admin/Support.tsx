import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { CUSTOMER_NAMES } from "@/lib/mock-data";



type Ticket = {
  id: string; subject: string; customer: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Waiting" | "Escalated" | "Resolved";
  age: string;
};

const SUBJECTS = [
  "Driver didn't arrive on time", "Wrong pickup location", "Payment charged twice",
  "Parcel damaged during delivery", "Need refund for cancelled order",
  "How to add a business account", "Driver was rude", "Wallet top-up failed",
];

const INITIAL: Ticket[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `TIC-${5810 + i}`,
  subject: SUBJECTS[i],
  customer: CUSTOMER_NAMES[i],
  priority: (["High", "Medium", "Urgent", "Low", "Medium", "Low", "High", "Medium"] as const)[i],
  status: (["Open", "In Progress", "Waiting", "Open", "Resolved", "In Progress", "Escalated", "Open"] as const)[i],
  age: `${1 + i}h`,
}));

const FIELDS: FieldDef<Ticket>[] = [
  { name: "subject", label: "Subject", full: true },
  { name: "customer", label: "Customer" },
  { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Urgent"] },
  { name: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Waiting", "Escalated", "Resolved"] },
  { name: "age", label: "Age" },
];

export function SupportPage() {
  const crud = useCrud<Ticket>(INITIAL, "Ticket");

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Platform", "Support"]}
        title="Customer Support"
        subtitle="Tickets, escalations and live chat conversations"
        actions={
          <button
            onClick={() => crud.openCreate({ priority: "Medium", status: "Open", age: "0h" })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            New ticket
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[
          { l: "Open", v: String(crud.rows.filter(r => r.status === "Open").length) },
          { l: "In progress", v: String(crud.rows.filter(r => r.status === "In Progress").length) },
          { l: "Escalated", v: String(crud.rows.filter(r => r.status === "Escalated").length) },
          { l: "Resolved", v: String(crud.rows.filter(r => r.status === "Resolved").length) },
          { l: "Avg. reply time", v: "4m" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Tickets queue" subtitle={`${crud.rows.length} tickets`} padding="none">
        <ul className="divide-y">
          {crud.rows.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-accent/30">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-xs font-semibold">
                {t.customer.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                  <StatusBadge tone={t.priority === "Urgent" ? "destructive" : t.priority === "High" ? "warning" : "muted"} label={t.priority} dot={false} />
                </div>
                <div className="mt-0.5 truncate text-sm font-medium">{t.subject}</div>
                <div className="text-[11px] text-muted-foreground">{t.customer} · {t.age} ago</div>
              </div>
              <StatusBadge
                tone={t.status === "Resolved" ? "success" : t.status === "Escalated" ? "destructive" : t.status === "In Progress" ? "info" : "warning"}
                label={t.status}
              />
              <RowActions onEdit={() => crud.openEdit(t)} onDuplicate={() => crud.duplicate(t)} onDelete={() => crud.openDelete(t)} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <RecordEditor<Ticket> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit ticket" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Ticket), ...next })} />
      <RecordEditor<Ticket> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New ticket" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `TIC-${5900 + Math.floor(Math.random() * 999)}` } as Ticket)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete ticket?" description={crud.deleting ? `${crud.deleting.id} will be removed.` : ""} />
    </div>
  );
}

export default SupportPage;
