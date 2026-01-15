import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  variant?: 'default' | 'glass' | 'dark' | 'gradient'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = false, variant = 'default', ...props }, ref) => {
    
    const variants = {
      default: 'border-slate-200 bg-white text-slate-950 shadow-sm',
      glass: 'border-white/20 bg-white/80 backdrop-blur-md text-slate-900 shadow-lg', // Glassmorphism
      dark: 'border-slate-800 bg-slate-900 text-white shadow-xl', // Dark theme card
      gradient: 'border-transparent bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl', // Hero style
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border',
          variants[variant],
          hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
          // Special hover effect for gradient card to make it glow
          (hover && variant === 'gradient') && 'hover:shadow-blue-900/30',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6 md:p-8', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-bold leading-none tracking-tight text-xl', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 md:p-8 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 md:p-8 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card