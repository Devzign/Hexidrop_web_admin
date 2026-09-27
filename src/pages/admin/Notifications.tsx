import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";



type Campaign = {
  id: string; name: string; channel: string; audience: string;
  status: "Sent" | "Scheduled" | "Draft"; when: string;
};

const INITIAL: Campaign[] = ([
  { name: "Winter special · 20% off in Harare", channel: "Push · SMS", status: "Sent", audience: "48,220 recipients", when: "Yesterday" },
  { name: "Onboarding — new drivers", channel: "Email", status: "Sent", audience: "34 new drivers", when: "2 days ago" },
  { name: "Movers weekend promo", channel: "Push · Email", status: "Scheduled", audience: "12,840 recipients", when: "Fri 09:00" },
  { name: "Business account webinar", channel: "Email", status: "Draft", audience: "384 corporate contacts", when: "—" },
] as const).map((c, i) => ({ id: `CMP-${710 + i}`, ...c }));

const FIELDS: FieldDef<Campaign>[] = [
  { name: "name", label: "Name", full: true },
  { name: "channel", label: "Channel", type: "select", options: ["Push", "SMS", "Email", "Push · SMS", "Push · Email", "In-app"] },
  { name: "audience", label: "Audience" },
  { name: "status", label: "Status", type: "select", options: ["Sent", "Scheduled", "Draft"] },
  { name: "when", label: "When" },
];

export function NotificationsPage() {
  const crud = useCrud<Campaign>(INITIAL, "Campaign");

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Platform", "Notifications"]}
        title="Notifications"
        subtitle="Push, SMS, email campaigns and in-app announcements"
        actions={
          <button
            onClick={() => crud.openCreate({ status: "Draft", channel: "Push", when: "—" })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            New campaign
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { l: "Push sent (7d)", v: "128,420" },
          { l: "SMS sent (7d)", v: "18,240" },
          { l: "Email open rate", v: "42%" },
          { l: "Delivery rate", v: "98.6%" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Campaigns" subtitle={`${crud.rows.length} campaigns`} padding="none">
        <ul className="divide-y">
          {crud.rows.map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">{c.channel} · {c.audience}</div>
              </div>
              <StatusBadge tone={c.status === "Sent" ? "success" : c.status === "Scheduled" ? "info" : "muted"} label={c.status} />
              <span className="w-24 text-right text-xs text-muted-foreground">{c.when}</span>
              <RowActions onEdit={() => crud.openEdit(c)} onDuplicate={() => crud.duplicate(c)} onDelete={() => crud.openDelete(c)} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <RecordEditor<Campaign> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit campaign" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Campaign), ...next })} />
      <RecordEditor<Campaign> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New campaign" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `CMP-${800 + Math.floor(Math.random() * 999)}` } as Campaign)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete campaign?" description={crud.deleting ? `${crud.deleting.name} will be removed.` : ""} />
    </div>
  );
}

export default NotificationsPage;
