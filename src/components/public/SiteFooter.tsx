import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { HexiLogo } from "./Logo";
import { StoreBadge } from "./StoreBadge";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="space-y-5 md:col-span-4">
          <HexiLogo size={44} inverted />
          <p className="max-w-xs text-sm text-white/70">
            Zimbabwe's on-demand delivery & moving network. Bikes, vans, trucks
            and full moving crews — one app, one platform.
          </p>
          <div className="flex flex-col sm:flex-row md:flex-col items-start gap-2.5 pt-2">
            <StoreBadge store="apple" />
            <StoreBadge store="google" />
          </div>
          <div className="flex gap-3 pt-2">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Company"
          items={[
            { to: "/about", label: "About HexiDrop" },
            { to: "/contact", label: "Contact" },
            { to: "/careers", label: "Careers" },
            { to: "/contact", label: "Blog" },
          ]}
        />

        <FooterCol
          title="Services"
          items={[
            { to: "/services", label: "Parcel Delivery" },
            { to: "/services", label: "Movers & Packers" },
            { to: "/services", label: "Business Delivery" },
            { to: "/services", label: "Large Item Delivery" },
          ]}
        />

        <FooterCol
          title="Support"
          items={[
            { to: "/contact", label: "Help centre" },
            { to: "/terms", label: "Terms" },
            { to: "/privacy", label: "Privacy" },
            { to: "/refund-policy", label: "Refund policy" },
          ]}
        />

        <div className="space-y-4 text-sm md:col-span-2">
          <div className="text-xs font-bold uppercase tracking-widest text-white/60">
            Contact
          </div>
          <a href="mailto:hello@hexidrop.co.zw" className="flex items-center gap-2 text-white/85 hover:text-primary-glow">
            <Mail className="h-4 w-4" /> hello@hexidrop.co.zw
          </a>
          <a href="tel:+263242000000" className="flex items-center gap-2 text-white/85 hover:text-primary-glow">
            <Phone className="h-4 w-4" /> +263 242 000 000
          </a>
          <div className="flex items-start gap-2 text-white/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>14 Sam Levy Way,<br />Borrowdale, Harare</span>
          </div>
          <div className="flex items-start gap-2 text-white/70">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>24/7 dispatch<br />Office: Mon–Sat, 8am–6pm</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/60 md:flex-row md:px-8">
          <div>© {new Date().getFullYear()} HexiDrop. All rights reserved.</div>
          <div>Made in Harare · Zimbabwe 🇿🇼</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { to: string; label: string }[];
}) {
  return (
    <div className="space-y-3 text-sm md:col-span-2">
      <div className="text-xs font-bold uppercase tracking-widest text-white/60">
        {title}
      </div>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <Link to={it.to} className="text-white/80 transition hover:text-primary-glow">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SiteFooter;
