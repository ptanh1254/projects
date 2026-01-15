import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: 'published',
        featured: true,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        categoryData: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}