interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
}

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  // Auto-detect variant from status if not provided
  let autoVariant = variant
  if (variant === 'default') {
    const statusLower = status.toLowerCase()
    if (statusLower === 'published' || statusLower === 'active' || statusLower === 'completed') {
      autoVariant = 'success'
    } else if (statusLower === 'draft' || statusLower === 'pending' || statusLower === 'new') {
      autoVariant = 'warning'
    } else if (statusLower === 'inactive' || statusLower === 'cancelled') {
      autoVariant = 'danger'
    } else if (statusLower === 'viewed' || statusLower === 'read') {
      autoVariant = 'info'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[autoVariant]}`}
    >
      {status}
    </span>
  )
}
