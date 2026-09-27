import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";



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

  const columns: Column<Coupon>[] = [
    { key: "code", header: "Code", render: (r) => <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold tracking-wider text-foreground">{r.code}</span> },
    { key: "discount", header: "Discount", render: (r) => <span className="font-semibold text-foreground">{r.discount}</span> },
    { key: "type", header: "Type", render: (r) => <StatusBadge tone="muted" label={r.type} dot={false} /> },
    { key: "usage", header: "Usage", render: (r) => (
      <div>
        <div className="text-xs font-semibold tabular-nums text-foreground">{r.used.toLocaleString()} / {r.limit.toLocaleString()}</div>
        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, r.used / r.limit * 100)}%` }} />
        </div>
      </div>
    ) },
    { key: "expires", header: "Expires" },
    { key: "status", header: "Status", render: (r) => <StatusBadge tone={r.status === "Active" ? "success" : r.status === "Scheduled" ? "info" : "muted"} label={r.status} /> },
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
        <DataTable columns={columns} rows={crud.rows} />
      </SectionCard>

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

export default CouponsPage;
