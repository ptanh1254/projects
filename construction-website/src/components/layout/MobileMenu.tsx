'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils' // Import từ đúng vị trí

interface NavigationItem {
  name: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: NavigationItem[]
  phone?: string
  email?: string
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  navigation, 
  phone = '', 
  email = '' 
}: MobileMenuProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(isOpen)

  // Sửa useEffect để tránh cascading renders
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      
      document.body.style.overflow = 'unset'
      
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = 'unset'
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  if (!isVisible && !isOpen) return null

  // Sử dụng phone/email từ props, fallback về giá trị mặc định
  const displayPhone = phone || '0123 456 789'
  const displayEmail = email || 'contact@gtsvietnam.com'

  return (
    <div className="lg:hidden fixed inset-0 z-[60] flex justify-end">
      {/* 1. Backdrop (Lớp nền tối mờ) */}
      <div
        className={cn(
          "absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Main Drawer Panel */}
      <div
        className={cn(
          "relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* --- Header của Menu --- */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            MENU
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors group"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- Danh sách Links --- */}
        <div className="flex-1 overflow-y-auto py-6 px-6">
          <nav className="flex flex-col space-y-2">
            {navigation.map((item, index) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200",
                    active
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  style={{
                    animation: isOpen ? `slideIn 0.4s ease-out forwards ${index * 0.05}s` : 'none',
                    opacity: 0,
                    transform: 'translateX(20px)'
                  }}
                >
                  <span>{item.name}</span>
                  {/* Mũi tên chỉ hiện khi hover hoặc active */}
                  <svg 
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      active ? "text-blue-600 opacity-100" : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                    )}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </nav>

          {/* --- Section phụ: Quick Links / Contact --- */}
          <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                Thông tin liên hệ
              </h3>
              
              <a 
                href={`tel:${displayPhone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-3 px-4 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-medium text-sm">{displayPhone}</span>
              </a>

              <a 
                href={`mailto:${displayEmail}`} 
                className="flex items-center gap-3 px-4 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-sm">{displayEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* --- Footer CTA --- */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Link
            href="/quote"
            onClick={onClose}
            className="flex items-center justify-center w-full py-3.5 px-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
          >
            NHẬN BÁO GIÁ NGAY
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Inline styles cho keyframes animation */}
      <style jsx global>{`
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}