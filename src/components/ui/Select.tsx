import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  subtitle?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full h-11 px-4 border rounded-lg flex items-center justify-between transition-all focus:outline-none focus:ring-2',
            error
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-gray-300 focus:border-green-600 focus:ring-green-100'
          )}
        >
          <span className={cn('flex items-center gap-2', !selectedOption && 'text-gray-400')}>
            {selectedOption ? (
              <>
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                {selectedOption.label}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors',
                  option.value === value && 'bg-green-50'
                )}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span className="text-xl">{option.icon}</span>}
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-xs text-gray-500">{option.subtitle}</div>
                    )}
                  </div>
                </div>
                {option.value === value && <Check className="w-5 h-5 text-green-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
    </div>
  );
};

export default Select;
