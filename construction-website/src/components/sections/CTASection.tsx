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
    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
      
      <Container className="relative z-10">
        {/* Tạo một khối bo tròn (Boxed) để gom nội dung lại, tránh bị loãng */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-8 md:p-10 border border-blue-100 shadow-sm relative overflow-hidden">
          
          {/* Decorative background elements inside the box */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-200/20 rounded-full blur-[40px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Content: Text & Buttons (Chiếm 7 phần) */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-900">
                      Ready to Build <span className="text-blue-600">Your Vision?</span>
                  </h2>
                  <p className="text-base text-slate-600 font-normal leading-relaxed mx-auto lg:mx-0 max-w-xl">
                      From concept to creation, we are here to help. Get a free consultation for your next project today.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                    <Link href="/quote" className="w-full sm:w-auto">
                        <button className={cn(
                          "w-full sm:w-auto px-6 py-3 text-base font-bold rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5",
                          "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                        )}>
                            Get Free Quote
                        </button>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                         <button className={cn(
                           "w-full sm:w-auto px-6 py-3 text-base font-bold rounded-lg transition-all duration-300",
                           "bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 shadow-sm"
                         )}>
                            Contact Us
                        </button>
                    </Link>
                  </div>
              </div>

              {/* Right Content: Compact List (Chiếm 5 phần) */}
              {/* Thay vì Grid to, chuyển thành Flex column gọn gàng hơn */}
              <div className="lg:col-span-5 w-full">
                <div className="flex flex-col gap-3">
                  
                  {/* Phone Item */}
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:border-blue-200 transition-colors shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                     </div>
                     <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Call Us Now</div>
                        <div className="text-base md:text-lg font-bold text-slate-900">{settings?.phone || '(123) 456-7890'}</div>
                     </div>
                  </div>

                  {/* Email Item */}
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:border-blue-200 transition-colors shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     </div>
                     <div className="overflow-hidden">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Send Email</div>
                        <div className="text-base md:text-lg font-bold text-slate-900 truncate">{settings?.email || 'info@company.com'}</div>
                     </div>
                  </div>

                  {/* Hours Item */}
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 flex items-center gap-4 hover:border-blue-200 transition-colors shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Working Hours</div>
                        <div className="text-base md:text-lg font-bold text-slate-900">{settings?.workingHours || 'Mon - Fri, 8AM - 6PM'}</div>
                     </div>
                  </div>

                </div>
              </div>

          </div>
        </div>
      </Container>
    </section>
  )
}