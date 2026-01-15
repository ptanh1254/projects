import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'slate' | 'accent'
}

export default function Spinner({ size = 'md', color = 'primary', className, ...props }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }

  const colors = {
    primary: 'text-blue-600', // Matches the Blue-900 theme highlights
    white: 'text-white',      // For use on Dark Blue backgrounds
    slate: 'text-slate-900',  // For use on light backgrounds
    accent: 'text-amber-500', // For accent situations
  }

  return (
    <div className={cn('inline-block', className)} role="status" aria-label="Loading" {...props}>
      <svg
        className={cn('animate-spin', sizes[size], colors[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Fullscreen spinner overlay with blur effect
export function SpinnerOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/50">
      <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl">
        <Spinner size="xl" color="primary" />
        {message && (
          <p className="text-sm font-semibold text-slate-700 animate-pulse uppercase tracking-wider">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}