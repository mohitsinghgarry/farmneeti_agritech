import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBg: string;
  iconColor?: string;
  subtext?: string;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBg,
  iconColor = 'text-green-600',
  subtext,
  loading = false,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading || typeof value !== 'number') return;

    let start = 0;
    const end = value;
    const duration = 800;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-32" />
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  changeType === 'positive' && 'text-green-600',
                  changeType === 'negative' && 'text-red-600',
                  changeType === 'neutral' && 'text-gray-600'
                )}
              >
                {change}
              </span>
            </div>
          )}
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
