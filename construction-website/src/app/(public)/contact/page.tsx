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
                     {settings && (settings.facebookUrl || settings.whatsappUrl || settings.linkedinUrl || settings.youtubeUrl) && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h2>
                    <div className="flex gap-3 flex-wrap">
                      {/* Facebook */}
                      {settings.facebookUrl && (
                        <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                      )}

                      {/* WhatsApp */}
                      {settings.whatsappUrl && (
                        <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </a>
                      )}

                      {/* LinkedIn */}
                      {settings.linkedinUrl && (
                        <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}

                      {/* YouTube */}
                      {settings.youtubeUrl && (
                        <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
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