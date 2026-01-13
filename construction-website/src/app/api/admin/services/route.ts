import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { serviceSchema } from '@/lib/validations'
import { slugify, generateUniqueSlug } from '@/lib/utils'

// GET all services
export async function GET(request: Request) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where = active === 'all' || !active
      ? {}
      : { active: active === 'true' }

    const services = await prisma.service.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      services,
      total: services.length,
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST create new service
export async function POST(request: Request) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()

    // Validate input
    const validatedData = serviceSchema.parse(body)

    // Generate slug from title
    const baseSlug = slugify(validatedData.title)
    const uniqueSlug = await generateUniqueSlug(baseSlug, undefined, 'service')

    // Get max order to set new service at the end
    const maxOrderService = await prisma.service.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    const newOrder = (maxOrderService?.order ?? -1) + 1

    // Create service
    const service = await prisma.service.create({
      data: {
        ...validatedData,
        slug: uniqueSlug,
        order: validatedData.order ?? newOrder, // Use provided order or default to end
      },
    })

    return NextResponse.json({
      success: true,
      service,
      message: 'Service created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating service:', error)

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
        { error: 'A service with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
