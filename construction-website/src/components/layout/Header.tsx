'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [phone, setPhone] = useState('')
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
          ? "bg-transparent border-white/10 py-3 md:py-4" // Giảm padding
          : "bg-white/95 backdrop-blur-md border-gray-200 shadow-sm py-2 md:py-3" // Giảm padding khi scroll
      )}
    >
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 mx-auto relative">
        <div className="flex items-center justify-between h-12 md:h-14"> {/* Giảm chiều cao thanh header */}
          
          {/* --- LEFT: LOGO --- */}
          <Link href="/" className="flex items-center gap-3 group z-50 relative">
            {logoUrl ? (
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0 transition-transform duration-500 group-hover:rotate-6">
                <Image
                  src={logoUrl}
                  alt={companyName}
                  fill
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
                "font-bold text-base md:text-lg tracking-wide uppercase transition-colors leading-none", // Giảm cỡ chữ tên công ty
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
                    'relative px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wide transition-all duration-300 rounded-full', // Giảm cỡ chữ nav xuống text-sm/text-xs
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
                    "flex items-center gap-2 font-medium text-xs xl:text-sm transition-colors group whitespace-nowrap", // Giảm cỡ chữ số điện thoại
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
                  "px-5 py-2 rounded-full font-bold text-xs tracking-wider transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap", // Nút nhỏ gọn hơn
                  isHomePage && !isScrolled
                    ? "bg-white text-blue-900 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                QUOTE
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

        {/* Mobile menu */}
        <div 
          className={cn(
            "lg:hidden absolute top-full left-0 w-full transition-all duration-300 ease-in-out transform origin-top shadow-xl",
            mobileMenuOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="bg-white border-t border-gray-100 p-4">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-base font-semibold transition-colors flex items-center justify-between',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                  {isActive(item.href) && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Link
                href="/quote"
                className="w-full py-3 mt-1 bg-blue-600 text-white rounded-lg font-bold text-sm text-center hover:bg-blue-700 transition-all shadow-md uppercase tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}