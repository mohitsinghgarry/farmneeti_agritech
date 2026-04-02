import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarItem } from '../../types';
import { cn } from '../../utils/cn';

interface MobileNavProps {
  items: SidebarItem[];
}

const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Show only first 5 items on mobile
  const mobileItems = items.slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="flex items-center justify-around h-16 px-2">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors relative',
                active ? 'text-green-600' : 'text-gray-600'
              )}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-600 rounded-b-full" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
