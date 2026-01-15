'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import StatsSection from '@/components/sections/StatsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'
import { motion } from 'framer-motion'

interface Settings {
  companyName: string
  tagline: string | null
  description: string | null
  email: string
  phone: string
  address: string
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
  ]

  return (
    <>
      {/* Synchronized Hero Section */}
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
              About {settings?.companyName || 'Us'}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed font-light">
              {settings?.tagline || 'Building excellence since 2000'}
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  {settings?.description ||
                    'We are a leading construction company with over 20 years of experience in delivering exceptional residential, commercial, and industrial projects.'}
                </p>
                <p>
                  Our team of skilled professionals is dedicated to transforming your vision into reality with precision, quality, and attention to detail.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  'Licensed and insured professionals',
                  'Comprehensive project management',
                  'Quality materials and craftsmanship',
                  'Transparent pricing and communication',
                ].map((point, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[500px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
               {/* Decorative Gradient Background for Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center">
                 <span className="text-white/20 text-9xl font-bold">{settings?.companyName?.charAt(0) || 'C'}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}