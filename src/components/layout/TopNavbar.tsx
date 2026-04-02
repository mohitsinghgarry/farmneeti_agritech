import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { timeAgo } from '../../utils/formatDate';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
}

const TopNavbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'New bid received for Onion - 30Qt',
      type: 'info',
      time: '2024-01-15T10:25:00',
      read: false,
    },
    {
      id: '2',
      message: 'Storage request approved',
      type: 'success',
      time: '2024-01-15T09:15:00',
      read: false,
    },
    {
      id: '3',
      message: 'Price alert: Potato dropped 2%',
      type: 'warning',
      time: '2024-01-15T07:30:00',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate breadcrumb from path
  const getBreadcrumb = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return ['Dashboard'];
    
    const formatted = paths.map(path => 
      path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    
    return formatted;
  };

  const breadcrumbs = getBreadcrumb();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close other dropdown when opening one
  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? 'font-semibold text-gray-900'
                  : 'text-gray-500'
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationToggle}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[360px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Mark all read
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === 'success'
                            ? 'bg-green-500'
                            : notification.type === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {timeAgo(notification.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={handleUserMenuToggle}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
              {user ? getInitials(user.name) : 'U'}
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-[240px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </button>
              </div>
              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
