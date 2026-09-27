import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { DRIVERS } from "@/lib/mock-data";
import { toast } from "sonner";



type Row = {
  id: string; driver: string; method: "Bank" | "EcoCash" | "OneMoney";
  amount: number; period: string; status: "Pending" | "Approved" | "Rejected" | "Paid";
};

const INITIAL: Row[] = DRIVERS.slice(0, 14).map((d, i) => ({
  id: `PYT-${9020 + i}`,
  driver: d.name,
  method: (["Bank", "EcoCash", "OneMoney"] as const)[i % 3],
  amount: d.earnings,
  period: `Week ${28 + (i % 3)}`,
  status: (["Pending", "Approved", "Paid", "Rejected", "Pending"] as const)[i % 5],
}));

const FIELDS: FieldDef<Row>[] = [
  { name: "driver", label: "Driver", type: "select", options: DRIVERS.map((d) => d.name) },
  { name: "period", label: "Period" },
  { name: "method", label: "Method", type: "select", options: ["Bank", "EcoCash", "OneMoney"] },
  { name: "amount", label: "Amount", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Paid", "Rejected"] },
];

export function PayoutsPage() {
  const crud = useCrud<Row>(INITIAL, "Payout");

  const setStatus = (r: Row, status: Row["status"]) => {
    crud.saveEdit({ ...r, status });
  };

  const columns: Column<Row>[] = [
    { key: "id", header: "Payout", render: (r) => <span className="font-mono text-[13px] font-semibold">{r.id}</span> },
    { key: "driver", header: "Driver" },
    { key: "period", header: "Period" },
    { key: "method", header: "Method", render: (r) => <StatusBadge tone={r.method === "Bank" ? "info" : "primary"} label={r.method} dot={false} /> },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-semibold tabular-nums">${Number(r.amount).toLocaleString()}</span> },
    { key: "status", header: "Status", render: (r) => (
      <StatusBadge
        tone={r.status === "Paid" || r.status === "Approved" ? "success" : r.status === "Rejected" ? "destructive" : "warning"}
        label={r.status}
      />
    ) },
    { key: "quick", header: "", render: (r) => (
      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setStatus(r, "Approved")} className="h-7 rounded-md border px-2 text-xs font-medium hover:bg-accent">Approve</button>
        <button onClick={() => setStatus(r, "Rejected")} className="h-7 rounded-md border px-2 text-xs font-medium hover:bg-accent">Reject</button>
      </div>
    ) },
    { key: "actions", header: "", render: (r) => (
      <RowActions onEdit={() => crud.openEdit(r)} onDuplicate={() => crud.duplicate(r)} onDelete={() => crud.openDelete(r)} />
    ) },
  ];

  const pending = crud.rows.filter((r) => r.status === "Pending").length;
  const total = crud.rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Finance", "Driver Payouts"]}
        title="Driver Payouts"
        subtitle="Weekly settlements via Bank, EcoCash and OneMoney"
        actions={
          <>
            <button
              onClick={() => {
                crud.rows.filter((r) => r.status === "Pending").forEach((r) => crud.saveEdit({ ...r, status: "Approved" }));
                toast.success("Batch processed", { description: `${pending} payouts approved.` });
              }}
              className="h-9 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent"
            >
              Process batch
            </button>
            <button
              onClick={() => crud.openCreate({ method: "Bank", status: "Pending", period: `Week ${new Date().getUTCDate()}`, amount: 0 })}
              className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >
              New payout
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: "Pending", v: String(pending) },
          { l: "This week", v: `$${total.toLocaleString()}` },
          { l: "Bank transfers", v: "$18,240" },
          { l: "Mobile money", v: "$12,880" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Payout requests" subtitle={`${crud.rows.length} requests`} padding="none">
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

      <RecordEditor<Row> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit payout" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Row), ...next })} />
      <RecordEditor<Row> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New payout" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `PYT-${9100 + Math.floor(Math.random() * 999)}` } as Row)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete payout?" description={crud.deleting ? `${crud.deleting.id} will be removed.` : ""} />
    </div>
  );
}

export default PayoutsPage;
