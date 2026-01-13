'use client'

import { useEffect, useRef, useState } from 'react'
import Container from '@/components/layout/Container'

const stats = [
  { id: 1, name: 'Projects Completed', value: 500, suffix: '+' },
  { id: 2, name: 'Happy Clients', value: 300, suffix: '+' },
  { id: 3, name: 'Years Experience', value: 20, suffix: '+' },
  { id: 4, name: 'Team Members', value: 50, suffix: '+' },
]

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [hasStarted, end, duration])

  return <span ref={countRef}>{count}</span>
}

export default function StatsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="section-title">Our Achievements</h2>
          <p className="section-subtitle">
            Numbers that speak for our excellence and commitment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                <CountUp end={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">{stat.name}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
