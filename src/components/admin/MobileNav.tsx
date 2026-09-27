import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV } from "./Sidebar";
import { usePermissions } from "@/lib/permissions";
import { Icon3D, type Icon3DName } from "./Icon3D";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { can } = usePermissions();

  const groups = NAV.map((g) => ({ ...g, items: g.items.filter((i) => can(i.module, "view")) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border bg-card text-muted-foreground md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-sidebar p-0">
        <div className="flex h-16 items-center gap-2.5 border-b px-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border bg-card overflow-hidden p-1">
            <img src="/favicon.png" alt="HexiDrop logo" className="h-7 w-7 object-contain" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-primary">HEXI</span>
            <span className="text-brand-gold">DROP</span>
          </span>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    item.to === "/admin"
                      ? pathname === "/admin" || pathname === "/admin/"
                      : pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                        )}
                      >
                        <Icon3D name={item.module as Icon3DName} className="h-6 w-6 shrink-0 drop-shadow-sm" />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="mt-4 border-t pt-4 px-2">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground"
            >
              Visit Public Website
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
