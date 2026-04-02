import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { SidebarItem } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarProps {
  items: SidebarItem[];
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, collapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-250 ease-in-out relative',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <Leaf className="w-6 h-6 text-green-600 flex-shrink-0" />
          {!collapsed && (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-lg font-bold text-green-600">AgriLink</span>
              <span className="text-lg font-bold text-gray-800">Ledger</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto py-4">
        {!collapsed && (
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              MAIN MENU
            </p>
          </div>
        )}
        <nav className="space-y-1 px-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-150 relative group',
                  active
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-600 rounded-r-full transition-all duration-150" />
                )}
                <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', collapsed && 'mx-auto')} />
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - User */}
      <div className="border-t border-gray-100 p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {user ? getInitials(user.name) : 'U'}
          </div>
          {!collapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
        {collapsed && (
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
          >
            <LogOut className="w-4 h-4" />
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50">
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
