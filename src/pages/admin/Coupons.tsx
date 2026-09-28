import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import {
  Tag, Eye, X, Copy, CheckCircle2,
  Calendar, Users, Percent, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Coupon = {
  id: string; code: string; discount: string; type: "Flat" | "Percent" | "Free";
  used: number; limit: number; expires: string; status: "Active" | "Scheduled" | "Expired";
};

const COUPONS: Coupon[] = [
  { id: "CPN-01", code: "HARARE20", discount: "20% off", type: "Percent", used: 842, limit: 2000, expires: "2026-08-31", status: "Active" },
  { id: "CPN-02", code: "BULA10", discount: "$10 off", type: "Flat", used: 320, limit: 500, expires: "2026-07-31", status: "Active" },
  { id: "CPN-03", code: "MOVEHOME", discount: "15% off moving", type: "Percent", used: 128, limit: 300, expires: "2026-09-15", status: "Active" },
  { id: "CPN-04", code: "FIRSTRIDE", discount: "Free delivery", type: "Free", used: 3820, limit: 5000, expires: "2026-12-31", status: "Active" },
  { id: "CPN-05", code: "BIZ50", discount: "50% off first month", type: "Percent", used: 42, limit: 100, expires: "2026-08-14", status: "Active" },
  { id: "CPN-06", code: "SPRING2026", discount: "$5 off", type: "Flat", used: 0, limit: 1000, expires: "2026-09-01", status: "Scheduled" },
];

const COUPON_FIELDS: FieldDef<Coupon>[] = [
  { name: "code", label: "Code" },
  { name: "discount", label: "Discount label" },
  { name: "type", label: "Type", type: "select", options: ["Flat", "Percent", "Free"] },
  { name: "limit", label: "Usage limit", type: "number" },
  { name: "used", label: "Used", type: "number" },
  { name: "expires", label: "Expires", type: "date" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Scheduled", "Expired"] },
];

export function CouponsPage() {
  const crud = useCrud<Coupon>(COUPONS, "Coupon");
  const [openCoupon, setOpenCoupon] = useState<Coupon | null>(null);

  const columns: Column<Coupon>[] = [
    { key: "code", header: "Code", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setOpenCoupon(r); }}
        className="group/id inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-bold tracking-wider text-foreground hover:ring-1 hover:ring-primary cursor-pointer transition-all"
        title="View campaign details"
      >
        <span>{r.code}</span>
        <Eye className="h-3 w-3 text-primary opacity-60 group-hover/id:opacity-100 transition-opacity" />
      </button>
    ) },
    { key: "discount", header: "Discount", render: (r) => <span className="font-semibold text-foreground">{r.discount}</span> },
    { key: "type", header: "Type", render: (r) => <StatusBadge tone="muted" label={r.type} dot={false} /> },
    { key: "usage", header: "Usage", render: (r) => (
      <div>
        <div className="text-xs font-semibold tabular-nums text-foreground">{r.used.toLocaleString()} / {r.limit.toLocaleString()}</div>
        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, (r.used / r.limit) * 100)}%` }} />
        </div>
      </div>
    ) },
    { key: "expires", header: "Expires" },
    { key: "status", header: "Status", render: (r) => <StatusBadge tone={r.status === "Active" ? "success" : r.status === "Scheduled" ? "info" : "muted"} label={r.status} /> },
    { key: "actions", header: "", render: (r) => (
      <RowActions
        onView={() => setOpenCoupon(r)}
        onEdit={() => crud.openEdit(r)}
        onDuplicate={() => crud.duplicate(r)}
        onDelete={() => crud.openDelete(r)}
      />
    ) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Business", "Coupons"]}
        title="Coupons & Promotions"
        subtitle="Discount codes, campaign performance and referral programs"
        actions={
          <button
            onClick={() => crud.openCreate({ type: "Percent", status: "Scheduled", used: 0, limit: 1000, expires: new Date().toISOString().slice(0, 10) })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Create coupon
          </button>
        }
      />

      <SectionCard title="All coupons" padding="none">
        <DataTable columns={columns} rows={crud.rows} onRowClick={(row) => setOpenCoupon(row as Coupon)} />
      </SectionCard>

      {/* Coupon Campaign Details Drawer */}
      {openCoupon && (
        <CouponDrawer
          coupon={openCoupon}
          onClose={() => setOpenCoupon(null)}
          onEdit={() => {
            const c = openCoupon;
            setOpenCoupon(null);
            crud.openEdit(c);
          }}
        />
      )}

      <RecordEditor<Coupon>
        open={!!crud.editing}
        onOpenChange={(v) => !v && crud.setEditing(null)}
        title="Edit coupon"
        fields={COUPON_FIELDS}
        value={crud.editing}
        onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Coupon), ...next })}
      />
      <RecordEditor<Coupon>
        open={!!crud.creating}
        onOpenChange={(v) => !v && crud.setCreating(null)}
        title="Create coupon"
        fields={COUPON_FIELDS}
        value={crud.creating}
        onSubmit={(next) =>
          crud.saveCreate({
            ...crud.creating,
            ...next,
            id: `CPN-${10 + Math.floor(Math.random() * 90)}`,
          } as Coupon)
        }
      />
      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Delete coupon?"
        description={crud.deleting ? `${crud.deleting.code} will no longer be redeemable.` : ""}
      />
    </div>
  );
}

function CouponDrawer({
  coupon,
  onClose,
  onEdit,
}: {
  coupon: Coupon;
  onClose: () => void;
  onEdit: () => void;
}) {
  const percentUsed = Math.min(100, Math.round((coupon.used / Math.max(1, coupon.limit)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <aside
        className="relative flex h-full w-full max-w-[540px] flex-col overflow-hidden bg-card shadow-elegant border-l animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm font-bold text-base">
              <Tag className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-foreground tracking-wide">{coupon.code}</h3>
                <StatusBadge
                  tone={coupon.status === "Active" ? "success" : coupon.status === "Scheduled" ? "info" : "muted"}
                  label={coupon.status}
                />
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                <span>{coupon.discount}</span>
                <span> • </span>
                <span>Expires {coupon.expires}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Usage Metrics */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Redemption Progress</span>
              <span className="text-xs font-bold text-primary">{percentUsed}% Redeemed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${percentUsed}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <span className="text-muted-foreground">Used Count:</span>
                <div className="mt-0.5 text-base font-bold tabular-nums text-foreground">{coupon.used.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Cap Limit:</span>
                <div className="mt-0.5 text-base font-bold tabular-nums text-foreground">{coupon.limit.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Rules & Eligibility */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Campaign Rules</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Discount Value</span>
                <span className="font-bold text-foreground">{coupon.discount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Discount Structure</span>
                <span className="font-semibold text-foreground">{coupon.type} Discount</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Eligible Cities</span>
                <span className="font-semibold text-foreground">Harare, Bulawayo, Mutare</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Applies To</span>
                <span className="font-semibold text-foreground">Courier & Movers</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Min. Order Value</span>
                <span className="font-semibold text-foreground">$10.00 USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard?.writeText(coupon.code);
              toast.success(`Promo code ${coupon.code} copied!`);
            }}
            className="flex-1 rounded-xl text-xs font-semibold gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Code
          </Button>
          <Button
            onClick={onEdit}
            className="flex-1 rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground"
          >
            Edit Coupon
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default CouponsPage;
