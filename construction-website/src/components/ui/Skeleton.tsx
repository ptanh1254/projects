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
  // Use a more subtle pulse color
  const baseStyles = 'animate-pulse bg-gray-200/80 rounded-md'

  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const skeletonStyle = {
    width: width,
    height: height,
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(baseStyles, variants[variant], className)}
      style={skeletonStyle}
      {...props}
    />
  ))

  return count > 1 ? <div className="space-y-3">{skeletons}</div> : skeletons[0]
}

// Preset skeleton components for common patterns
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <Skeleton variant="rectangular" className="h-[200px] w-full rounded-lg" />
        <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4 border-b border-gray-200 pb-4">
         {Array.from({ length: columns }, (_, j) => (
            <Skeleton key={`header-${j}`} className="h-6 flex-1" />
          ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex gap-4">
            {Array.from({ length: columns }, (_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
            ))}
            </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = '40px' }: { size?: string }) {
  return <Skeleton variant="circular" width={size} height={size} />
}