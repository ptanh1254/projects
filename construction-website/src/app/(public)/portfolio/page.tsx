'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProjectCard from '@/components/sections/ProjectCard'
import ProjectFilter, { FilterOption, ProjectFilterDropdown, ProjectSearch } from '@/components/sections/ProjectFilter'
import Spinner from '@/components/ui/Spinner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

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
  categoryData: Category // Relation from Prisma
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

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, categoriesRes] = await Promise.all([
          fetch('/api/projects?limit=100'),
          fetch('/api/categories'),
        ])

        if (projectsRes.ok) {
          const data = await projectsRes.json()
          setProjects(data.projects || [])
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filterOptions = useMemo<FilterOption[]>(() => {
    const counts: Record<string, number> = { all: 0 }
    
    categories.forEach((cat) => { counts[cat.slug] = 0 })

    if (Array.isArray(projects)) {
      counts.all = projects.length
      projects.forEach((project) => {
        const catSlug = project.categoryData?.slug
        if (catSlug && counts[catSlug] !== undefined) {
          counts[catSlug]++
        }
      })
    }

    const options: FilterOption[] = [
      { value: 'all', label: 'All Projects', count: counts.all },
    ]

    categories.forEach((cat) => {
      options.push({
        value: cat.slug,
        label: cat.name,
        count: counts[cat.slug] || 0,
      })
    })

    return options
  }, [projects, categories])

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return []

    return projects.filter((project) => {
      if (activeFilter !== 'all') {
        if (project.categoryData?.slug !== activeFilter) return false
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          project.title.toLowerCase().includes(query) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          (project.location && project.location.toLowerCase().includes(query))
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
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <Container className="relative z-10">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-blue-200" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Selected Works
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed font-light">
              Explore our collection of architectural and construction projects, where we turn dreams of perfect living spaces into reality.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 min-h-screen">
        <Container>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-500 font-medium">Loading projects...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between sticky top-20 z-20 bg-gray-50/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 transition-all">
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                  <ProjectFilter
                    options={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                </div>
                 <div className="md:hidden w-full">
                  <ProjectFilterDropdown
                    options={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                </div>
                <div className="w-full md:w-auto md:min-w-[300px]">
                  <ProjectSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search projects..."
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 text-gray-500 text-sm font-medium"
              >
                Showing {filteredProjects.length} projects
                {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
                {activeFilter !== 'all' && <span> in selected category</span>}
              </motion.div>

              <AnimatePresence mode='wait'>
                {filteredProjects.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProjectCard
                          id={project.id}
                          title={project.title}
                          slug={project.slug}
                          category={project.categoryData?.slug || ''}
                          categoryName={project.categoryData?.name || 'Uncategorized'}
                          location={project.location}
                          area={project.area}
                          duration={project.duration}
                          images={project.images}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6 text-gray-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? `No results matching "${searchQuery}". Please try another keyword.` 
                        : 'There are no projects in this category yet.'}
                    </p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveFilter('all') }}
                      className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </Container>
      </section>
    </>
  )
}