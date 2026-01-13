'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from './Container'
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
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setPhone(data.phone || '')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <header className={cn(
      "fixed top-0 w-full z-40 transition-all duration-300",
      isHomePage && !isScrolled
        ? "bg-transparent border-transparent"
        : "bg-white backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg"
    )}>
      <Container className="max-w-[1400px]">
        <div className="flex items-center justify-between h-24 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isHomePage && !isScrolled ? "bg-white/20 backdrop-blur-sm" : "bg-blue-600"
            )}>
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <span className={cn(
              "font-bold text-xl transition-colors whitespace-nowrap",
              isHomePage && !isScrolled ? "text-white" : "text-gray-900"
            )}>
              GTS Việt Nam
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 flex-1 justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(item.href)
                    ? isHomePage && !isScrolled
                      ? 'bg-white/20 text-white backdrop-blur-sm shadow-md'
                      : 'bg-blue-600 text-white shadow-md'
                    : isHomePage && !isScrolled
                      ? 'text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Phone & CTA Button */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {phone && (
              <a
                href={`tel:${phone}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium",
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/10 hover:shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{phone}</span>
              </a>
            )}
            <Link
              href="/quote"
              className={cn(
                "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105",
                isHomePage && !isScrolled
                  ? "bg-white text-blue-600 hover:bg-white/95"
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
              "md:hidden p-2 rounded-md transition-colors",
              isHomePage && !isScrolled
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-md text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/quote"
                className="mx-4 mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-center hover:bg-blue-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}
