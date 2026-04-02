import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
