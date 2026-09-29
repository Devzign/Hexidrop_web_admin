import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate, Outlet, ScrollRestoration } from "react-router-dom";
import { Lock } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { usePermissions, type Module } from "@/lib/permissions";
import { recordAudit } from "@/lib/audit-log";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

const ROUTE_MODULE: Record<string, Module> = {
  "/admin": "dashboard",
  "/admin/": "dashboard",
  "/admin/live-tracking": "live-tracking",
  "/admin/orders": "orders",
  "/admin/movers": "movers",
  "/admin/drivers": "drivers",
  "/admin/customers": "customers",
  "/admin/vehicles": "vehicles",
  "/admin/fleet": "fleet",
  "/admin/business": "business",
  "/admin/pricing": "pricing",
  "/admin/cities": "cities",
  "/admin/coupons": "coupons",
  "/admin/payments": "payments",
  "/admin/wallet": "wallet",
  "/admin/payouts": "payouts",
  "/admin/reports": "reports",
  "/admin/cms": "cms",
  "/admin/notifications": "notifications",
  "/admin/support": "support",
  "/admin/roles": "roles",
  "/admin/settings": "settings",
  "/admin/audit-logs": "audit-logs",
  "/admin/profile": "profile",
};

export function AdminLayout({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { can, role, user, session, ready } = usePermissions();

  const isLogin = pathname === "/admin/login";
  const module = ROUTE_MODULE[pathname];
  const allowed = !module || can(module, "view");

  useEffect(() => {
    // Auth check placeholder / guard for admin section
    if (ready && !session && !isLogin) {
      navigate("/admin/login", { replace: true });
    }
  }, [ready, session, isLogin, navigate]);

  useEffect(() => {
    if (!module || isLogin) return;
    recordAudit({
      user,
      role,
      module,
      action: "view",
      route: pathname,
      outcome: allowed ? "allowed" : "denied",
      detail: allowed ? "Route access" : "Route access denied",
    });
  }, [pathname, module, allowed, role, user, isLogin]);

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isLogin) {
    return <>{children || <Outlet />}</>;
  }

  if (!session) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <ScrollRestoration />
      <ScrollToTop />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1500px]">
            {allowed ? (children || <Outlet />) : <AccessDenied module={module!} role={role} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function AccessDenied({ module, role }: { module: Module; role: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Access restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your active role <span className="font-semibold text-foreground">{role}</span> does not have
          permission to view the <span className="font-mono">{module}</span> module. Switch role from
          the top-right menu or contact an administrator.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          This attempt has been recorded in the audit log.
        </p>
      </div>
    </div>
  );
}

export default AdminLayout;
