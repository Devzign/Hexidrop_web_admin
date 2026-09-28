import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import {
  Wallet, Eye, X, ArrowUpRight, ArrowDownLeft,
  CheckCircle2, FileText, Smartphone, DollarSign, Download
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Txn = {
  id: string; who: string; type: "Top up" | "Ride" | "Refund" | "Cashback";
  amount: number; time: string;
};

const INITIAL: Txn[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `WLT-${88010 + i}`,
  who: ["Tafadzwa Moyo", "Chipo Ncube", "Tinashe Chikafu", "Rutendo Sibanda", "Farai Mukamuri"][i % 5],
  type: (["Top up", "Ride", "Refund", "Cashback"] as const)[i % 4],
  amount: [+20, -8.4, +12, -18.6, +4][i % 5],
  time: `2026-07-14 ${(10 + i).toString().padStart(2, "0")}:22`,
}));

const FIELDS: FieldDef<Txn>[] = [
  { name: "who", label: "Account holder" },
  { name: "type", label: "Type", type: "select", options: ["Top up", "Ride", "Refund", "Cashback"] },
  { name: "amount", label: "Amount", type: "number" },
  { name: "time", label: "Time" },
];

export function WalletPage() {
  const crud = useCrud<Txn>(INITIAL, "Wallet entry");
  const [openTxn, setOpenTxn] = useState<Txn | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Finance", "Wallet"]}
        title="HexiDrop Wallet"
        subtitle="Customer and driver wallet activity, top-ups and adjustments"
        actions={
          <button
            onClick={() => crud.openCreate({ type: "Top up", amount: 0, time: new Date().toISOString().slice(0, 16).replace("T", " ") })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            New adjustment
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
          <div className="text-xs uppercase tracking-widest opacity-80 font-bold">Total wallet float</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">$284,120.44</div>
          <div className="mt-4 flex gap-2">
            <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">Customers · $184,220</span>
            <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">Drivers · $99,900</span>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Top-ups today</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-foreground">$8,420</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+14.2% vs. yesterday</div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Withdrawals today</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-foreground">$4,182</div>
          <div className="mt-1 text-xs text-muted-foreground">32 requests · 6 pending</div>
        </div>
      </div>

      <SectionCard title="Recent wallet activity" subtitle={`${crud.rows.length} entries`} padding="none">
        <ul className="divide-y">
          {crud.rows.map((t) => (
            <li
              key={t.id}
              onClick={() => setOpenTxn(t)}
              className="group/txn flex items-center gap-3 px-5 py-3 hover:bg-accent/40 cursor-pointer transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-foreground">
                {t.who.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span>{t.who}</span>
                  <Eye className="h-3 w-3 text-primary opacity-0 group-hover/txn:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-muted-foreground">{t.id} · {t.time}</div>
              </div>
              <StatusBadge tone="muted" label={t.type} dot={false} />
              <div className={`w-28 text-right font-bold tabular-nums ${Number(t.amount) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                {Number(t.amount) > 0 ? "+" : ""}${Number(t.amount).toFixed(2)}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <RowActions
                  onView={() => setOpenTxn(t)}
                  onEdit={() => crud.openEdit(t)}
                  onDuplicate={() => crud.duplicate(t)}
                  onDelete={() => crud.openDelete(t)}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Wallet Transaction Details Drawer */}
      {openTxn && (
        <WalletDrawer
          txn={openTxn}
          onClose={() => setOpenTxn(null)}
        />
      )}

      <RecordEditor<Txn> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit wallet entry" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Txn), ...next })} />
      <RecordEditor<Txn> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New wallet entry" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `WLT-${88500 + Math.floor(Math.random() * 999)}` } as Txn)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete entry?" description={crud.deleting ? `${crud.deleting.id} will be removed from wallet history.` : ""} />
    </div>
  );
}

function WalletDrawer({
  txn,
  onClose,
}: {
  txn: Txn;
  onClose: () => void;
}) {
  const isPositive = Number(txn.amount) > 0;

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
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
            } shadow-sm`}>
              {isPositive ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{txn.id}</h3>
                <StatusBadge tone={isPositive ? "success" : "muted"} label={txn.type} dot={false} />
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                <span>{txn.time}</span>
                <span> • </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Amount Spotlight Box */}
          <div className="rounded-2xl border p-5 text-center bg-secondary/30">
            <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Transaction Value</div>
            <div className={`mt-1.5 text-3xl font-extrabold tabular-nums ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
              {isPositive ? "+" : ""}${Number(txn.amount).toFixed(2)} USD
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Equivalent: ZiG {(Number(Math.abs(txn.amount)) * 13.8).toFixed(2)}
            </div>
          </div>

          {/* Account Details */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Holder Information</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Full Name:</span>
                <div className="mt-0.5 font-bold text-foreground">{txn.who}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Mobile Phone:</span>
                <div className="mt-0.5 font-semibold text-foreground">+263 77 348 2901</div>
              </div>
              <div>
                <span className="text-muted-foreground">Wallet Channel:</span>
                <div className="mt-0.5 font-semibold text-foreground">EcoCash Zimbabwe Instant</div>
              </div>
              <div>
                <span className="text-muted-foreground">Settlement Status:</span>
                <div className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Reconciled
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction Audit</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Reference Number</span>
                <span className="font-mono font-semibold text-foreground">ECO-ZW-90412891</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-semibold text-foreground">$0.00 (Zero Fee)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Net Ledger Impact</span>
                <span className="font-bold text-foreground">{isPositive ? "+" : ""}${Number(txn.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-mono text-muted-foreground">{txn.time} CAT</span>
              </div>
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
            onClick={() => {
              toast.success(`Receipt for ${txn.id} downloaded`);
            }}
            className="flex-1 rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download Receipt
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default WalletPage;
