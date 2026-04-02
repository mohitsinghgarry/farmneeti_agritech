import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth
import LoginPage from '../pages/auth/LoginPage';

// Farmer
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import StoreCrop from '../pages/farmer/StoreCrop';
import PriceForecast from '../pages/farmer/PriceForecast';
import MyReceipts from '../pages/farmer/MyReceipts';
import Marketplace from '../pages/farmer/Marketplace';
import Loans from '../pages/farmer/Loans';

// Warehouse
import WarehouseDashboard from '../pages/warehouse/WarehouseDashboard';
import IncomingRequests from '../pages/warehouse/IncomingRequests';
import StoredInventory from '../pages/warehouse/StoredInventory';
import GenerateReceipt from '../pages/warehouse/GenerateReceipt';
import Dispatch from '../pages/warehouse/Dispatch';

// Buyer
import BuyerDashboard from '../pages/buyer/BuyerDashboard';
import BrowseInventory from '../pages/buyer/BrowseInventory';
import CreateBid from '../pages/buyer/CreateBid';
import Contracts from '../pages/buyer/Contracts';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import WarehouseApproval from '../pages/admin/WarehouseApproval';
import Analytics from '../pages/admin/Analytics';
import SystemLogs from '../pages/admin/SystemLogs';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Farmer Routes */}
      <Route element={<ProtectedRoute requiredRole="farmer" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/store-crop" element={<StoreCrop />} />
          <Route path="/farmer/price-forecast" element={<PriceForecast />} />
          <Route path="/farmer/receipts" element={<MyReceipts />} />
          <Route path="/farmer/marketplace" element={<Marketplace />} />
          <Route path="/farmer/loans" element={<Loans />} />
        </Route>
      </Route>

      {/* Warehouse Routes */}
      <Route element={<ProtectedRoute requiredRole="warehouse" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/warehouse/dashboard" element={<WarehouseDashboard />} />
          <Route path="/warehouse/requests" element={<IncomingRequests />} />
          <Route path="/warehouse/inventory" element={<StoredInventory />} />
          <Route path="/warehouse/receipt" element={<GenerateReceipt />} />
          <Route path="/warehouse/dispatch" element={<Dispatch />} />
        </Route>
      </Route>

      {/* Buyer Routes */}
      <Route element={<ProtectedRoute requiredRole="buyer" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/browse" element={<BrowseInventory />} />
          <Route path="/buyer/create-bid" element={<CreateBid />} />
          <Route path="/buyer/contracts" element={<Contracts />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/warehouse-approval" element={<WarehouseApproval />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/logs" element={<SystemLogs />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
