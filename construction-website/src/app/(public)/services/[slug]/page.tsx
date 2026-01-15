import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Card, CardContent } from '@/components/ui/Card'
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react'
import { prisma } from '@/lib/prisma' 

async function getService(slug: string) {
  const service = await prisma.service.findUnique({
    where: { slug, active: true }
  })

  if (!service) return null

  // Lấy danh sách các dịch vụ khác để hiển thị ở Sidebar
  const otherServices = await prisma.service.findMany({
    where: { 
        id: { not: service.id },
        active: true 
    },
    select: { title: true, slug: true },
    take: 5,
    orderBy: { order: 'asc' }
  })

  return { service, otherServices }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const data = await getService(slug)

  if (!data?.service) return { title: 'Service Not Found' }

  return {
    title: `${data.service.title} | Services`,
    description: data.service.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getService(slug)

  if (!data?.service) {
    notFound()
  }

  const { service, otherServices } = data

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.title, href: `/services/${service.slug}` },
  ]

  return (
    <>
      {/* Hero Section: Synchronized Dark Slate/Blue Gradient */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 lg:py-28 border-b border-slate-800">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <Container className="relative z-10">
          <Breadcrumb items={breadcrumbItems} className="mb-8 text-blue-200" />
          
          <div className="max-w-4xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
                Service Detail
             </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {service.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl leading-relaxed font-light">
              {service.shortDescription}
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-12">
              {service.imageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 aspect-video relative">
                  {/* Sử dụng thẻ img hoặc Next Image tùy cấu hình */}
                  <img 
                    src={service.imageUrl} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none prose-slate text-gray-600">
                <div dangerouslySetInnerHTML={{ __html: service.description }} />
              </div>

              {/* Key Benefits Block (Optional placeholder if not in DB) */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Why Choose This Service?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Professional & Experienced Team',
                    'High Quality Materials',
                    'On-time Completion',
                    'Transparent Pricing'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-slate-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Other Services Navigation */}
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-0 overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-lg">Other Services</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {otherServices.map((item) => (
                      <Link 
                        key={item.slug} 
                        href={`/services/${item.slug}`}
                        className="flex items-center justify-between p-4 hover:bg-blue-50 transition-colors group"
                      >
                        <span className="text-slate-600 font-medium group-hover:text-blue-700 transition-colors">
                            {item.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <Link href="/services" className="text-sm font-bold text-blue-600 hover:text-blue-800">
                        View All Services
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white text-center shadow-xl">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <Phone className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
                 <p className="text-blue-100 mb-8 leading-relaxed">
                    Speak with a human to filling out a form? call corporate office and we will connect you with a team member.
                 </p>
                 <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                 >
                    Contact Us Now
                 </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>
    </>
  )
}