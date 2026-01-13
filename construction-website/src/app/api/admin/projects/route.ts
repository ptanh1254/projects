import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { projectSchema } from '@/lib/validations'
import { slugify, generateUniqueSlug } from '@/lib/utils'
import { Prisma } from '@prisma/client'

// GET all projects with pagination and filtering
export async function GET(request: Request) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build where clause
    const where: Prisma.ProjectWhereInput = {}

    if (status !== 'all') {
      where.status = status as 'draft' | 'published'
    }

    if (category !== 'all') {
      where.category = category as any
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch projects with pagination
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          _count: {
            select: { images: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: Request) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()

    // Validate input
    const validatedData = projectSchema.parse(body)

    // Generate slug from title
    const baseSlug = slugify(validatedData.title)
    const uniqueSlug = await generateUniqueSlug(baseSlug, undefined, 'project')

    // Create project
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        slug: uniqueSlug,
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating project:', error)

    // Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
