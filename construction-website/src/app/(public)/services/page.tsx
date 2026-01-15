'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ServiceCard from '@/components/sections/ServiceCard'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import CTASection from '@/components/sections/CTASection'
import Spinner from '@/components/ui/Spinner'
import { motion } from 'framer-motion' // Added for smooth fade-in

interface Service {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  icon: string | null
  imageUrl: string | null
  order: number
  active: boolean
}

export default function ServicesPage() {
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

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
  ]

  return (
    <>
      {/* Synchronized Hero Section: Dark Slate/Blue Gradient */}
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
              Our Services
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed font-light">
              Comprehensive construction solutions tailored to your needs. From residential homes to large-scale commercial projects.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="section-padding bg-gray-50 py-16 md:py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">What We Offer</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We provide a full range of construction services with expertise, quality, and dedication to excellence.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  slug={service.slug}
                  shortDescription={service.shortDescription}
                  icon={service.icon}
                  imageUrl={service.imageUrl}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
      
      <section className="section-padding bg-white py-16 md:py-24 border-t border-gray-100">
        <Container>
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Process</h2>
             <p className="text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures quality, transparency, and client satisfaction at every stage.
            </p>
          </div>
          <ProcessTimeline />
        </Container>
      </section>

      {/* Reused Stats/Why Choose Us with cleaner UI */}
      <section className="section-padding bg-gray-50 py-16 md:py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Why Choose Us</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Experience the difference of working with a construction company that truly cares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
                title: 'Quality Guaranteed',
                description: 'We use only premium materials and employ skilled craftsmen.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: 'On-Time Delivery',
                description: 'We respect your timeline and complete projects as scheduled.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
                title: 'Experienced Team',
                description: 'Over 15 years of expertise in construction industry.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: 'Fair Pricing',
                description: 'Transparent quotes with no hidden costs or surprises.',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  )
}