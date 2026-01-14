import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProjectGallery from '@/components/sections/ProjectGallery'
import ShareButton from '@/components/sections/ShareButton'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'

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
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  renovation: 'Renovation',
}

const categoryColors: Record<string, 'info' | 'success' | 'warning' | 'secondary'> = {
  residential: 'info',
  commercial: 'success',
  industrial: 'warning',
  renovation: 'secondary',
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    // API returns { project, relatedProjects }
    return data.project || null
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.title,
    description: project.description.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
      images: project.images[0] ? [project.images[0].url] : [],
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project || project.status !== 'published') {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: project.title, href: `/portfolio/${project.slug}` },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="max-w-4xl">
            <Badge
              variant={categoryColors[project.category] || 'info'}
              size="lg"
              className="mb-4"
            >
              {categoryLabels[project.category] || project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-300">
              {/* Location */}
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{project.location}</span>
              </div>

              {/* Area */}
              {project.area && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                  <span>{project.area.toLocaleString()} m²</span>
                </div>
              )}

              {/* Duration */}
              {project.duration && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{project.duration}</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                <ProjectGallery
                  images={project.images}
                  projectTitle={project.title}
                />
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Project</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {project.description}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Project Details
                    </h3>
                    <dl className="space-y-4">
                      {/* Category */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">
                          Category
                        </dt>
                        <dd>
                          <Badge variant={categoryColors[project.category] || 'info'}>
                            {categoryLabels[project.category] || project.category}
                          </Badge>
                        </dd>
                      </div>

                      {/* Location */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">
                          Location
                        </dt>
                        <dd className="text-gray-900">{project.location}</dd>
                      </div>

                      {/* Area */}
                      {project.area && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            Project Area
                          </dt>
                          <dd className="text-gray-900">
                            {project.area.toLocaleString()} m²
                          </dd>
                        </div>
                      )}

                      {/* Duration */}
                      {project.duration && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            Duration
                          </dt>
                          <dd className="text-gray-900">{project.duration}</dd>
                        </div>
                      )}

                      {/* Client */}
                      {project.client && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">
                            Client
                          </dt>
                          <dd className="text-gray-900">{project.client}</dd>
                        </div>
                      )}

                      {/* Completion Date */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">
                          Completed
                        </dt>
                        <dd className="text-gray-900">
                          {new Date(project.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* CTA Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Interested in a similar project?
                    </h4>
                    <a
                      href="/contact"
                      className="block w-full px-4 py-2.5 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Get a Quote
                    </a>
                  </div>

                  {/* Share Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Share this project
                    </h4>
                    <div className="flex gap-2">
                      <ShareButton
                        title={project.title}
                        text={project.description}
                        url={`/portfolio/${project.slug}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Projects Section - Optional */}
      <section className="section-padding bg-gray-50">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Related Projects</h2>
            <p className="text-gray-600">
              Explore more projects in the {categoryLabels[project.category]?.toLowerCase() || project.category} category
            </p>
          </div>
          <div className="text-center">
            <a
              href={`/portfolio?category=${project.category}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View More Projects
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </Container>
      </section>
    </>
  )
}
