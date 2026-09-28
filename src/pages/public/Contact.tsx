import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import heroFleet from "@/assets/hero-fleet.jpg";
import iconOffice3D from "@/assets/3d/icon-office-3d.png";



export function Contact() {
  return (
    <>
      <Hero />
      <ContactSection />
      <MapSection />
      <BusinessCTA />
    </>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero text-foreground shadow-[0_30px_70px_-40px_oklch(0.35_0.12_155/0.35)]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 12% 0%, oklch(0.92 0.06 150 / 0.9) 0%, transparent 60%), radial-gradient(90% 70% at 95% 20%, oklch(0.95 0.07 95 / 0.55) 0%, transparent 65%), linear-gradient(180deg, oklch(0.985 0.015 150 / 0.92) 0%, oklch(0.95 0.045 152 / 0.96) 100%)",
        }}
      />
      <img
        src={heroFleet}
        alt="HexiDrop fleet"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-15"
      />

      <div className="mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-glow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            24/7 Dispatch Center
          </div>
          <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-foreground md:text-[3.5rem] lg:text-[4.25rem] text-balance">
            Let's move something
            <span className="block bg-gradient-to-r from-[oklch(0.7_0.14_155)] via-[oklch(0.72_0.15_88)] to-[oklch(0.5_0.12_158)] bg-clip-text text-transparent">
              together.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Questions about a delivery, a moving quote or a business account?
            Our team replies within one hour, seven days a week.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

/* ============ CONTACT GRID ============ */
function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Form */}
        <div className="rounded-[28px] border border-border bg-card p-8 shadow-elegant md:p-10">
          {sent ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-foreground">
                Message received!
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Thanks for reaching out. A HexiDrop teammate will be in touch
                within the hour.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm font-bold text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  Send a message
                </div>
                <h2 className="mt-2 text-2xl font-extrabold text-foreground md:text-3xl">
                  How can we help?
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Full name"
                  name="name"
                  placeholder="Tinashe Moyo"
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Phone"
                  name="phone"
                  placeholder="+263 77 ..."
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Topic
                  </label>
                  <select
                    name="topic"
                    className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>Send a parcel</option>
                    <option>Moving quote</option>
                    <option>Business account</option>
                    <option>Support / issue</option>
                    <option>Something else</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us what you need to send or move…"
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:shadow-[0_0_50px_oklch(0.85_0.14_90_/_0.55)]"
              >
                Send message
                <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
        </div>

        {/* Contact details */}
        <div className="flex flex-col gap-4">
          <InfoRow
            icon={<Mail className="h-5 w-5" />}
            title="Email us"
            body="hello@hexidrop.co.zw"
            href="mailto:hello@hexidrop.co.zw"
          />
          <InfoRow
            icon={<Phone className="h-5 w-5" />}
            title="Call the team"
            body="+263 242 000 000"
            href="tel:+263242000000"
          />
          <InfoRow
            icon={<MapPin className="h-5 w-5" />}
            title="Head office"
            body="14 Sam Levy Way, Borrowdale, Harare"
          />
          <InfoRow
            icon={<Clock className="h-5 w-5" />}
            title="Support hours"
            body="24 / 7 — we're always on"
          />

          <div className="mt-2 rounded-[28px] bg-brand-navy p-7 text-white shadow-elegant">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-2 shadow-sm backdrop-blur">
                <img src={iconOffice3D} alt="Business" className="h-full w-full object-contain filter drop-shadow-sm" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary-glow">
                  Business partnerships
                </div>
                <div className="mt-1 text-lg font-extrabold">
                  Running a shop, restaurant or clinic?
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Get a dedicated fleet, monthly invoicing and priority dispatch
                  for your last-mile deliveries.
                </p>
                <a
                  href="mailto:sales@hexidrop.co.zw"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-glow px-5 py-2.5 text-xs font-bold text-brand-navy transition hover:bg-white"
                >
                  sales@hexidrop.co.zw
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ MAP ============ */
function MapSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
      <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-elegant">
        <div className="grid lg:grid-cols-[380px_1fr]">
          <div className="space-y-6 bg-brand-navy p-8 text-white md:p-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-glow">
                Visit us
              </div>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                Head Office
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                <div>
                  <div className="font-bold">14 Sam Levy Way</div>
                  <div className="text-sm text-white/75">
                    Borrowdale, Harare
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                <div>
                  <div className="font-bold">Office hours</div>
                  <div className="text-sm text-white/75">
                    Mon – Sat: 8am – 6pm
                  </div>
                  <div className="text-sm text-white/75">
                    Dispatch: 24 / 7
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                <div>
                  <div className="font-bold">WhatsApp</div>
                  <div className="text-sm text-white/75">+263 77 000 0000</div>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=14+Sam+Levy+Way,+Borrowdale,+Harare,+Zimbabwe"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-glow transition hover:text-white"
            >
              Open in Google Maps <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative min-h-[360px] bg-muted lg:min-h-[480px]">
            <iframe
              title="HexiDrop Head Office Location"
              src="https://maps.google.com/maps?q=14+Sam+Levy+Way,+Borrowdale,+Harare,+Zimbabwe&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ BUSINESS CTA ============ */
function BusinessCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-hero p-8 text-foreground shadow-elegant md:p-12">
        <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Need a same-day delivery?
            </div>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              Download the app and book in minutes.
            </h2>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
          >
            Get the app <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  ...rest
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        {...rest}
        className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function InfoRow({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow-elegant">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="mt-0.5 text-base font-bold text-foreground">{body}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-90">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default Contact;
