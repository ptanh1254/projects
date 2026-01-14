'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Container from '@/components/layout/Container'

interface Settings {
  phone: string
  email: string
  workingHours: string | null
}

export default function CTASection() {
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

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-r from-blue-900 to-slate-900 overflow-hidden text-white">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-lg">
                    Ready to Build <br className="hidden lg:block"/> 
                    <span className="text-blue-400">Your Vision?</span>
                </h2>
                <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl lg:max-w-xl font-light leading-relaxed mx-auto lg:mx-0">
                    From concept to creation, we are here to help. Get a free consultation and quote for your next project today.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/quote" className="w-full sm:w-auto">
                      <button className={cn(
                        "w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-lg shadow-xl transition-all duration-300 transform hover:-translate-y-1",
                        "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/30"
                      )}>
                          GET FREE QUOTE
                      </button>
                  </Link>
                  <Link href="/contact" className="w-full sm:w-auto">
                       <button className={cn(
                         "w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 backdrop-blur-sm",
                         "bg-white/5 border border-white/20 hover:bg-white/10 text-white"
                       )}>
                          CONTACT US
                      </button>
                  </Link>
                </div>
            </div>

            {/* Right Content - Info Grid (Redesigned) */}
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                
                {/* Info Card 1: Phone */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                   <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   </div>
                   <div>
                      <div className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">Call Us Now</div>
                      <div className="text-lg md:text-xl font-bold text-white">{settings?.phone || '(123) 456-7890'}</div>
                   </div>
                </div>

                {/* Info Card 2: Email */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                   <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <div>
                      <div className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">Send Email</div>
                      <div className="text-lg md:text-xl font-bold text-white truncate max-w-[150px] sm:max-w-none">{settings?.email || 'info@construction.com'}</div>
                   </div>
                </div>

                {/* Info Card 3: Working Hours - Spans full width on md */}
                <div className="md:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                   <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <div>
                      <div className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">Working Hours</div>
                      <div className="text-lg md:text-xl font-bold text-white">{settings?.workingHours || 'Mon - Fri, 8AM - 6PM'}</div>
                   </div>
                </div>

              </div>
            </div>

        </div>
      </Container>
    </section>
  )
}