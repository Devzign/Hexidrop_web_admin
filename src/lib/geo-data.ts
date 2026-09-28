// Geographic coordinates and operational polygons for Zimbabwe / Harare delivery zones
export interface LatLng {
  lat: number;
  lng: number;
}

export interface OperationalZone {
  id: string;
  name: string;
  code: string;
  color: string;
  strokeColor: string;
  center: LatLng;
  bounds: [number, number][]; // [lat, lng] pairs for Leaflet and Google Maps Polygons
  suburbs: string[];
  activeDrivers: number;
  activeTrips: number;
  baseFare: number;
  status: "Active" | "High Demand" | "Congested" | "Normal";
}

export const HARARE_CENTER: LatLng = {
  lat: -17.824858,
  lng: 31.053028,
};

export const HARARE_SUBURBS: Record<string, LatLng> = {
  "Borrowdale": { lat: -17.7554, lng: 31.0852 },
  "Avondale": { lat: -17.7951, lng: 31.0402 },
  "Eastlea": { lat: -17.8252, lng: 31.0801 },
  "Mount Pleasant": { lat: -17.7782, lng: 31.0451 },
  "Belvedere": { lat: -17.8285, lng: 31.0205 },
  "Southerton": { lat: -17.8601, lng: 31.0202 },
  "Highlands": { lat: -17.7981, lng: 31.0954 },
  "Newlands": { lat: -17.8102, lng: 31.0753 },
  "Harare CBD": { lat: -17.8292, lng: 31.0522 },
  "Msasa": { lat: -17.8420, lng: 31.1210 },
  "Waterfalls": { lat: -17.8920, lng: 31.0410 },
  "Hatfield": { lat: -17.8760, lng: 31.0820 },
  "Greendale": { lat: -17.8190, lng: 31.1150 },
  "Marlborough": { lat: -17.7490, lng: 31.0020 },
  "Highfield": { lat: -17.8820, lng: 30.9890 },
  "Workington": { lat: -17.8480, lng: 31.0180 },
  "Pomona": { lat: -17.7380, lng: 31.1020 },
  "Chisipite": { lat: -17.7740, lng: 31.1180 },
  "Milton Park": { lat: -17.8130, lng: 31.0280 },
  "Graniteside": { lat: -17.8520, lng: 31.0610 },
};

export const HARARE_ZONES: OperationalZone[] = [
  {
    id: "zone-north",
    name: "Northern Suburbs",
    code: "HRE-Z1",
    color: "rgba(16, 185, 129, 0.22)",
    strokeColor: "#10b981",
    center: { lat: -17.750, lng: 31.090 },
    bounds: [
      [-17.720, 31.055],
      [-17.720, 31.135],
      [-17.775, 31.135],
      [-17.785, 31.055],
    ],
    suburbs: ["Borrowdale", "Pomona", "Helensvale", "Chisipite", "Borrowdale Brooke"],
    activeDrivers: 28,
    activeTrips: 11,
    baseFare: 4.5,
    status: "High Demand",
  },
  {
    id: "zone-central",
    name: "Harare CBD & Avenues",
    code: "HRE-Z2",
    color: "rgba(2, 132, 199, 0.22)",
    strokeColor: "#0284c7",
    center: { lat: -17.828, lng: 31.052 },
    bounds: [
      [-17.810, 31.032],
      [-17.810, 31.074],
      [-17.845, 31.074],
      [-17.845, 31.032],
    ],
    suburbs: ["Harare CBD", "The Avenues", "Milton Park", "Belgravia"],
    activeDrivers: 42,
    activeTrips: 19,
    baseFare: 3.0,
    status: "Congested",
  },
  {
    id: "zone-northwest",
    name: "Avondale & Mount Pleasant",
    code: "HRE-Z3",
    color: "rgba(139, 92, 246, 0.22)",
    strokeColor: "#8b5cf6",
    center: { lat: -17.785, lng: 31.035 },
    bounds: [
      [-17.755, 31.005],
      [-17.755, 31.055],
      [-17.810, 31.055],
      [-17.810, 31.005],
    ],
    suburbs: ["Avondale", "Mount Pleasant", "Marlborough", "Emerald Hill"],
    activeDrivers: 31,
    activeTrips: 12,
    baseFare: 3.5,
    status: "Active",
  },
  {
    id: "zone-east",
    name: "Eastern Commercial Corridor",
    code: "HRE-Z4",
    color: "rgba(245, 158, 11, 0.22)",
    strokeColor: "#f59e0b",
    center: { lat: -17.820, lng: 31.100 },
    bounds: [
      [-17.785, 31.074],
      [-17.785, 31.140],
      [-17.845, 31.140],
      [-17.845, 31.074],
    ],
    suburbs: ["Eastlea", "Newlands", "Highlands", "Greendale", "Msasa"],
    activeDrivers: 26,
    activeTrips: 9,
    baseFare: 4.0,
    status: "Active",
  },
  {
    id: "zone-west-industrial",
    name: "Industrial & Logistics Park",
    code: "HRE-Z5",
    color: "rgba(236, 72, 153, 0.22)",
    strokeColor: "#ec4899",
    center: { lat: -17.855, lng: 31.015 },
    bounds: [
      [-17.835, 30.985],
      [-17.835, 31.032],
      [-17.880, 31.032],
      [-17.880, 30.985],
    ],
    suburbs: ["Workington", "Southerton", "Belvedere", "Lochinvar"],
    activeDrivers: 19,
    activeTrips: 7,
    baseFare: 5.0,
    status: "Active",
  },
  {
    id: "zone-south",
    name: "Southern Suburbs & Airport",
    code: "HRE-Z6",
    color: "rgba(6, 182, 212, 0.22)",
    strokeColor: "#06b6d4",
    center: { lat: -17.885, lng: 31.070 },
    bounds: [
      [-17.850, 31.032],
      [-17.850, 31.120],
      [-17.920, 31.120],
      [-17.920, 31.032],
    ],
    suburbs: ["Waterfalls", "Hatfield", "Highfield", "RGM Airport Corridor"],
    activeDrivers: 17,
    activeTrips: 6,
    baseFare: 6.0,
    status: "Normal",
  },
];
