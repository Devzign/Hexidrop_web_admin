import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";



const INITIAL_PROFILE = {
  "Full name": "Kudzai Moyo",
  "Email": "kudzai.moyo@hexidrop.co.zw",
  "Phone": "+263 71 200 4488",
  "Timezone": "Africa/Harare (UTC+2)",
  "Language": "English",
  "City": "Harare",
};

const INITIAL_PREFS = [
  { l: "Email notifications", d: "Daily summary of ops activity", on: true },
  { l: "Push notifications", d: "Escalations and payouts", on: true },
  { l: "Weekly report", d: "Delivered Monday 08:00", on: false },
  { l: "Sound alerts", d: "Play sound for new escalations", on: true },
];

export function ProfilePage() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [prefs, setPrefs] = useState(INITIAL_PREFS);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Account", "Profile"]}
        title="Your profile"
        subtitle="Manage your account, security and preferences"
        actions={
          <button
            onClick={() => toast.success("Profile saved")}
            className="h-9 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Save changes
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Account" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-gold text-2xl font-bold text-brand-navy shadow-glow">KM</span>
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success ring-4 ring-card" />
            </div>
            <h3 className="mt-3 text-lg font-semibold">{profile["Full name"]}</h3>
            <p className="text-xs text-muted-foreground">{profile["Email"]}</p>
            <StatusBadge tone="primary" label="Operations Manager" className="mt-2" dot={false} />
            <div className="mt-4 grid w-full grid-cols-3 gap-2 border-t pt-4">
              <Stat label="Approvals" value="284" />
              <Stat label="Refunds" value="42" />
              <Stat label="Since" value="2023" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Personal information" className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(profile).map(([k, v]) => (
              <label key={k} className="block">
                <span className="mb-1 block text-xs font-semibold text-muted-foreground">{k}</span>
                <input
                  value={v}
                  onChange={(e) => setProfile((p) => ({ ...p, [k]: e.target.value }))}
                  className="h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Security">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="font-medium">Password</div>
                <div className="text-xs text-muted-foreground">Last changed 3 months ago</div>
              </div>
              <button onClick={() => toast.success("Password reset link sent")} className="h-8 rounded-lg border bg-card px-2.5 text-xs font-medium">Change</button>
            </li>
            <li className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="font-medium">Two-factor authentication</div>
                <div className="text-xs text-muted-foreground">Authenticator app</div>
              </div>
              <StatusBadge tone="success" label="Enabled" />
            </li>
            <li className="flex items-center justify-between">
              <div>
                <div className="font-medium">Active sessions</div>
                <div className="text-xs text-muted-foreground">2 devices signed in</div>
              </div>
              <button onClick={() => toast.success("Signed out other sessions")} className="h-8 rounded-lg border bg-card px-2.5 text-xs font-medium">Manage</button>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Preferences">
          <ul className="space-y-3 text-sm">
            {prefs.map((p, idx) => (
              <li key={p.l} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <div className="font-medium">{p.l}</div>
                  <div className="text-xs text-muted-foreground">{p.d}</div>
                </div>
                <button
                  onClick={() => setPrefs((ps) => ps.map((x, i) => i === idx ? { ...x, on: !x.on } : x))}
                  className={`inline-flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${p.on ? "bg-primary" : "bg-muted"}`}
                  aria-label={`Toggle ${p.l}`}
                >
                  <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${p.on ? "translate-x-4" : ""}`} />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

export default ProfilePage;
