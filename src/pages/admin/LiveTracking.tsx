import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Layers, Navigation, Filter } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORDERS, DRIVERS } from "@/lib/mock-data";



const STATUSES = ["On Trip", "Online", "Offline"] as const;
type DriverStatus = (typeof STATUSES)[number];

export function LiveTracking() {
  const [selected, setSelected] = useState(0);
  const [traffic, setTraffic] = useState(false);
  const [showRoads, setShowRoads] = useState(true);
  const [showPins, setShowPins] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Record<DriverStatus, boolean>>({
    "On Trip": true, "Online": true, "Offline": false,
  });
  const [zoom, setZoom] = useState(1);

  const trips = ORDERS.filter((o) => o.status === "In Transit").slice(0, 8);
  const drivers = DRIVERS
    .filter((d) => statusFilter[d.status as DriverStatus] ?? true)
    .slice(0, 12);
  const safeSelected = Math.min(selected, Math.max(drivers.length - 1, 0));

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={["Operations", "Live Tracking"]}
        title="Live Tracking"
        subtitle={`${drivers.length} drivers shown · ${trips.length} active trips · updated 3s ago`}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">
                  <Layers className="h-4 w-4" /> Layers
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Map layers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={showRoads} onCheckedChange={setShowRoads}>Roads</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showPins} onCheckedChange={setShowPins}>Driver pins</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={traffic} onCheckedChange={setTraffic}>Traffic</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">
                  <Filter className="h-4 w-4" /> Filter drivers
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Driver status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUSES.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={statusFilter[s]}
                    onCheckedChange={(v) => setStatusFilter((f) => ({ ...f, [s]: !!v }))}
                  >
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Map */}
        <div className="relative overflow-hidden rounded-2xl border shadow-card lg:col-span-3">
          <div className="map-grid relative h-[720px] w-full" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
            {/* Roads */}
            {showRoads && (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 40 Q 30 30 50 45 T 100 50" stroke="oklch(0.85 0.02 150)" strokeWidth="0.5" fill="none" />
                <path d="M20 0 Q 30 50 40 100" stroke="oklch(0.85 0.02 150)" strokeWidth="0.5" fill="none" />
                <path d="M0 70 Q 50 65 100 75" stroke="oklch(0.85 0.02 150)" strokeWidth="0.5" fill="none" />
                <path d="M60 0 Q 70 30 55 60 Q 45 90 80 100" stroke="oklch(0.85 0.02 150)" strokeWidth="0.5" fill="none" />
                <path d="M0 20 Q 40 25 100 15" stroke="oklch(0.85 0.02 150)" strokeWidth="0.5" fill="none" />
              </svg>
            )}

            {/* Traffic overlay */}
            {traffic && (
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 40 Q 30 30 50 45 T 100 50" stroke="hsl(0 84% 60% / 0.55)" strokeWidth="1.2" fill="none" />
                <path d="M0 70 Q 50 65 100 75" stroke="hsl(38 92% 55% / 0.55)" strokeWidth="1.2" fill="none" />
                <path d="M60 0 Q 70 30 55 60 Q 45 90 80 100" stroke="hsl(142 71% 45% / 0.55)" strokeWidth="1.2" fill="none" />
              </svg>
            )}

            {/* Pins */}
            {showPins && drivers.map((d, i) => {
              const top = 10 + ((i * 37) % 80);
              const left = 6 + ((i * 53) % 88);
              const tone = d.status === "On Trip" ? "info" : d.status === "Online" ? "success" : "muted";
              const bg = tone === "info" ? "bg-info" : tone === "success" ? "bg-success" : "bg-muted-foreground";
              return (
                <button
                  key={d.id}
                  onClick={() => setSelected(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <span className={`absolute -inset-3 rounded-full ${bg}/25`} style={{ animation: "pulse-ring 2.2s ease-out infinite" }} />
                  <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${bg} text-[10px] font-bold text-white ring-2 ring-white shadow-card`}>
                    {d.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </span>
                </button>
              );
            })}

            {/* Selected callout */}
            {drivers[safeSelected] && (
              <div className="absolute left-6 top-6 w-[300px] rounded-2xl border bg-card/95 p-4 shadow-elegant backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {drivers[safeSelected].name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{drivers[safeSelected].name}</div>
                    <div className="text-[11px] text-muted-foreground">{drivers[safeSelected].plate} · {drivers[safeSelected].vehicle}</div>
                  </div>
                  <StatusBadge tone={drivers[safeSelected].status === "On Trip" ? "info" : "success"} label={drivers[safeSelected].status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
                  <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Trips</div><div className="text-sm font-semibold">{drivers[safeSelected].trips}</div></div>
                  <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Rating</div><div className="text-sm font-semibold">★ {drivers[safeSelected].rating}</div></div>
                  <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">City</div><div className="text-sm font-semibold">{drivers[safeSelected].city}</div></div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 rounded-xl border bg-card/95 px-3 py-2 shadow-card backdrop-blur">
              <span className="flex items-center gap-1.5 text-[11px] font-medium"><span className="h-2 w-2 rounded-full bg-success" /> Available</span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium"><span className="h-2 w-2 rounded-full bg-info" /> On trip</span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium"><span className="h-2 w-2 rounded-full bg-warning" /> Idle</span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium"><span className="h-2 w-2 rounded-full bg-destructive" /> Alert</span>
            </div>

            {/* Traffic layer toggle */}
            <div className="absolute right-4 top-4 flex flex-col gap-1.5">
              <button
                onClick={() => setTraffic((t) => !t)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-card backdrop-blur hover:bg-accent ${traffic ? "bg-primary text-primary-foreground" : "bg-card/95"}`}
              >
                <Navigation className="h-3.5 w-3.5" /> Traffic
              </button>
              <div className="flex flex-col overflow-hidden rounded-xl border bg-card/95 shadow-card backdrop-blur">
                <button onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))} className="flex h-9 w-9 items-center justify-center text-lg font-semibold hover:bg-accent">+</button>
                <button onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(2)))} className="flex h-9 w-9 items-center justify-center text-lg font-semibold hover:bg-accent">−</button>
              </div>
            </div>
          </div>
        </div>



        {/* Trip list */}
        <div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="border-b px-4 py-3">
            <div className="text-sm font-semibold">Active trips</div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{trips.length} in progress</div>
          </div>
          <ul className="max-h-[664px] flex-1 divide-y overflow-y-auto">
            {trips.map((o) => (
              <li key={o.id} className="cursor-pointer px-4 py-3 transition hover:bg-accent/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs tracking-tight text-foreground">{o.id}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div className="mt-1.5 space-y-0.5 text-xs font-medium text-foreground">
                  <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="truncate">{o.pickup}</span></div>
                  <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /><span className="truncate">{o.drop}</span></div>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-foreground">{o.driver}</span>
                  <span className="tabular-nums">ETA {o.eta}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LiveTracking;
