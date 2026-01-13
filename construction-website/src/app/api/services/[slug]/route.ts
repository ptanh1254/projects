import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: {
        slug: params.slug,
        active: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Get related services (same order range or nearby)
    const relatedServices = await prisma.service.findMany({
      where: {
        active: true,
        id: { not: service.id },
      },
      orderBy: { order: 'asc' },
      take: 4,
    })

    return NextResponse.json({ service, relatedServices })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
