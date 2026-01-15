import Container from '@/components/layout/Container'

const features = [
  {
    id: 1,
    title: 'Expert Team',
    description: 'Our team of certified professionals brings over 20 years of combined experience to every project.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Quality Materials',
    description: 'We use only premium, sustainable materials that ensure durability and longevity.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'On-Time Delivery',
    description: 'We pride ourselves on completing projects on schedule without compromising quality.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Transparent Pricing',
    description: 'Clear, upfront pricing with no hidden costs. You know exactly what you are paying for.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Safety First',
    description: 'Strict adherence to safety protocols ensuring a secure environment for everyone.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Warranty & Support',
    description: 'Comprehensive warranty coverage and ongoing support even after project completion.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Choose Us</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              With decades of experience and hundreds of successful projects, we have built
              a reputation for excellence in the construction industry. Here is what sets us apart.
            </p>

            <div className="space-y-8">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-5 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Image/Visual */}
          <div className="relative lg:h-full min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-slate-100 shadow-inner">
               {/* Visual Placeholder for the concept */}
               <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <div className="w-full h-full bg-slate-50 rounded-3xl overflow-hidden relative shadow-lg">
                      {/* You can replace this svg with a real <Image /> later */}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <svg className="w-32 h-32 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                  </div>
               </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -z-10 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-100/50 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </Container>
    </section>
  )
}