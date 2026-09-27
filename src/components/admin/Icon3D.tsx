import { cn } from "@/lib/utils";

// Real high-resolution transparent 3D PNG assets
import dashboard from "@/assets/3d/dashboard-3d.png";
import liveTracking from "@/assets/3d/radar-3d.png";
import orders from "@/assets/3d/icon-parcel-3d-clean.png";
import movers from "@/assets/3d/icon-movers-3d-clean.png";
import drivers from "@/assets/3d/driver-avatar-3d.png";
import customers from "@/assets/3d/driver-avatar-3d.png";
import vehicles from "@/assets/3d/icon-summary-van.png";
import fleet from "@/assets/vehicle-large-truck.png";
import cargo from "@/assets/3d/icon-packing-3d.png";
import business from "@/assets/3d/icon-office-3d.png";
import pricing from "@/assets/3d/icon-summary-tag.png";
import cities from "@/assets/3d/icon-home-3d.png";
import coupons from "@/assets/3d/icon-star-3d.png";
import payments from "@/assets/3d/icon-card-3d.png";
import wallet from "@/assets/3d/icon-wallet-3d.png";
import payouts from "@/assets/3d/icon-cash-3d.png";
import reports from "@/assets/3d/icon-reports-3d.png";
import cms from "@/assets/3d/icon-parcel-docs.png";
import notifications from "@/assets/3d/icon-alert-3d.png";
import support from "@/assets/3d/icon-lifebuoy-3d.png";
import roles from "@/assets/3d/icon-shield-3d.png";
import settings from "@/assets/3d/icon-tools-3d.png";
import auditLogs from "@/assets/3d/icon-calendar-3d.png";
import profile from "@/assets/3d/driver-avatar-3d.png";
import revenue from "@/assets/3d/gold-coin-3d.png";
import signal from "@/assets/3d/radar-3d.png";
import check from "@/assets/3d/icon-check-3d.png";
import cancelled from "@/assets/3d/icon-cancelled-3d.png";

export const ICONS_3D = {
  dashboard,
  "live-tracking": liveTracking,
  orders,
  movers,
  drivers,
  customers,
  vehicles,
  fleet,
  cargo,
  business,
  pricing,
  cities,
  coupons,
  payments,
  wallet,
  payouts,
  reports,
  cms,
  notifications,
  support,
  roles,
  settings,
  "audit-logs": auditLogs,
  profile,
  revenue,
  signal,
  check,
  cancelled,
} as const;

export type Icon3DName = keyof typeof ICONS_3D;

export function Icon3D({
  name,
  className,
  alt = "",
}: {
  name: Icon3DName;
  className?: string;
  alt?: string;
}) {
  const src = ICONS_3D[name] || dashboard;

  return (
    <img
      src={src}
      alt={alt || name}
      loading="lazy"
      width={64}
      height={64}
      draggable={false}
      className={cn(
        "h-6 w-6 shrink-0 select-none object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] transition-transform duration-200 group-hover:scale-110",
        className,
      )}
    />
  );
}

export default Icon3D;
