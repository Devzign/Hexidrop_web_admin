import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { RecordEditor, ConfirmDelete, type FieldDef } from "@/components/admin/RecordEditor";
import { PhotoCaptureModal } from "@/components/admin/PhotoCaptureModal";
import { useDrivers } from "@/lib/driver-store";
import type { Driver } from "@/lib/mock-data";
import {
  UserPlus,
  Filter,
  Download,
  Star,
  Eye,
  Camera,
  Search,
  ShieldCheck,
  Phone,
  Truck,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const DRIVER_FIELDS: FieldDef<Driver>[] = [
  { name: "name", label: "Full name" },
  { name: "phone", label: "Phone" },
  { name: "city", label: "City" },
  { name: "vehicle", label: "Vehicle type" },
  { name: "vehicleModel", label: "Vehicle model" },
  { name: "plate", label: "Plate" },
  { name: "status", label: "Status", type: "select", options: ["Online", "On Trip", "Offline"] },
  { name: "rating", label: "Rating", type: "number" },
  { name: "trips", label: "Trips", type: "number" },
  { name: "earnings", label: "Earnings ($)", type: "number" },
  { name: "verified", label: "KYC verified", type: "switch" },
];

export function DriversPage() {
  const navigate = useNavigate();
  const { drivers, loading, refresh, updateDriver, updateDriverPhoto, deleteDriver, createDriver } = useDrivers();

  // Search & filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // CRUD modals
  const [editing, setEditing] = useState<Driver | null>(null);
  const [creating, setCreating] = useState<Partial<Driver> | null>(null);
  const [deleting, setDeleting] = useState<Driver | null>(null);

  // Quick photo capture modal from table
  const [captureDriver, setCaptureDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.plate.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && d.verified) ||
      (statusFilter === "pending" && !d.verified) ||
      d.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const columns: Column<Driver>[] = [
    {
      key: "id",
      header: "ID",
      render: (r) => (
        <Link
          to={`/admin/drivers/${r.id}`}
          onClick={(e) => e.stopPropagation()}
          className="group/id inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary hover:underline"
          title="Open full-screen driver details"
        >
          <span>{r.id}</span>
          <Eye className="h-3 w-3 opacity-60 group-hover/id:opacity-100 transition-opacity" />
        </Link>
      ),
    },
    {
      key: "name",
      header: "Driver",
      render: (r) => {
        const photo = r.avatar || r.driverPhoto;
        return (
          <div className="flex items-center gap-3">
            {/* Driver Photo with Quick Camera Trigger */}
            <div
              className="relative group/pic cursor-pointer flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setCaptureDriver(r);
              }}
              title="Click to take or update driver photo"
            >
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-border bg-slate-100 shadow-sm">
                {photo ? (
                  <img src={photo} alt={r.name} className="h-full w-full object-cover transition-transform group-hover/pic:scale-105" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gradient-primary text-xs font-semibold text-primary-foreground">
                    {r.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 opacity-0 group-hover/pic:opacity-100 transition-opacity text-white">
                <Camera className="h-4 w-4 text-primary" />
              </div>
            </div>

            {/* Name & Phone */}
            <div className="leading-tight">
              <Link
                to={`/admin/drivers/${r.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[13px] font-bold text-foreground hover:text-primary transition flex items-center gap-1"
              >
                <span>{r.name}</span>
                {r.verified && (
                  <span title="KYC Verified">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/20" />
                  </span>
                )}
              </Link>
              <div className="text-xs font-medium text-muted-foreground">{r.phone}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "vehicle",
      header: "Vehicle",
      render: (r) => (
        <div className="leading-tight">
          <div className="text-[13px] font-medium text-foreground">{r.vehicleModel || r.vehicle}</div>
          <div className="text-xs font-mono font-semibold text-muted-foreground">{r.plate}</div>
        </div>
      ),
    },
    {
      key: "city",
      header: "Hub / City",
      render: (r) => (
        <div className="leading-tight">
          <div className="font-semibold text-foreground text-xs">{r.city}</div>
          <div className="text-[11px] text-muted-foreground">{r.currentSuburb}</div>
        </div>
      ),
    },
    {
      key: "verified",
      header: "KYC Status",
      render: (r) =>
        r.verified ? (
          <StatusBadge tone="success" label="Verified" />
        ) : (
          <StatusBadge tone="warning" label="Pending" />
        ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {r.rating}
        </span>
      ),
    },
    {
      key: "trips",
      header: "Trips",
      align: "right",
      render: (r) => <span className="font-semibold tabular-nums text-foreground">{r.trips.toLocaleString()}</span>,
    },
    {
      key: "earnings",
      header: "Earnings",
      align: "right",
      render: (r) => (
        <span className="font-bold tabular-nums text-foreground">${r.earnings.toLocaleString()}</span>
      ),
    },
    { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setCaptureDriver(r)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
            title="Take driver photo"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <RowActions
            onView={() => navigate(`/admin/drivers/${r.id}`)}
            onEdit={() => setEditing(r)}
            onDuplicate={() => {
              createDriver({
                ...r,
                name: `${r.name} (Copy)`,
                id: `DRV-${1200 + Math.floor(Math.random() * 800)}`,
              });
            }}
            onDelete={() => setDeleting(r)}
          />
        </div>
      ),
    },
  ];

  const online = drivers.filter((d) => d.status !== "Offline").length;
  const verified = drivers.filter((d) => d.verified).length;
  const totalEarnings = drivers.reduce((sum, d) => sum + d.earnings, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumb={["Operations", "Drivers Fleet"]}
        title="Drivers"
        subtitle={`${drivers.length} drivers onboarded · ${online} active on Harare routes`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                refresh();
                toast.info("Syncing fleet data with live database...");
              }}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent transition shadow-sm disabled:opacity-50"
              title="Sync fleet with live backend database"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">Sync Fleet</span>
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-medium hover:bg-accent transition shadow-sm">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() =>
                setCreating({
                  status: "Online",
                  verified: true,
                  rating: 4.9,
                  trips: 0,
                  earnings: 0,
                  city: "Harare",
                  vehicle: "Courier Bike",
                })
              }
              className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card hover:brightness-105 transition"
            >
              <UserPlus className="h-4 w-4" /> Onboard driver
            </button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total fleet drivers" value={String(drivers.length)} hint="+34 this month" />
        <StatCard label="Online right now" value={String(online)} tone="success" hint={`${Math.round((online / Math.max(drivers.length, 1)) * 100)}% active rate`} />
        <StatCard
          label="KYC verified"
          value={String(verified)}
          hint={`${Math.round((verified / Math.max(drivers.length, 1)) * 100)}% verified`}
        />
        <StatCard label="Total fleet earnings" value={`$${totalEarnings.toLocaleString()}`} tone="gold" hint="Disbursed via EcoCash" />
      </div>

      {/* Main Table Card with Search & Filters */}
      <SectionCard
        padding="none"
        title="Fleet Directory"
        subtitle="Click any driver to open their full-screen profile, live GPS tracking, and KYC documents"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search driver, plate, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 pr-3 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48 sm:w-60"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Drivers</option>
              <option value="Online">Online</option>
              <option value="On Trip">On Trip</option>
              <option value="Offline">Offline</option>
              <option value="verified">KYC Verified</option>
              <option value="pending">KYC Pending</option>
            </select>
          </div>
        }
      >
        <DataTable
          columns={columns}
          rows={filteredDrivers}
          onRowClick={(row) => navigate(`/admin/drivers/${(row as Driver).id}`)}
        />
      </SectionCard>

      {/* Quick Photo Capture Modal from Fleet Table */}
      {captureDriver && (
        <PhotoCaptureModal
          open={!!captureDriver}
          onClose={() => setCaptureDriver(null)}
          driverName={captureDriver.name}
          target="avatar"
          currentPhotoUrl={captureDriver.avatar || captureDriver.driverPhoto}
          onCapture={(dataUrl) => {
            updateDriverPhoto(captureDriver.id, "avatar", dataUrl);
            setCaptureDriver(null);
          }}
        />
      )}

      {/* Record Editor: Edit Driver */}
      <RecordEditor<Driver>
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        title="Edit driver profile"
        fields={DRIVER_FIELDS}
        value={editing}
        onSubmit={(next) => {
          if (editing) {
            updateDriver(editing.id, next);
            setEditing(null);
            toast.success("Driver updated successfully");
          }
        }}
      />

      {/* Record Editor: Onboard New Driver */}
      <RecordEditor<Driver>
        open={!!creating}
        onOpenChange={(v) => !v && setCreating(null)}
        title="Onboard driver"
        fields={DRIVER_FIELDS}
        value={creating}
        onSubmit={(next) => {
          createDriver(next);
          setCreating(null);
        }}
      />

      {/* Confirm Delete */}
      <ConfirmDelete
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            deleteDriver(deleting.id);
            setDeleting(null);
          }
        }}
        title="Remove driver from fleet?"
        description={
          deleting ? `${deleting.name} (${deleting.id}) will be removed from active dispatch.` : ""
        }
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "success" | "gold";
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 shadow-card ${
        tone === "gold" ? "bg-gradient-gold text-brand-navy border-amber-300/40" : ""
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wider ${
          tone === "gold" ? "text-brand-navy/90" : "text-slate-600 dark:text-slate-400"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1.5 text-2xl font-bold tracking-tight ${
          tone === "gold" ? "text-brand-navy" : "text-foreground"
        }`}
      >
        {value}
      </div>
      {hint && (
        <div
          className={`mt-1 text-xs font-medium ${
            tone === "gold"
              ? "text-brand-navy/80"
              : tone === "success"
              ? "text-emerald-600 dark:text-emerald-400 font-semibold"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

export default DriversPage;
