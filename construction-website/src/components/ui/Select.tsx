// components/ui/Select.tsx
'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const selectSizes = {
  sm: 'pl-3 pr-8 py-1.5 text-sm',
  md: 'pl-4 pr-10 py-2 text-base',
  lg: 'pl-4 pr-10 py-3 text-lg',
};

// Icon mũi tên Chevron Down
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      id,
      size = 'md',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const helperTextId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
             className={cn(
              "block text-sm font-medium transition-colors leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-red-500" : "text-gray-700"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
            className={cn(
              // Base styles - appearance-none để ẩn mũi tên mặc định của trình duyệt
              'flex w-full appearance-none rounded-md border border-gray-200 bg-white transition-all duration-200 ease-in-out',
              'text-gray-900 placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600/10',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200',
              // Sizes
              selectSizes[size],
              // Error state
              error && 'border-red-300 text-red-900 focus-visible:border-red-500 focus-visible:ring-red-500/10',
              className
            )}
            {...props}
          >
            {children}
          </select>
          
          {/* Custom Arrow Icon */}
          <div className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500 transition-colors peer-focus:text-blue-600",
             size === 'sm' ? 'right-2' : 'right-3',
             disabled && "text-gray-300",
             error && "text-red-400 peer-focus:text-red-500"
          )}>
            <ChevronDownIcon className={cn(
               size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
            )} />
          </div>
        </div>

        {error ? (
          <p id={errorId} className="text-sm font-medium text-red-500 animate-in fade-in-50 slide-in-from-top-1">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperTextId} className="text-sm text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;