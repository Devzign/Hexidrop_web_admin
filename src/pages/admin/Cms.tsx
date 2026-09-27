import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";



type Page = {
  id: string; title: string; description: string; updated: string;
  status: "Live" | "Draft" | "Scheduled";
};

const INITIAL: Page[] = [
  { title: "Homepage", description: "Hero banner, services and CTAs", updated: "2 hours ago" },
  { title: "Services page", description: "Delivery, moving, business plans", updated: "Yesterday" },
  { title: "Movers & Packers", description: "Landing page for relocations", updated: "3 days ago" },
  { title: "Business page", description: "Corporate account onboarding", updated: "1 week ago" },
  { title: "FAQs", description: "42 answers across 8 categories", updated: "Today" },
  { title: "Blog", description: "18 posts · 6 drafts", updated: "Today" },
  { title: "Testimonials", description: "24 published reviews", updated: "5 days ago" },
  { title: "SEO settings", description: "Meta, sitemap, robots.txt", updated: "2 weeks ago" },
  { title: "Media library", description: "1,284 files · 3.2 GB", updated: "Today" },
].map((c, i) => ({ id: `CMS-${300 + i}`, status: "Live" as const, ...c }));

const FIELDS: FieldDef<Page>[] = [
  { name: "title", label: "Title" },
  { name: "description", label: "Description", full: true },
  { name: "status", label: "Status", type: "select", options: ["Live", "Draft", "Scheduled"] },
  { name: "updated", label: "Last updated" },
];

export function CmsPage() {
  const crud = useCrud<Page>(INITIAL, "Page");

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Platform", "CMS"]}
        title="Content Management"
        subtitle="Website, mobile app content and marketing pages"
        actions={
          <button
            onClick={() => crud.openCreate({ status: "Draft", updated: "Just now" })}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            New page
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {crud.rows.map((c) => (
          <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{c.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <StatusBadge tone={c.status === "Live" ? "success" : c.status === "Draft" ? "muted" : "info"} label={c.status} />
                <RowActions onEdit={() => crud.openEdit(c)} onDuplicate={() => crud.duplicate(c)} onDelete={() => crud.openDelete(c)} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Updated {c.updated}</span>
              <button onClick={() => crud.openEdit(c)} className="rounded-lg bg-primary/10 px-2.5 py-1 font-semibold text-primary hover:bg-primary/15">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <RecordEditor<Page> open={!!crud.editing} onOpenChange={(v) => !v && crud.setEditing(null)} title="Edit page" fields={FIELDS} value={crud.editing} onSubmit={(next) => crud.saveEdit({ ...(crud.editing as Page), ...next })} />
      <RecordEditor<Page> open={!!crud.creating} onOpenChange={(v) => !v && crud.setCreating(null)} title="New page" fields={FIELDS} value={crud.creating} onSubmit={(next) => crud.saveCreate({ ...crud.creating, ...next, id: `CMS-${400 + Math.floor(Math.random() * 999)}` } as Page)} />
      <ConfirmDelete open={!!crud.deleting} onOpenChange={(v) => !v && crud.setDeleting(null)} onConfirm={crud.confirmDelete} title="Delete page?" description={crud.deleting ? `${crud.deleting.title} will be removed from the CMS.` : ""} />
    </div>
  );
}

export default CmsPage;
