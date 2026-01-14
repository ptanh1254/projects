'use client'

import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

interface ProjectFilterProps {
  options: FilterOption[]
  activeFilter: string
  onFilterChange: (value: string) => void
  className?: string
}

export default function ProjectFilter({
  options,
  activeFilter,
  onFilterChange,
  className,
}: ProjectFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={cn(
            'px-5 py-2.5 rounded-lg font-medium transition-all duration-200',
            'border-2 text-sm',
            activeFilter === option.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600 hover:text-blue-600'
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span
              className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
                activeFilter === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// Mobile-friendly dropdown version
interface ProjectFilterDropdownProps {
  options: FilterOption[]
  activeFilter: string
  onFilterChange: (value: string) => void
  className?: string
}

export function ProjectFilterDropdown({
  options,
  activeFilter,
  onFilterChange,
  className,
}: ProjectFilterDropdownProps) {
  const activeOption = options.find((opt) => opt.value === activeFilter)

  return (
    <div className={cn('relative', className)}>
      <label htmlFor="category-filter" className="sr-only">
        Filter by category
      </label>
      <select
        id="category-filter"
        value={activeFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full px-4 py-2.5 pr-10 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}

// Search filter component
interface ProjectSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function ProjectSearch({
  value,
  onChange,
  placeholder = 'Search projects...',
  className,
}: ProjectSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor="project-search" className="sr-only">
        Search projects
      </label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        id="project-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
