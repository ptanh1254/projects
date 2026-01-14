import Link from 'next/link'

interface Settings {
  phone: string
  email: string
  workingHours: string | null
}

async function getSettings(): Promise<Settings | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export default async function CTASection() {
  const settings = await getSettings()
  return (
    // Sử dụng màu chủ đạo Xanh đậm gradient sang trọng - GIẢM PADDING
    <section className="relative py-16 md:py-20 bg-gradient-to-r from-blue-900 to-slate-900 overflow-hidden text-white">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="lg:w-1/2 space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Ready to Build <br/> Your Vision?
                </h2>
                <p className="text-lg text-blue-100 max-w-xl font-light">
                    From concept to creation, we are here to help. Get a free consultation and quote for your next project today.
                </p>
            </div>

            <div className="lg:w-1/2 flex flex-col md:flex-row gap-4 lg:justify-end w-full">
                <Link href="/quote" className="w-full md:w-auto">
                    <button className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                        GET FREE QUOTE
                    </button>
                </Link>
                <Link href="/contact" className="w-full md:w-auto">
                     <button className="w-full md:w-auto px-10 py-5 bg-transparent border border-white/30 hover:bg-white/10 text-white text-lg font-bold rounded-lg transition-all duration-300 backdrop-blur-sm">
                        CONTACT US
                    </button>
                </Link>
            </div>

        </div>

        {/* Footer info in CTA */}
        <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Call Anytime</div>
                    <div className="text-xl font-bold">{settings?.phone || '(123) 456-7890'}</div>
                </div>
            </div>

             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Email Us</div>
                    <div className="text-xl font-bold">{settings?.email || 'info@construction.com'}</div>
                </div>
            </div>

             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <div className="text-sm text-gray-400">Visit Us</div>
                    <div className="text-lg font-bold">{settings?.workingHours || 'Mon - Fri, 8AM - 6PM'}</div>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}