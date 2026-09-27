import { Search, Bell, Moon, Sun, Plus, Command, Globe, ChevronDown, ShieldCheck, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";
import { ROLES, initials, usePermissions } from "@/lib/permissions";
import { Link, useNavigate } from "react-router-dom";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const { role, setRole, session, user, signOut } = usePermissions();
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setNotifOpen(false); setQaOpen(false); setRoleOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header ref={rootRef} className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <MobileNav />
        {/* Search */}
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders, drivers, customers, cities…"
            className="h-10 w-full rounded-xl border bg-muted/40 pl-10 pr-16 text-sm outline-none ring-primary/30 transition-all placeholder:text-muted-foreground focus:bg-card focus:ring-2"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Quick Actions */}
          <div className="relative">
            <button
              onClick={() => { setQaOpen((v) => !v); setNotifOpen(false); }}
              className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:shadow-elegant sm:flex"
            >
              <Plus className="h-4 w-4" /> Quick Action
            </button>
            {qaOpen && (
              <div className="absolute right-0 top-12 z-40 w-64 rounded-2xl border bg-popover p-1.5 shadow-elegant">
                {["New Order", "Onboard Driver", "New Business Account", "Broadcast Notification", "Create Coupon"].map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setQaOpen(false);
                      if (a === "New Order") navigate("/admin/orders");
                      else if (a === "Onboard Driver") navigate("/admin/drivers");
                      else if (a === "New Business Account") navigate("/admin/business");
                      else if (a === "Broadcast Notification") navigate("/admin/notifications");
                      else if (a === "Create Coupon") navigate("/admin/coupons");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <Plus className="h-3.5 w-3.5 text-primary" /> {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          <IconButton title="Language">
            <Globe className="h-4.5 w-4.5" />
          </IconButton>
          <IconButton title="Toggle theme" onClick={() => setDark((v) => !v)}>
            {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </IconButton>

          {/* Notifications */}
          <div className="relative">
            <IconButton title="Notifications" onClick={() => { setNotifOpen((v) => !v); setQaOpen(false); }}>
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            </IconButton>
            {notifOpen && (
              <div className="absolute right-0 top-12 z-40 w-[380px] overflow-hidden rounded-2xl border bg-popover shadow-elegant">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Notifications</p>
                    <p className="text-xs text-muted-foreground">4 new updates</p>
                  </div>
                  <button className="text-xs font-medium text-primary hover:underline">
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-[420px] overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} className="border-b px-4 py-3 hover:bg-accent/40">
                      <div className="flex items-start gap-3">
                        <StatusBadge tone={n.type as any} label="" dot />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug">{n.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="block w-full py-3 text-center text-xs font-semibold text-primary hover:bg-accent/60"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* Role switcher / Profile */}
          <div className="relative ml-2">
            <button
              onClick={() => { setRoleOpen((v) => !v); setNotifOpen(false); setQaOpen(false); }}
              className="flex items-center gap-2.5 rounded-xl border bg-card py-1 pl-1 pr-2.5 transition-all hover:shadow-card"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold text-sm font-semibold text-brand-navy">
                {initials(user)}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[13px] font-semibold">{user}</span>
                <span className="block text-[11px] text-muted-foreground">{role}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-12 z-40 w-72 overflow-hidden rounded-2xl border bg-popover shadow-elegant">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold">{user}</p>
                  <p className="text-[11px] text-muted-foreground">{session?.email ?? "ops@hexidrop.co.zw"}</p>
                </div>
                <div className="border-b px-4 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Active role
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Switch role to preview scoped permissions across the console.
                  </p>
                </div>
                <ul className="p-1.5">
                  {ROLES.map((r) => {
                    const active = r === role;
                    return (
                      <li key={r}>
                        <button
                          onClick={() => { setRole(r); setRoleOpen(false); }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                            active ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent",
                          )}
                        >
                          <span>{r}</span>
                          {active && <span className="text-[10px] uppercase tracking-widest">Active</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to="/admin/profile"
                  onClick={() => setRoleOpen(false)}
                  className="block border-t px-4 py-3 text-xs font-semibold text-primary hover:bg-accent/60"
                >
                  View my profile
                </Link>
                <button
                  onClick={() => { setRoleOpen(false); signOut(); navigate("/admin/login"); }}
                  className="flex w-full items-center gap-2 border-t px-4 py-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  onClick,
  title,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl border bg-card text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Header;
