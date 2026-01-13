'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/layout/Container'

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
        // Fetch slides
        const slidesRes = await fetch('/api/hero-slides')
        if (slidesRes.ok) {
          const data = await slidesRes.json()
          setSlides(data)
        }

        // Fetch settings for slide interval
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Default slide if no slides in database
  const defaultSlide: HeroSlide = {
    id: 'default',
    title: 'We Build Your Dreams Into Reality',
    subtitle:
      'Professional construction services for residential, commercial, and industrial projects. Your trusted partner in creating exceptional spaces.',
    buttonText: 'Get a Free Quote',
    buttonLink: '/quote',
    imageUrl: null,
  }

  const activeSlides = slides.length > 0 ? slides : [defaultSlide]
  const currentSlideData = activeSlides[currentSlide] || defaultSlide

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden min-h-screen flex items-center">
        <Container className="relative w-full">
          <div className="text-center text-white/60">Loading...</div>
        </Container>
      </section>
    )
  }

  // Safety check - if no slide data, use default
  if (!currentSlideData) {
    return (
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden min-h-screen flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container className="relative w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="text-sm font-medium">Building Excellence Since 2000</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {defaultSlide.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
              {defaultSlide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href={defaultSlide.buttonLink || '/quote'}>
                <button className="px-8 py-4 bg-white text-blue-700 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                  {defaultSlide.buttonText}
                </button>
              </Link>
              <Link href="/projects">
                <button className="px-8 py-4 bg-transparent border-3 border-white text-white rounded-lg font-bold text-lg backdrop-blur-sm hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  View Our Projects
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      {currentSlideData.imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={currentSlideData.imageUrl}
            alt={currentSlideData.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Subtle dark overlay only on left side for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        </div>
      )}

      {/* Background pattern (when no image) */}
      {!currentSlideData.imageUrl && (
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      )}

      <Container className="relative w-full px-8 md:px-12 lg:px-16">
        <div className="max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
              <span className="text-sm font-semibold tracking-wide">Building Excellence Since 2000</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-slide-in-left">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p
              className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 max-w-3xl leading-relaxed animate-slide-in-left"
              style={{ animationDelay: '0.1s' }}
            >
              {currentSlideData.subtitle}
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-5 mb-16 animate-slide-in-left"
              style={{ animationDelay: '0.2s' }}
            >
              {currentSlideData.buttonText && currentSlideData.buttonLink && (
                <Link href={currentSlideData.buttonLink}>
                  <button className="px-8 py-4 bg-white text-blue-700 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                    {currentSlideData.buttonText}
                  </button>
                </Link>
              )}
              <Link href="/projects">
                <button className="px-8 py-4 bg-transparent border-3 border-white text-white rounded-lg font-bold text-lg backdrop-blur-sm hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  View Our Projects
                </button>
              </Link>
            </div>

            {/* Features */}
            <div
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Licensed & Insured</div>
                  <div className="text-sm text-blue-100">Fully certified</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">On-Time Delivery</div>
                  <div className="text-sm text-blue-100">98% success rate</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">Expert Team</div>
                  <div className="text-sm text-blue-100">20+ years experience</div>
                </div>
              </div>
            </div>
          </div>
      </Container>

      {/* Slide Controls */}
      {activeSlides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 border-2 ${
                  index === currentSlide
                    ? 'bg-white border-white w-12 h-4'
                    : 'bg-white/30 border-white/60 w-4 h-4 hover:bg-white/50 hover:border-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
