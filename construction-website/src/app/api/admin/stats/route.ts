import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'

export async function GET() {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
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

    const [totalServices, activeServices] = await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { active: true } }),
    ])

    const [
      totalQuotes,
      newQuotes,
      contactedQuotes,
      closedQuotes,
    ] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'new' } }),
      prisma.quote.count({ where: { status: 'contacted' } }),
      prisma.quote.count({ where: { status: 'closed' } }),
    ])

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
        contacted: contactedQuotes,
        closed: closedQuotes,
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