import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'

    const variants = {
      default: 'border-transparent bg-gray-900 text-white hover:bg-gray-800',
      secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
      success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
      info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
      outline: 'text-gray-950 border-gray-200',
    }

    const sizes = {
      sm: 'text-xs px-2',
      md: 'text-xs px-2.5 py-0.5', // Modern badges are usually small/text-xs
      lg: 'text-sm px-3 py-1',
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Status badge helper component with predefined status mappings
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'draft' | 'published' | 'new' | 'viewed' | 'processed' | 'unread' | 'read' | 'active' | 'inactive'
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeProps['variant']; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      published: { variant: 'success', label: 'Published' },
      new: { variant: 'info', label: 'New' },
      viewed: { variant: 'warning', label: 'Viewed' },
      processed: { variant: 'success', label: 'Processed' },
      unread: { variant: 'danger', label: 'Unread' },
      read: { variant: 'secondary', label: 'Read' },
      active: { variant: 'success', label: 'Active' },
      inactive: { variant: 'secondary', label: 'Inactive' },
    }

    const config = statusConfig[status]

    return (
      <Badge ref={ref} variant={config.variant} {...props}>
        {config.label}
      </Badge>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

export default Badge