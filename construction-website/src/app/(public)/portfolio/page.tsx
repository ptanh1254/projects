'use client'

import { useState, useEffect, useMemo } from 'react'
import { Metadata } from 'next'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProjectCard from '@/components/sections/ProjectCard'
import ProjectFilter, { FilterOption, ProjectFilterDropdown, ProjectSearch } from '@/components/sections/ProjectFilter'
import Spinner from '@/components/ui/Spinner'

interface ProjectImage {
  id: string
  url: string
  publicId: string
  order: number
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  location: string
  area: number | null
  duration: string | null
  client: string | null
  images: ProjectImage[]
  featured: boolean
  status: string
  createdAt: string
  updatedAt: string
}

const categoryLabels: Record<string, string> = {
  all: 'All Projects',
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  renovation: 'Renovation',
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        if (res.ok) {
          const data = await res.json()
          // API returns { projects: [], total, page, totalPages }
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Calculate category counts
  const filterOptions = useMemo<FilterOption[]>(() => {
    const counts: Record<string, number> = {
      all: Array.isArray(projects) ? projects.length : 0,
      residential: 0,
      commercial: 0,
      industrial: 0,
      renovation: 0,
    }

    if (Array.isArray(projects)) {
      projects.forEach((project) => {
        if (counts[project.category] !== undefined) {
          counts[project.category]++
        }
      })
    }

    return Object.keys(categoryLabels).map((key) => ({
      value: key,
      label: categoryLabels[key],
      count: counts[key],
    }))
  }, [projects])

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      return []
    }

    return projects.filter((project) => {
      // Filter by category
      if (activeFilter !== 'all' && project.category !== activeFilter) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [projects, activeFilter, searchQuery])

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-8" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Portfolio
            </h1>
            <p className="text-xl text-blue-100">
              Explore our diverse range of successfully completed construction projects across residential, commercial, and industrial sectors.
            </p>
          </div>
        </Container>
      </section>

      {/* Projects Section */}
      <section className="section-padding bg-gray-50">
        <Container>
          {loading ? (
            <div className="text-center py-20">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          ) : (
            <>
              {/* Filters and Search */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <ProjectSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by title, description, or location..."
                />

                {/* Desktop Filter Buttons */}
                <div className="hidden md:flex justify-center">
                  <ProjectFilter
                    options={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                </div>

                {/* Mobile Filter Dropdown */}
                <div className="md:hidden">
                  <ProjectFilterDropdown
                    options={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                </div>
              </div>

              {/* Results Info */}
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  {filteredProjects.length === 0 ? (
                    'No projects found'
                  ) : (
                    <>
                      Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span>{' '}
                      {filteredProjects.length === 1 ? 'project' : 'projects'}
                      {searchQuery && (
                        <span>
                          {' '}
                          matching "<span className="font-semibold text-gray-900">{searchQuery}</span>"
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      slug={project.slug}
                      category={project.category}
                      location={project.location}
                      area={project.area}
                      duration={project.duration}
                      images={project.images}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Projects Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? 'Try adjusting your search terms or filters'
                      : 'No projects are available at the moment'}
                  </p>
                  {(searchQuery || activeFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setActiveFilter('all')
                      }}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  )
}
