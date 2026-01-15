'use client'
import { useState, useEffect, JSX } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'

interface Service {
  id: string
  title: string
  slug: string
  shortDescription: string
  icon: string | null
}

// Default icon mapping
const getDefaultIcon = (slug: string) => {
  const icons: Record<string, JSX.Element> = {
    residential: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    commercial: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    industrial: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    renovation: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  }

  return icons[slug] || (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

export default function ServicesOverview() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services')
        if (res.ok) {
          const data = await res.json()
          setServices(data)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-slate-50">
        <Container>
          <div className="text-center">
            <h2 className="section-title text-slate-900">Our Services</h2>
            <p className="section-subtitle text-slate-500">Loading services...</p>
          </div>
        </Container>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className="section-padding bg-slate-50">
        <Container>
          <div className="text-center">
            <h2 className="section-title text-slate-900">Our Services</h2>
            <p className="section-subtitle text-slate-500">
              No services available at the moment.
            </p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="section-padding bg-slate-50">
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="section-subtitle text-slate-600 max-w-2xl mx-auto">
            Comprehensive construction solutions tailored to meet your unique needs and exceed expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.slice(0, 6).map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`}>
              <Card hover className="h-full cursor-pointer group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-200 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {getDefaultIcon(service.slug)}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 mb-6 leading-relaxed min-h-[48px]">{service.shortDescription}</p>
                  <div className="flex items-center text-blue-600 font-semibold text-sm uppercase tracking-wide group-hover:gap-2 transition-all">
                    Learn More
                    <svg className="w-4 h-4 ml-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300">
              View All Services
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}