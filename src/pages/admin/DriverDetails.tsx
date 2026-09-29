import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDriver, type Driver } from "@/lib/driver-store";
import { ORDERS, DRIVER_NAMES } from "@/lib/mock-data";
import { RealMap } from "@/components/maps/RealMap";
import { useMapConfig } from "@/hooks/use-map-config";
import { StatusBadge, OrderStatusBadge } from "@/components/admin/StatusBadge";
import { PhotoCaptureModal, type PhotoTarget } from "@/components/admin/PhotoCaptureModal";
import { RecordEditor, type FieldDef } from "@/components/admin/RecordEditor";
import {
  ArrowLeft,
  Camera,
  Phone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Truck,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Check,
  ExternalLink,
  Shield,
  Activity,
  Clock,
  CreditCard,
  Sparkles,
  Upload,
  Maximize2,
  Eye,
  User,
  Share2,
  Edit,
  Car,
} from "lucide-react";
import { toast } from "sonner";

const DRIVER_EDIT_FIELDS: FieldDef<Driver>[] = [
  { name: "name", label: "Full Name" },
  { name: "phone", label: "Phone Number" },
  { name: "email", label: "Email Address" },
  { name: "city", label: "Operational City" },
  { name: "address", label: "Residential Address" },
  { name: "vehicle", label: "Vehicle Category" },
  { name: "vehicleModel", label: "Vehicle Model" },
  { name: "plate", label: "License Plate" },
  { name: "status", label: "Status", type: "select", options: ["Online", "On Trip", "Offline"] },
  { name: "nationalId", label: "National ID Number" },
  { name: "licenseNumber", label: "Driver License Number" },
  { name: "licenseClass", label: "License Class" },
  { name: "ecoCashNumber", label: "EcoCash Payout Number" },
  { name: "verified", label: "KYC Verified", type: "switch" },
];

export function DriverDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapConfig = useMapConfig();
  const { driver, savePhoto, toggleKyc, update } = useDriver(id);

  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "vehicle" | "earnings" | "activity">("overview");
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState<PhotoTarget>("avatar");
  const [editing, setEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!driver) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Driver Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The driver with ID <span className="font-mono font-semibold">{id}</span> does not exist or has been removed.
        </p>
        <Link
          to="/admin/drivers"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Drivers Fleet
        </Link>
      </div>
    );
  }

  // Filter recent orders for this driver
  const recentOrders = ORDERS.slice(0, 6);

  const handleOpenPhotoModal = (target: PhotoTarget) => {
    setPhotoTarget(target);
    setPhotoModalOpen(true);
  };

  const handleCapturePhoto = (dataUrl: string) => {
    savePhoto(photoTarget, dataUrl);
  };

  const driverPhoto = driver.avatar || driver.driverPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=85";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/drivers")}
            className="group flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition shadow-sm"
            title="Back to all drivers"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Link to="/admin/drivers" className="hover:text-foreground transition">
                Drivers Fleet
              </Link>
              <span>/</span>
              <span className="font-mono text-primary font-bold">{driver.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 mt-0.5">
              <span>{driver.name}</span>
              {driver.verified && (
                <span title="KYC Verified Driver" className="text-emerald-500">
                  <ShieldCheck className="h-5 w-5 fill-emerald-500/20" />
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Take Photo Button - Prominent Action */}
          <button
            onClick={() => handleOpenPhotoModal("avatar")}
            className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-3.5 text-xs font-semibold text-white shadow-card hover:brightness-105 transition"
          >
            <Camera className="h-4 w-4" />
            <span>Take Driver Photo</span>
          </button>

          {/* Call Driver */}
          <a
            href={`tel:${driver.phone}`}
            className="flex h-9 items-center gap-2 rounded-xl border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent transition shadow-sm"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Call</span>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 items-center gap-2 rounded-xl border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent transition shadow-sm"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* KYC Toggle */}
          <button
            onClick={toggleKyc}
            className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition shadow-sm ${
              driver.verified
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{driver.verified ? "KYC Approved" : "Approve KYC"}</span>
          </button>

          {/* Edit Driver Details */}
          <button
            onClick={() => setEditing(true)}
            className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-xs font-semibold text-foreground hover:bg-accent transition shadow-sm"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Driver Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Avatar + Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Driver Photo with interactive capture trigger */}
            <div className="relative group cursor-pointer" onClick={() => handleOpenPhotoModal("avatar")}>
              <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border-2 border-primary/40 bg-slate-100 shadow-md">
                <img
                  src={driverPhoto}
                  alt={driver.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-2">
                <Camera className="h-5 w-5 mb-1 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Take Photo</span>
              </div>

              {/* Status Dot */}
              <span
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card ${
                  driver.status === "Online"
                    ? "bg-emerald-500"
                    : driver.status === "On Trip"
                    ? "bg-blue-500"
                    : "bg-slate-400"
                }`}
                title={`Status: ${driver.status}`}
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{driver.name}</h2>
                <OrderStatusBadge status={driver.status} />
                {driver.verified ? (
                  <StatusBadge tone="success" label="KYC Verified" />
                ) : (
                  <StatusBadge tone="warning" label="KYC Pending" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="font-mono font-medium">{driver.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  {driver.currentSuburb}, {driver.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {driver.rating}
                  <span className="font-normal text-muted-foreground">({driver.trips} trips)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {driver.joinedDate || "2024"}
                </span>
              </div>

              {/* Vehicle tag */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/80 px-2.5 py-1 font-medium text-foreground">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  {driver.vehicleModel || driver.vehicle}
                </span>
                <span className="font-mono font-bold text-muted-foreground text-xs">
                  {driver.plate}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Performance KPI Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
            <div className="rounded-xl bg-secondary/50 p-3 text-center sm:text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completed Trips</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-foreground">{driver.trips.toLocaleString()}</div>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Top 5% in Harare</div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-3 text-center sm:text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gross Earnings</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-foreground">${driver.earnings.toLocaleString()}</div>
              <div className="text-[11px] font-medium text-muted-foreground">EcoCash Payouts</div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-3 text-center sm:text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Acceptance Rate</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {driver.acceptanceRate || 97.4}%
              </div>
              <div className="text-[11px] font-medium text-muted-foreground">Target &gt; 90%</div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-3 text-center sm:text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completion Rate</div>
              <div className="mt-1 text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {driver.completionRate || 99.1}%
              </div>
              <div className="text-[11px] font-medium text-muted-foreground">Very reliable</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex border-b -mb-6 -mx-6 px-6 overflow-x-auto bg-muted/20">
          {[
            { key: "overview", label: "Overview & Live GPS", icon: MapPin },
            { key: "kyc", label: "Driver Photos & KYC Documents", icon: ShieldCheck, badge: !driver.verified ? "Pending" : undefined },
            { key: "vehicle", label: "Vehicle & Safety Gear", icon: Truck },
            { key: "earnings", label: "Earnings & Payouts", icon: DollarSign },
            { key: "activity", label: "Activity Timeline", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition whitespace-nowrap ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & LIVE TRACKING */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Live GPS Map & Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live GPS Card */}
            <div className="rounded-2xl border bg-card overflow-hidden shadow-card">
              <div className="flex items-center justify-between border-b px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-foreground">Live Telemetry & Location</h3>
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {driver.currentSuburb}, {driver.city}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Speed: <strong className="text-foreground">24 km/h</strong></span>
                  <span>•</span>
                  <span>Ping: <strong className="text-emerald-600">8s ago</strong></span>
                </div>
              </div>

              {/* Embedded RealMap for Harare */}
              <div className="relative h-[340px] w-full bg-slate-900 isolate overflow-hidden">
                <RealMap
                  config={mapConfig}
                  center={{ lat: driver.lat, lng: driver.lng }}
                  zoom={15}
                  className="h-full w-full"
                  drivers={[driver]}
                  selectedDriver={driver}
                  showSelectedCard={false}
                  showControls={false}
                />
              </div>

              <div className="flex items-center justify-between bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
                <span>GPS Coordinates: <strong className="font-mono text-foreground">{driver.lat.toFixed(5)}, {driver.lng.toFixed(5)}</strong></span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> High GPS Accuracy (&plusmn;3m)
                </span>
              </div>
            </div>

            {/* Recent Completed Orders Feed */}
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Recent Trips Handled</h3>
                  <p className="text-xs text-muted-foreground">Latest package dispatches and client deliveries</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View all in Orders <ArrowLeft className="h-3 w-3 rotate-180" />
                </Link>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-3 px-4 w-[120px]">Order ID</th>
                      <th className="py-3 px-4 w-[150px]">Customer</th>
                      <th className="py-3 px-4">Route</th>
                      <th className="py-3 px-4 text-right w-[110px]">Fare</th>
                      <th className="py-3 px-4 text-center w-[130px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map((ord, idx) => (
                      <tr key={ord.id || idx} className="hover:bg-muted/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">{ord.id}</td>
                        <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">{ord.customer}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          <div className="truncate max-w-[280px]" title={`${ord.pickup} → ${ord.drop}`}>
                            {ord.pickup} &rarr; {ord.drop}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-foreground tabular-nums whitespace-nowrap">
                          ${ord.fare.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex justify-center">
                            <OrderStatusBadge status={ord.status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Contact, Vehicle & Hub Details */}
          <div className="space-y-6">
            {/* Contact Details Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-foreground">Contact & Identity</h3>
                <span className="text-xs font-mono font-bold text-muted-foreground">{driver.id}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Full Legal Name:</span>
                  <div className="mt-0.5 font-semibold text-foreground text-sm">{driver.name}</div>
                </div>

                <div>
                  <span className="text-muted-foreground">Mobile Phone:</span>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="font-semibold text-foreground">{driver.phone}</span>
                    <a href={`tel:${driver.phone}`} className="text-primary hover:underline font-medium">Call</a>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <div className="mt-0.5 font-semibold text-foreground">{driver.email || `${driver.name.toLowerCase().replace(" ", ".")}@hexidrop.co.zw`}</div>
                </div>

                <div>
                  <span className="text-muted-foreground">Home Address:</span>
                  <div className="mt-0.5 font-semibold text-foreground">{driver.address || `${driver.currentSuburb}, Harare, Zimbabwe`}</div>
                </div>

                <div className="border-t pt-3">
                  <span className="text-muted-foreground">Emergency Contact (Next of Kin):</span>
                  <div className="mt-0.5 font-semibold text-foreground">
                    {driver.emergencyContact?.name || "Grace Moyo"} ({driver.emergencyContact?.relation || "Spouse"})
                  </div>
                  <div className="font-mono text-muted-foreground">{driver.emergencyContact?.phone || "+263 77 912 3840"}</div>
                </div>
              </div>
            </div>

            {/* Assigned Vehicle Summary Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Assigned Vehicle</h3>
                </div>
                <StatusBadge tone="success" label="Roadworthy" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-20 overflow-hidden rounded-xl border bg-muted flex items-center justify-center">
                    {driver.vehiclePhoto ? (
                      <img src={driver.vehiclePhoto} alt={driver.vehicle} className="h-full w-full object-cover" />
                    ) : (
                      <Car className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{driver.vehicleModel || driver.vehicle}</div>
                    <div className="mt-0.5 font-mono text-xs font-semibold text-muted-foreground">Plate: {driver.plate}</div>
                    <div className="text-[11px] text-muted-foreground">Year: {driver.vehicleYear || "2023"} · {driver.vehicleColor || "Hexidrop Navy"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/40 p-2.5">
                  <div>
                    <span className="text-muted-foreground text-[11px]">ZTSA Certificate:</span>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">Valid (2026)</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">Insurance:</span>
                    <div className="font-semibold text-foreground">Comprehensive</div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPhotoModal("vehiclePhoto")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed py-2 text-xs font-semibold text-primary hover:bg-primary/5 transition"
                >
                  <Camera className="h-3.5 w-3.5" /> Take / Update Vehicle Photo
                </button>
              </div>
            </div>

            {/* Payout Information */}
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-foreground">Disbursement Method</h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Active</span>
              </div>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EcoCash Zimbabwe:</span>
                  <span className="font-mono font-bold text-foreground">{driver.ecoCashNumber || driver.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank Account:</span>
                  <span className="font-semibold text-foreground">{driver.bankName || "Stanbic Bank Zimbabwe"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-mono text-muted-foreground">{driver.bankAccount || "100-482910-01"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DRIVER PHOTOS & KYC DOCUMENTS (USER REQUEST FOCUS) */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl border bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Driver Biometric Photos & Regulatory KYC</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Zimbabwe Transport Safety Authority (ZTSA) and CID Police Clearance document compliance. Take real driver images and verify documents directly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenPhotoModal("avatar")}
                  className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Driver Photo</span>
                </button>
                <button
                  onClick={toggleKyc}
                  className={`h-9 rounded-xl px-4 text-xs font-semibold transition border ${
                    driver.verified
                      ? "border-amber-500/40 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                      : "bg-emerald-600 text-white hover:bg-emerald-500"
                  }`}
                >
                  {driver.verified ? "Revoke Verification" : "Approve All Documents"}
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Documents and Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Driver Face Portrait Photo */}
            <DocumentCard
              title="Driver Profile Portrait"
              description="Frontal photograph of driver face for mobile app verification & customer safety."
              imageUrl={driverPhoto}
              status={driverPhoto ? "Verified" : "Pending"}
              onTake={() => handleOpenPhotoModal("avatar")}
              onPreview={() => setPreviewImage(driverPhoto)}
              meta={{
                "Last Updated": driver.joinedDate || "Recent",
                "Resolution": "High Definition",
              }}
            />

            {/* 2. Zimbabwe National ID Card */}
            <DocumentCard
              title="National Registration ID (Metal/Plastic)"
              description="Official Republic of Zimbabwe National Identity Card front & back."
              imageUrl={driver.nationalIdPhoto}
              status={driver.verified ? "Verified" : "Pending"}
              onTake={() => handleOpenPhotoModal("nationalIdPhoto")}
              onPreview={() => setPreviewImage(driver.nationalIdPhoto || null)}
              meta={{
                "ID Number": driver.nationalId || "63-289410-K-42",
                "Issuer": "Registrar General ZW",
              }}
            />

            {/* 3. Driver's License Card */}
            <DocumentCard
              title="Driver's License (Class 2/4)"
              description="Valid Zimbabwe commercial driver's license with vehicle endorsement."
              imageUrl={driver.licensePhoto}
              status={driver.verified ? "Verified" : "Pending"}
              onTake={() => handleOpenPhotoModal("licensePhoto")}
              onPreview={() => setPreviewImage(driver.licensePhoto || null)}
              meta={{
                "License No": driver.licenseNumber || "ZW-DL-882194-B",
                "Class": driver.licenseClass || "Class 4 Light",
              }}
            />

            {/* 4. Vehicle Road Safety Certificate (ZTSA) */}
            <DocumentCard
              title="ZTSA Road Safety Certificate"
              description="Zimbabwe Traffic Safety Authority roadworthiness and vehicle inspection report."
              imageUrl={driver.ztsaCertificatePhoto}
              status={driver.verified ? "Verified" : "Pending"}
              onTake={() => handleOpenPhotoModal("ztsaCertificatePhoto")}
              onPreview={() => setPreviewImage(driver.ztsaCertificatePhoto || null)}
              meta={{
                "Plate Match": driver.plate,
                "Valid Until": "Dec 2026",
              }}
            />

            {/* 5. CID Police Clearance Document */}
            <DocumentCard
              title="CID Police Clearance (Fingerprints)"
              description="Criminal Investigation Department background check and fingerprint clearance."
              imageUrl={driver.policeClearancePhoto}
              status={driver.verified ? "Verified" : "Pending"}
              onTake={() => handleOpenPhotoModal("policeClearancePhoto")}
              onPreview={() => setPreviewImage(driver.policeClearancePhoto || null)}
              meta={{
                "Status": "Clear / No Record",
                "Station": "CID Harare Central",
              }}
            />

            {/* 6. Vehicle Exterior Photo */}
            <DocumentCard
              title="Vehicle Photo & License Plate"
              description="Exterior photo of the vehicle showing roadworthiness and number plate."
              imageUrl={driver.vehiclePhoto}
              status="Verified"
              onTake={() => handleOpenPhotoModal("vehiclePhoto")}
              onPreview={() => setPreviewImage(driver.vehiclePhoto || null)}
              meta={{
                "Model": driver.vehicleModel || driver.vehicle,
                "Plate": driver.plate,
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 3: VEHICLE & SAFETY EQUIPMENT */}
      {activeTab === "vehicle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">Vehicle Specifications & Details</h3>
                  <p className="text-xs text-muted-foreground">Technical parameters and registration information</p>
                </div>
                <StatusBadge tone="success" label="Active on Fleet" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border p-3.5 space-y-1">
                  <span className="text-muted-foreground">Vehicle Category:</span>
                  <div className="text-sm font-bold text-foreground">{driver.vehicle}</div>
                </div>
                <div className="rounded-xl border p-3.5 space-y-1">
                  <span className="text-muted-foreground">Vehicle Make & Model:</span>
                  <div className="text-sm font-bold text-foreground">{driver.vehicleModel || "Yamaha YBR 125"}</div>
                </div>
                <div className="rounded-xl border p-3.5 space-y-1">
                  <span className="text-muted-foreground">Registration Number Plate:</span>
                  <div className="text-sm font-mono font-bold text-primary">{driver.plate}</div>
                </div>
                <div className="rounded-xl border p-3.5 space-y-1">
                  <span className="text-muted-foreground">Year of Manufacture:</span>
                  <div className="text-sm font-bold text-foreground">{driver.vehicleYear || "2023"}</div>
                </div>
                <div className="rounded-xl border p-3.5 space-y-1">
                  <span className="text-muted-foreground">Exterior Color:</span>
                  <div className="text-sm font-bold text-foreground">{driver.vehicleColor || "Hexidrop Navy / Silver"}</div>
                </div>
                <div className="rounded-xl border p-3.5 space-y-1">
                  <span className="text-muted-foreground">Maximum Payload Capacity:</span>
                  <div className="text-sm font-bold text-foreground">
                    {driver.vehicle.includes("Bike") ? "15 kg" : driver.vehicle.includes("Van") ? "500 kg" : "1.5 tonnes"}
                  </div>
                </div>
              </div>

              {/* Vehicle Photo Banner */}
              <div className="rounded-2xl overflow-hidden border">
                <div className="relative h-56 w-full bg-slate-900">
                  {driver.vehiclePhoto ? (
                    <img src={driver.vehiclePhoto} alt={driver.vehicle} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Truck className="h-12 w-12 opacity-40" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={() => handleOpenPhotoModal("vehiclePhoto")}
                      className="flex items-center gap-2 rounded-xl bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/90 transition"
                    >
                      <Camera className="h-3.5 w-3.5 text-primary" /> Take New Vehicle Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Equipment Checklist */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-foreground">Safety Equipment Audit</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-600">100% Passed</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: "Hexidrop Thermal Insulated Delivery Box", status: "Issued & Checked" },
                  { name: "DOT-Certified Safety Helmet / Seatbelt", status: "Inspected" },
                  { name: "High-Visibility Reflective Safety Vest", status: "Issued & Checked" },
                  { name: "Smartphone Weatherproof Handlebar Mount", status: "Installed" },
                  { name: "Emergency Road Safety Triangles & First Aid", status: "Equipped" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-secondary/40 p-3">
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap ml-2">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EARNINGS & PAYOUTS */}
      {activeTab === "earnings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lifetime Earnings</div>
              <div className="mt-2 text-2xl font-bold text-foreground tabular-nums">${driver.earnings.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">Total across all completed trips</div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">This Week's Balance</div>
              <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${(driver.earnings * 0.14).toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Disbursing Friday via EcoCash</div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Average per Trip</div>
              <div className="mt-2 text-2xl font-bold text-foreground tabular-nums">
                ${(driver.earnings / Math.max(driver.trips, 1)).toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Based on {driver.trips} trips</div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payout Account</div>
              <div className="mt-2 text-base font-bold text-foreground">EcoCash Zimbabwe</div>
              <div className="mt-0.5 font-mono text-xs font-semibold text-primary">{driver.ecoCashNumber || driver.phone}</div>
            </div>
          </div>

          {/* Historical Payout Ledger */}
          <div className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-foreground">Weekly Payout Ledger</h3>
            <div className="overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 w-[200px]">Payout Period</th>
                    <th className="py-3 px-4 w-[150px]">Reference</th>
                    <th className="py-3 px-4 w-[120px]">Method</th>
                    <th className="py-3 px-4 text-right w-[120px]">Amount</th>
                    <th className="py-3 px-4 text-center w-[120px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { period: "15 Sep - 21 Sep 2026", ref: "ECO-98412-ZW", method: "EcoCash", amount: 342.50, status: "Paid" },
                    { period: "08 Sep - 14 Sep 2026", ref: "ECO-97810-ZW", method: "EcoCash", amount: 418.00, status: "Paid" },
                    { period: "01 Sep - 07 Sep 2026", ref: "ECO-96219-ZW", method: "EcoCash", amount: 295.40, status: "Paid" },
                    { period: "25 Aug - 31 Aug 2026", ref: "ECO-95104-ZW", method: "EcoCash", amount: 388.20, status: "Paid" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition">
                      <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">{row.period}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">{row.ref}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{row.method}</td>
                      <td className="py-3 px-4 text-right font-bold text-foreground tabular-nums whitespace-nowrap">
                        ${row.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <StatusBadge tone="success" label={row.status} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVITY TIMELINE */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border bg-card p-6 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Operational Audit & Telemetry Log</h3>
            <p className="text-xs text-muted-foreground">Chronological event trail of driver actions and status changes</p>
          </div>

          <div className="relative border-l-2 border-primary/20 ml-3 space-y-6 pl-6 text-xs">
            {[
              { time: "12 minutes ago", title: "Active GPS Beacon Pinged", detail: `Location recorded at ${driver.currentSuburb}, Harare.` },
              { time: "2 hours ago", title: "Status Changed to Online", detail: "Driver started shift from Avondale Hub." },
              { time: "Yesterday, 17:42", title: "Order HXD-48218 Completed", detail: "Delivered parcel safely to Highlands client. Customer gave 5-star rating." },
              { time: "3 days ago", title: "KYC Documents Re-verified", detail: "Hexidrop compliance team reviewed and verified Zimbabwe National ID and Class 4 License." },
              { time: "Joined Platform", title: "Account Onboarded", detail: `Driver ${driver.name} onboarded on ${driver.joinedDate || "2024"}.` },
            ].map((event, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[9px] shadow-sm">
                  •
                </span>
                <span className="font-semibold text-muted-foreground text-[11px]">{event.time}</span>
                <h4 className="font-bold text-foreground mt-0.5 text-sm">{event.title}</h4>
                <p className="text-muted-foreground mt-0.5">{event.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Capture Modal (Camera & Upload) */}
      <PhotoCaptureModal
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        driverName={driver.name}
        target={photoTarget}
        currentPhotoUrl={driverPhoto}
        onCapture={handleCapturePhoto}
      />

      {/* Edit Driver Details Modal */}
      <RecordEditor<Driver>
        open={editing}
        onOpenChange={(v) => !v && setEditing(false)}
        title="Edit Driver Profile"
        fields={DRIVER_EDIT_FIELDS}
        value={driver}
        onSubmit={(next) => {
          update(next);
          setEditing(false);
          toast.success("Driver profile updated successfully");
        }}
      />

      {/* Image Zoom Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <img src={previewImage} alt="Document Zoom" className="max-h-[80vh] w-auto object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentCard({
  title,
  description,
  imageUrl,
  status,
  onTake,
  onPreview,
  meta,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  status: "Verified" | "Pending";
  onTake: () => void;
  onPreview: () => void;
  meta: Record<string, string>;
}) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border bg-card shadow-card hover:shadow-elegant transition-shadow">
      <div>
        {/* Document Image Header */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900 border-b group">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <FileText className="h-10 w-10 opacity-40 mb-2" />
              <span className="text-xs">No image captured yet</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <StatusBadge tone={status === "Verified" ? "success" : "warning"} label={status} />
          </div>

          {/* Quick Enlarge Button */}
          {imageUrl && (
            <button
              onClick={onPreview}
              title="Preview large image"
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Details Content */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{description}</p>
          </div>

          {/* Meta Attributes */}
          <div className="space-y-1 rounded-xl bg-secondary/40 p-2.5 text-xs">
            {Object.entries(meta).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}:</span>
                <span className="font-mono font-semibold text-foreground truncate max-w-[150px]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action: Take Photo or Upload */}
      <div className="border-t p-3 bg-muted/20">
        <button
          onClick={onTake}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Take / Retake Photo</span>
        </button>
      </div>
    </div>
  );
}

export default DriverDetailsPage;
