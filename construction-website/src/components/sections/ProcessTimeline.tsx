interface TimelineStep {
  number: string
  title: string
  description: string
  icon: JSX.Element
}

const defaultSteps: TimelineStep[] = [
  {
    number: '01',
    title: 'Initial Consultation',
    description: 'We meet with you to discuss your project vision, requirements, budget, and timeline.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Design & Planning',
    description: 'Our team creates detailed plans and 3D renderings for your approval before construction begins.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Budget Proposal',
    description: 'Receive a transparent, itemized quote with no hidden costs. We help you make informed decisions.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Construction Phase',
    description: 'Skilled craftsmen bring your vision to life with quality materials and expert workmanship.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Quality Control',
    description: 'Regular inspections and testing ensure every detail meets our high standards and your expectations.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Final Handover',
    description: 'Complete walkthrough, documentation, and ongoing support to ensure your complete satisfaction.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
]

interface ProcessTimelineProps {
  steps?: TimelineStep[]
  className?: string
}

export default function ProcessTimeline({ steps = defaultSteps, className = '' }: ProcessTimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Mobile & Tablet: Vertical Timeline */}
      <div className="lg:hidden space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-12">
            {/* Vertical Line */}
            {index !== steps.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-blue-200" />
            )}

            {/* Icon Circle */}
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
              {step.icon}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-blue-100 mb-2">{step.number}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal Timeline */}
      <div className="hidden lg:block">
        {/* Timeline Line */}
        <div className="absolute top-20 left-0 right-0 h-0.5 bg-blue-200" />

        <div className="grid grid-cols-6 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Icon Circle */}
              <div className="relative z-10 w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg mb-8">
                {step.icon}
              </div>

              {/* Content Card */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-blue-100 mb-3">{step.number}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
