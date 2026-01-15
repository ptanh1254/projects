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
            {/* Mobile: Overlay tối nhẹ để làm nổi bật text trắng */}
            <div className="absolute inset-0 bg-black/40 md:hidden" />
            {/* Desktop: Gradient chuẩn */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 md:to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 flex items-center flex-grow h-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full items-center h-full">
          
          <div className="lg:col-span-12 space-y-6 md:space-y-6 flex flex-col justify-center h-full pb-20 md:pb-0 items-center text-center lg:items-start lg:text-left">
            
            {/* Tagline */}
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest text-white uppercase">Building Excellence Since 2000</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3 md:space-y-4 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-tight animate-slide-in-left drop-shadow-xl">
                {currentSlideData.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-200 md:text-blue-50 font-normal md:font-light leading-relaxed animate-fade-in delay-100 drop-shadow-md mx-auto lg:mx-0">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* Buttons (Stacked on Mobile) - Both Transparent Style */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-fade-in delay-200 w-full justify-center lg:justify-start items-center lg:items-start">
              {currentSlideData.buttonText && currentSlideData.buttonLink && (
                <Link href={currentSlideData.buttonLink} className="w-full sm:w-auto">
                  {/* Nút Primary: Giờ là trong suốt với nền xanh mờ nhẹ + viền xanh */}
                  <button className="w-full sm:w-auto px-8 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 hover:border-blue-500 text-blue-100 font-bold tracking-wide rounded-lg transition-all duration-300 shadow-lg backdrop-blur-md transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap min-w-[200px]">
                    {currentSlideData.buttonText}
                  </button>
                </Link>
              )}
              <Link href="/portfolio" className="w-full sm:w-auto">
                {/* Nút Secondary: Trong suốt viền trắng */}
                <button className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white text-white font-bold tracking-wide rounded-lg transition-all duration-300 backdrop-blur-md transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap min-w-[200px]">
                  View Our Projects
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* --- DESKTOP FOOTER (Features Left, Arrows Right) --- */}
      <div className="hidden lg:flex absolute bottom-10 left-0 w-full px-24 justify-between items-end z-20 pointer-events-none">
        
        {/* Features Left */}
        <div className="flex items-center gap-8 pointer-events-auto">
           {/* Feature 1 */}
           <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-wide">Licensed</span>
                <span className="text-white/40 text-xs">Fully certified</span>
              </div>
           </div>
           {/* Feature 2 */}
           <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-wide">On-Time</span>
                <span className="text-white/40 text-xs">98% success</span>
              </div>
           </div>
           {/* Feature 3 */}
           <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-wide">Expert Team</span>
                <span className="text-white/40 text-xs">20+ years</span>
              </div>
           </div>
        </div>

        {/* Navigation Arrows Right */}
        {activeSlides.length > 1 && (
          <div className="flex items-center gap-6 pointer-events-auto">
            <div className="flex items-baseline gap-1 text-white font-mono">
              <span className="text-2xl font-bold">{(currentSlide + 1).toString().padStart(2, '0')}</span>
              <span className="text-base text-white/40">/</span>
              <span className="text-base text-white/40">{activeSlides.length.toString().padStart(2, '0')}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                className="w-12 h-12 border border-white/20 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95 group"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 border border-white/20 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 active:scale-95 group"
                aria-label="Next"
              >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE FOOTER FEATURES (Đưa xuống đáy như ý bạn, nền trong suốt) --- */}
      <div className="md:hidden absolute bottom-0 left-0 w-full z-30 pb-6 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="grid grid-cols-3 divide-x divide-white/10 px-4">
          
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">Licensed</div>
          </div>

          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">On-Time</div>
          </div>

          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">Expert</div>
          </div>

        </div>
      </div>

      <div className="hidden md:block absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent z-20" />
    </section>
  )
}