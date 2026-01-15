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
      <section className="section-padding bg-gradient-to-b from-white to-blue-50">
        <Container>
          <div className="text-center">
            <h2 className="section-title text-slate-900">What Our Clients Say</h2>
            <p className="section-subtitle text-slate-500">Loading testimonials...</p>
          </div>
        </Container>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="section-padding bg-gradient-to-b from-white to-blue-50">
        <Container>
          <div className="text-center">
            <h2 className="section-title text-slate-900">What Our Clients Say</h2>
            <p className="section-subtitle text-slate-500">
              No testimonials available at the moment.
            </p>
          </div>
        </Container>
      </section>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="section-padding bg-gradient-to-b from-white to-blue-50 border-t border-slate-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="section-subtitle text-slate-600">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative bg-white border border-slate-100 rounded-3xl shadow-xl shadow-blue-900/5">
            <CardContent className="p-8 md:p-14">
              {/* Quote icon */}
              <div className="absolute top-8 left-8 text-blue-100 opacity-80">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial content */}
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  {/* Star rating */}
                  <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-slate-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed italic font-medium">
                    "{currentTestimonial.content}"
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-slate-100 pt-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-3 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <div className="font-bold text-lg text-slate-900">{currentTestimonial.name}</div>
                  <div className="text-slate-500 text-sm">
                    {currentTestimonial.role}
                    {currentTestimonial.company && ` - ${currentTestimonial.company}`}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center items-center space-x-6 mt-10">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                    aria-label="Previous testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentIndex ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                    aria-label="Next testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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