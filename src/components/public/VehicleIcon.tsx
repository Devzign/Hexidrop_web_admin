import { Bike, Car, Truck, Package, Users } from "lucide-react";
import scooterImg from "@/assets/vehicle-scooter.png";
import bikeImg from "@/assets/vehicle-bike.png";
import vanImg from "@/assets/vehicle-van.png";
import pickupImg from "@/assets/vehicle-pickup.png";
import miniTruckImg from "@/assets/vehicle-mini-truck.png";
import largeTruckImg from "@/assets/vehicle-large-truck.png";
import moversTeamImg from "@/assets/movers-team-truck.jpg";

export type VehicleId =
  | "scooter"
  | "bike"
  | "van"
  | "pickup"
  | "mini-truck"
  | "large-truck"
  | "movers-team";

export interface Vehicle {
  id: VehicleId;
  name: string;
  capacity: string;
  eta: string;
  fare: number;
  tag?: string;
  image: string;
}

export const VEHICLES: Vehicle[] = [
  { id: "scooter", name: "Courier Bike", capacity: "Up to 10 kg", eta: "3 min", fare: 3.5, tag: "Fastest", image: scooterImg },
  { id: "bike", name: "Bike", capacity: "Up to 20 kg", eta: "4 min", fare: 4.5, tag: "Popular", image: bikeImg },
  { id: "van", name: "Mini Van", capacity: "Up to 350 kg", eta: "6 min", fare: 12.9, image: vanImg },
  { id: "pickup", name: "Pickup", capacity: "Up to 750 kg", eta: "8 min", fare: 18.5, image: pickupImg },
  { id: "mini-truck", name: "Mini Truck", capacity: "Up to 1.5 T", eta: "12 min", fare: 26.0, image: miniTruckImg },
  { id: "large-truck", name: "Large Truck", capacity: "Up to 3 T", eta: "18 min", fare: 42.0, tag: "Heavy Cargo", image: largeTruckImg },
];

export const VEHICLE_IMAGES: Record<string, string> = {
  scooter: scooterImg,
  "courier-bike": scooterImg,
  bike: bikeImg,
  van: vanImg,
  "mini-van": vanImg,
  pickup: pickupImg,
  "mini-truck": miniTruckImg,
  truck: miniTruckImg,
  "large-truck": largeTruckImg,
  "movers-team": moversTeamImg,
};

export function getVehicleImage(typeOrId: string = ""): string {
  const lower = typeOrId.toLowerCase().trim();
  if (lower.includes("courier") || lower.includes("scooter")) return scooterImg;
  if (lower.includes("large") || lower.includes("heavy") || lower.includes("7 t") || lower.includes("7t")) return largeTruckImg;
  if (lower.includes("mini truck") || lower.includes("truck") || lower.includes("3.5") || lower.includes("1.5")) return miniTruckImg;
  if (lower.includes("pickup") || lower.includes("1.2")) return pickupImg;
  if (lower.includes("van") || lower.includes("500 kg")) return vanImg;
  if (lower.includes("bike") || lower.includes("motorcycle")) return bikeImg;
  if (lower.includes("mover") || lower.includes("team")) return moversTeamImg;
  return vanImg;
}

export function VehicleImage({
  id,
  className = "h-14 w-14",
}: {
  id: VehicleId;
  className?: string;
}) {
  const isPhoto = id === "movers-team";
  const src = VEHICLE_IMAGES[id] ?? vanImg;
  return (
    <img
      src={src}
      alt={id}
      loading="lazy"
      className={
        className +
        (isPhoto
          ? " object-cover rounded-xl shadow-[0_6px_10px_rgba(20,60,30,0.18)]"
          : " object-contain drop-shadow-[0_6px_10px_rgba(20,60,30,0.18)]")
      }
    />
  );
}

export function VehicleThumb({
  type,
  className = "h-9 w-12",
  imgClassName = "h-full w-full object-contain",
}: {
  type: string;
  className?: string;
  imgClassName?: string;
}) {
  const src = getVehicleImage(type);
  const isPhoto = type.toLowerCase().includes("mover");
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={src}
        alt={type}
        loading="lazy"
        className={`${imgClassName} ${
          isPhoto ? "rounded-md object-cover" : "object-contain"
        } drop-shadow-[0_2px_5px_rgba(0,0,0,0.12)]`}
      />
    </div>
  );
}

export function VehicleIcon({
  id,
  className = "h-8 w-8",
}: {
  id: VehicleId;
  className?: string;
}) {
  switch (id) {
    case "scooter":
    case "bike":
      return <Bike className={className} />;
    case "van":
      return <Car className={className} />;
    case "movers-team":
      return <Users className={className} />;
    case "pickup":
    case "mini-truck":
    case "large-truck":
      return <Truck className={className} />;
    default:
      return <Package className={className} />;
  }
}
