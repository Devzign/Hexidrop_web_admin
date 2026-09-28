import { useEffect, useRef, useState, useMemo } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap as useGoogleMap,
} from "@vis.gl/react-google-maps";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap as useLeafletMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { Driver, Order } from "@/lib/mock-data";
import { HARARE_CENTER, HARARE_ZONES, type LatLng, type OperationalZone } from "@/lib/geo-data";
import type { MapConfig } from "@/hooks/use-map-config";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Navigation,
  Car,
  MapPin,
  Layers,
  Sparkles,
  Phone,
  Shield,
  Star,
  ExternalLink,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* PROPS                                                                      */
/* -------------------------------------------------------------------------- */

export interface RealMapProps {
  config: MapConfig;
  center?: LatLng;
  zoom?: number;
  drivers?: Driver[];
  selectedDriver?: Driver | null;
  onSelectDriver?: (driver: Driver) => void;
  activeTrip?: Order | null;
  zones?: OperationalZone[];
  height?: string | number;
  className?: string;
  showControls?: boolean;
}

/* -------------------------------------------------------------------------- */
/* GOOGLE MAPS TRAFFIC COMPONENT                                              */
/* -------------------------------------------------------------------------- */

function GoogleTrafficLayer({ visible }: { visible: boolean }) {
  const map = useGoogleMap();
  useEffect(() => {
    if (!map) return;
    const trafficLayer = new google.maps.TrafficLayer();
    if (visible) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, visible]);
  return null;
}

/* -------------------------------------------------------------------------- */
/* GOOGLE MAPS ROUTE POLYLINE                                                 */
/* -------------------------------------------------------------------------- */

function GoogleRoutePolyline({
  trip,
  driver,
}: {
  trip?: Order | null;
  driver?: Driver | null;
}) {
  const map = useGoogleMap();

  useEffect(() => {
    if (!map || !trip) return;
    const pCoord = trip.pickupCoords;
    const dCoord = trip.dropCoords;
    if (!pCoord || !dCoord) return;

    const path: google.maps.LatLngLiteral[] = [];
    path.push({ lat: pCoord.lat, lng: pCoord.lng });
    if (driver) {
      path.push({ lat: driver.lat, lng: driver.lng });
    } else if (trip.driverCoords) {
      path.push({ lat: trip.driverCoords.lat, lng: trip.driverCoords.lng });
    }
    path.push({ lat: dCoord.lat, lng: dCoord.lng });

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#0284c7",
      strokeOpacity: 0.9,
      strokeWeight: 4,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, trip, driver]);

  return null;
}

/* -------------------------------------------------------------------------- */
/* GOOGLE MAPS PAN CONTROLLER                                                 */
/* -------------------------------------------------------------------------- */

function GoogleMapController({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useGoogleMap();
  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: center.lat, lng: center.lng });
    if (zoom) map.setZoom(zoom);
  }, [map, center, zoom]);
  return null;
}

/* -------------------------------------------------------------------------- */
/* GOOGLE MAPS ZONES POLYGONS                                                 */
/* -------------------------------------------------------------------------- */

function GoogleZonePolygons({ zones }: { zones: OperationalZone[] }) {
  const map = useGoogleMap();
  useEffect(() => {
    if (!map || !zones.length) return;
    const polys: google.maps.Polygon[] = [];

    zones.forEach((z) => {
      const paths = z.bounds.map(([lat, lng]) => ({ lat, lng }));
      const poly = new google.maps.Polygon({
        paths,
        strokeColor: z.strokeColor,
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: z.strokeColor,
        fillOpacity: 0.16,
        map,
      });
      polys.push(poly);
    });

    return () => {
      polys.forEach((p) => p.setMap(null));
    };
  }, [map, zones]);
  return null;
}

/* -------------------------------------------------------------------------- */
/* LEAFLET CONTROLLER                                                         */
/* -------------------------------------------------------------------------- */

function LeafletMapController({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useLeafletMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.2 });
  }, [map, center.lat, center.lng, zoom]);
  return null;
}

/* -------------------------------------------------------------------------- */
/* LEAFLET CUSTOM ICON CREATOR                                                */
/* -------------------------------------------------------------------------- */

function createDriverIcon(d: Driver, isSelected: boolean) {
  const isOnline = d.status === "Online";
  const isOnTrip = d.status === "On Trip";
  const ringColor = isOnTrip ? "bg-info/30" : isOnline ? "bg-success/30" : "bg-muted-foreground/30";
  const bgColor = isOnTrip ? "bg-info" : isOnline ? "bg-success" : "bg-muted-foreground";
  const scale = isSelected ? "scale-125 z-50 ring-4 ring-primary" : "hover:scale-110";

  const initials = d.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

  const html = `
    <div class="relative flex items-center justify-center transition-transform ${scale}" style="width: 38px; height: 38px;">
      <span class="absolute -inset-1.5 rounded-full ${ringColor} animate-ping" style="animation-duration: 2.4s;"></span>
      <span class="relative flex h-8 w-8 items-center justify-center rounded-full ${bgColor} text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
        ${initials}
      </span>
      ${isSelected ? `<span class="absolute -bottom-1 h-2 w-2 rotate-45 ${bgColor}"></span>` : ""}
    </div>
  `;

  return L.divIcon({
    html,
    className: "driver-marker-pin",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

function createPointIcon(label: string, color: string) {
  const html = `
    <div class="flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-black text-white shadow-md ring-2 ring-white" style="background: ${color};">
      ${label}
    </div>
  `;
  return L.divIcon({
    html,
    className: "route-endpoint-pin",
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  });
}

/* -------------------------------------------------------------------------- */
/* MAIN UNIFIED REAL MAP COMPONENT                                            */
/* -------------------------------------------------------------------------- */

export function RealMap({
  config,
  center = HARARE_CENTER,
  zoom = 12,
  drivers = [],
  selectedDriver = null,
  onSelectDriver,
  activeTrip = null,
  zones = HARARE_ZONES,
  height = "720px",
  className = "",
  showControls = true,
}: RealMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const effectiveCenter = selectedDriver
    ? { lat: selectedDriver.lat, lng: selectedDriver.lng }
    : center;

  // Active route coordinates
  const routePoints = useMemo(() => {
    if (!activeTrip?.pickupCoords || !activeTrip?.dropCoords) return null;
    const p = activeTrip.pickupCoords;
    const d = activeTrip.dropCoords;
    const mid = selectedDriver
      ? { lat: selectedDriver.lat, lng: selectedDriver.lng }
      : activeTrip.driverCoords || {
          lat: (p.lat + d.lat) / 2,
          lng: (p.lng + d.lng) / 2,
        };
    return {
      pickup: p,
      driver: mid,
      drop: d,
      polylineCoords: [
        [p.lat, p.lng] as [number, number],
        [mid.lat, mid.lng] as [number, number],
        [d.lat, d.lng] as [number, number],
      ],
    };
  }, [activeTrip, selectedDriver]);

  // Determine if Google Maps should be active:
  // Must have apiKey set, and engine === "google".
  const useGoogle = config.engine === "google" && Boolean(config.apiKey);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border bg-card shadow-card ${className}`}
      style={{ height }}
    >
      {/* ==================================================================== */}
      {/* 1. GOOGLE MAPS PLATFORM ENGINE                                       */}
      {/* ==================================================================== */}
      {useGoogle ? (
        <APIProvider apiKey={config.apiKey} region="ZW">
          <GoogleMap
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
            defaultCenter={{ lat: effectiveCenter.lat, lng: effectiveCenter.lng }}
            defaultZoom={currentZoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeId={
              config.mapType === "satellite"
                ? "satellite"
                : config.mapType === "hybrid"
                ? "hybrid"
                : config.mapType === "terrain"
                ? "terrain"
                : "roadmap"
            }
            style={{ width: "100%", height: "100%" }}
          >
            <GoogleMapController center={effectiveCenter} zoom={currentZoom} />
            <GoogleTrafficLayer visible={config.traffic} />

            {/* Zone Polygons */}
            {config.showZones && <GoogleZonePolygons zones={zones} />}

            {/* Active Route Polyline */}
            {config.showRoutes && routePoints && (
              <GoogleRoutePolyline trip={activeTrip} driver={selectedDriver} />
            )}

            {/* Pickup & Drop Advanced Markers */}
            {config.showRoutes && routePoints && (
              <>
                <AdvancedMarker
                  position={{
                    lat: routePoints.pickup.lat,
                    lng: routePoints.pickup.lng,
                  }}
                  title={`Pickup: ${activeTrip?.pickup}`}
                >
                  <Pin background="#10b981" glyphColor="#fff" borderColor="#047857" scale={1.1} />
                </AdvancedMarker>

                <AdvancedMarker
                  position={{
                    lat: routePoints.drop.lat,
                    lng: routePoints.drop.lng,
                  }}
                  title={`Drop: ${activeTrip?.drop}`}
                >
                  <Pin background="#ef4444" glyphColor="#fff" borderColor="#b91c1c" scale={1.1} />
                </AdvancedMarker>
              </>
            )}

            {/* Driver Pins */}
            {config.showPins &&
              drivers.map((d) => {
                const isSelected = selectedDriver?.id === d.id;
                const toneColor =
                  d.status === "On Trip"
                    ? "#0284c7"
                    : d.status === "Online"
                    ? "#10b981"
                    : "#64748b";

                return (
                  <AdvancedMarker
                    key={d.id}
                    position={{ lat: d.lat, lng: d.lng }}
                    onClick={() => onSelectDriver?.(d)}
                    title={`${d.name} (${d.vehicle})`}
                  >
                    <Pin
                      background={toneColor}
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.3 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}
          </GoogleMap>
        </APIProvider>
      ) : (
        /* ==================================================================== */
        /* 2. OPENSTREETMAP / LEAFLET FALLBACK ENGINE (ZERO-CONFIG LIVE TILES)  */
        /* ==================================================================== */
        <MapContainer
          center={[effectiveCenter.lat, effectiveCenter.lng]}
          zoom={currentZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <LeafletMapController center={effectiveCenter} zoom={currentZoom} />

          {/* Dynamic Tiles: OpenStreetMap standard or Esri Satellite */}
          {config.mapType === "satellite" || config.mapType === "hybrid" ? (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {/* Operational Zones Polygons */}
          {config.showZones &&
            zones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.bounds}
                pathOptions={{
                  color: zone.strokeColor,
                  fillColor: zone.strokeColor,
                  fillOpacity: 0.18,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-1">
                    <div className="font-bold text-xs">{zone.name}</div>
                    <div className="text-[11px] text-muted-foreground">{zone.code} · Base: ${zone.baseFare.toFixed(2)}</div>
                    <div className="mt-1 text-[11px] font-medium text-emerald-600">
                      {zone.activeDrivers} active drivers · {zone.activeTrips} trips
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}

          {/* Active Trip Polyline & Endpoints */}
          {config.showRoutes && routePoints && (
            <>
              <Polyline
                positions={routePoints.polylineCoords}
                color="#0284c7"
                weight={4}
                opacity={0.85}
                dashArray="6, 8"
              />
              <Marker
                position={[routePoints.pickup.lat, routePoints.pickup.lng]}
                icon={createPointIcon("PICKUP", "#10b981")}
              />
              <Marker
                position={[routePoints.drop.lat, routePoints.drop.lng]}
                icon={createPointIcon("DROP", "#ef4444")}
              />
            </>
          )}

          {/* Live Driver Markers */}
          {config.showPins &&
            drivers.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
                icon={createDriverIcon(d, selectedDriver?.id === d.id)}
                eventHandlers={{
                  click: () => onSelectDriver?.(d),
                }}
              >
                <Popup>
                  <div className="w-56 p-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{d.name}</span>
                      <StatusBadge
                        tone={d.status === "On Trip" ? "info" : d.status === "Online" ? "success" : "muted"}
                        label={d.status}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {d.plate} · {d.vehicle}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1 border-t pt-2 text-center text-[10px]">
                      <div>
                        <div className="text-muted-foreground uppercase">Trips</div>
                        <div className="font-bold">{d.trips}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground uppercase">Rating</div>
                        <div className="font-bold text-amber-600">★ {d.rating}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground uppercase">Area</div>
                        <div className="font-bold truncate">{d.currentSuburb}</div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}

      {/* ==================================================================== */}
      {/* 3. FLOATING OVERLAYS & CONTROLS                                      */}
      {/* ==================================================================== */}

      {/* Top Left: Selected Driver Callout Card */}
      {selectedDriver && (
        <div className="absolute left-4 top-4 z-[1000] w-[320px] rounded-2xl border bg-card/95 p-4 shadow-elegant backdrop-blur animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-sm font-bold text-primary-foreground shadow-sm">
                {selectedDriver.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">{selectedDriver.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {selectedDriver.plate} · {selectedDriver.vehicle}
                </div>
              </div>
            </div>
            <StatusBadge
              tone={
                selectedDriver.status === "On Trip"
                  ? "info"
                  : selectedDriver.status === "Online"
                  ? "success"
                  : "muted"
              }
              label={selectedDriver.status}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-2.5 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Trips</div>
              <div className="text-sm font-bold text-foreground">{selectedDriver.trips}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</div>
              <div className="text-sm font-bold text-amber-600">★ {selectedDriver.rating}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</div>
              <div className="truncate text-xs font-semibold text-foreground">
                {selectedDriver.currentSuburb}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t pt-2.5">
            <a
              href={`tel:${selectedDriver.phone}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border bg-background py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call
            </a>
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${selectedDriver.lat},${selectedDriver.lng}`;
                window.open(url, "_blank");
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Navigate
            </button>
          </div>
        </div>
      )}

      {/* Top Right: Layer & Engine Quick Toggles */}
      {showControls && (
        <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
          {/* Provider Badge */}
          <div className="flex items-center gap-1.5 rounded-xl border bg-card/95 px-3 py-1.5 text-[11px] font-bold shadow-card backdrop-blur">
            <span
              className={`h-2 w-2 rounded-full ${
                useGoogle ? "bg-primary animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span>{useGoogle ? "Google Maps API" : "OpenStreetMap Live"}</span>
          </div>

          {/* Traffic Toggle */}
          <button
            type="button"
            onClick={() => config.setTraffic((t) => !t)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-card backdrop-blur transition hover:bg-accent ${
              config.traffic ? "bg-primary text-primary-foreground" : "bg-card/95 text-foreground"
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Traffic</span>
          </button>

          {/* Map Style Toggle (Roadmap vs Satellite) */}
          <button
            type="button"
            onClick={() =>
              config.setMapType(config.mapType === "roadmap" ? "satellite" : "roadmap")
            }
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-card backdrop-blur transition hover:bg-accent ${
              config.mapType === "satellite"
                ? "bg-primary text-primary-foreground"
                : "bg-card/95 text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{config.mapType === "satellite" ? "Roadmap" : "Satellite"}</span>
          </button>

          {/* Zoom In/Out */}
          <div className="flex flex-col overflow-hidden rounded-xl border bg-card/95 shadow-card backdrop-blur">
            <button
              type="button"
              onClick={() => setCurrentZoom((z) => Math.min(18, z + 1))}
              className="flex h-9 w-9 items-center justify-center text-base font-bold text-foreground hover:bg-accent transition"
            >
              +
            </button>
            <div className="h-[1px] bg-border" />
            <button
              type="button"
              onClick={() => setCurrentZoom((z) => Math.max(9, z - 1))}
              className="flex h-9 w-9 items-center justify-center text-base font-bold text-foreground hover:bg-accent transition"
            >
              −
            </button>
          </div>
        </div>
      )}

      {/* Bottom Left: Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap items-center gap-3 rounded-xl border bg-card/95 px-3.5 py-2 text-xs shadow-card backdrop-blur">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-success ring-2 ring-success/20" /> Available
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-info ring-2 ring-info/20" /> On Trip
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-warning/20" /> Idle
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-destructive/20" /> Alert
        </span>
      </div>
    </div>
  );
}

export default RealMap;
