import { useState } from "react";
import { Layers, Filter, Settings2, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderStatusBadge } from "@/components/admin/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORDERS, DRIVERS, type Driver, type Order } from "@/lib/mock-data";
import { HARARE_CENTER, HARARE_ZONES } from "@/lib/geo-data";
import { useMapConfig } from "@/hooks/use-map-config";
import { RealMap } from "@/components/maps/RealMap";
import { MapConfigModal } from "@/components/maps/MapConfigModal";

const STATUSES = ["On Trip", "Online", "Offline"] as const;
type DriverStatus = (typeof STATUSES)[number];

export function LiveTracking() {
  const mapConfig = useMapConfig();
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<Record<DriverStatus, boolean>>({
    "On Trip": true,
    "Online": true,
    "Offline": false,
  });

  const trips = ORDERS.filter((o) => o.status === "In Transit").slice(0, 8);
  const drivers = DRIVERS.filter((d) => statusFilter[d.status as DriverStatus] ?? true);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(drivers[0] || null);
  const [activeTrip, setActiveTrip] = useState<Order | null>(trips[0] || null);

  const handleSelectTrip = (trip: Order) => {
    setActiveTrip(trip);
    // Find matching driver if available
    const matchedDriver = drivers.find((d) => d.name === trip.driver) || drivers[0] || null;
    if (matchedDriver) {
      setSelectedDriver(matchedDriver);
    }
  };

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    // Find matching active trip if any
    const matchedTrip = trips.find((t) => t.driver === driver.name) || null;
    if (matchedTrip) {
      setActiveTrip(matchedTrip);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={["Operations", "Live Tracking"]}
        title="Live Fleet Tracking"
        subtitle={`${drivers.length} drivers online · ${trips.length} active delivery dispatches across Harare`}
        actions={
          <div className="flex items-center gap-2">
            {/* Map Settings / API Key */}
            <button
              onClick={() => setConfigModalOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent transition"
            >
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Map Settings</span>
              {mapConfig.apiKey ? (
                <span className="h-2 w-2 rounded-full bg-emerald-500" title="Google Maps API Key Active" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-500" title="OpenStreetMap Mode" />
              )}
            </button>

            {/* Layers Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">
                  <Layers className="h-4 w-4" /> Layers
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Map Overlays</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={mapConfig.showPins}
                  onCheckedChange={mapConfig.setShowPins}
                >
                  Driver pins
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={mapConfig.showRoutes}
                  onCheckedChange={mapConfig.setShowRoutes}
                >
                  Active dispatch routes
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={mapConfig.showZones}
                  onCheckedChange={mapConfig.setShowZones}
                >
                  Delivery zones
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={mapConfig.traffic}
                  onCheckedChange={mapConfig.setTraffic}
                >
                  Traffic flow
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Drivers */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent">
                  <Filter className="h-4 w-4" /> Filter
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Driver status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUSES.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={statusFilter[s]}
                    onCheckedChange={(v) =>
                      setStatusFilter((f) => ({ ...f, [s]: Boolean(v) }))
                    }
                  >
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Real Interactive Map */}
        <div className="lg:col-span-3">
          <RealMap
            config={mapConfig}
            center={selectedDriver ? { lat: selectedDriver.lat, lng: selectedDriver.lng } : HARARE_CENTER}
            zoom={selectedDriver ? 14 : 12}
            drivers={drivers}
            selectedDriver={selectedDriver}
            onSelectDriver={handleSelectDriver}
            activeTrip={activeTrip}
            zones={HARARE_ZONES}
            height="720px"
          />
        </div>

        {/* Active Trips Sidebar */}
        <div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
            <div>
              <div className="text-sm font-bold text-foreground">Active Trips</div>
              <div className="text-xs text-muted-foreground">{trips.length} in transit</div>
            </div>
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              Harare
            </span>
          </div>

          <ul className="max-h-[664px] flex-1 divide-y overflow-y-auto">
            {trips.map((o) => {
              const isSelected = activeTrip?.id === o.id;
              return (
                <li
                  key={o.id}
                  onClick={() => handleSelectTrip(o)}
                  className={`cursor-pointer px-4 py-3.5 transition ${
                    isSelected
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{o.id}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>

                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <span className="truncate text-foreground font-medium">{o.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      <span className="truncate text-foreground font-medium">{o.drop}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                    <span className="font-semibold text-foreground">{o.driver}</span>
                    <span className="tabular-nums font-bold text-primary">ETA {o.eta}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Map Settings Modal */}
      <MapConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        config={mapConfig}
      />
    </div>
  );
}

export default LiveTracking;
