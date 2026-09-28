import { useEffect, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  useMap as useGoogleMap,
} from "@vis.gl/react-google-maps";
import {
  MapContainer,
  TileLayer,
  Polygon as LeafletPolygon,
  Popup,
  useMap as useLeafletMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { HARARE_CENTER, HARARE_ZONES, type OperationalZone, type LatLng } from "@/lib/geo-data";
import type { MapConfig } from "@/hooks/use-map-config";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Shield, Users, PackageCheck, DollarSign, Layers } from "lucide-react";

interface ZonePolygonMapProps {
  config: MapConfig;
  zones?: OperationalZone[];
  selectedZoneId?: string | null;
  onSelectZone?: (zone: OperationalZone) => void;
  height?: string | number;
}

function GoogleZoneRenderer({
  zones,
  selectedZoneId,
  onSelectZone,
}: {
  zones: OperationalZone[];
  selectedZoneId?: string | null;
  onSelectZone?: (zone: OperationalZone) => void;
}) {
  const map = useGoogleMap();

  useEffect(() => {
    if (!map || !zones.length) return;
    const polygons: google.maps.Polygon[] = [];

    zones.forEach((z) => {
      const isSelected = z.id === selectedZoneId;
      const paths = z.bounds.map(([lat, lng]) => ({ lat, lng }));

      const poly = new google.maps.Polygon({
        paths,
        strokeColor: z.strokeColor,
        strokeOpacity: isSelected ? 1.0 : 0.8,
        strokeWeight: isSelected ? 4 : 2,
        fillColor: z.strokeColor,
        fillOpacity: isSelected ? 0.35 : 0.18,
        map,
      });

      poly.addListener("click", () => {
        onSelectZone?.(z);
      });

      polygons.push(poly);
    });

    return () => {
      polygons.forEach((p) => p.setMap(null));
    };
  }, [map, zones, selectedZoneId, onSelectZone]);

  return null;
}

function LeafletZoneController({ center }: { center: LatLng }) {
  const map = useLeafletMap();
  useEffect(() => {
    map.panTo([center.lat, center.lng], { animate: true });
  }, [map, center.lat, center.lng]);
  return null;
}

export function ZonePolygonMap({
  config,
  zones = HARARE_ZONES,
  selectedZoneId = null,
  onSelectZone,
  height = "520px",
}: ZonePolygonMapProps) {
  const [activeZone, setActiveZone] = useState<OperationalZone | null>(() => {
    return zones.find((z) => z.id === selectedZoneId) || zones[0] || null;
  });

  const handleSelect = (zone: OperationalZone) => {
    setActiveZone(zone);
    onSelectZone?.(zone);
  };

  const useGoogle = config.engine === "google" && Boolean(config.apiKey);
  const currentCenter = activeZone?.center || HARARE_CENTER;

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl border bg-card" style={{ height }}>
      {useGoogle ? (
        <APIProvider apiKey={config.apiKey} region="ZW">
          <GoogleMap
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
            defaultCenter={{ lat: HARARE_CENTER.lat, lng: HARARE_CENTER.lng }}
            defaultZoom={11}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: "100%", height: "100%" }}
          >
            <GoogleZoneRenderer
              zones={zones}
              selectedZoneId={activeZone?.id}
              onSelectZone={handleSelect}
            />
          </GoogleMap>
        </APIProvider>
      ) : (
        <MapContainer
          center={[HARARE_CENTER.lat, HARARE_CENTER.lng]}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <LeafletZoneController center={currentCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {zones.map((zone) => {
            const isSelected = activeZone?.id === zone.id;
            return (
              <LeafletPolygon
                key={zone.id}
                positions={zone.bounds}
                pathOptions={{
                  color: zone.strokeColor,
                  weight: isSelected ? 4 : 2,
                  fillColor: zone.strokeColor,
                  fillOpacity: isSelected ? 0.35 : 0.18,
                }}
                eventHandlers={{
                  click: () => handleSelect(zone),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <div className="text-sm font-bold">{zone.name}</div>
                    <div className="text-xs text-muted-foreground">{zone.code}</div>
                    <div className="mt-1 text-xs font-semibold text-emerald-600">
                      {zone.activeDrivers} active drivers
                    </div>
                  </div>
                </Popup>
              </LeafletPolygon>
            );
          })}
        </MapContainer>
      )}

      {/* Floating Selected Zone Inspector Panel */}
      {activeZone && (
        <div className="absolute bottom-4 left-4 z-[1000] w-[340px] rounded-2xl border bg-card/95 p-4 shadow-elegant backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {activeZone.code}
              </div>
              <div className="text-base font-bold text-foreground">{activeZone.name}</div>
            </div>
            <StatusBadge
              tone={
                activeZone.status === "High Demand"
                  ? "warning"
                  : activeZone.status === "Congested"
                  ? "destructive"
                  : "success"
              }
              label={activeZone.status}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-2.5 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Riders</div>
              <div className="text-sm font-bold text-foreground">{activeZone.activeDrivers}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Trips</div>
              <div className="text-sm font-bold text-info">{activeZone.activeTrips}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Base Fare</div>
              <div className="text-sm font-bold text-foreground">${activeZone.baseFare.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-2.5 border-t pt-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Coverage: </span>
            {activeZone.suburbs.join(", ")}
          </div>
        </div>
      )}

      {/* Floating Engine Badge */}
      <div className="absolute right-4 top-4 z-[1000] flex items-center gap-1.5 rounded-xl border bg-card/95 px-3 py-1.5 text-xs font-bold shadow-card backdrop-blur">
        <span
          className={`h-2 w-2 rounded-full ${
            useGoogle ? "bg-primary animate-pulse" : "bg-emerald-500"
          }`}
        />
        <span>{useGoogle ? "Google Maps Zone API" : "OpenStreetMap Zones"}</span>
      </div>
    </div>
  );
}

export default ZonePolygonMap;
