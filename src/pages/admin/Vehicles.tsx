import { useState, useMemo } from "react";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ConfirmDelete } from "@/components/admin/RecordEditor";
import { useCrud } from "@/hooks/use-crud";
import { VEHICLES, DRIVERS, DRIVER_NAMES } from "@/lib/mock-data";
import { getVehicleImage } from "@/components/public/VehicleIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Search,
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

type Row = {
  id: string;
  type: string;
  plate: string;
  capacity: string;
  driver: string;
  status: string;
  insurance: string;
  nextService: string;
};

const INITIAL_ROWS: Row[] = Array.from({ length: 18 }).map((_, i) => {
  const v = VEHICLES[i % VEHICLES.length];
  const d = DRIVERS[i % DRIVERS.length];
  return {
    id: `VEH-${2200 + i}`,
    type: v.type,
    plate: v.plate + "-" + (i + 1),
    capacity: v.capacity,
    driver: d.name,
    status: (["Active", "Active", "Maintenance", "Idle", "Active"] as const)[i % 5],
    insurance: `2026-${(1 + (i % 12)).toString().padStart(2, "0")}-14`,
    nextService: `2026-08-${(1 + ((i * 3) % 27)).toString().padStart(2, "0")}`,
  };
});

const STATUS_OPTIONS = ["All", "Active", "Maintenance", "Idle"] as const;

export function VehiclesPage() {
  const crud = useCrud<Row>(INITIAL_ROWS, "Vehicle");

  // Search and Filter States
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<Row>>({});

  // Filtered rows based on search and filters
  const filteredRows = useMemo(() => {
    return crud.rows.filter((r) => {
      const matchesType =
        typeFilter === "All" || r.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "All" || r.status.toLowerCase() === statusFilter.toLowerCase();
      const searchTarget = `${r.id} ${r.plate} ${r.type} ${r.driver} ${r.capacity} ${r.insurance} ${r.nextService}`.toLowerCase();
      const matchesSearch =
        q.trim() === "" || searchTarget.includes(q.trim().toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [crud.rows, typeFilter, statusFilter, q]);

  // Counts per type for tab badges
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: crud.rows.length };
    VEHICLES.forEach((v) => {
      counts[v.type] = crud.rows.filter((r) => r.type === v.type).length;
    });
    return counts;
  }, [crud.rows]);

  const hasActiveFilters = q.trim() !== "" || typeFilter !== "All" || statusFilter !== "All";

  const resetFilters = () => {
    setQ("");
    setTypeFilter("All");
    setStatusFilter("All");
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    const defaultType = typeFilter !== "All" ? typeFilter : VEHICLES[0].type;
    const matchedVehicle = VEHICLES.find((v) => v.type === defaultType) || VEHICLES[0];
    const randomDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)].name;
    const randomPlate = `ADK-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1 + Math.random() * 9)}`;

    setCurrentRecord({
      id: `VEH-${2300 + Math.floor(Math.random() * 900)}`,
      type: defaultType,
      capacity: matchedVehicle.capacity,
      plate: randomPlate,
      driver: randomDriver,
      status: "Active",
      insurance: "2026-12-31",
      nextService: "2026-09-15",
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (row: Row) => {
    setIsEditing(true);
    setCurrentRecord({ ...row });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentRecord.type || !currentRecord.plate) return;

    if (isEditing) {
      crud.saveEdit(currentRecord as Row);
    } else {
      crud.saveCreate(currentRecord as Row);
    }
    setDialogOpen(false);
  };

  const selectVehicleType = (type: string, capacity: string) => {
    setCurrentRecord((prev) => ({
      ...prev,
      type,
      capacity: prev.capacity && prev.capacity !== "" && prev.type === type ? prev.capacity : capacity,
    }));
  };

  const columns: Column<Row>[] = [
    {
      key: "id",
      header: "ID",
      render: (r) => (
        <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span>
      ),
    },
    {
      key: "type",
      header: "Vehicle & Type",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary/50 border border-border/50 p-1.5 shadow-sm transition-transform hover:scale-105">
            <img
              src={getVehicleImage(r.type)}
              alt={r.type}
              className="h-full w-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground">{r.type}</div>
            <div className="text-[11px] font-medium text-muted-foreground">{r.capacity}</div>
          </div>
        </div>
      ),
    },
    {
      key: "plate",
      header: "Plate",
      render: (r) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary/60 border border-border/50 text-foreground">
          {r.plate}
        </span>
      ),
    },
    { key: "capacity", header: "Capacity" },
    {
      key: "driver",
      header: "Assigned to",
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
            {r.driver.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
          <span className="text-[13px] font-medium text-foreground">{r.driver}</span>
        </div>
      ),
    },
    { key: "insurance", header: "Insurance until" },
    { key: "nextService", header: "Next service" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusBadge
          tone={r.status === "Active" ? "success" : r.status === "Maintenance" ? "warning" : "muted"}
          label={r.status}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <RowActions
          onEdit={() => handleOpenEdit(r)}
          onDuplicate={() => crud.duplicate(r)}
          onDelete={() => crud.openDelete(r)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Operations", "Vehicles"]}
        title="Vehicles"
        subtitle="Fleet configuration and vehicle assignments"
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 h-9 rounded-xl bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Add vehicle
          </button>
        }
      />

      {/* Top 3D Vehicle Showcase Metric Cards with Click-to-Filter */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {VEHICLES.map((v, i) => {
          const count = [48, 62, 34, 21, 12, 6][i];
          const imageSrc = getVehicleImage(v.type);
          const isSelected = typeFilter.toLowerCase() === v.type.toLowerCase();
          return (
            <button
              key={v.type}
              type="button"
              onClick={() => setTypeFilter((prev) => (prev === v.type ? "All" : v.type))}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                  : "bg-card border-border/70 hover:border-border shadow-card"
              }`}
            >
              {/* 3D Realistic Vehicle Stage */}
              <div
                className={`relative flex h-20 w-full items-center justify-center rounded-xl p-2 border transition-all duration-300 group-hover:scale-105 ${
                  isSelected
                    ? "bg-primary/10 border-primary/30"
                    : "bg-gradient-to-b from-secondary/60 to-secondary/20 border-border/40"
                }`}
              >
                <img
                  src={imageSrc}
                  alt={v.type}
                  className="h-full w-full object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.18)]"
                  loading="lazy"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div
                  className={`text-[11px] font-bold uppercase tracking-wider truncate ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {v.type}
                </div>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? "bg-primary" : "bg-emerald-500"
                  }`}
                />
              </div>

              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums text-foreground">{count}</span>
                <span className="text-xs font-medium text-muted-foreground">units</span>
              </div>

              <div className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                up to {v.capacity}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Fleet Register Section with Integrated Search & Filter Controls */}
      <SectionCard
        title="Fleet register"
        subtitle={`${filteredRows.length} ${filteredRows.length === 1 ? "vehicle" : "vehicles"} ${
          hasActiveFilters ? "found" : "registered"
        }`}
        padding="none"
        actions={
          hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
            >
              <RotateCcw className="h-3 w-3" />
              Reset filters
            </button>
          ) : undefined
        }
      >
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between bg-card/50">
          {/* Quick Filter Type Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setTypeFilter("All")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                typeFilter === "All"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary/60 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>All Types</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  typeFilter === "All" ? "bg-black/20 text-white" : "bg-muted text-foreground"
                }`}
              >
                {typeCounts.All}
              </span>
            </button>

            {VEHICLES.map((v) => {
              const isSelected = typeFilter.toLowerCase() === v.type.toLowerCase();
              const count = typeCounts[v.type] ?? 0;
              return (
                <button
                  key={v.type}
                  onClick={() => setTypeFilter(v.type)}
                  className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary/60 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <img
                    src={getVehicleImage(v.type)}
                    alt={v.type}
                    className="h-4 w-5 object-contain"
                  />
                  <span>{v.type}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected ? "bg-black/20 text-white" : "bg-muted text-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Status Filter Dropdown */}
          <div className="flex items-center gap-2.5 sm:self-end lg:self-auto">
            {/* Status Filter Dropdown */}
            <div className="w-36">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs rounded-xl bg-card border-border/70 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{statusFilter === "All" ? "All Status" : statusFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((st) => (
                    <SelectItem key={st} value={st} className="text-xs">
                      {st === "All" ? "All Status" : st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input Field */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search plate, driver, ID…"
                className="h-9 w-full rounded-xl border border-border/70 bg-card pl-9 pr-8 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table or Empty Filter State */}
        {filteredRows.length > 0 ? (
          <DataTable columns={columns} rows={filteredRows} />
        ) : (
          <div className="py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-foreground">No vehicles found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              No vehicles match your current search query "{q}" or selected filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-4 rounded-xl text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear all filters
            </Button>
          </div>
        )}

        {/* Table Footer Summary */}
        <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground bg-card/30">
          <div>
            Showing <span className="font-semibold text-foreground">{filteredRows.length}</span> of{" "}
            <span className="font-semibold text-foreground">{crud.rows.length}</span> total vehicles
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Filtered view active
              </span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Dedicated Add / Edit Vehicle Dialog with 3D Vehicle Selector and Live Preview */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              {isEditing ? "Edit Vehicle" : "Add New Vehicle to Fleet"}
            </DialogTitle>
            <DialogDescription>
              Select vehicle type from realistic 3D models and assign plate, capacity, and driver.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Visual Vehicle Type Selection */}
            <div>
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Select Vehicle Type
              </Label>
              <div className="mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {VEHICLES.map((v) => {
                  const isSelected = currentRecord.type === v.type;
                  const img = getVehicleImage(v.type);
                  return (
                    <button
                      key={v.type}
                      type="button"
                      onClick={() => selectVehicleType(v.type, v.capacity)}
                      className={`group relative flex flex-col items-center rounded-xl p-2 text-center transition-all duration-200 border ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                          : "border-border/60 bg-card hover:border-border hover:bg-secondary/40"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                      )}
                      <div className="flex h-12 w-full items-center justify-center py-1">
                        <img
                          src={img}
                          alt={v.type}
                          className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-transform group-hover:scale-110"
                        />
                      </div>
                      <span className="mt-1 text-[11px] font-semibold text-foreground line-clamp-1">
                        {v.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{v.capacity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live 3D Preview Card */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-emerald-500/5 via-primary/5 to-teal-500/5 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-card/80 p-2 border border-border shadow-sm">
                  <img
                    src={getVehicleImage(currentRecord.type || "")}
                    alt={currentRecord.type || "Vehicle"}
                    className="h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {currentRecord.type || "Selected Vehicle"}
                    </span>
                    <StatusBadge
                      tone={
                        currentRecord.status === "Active"
                          ? "success"
                          : currentRecord.status === "Maintenance"
                          ? "warning"
                          : "muted"
                      }
                      label={currentRecord.status || "Active"}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="font-mono bg-secondary px-1.5 py-0.5 rounded border border-border/40 text-foreground">
                      {currentRecord.plate || "NO PLATE"}
                    </span>
                    <span>Max {currentRecord.capacity || "—"}</span>
                    <span>• {currentRecord.driver || "Unassigned"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  License Plate
                </Label>
                <Input
                  className="mt-1.5 font-mono"
                  value={currentRecord.plate ?? ""}
                  placeholder="e.g. ADK-2145-1"
                  onChange={(e) =>
                    setCurrentRecord((p) => ({ ...p, plate: e.target.value.toUpperCase() }))
                  }
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Payload Capacity
                </Label>
                <Input
                  className="mt-1.5"
                  value={currentRecord.capacity ?? ""}
                  placeholder="e.g. 500 kg or 1.5 t"
                  onChange={(e) => setCurrentRecord((p) => ({ ...p, capacity: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Assigned Driver
                </Label>
                <Select
                  value={currentRecord.driver ?? ""}
                  onValueChange={(driver) => setCurrentRecord((p) => ({ ...p, driver }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVER_NAMES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Operational Status
                </Label>
                <Select
                  value={currentRecord.status ?? "Active"}
                  onValueChange={(status) => setCurrentRecord((p) => ({ ...p, status }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Idle">Idle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Insurance Expiry
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    type="date"
                    value={currentRecord.insurance ?? ""}
                    onChange={(e) => setCurrentRecord((p) => ({ ...p, insurance: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Next Scheduled Service
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    type="date"
                    value={currentRecord.nextService ?? ""}
                    onChange={(e) =>
                      setCurrentRecord((p) => ({ ...p, nextService: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-primary text-primary-foreground font-semibold"
            >
              {isEditing ? "Save Changes" : "Register Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!crud.deleting}
        onOpenChange={(v) => !v && crud.setDeleting(null)}
        onConfirm={crud.confirmDelete}
        title="Retire vehicle?"
        description={
          crud.deleting
            ? `${crud.deleting.plate} (${crud.deleting.type}) will be removed from the fleet register.`
            : ""
        }
      />
    </div>
  );
}

export default VehiclesPage;
