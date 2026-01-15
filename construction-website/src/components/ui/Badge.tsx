import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'premium' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm'

    const variants = {
      default: 'border-transparent bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20',
      secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
      
      // Semantic Colors updated to subtle/modern palette
      success: 'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      warning: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200',
      danger: 'border-transparent bg-rose-100 text-rose-800 hover:bg-rose-200',
      info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
      
      outline: 'text-slate-950 border-slate-200 hover:bg-slate-50',
      
      // New Premium Variants
      premium: 'border-transparent bg-gradient-to-r from-slate-900 to-blue-900 text-white hover:shadow-lg hover:shadow-blue-900/20',
      glass: 'border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20', // For dark backgrounds
    }

    const sizes = {
      sm: 'text-[10px] px-2 h-5',
      md: 'text-xs px-2.5 py-0.5 h-6', 
      lg: 'text-sm px-3 py-1 h-7',
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

// Status badge helper component
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'draft' | 'published' | 'new' | 'viewed' | 'processed' | 'unread' | 'read' | 'active' | 'inactive'
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeProps['variant']; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      published: { variant: 'success', label: 'Published' },
      new: { variant: 'premium', label: 'New' }, // Highlight new items
      viewed: { variant: 'warning', label: 'Viewed' },
      processed: { variant: 'info', label: 'Processed' },
      unread: { variant: 'danger', label: 'Unread' },
      read: { variant: 'secondary', label: 'Read' },
      active: { variant: 'success', label: 'Active' },
      inactive: { variant: 'secondary', label: 'Inactive' },
    }

    const config = statusConfig[status] || { variant: 'default', label: status }

    return (
      <Badge ref={ref} variant={config.variant} {...props}>
        {config.label}
      </Badge>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

export default Badge