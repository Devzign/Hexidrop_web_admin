import { Link, useNavigate } from "react-router-dom";
import {
  Package, Users, Truck, DollarSign, CheckCircle2, Clock, XCircle,
  UserPlus, Building2, PackageCheck, Wifi, Home,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useState } from "react";

import { KpiCard } from "@/components/admin/KpiCard";
import { Icon3D } from "@/components/admin/Icon3D";
import { PageHeader, SectionCard } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { ExportButton } from "@/components/admin/ExportButton";
import { ChartFrame, chartAxisTick, chartLegendProps, chartTooltipProps } from "@/components/admin/ChartFrame";
import {
  ORDERS, REVENUE_SERIES, VEHICLE_DISTRIBUTION, TOP_CITIES, DRIVERS, PAYMENTS,
  type Order, type Payment,
} from "@/lib/mock-data";
import { RealMap } from "@/components/maps/RealMap";
import { useMapConfig } from "@/hooks/use-map-config";
import { HARARE_CENTER } from "@/lib/geo-data";



const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const RANGES = { "7D": 7, "14D": 14, "30D": 30, "90D": 90 } as const;
type RangeKey = keyof typeof RANGES;

export function Dashboard() {
  const [range, setRange] = useState<RangeKey>("14D");
  const revenueSeries = REVENUE_SERIES.slice(-Math.min(RANGES[range], REVENUE_SERIES.length));
  const recentOrders = ORDERS.slice(0, 6);
  const recentPayments = PAYMENTS.slice(0, 5);
  const topDrivers = [...DRIVERS].sort((a, b) => b.trips - a.trips).slice(0, 5);

  const orderColumns: Column<Order>[] = [
    { key: "id", header: "Order", render: (r) => <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span> },
    { key: "customer", header: "Customer", render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-foreground">
          {r.customer.split(" ").map(s => s[0]).join("").slice(0, 2)}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-foreground">{r.customer}</div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{r.city}</div>
        </div>
      </div>
    ) },
    { key: "driver", header: "Driver", render: (r) => <span className="text-[13px] font-medium text-foreground">{r.driver}</span> },
    { key: "vehicle", header: "Vehicle", render: (r) => <StatusBadge label={r.vehicle} tone="muted" dot={false} /> },
    { key: "fare", header: "Fare", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.fare.toFixed(2)}</span> },
    { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
  ];

  const paymentColumns: Column<Payment>[] = [
    { key: "id", header: "Txn", render: (r) => <span className="font-semibold text-xs tracking-tight text-foreground">{r.id}</span> },
    { key: "customer", header: "Customer", render: (r) => <span className="text-[13px] font-medium text-foreground">{r.customer}</span> },
    { key: "method", header: "Method", render: (r) => <StatusBadge tone="muted" label={r.method} dot={false} /> },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-bold tabular-nums text-foreground">${r.amount.toFixed(2)}</span> },
    { key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={["Home", "Dashboard"]}
        title="Operations Dashboard"
        subtitle="Wednesday, July 15, 2026 · Live view across 12 Zimbabwean cities"
        actions={
          <>
            <button className="h-9 rounded-xl border bg-card px-3.5 text-sm font-medium shadow-card hover:bg-accent">
              Last 7 days
            </button>
            <ExportButton module="dashboard" label="Export report" format="PDF" variant="primary" />
          </>
        }
      />

      {/* KPI Row 1 — hero */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue today" value="$18,420" delta="+12.4%" hint="vs. yesterday $16,388" tone="primary" icon={<Icon3D name="revenue" className="h-9 w-9" />} spark={[3,4,3,5,6,5,7,8,7,9,10,11]} />
        <KpiCard label="Orders today" value="1,284" delta="+6.8%" hint="342 in transit · 84 pending" icon={<Icon3D name="orders" className="h-9 w-9" />} spark={[2,3,2,4,4,5,5,6,6,7]} />
        <KpiCard label="Active drivers" value="812" delta="+3.1%" hint="of 1,284 verified" icon={<Icon3D name="signal" className="h-9 w-9" />} spark={[4,5,4,6,5,6,7,7,8,8]} />
        <KpiCard label="Revenue this month" value="$412,880" delta="+18.2%" hint="on track for $520K" tone="gold" icon={<Icon3D name="revenue" className="h-9 w-9" />} spark={[2,3,4,4,5,6,6,7,8,9,9,10]} />
      </div>

      {/* KPI Row 2 — operational */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <MiniStat icon={<Icon3D name="check" className="h-7 w-7" />} tone="success" label="Completed" value="924" />
        <MiniStat icon={<Icon3D name="cargo" className="h-7 w-7" />} tone="warning" label="Pending" value="84" />
        <MiniStat icon={<Icon3D name="cancelled" className="h-7 w-7" />} tone="destructive" label="Cancelled" value="18" />
        <MiniStat icon={<Icon3D name="customers" className="h-7 w-7" />} tone="info" label="New customers" value="142" />
        <MiniStat icon={<Icon3D name="business" className="h-7 w-7" />} tone="primary" label="Business accts" value="38" />
        <MiniStat icon={<Icon3D name="movers" className="h-7 w-7" />} tone="primary" label="Moving jobs" value="46" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Revenue & orders"
          subtitle={`Last ${revenueSeries.length} days across all cities`}
          actions={
            <div className="flex rounded-lg border bg-muted/50 p-0.5 text-xs">
              {(Object.keys(RANGES) as RangeKey[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={r === range ? "rounded-md bg-card px-2.5 py-1 font-semibold shadow-sm" : "px-2.5 py-1 text-muted-foreground hover:text-foreground"}
                >
                  {r}
                </button>
              ))}
            </div>
          }
        >
          <ChartFrame>
            <ResponsiveContainer>
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={chartAxisTick} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} width={44} />
                <Tooltip {...chartTooltipProps} />
                <Legend {...chartLegendProps} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="orders" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#ord)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </SectionCard>

        <SectionCard title="Vehicle mix" subtitle="Distribution of active fleet">
          <ChartFrame>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={VEHICLE_DISTRIBUTION} innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {VEHICLE_DISTRIBUTION.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipProps} />
                <Legend {...chartLegendProps} />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </SectionCard>
      </div>

      {/* Live map + top cities */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Live driver map"
          subtitle="812 drivers online across Zimbabwe"
          actions={<a href="/live-tracking" className="text-xs font-semibold text-primary hover:underline">Open full map →</a>}
          padding="none"
        >
          <MiniMap />
        </SectionCard>

        <SectionCard title="Top cities" subtitle="By orders, last 14 days">
          <div className="space-y-3">
            {TOP_CITIES.map((c, i) => {
              const max = Math.max(...TOP_CITIES.map(x => x.orders));
              const pct = (c.orders / max) * 100;
              return (
                <div key={c.city}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                      <span className="font-medium">{c.city}</span>
                    </div>
                    <span className="tabular-nums text-muted-foreground">{c.orders.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Moving jobs & recent orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Moving jobs today" subtitle="Movers & packers activity">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-secondary/50 p-4">
              <div className="text-2xl font-semibold">28</div>
              <div className="mt-0.5 text-xs text-muted-foreground">House moves</div>
            </div>
            <div className="rounded-xl border bg-accent/40 p-4">
              <div className="text-2xl font-semibold">12</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Office relocations</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-2xl font-semibold">4</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Heavy items</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-2xl font-semibold">2</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Furniture</div>
            </div>
          </div>
          <div className="mt-4 h-[120px]">
            <ResponsiveContainer>
              <BarChart data={REVENUE_SERIES.slice(-7)} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap="24%">
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
                <Bar dataKey="moving" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Recent orders"
          subtitle="Real-time feed"
          actions={<a href="/orders" className="text-xs font-semibold text-primary hover:underline">View all →</a>}
          padding="none"
        >
          <DataTable columns={orderColumns} rows={recentOrders} compact />
        </SectionCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Top drivers" subtitle="By trips completed this month" padding="none">
          <ul className="divide-y">
            {topDrivers.map((d, i) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">{i + 1}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-xs font-semibold text-primary-foreground">
                  {d.name.split(" ").map(s => s[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.vehicle} · {d.city}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{d.trips.toLocaleString()}</div>
                  <div className="text-[11px] text-muted-foreground">★ {d.rating}</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent payments" padding="none">
          <DataTable columns={paymentColumns} rows={recentPayments} compact />
        </SectionCard>
      </div>
    </div>
  );
}

function MiniStat({
  icon, label, value,
}: {
  icon: React.ReactNode; label: string; value: string;
  tone: "success" | "warning" | "destructive" | "info" | "primary";
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 p-1 shadow-sm transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      <div className="leading-tight min-w-0">
        <div className="text-lg font-bold tabular-nums text-foreground">{value}</div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate">{label}</div>
      </div>
    </div>
  );
}

function MiniMap() {
  const mapConfig = useMapConfig();
  return (
    <div className="relative">
      <RealMap
        config={mapConfig}
        center={HARARE_CENTER}
        zoom={12}
        drivers={DRIVERS.slice(0, 16)}
        height="380px"
        showControls={false}
      />
      <div className="absolute top-3 right-3 z-[1000]">
        <Link
          to="/live-tracking"
          className="rounded-xl border bg-card/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-card backdrop-blur hover:bg-accent transition"
        >
          Expand Full Screen →
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
