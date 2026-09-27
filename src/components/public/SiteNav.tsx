import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { HexiLogo } from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/careers", label: "Careers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center" aria-label="HexiDrop home">
          <HexiLogo size={36} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-secondary text-brand-navy font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Ops Portal</span>
          </Link>
          <Link
            to="/contact"
            className="rounded-full bg-gradient-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-glow hover:opacity-95"
          >
            Book Delivery
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-border p-2 text-foreground md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-semibold text-foreground"
              >
                <ShieldCheck className="h-4 w-4 text-primary" /> Ops Portal
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-lg bg-gradient-primary py-2 text-sm font-bold text-primary-foreground"
              >
                Book Delivery
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default SiteNav;
