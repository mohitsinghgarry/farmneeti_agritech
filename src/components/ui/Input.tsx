import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon: LeftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-11 px-4 border rounded-lg transition-all focus:outline-none focus:ring-2',
              LeftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-green-600 focus:ring-green-100',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
        {helperText && !error && <p className="text-gray-400 text-xs mt-1.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
