'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  buttonText: string | null
  buttonLink: string | null
  imageUrl: string | null
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [slideInterval, setSlideInterval] = useState(5000)

  useEffect(() => {
    async function fetchData() {
      try {
        const slidesRes = await fetch('/api/hero-slides')
        if (slidesRes.ok) {
          const data = await slidesRes.json()
          setSlides(data)
        }
        const settingsRes = await fetch('/api/settings')
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          setSlideInterval(settings.slideInterval || 5000)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, slideInterval)
    return () => clearInterval(interval)
  }, [slides.length, slideInterval])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const defaultSlide: HeroSlide = {
    id: 'default',
    title: 'We Build Your Dreams Into Reality',
    subtitle: 'Professional construction services for residential, commercial, and industrial projects. Your trusted partner in creating exceptional spaces.',
    buttonText: 'Get a Free Quote',
    buttonLink: '/quote',
    imageUrl: null,
  }

  const activeSlides = slides.length > 0 ? slides : [defaultSlide]
  const currentSlideData = activeSlides[currentSlide] || defaultSlide

  if (loading) {
    return (
      <section className="relative h-[100dvh] flex items-center justify-center bg-gray-900">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-gray-900 flex flex-col justify-center">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {currentSlideData.imageUrl ? (
          <>
            <Image
              src={currentSlideData.imageUrl}
              alt={currentSlideData.title}
              fill
              className="object-cover object-center transition-transform duration-[3000ms] ease-out hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 md:to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-0 flex items-center flex-grow">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 pt-12 md:pt-16">
            
            {/* BADGE - Nhỏ gọn hơn */}
            <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Building Excellence Since 2000</span>
            </div>

            {/* TYPOGRAPHY - GIẢM MẠNH CỠ CHỮ */}
            <div className="space-y-4">
              {/* Tiêu đề giảm từ 8xl xuống 6xl/7xl và 4xl trên mobile */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1] animate-slide-in-left drop-shadow-xl">
                {currentSlideData.title}
              </h1>
              {/* Mô tả giảm xuống text-base/text-lg */}
              <p className="text-sm sm:text-base md:text-lg text-blue-50 font-light max-w-2xl leading-relaxed animate-fade-in delay-100 drop-shadow-md">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* BUTTONS - Nhỏ gọn hơn */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in delay-200">
              {currentSlideData.buttonText && currentSlideData.buttonLink && (
                <Link href={currentSlideData.buttonLink} className="w-full sm:w-auto">
                  <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-bold tracking-wide rounded-lg transition-all duration-300 shadow-lg transform hover:-translate-y-0.5">
                    {currentSlideData.buttonText}
                  </button>
                </Link>
              )}
              <Link href="/projects" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/30 hover:border-white text-white text-sm md:text-base font-bold tracking-wide rounded-lg transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-0.5">
                  View Our Projects
                </button>
              </Link>
            </div>

            {/* FEATURES - Nhỏ gọn hơn */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10 animate-fade-in delay-300 pb-12 md:pb-0">
              
              <div className="group flex items-center space-x-3 bg-black/30 md:bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-xs md:text-sm">Licensed & Insured</div>
                  <div className="text-[10px] md:text-xs text-blue-200/80">Fully certified</div>
                </div>
              </div>

              <div className="group flex items-center space-x-3 bg-black/30 md:bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-xs md:text-sm">On-Time Delivery</div>
                  <div className="text-[10px] md:text-xs text-blue-200/80">98% success rate</div>
                </div>
              </div>

              <div className="group flex items-center space-x-3 bg-black/30 md:bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-xs md:text-sm">Expert Team</div>
                  <div className="text-[10px] md:text-xs text-blue-200/80">20+ years experience</div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="hidden lg:block lg:col-span-5 h-full relative" />

        </div>
      </div>

      {/* --- NAVIGATION CONTROLS --- */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12 lg:right-24 z-20 flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-baseline gap-1 text-white font-mono">
            <span className="text-2xl font-bold">{(currentSlide + 1).toString().padStart(2, '0')}</span>
            <span className="text-base text-white/40">/</span>
            <span className="text-base text-white/40">{activeSlides.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 md:w-10 md:h-10 border border-white/20 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 md:w-10 md:h-10 border border-white/20 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent z-20" />
    </section>
  )
}