import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bike,
  Boxes,
  HeartHandshake,
  Wallet,
  GraduationCap,
  ShieldCheck,
  MapPin,
  Clock,
} from "lucide-react";
import moversTeam from "@/assets/movers-team-truck.jpg";
import moversPacking from "@/assets/movers-packing.jpg";
import serviceParcel from "@/assets/service-parcel.jpg";
import serviceBusiness from "@/assets/service-business.jpg";



const roles = [
  {
    icon: <Bike className="h-5 w-5" />,
    title: "Delivery Rider",
    team: "Fleet",
    location: "Harare · Bulawayo · Mutare",
    type: "Flexible hours",
    body: "Own a bike or scooter? Ride on your schedule with weekly payouts and in-app earnings you can see live.",
  },
  {
    icon: <Boxes className="h-5 w-5" />,
    title: "Mover / Packer",
    team: "Movers & Packers",
    location: "Harare · Gweru",
    type: "Full-time",
    body: "Join a uniformed crew handling home and office relocations. Training and equipment provided.",
  },
];

export function Careers() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-foreground shadow-[0_30px_70px_-40px_oklch(0.35_0.12_155/0.35)]">
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Careers
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Move Zimbabwe
              <br />
              forward with us.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              6,400 riders and movers already earn on HexiDrop. Whether you ride
              or lift, there's a seat on this truck.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#open-roles"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
              >
                See open roles <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-6 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:bg-white"
              >
                Our story
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { k: "6,400+", v: "People earning" },
                { k: "Weekly", v: "Payouts" },
                { k: "12", v: "Cities" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-extrabold text-foreground">{s.k}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-elegant">
            <img
              src={moversTeam}
              alt="HexiDrop team loading a moving truck"
              className="h-72 w-full object-cover md:h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Why join
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Real work, real support
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: <Wallet className="h-5 w-5" />, t: "Transparent earnings", b: "See what you'll earn before you accept. Weekly payouts, no hidden deductions." },
            { icon: <GraduationCap className="h-5 w-5" />, t: "Training that counts", b: "Packing, safe lifting, customer care and road safety — paid and certified." },
            { icon: <ShieldCheck className="h-5 w-5" />, t: "Cover on the job", b: "Accident cover and 24/7 support on every shift you work." },
            { icon: <Clock className="h-5 w-5" />, t: "Hours that fit", b: "Riders choose their own shifts. Crews work planned, predictable rosters." },
            { icon: <MapPin className="h-5 w-5" />, t: "Work near home", b: "Zone-based dispatch keeps you in the suburbs you know best." },
            { icon: <HeartHandshake className="h-5 w-5" />, t: "Grow with us", b: "Most of our dispatch and ops leads started on a bike or in a crew." },
          ].map((b) => (
            <div key={b.t} className="rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                {b.icon}
              </div>
              <div className="mt-5 text-lg font-bold text-foreground">{b.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{b.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Culture gallery */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Our culture
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              Early starts, high standards, good people
            </h2>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { src: serviceParcel, cap: "Morning rider briefing" },
              { src: moversPacking, cap: "Packing standards workshop" },
              { src: serviceBusiness, cap: "Movers crew, Borrowdale HQ" },
            ].map((g) => (
              <figure key={g.cap} className="relative overflow-hidden rounded-[28px] shadow-card">
                <img src={g.src} alt={g.cap} loading="lazy" className="h-72 w-full object-cover transition duration-700 hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/85 to-transparent p-5 text-sm font-semibold text-white">
                  {g.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="open-roles" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Open roles
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            On the road or on the move
          </h2>
          <p className="mt-4 text-muted-foreground">
            Both roles include paid onboarding, weekly payouts and real growth paths.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {roles.map((r) => (
            <article
              key={r.title}
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  {r.icon}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">{r.title}</h3>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {r.team}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{r.body}</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-full bg-secondary px-3 py-1 text-brand-navy">
                  {r.location}
                </span>
                <span className="rounded-full bg-warning/20 px-3 py-1 uppercase tracking-widest text-warning">
                  {r.type}
                </span>
              </div>
              <Link
                to="/contact"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition group-hover:gap-3"
              >
                Apply now <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Hiring process */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Hiring process
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              From application to first shift
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Apply", b: "Send your details — two minutes, no long forms." },
              { n: "02", t: "Chat", b: "A quick call with our ops team to understand the fit." },
              { n: "03", t: "Verify & train", b: "ID and licence checks, then paid onboarding." },
              { n: "04", t: "First shift", b: "Kit issued, app activated, mentor on standby." },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
                <div className="text-4xl font-extrabold text-primary/25">{s.n}</div>
                <div className="mt-3 text-lg font-bold text-foreground">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-hero px-8 py-16 text-center text-foreground shadow-elegant md:px-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight md:text-5xl">
            Ready to ride with HexiDrop?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us a little about yourself and our team will be in touch within
            two working days.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
            >
              Apply today <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-7 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:bg-white"
            >
              What we do
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Careers;
