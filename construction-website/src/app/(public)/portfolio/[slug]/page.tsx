import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProjectGallery from '@/components/sections/ProjectGallery'
import ShareButton from '@/components/sections/ShareButton'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { MapPin, Ruler, Clock, User, ArrowRight, Calendar } from 'lucide-react'
import { prisma } from '@/lib/prisma' 

// Fetch data logic
async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      categoryData: true,
      images: { orderBy: { order: 'asc' } },
    }
  })

  if (!project) return null

  const relatedProjects = await prisma.project.findMany({
    where: {
      category: project.category,
      id: { not: project.id },
      status: 'published'
    },
    include: {
        categoryData: true,
        images: { take: 1 } 
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  return { project, relatedProjects }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await getProject(slug)

  if (!data?.project) return { title: 'Project Not Found' }

  return {
    title: `${data.project.title} | Projects`,
    description: data.project.description?.substring(0, 160) || '',
    openGraph: {
      images: data.project.images[0] ? [data.project.images[0].url] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getProject(slug)

  if (!data?.project || data.project.status !== 'published') {
    notFound()
  }

  const { project, relatedProjects } = data
  const categoryName = project.categoryData?.name || 'Uncategorized'
  const categorySlug = project.categoryData?.slug || '#'

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: project.title, href: `/portfolio/${project.slug}` },
  ]

  return (
    <>
      {/* Hero Section: Synchronized Dark Slate/Blue Gradient */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 lg:py-28 border-b border-slate-800">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <Container className="relative z-10">
          <Breadcrumb items={breadcrumbItems} className="mb-8 text-blue-200" />
          
          <div className="max-w-5xl">
            <Link href={`/portfolio?category=${categorySlug}`}>
                <Badge variant="outline" className="mb-6 text-blue-300 border-blue-400/50 hover:bg-blue-400/10 hover:text-blue-200 cursor-pointer transition-colors backdrop-blur-sm">
                  {categoryName}
                </Badge>
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-10 leading-tight tracking-tight text-white">
              {project.title}
            </h1>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
              <div className="flex flex-col group">
                <span className="text-blue-200/60 text-sm mb-2 uppercase tracking-wider font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </span>
                <span className="font-semibold text-lg text-white">{project.location}</span>
              </div>
              
              {project.area && (
                <div className="flex flex-col group">
                  <span className="text-blue-200/60 text-sm mb-2 uppercase tracking-wider font-medium flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Area
                  </span>
                  <span className="font-semibold text-lg text-white">{project.area.toLocaleString()} m²</span>
                </div>
              )}

              {project.client && (
                <div className="flex flex-col group">
                  <span className="text-blue-200/60 text-sm mb-2 uppercase tracking-wider font-medium flex items-center gap-2">
                    <User className="w-4 h-4" /> Client
                  </span>
                  <span className="font-semibold text-lg text-white">{project.client}</span>
                </div>
              )}

              <div className="flex flex-col group">
                <span className="text-blue-200/60 text-sm mb-2 uppercase tracking-wider font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Year
                </span>
                <span className="font-semibold text-lg text-white">
                  {new Date(project.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Gallery & Description */}
            <div className="lg:col-span-8 space-y-12">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 bg-slate-100">
                <ProjectGallery images={project.images} projectTitle={project.title} />
              </div>
              
              <div className="prose prose-lg max-w-none prose-slate text-gray-600">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">About the Project</h3>
                <div dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            </div>

            {/* Right Column: Sidebar info */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="sticky top-24 border-0 shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100">
                <CardContent className="p-8 space-y-8">
                  {/* Detailed Info List */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                        Project Overview
                    </h3>
                    <dl className="space-y-6">
                      <div className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0 group">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <MapPin className="w-5 h-5 shrink-0" />
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500 mb-1">Location</dt>
                            <dd className="font-medium text-slate-900">{project.location}</dd>
                        </div>
                      </div>

                      {project.area && (
                        <div className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0 group">
                           <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Ruler className="w-5 h-5 shrink-0" />
                           </div>
                            <div>
                                <dt className="text-sm text-gray-500 mb-1">Area</dt>
                                <dd className="font-medium text-slate-900">{project.area.toLocaleString()} m²</dd>
                            </div>
                        </div>
                      )}

                      {project.duration && (
                         <div className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0 group">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Clock className="w-5 h-5 shrink-0" />
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500 mb-1">Duration</dt>
                                <dd className="font-medium text-slate-900">{project.duration}</dd>
                            </div>
                        </div>
                      )}

                      {project.client && (
                         <div className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0 group">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <User className="w-5 h-5 shrink-0" />
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500 mb-1">Client</dt>
                                <dd className="font-medium text-slate-900">{project.client}</dd>
                            </div>
                         </div>
                      )}
                    </dl>
                  </div>

                  {/* CTA Box */}
                  <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-6 rounded-xl text-white shadow-lg">
                    <h4 className="font-bold text-lg mb-2">Inspired by this?</h4>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                      Let&apos;s bring your vision to life. Contact us for a consultation today.
                    </p>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full px-4 py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-all group"
                    >
                      Get a Free Quote
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Share Project</h4>
                    <ShareButton
                      title={project.title}
                      text={`Check out ${project.title}`}
                      url={`/portfolio/${project.slug}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
           </div>
        </Container>
      </section>

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
           {/* Add your related projects grid here reusing ProjectCard */}
        </section>
      )}
    </>
  )
}