'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils' // Import đúng từ file utils.ts
import MobileMenu from './MobileMenu'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('') // Add email state
  const [logoUrl, setLogoUrl] = useState('')
  const [companyName, setCompanyName] = useState('GTS Việt Nam')
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setPhone(data.phone || '')
          setEmail(data.email || '') // Fetch email
          setLogoUrl(data.logoUrl || '')
          setCompanyName(data.companyName || 'GTS Việt Nam')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const headerTextColor = isHomePage && !isScrolled ? 'text-white' : 'text-gray-900'

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b",
        isHomePage && !isScrolled
          ? "bg-transparent border-white/10 py-3 md:py-4" 
          : "bg-white shadow-md border-gray-200 py-2 md:py-3"
      )}
    >
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 mx-auto relative">
        <div className="flex items-center justify-between h-12 md:h-14"> 
          
          {/* --- LEFT: LOGO --- */}
          <Link href="/" className="flex items-center gap-3 group z-50 relative">
            {logoUrl ? (
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0 transition-transform duration-500 group-hover:rotate-6">
                <Image
                  src={logoUrl}
                  alt={companyName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md",
                isHomePage && !isScrolled 
                  ? "bg-white/10 backdrop-blur-md border border-white/20 text-white" 
                  : "bg-blue-600 text-white"
              )}>
                <span className="font-bold text-lg md:text-xl">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-base md:text-lg tracking-wide uppercase transition-colors leading-none",
                headerTextColor
              )}>
                {companyName}
              </span>
              {(isHomePage && !isScrolled) && (
                <span className="text-[10px] tracking-[0.2em] text-white/80 uppercase hidden sm:block font-light mt-0.5">
                  Construction Group
                </span>
              )}
            </div>
          </Link>

          {/* --- RIGHT: NAVIGATION & ACTIONS --- */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wide transition-all duration-300 rounded-full', 
                    isActive(item.href)
                      ? isHomePage && !isScrolled
                        ? 'text-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'text-blue-600 bg-blue-50'
                      : isHomePage && !isScrolled
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-current opacity-80">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className={cn(
                    "flex items-center gap-2 font-medium text-xs xl:text-sm transition-colors group whitespace-nowrap", 
                    headerTextColor
                  )}
                >
                  <span className={cn(
                    "p-1.5 rounded-full transition-all",
                    isHomePage && !isScrolled ? "bg-white/20" : "bg-gray-100"
                  )}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="hidden xl:inline">{phone}</span>
                </a>
              )}
              
              <Link
                href="/quote"
                className={cn(
                  "px-5 py-2 rounded-full font-bold text-xs tracking-wider transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap", 
                  isHomePage && !isScrolled
                    ? "bg-white text-blue-900 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                Get a Quote
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className={cn(
                "lg:hidden p-1.5 rounded-lg transition-colors z-50 relative",
                headerTextColor
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - Imported Component */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
          navigation={navigation} 
          phone={phone} // Pass phone
          email={email} // Pass email
        />
      </div>
    </header>
  )
}