import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const project = await prisma.project.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryData: true, // <--- THÊM DÒNG NÀY
      },
    })

    if (!project || project.status !== 'published') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get related projects
    const relatedProjects = await prisma.project.findMany({
      where: {
        category: project.category, 
        status: 'published',
        id: { not: project.id },
      },
      include: {
        images: { take: 1 },
        categoryData: true, 
      },
      take: 4,
    })

    return NextResponse.json({ project, relatedProjects })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}