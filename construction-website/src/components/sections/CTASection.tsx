import Link from 'next/link'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

interface Settings {
  phone: string
  email: string
  workingHours: string | null
}

async function getSettings(): Promise<Settings | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/settings`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export default async function CTASection() {
  const settings = await getSettings()
  return (
    <section className="section-padding bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Let's turn your vision into reality. Get a free consultation and quote today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Contact info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-blue-200 mb-2">Call Us</div>
                <a
                  href={`tel:${settings?.phone || '+1234567890'}`}
                  className="text-lg font-semibold hover:text-blue-200 transition-colors"
                >
                  {settings?.phone || '(123) 456-7890'}
                </a>
              </div>
              <div>
                <div className="text-blue-200 mb-2">Email Us</div>
                <a
                  href={`mailto:${settings?.email || 'info@construction.com'}`}
                  className="text-lg font-semibold hover:text-blue-200 transition-colors"
                >
                  {settings?.email || 'info@construction.com'}
                </a>
              </div>
              <div>
                <div className="text-blue-200 mb-2">Visit Us</div>
                <div className="text-lg font-semibold">
                  {settings?.workingHours || 'Mon - Fri, 8AM - 6PM'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
    </section>
  )
}
