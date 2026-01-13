'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/layout/Container'
import { Card, CardContent } from '@/components/ui/Card'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string | null
  content: string
  rating: number
  imageUrl: string | null
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          setTestimonials(data)
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-blue-50 to-blue-100">
        <Container>
          <div className="text-center">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Loading testimonials...</p>
          </div>
        </Container>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="section-padding bg-gradient-to-br from-blue-50 to-blue-100">
        <Container>
          <div className="text-center">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              No testimonials available at the moment.
            </p>
          </div>
        </Container>
      </section>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-blue-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative">
            <CardContent className="p-8 md:p-12">
              {/* Quote icon */}
              <div className="absolute top-6 left-6 text-blue-200 opacity-50">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial content */}
              <div className="relative z-10">
                <div className="mb-6">
                  {/* Star rating */}
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl text-gray-700 text-center mb-8 italic">
                    "{currentTestimonial.content}"
                  </p>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                      {currentTestimonial.name.charAt(0)}
                    </div>
                    <div className="font-semibold text-gray-900">{currentTestimonial.name}</div>
                    <div className="text-gray-600">
                      {currentTestimonial.role}
                      {currentTestimonial.company && ` - ${currentTestimonial.company}`}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-blue-600"
                    aria-label="Previous testimonial"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Dots indicator */}
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-blue-600"
                    aria-label="Next testimonial"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  )
}
