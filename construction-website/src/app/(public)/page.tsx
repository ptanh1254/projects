import { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import ServicesOverview from '@/components/sections/ServicesOverview'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Professional construction services for residential, commercial, and industrial projects. Building excellence since 2000.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesOverview />
      <FeaturedProjects />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
