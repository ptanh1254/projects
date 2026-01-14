import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import prisma from '@/lib/db'

const inter = Inter({ subsets: ['latin'] })

async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst()
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  const title = settings?.metaTitle || settings?.companyName || 'Construction Company - Building Excellence'
  const description = settings?.metaDescription || 'Professional construction services for residential, commercial, and industrial projects. Building excellence since 2000.'
  const companyName = settings?.companyName || 'Construction Company'

  return {
    title: {
      default: title,
      template: `%s | ${companyName}`,
    },
    description,
    keywords: ['construction', 'building', 'renovation', 'residential', 'commercial', 'industrial'],
    authors: [{ name: companyName }],
    icons: settings?.faviconUrl ? {
      icon: settings.faviconUrl,
      shortcut: settings.faviconUrl,
      apple: settings.faviconUrl,
    } : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://construction-company.com',
      siteName: companyName,
      title,
      description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: companyName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
