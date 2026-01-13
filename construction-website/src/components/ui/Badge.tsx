import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center font-medium rounded-full transition-colors'

    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
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
      draft: { variant: 'warning', label: 'Draft' },
      published: { variant: 'success', label: 'Published' },
      new: { variant: 'info', label: 'New' },
      viewed: { variant: 'warning', label: 'Viewed' },
      processed: { variant: 'success', label: 'Processed' },
      unread: { variant: 'danger', label: 'Unread' },
      read: { variant: 'default', label: 'Read' },
      active: { variant: 'success', label: 'Active' },
      inactive: { variant: 'default', label: 'Inactive' },
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
