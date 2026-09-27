import { Bike, Car, Truck, Package, Users } from "lucide-react";
import bikeImg from "@/assets/vehicle-bike.png";
import vanImg from "@/assets/vehicle-van.png";
import pickupImg from "@/assets/vehicle-pickup.png";
import miniTruckImg from "@/assets/vehicle-mini-truck.png";
import largeTruckImg from "@/assets/vehicle-large-truck.png";
import moversTeamImg from "@/assets/movers-team-truck.jpg";

export type VehicleId =
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
  { id: "bike", name: "Bike", capacity: "Up to 20 kg", eta: "3 min", fare: 4.5, tag: "Fastest", image: bikeImg },
  { id: "van", name: "Mini Van", capacity: "Up to 350 kg", eta: "6 min", fare: 12.9, image: vanImg },
  { id: "pickup", name: "Pickup", capacity: "Up to 750 kg", eta: "8 min", fare: 18.5, image: pickupImg },
  { id: "mini-truck", name: "Mini Truck", capacity: "Up to 1.5 T", eta: "12 min", fare: 26.0, image: miniTruckImg },
  { id: "large-truck", name: "Large Truck", capacity: "Up to 3 T", eta: "18 min", fare: 42.0, tag: "Best value", image: largeTruckImg },
];

const IMAGES: Record<VehicleId, string> = {
  bike: bikeImg,
  van: vanImg,
  pickup: pickupImg,
  "mini-truck": miniTruckImg,
  "large-truck": largeTruckImg,
  "movers-team": moversTeamImg,
};

export function VehicleImage({
  id,
  className = "h-14 w-14",
}: {
  id: VehicleId;
  className?: string;
}) {
  const isPhoto = id === "movers-team";
  return (
    <img
      src={IMAGES[id]}
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

export function VehicleIcon({
  id,
  className = "h-8 w-8",
}: {
  id: VehicleId;
  className?: string;
}) {
  switch (id) {
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
