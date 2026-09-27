import { Link } from "react-router-dom";
import {
  Target,
  Compass,
  Users,
  Award,
  ArrowRight,
  Heart,
  Leaf,
  Sparkles,
} from "lucide-react";
import { HexiLogo } from "@/components/hexi/Logo";
import moversTeam from "@/assets/movers-team-truck.jpg";
import moversOffice from "@/assets/movers-office.jpg";
import moversPacking from "@/assets/movers-packing.jpg";
import serviceParcel from "@/assets/service-parcel.jpg";
import heroFleet from "@/assets/hero-fleet.jpg";



export function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-foreground shadow-[0_30px_70px_-40px_oklch(0.35_0.12_155/0.35)]">
        <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              About us
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Delivery, done the
              <br />
              Zimbabwean way.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              HexiDrop started in a Harare garage in 2022 with three bikes and a
              promise: make sending anything, anywhere, feel effortless. Today we
              move more than a million parcels a year across the country.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
              >
                Join the team <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-6 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:bg-white"
              >
                Talk to us
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-elegant">
            <img
              src={moversTeam}
              alt="HexiDrop crew loading a delivery truck in Harare"
              className="h-72 w-full object-cover md:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Our story
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Three bikes, one stubborn idea
          </h2>
          <p className="mt-4 text-muted-foreground">
            We believed a parcel in Zimbabwe should be as easy to send as a text
            message. Here's how far that got us.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[
            { y: "2022", t: "The garage", b: "Three riders, one WhatsApp number and a Borrowdale garage." },
            { y: "2023", t: "The app", b: "Live tracking, upfront fares and EcoCash launch in Harare." },
            { y: "2024", t: "Nationwide", b: "Bulawayo, Mutare and Gweru come online. Trucks join the fleet." },
            { y: "2025", t: "Movers", b: "Full-service home and office moving crews launch countrywide." },
          ].map((s) => (
            <div
              key={s.y}
              className="relative rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="text-3xl font-extrabold text-primary/30">{s.y}</div>
              <div className="mt-3 text-lg font-bold text-foreground">{s.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission + values */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-8">
          <div className="rounded-[32px] bg-gradient-soft p-10 shadow-elegant">
            <HexiLogo size={96} layout="stacked" />
            <div className="mt-6 text-3xl font-extrabold text-foreground">
              Our mission
            </div>
            <p className="mt-3 text-muted-foreground">
              Give every Zimbabwean — from a market trader in Mbare to a
              logistics manager in Bulawayo — reliable, affordable, transparent
              delivery. Powered by local drivers and world-class technology.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { k: "1M+", v: "Parcels a year" },
                { k: "6,400", v: "Riders & movers" },
                { k: "12", v: "Cities covered" },
                { k: "4.9 ★", v: "Customer rating" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-2xl font-extrabold text-foreground">{s.k}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                icon: <Target className="h-5 w-5" />,
                t: "Purpose-built for Zimbabwe",
                b: "Cash and EcoCash first. Real addresses that don't need a postcode. Support in English and Shona.",
              },
              {
                icon: <Compass className="h-5 w-5" />,
                t: "Transparent by default",
                b: "You see the fare before you confirm. You see the driver on the map. You see photo proof at drop-off.",
              },
              {
                icon: <Users className="h-5 w-5" />,
                t: "Powered by local drivers",
                b: "6,400+ vetted riders and movers earning a fair wage on our platform every month.",
              },
              {
                icon: <Award className="h-5 w-5" />,
                t: "Awarded & trusted",
                b: "Winner of the 2025 Zim Startup of the Year. Rated 4.9 by more than 40,000 customers.",
              },
            ].map((v) => (
              <div
                key={v.t}
                className="flex gap-4 rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  {v.icon}
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">{v.t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{v.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture gallery */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Life at HexiDrop
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            The people behind every drop
          </h2>
          <p className="mt-4 text-muted-foreground">
            Riders, movers, dispatchers and engineers — one team, one standard.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <figure className="relative overflow-hidden rounded-[28px] shadow-card md:col-span-2 md:row-span-2">
            <img src={moversOffice} alt="HexiDrop office relocation crew at work" className="h-full min-h-72 w-full object-cover" loading="lazy" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/85 to-transparent p-6 text-sm font-semibold text-white">
              Office relocation crew · Harare CBD
            </figcaption>
          </figure>
          {[
            { src: moversPacking, cap: "Packing standards training" },
            { src: serviceParcel, cap: "Rider onboarding, Avondale" },
            { src: heroFleet, cap: "Fleet check, 6am" },
            { src: moversTeam, cap: "Move day, Borrowdale" },
          ].map((g) => (
            <figure key={g.cap} className="relative overflow-hidden rounded-[24px] shadow-card">
              <img src={g.src} alt={g.cap} loading="lazy" className="h-48 w-full object-cover transition duration-700 hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/85 to-transparent p-4 text-xs font-semibold text-white">
                {g.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              What we stand for
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              Principles we don't trade away
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Heart className="h-5 w-5" />, t: "Treat every parcel like it matters", b: "Because to someone, it does — a medicine, a contract, a birthday." },
              { icon: <Leaf className="h-5 w-5" />, t: "Lighter on the city", b: "Bike-first routing keeps small deliveries off the road in traffic." },
              { icon: <Sparkles className="h-5 w-5" />, t: "Fair work, fair pay", b: "Transparent earnings, weekly payouts and no hidden deductions." },
            ].map((p) => (
              <div key={p.t} className="rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  {p.icon}
                </div>
                <div className="mt-5 text-lg font-bold text-foreground">{p.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-hero px-8 py-16 text-center text-foreground shadow-elegant md:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight md:text-5xl">
            Want to build the network with us?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            We're hiring riders, movers, dispatchers and engineers across
            Zimbabwe — and we'd love to hear from partners too.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
            >
              See open roles <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-7 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:bg-white"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
