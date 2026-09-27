import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { recordAudit } from "./audit-log";

export const MODULES = [
  "dashboard", "live-tracking",
  "orders", "movers", "drivers", "customers", "vehicles", "fleet",
  "business", "pricing", "cities", "coupons",
  "payments", "wallet", "payouts", "reports",
  "cms", "notifications", "support", "roles", "settings", "audit-logs",
  "profile",
] as const;

export type Module = (typeof MODULES)[number];
export const ACTIONS = ["view", "create", "edit", "delete", "export"] as const;
export type Action = (typeof ACTIONS)[number];

export const ROLES = [
  "Admin",
  "Operations Manager",
  "Finance",
  "Support",
  "Dispatcher",
  "Marketing",
] as const;
export type Role = (typeof ROLES)[number];

type Matrix = Record<Role, Partial<Record<Module, Action[]>>>;

const ALL: Action[] = ["view", "create", "edit", "delete", "export"];
const VIEW: Action[] = ["view"];
const VE: Action[] = ["view", "edit"];
const VCE: Action[] = ["view", "create", "edit"];
const VIEW_EXPORT: Action[] = ["view", "export"];
const ALL_NO_DELETE: Action[] = ["view", "create", "edit", "export"];

// Every module a role can touch is listed. Missing = no access.
export const PERMISSIONS: Matrix = {
  Admin: Object.fromEntries(MODULES.map((m) => [m, ALL])) as Matrix["Admin"],
  "Operations Manager": {
    dashboard: VIEW_EXPORT, "live-tracking": VIEW,
    orders: ALL_NO_DELETE, movers: ALL, drivers: ALL, customers: VE, vehicles: ALL, fleet: ALL,
    business: VE, pricing: VE, cities: ALL, coupons: VCE,
    reports: VIEW_EXPORT, notifications: VCE, support: VCE,
    profile: VE,
  },
  Finance: {
    dashboard: VIEW_EXPORT,
    orders: VIEW_EXPORT, business: VIEW_EXPORT,
    payments: ALL, wallet: ALL, payouts: ALL, reports: VIEW_EXPORT,
    pricing: VE, coupons: VIEW,
    profile: VE,
  },
  Support: {
    dashboard: VIEW, "live-tracking": VIEW,
    orders: VE, drivers: VIEW, customers: VE, movers: VIEW,
    support: ["view", "create", "edit", "delete"], notifications: VIEW,
    profile: VE,
  },
  Dispatcher: {
    dashboard: VIEW, "live-tracking": VIEW,
    orders: VCE, drivers: VE, movers: VCE, vehicles: VIEW, fleet: VIEW,
    profile: VE,
  },
  Marketing: {
    dashboard: VIEW,
    coupons: ALL, cms: ALL, notifications: ALL,
    business: VIEW_EXPORT, customers: VIEW, reports: VIEW_EXPORT,
    profile: VE,
  },
};

// Static current user for demo purposes.
export const CURRENT_USER = "Kudzai Moyo";

// Pure helpers — safe to import in tests, they don't touch React or storage.
export function canRole(role: Role, m: Module, a: Action = "view"): boolean {
  const allowed = PERMISSIONS[role]?.[m];
  return !!allowed && allowed.includes(a);
}

export function allowedActionsFor(role: Role, m: Module): Action[] {
  return PERMISSIONS[role]?.[m] ?? [];
}

export function visibleModulesFor(role: Role): Module[] {
  return MODULES.filter((m) => canRole(role, m, "view"));
}

export function missingActionsFor(role: Role, m: Module): Action[] {
  const allowed = new Set(allowedActionsFor(role, m));
  return ACTIONS.filter((a) => !allowed.has(a));
}

export type DemoAccount = {
  email: string;
  password: string;
  name: string;
  role: Role;
  title: string;
};

/** Demo directory — no backend, credentials are intentionally public/mock. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "admin@hexidrop.co.zw", password: "hexidrop", name: "Kudzai Moyo", role: "Admin", title: "Platform Administrator" },
  { email: "ops@hexidrop.co.zw", password: "hexidrop", name: "Tendai Chirwa", role: "Operations Manager", title: "Head of Operations" },
  { email: "finance@hexidrop.co.zw", password: "hexidrop", name: "Rumbidzai Ncube", role: "Finance", title: "Finance Lead" },
  { email: "support@hexidrop.co.zw", password: "hexidrop", name: "Farai Dube", role: "Support", title: "Support Specialist" },
  { email: "dispatch@hexidrop.co.zw", password: "hexidrop", name: "Blessing Zimuto", role: "Dispatcher", title: "Dispatch Controller" },
  { email: "marketing@hexidrop.co.zw", password: "hexidrop", name: "Nyasha Sibanda", role: "Marketing", title: "Growth Marketer" },
];

export type Session = { email: string; name: string; role: Role; title: string };

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

type Ctx = {
  role: Role;
  user: string;
  session: Session | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  setRole: (r: Role) => void;
  can: (m: Module, a?: Action) => boolean;
  check: (m: Module, a: Action, route?: string, detail?: string) => boolean;
};

const PermissionsCtx = createContext<Ctx | null>(null);
const STORAGE = "hexidrop.session";

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as Session;
        if (parsed?.email && (ROLES as readonly string[]).includes(parsed.role)) setSession(parsed);
      }
    } catch {}
    setReady(true);
  }, []);

  const persist = (s: Session | null) => {
    setSession(s);
    try {
      if (s) localStorage.setItem(STORAGE, JSON.stringify(s));
      else localStorage.removeItem(STORAGE);
    } catch {}
  };

  const role = session?.role ?? "Admin";
  const user = session?.name ?? CURRENT_USER;

  const value = useMemo<Ctx>(() => ({
    role,
    user,
    session,
    ready,
    signIn: (email, password) => {
      const match = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!match || match.password !== password) {
        return { ok: false, error: "Incorrect email or password." };
      }
      persist({ email: match.email, name: match.name, role: match.role, title: match.title });
      return { ok: true };
    },
    signOut: () => persist(null),
    setRole: (r: Role) => {
      if (!session) return;
      persist({ ...session, role: r });
    },
    can: (m, a = "view") => canRole(role, m, a),
    check: (m, a, route, detail) => {
      const ok = canRole(role, m, a);
      recordAudit({
        user,
        role,
        module: m,
        action: a,
        route: route ?? (typeof window !== "undefined" ? window.location.pathname : "-"),
        outcome: ok ? "allowed" : "denied",
        detail,
      });
      return ok;
    },
  }), [role, user, session, ready]);

  return <PermissionsCtx.Provider value={value}>{children}</PermissionsCtx.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionsCtx);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}

export function Can({
  module, action = "view", children, fallback = null,
}: {
  module: Module;
  action?: Action;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = usePermissions();
  return <>{can(module, action) ? children : fallback}</>;
}
