import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'

export async function GET() {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // Get project statistics
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      featuredProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'published' } }),
      prisma.project.count({ where: { status: 'draft' } }),
      prisma.project.count({ where: { featured: true } }),
    ])

    // Get service statistics
    const [totalServices, activeServices] = await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { active: true } }),
    ])

    // Get quote statistics
    const [
      totalQuotes,
      newQuotes,
      viewedQuotes,
      processedQuotes,
    ] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'new' } }),
      prisma.quote.count({ where: { status: 'viewed' } }),
      prisma.quote.count({ where: { status: 'processed' } }),
    ])

    // Get contact statistics
    const [totalContacts, unreadContacts] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'unread' } }),
    ])

    return NextResponse.json({
      projects: {
        total: totalProjects,
        published: publishedProjects,
        draft: draftProjects,
        featured: featuredProjects,
      },
      services: {
        total: totalServices,
        active: activeServices,
      },
      quotes: {
        total: totalQuotes,
        new: newQuotes,
        viewed: viewedQuotes,
        processed: processedQuotes,
      },
      contacts: {
        total: totalContacts,
        unread: unreadContacts,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
