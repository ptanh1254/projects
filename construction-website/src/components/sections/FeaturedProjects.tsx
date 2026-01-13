'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface ProjectImage {
  url: string
  publicId: string
}

interface Project {
  id: string
  title: string
  slug: string
  category: string
  location: string
  images: ProjectImage[]
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects/featured')
        if (res.ok) {
          const data = await res.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Loading projects...</p>
          </div>
        </Container>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              No featured projects available at the moment.
            </p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Showcasing our commitment to excellence in every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, 4).map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <Card hover className="overflow-hidden group cursor-pointer h-full">
                <div className="relative aspect-4-3 overflow-hidden">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                  <Badge
                    variant="info"
                    className="absolute top-4 left-4 z-10"
                  >
                    {project.category}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.location}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/projects">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View All Projects
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
