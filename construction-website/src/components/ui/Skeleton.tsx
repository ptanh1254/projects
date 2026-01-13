import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200'

  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const skeletonStyle = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(baseStyles, variants[variant], className)}
      style={skeletonStyle}
      {...props}
    />
  ))

  return count > 1 ? <div className="space-y-2">{skeletons}</div> : skeletons[0]
}

// Preset skeleton components for common patterns
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <Skeleton variant="rectangular" height="200px" className="mb-4" />
      <Skeleton width="60%" className="mb-2" />
      <Skeleton width="80%" count={2} />
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }, (_, j) => (
            <Skeleton key={j} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = '40px' }: { size?: string }) {
  return <Skeleton variant="circular" width={size} height={size} />
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return <Skeleton count={lines} />
}
