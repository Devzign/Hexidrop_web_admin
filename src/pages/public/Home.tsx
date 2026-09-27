import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bike,
  Truck,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Star,
  Package,
  Users,
  Bell,
  DollarSign,
  Heart,
  BadgeCheck,
  Boxes,
  PhoneCall,
  ChevronDown,
  QrCode,
  Building2,
  ShoppingBag,
  Utensils,
  Stethoscope,
  Store,
  Briefcase,
} from "lucide-react";
import heroFleet from "@/assets/hero-fleet.jpg";
import appMockup from "@/assets/app-mockup.jpg";
import serviceParcel from "@/assets/service-parcel.jpg";
import serviceMovers from "@/assets/service-movers.jpg";
import serviceBusiness from "@/assets/service-business.jpg";
import serviceLarge from "@/assets/service-large.jpg";
import moversHero from "@/assets/movers-hero.jpg";
import moversPacking from "@/assets/movers-packing.jpg";
import moversOffice from "@/assets/movers-office.jpg";
import moversAppliances from "@/assets/movers-appliances.jpg";
import moversBefore from "@/assets/movers-before.jpg";
import moversAfter from "@/assets/movers-after.jpg";
import vehicleBike from "@/assets/vehicle-bike.png";
import vehicleScooter from "@/assets/vehicle-scooter.png";
import vehicleVan from "@/assets/vehicle-van.png";
import vehicleMiniTruck from "@/assets/vehicle-mini-truck.png";
import vehiclePickup from "@/assets/vehicle-pickup.png";
import vehicleLargeTruck from "@/assets/vehicle-large-truck.png";



export function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Services />
      <WhyChoose />
      <MoversShowcase />
      <Fleet />
      <MobileApp />
      <Journey />
      <Stats />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero text-foreground shadow-[0_30px_70px_-40px_oklch(0.35_0.12_155/0.35)]">
      {/* soft light */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 12% 0%, oklch(0.92 0.06 150 / 0.9) 0%, transparent 60%), radial-gradient(90% 70% at 95% 20%, oklch(0.95 0.07 95 / 0.55) 0%, transparent 65%), linear-gradient(180deg, oklch(0.985 0.015 150) 0%, oklch(0.95 0.045 152) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.6 0.12 155) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.6 0.12 155) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(80% 60% at 50% 30%, black 0%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 -top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-primary-glow/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 md:grid-cols-[1.05fr_1fr] md:px-8 md:py-32 lg:py-40">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-glow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Zimbabwe's #1 delivery platform
          </div>

          <h1 className="mt-8 text-[2.5rem] font-extrabold leading-[1] tracking-[-0.035em] text-foreground md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]">
            <span className="block">Deliver anything.</span>
            <span className="block">Move anywhere.</span>
            <span className="block bg-gradient-to-r from-[oklch(0.7_0.14_155)] via-[oklch(0.72_0.15_88)] to-[oklch(0.5_0.12_158)] bg-clip-text text-transparent">
              Anytime.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            From letters to living rooms — HexiDrop is the on-demand logistics
            network powering deliveries, moves and business fleets across
            Zimbabwe.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-12px_oklch(0.85_0.14_90/0.45)]"
            >
              Book a delivery
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-xl transition hover:border-primary/30 hover:bg-white"
            >
              Get a moving quote
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StoreBadge store="apple" />
            <StoreBadge store="google" />
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/40 shadow-card sm:grid-cols-4">
            {[
              { k: "1M+", v: "Deliveries" },
              { k: "4.9★", v: "Rating" },
              { k: "3 min", v: "Pickup" },
              { k: "24/7", v: "Support" },
            ].map((s) => (
              <div
                key={s.v}
                className="bg-white/85 px-5 py-5 backdrop-blur-xl"
              >
                <dt className="text-2xl font-extrabold tracking-tight text-foreground md:text-[1.75rem]">
                  {s.k}
                </dt>
                <dd className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-10 rounded-[60px] bg-primary-glow/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-[0_40px_90px_-30px_oklch(0.35_0.1_155/0.45)]">
            <img
              src={heroFleet}
              alt="HexiDrop courier with branded delivery van and truck"
              className="h-full w-full object-cover"
              width={1280}
              height={1280}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.19_0.04_160)]/70 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-black/5" />
          </div>

          {/* Floating cards */}
          <div className="absolute -left-4 top-10 hidden rounded-2xl border border-border bg-white/90 p-4 pr-6 shadow-[0_20px_45px_-15px_oklch(0.35_0.1_155/0.35)] backdrop-blur-2xl md:block">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Live tracking
                </div>
                <div className="text-sm font-bold text-foreground">
                  Rider 1.2 km away
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-2 hidden rounded-2xl border border-border bg-white/90 p-4 pr-6 shadow-[0_20px_45px_-15px_oklch(0.35_0.1_155/0.35)] backdrop-blur-2xl md:block">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-glow text-brand-navy">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Verified driver
                </div>
                <div className="text-sm font-bold text-foreground">
                  4.98 ★ · 2,341 trips
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* soft transition into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>

  );
}

function StoreBadge({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  return (
    <a
      href="#"
      className="group inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-black/40 px-5 py-3 backdrop-blur transition hover:bg-black/55"
    >
      {isApple ? (
        <svg viewBox="0 0 384 512" className="h-7 w-7 fill-white">
          <path d="M318.7 268c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.6zM248.5 82.5c22.2-26.4 20.2-50.4 19.6-59.1-19.7 1.1-42.5 13.4-55.5 28.5-14.3 16.2-22.7 36.2-20.9 58.7 21.3 1.6 40.7-9.4 56.8-28.1z" />
        </svg>
      ) : (
        <svg viewBox="0 0 512 512" className="h-7 w-7">
          <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z" />
          <path fill="#FBBC04" d="M104.6 499l220.7-221.3-58-58.4L104.6 13z" />
          <path fill="#4285F4" d="M480.6 232L385.4 174.2 325.3 234.3l60.1 60.1 95.2-57.8c19.2-11.6 19.2-32.6 0-44.2z" />
          <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1z" />
        </svg>
      )}
      <div className="text-left">
        <div className="text-[10px] font-medium uppercase tracking-wider text-white/70">
          {isApple ? "Download on the" : "Get it on"}
        </div>
        <div className="text-sm font-bold text-white">
          {isApple ? "App Store" : "Google Play"}
        </div>
      </div>
    </a>
  );
}

/* ============ TRUSTED BY ============ */
function TrustedBy() {
  const items = [
    { icon: Utensils, label: "Restaurants" },
    { icon: ShoppingBag, label: "Retail" },
    { icon: Briefcase, label: "Offices" },
    { icon: Stethoscope, label: "Medical" },
    { icon: Store, label: "E-commerce" },
    { icon: Building2, label: "Corporate" },
  ];
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Trusted by businesses across Zimbabwe
        </p>
        <div className="mt-8 grid grid-cols-3 gap-6 md:grid-cols-6">
          {items.map((it) => (
            <div
              key={it.label}
              className="flex flex-col items-center gap-2 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
            >
              <it.icon className="h-8 w-8 text-brand-navy" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SERVICES ============ */
function Services() {
  const services = [
    {
      img: serviceParcel,
      icon: Package,
      title: "Parcel Delivery",
      desc: "Documents, food, electronics — dispatched in minutes with door-to-door tracking.",
      features: ["3-minute pickup", "Live GPS", "Insured up to $200"],
    },
    {
      img: serviceMovers,
      icon: Users,
      title: "Movers & Packers",
      desc: "Vetted, uniformed crews handle packing, loading and setup end-to-end.",
      features: ["Free packing materials", "Furniture wrapping", "Fixed quotes"],
    },
    {
      img: serviceBusiness,
      icon: Briefcase,
      title: "Business Delivery",
      desc: "Corporate courier, fleet distribution and monthly invoicing for teams.",
      features: ["Dedicated account", "Bulk pricing", "API integrations"],
    },
    {
      img: serviceLarge,
      icon: Boxes,
      title: "Large Item Delivery",
      desc: "Furniture, appliances, construction materials — the right vehicle every time.",
      features: ["Pickup trucks & 5-ton", "Two-man crews", "Safe handling"],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeader
        eyebrow="What we move"
        title="One platform. Every delivery."
        body="Whether it's a same-day parcel or a full office relocation, there's a HexiDrop service built for the job."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <article
            key={s.title}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={s.img}
                alt={s.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={1280}
                height={960}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/10 to-transparent" />
              <div className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/95 text-primary shadow-elegant backdrop-blur">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="absolute bottom-5 left-5 right-5 text-2xl font-extrabold text-white">
                {s.title}
              </h3>
            </div>
            <div className="p-7">
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-brand-navy"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============ WHY CHOOSE ============ */
function WhyChoose() {
  const features = [
    { icon: Clock, title: "Fast Pickup", body: "Median 3-minute arrival with nearest-driver dispatch." },
    { icon: MapPin, title: "Live GPS Tracking", body: "Follow every kilometre in real time from pickup to drop." },
    { icon: DollarSign, title: "Transparent Pricing", body: "See the total upfront. No surges, no hidden fees." },
    { icon: BadgeCheck, title: "Verified Drivers", body: "Background-checked, uniformed, and rated by customers." },
    { icon: Users, title: "Professional Movers", body: "Trained crews with packing, wrapping and setup." },
    { icon: ShieldCheck, title: "Fully Insured", body: "Every job covered — parcels, appliances and full moves." },
    { icon: Bell, title: "Real-time Notifications", body: "SMS and push updates at every step of the journey." },
    { icon: Heart, title: "Safe Handling", body: "Padded blankets, straps and fragile-item protocols." },
    { icon: Truck, title: "Door-to-Door", body: "Kerb-to-kitchen service, not just kerbside drop-offs." },
  ];
  return (
    <section className="bg-gradient-soft py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          eyebrow="Why HexiDrop"
          title="Built for Zimbabwe. Made for you."
          body="Local knowledge, global standards — every delivery backed by technology, insurance and a real support team."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ MOVERS SHOWCASE ============ */
function MoversShowcase() {
  const gallery = [
    { src: moversHero, alt: "Movers loading truck", cls: "col-span-2 row-span-2" },
    { src: moversPacking, alt: "Packing materials", cls: "" },
    { src: moversAppliances, alt: "Appliance moving", cls: "" },
    { src: moversOffice, alt: "Office move", cls: "" },
    { src: moversBefore, alt: "Before moving", cls: "" },
  ];
  const items = [
    "Sofa & dining tables",
    "Wardrobes & mattresses",
    "TV, fridge & washing machine",
    "Office chairs & tables",
    "Kitchen appliances & electronics",
    "Boxes, wrapping & fragile items",
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Movers & Packers
          </div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
            Move houses & offices <br />
            <span className="text-primary">without the headache.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Uniformed HexiDrop crews plan every move end-to-end — packing,
            wrapping, loading, transport and setup. Fixed quotes, insured
            transit, zero surprises.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {i}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:-translate-y-0.5 transition"
            >
              Request a moving quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+263242000000"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-bold text-foreground hover:bg-secondary"
            >
              <PhoneCall className="h-4 w-4" /> Talk to a mover
            </a>
          </div>
        </div>

        <div className="grid auto-rows-[140px] grid-cols-3 gap-3 md:auto-rows-[180px] md:gap-4">
          {gallery.map((g) => (
            <div
              key={g.alt}
              className={`relative overflow-hidden rounded-3xl border border-border shadow-card ${g.cls}`}
            >
              <img
                src={g.src}
                alt={g.alt}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
          <div className="grid place-items-center rounded-3xl bg-brand-navy p-4 text-center text-white shadow-elegant">
            <div>
              <div className="text-3xl font-extrabold text-primary-glow">50k+</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                Moves delivered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before / After */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {[
          { label: "Before", src: moversBefore },
          { label: "After", src: moversAfter },
        ].map((b) => (
          <div key={b.label} className="relative overflow-hidden rounded-3xl border border-border shadow-card">
            <img src={b.src} alt={b.label} className="h-72 w-full object-cover" loading="lazy" />
            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-navy shadow">
              {b.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ FLEET ============ */
function Fleet() {
  const fleet = [
    { img: vehicleBike, name: "Bike", cap: "Up to 10 kg", best: "Documents, food", eta: "3 min" },
    { img: vehicleScooter, name: "Scooter", cap: "Up to 20 kg", best: "Small parcels", eta: "4 min" },
    { img: vehicleVan, name: "Mini Van", cap: "Up to 500 kg", best: "Retail & bulk", eta: "8 min" },
    { img: vehicleVan, name: "Panel Van", cap: "Up to 800 kg", best: "Office supplies", eta: "10 min" },
    { img: vehiclePickup, name: "Pickup Truck", cap: "Up to 1 ton", best: "Furniture", eta: "12 min" },
    { img: vehicleMiniTruck, name: "3 Ton Truck", cap: "Up to 3 tons", best: "1-bed move", eta: "18 min" },
    { img: vehicleLargeTruck, name: "5 Ton Truck", cap: "Up to 5 tons", best: "2-bed move", eta: "22 min" },
    { img: vehicleLargeTruck, name: "Moving Truck", cap: "Up to 7 tons", best: "Full home / office", eta: "25 min" },
  ];
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          eyebrow="Fleet"
          title="The right vehicle for every job"
          body="Pay only for the capacity you need. From two-wheeler to seven-ton, our fleet covers it."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map((v) => (
            <div
              key={v.name}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="grid h-32 place-items-center">
                <img src={v.img} alt={v.name} className="max-h-24 object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-extrabold text-foreground">{v.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {v.eta}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div><span className="font-semibold text-foreground">Capacity:</span> {v.cap}</div>
                  <div><span className="font-semibold text-foreground">Best for:</span> {v.best}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ MOBILE APP ============ */
function MobileApp() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <div className="relative overflow-hidden rounded-[36px] bg-brand-navy text-white shadow-elegant">
        <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl" />

        <div className="relative grid gap-10 p-8 md:grid-cols-2 md:items-center md:gap-12 md:p-14 lg:p-16">
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-primary-glow">
              HexiDrop App
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Everything you need to move — in your pocket.
            </h2>
            <p className="max-w-xl text-white/80">
              Book, track, pay and rate every delivery. Manage your business
              fleet or your home move from a single app.
            </p>

            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Instant booking",
                "Live driver tracking",
                "Multiple payment options",
                "Order history & invoices",
                "Push notifications",
                "24/7 in-app support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/90">
                  <CheckCircle2 className="h-4 w-4 text-primary-glow" /> {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <StoreBadge store="apple" />
              <StoreBadge store="google" />
              <div className="ml-2 hidden items-center gap-3 rounded-2xl border border-white/25 bg-white/95 p-3 text-brand-navy sm:flex">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-white text-brand-navy">
                  <QrCode className="h-10 w-10" />
                </div>
                <div className="text-xs">
                  <div className="font-bold">Scan to download</div>
                  <div className="text-muted-foreground">iOS · Android</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={appMockup}
              alt="HexiDrop mobile app screens"
              className="mx-auto max-h-[540px] w-auto drop-shadow-[0_35px_50px_rgba(0,0,0,0.45)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ JOURNEY ============ */
function Journey() {
  const steps = [
    { icon: Package, title: "Book Delivery", body: "Enter pickup & drop, pick a vehicle." },
    { icon: Users, title: "Driver Assigned", body: "Nearest vetted driver accepts instantly." },
    { icon: MapPin, title: "Live Tracking", body: "Watch your rider on the map in real time." },
    { icon: Boxes, title: "Package Picked", body: "Photo confirmation at pickup." },
    { icon: Truck, title: "Delivered", body: "Signed for at the door — proof of delivery." },
    { icon: Star, title: "Rate the Trip", body: "Rate & tip your driver in one tap." },
  ];
  return (
    <section className="bg-gradient-soft py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="From booking to doorstep"
          body="A frictionless six-step journey — designed to feel effortless whether you're sending one parcel or moving an entire office."
        />
        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
          <div className="grid gap-8 md:grid-cols-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-[11px] font-bold uppercase tracking-widest text-primary">
                  Step {i + 1}
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">{s.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ STATS ============ */
function Stats() {
  const stats = [
    { end: 1_200_000, suffix: "+", label: "Deliveries" },
    { end: 6_400, suffix: "+", label: "Drivers" },
    { end: 24, suffix: "", label: "Cities" },
    { end: 850, suffix: "+", label: "Business partners" },
    { end: 98, suffix: "%", label: "Customer satisfaction" },
    { end: 50_000, suffix: "+", label: "Moving jobs" },
  ];
  return (
    <section className="relative overflow-hidden bg-brand-navy py-20 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <Counter end={s.end} suffix={s.suffix} />
              <div className="mt-2 text-[11px] font-bold uppercase tracking-widest text-white/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1600;
          const step = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(end * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  const formatted = val >= 1000 ? val.toLocaleString() : val.toString();
  return (
    <div ref={ref} className="text-3xl font-extrabold text-primary-glow md:text-5xl">
      {formatted}
      {suffix}
    </div>
  );
}

/* ============ TESTIMONIALS ============ */
function Testimonials() {
  const t = [
    {
      q: "Sent a laptop from Avondale to Borrowdale in 18 minutes. Live tracking is a game-changer.",
      n: "Rutendo Moyo",
      r: "Founder, Kudu Retail",
      initials: "RM",
    },
    {
      q: "The moving crew was on time, professional, and priced fairly. Best move I've had in Harare.",
      n: "Tinashe Chirwa",
      r: "New homeowner",
      initials: "TC",
    },
    {
      q: "We run our whole restaurant delivery on HexiDrop. Reliable riders, transparent invoices.",
      n: "Chipo Ndlovu",
      r: "Manager, Sadza House",
      initials: "CN",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeader eyebrow="Loved across Zimbabwe" title="What our customers say" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {t.map((it) => (
          <figure
            key={it.n}
            className="relative rounded-3xl border border-border bg-card p-8 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 text-primary-glow">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            </div>
            <blockquote className="mt-5 text-[15px] leading-relaxed text-foreground">
              "{it.q}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                {it.initials}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{it.n}</div>
                <div className="text-xs text-muted-foreground">{it.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ============ FAQ ============ */
function FAQ() {
  const faqs = [
    {
      q: "How quickly can a rider pick up my parcel?",
      a: "In Harare and Bulawayo, our median pickup time is 3 minutes. We assign the nearest vetted rider automatically after booking.",
    },
    {
      q: "How is pricing calculated?",
      a: "Fares are based on distance, vehicle type and waiting time. You see the full total upfront — no surge pricing, no hidden fees.",
    },
    {
      q: "Are my items insured?",
      a: "Yes. Every parcel is covered up to $200 by default, and larger moves can be insured to full replacement value.",
    },
    {
      q: "Do you handle full home and office moves?",
      a: "Absolutely. Our Movers & Packers service includes free packing materials, wrapping, disassembly, transport and reassembly.",
    },
    {
      q: "Can businesses get monthly invoicing?",
      a: "Yes — HexiDrop Business gives you a dedicated account manager, bulk pricing, API access and monthly consolidated invoices.",
    },
    {
      q: "What payment methods do you accept?",
      a: "Cash on delivery, EcoCash, Visa, Mastercard and direct bank transfer for business accounts.",
    },
  ];
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Answers, before you even ask."
        />
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <FAQItem key={i} {...f} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-bold text-foreground md:text-base">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ============ FINAL CTA ============ */
function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-primary p-10 text-primary-foreground shadow-elegant md:p-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Ready to move something?
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/90">
              Book a delivery in under 30 seconds, or download the app for
              instant access to bikes, vans, trucks and full moving crews.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-navy shadow-elegant hover:-translate-y-0.5 transition"
            >
              Book delivery <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex gap-2">
              <StoreBadge store="apple" />
              <StoreBadge store="google" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SHARED ============ */
function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-bold uppercase tracking-widest text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-base text-muted-foreground md:text-lg">{body}</p>}
    </div>
  );
}

export default Home;
