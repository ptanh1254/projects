import { Metadata } from 'next'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/layout/Breadcrumb'
import QuoteForm from '@/components/forms/QuoteForm'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Get a free, no-obligation quote for your construction project.',
}

export default function QuotePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Request a Quote', href: '/quote' },
  ]

  return (
    <>
      {/* Synchronized Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none" />
        <Container className="relative z-10">
          <Breadcrumb items={breadcrumbItems} className="mb-6 text-blue-200" />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Request a Free Quote
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed font-light">
              Fill out the form below and we&apos;ll provide you with a detailed, transparent estimate for your project within 24-48 hours.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-gray-50 py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-2 bg-blue-600 w-full"></div>
              <CardContent className="p-8 md:p-12 bg-white">
                <div className="mb-8 border-b border-gray-100 pb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Tell Us About Your Project
                  </h2>
                  <p className="text-gray-600">
                    Complete this quick form to get started. The more details you provide, the more accurate your quote will be.
                  </p>
                </div>

                <QuoteForm />
              </CardContent>
            </Card>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: '1. We Review', desc: 'Our team carefully reviews your project details and requirements.' },
                { title: '2. You Receive', desc: 'Get a detailed quote with itemized costs via email within 24-48 hours.' },
                { title: '3. We Discuss', desc: 'Schedule a consultation to discuss the quote and answer any questions.' }
              ].map((step, idx) => (
                <div key={idx} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-blue-900 shadow-md mb-4 border border-blue-100 font-bold text-xl">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm px-4">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}