'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Container from '@/components/layout/Container'

interface Settings {
  companyName: string
  tagline?: string
  description?: string
  email: string
  phone: string
  address: string
  workingHours?: string
  facebookUrl?: string
  whatsappUrl?: string
  linkedinUrl?: string
  youtubeUrl?: string
  logoUrl?: string
}

const footerNavigation = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'Residential Construction', href: '/services/residential' },
    { name: 'Commercial Construction', href: '/services/commercial' },
    { name: 'Industrial Construction', href: '/services/industrial' },
    { name: 'Renovation', href: '/services/renovation' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
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

  interface SocialLink {
    name: string
    href: string
    icon: React.ReactNode
  }

  const socialLinksArray: SocialLink[] = []

  if (settings?.facebookUrl) {
    socialLinksArray.push({
      name: 'Facebook',
      href: settings.facebookUrl,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    })
  }

  if (settings?.whatsappUrl) {
    socialLinksArray.push({
      name: 'WhatsApp',
      href: settings.whatsappUrl,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    })
  }

  if (settings?.linkedinUrl) {
    socialLinksArray.push({
      name: 'LinkedIn',
      href: settings.linkedinUrl,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    })
  }

  if (settings?.youtubeUrl) {
    socialLinksArray.push({
      name: 'YouTube',
      href: settings.youtubeUrl,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    })
  }

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <Container>
        <div className="py-12 md:py-16">
          
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12">
            
            {/* 1. Company info */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="flex items-center space-x-3 group">
                {settings?.logoUrl ? (
                  <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={settings.logoUrl}
                      alt={settings.companyName}
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                    <span className="text-white font-bold text-xl">
                      {settings?.companyName?.charAt(0).toUpperCase() || 'C'}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-extrabold text-xl md:text-2xl tracking-tight text-white block">
                    {settings?.companyName || 'CONSTRUCTION CO.'}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Premium Quality</span>
                </div>
              </Link>
              
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                {settings?.tagline || 'Building excellence since 2000. We transform your vision into lasting reality with precision and passion.'}
              </p>

              {/* Social Links */}
              {socialLinksArray.length > 0 && (
                <div className="flex space-x-3 pt-2">
                  {socialLinksArray.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 border",
                        "bg-white/5 text-gray-300 border-white/10",
                        "hover:bg-blue-600 hover:text-white hover:border-blue-500"
                      )}
                      aria-label={item.name}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Company Links */}
            <div className="lg:col-span-2 lg:pl-4">
              <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-l-4 border-blue-600 pl-3">Company</h3>
              <ul className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Services Links */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-l-4 border-blue-600 pl-3">Expertise</h3>
              <ul className="space-y-3">
                {footerNavigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Contact Info */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold text-base uppercase tracking-wider mb-4 border-l-4 border-blue-600 pl-3">Get in Touch</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed">{settings?.address || '123 Construction Ave, District 1, HCMC'}</span>
                </li>
                {settings?.workingHours && (
                  <li className="flex items-start gap-3">
                     <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{settings.workingHours}</span>
                  </li>
                )}
                <li>
                  <a
                    href={`tel:${settings?.phone}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {settings?.phone || '(123) 456-7890'}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings?.email}`}
                    className="flex items-center gap-3 hover:text-blue-400 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{settings?.email || 'info@construction.com'}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">{settings?.companyName || 'Construction Company'}</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs md:text-sm text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}