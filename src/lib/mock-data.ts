// Realistic HexiDrop mock data for the admin panel.
export const ZW_CITIES = [
  "Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Kwekwe",
  "Kadoma", "Masvingo", "Chinhoyi", "Marondera", "Victoria Falls", "Bindura",
];

export const CUSTOMER_NAMES = [
  "Tafadzwa Moyo", "Chipo Ncube", "Tinashe Chikafu", "Rutendo Sibanda",
  "Farai Mukamuri", "Nyasha Dube", "Kudzai Mhlanga", "Tendai Mangoma",
  "Rufaro Chirwa", "Panashe Mavhunga", "Simba Zhou", "Anesu Mabhena",
  "Blessing Ngwenya", "Vimbai Chatora", "Munashe Mpofu", "Tapiwa Marufu",
];

export const DRIVER_NAMES = [
  "Tawanda Marange", "Blessed Zimuto", "Prosper Manyika", "Tichaona Sithole",
  "Munyaradzi Gumbo", "Farai Mudede", "Takudzwa Nyoni", "Godfrey Chirenje",
  "Wellington Musiyiwa", "Learnmore Chibaya", "Prince Katsande", "Isheanesu Muzenda",
];

export const MOVER_TEAMS = [
  "Team Nyati", "Team Baobab", "Team Zambezi", "Team Nyanga",
  "Team Hwange", "Team Kariba", "Team Chinhoyi", "Team Great Zim",
];

export const VEHICLES = [
  { type: "Courier Bike", plate: "ADK-2145", capacity: "10 kg" },
  { type: "Bike", plate: "AEP-9820", capacity: "15 kg" },
  { type: "Mini Van", plate: "ACM-3390", capacity: "500 kg" },
  { type: "Pickup", plate: "ABX-7712", capacity: "1.2 t" },
  { type: "Truck", plate: "ADT-1105", capacity: "3.5 t" },
  { type: "Large Truck", plate: "AFR-4488", capacity: "7 t" },
];

const STATUSES = ["Completed", "In Transit", "Pending", "Assigned", "Cancelled"] as const;
export type OrderStatus = typeof STATUSES[number];

function pick<T>(arr: readonly T[], i: number) { return arr[i % arr.length]; }
function seedFloat(i: number, min: number, max: number) {
  const v = Math.abs(Math.sin(i * 9301 + 49297)) % 1;
  return +(min + v * (max - min)).toFixed(2);
}

export type Order = {
  id: string;
  customer: string;
  driver: string;
  vehicle: string;
  city: string;
  pickup: string;
  drop: string;
  pickupCoords?: { lat: number; lng: number };
  dropCoords?: { lat: number; lng: number };
  driverCoords?: { lat: number; lng: number };
  status: OrderStatus;
  fare: number;
  distance: number;
  eta: string;
  createdAt: string;
  payment: "Cash" | "Card" | "Wallet" | "EcoCash";
};

const SUBURB_KEYS = [
  "Borrowdale", "Avondale", "Eastlea", "Mount Pleasant", "Belvedere",
  "Southerton", "Highlands", "Newlands", "Harare CBD", "Msasa",
  "Waterfalls", "Hatfield", "Greendale", "Marlborough", "Workington",
];

const SUBURB_COORDS: Record<string, { lat: number; lng: number }> = {
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
  "Workington": { lat: -17.8480, lng: 31.0180 },
};

export const ORDERS: Order[] = Array.from({ length: 42 }).map((_, i) => {
  const status = pick(STATUSES, i + (i % 3));
  const city = pick(ZW_CITIES, i);
  const pSub = SUBURB_KEYS[i % SUBURB_KEYS.length];
  const dSub = SUBURB_KEYS[(i + 4) % SUBURB_KEYS.length];
  const pCoord = SUBURB_COORDS[pSub] || { lat: -17.825, lng: 31.053 };
  const dCoord = SUBURB_COORDS[dSub] || { lat: -17.795, lng: 31.040 };
  const midLat = +((pCoord.lat + dCoord.lat) / 2 + (seedFloat(i, -0.005, 0.005))).toFixed(5);
  const midLng = +((pCoord.lng + dCoord.lng) / 2 + (seedFloat(i + 1, -0.005, 0.005))).toFixed(5);

  return {
    id: `HXD-${(48213 + i).toString()}`,
    customer: pick(CUSTOMER_NAMES, i + 2),
    driver: pick(DRIVER_NAMES, i + 1),
    vehicle: pick(VEHICLES, i).type,
    city,
    pickup: `${pSub}, ${city}`,
    drop: `${dSub}, ${city}`,
    pickupCoords: { lat: pCoord.lat, lng: pCoord.lng },
    dropCoords: { lat: dCoord.lat, lng: dCoord.lng },
    driverCoords: { lat: midLat, lng: midLng },
    status,
    fare: +seedFloat(i, 6, 380).toFixed(2),
    distance: +seedFloat(i + 7, 1.2, 42).toFixed(1),
    eta: `${8 + (i % 40)} min`,
    createdAt: `2026-07-${((i % 14) + 1).toString().padStart(2, "0")} ${(6 + (i % 14)).toString().padStart(2, "0")}:${((i * 7) % 60).toString().padStart(2, "0")}`,
    payment: (["Cash", "Card", "Wallet", "EcoCash"] as const)[i % 4],
  };
});

export const REVENUE_SERIES = Array.from({ length: 14 }).map((_, i) => ({
  day: `Jul ${i + 1}`,
  revenue: Math.round(seedFloat(i, 4200, 12800)),
  orders: Math.round(seedFloat(i + 3, 180, 520)),
  moving: Math.round(seedFloat(i + 9, 12, 68)),
}));

export const VEHICLE_DISTRIBUTION = [
  { name: "Courier Bike", value: 38 },
  { name: "Mini Van", value: 26 },
  { name: "Pickup", value: 18 },
  { name: "Truck", value: 12 },
  { name: "Large Truck", value: 6 },
];

export const TOP_CITIES = ZW_CITIES.slice(0, 6).map((c, i) => ({
  city: c,
  orders: Math.round(seedFloat(i, 420, 3200)),
  revenue: Math.round(seedFloat(i + 4, 8400, 42000)),
}));

export type Driver = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  vehicle: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  plate: string;
  rating: number;
  trips: number;
  earnings: number;
  status: "Online" | "On Trip" | "Offline";
  verified: boolean;
  lat: number;
  lng: number;
  currentSuburb: string;
  avatar?: string;
  driverPhoto?: string;
  nationalId?: string;
  nationalIdPhoto?: string;
  licenseNumber?: string;
  licenseClass?: string;
  licensePhoto?: string;
  ztsaCertificatePhoto?: string;
  policeClearancePhoto?: string;
  vehiclePhoto?: string;
  joinedDate?: string;
  acceptanceRate?: number;
  completionRate?: number;
  onTimeRate?: number;
  ecoCashNumber?: string;
  bankName?: string;
  bankAccount?: string;
  emergencyContact?: { name: string; relation: string; phone: string };
};

const DRIVER_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1534751516642-a1714f3b7d15?w=400&h=400&fit=crop&crop=faces&q=85",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop&crop=faces&q=85",
];

const VEHICLE_MODELS: Record<string, { model: string; color: string; year: string; image: string }> = {
  "Courier Bike": { model: "Yamaha YBR 125 Custom", color: "Hexidrop Navy", year: "2023", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80" },
  "Bike": { model: "Honda Ace 125 Delivery", color: "Crimson / Black", year: "2022", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80" },
  "Mini Van": { model: "Nissan NV200 Cargo Van", color: "Frost White", year: "2021", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80" },
  "Pickup": { model: "Toyota Hilux 2.4 GD-6 Single Cab", color: "Silver Metallic", year: "2023", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=80" },
  "Truck": { model: "Isuzu NPR 400 Dropside 4-Ton", color: "Pure White", year: "2022", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80" },
  "Large Truck": { model: "Mercedes-Benz Atego 1518 8-Ton Box", color: "Midnight Blue", year: "2020", image: "https://images.unsplash.com/photo-1586191582152-ee99a7fd552f?w=500&auto=format&fit=crop&q=80" },
};

export const DRIVERS: Driver[] = Array.from({ length: 24 }).map((_, i) => {
  const sub = SUBURB_KEYS[i % SUBURB_KEYS.length];
  const base = SUBURB_COORDS[sub] || { lat: -17.825, lng: 31.053 };
  const lat = +(base.lat + seedFloat(i * 3, -0.012, 0.012)).toFixed(5);
  const lng = +(base.lng + seedFloat(i * 3 + 1, -0.012, 0.012)).toFixed(5);
  const name = pick(DRIVER_NAMES, i);
  const vehObj = pick(VEHICLES, i);
  const vMeta = VEHICLE_MODELS[vehObj.type] || VEHICLE_MODELS["Courier Bike"];
  const avatarUrl = DRIVER_AVATARS[i % DRIVER_AVATARS.length];

  return {
    id: `DRV-${1024 + i}`,
    name,
    phone: `+263 77${(2000000 + i * 1337).toString().slice(0, 7)}`,
    email: `${name.toLowerCase().replace(" ", ".")}@hexidrop.co.zw`,
    city: "Harare",
    address: `${12 + (i * 3) % 45} ${sub} Drive, ${sub}, Harare`,
    vehicle: vehObj.type,
    vehicleType: vehObj.type,
    vehicleModel: vMeta.model,
    vehicleYear: vMeta.year,
    vehicleColor: vMeta.color,
    plate: vehObj.plate,
    rating: +(4 + seedFloat(i, 0, 0.99)).toFixed(2),
    trips: Math.round(seedFloat(i + 2, 80, 1240)),
    earnings: Math.round(seedFloat(i + 5, 320, 4800)),
    status: (["Online", "On Trip", "Offline", "Online", "On Trip"] as const)[i % 5],
    verified: i % 6 !== 0,
    lat,
    lng,
    currentSuburb: sub,
    avatar: avatarUrl,
    driverPhoto: avatarUrl,
    nationalId: `63-${(280000 + i * 491).toString().slice(0, 6)}-K-${40 + (i % 10)}`,
    nationalIdPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    licenseNumber: `ZW-DL-${(880000 + i * 312).toString().slice(0, 6)}-${i % 2 === 0 ? "B" : "C"}`,
    licenseClass: vehObj.type.includes("Truck") ? "Class 2 (Commercial Heavy)" : "Class 4 (Light Delivery)",
    licensePhoto: "https://images.unsplash.com/photo-1554415707-9e44667014f8?w=600&auto=format&fit=crop&q=80",
    ztsaCertificatePhoto: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    policeClearancePhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    vehiclePhoto: vMeta.image,
    joinedDate: `${((i % 28) + 1).toString().padStart(2, "0")} ${( ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const )[i % 12]} 2024`,
    acceptanceRate: +(94 + seedFloat(i, 0, 5.8)).toFixed(1),
    completionRate: +(97 + seedFloat(i + 1, 0, 2.9)).toFixed(1),
    onTimeRate: +(95 + seedFloat(i + 2, 0, 4.8)).toFixed(1),
    ecoCashNumber: `+263 77${(2000000 + i * 1337).toString().slice(0, 7)}`,
    bankName: i % 2 === 0 ? "Stanbic Bank Zimbabwe" : "CABS Bank",
    bankAccount: `100-${(482910 + i * 11).toString().slice(0, 6)}-01`,
    emergencyContact: {
      name: `Grace ${name.split(" ")[1] || "Moyo"}`,
      relation: "Next of Kin / Spouse",
      phone: `+263 77${(9120000 + i * 543).toString().slice(0, 7)}`,
    },
  };
});

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  orders: number;
  spend: number;
  wallet: number;
  type: "Personal" | "Business";
  joined: string;
};

export const CUSTOMERS: Customer[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `CUS-${5210 + i}`,
  name: pick(CUSTOMER_NAMES, i),
  phone: `+263 71${(3000000 + i * 3221).toString().slice(0, 7)}`,
  email: pick(CUSTOMER_NAMES, i).toLowerCase().replace(" ", ".") + "@mail.co.zw",
  city: pick(ZW_CITIES, i + 2),
  orders: Math.round(seedFloat(i, 3, 148)),
  spend: Math.round(seedFloat(i + 3, 120, 8800)),
  wallet: +seedFloat(i + 6, 0, 260).toFixed(2),
  type: i % 5 === 0 ? "Business" : "Personal",
  joined: `2025-${((i % 12) + 1).toString().padStart(2, "0")}-${((i % 27) + 1).toString().padStart(2, "0")}`,
}));

export type MovingJob = {
  id: string;
  customer: string;
  team: string;
  type: "House Move" | "Office Relocation" | "Furniture" | "Heavy Item";
  from: string;
  to: string;
  crew: number;
  price: number;
  status: "Scheduled" | "In Progress" | "Packing" | "Delivered" | "Confirmed";
  date: string;
};

export const MOVING_JOBS: MovingJob[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `MOV-${882 + i}`,
  customer: pick(CUSTOMER_NAMES, i + 4),
  team: pick(MOVER_TEAMS, i),
  type: (["House Move", "Office Relocation", "Furniture", "Heavy Item"] as const)[i % 4],
  from: `${pick(["Borrowdale", "Mount Pleasant", "Avondale", "Chisipite"], i)}, ${pick(ZW_CITIES, i)}`,
  to: `${pick(["Msasa", "Waterfalls", "Greendale", "Marlborough"], i + 1)}, ${pick(ZW_CITIES, i + 2)}`,
  crew: 2 + (i % 5),
  price: Math.round(seedFloat(i + 1, 180, 2400)),
  status: (["Scheduled", "In Progress", "Packing", "Delivered", "Confirmed"] as const)[i % 5],
  date: `2026-07-${((i % 20) + 1).toString().padStart(2, "0")}`,
}));

export type Payment = {
  id: string;
  order: string;
  customer: string;
  method: "Cash" | "Card" | "Wallet" | "EcoCash" | "OneMoney";
  amount: number;
  status: "Success" | "Pending" | "Refunded" | "Failed";
  time: string;
};

export const PAYMENTS: Payment[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `PAY-${77120 + i}`,
  order: `HXD-${48213 + i}`,
  customer: pick(CUSTOMER_NAMES, i),
  method: (["Cash", "Card", "Wallet", "EcoCash", "OneMoney"] as const)[i % 5],
  amount: +seedFloat(i, 6, 380).toFixed(2),
  status: (["Success", "Success", "Pending", "Refunded", "Success", "Failed"] as const)[i % 6],
  time: `2026-07-14 ${(9 + (i % 12)).toString().padStart(2, "0")}:${((i * 11) % 60).toString().padStart(2, "0")}`,
}));

export const NOTIFICATIONS = [
  { id: 1, title: "New business account request", body: "Zimplats Ltd requested corporate onboarding.", time: "2m ago", type: "info" },
  { id: 2, title: "Driver payout ready", body: "12 drivers pending weekly payout of $4,820.", time: "18m ago", type: "warning" },
  { id: 3, title: "Order HXD-48237 cancelled", body: "Customer cancelled after 4 min. Refund issued.", time: "1h ago", type: "destructive" },
  { id: 4, title: "Moving job MOV-892 completed", body: "Team Baobab delivered 3-bedroom relocation in Borrowdale.", time: "3h ago", type: "success" },
];
