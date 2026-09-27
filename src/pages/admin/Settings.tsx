import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";



const GROUPS = [
  { g: "General", i: ["Company profile", "Timezone", "Language", "Working hours"] },
  { g: "Branding", i: ["Logo & favicon", "Colors", "Typography", "Email templates"] },
  { g: "Financial", i: ["Currencies", "Taxes", "Invoice templates", "Fees"] },
  { g: "Payments", i: ["Paynow", "Stripe", "Ecocash", "OneMoney", "Cash"] },
  { g: "Messaging", i: ["SMS gateway", "Email SMTP", "Push (Firebase)", "WhatsApp"] },
  { g: "Maps & Location", i: ["Map provider", "Geocoding", "Traffic layer"] },
  { g: "Security", i: ["2FA", "Session timeout", "IP allowlist", "Audit level"] },
  { g: "Developer", i: ["API keys", "Webhooks", "Storage", "Rate limits"] },
];

type SettingItem = { group: string; name: string; value: string };

export function SettingsPage() {
  const [company, setCompany] = useState({
    "Company name": "HexiDrop (Pvt) Ltd",
    "Registration number": "HD/2023/04812",
    "VAT number": "10024898",
    "Support email": "help@hexidrop.co.zw",
    "Head office": "72 George Silundika Ave, Harare",
    "Support phone": "+263 78 200 0000",
  } as Record<string, string>);

  const [editing, setEditing] = useState<SettingItem | null>(null);
  const [draft, setDraft] = useState("");

  const openEdit = (group: string, name: string) => {
    setEditing({ group, name, value: "Configured" });
    setDraft("Configured");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Platform", "System Settings"]}
        title="System Settings"
        subtitle="Configuration for company, payments, messaging and integrations"
        actions={
          <button onClick={() => toast.success("Settings saved")} className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card">
            Save all
          </button>
        }
      />

      <SectionCard title="Company profile">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(company).map(([k, v]) => (
            <label key={k} className="block">
              <span className="mb-1 block text-xs font-semibold text-muted-foreground">{k}</span>
              <input
                value={v}
                onChange={(e) => setCompany((c) => ({ ...c, [k]: e.target.value }))}
                className="h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <SectionCard key={g.g} title={g.g} padding="none">
            <ul className="divide-y">
              {g.i.map((it, i) => (
                <li key={it} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium">{it}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {["Configured", "Enabled", "Live", "Default"][i % 4]}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={i % 3 === 0 ? "success" : "muted"} label={i % 3 === 0 ? "Active" : "Configured"} />
                    <button
                      onClick={() => openEdit(g.g, it)}
                      className="h-7 rounded-md border px-2.5 text-xs font-medium hover:bg-accent"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? `${editing.group} · ${editing.name}` : ""}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-xs font-medium text-muted-foreground">Value</Label>
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => { toast.success(`${editing?.name} updated`); setEditing(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsPage;
