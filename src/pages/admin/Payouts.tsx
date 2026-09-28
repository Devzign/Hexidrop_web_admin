import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { DRIVERS } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  CreditCard, Eye, X, Landmark, Smartphone,
  CheckCircle2, AlertCircle, ArrowUpRight, DollarSign, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [openPayout, setOpenPayout] = useState<Row | null>(null);

  const setStatus = (r: Row, status: Row["status"]) => {
    crud.saveEdit({ ...r, status });
    if (openPayout && openPayout.id === r.id) {
      setOpenPayout({ ...openPayout, status });
    }
  };

  const columns: Column<Row>[] = [
    { key: "id", header: "Payout", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenPayout(r); }}
        className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
        title="View payout settlement"
      >
        <span>{r.id}</span>
        <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
    { key: "driver", header: "Driver" },
    { key: "period", header: "Period" },
    { key: "method", header: "Method", render: (r) => <StatusBadge tone={r.method === "Bank" ? "info" : "primary"} label={r.method} dot={false} /> },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-semibold tabular-nums text-foreground">${Number(r.amount).toLocaleString()}</span> },
    { key: "status", header: "Status", render: (r) => (
      <StatusBadge
        tone={r.status === "Paid" || r.status === "Approved" ? "success" : r.status === "Rejected" ? "destructive" : "warning"}
        label={r.status}
      />
    ) },
    { key: "quick", header: "", render: (r) => (
      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setStatus(r, "Approved")} className="h-7 rounded-md border px-2 text-xs font-medium hover:bg-accent text-emerald-600 dark:text-emerald-400">Approve</button>
        <button onClick={() => setStatus(r, "Rejected")} className="h-7 rounded-md border px-2 text-xs font-medium hover:bg-accent text-destructive">Reject</button>
      </div>
    ) },
    { key: "actions", header: "", render: (r) => (
      <RowActions
        onView={() => setOpenPayout(r)}
        onEdit={() => crud.openEdit(r)}
        onDuplicate={() => crud.duplicate(r)}
        onDelete={() => crud.openDelete(r)}
      />
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
            <div className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Payout requests" subtitle={`${crud.rows.length} requests`} padding="none">
        <DataTable columns={columns} rows={crud.rows} onRowClick={(row) => setOpenPayout(row as Row)} />
      </SectionCard>

      {/* Payout Details Drawer */}
      {openPayout && (
        <PayoutDrawer
          payout={openPayout}
          onClose={() => setOpenPayout(null)}
          onApprove={() => {
            setStatus(openPayout, "Approved");
            toast.success(`Payout ${openPayout.id} marked as Approved`);
          }}
          onReject={() => {
            setStatus(openPayout, "Rejected");
            toast.error(`Payout ${openPayout.id} has been Rejected`);
          }}
          onMarkPaid={() => {
            setStatus(openPayout, "Paid");
            toast.success(`Payout ${openPayout.id} settled and marked Paid`);
          }}
        />
      )}

      <RecordEditor<Row> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit payout" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Row), ...next })} />
      <RecordEditor<Row> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New payout" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `PYT-${9100 + Math.floor(Math.random() * 999)}` } as Row)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete payout?" description={crud.deleting ? `${crud.deleting.id} will be removed.` : ""} />
    </div>
  );
}

function PayoutDrawer({
  payout,
  onClose,
  onApprove,
  onReject,
  onMarkPaid,
}: {
  payout: Row;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onMarkPaid: () => void;
}) {
  const isEcoCash = payout.method === "EcoCash";
  const isBank = payout.method === "Bank";

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
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-base font-bold text-primary-foreground shadow-sm">
              {isBank ? <Landmark className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{payout.id}</h3>
                <StatusBadge
                  tone={payout.status === "Paid" || payout.status === "Approved" ? "success" : payout.status === "Rejected" ? "destructive" : "warning"}
                  label={payout.status}
                />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{payout.driver}</span>
                <span>•</span>
                <span>{payout.period}</span>
                <span>•</span>
                <span className="font-semibold text-primary">{payout.method}</span>
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
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Payout Amount</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-foreground">${Number(payout.amount).toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Commission (15%)</div>
              <div className="mt-1 text-lg font-bold tabular-nums text-muted-foreground">${(Number(payout.amount) * 0.15).toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Settlement Period</div>
              <div className="mt-1 text-sm font-bold text-foreground">{payout.period}</div>
            </div>
          </div>

          {/* Recipient Account Details (Zimbabwe specific) */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recipient Payment Account</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Account Holder:</span>
                <div className="mt-0.5 font-bold text-foreground">{payout.driver}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Payout Channel:</span>
                <div className="mt-0.5 font-semibold text-foreground">{payout.method}</div>
              </div>
              {isEcoCash ? (
                <>
                  <div>
                    <span className="text-muted-foreground">EcoCash Number:</span>
                    <div className="mt-0.5 font-mono font-bold text-foreground">+263 77 412 8900</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Econet KYC:</span>
                    <div className="mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">Tier 3 Verified</div>
                  </div>
                </>
              ) : isBank ? (
                <>
                  <div>
                    <span className="text-muted-foreground">Financial Institution:</span>
                    <div className="mt-0.5 font-semibold text-foreground">Stanbic Bank Zimbabwe</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Number:</span>
                    <div className="mt-0.5 font-mono font-bold text-foreground">9140003849182</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Branch Code:</span>
                    <div className="mt-0.5 font-mono text-foreground">02401 (Nelson Mandela)</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transfer Type:</span>
                    <div className="mt-0.5 text-foreground font-medium">ZIPIT / RTGS Direct</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-muted-foreground">OneMoney Phone:</span>
                    <div className="mt-0.5 font-mono font-bold text-foreground">+263 71 892 4410</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NetOne Network:</span>
                    <div className="mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">Registered</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Settlement Timeline</div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 h-3 w-3 rounded-full bg-emerald-600 shrink-0 ring-4 ring-emerald-500/20" />
                <div>
                  <div className="font-semibold text-foreground">Payout Batch Generated</div>
                  <div className="text-[11px] text-muted-foreground">Automatic weekly driver earnings reconciliation</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
                  payout.status !== "Pending" ? "bg-emerald-600 ring-emerald-500/20" : "bg-amber-500 ring-amber-500/20"
                }`} />
                <div>
                  <div className="font-semibold text-foreground">Finance Operations Approval</div>
                  <div className="text-[11px] text-muted-foreground">
                    {payout.status === "Approved" || payout.status === "Paid" ? "Approved by Finance Lead" : "Awaiting sign-off"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
                  payout.status === "Paid" ? "bg-emerald-600 ring-emerald-500/20" : "bg-muted ring-border/30"
                }`} />
                <div>
                  <div className="font-semibold text-foreground">Disbursed to Driver Wallet / Account</div>
                  <div className="text-[11px] text-muted-foreground">
                    {payout.status === "Paid" ? "Funds successfully credited" : "Pending disbursement"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          {payout.status === "Pending" && (
            <>
              <Button
                variant="outline"
                onClick={onReject}
                className="flex-1 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                Reject Payout
              </Button>
              <Button
                onClick={onApprove}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white"
              >
                Approve Settlement
              </Button>
            </>
          )}
          {payout.status === "Approved" && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl text-xs font-semibold"
              >
                Close
              </Button>
              <Button
                onClick={onMarkPaid}
                className="flex-1 rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground"
              >
                Mark as Paid
              </Button>
            </>
          )}
          {(payout.status === "Paid" || payout.status === "Rejected") && (
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full rounded-xl text-xs font-semibold"
            >
              Close
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default PayoutsPage;
