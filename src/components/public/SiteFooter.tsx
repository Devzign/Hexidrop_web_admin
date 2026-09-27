import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { HexiLogo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="space-y-5 md:col-span-4">
          <HexiLogo size={44} />
          <p className="max-w-xs text-sm text-white/70">
            Zimbabwe's on-demand delivery & moving network. Bikes, vans, trucks
            and full moving crews — one app, one platform.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <StoreMini store="apple" />
            <StoreMini store="google" />
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

function StoreMini({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  return (
    <a
      href="#"
      className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/90 backdrop-blur transition hover:bg-white/10"
    >
      {isApple ? (
        <svg viewBox="0 0 384 512" className="h-5 w-5 fill-white">
          <path d="M318.7 268c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.6zM248.5 82.5c22.2-26.4 20.2-50.4 19.6-59.1-19.7 1.1-42.5 13.4-55.5 28.5-14.3 16.2-22.7 36.2-20.9 58.7 21.3 1.6 40.7-9.4 56.8-28.1z" />
        </svg>
      ) : (
        <svg viewBox="0 0 512 512" className="h-5 w-5">
          <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z" />
          <path fill="#FBBC04" d="M104.6 499l220.7-221.3-58-58.4L104.6 13z" />
          <path fill="#4285F4" d="M480.6 232L385.4 174.2 325.3 234.3l60.1 60.1 95.2-57.8c19.2-11.6 19.2-32.6 0-44.2z" />
          <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1z" />
        </svg>
      )}
      <span className="font-semibold">
        {isApple ? "App Store" : "Google Play"}
      </span>
    </a>
  );
}

export default SiteFooter;
