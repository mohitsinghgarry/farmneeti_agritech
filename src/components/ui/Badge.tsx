import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  dot = false,
  className,
}) => {
  const variants = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
    primary: 'bg-green-600 text-white border-green-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
    primary: 'bg-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};

export default Badge;
