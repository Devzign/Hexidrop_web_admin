import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Filter, Download, Search, X, Eye } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { ORDERS, type Order } from "@/lib/mock-data";
import { VehicleThumb } from "@/components/public/VehicleIcon";



const STATUS_TABS = ["All", "In Transit", "Assigned", "Pending", "Completed", "Cancelled"] as const;
const ORDER_STATUS = ["Completed", "In Transit", "Pending", "Assigned", "Cancelled"] as const;
const PAYMENT_METHODS = ["Cash", "Card", "Wallet", "EcoCash"] as const;

const ORDER_FIELDS: FieldDef<Order>[] = [
  { name: "customer", label: "Customer" },
  { name: "driver", label: "Driver" },
  { name: "vehicle", label: "Vehicle" },
  { name: "city", label: "City" },
  { name: "pickup", label: "Pickup address", full: true },
  { name: "drop", label: "Drop address", full: true },
  { name: "status", label: "Status", type: "select", options: ORDER_STATUS },
  { name: "payment", label: "Payment", type: "select", options: PAYMENT_METHODS },
  { name: "fare", label: "Fare ($)", type: "number" },
  { name: "distance", label: "Distance (km)", type: "number" },
];

export function OrdersPage() {
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("All");
  const [q, setQ] = useState("");
  const [openOrder, setOpenOrder] = useState<Order | null>(null);
  const crud = useCrud<Order>(ORDERS, "Order");

  const filtered = useMemo(() => {
    return crud.rows.filter((o) => {
      const t = tab === "All" || o.status === tab;
      const s = q === "" || (o.id + o.customer + o.driver + o.city).toLowerCase().includes(q.toLowerCase());
      return t && s;
    });
  }, [tab, q, crud.rows]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: ORDERS.length };
    for (const s of STATUS_TABS.slice(1)) m[s] = crud.rows.filter((o) => o.status === s).length;
    m.All = crud.rows.length;
    return m;
  }, [crud.rows]);

  const columns: Column<Order>[] = [
    { key: "id", header: "Order", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenOrder(r); }}
        className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
        title="View order details"
      >
        <span>{r.id}</span>
        <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
    { key: "customer", header: "Customer", render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-foreground">
          {r.customer.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-foreground">{r.customer}</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.city}</div>
        </div>
      </div>
    ) },
    { key: "route", header: "Route", render: (r) => (
      <div className="text-xs font-medium leading-tight text-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="truncate">{r.pickup}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span className="truncate">{r.drop}</span>
        </div>
      </div>
    ) },
    { key: "driver", header: "Driver", render: (r) => <span className="text-[13px] font-medium text-foreground">{r.driver}</span> },
    { key: "vehicle", header: "Vehicle", render: (r) => (
      <div className="flex items-center gap-2">
        <VehicleThumb type={r.vehicle} className="h-6 w-9 shrink-0 rounded bg-secondary/50 p-0.5 border border-border/40" />
        <span className="text-xs font-semibold text-foreground">{r.vehicle}</span>
      </div>
    ) },
    { key: "distance", header: "Distance", align: "right", render: (r) => <span className="text-xs font-medium tabular-nums text-slate-600 dark:text-slate-400">{r.distance} km</span> },
    { key: "fare", header: "Fare", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.fare.toFixed(2)}</span> },
    { key: "payment", header: "Payment", render: (r) => <StatusBadge label={r.payment} tone="muted" dot={false} /> },
    { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
    { key: "actions", header: "", render: (r) => (
      <RowActions
        onView={() => setOpenOrder(r)}
        onEdit={() => crud.openEdit(r)}
        onDuplicate={() => crud.duplicate(r)}
        onDelete={() => crud.openDelete(r)}
      />
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Operations", "Orders"]}
        title="Orders"
        subtitle="Manage every delivery across the HexiDrop network"
        actions={
          <>
            <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => crud.openCreate({ status: "Pending", payment: "Cash", fare: 0, distance: 0 })}
              className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >
              New Order
            </button>
          </>
        }
      />

      <SectionCard padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
          <div className="flex flex-wrap gap-1">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => setTab(s)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  tab === s
                    ? "bg-primary/15 text-primary"
                    : "text-slate-700 dark:text-slate-300 hover:bg-muted hover:text-foreground"
                }`}
              >
                {s}
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${tab === s ? "bg-primary/20 text-primary" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {counts[s] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search order, customer, driver…"
              className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-3 text-sm outline-none focus:bg-card focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <DataTable columns={columns} rows={filtered} onRowClick={(row) => setOpenOrder(row as Order)} />

        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <div>Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {crud.rows.length} orders</div>
          <div className="flex items-center gap-1">
            <button className="h-7 rounded-md border bg-card px-2 hover:bg-accent">Previous</button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={`h-7 w-7 rounded-md ${p === 1 ? "bg-primary text-primary-foreground" : "border bg-card hover:bg-accent"}`}>
                {p}
              </button>
            ))}
            <button className="h-7 rounded-md border bg-card px-2 hover:bg-accent">Next</button>
          </div>
        </div>
      </SectionCard>

      {/* Order Drawer */}
      {openOrder && <OrderDrawer order={openOrder} onClose={() => setOpenOrder(null)} />}

      <RecordEditor<Order>
        open={!!crud.editing}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit order"
        description={crud.editing ? `Update details for ${crud.editing.id}` : undefined}
        fields={ORDER_FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Order), ...next })}
      />
      <RecordEditor<Order>
        open={!!crud.creating}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="New order"
        fields={ORDER_FIELDS}
        value={crud.creating}
        onSubmit={(next) => {
          const seed = {
            ...crud.creating,
            ...next,
            id: `HXD-${Math.floor(50000 + Math.random() * 9999)}`,
            eta: (next as Order).eta ?? "—",
            createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          } as Order;
          crud.saveCreate(seed);
        }}
      />
      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Delete order?"
        description={crud.deleting ? `${crud.deleting.id} will be permanently removed.` : ""}
      />
    </div>
  );
}

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <aside
        className="relative flex h-full w-full max-w-[560px] flex-col overflow-hidden bg-card shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Order</div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="font-mono text-lg font-semibold">{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Created {order.createdAt}</div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Fare summary */}
          <div className="grid grid-cols-3 gap-3">
            <MiniField label="Fare" value={`$${order.fare.toFixed(2)}`} />
            <MiniField label="Distance" value={`${order.distance} km`} />
            <MiniField label="ETA" value={order.eta} />
          </div>

          {/* Timeline */}
          <h4 className="mt-6 text-sm font-semibold">Timeline</h4>
          <ol className="mt-3 space-y-4">
            {[
              { t: "Order placed", d: order.createdAt, done: true },
              { t: "Assigned to driver", d: `${order.driver} · ${order.vehicle}`, done: true },
              { t: "Picked up", d: order.pickup, done: order.status !== "Pending" && order.status !== "Assigned" },
              { t: "In transit", d: `${order.distance} km · ETA ${order.eta}`, done: order.status === "In Transit" || order.status === "Completed" },
              { t: "Delivered", d: order.drop, done: order.status === "Completed" },
            ].map((s, i, arr) => (
              <li key={i} className="relative flex gap-3">
                <div className="relative flex flex-col items-center">
                  <span className={`z-10 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-card ${s.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {s.done ? "✓" : ""}
                  </span>
                  {i < arr.length - 1 && <span className={`w-0.5 flex-1 ${s.done ? "bg-primary" : "bg-border"}`} style={{ minHeight: 24 }} />}
                </div>
                <div className="pb-3">
                  <div className={`text-sm font-medium ${s.done ? "" : "text-muted-foreground"}`}>{s.t}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>

          {/* People */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Customer</div>
              <div className="mt-1 text-sm font-semibold">{order.customer}</div>
              <div className="text-xs text-muted-foreground">{order.city}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Driver</div>
              <div className="mt-1 text-sm font-semibold">{order.driver}</div>
              <div className="text-xs text-muted-foreground">{order.vehicle}</div>
            </div>
          </div>

          {/* Parcel */}
          <div className="mt-4 rounded-xl border p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Parcel</div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
              <div><div className="text-xs text-muted-foreground">Weight</div><div className="font-medium">4.2 kg</div></div>
              <div><div className="text-xs text-muted-foreground">Dim.</div><div className="font-medium">30×20×15</div></div>
              <div><div className="text-xs text-muted-foreground">Type</div><div className="font-medium">Documents</div></div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t px-6 py-4">
          <button className="h-9 flex-1 rounded-xl border bg-card text-sm font-semibold hover:bg-accent">Contact driver</button>
          <button className="h-9 flex-1 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground">Live track</button>
        </div>
      </aside>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default OrdersPage;
