import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'

    const where: Prisma.ProjectWhereInput = {
      status: 'published',
    }

    if (category && category !== 'all') {
      where.category = category
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1, // Only get first image for list
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
    })

    const total = await prisma.project.count({ where })

    return NextResponse.json({
      projects,
      total,
      page: parseInt(page),
      totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}