import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex', className)}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {/* Home Link */}
        <li>
          <Link
            href="/"
            className="group flex items-center gap-1 text-white/60 transition-colors hover:text-white"
          >
            <svg 
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              <svg 
                className="mx-2 h-4 w-4 text-white/30" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>

              {isLast || !item.href ? (
                <span
                  className="font-medium text-white cursor-default"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-white/60 transition-colors hover:text-white hover:underline hover:decoration-white/50 hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}