import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, MapPin, Users, Car, Truck, Boxes,
  Wallet, Tag, CreditCard, Landmark, BarChart3, FileText, Bell,
  LifeBuoy, Shield, Settings, ScrollText, UserCircle, Building2,
  MapPinned, PackageCheck, ChevronsLeft, ChevronsRight, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePermissions, type Module } from "@/lib/permissions";
import { Icon3D, type Icon3DName } from "./Icon3D";

export type Item = { to: string; label: string; icon: any; badge?: string; module: Module };
export type Group = { label: string; items: Item[] };

export const NAV: Group[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
      { to: "/admin/live-tracking", label: "Live Tracking", icon: MapPinned, badge: "42", module: "live-tracking" },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/orders", label: "Orders", icon: Package, badge: "18", module: "orders" },
      { to: "/admin/movers", label: "Movers & Packers", icon: PackageCheck, module: "movers" },
      { to: "/admin/drivers", label: "Drivers", icon: Users, module: "drivers" },
      { to: "/admin/customers", label: "Customers", icon: UserCircle, module: "customers" },
      { to: "/admin/vehicles", label: "Vehicles", icon: Car, module: "vehicles" },
      { to: "/admin/fleet", label: "Fleet", icon: Truck, module: "fleet" },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/admin/business", label: "Business Accounts", icon: Building2, module: "business" },
      { to: "/admin/pricing", label: "Pricing", icon: Tag, module: "pricing" },
      { to: "/admin/cities", label: "Cities & Zones", icon: MapPin, module: "cities" },
      { to: "/admin/coupons", label: "Coupons", icon: Boxes, module: "coupons" },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/admin/payments", label: "Payments", icon: CreditCard, module: "payments" },
      { to: "/admin/wallet", label: "Wallet", icon: Wallet, module: "wallet" },
      { to: "/admin/payouts", label: "Driver Payouts", icon: Landmark, module: "payouts" },
      { to: "/admin/reports", label: "Reports", icon: BarChart3, module: "reports" },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/admin/cms", label: "CMS", icon: FileText, module: "cms" },
      { to: "/admin/notifications", label: "Notifications", icon: Bell, module: "notifications" },
      { to: "/admin/support", label: "Support", icon: LifeBuoy, module: "support" },
      { to: "/admin/roles", label: "Roles & Permissions", icon: Shield, module: "roles" },
      { to: "/admin/settings", label: "System Settings", icon: Settings, module: "settings" },
      { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText, module: "audit-logs" },
      { to: "/admin/profile", label: "My Profile", icon: UserCircle, module: "profile" },
    ],
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { can } = usePermissions();

  const visibleGroups = NAV
    .map((g) => ({ ...g, items: g.items.filter((i) => can(i.module, "view")) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 border-r bg-sidebar transition-[width] duration-300 md:flex md:flex-col",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b px-4">
        <Link to="/admin" className="flex items-center gap-2.5" aria-label="HexiDrop dashboard">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border bg-card shadow-card overflow-hidden p-1">
            <img src="/favicon.png" alt="HexiDrop logo" className="h-7 w-7 object-contain" />
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight">
                <span className="text-primary">HEXI</span>
                <span className="text-brand-gold">DROP</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Ops Console
              </span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.to === "/admin"
                    ? pathname === "/admin" || pathname === "/admin/"
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-sidebar-accent hover:text-slate-900 dark:hover:text-white",
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-x-2 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      <Icon3D
                        name={item.module as Icon3DName}
                        className={cn(
                          "h-6 w-6 transition-all duration-200 shrink-0",
                          active ? "drop-shadow-md scale-105" : "opacity-90 group-hover:opacity-100 group-hover:scale-110",
                        )}
                      />

                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                                active
                                  ? "bg-primary/20 text-primary"
                                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2">
        {!collapsed ? (
          <>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-muted hover:text-foreground"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>Visit Public Website</span>
            </Link>
            <div className="rounded-xl border bg-gradient-soft p-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 items-center justify-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-success/70" />
                  <span className="h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="text-xs font-bold text-foreground">Systems live</span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                Zimbabwe · 12 cities · 1,284 drivers
              </p>
            </div>
          </>
        ) : (
          <Link
            to="/"
            title="Visit Public Website"
            className="flex h-9 w-9 items-center justify-center mx-auto rounded-lg border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4 text-primary" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
            <>
              <ChevronsLeft className="h-4 w-4" /> Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
