import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { CUSTOMER_NAMES } from "@/lib/mock-data";
import {
  LifeBuoy, Eye, X, Send, User, Clock,
  AlertTriangle, CheckCircle2, Phone, MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  const setStatus = (t: Ticket, status: Ticket["status"]) => {
    crud.saveEdit({ ...t, status });
    if (openTicket && openTicket.id === t.id) {
      setOpenTicket({ ...openTicket, status });
    }
  };

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
            <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Tickets queue" subtitle={`${crud.rows.length} tickets`} padding="none">
        <ul className="divide-y">
          {crud.rows.map((t) => (
            <li
              key={t.id}
              onClick={() => setOpenTicket(t)}
              className="group/item flex items-center gap-3 px-5 py-3 hover:bg-accent/40 cursor-pointer transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-xs font-semibold text-foreground">
                {t.customer.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-primary group-hover/item:underline flex items-center gap-1">
                    {t.id}
                    <Eye className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </span>
                  <StatusBadge tone={t.priority === "Urgent" ? "destructive" : t.priority === "High" ? "warning" : "muted"} label={t.priority} dot={false} />
                </div>
                <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{t.subject}</div>
                <div className="text-[11px] text-muted-foreground">{t.customer} · {t.age} ago</div>
              </div>
              <StatusBadge
                tone={t.status === "Resolved" ? "success" : t.status === "Escalated" ? "destructive" : t.status === "In Progress" ? "info" : "warning"}
                label={t.status}
              />
              <div onClick={(e) => e.stopPropagation()}>
                <RowActions
                  onView={() => setOpenTicket(t)}
                  onEdit={() => crud.openEdit(t)}
                  onDuplicate={() => crud.duplicate(t)}
                  onDelete={() => crud.openDelete(t)}
                />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Support Ticket Details Drawer */}
      {openTicket && (
        <TicketDrawer
          ticket={openTicket}
          onClose={() => setOpenTicket(null)}
          onStatusChange={(status) => {
            setStatus(openTicket, status);
            toast.success(`Ticket ${openTicket.id} updated to ${status}`);
          }}
        />
      )}

      <RecordEditor<Ticket> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit ticket" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Ticket), ...next })} />
      <RecordEditor<Ticket> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New ticket" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `TIC-${5900 + Math.floor(Math.random() * 999)}` } as Ticket)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete ticket?" description={crud.deleting ? `${crud.deleting.id} will be removed.` : ""} />
    </div>
  );
}

function TicketDrawer({
  ticket,
  onClose,
  onStatusChange,
}: {
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (status: Ticket["status"]) => void;
}) {
  const [reply, setReply] = useState("");

  const handleSendReply = () => {
    if (!reply.trim()) return;
    toast.success("Reply dispatched to customer via SMS and In-App Push");
    setReply("");
  };

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
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-base font-bold text-foreground">
              {ticket.customer.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{ticket.id}</h3>
                <StatusBadge
                  tone={ticket.status === "Resolved" ? "success" : ticket.status === "Escalated" ? "destructive" : ticket.status === "In Progress" ? "info" : "warning"}
                  label={ticket.status}
                />
                <StatusBadge
                  tone={ticket.priority === "Urgent" ? "destructive" : ticket.priority === "High" ? "warning" : "muted"}
                  label={ticket.priority}
                  dot={false}
                />
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                <span>Opened by {ticket.customer}</span>
                <span> • </span>
                <span>{ticket.age} ago</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Ticket Subject Box */}
          <div className="rounded-xl border p-4 bg-secondary/30 space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Issue Subject</div>
            <div className="text-base font-bold text-foreground">{ticket.subject}</div>
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conversation History</div>

            {/* Customer Message */}
            <div className="rounded-xl border p-4 bg-card space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{ticket.customer}</span>
                <span className="text-muted-foreground">{ticket.age} ago</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                Hello HexiDrop support, I placed an express delivery order in Harare today, but the assigned driver seems to be having trouble locating the entrance along Samora Machel Avenue. Please help coordinate.
              </p>
            </div>

            {/* System Auto-Response */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-primary">HexiDrop Automated System</span>
                <span className="text-muted-foreground">Automated</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Support agent connected to ticket. Customer contact verified (+263 77 912 3456). Order reference #HXD-5821.
              </p>
            </div>
          </div>

          {/* Quick Reply Form */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Send Reply</div>
            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your response to the customer…"
              className="w-full rounded-xl border bg-card p-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSendReply}
                disabled={!reply.trim()}
                className="gap-1.5 rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground"
              >
                <Send className="h-3.5 w-3.5" />
                Reply to Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 border-t px-6 py-4 bg-muted/20">
          {ticket.status !== "Resolved" ? (
            <>
              <Button
                variant="outline"
                onClick={() => onStatusChange("Escalated")}
                className="flex-1 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                Escalate
              </Button>
              <Button
                onClick={() => onStatusChange("Resolved")}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white"
              >
                Mark as Resolved
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onStatusChange("In Progress")}
              className="w-full rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground"
            >
              Reopen Ticket
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default SupportPage;
