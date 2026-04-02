import React, { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { roleRoutes } from '../../routes/roleRoutes';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get sidebar items for current user role
  const sidebarItems = user ? roleRoutes[user.role].sidebarItems : [];

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-30">
        <Sidebar
          items={sidebarItems}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col transition-all duration-250"
        style={{
          marginLeft: sidebarCollapsed ? '72px' : '260px',
        }}
      >
        {/* Top Navbar */}
        <div className="sticky top-0 z-20">
          <TopNavbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto p-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
