import { 
  LayoutDashboard, 
  Wheat, 
  TrendingUp, 
  Receipt, 
  Store, 
  Banknote,
  Inbox,
  Package,
  FileText,
  Truck,
  Search,
  PenTool,
  FileCheck,
  Users,
  Building2,
  BarChart3,
  ScrollText,
} from 'lucide-react';
import { SidebarItem, UserRole } from '../types';

interface RoleConfig {
  basePath: string;
  sidebarItems: SidebarItem[];
}

export const roleRoutes: Record<UserRole, RoleConfig> = {
  farmer: {
    basePath: '/farmer',
    sidebarItems: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/farmer/dashboard' },
      { label: 'Store Crop', icon: Wheat, path: '/farmer/store-crop' },
      { label: 'Price Forecast', icon: TrendingUp, path: '/farmer/price-forecast' },
      { label: 'My Receipts', icon: Receipt, path: '/farmer/receipts' },
      { label: 'Marketplace', icon: Store, path: '/farmer/marketplace' },
      { label: 'Loans', icon: Banknote, path: '/farmer/loans' },
    ],
  },
  warehouse: {
    basePath: '/warehouse',
    sidebarItems: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/warehouse/dashboard' },
      { label: 'Incoming Requests', icon: Inbox, path: '/warehouse/requests' },
      { label: 'Stored Inventory', icon: Package, path: '/warehouse/inventory' },
      { label: 'Generate Receipt', icon: FileText, path: '/warehouse/receipt' },
      { label: 'Dispatch', icon: Truck, path: '/warehouse/dispatch' },
    ],
  },
  buyer: {
    basePath: '/buyer',
    sidebarItems: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/buyer/dashboard' },
      { label: 'Browse Inventory', icon: Search, path: '/buyer/browse' },
      { label: 'Create Bid', icon: PenTool, path: '/buyer/create-bid' },
      { label: 'Contracts', icon: FileCheck, path: '/buyer/contracts' },
    ],
  },
  admin: {
    basePath: '/admin',
    sidebarItems: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { label: 'User Management', icon: Users, path: '/admin/users' },
      { label: 'Warehouse Approval', icon: Building2, path: '/admin/warehouse-approval' },
      { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { label: 'System Logs', icon: ScrollText, path: '/admin/logs' },
    ],
  },
};
