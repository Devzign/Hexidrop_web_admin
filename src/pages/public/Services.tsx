import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Building2,
  Sofa,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  MapPin,
  BellRing,
  BadgeCheck,
} from "lucide-react";
import serviceParcel from "@/assets/service-parcel.jpg";
import serviceMovers from "@/assets/service-movers.jpg";
import serviceBusiness from "@/assets/service-business.jpg";
import serviceLarge from "@/assets/service-large.jpg";
import heroFleet from "@/assets/hero-fleet.jpg";
import { VEHICLES, VehicleImage } from "@/components/hexi/VehicleIcon";



const services = [
  {
    id: "parcel",
    image: serviceParcel,
    eyebrow: "On-demand",
    icon: <Package className="h-5 w-5" />,
    title: "Parcel Delivery",
    body: "From a birthday cake to a laptop, a vetted rider is on the way in minutes. Follow every metre with live tracking and get photo proof at drop-off.",
    bullets: [
      "Bikes, vans, pickups and trucks",
      "Live GPS tracking + photo proof",
      "Insurance included on every shipment",
      "Cash, EcoCash and card accepted",
    ],
  },
  {
    id: "movers",
    image: serviceMovers,
    eyebrow: "End-to-end",
    icon: <Users className="h-5 w-5" />,
    title: "Movers & Packers",
    body: "A dedicated move manager, a uniformed crew and packing materials included. We move homes and offices with zero drama and zero scratches.",
    bullets: [
      "Free on-site survey and fixed quote",
      "Furniture disassembly & reassembly",
      "Bubble wrap, blankets and trolleys included",
      "Optional storage between moves",
    ],
  },
  {
    id: "business",
    image: serviceBusiness,
    eyebrow: "For business",
    icon: <Building2 className="h-5 w-5" />,
    title: "Business Delivery",
    body: "Restaurants, retailers and clinics run their last mile on HexiDrop. Dedicated fleets, consolidated invoicing and analytics for your whole team.",
    bullets: [
      "Monthly invoicing and reporting",
      "Branded rider uniforms available",
      "Priority dispatch during peak hours",
      "API and webhooks for your storefront",
    ],
  },
  {
    id: "large",
    image: serviceLarge,
    eyebrow: "Heavy duty",
    icon: <Sofa className="h-5 w-5" />,
    title: "Large Item Delivery",
    body: "Furniture, appliances and construction materials handled by crews trained for weight. Lift loading, stairs and awkward doorways are all in a day's work.",
    bullets: [
      "Sofas, wardrobes, fridges and mattresses",
      "Construction and hardware loads",
      "Two-person loading crews on request",
      "Protective wrapping as standard",
    ],
  },
];

export function Services() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-foreground shadow-[0_30px_70px_-40px_oklch(0.35_0.12_155/0.35)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Our services
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Every delivery.
              <br />
              Every move. Sorted.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Four focused services covering everything Zimbabwe needs moved —
              from a single envelope to a full three-bedroom home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
              >
                Talk to our team <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-6 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:bg-white"
              >
                About HexiDrop
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/60 shadow-elegant">
            <img
              src={heroFleet}
              alt="HexiDrop fleet of delivery bikes, vans and trucks"
              className="h-72 w-full object-cover md:h-[440px]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/80 to-transparent p-6 text-sm font-semibold">
              One network. Bikes to 3-tonne trucks.
            </div>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            What we move
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Built for parcels, homes and businesses
          </h2>
          <p className="mt-4 text-muted-foreground">
            Book what you need in the HexiDrop app — we handle drivers, crews,
            packing and proof of delivery.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.id}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="relative overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute left-5 top-5 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur">
                  {s.eyebrow}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    {s.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {s.title}
                  </h3>
                </div>
                <p className="text-muted-foreground">{s.body}</p>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition group-hover:gap-3"
                >
                  Enquire <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              How it works
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              Four steps, start to signature
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Tell us what to move", b: "Pickup, drop-off and item details in the app." },
              { n: "02", t: "Get matched", b: "The nearest suitable vehicle or crew is assigned." },
              { n: "03", t: "Track live", b: "Watch the driver on the map, share the link." },
              { n: "04", t: "Proof on delivery", b: "Photo, signature and receipt, instantly." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="text-4xl font-extrabold text-primary/25">{s.n}</div>
                <div className="mt-3 text-lg font-bold text-foreground">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Fleet
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
            Right-sized for anything you send
          </h2>
          <p className="mt-4 text-muted-foreground">
            Fares are calculated in the app from distance, vehicle type and
            waiting time — always shown in full before you confirm.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VEHICLES.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-5 rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="grid h-20 w-24 shrink-0 place-items-center">
                <VehicleImage id={v.id} className="h-16 w-20" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-base font-extrabold text-foreground">
                    {v.name}
                  </div>
                  {v.tag && (
                    <span className="rounded-full bg-warning/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-warning">
                      {v.tag}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {v.capacity}
                </div>
                <div className="mt-1 text-xs font-semibold text-primary">
                  Typical pickup in {v.eta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standards */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Service standards
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground md:text-4xl">
              The same promise on every job
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Clock className="h-5 w-5" />, t: "3-minute pickup", b: "Nearest-driver matching gets a rider to you fast." },
              { icon: <ShieldCheck className="h-5 w-5" />, t: "Fully insured", b: "Every parcel and every move is covered." },
              { icon: <Truck className="h-5 w-5" />, t: "Right vehicle", b: "Bike to 3T truck — never pay for space you don't use." },
              { icon: <MapPin className="h-5 w-5" />, t: "Live tracking", b: "Share a tracking link with your customer in one tap." },
              { icon: <BellRing className="h-5 w-5" />, t: "Real-time updates", b: "Notifications at pickup, in transit and drop-off." },
              { icon: <BadgeCheck className="h-5 w-5" />, t: "Verified crews", b: "ID-checked, trained and rated after every job." },
            ].map((f) => (
              <div
                key={f.t}
                className="rounded-3xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  {f.icon}
                </div>
                <div className="mt-5 text-lg font-bold text-foreground">{f.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-hero px-8 py-16 text-center text-foreground shadow-elegant md:px-16">
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight md:text-5xl">
            Need something moved this week?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us what you're sending and we'll point you to the right service
            and vehicle — no obligation.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-105"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-7 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:bg-white"
            >
              Drive with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
