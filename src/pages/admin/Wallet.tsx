import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";



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
          <div className="text-xs uppercase tracking-widest opacity-80">Total wallet float</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">$284,120.44</div>
          <div className="mt-4 flex gap-2">
            <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">Customers · $184,220</span>
            <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-medium">Drivers · $99,900</span>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Top-ups today</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">$8,420</div>
          <div className="mt-1 text-xs text-success">+14.2% vs. yesterday</div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Withdrawals today</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums">$4,182</div>
          <div className="mt-1 text-xs text-muted-foreground">32 requests · 6 pending</div>
        </div>
      </div>

      <SectionCard title="Recent wallet activity" subtitle={`${crud.rows.length} entries`} padding="none">
        <ul className="divide-y">
          {crud.rows.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-sm font-semibold">
                {t.who.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{t.who}</div>
                <div className="text-[11px] text-muted-foreground">{t.id} · {t.time}</div>
              </div>
              <StatusBadge tone="muted" label={t.type} dot={false} />
              <div className={`w-24 text-right font-semibold tabular-nums ${Number(t.amount) > 0 ? "text-success" : "text-foreground"}`}>
                {Number(t.amount) > 0 ? "+" : ""}${Number(t.amount).toFixed(2)}
              </div>
              <RowActions onEdit={() => crud.openEdit(t)} onDuplicate={() => crud.duplicate(t)} onDelete={() => crud.openDelete(t)} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <RecordEditor<Txn> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit wallet entry" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Txn), ...next })} />
      <RecordEditor<Txn> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New wallet entry" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `WLT-${88500 + Math.floor(Math.random() * 999)}` } as Txn)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete entry?" description={crud.deleting ? `${crud.deleting.id} will be removed from wallet history.` : ""} />
    </div>
  );
}

export default WalletPage;
