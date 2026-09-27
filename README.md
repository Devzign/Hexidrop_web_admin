# Hexidrop — Unified Public Web & Admin Platform

Hexidrop is an end-to-end on-demand logistics, delivery, and movers platform built with **React 18**, **TypeScript**, **Tailwind CSS**, **Vite**, and realistic transparent **3D UI Assets**.

---

## 🚀 Features

### 1. Public-Facing Web Portal
- **Home & Booking:** Instant delivery calculator, vehicle selection (Bike, Scooter, Van, Pickup, Mini Truck, Large Truck), and live rate estimator.
- **Movers & Packers:** Moving quotation calculator, room selection, packing tiers, and scheduled pickups.
- **Corporate & Business:** Enterprise logistics, API integration information, and volume pricing.
- **Tracking:** Real-time parcel and delivery tracking lookup.
- **Company & Info Pages:** About Us, Careers, Contact, Terms of Service, Privacy Policy, and Refund Policy.

### 2. Admin Management Panel (`/admin`)
- **Operations Dashboard:** Live KPI cards with sparklines, recent order stream, fleet status, and quick shortcuts.
- **Live Fleet Tracking:** Real-time driver locations, traffic layers, filterable driver statuses (On Trip, Online, Offline).
- **Order Management:** Full lifecycle tracking (Pending, Dispatched, In Transit, Delivered, Cancelled) with filterable tables and modals.
- **Movers & Packers Management:** Relocation requests, team assignments, inventory manifests, and packing statuses.
- **Driver & Customer CRM:** Driver verification, KYC documents, earnings, customer accounts, and order history.
- **Vehicle & Fleet Management:** Maintenance schedules, plate tracking, capacity allocations, and vehicle inspection logs.
- **Finance & Payouts:** Payment logs, wallet balances, driver payout batches, and financial reporting.
- **System & Administration:** Roles & permissions (RBAC), audit logging, coupon codes, city/zone dispatch rules, CMS, and system configuration.

### 3. Realistic 3D Icon System
- Handcrafted, high-resolution transparent 3D icons across the sidebar navigation and dashboard cards.
- True RGBA alpha transparency without background color boxes or borders.
- Responsive scaling with subtle depth drop-shadows.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + Custom Tailwind Design System
- **Icons:** Custom 3D Transparent Assets + [Lucide Icons](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Routing:** [React Router v6](https://reactrouter.com/)

---

## 🏁 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/Devzign/Hexidrop_web_admin.git
cd Hexidrop_web_admin

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

- Public Web: `http://localhost:5173/`
- Admin Portal: `http://localhost:5173/admin`

### Production Build

```bash
# Type check and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Images, 3D icons, vehicle graphics
│   │   └── 3d/             # Realistic transparent 3D PNG assets
│   ├── components/
│   │   ├── admin/          # Admin UI components (Sidebar, Header, Icon3D, KpiCard, DataTable)
│   │   ├── public/         # Public website components (SiteNav, SiteFooter, VehicleIcon)
│   │   └── ui/             # Reusable UI primitives (Dialog, Dropdown, Button, etc.)
│   ├── hooks/              # Custom React hooks (useCrud, useMobile)
│   ├── layouts/            # PublicLayout & AdminLayout wrappers
│   ├── lib/                # Utility helpers, mock datasets, RBAC permissions
│   ├── pages/
│   │   ├── admin/          # Admin panel pages (Dashboard, LiveTracking, Orders, Drivers, etc.)
│   │   └── public/         # Public website pages (Home, Services, About, Careers, Legal)
│   ├── router/             # AppRouter routing configuration
│   ├── theme/              # Color palettes, typography, theme tokens
│   ├── main.tsx            # Application entry point
│   └── styles.css          # Global Tailwind styles & dark mode definitions
├── .env.example            # Environment variables template
├── .gitignore              # Ignored files and directories
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📄 License
Private and confidential. Hexidrop Logistics. All rights reserved.
