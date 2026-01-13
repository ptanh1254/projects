import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Construction Company - Building Excellence',
    template: '%s | Construction Company',
  },
  description: 'Professional construction services for residential, commercial, and industrial projects. Building excellence since 2000.',
  keywords: ['construction', 'building', 'renovation', 'residential', 'commercial', 'industrial'],
  authors: [{ name: 'Construction Company' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://construction-company.com',
    siteName: 'Construction Company',
    title: 'Construction Company - Building Excellence',
    description: 'Professional construction services for residential, commercial, and industrial projects.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Company - Building Excellence',
    description: 'Professional construction services for residential, commercial, and industrial projects.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
