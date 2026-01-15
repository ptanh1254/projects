// components/ui/Input.tsx
'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils'; // Hãy đảm bảo bạn đã tạo file này theo hướng dẫn trên

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      size = 'md',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium transition-colors leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-red-500" : "text-gray-700"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600",
              error && "text-red-400 group-focus-within:text-red-500",
              disabled && "text-gray-300"
            )}>
              {React.isValidElement(leftIcon)
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                 // @ts-expect-error
                ? React.cloneElement(leftIcon, { className: cn(iconSizes[size], leftIcon.props.className) })
                : leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
            className={cn(
              // Base styles
              'flex w-full rounded-md border border-gray-200 bg-white transition-all duration-200 ease-in-out',
              'placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-4 focus-visible:ring-blue-600/10',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200',
              // Sizes
              inputSizes[size],
              // Padding for icons
              leftIcon && (size === 'sm' ? 'pl-9' : 'pl-11'),
              rightIcon && (size === 'sm' ? 'pr-9' : 'pr-11'),
              // Error state
              error && 'border-red-300 text-red-900 placeholder:text-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600",
              error && "text-red-400 group-focus-within:text-red-500",
              disabled && "text-gray-300"
            )}>
               {React.isValidElement(rightIcon)
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                 // @ts-expect-error
                ? React.cloneElement(rightIcon, { className: cn(iconSizes[size], rightIcon.props.className) })
                : rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;