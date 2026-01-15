'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ContactForm from '@/components/forms/ContactForm'
import { Card, CardContent } from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface Settings {
  companyName: string
  email: string
  phone: string
  address: string
  workingHours: string | null
  facebookUrl: string | null
  whatsappUrl: string | null
  linkedinUrl: string | null
  youtubeUrl: string | null
  googleMapsUrl: string | null
}

export default function ContactPage() {
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
    { label: 'Contact', href: '/contact' },
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
              Get In Touch
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed font-light">
              Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="section-padding bg-gray-50 py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Info</h2>

                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">Phone</h3>
                        <a href={`tel:${settings?.phone}`} className="text-lg text-blue-700 font-medium hover:underline">
                          {settings?.phone || 'Loading...'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">Email</h3>
                        <a href={`mailto:${settings?.email}`} className="text-lg text-blue-700 font-medium hover:underline break-all">
                          {settings?.email || 'Loading...'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">Address</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {settings?.address || 'Loading...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {settings && (settings.facebookUrl || settings.whatsappUrl) && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h2>
                    <div className="flex gap-3">
                      {settings.facebookUrl && (
                        <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us A Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
      
       {/* Map Section */}
       {settings?.googleMapsUrl && (
        <section className="h-96 w-full grayscale hover:grayscale-0 transition-all duration-700">
          <iframe
            src={settings.googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location"
          />
        </section>
      )}
    </>
  )
}