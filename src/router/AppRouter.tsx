import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// Public Pages
import Home from "@/pages/public/Home";
import Services from "@/pages/public/Services";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Careers from "@/pages/public/Careers";
import Terms from "@/pages/public/Terms";
import Privacy from "@/pages/public/Privacy";
import RefundPolicy from "@/pages/public/RefundPolicy";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import OrdersPage from "@/pages/admin/Orders";
import CustomersPage from "@/pages/admin/Customers";
import DriversPage from "@/pages/admin/Drivers";
import DriverDetailsPage from "@/pages/admin/DriverDetails";
import MoversPage from "@/pages/admin/Movers";
import VehiclesPage from "@/pages/admin/Vehicles";
import FleetPage from "@/pages/admin/Fleet";
import LiveTracking from "@/pages/admin/LiveTracking";
import PricingPage from "@/pages/admin/Pricing";
import PayoutsPage from "@/pages/admin/Payouts";
import WalletPage from "@/pages/admin/Wallet";
import CouponsPage from "@/pages/admin/Coupons";
import BusinessPage from "@/pages/admin/Business";
import CitiesPage from "@/pages/admin/Cities";
import ReportsPage from "@/pages/admin/Reports";
import CmsPage from "@/pages/admin/Cms";
import RolesPage from "@/pages/admin/Roles";
import AuditLogsPage from "@/pages/admin/AuditLogs";
import NotificationsPage from "@/pages/admin/Notifications";
import SupportPage from "@/pages/admin/Support";
import SettingsPage from "@/pages/admin/Settings";
import ProfilePage from "@/pages/admin/Profile";
import LoginPage from "@/pages/admin/Login";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Go Home
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            Admin Ops
          </Link>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  /* ================= PUBLIC ROUTES ================= */
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "careers", element: <Careers /> },
      { path: "terms", element: <Terms /> },
      { path: "privacy", element: <Privacy /> },
      { path: "refund-policy", element: <RefundPolicy /> },
    ],
  },

  /* ================= ADMIN OPS ROUTES ================= */
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "drivers", element: <DriversPage /> },
      { path: "drivers/:id", element: <DriverDetailsPage /> },
      { path: "movers", element: <MoversPage /> },
      { path: "vehicles", element: <VehiclesPage /> },
      { path: "fleet", element: <FleetPage /> },
      { path: "live-tracking", element: <LiveTracking /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "payouts", element: <PayoutsPage /> },
      { path: "wallet", element: <WalletPage /> },
      { path: "coupons", element: <CouponsPage /> },
      { path: "business", element: <BusinessPage /> },
      { path: "cities", element: <CitiesPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "cms", element: <CmsPage /> },
      { path: "roles", element: <RolesPage /> },
      { path: "audit-logs", element: <AuditLogsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },

  /* ================= CATCH-ALL 404 ================= */
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
