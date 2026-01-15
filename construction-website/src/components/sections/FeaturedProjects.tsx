'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, categoriesRes] = await Promise.all([
          fetch('/api/projects/featured'),
          fetch('/api/categories'),
        ])

        if (projectsRes.ok) {
          const data = await projectsRes.json()
          setProjects(data)
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to get category name
  const getCategoryName = (categorySlug: string) => {
    const cat = categories.find((c) => c.slug === categorySlug)
    return cat?.name || categorySlug
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center">
            <h2 className="section-title text-slate-900">Featured Projects</h2>
            <p className="section-subtitle text-slate-500">Loading projects...</p>
          </div>
        </Container>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="section-padding bg-white">
        <Container>
          <div className="text-center">
            <h2 className="section-title text-slate-900">Featured Projects</h2>
            <p className="section-subtitle text-slate-500">
              No featured projects available at the moment.
            </p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white border-b border-slate-100">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
          <p className="section-subtitle text-slate-600 max-w-2xl mx-auto">
            Showcasing our commitment to excellence and innovation in every structure we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, 4).map((project) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`}>
              <Card hover className="overflow-hidden group cursor-pointer h-full border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 bg-white">
                <div className="relative aspect-4-3 overflow-hidden">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">
                      No Image
                    </div>
                  )}
                  {/* Gradient Overlay instead of dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Badge
                    variant="info"
                    className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border-0 font-semibold"
                  >
                    {getCategoryName(project.category)}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{project.location}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link href="/portfolio">
            <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-sm">
              View All Projects
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}