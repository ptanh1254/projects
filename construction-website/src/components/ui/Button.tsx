// components/ui/Button.tsx
'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // Thêm danger variant
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:bg-blue-800 border-transparent focus-visible:ring-blue-600',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent focus-visible:ring-gray-500',
  outline: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm focus-visible:ring-gray-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent focus-visible:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm active:bg-red-800 border-transparent focus-visible:ring-red-600',
};

const buttonSizes = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-10 px-4 py-2 text-sm gap-2 rounded-md',
  lg: 'h-11 px-8 text-base gap-2.5 rounded-md',
};

// Loading Spinner gọn gàng hơn
const Spinner = ({ className }: { className?: string }) => (
  <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
          // Variants & Sizes
          buttonVariants[variant],
          buttonSizes[size],
          // Width
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading && (
          <Spinner className={cn(
             "mr-2",
             size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
             // Nếu là nút outline/ghost, spinner màu xám, ngược lại màu trắng/current
             (variant === 'outline' || variant === 'ghost' || variant === 'secondary') ? 'text-gray-500' : 'text-current'
          )} />
        )}
        
        {!isLoading && leftIcon && (
          <span className={cn("inline-flex shrink-0", size === 'sm' ? '-ml-0.5' : '')}>
            {leftIcon}
          </span>
        )}
        
        <span>{children}</span>

        {!isLoading && rightIcon && (
          <span className={cn("inline-flex shrink-0", size === 'sm' ? '-mr-0.5' : '')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;