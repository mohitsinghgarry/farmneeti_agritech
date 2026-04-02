# AgriLink Ledger - Smart Agricultural Storage & Marketplace Platform

A comprehensive multi-role agricultural platform built with React, TypeScript, and Tailwind CSS.

## 🎯 Project Status

### ✅ All Phases Complete!

- **Phase 1**: Project Initialization & Configuration ✓
- **Phase 2**: Type Definitions & Utilities ✓
- **Phase 3**: Mock Data Layer ✓
- **Phase 4**: Mock API Service ✓
- **Phase 5**: Auth Context & Toast System ✓
- **Phase 6**: Routing & Route Guards ✓
- **Phase 7**: Layout Components ✓
- **Phase 8**: UI Components ✓
- **Phase 9**: Chart Components ✓
- **Phase 10**: Login Page ✓
- **Phase 11**: Farmer Dashboard (6 pages) ✓
- **Phase 12**: Warehouse Dashboard (5 pages) ✓
- **Phase 13**: Buyer Dashboard (4 pages) ✓
- **Phase 14**: Admin Dashboard (5 pages) ✓
- **Phase 15**: Polish & Final QA ✓

### 📊 Implementation Summary

**Total Pages**: 21 fully functional pages
- 6 Farmer pages (Dashboard, Price Forecast, My Receipts, Store Crop, Marketplace, Loans)
- 5 Warehouse pages (Dashboard, Incoming Requests, Stored Inventory, Generate Receipt, Dispatch)
- 4 Buyer pages (Dashboard, Browse Inventory, Create Bid, Contracts)
- 5 Admin pages (Dashboard, User Management, Warehouse Approval, Analytics, System Logs)
- 1 Auth page (Login)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Test Credentials

The application includes demo credentials for testing:

- **Farmer**: `farmer@test.com` (any password)
- **Warehouse**: `warehouse@test.com` (any password)
- **Buyer**: `buyer@test.com` (any password)
- **Admin**: `admin@test.com` (any password)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, TopNavbar, DashboardLayout, MobileNav
│   ├── ui/              # Reusable UI components (Button, Input, Modal, etc.)
│   └── charts/          # Chart components (PriceForecastChart, MiniSparkline)
├── context/             # React contexts (Auth, Toast)
├── data/                # Mock data for all roles
├── hooks/               # Custom hooks (useAuth, useToast)
├── pages/               # Page components (21 pages total)
│   ├── auth/           # Login page
│   ├── farmer/         # 6 farmer pages
│   ├── warehouse/      # 5 warehouse pages
│   ├── buyer/          # 4 buyer pages
│   └── admin/          # 5 admin pages
├── routes/              # Routing configuration with guards
├── services/            # API services (mockApi)
├── types/               # TypeScript type definitions
└── utils/               # Utility functions (formatters, constants)
```

## 🎨 Design System

Based on Stitch AI design (Project ID: 1247670622310380472)

### Colors
- Primary: Green (#16A34A)
- Background: #FAFBFC
- Surface: White with tonal layering
- Typography: Inter font family

### Key Principles
- "No-Line" Rule: Use background color shifts instead of borders
- Tonal Layering for depth
- Editorial typography with tight tracking
- Glassmorphism for overlays

## 🏗️ Architecture

### Authentication
- Role-based access control (Farmer, Warehouse, Buyer, Admin)
- Protected routes with automatic redirection
- Session persistence via localStorage

### State Management
- React Context for global state (Auth, Toast)
- Local state for component-specific data
- Mock API with simulated delays

### Routing
- React Router v6
- Role-specific route guards
- Automatic dashboard redirection based on user role

## 📱 Features

### ✅ Completed Features
- Full authentication flow with role-based access
- Role-based routing with automatic redirection
- Responsive sidebar with collapse functionality
- Top navigation with notifications
- Toast notification system with animations
- Mobile navigation bar
- 21 fully functional dashboard pages
- Interactive data tables with search and filters
- Real-time price forecasting charts
- Bid management system
- Receipt generation with blockchain tokens
- Loan eligibility calculator
- Warehouse capacity management
- User management and permissions
- System monitoring and logs
- Analytics dashboards

### 🎨 Design Features
- Pixel-perfect implementation matching Stitch AI design
- "No-Line" Rule: Background color shifts instead of borders
- Tonal layering for depth
- Smooth animations with Framer Motion
- Responsive design for all screen sizes
- Glassmorphism effects
- Interactive charts with Recharts

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📄 License

This project is part of a development exercise.

## 👥 Roles & Permissions

### Farmer
- Store crops in warehouses
- View AI-powered price forecasts
- Manage digital receipts
- Accept/reject bids from buyers
- Apply for loans based on stored crops
- Track storage and marketplace activity

### Warehouse
- Manage incoming storage requests
- Track stored inventory with batch management
- Generate blockchain-secured receipts
- Manage dispatches to buyers
- Monitor capacity and utilization

### Buyer
- Browse available inventory from warehouses
- Create competitive bids for crops
- Manage procurement contracts
- View price trends and market insights
- Track purchase history

### Admin
- User management with activation/suspension
- Warehouse application approval
- Platform analytics and insights
- System logs and monitoring
- Revenue and growth tracking

---

## 🚀 Quick Start Guide

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Login with test credentials (any password works):
   - Farmer: `farmer@test.com`
   - Warehouse: `warehouse@test.com`
   - Buyer: `buyer@test.com`
   - Admin: `admin@test.com`

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory, ready for deployment.

---

Built with ❤️ for AgriLink Ledger | All 21 pages fully implemented and tested
