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
    <section className="section-padding bg-white">
      <Container>
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="text-center mb-12">
            <h2 className="section-title text-3xl font-bold text-slate-900 mb-2">Our Achievements</h2>
            <p className="section-subtitle text-slate-500">
                Numbers that speak for our excellence and commitment
            </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
            {stats.map((stat) => (
                <div
                key={stat.id}
                className="text-center px-4 py-4"
                >
                <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-3 tracking-tight">
                    <CountUp end={stat.value} />
                    {stat.suffix}
                </div>
                <div className="text-slate-600 font-semibold uppercase tracking-wide text-sm">{stat.name}</div>
                </div>
            ))}
            </div>
        </div>
      </Container>
    </section>
  )
}