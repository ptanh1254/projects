import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { serviceSchema } from '@/lib/validations'
import { slugify, generateUniqueSlug } from '@/lib/utils'
import { deleteCloudinaryImage } from '@/lib/cloudinary'

// GET single service by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT update service
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const validatedData = serviceSchema.parse(body)

    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
      select: { title: true, slug: true },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    let slug = existingService.slug
    if (existingService.title !== validatedData.title) {
      const baseSlug = slugify(validatedData.title)
      slug = await generateUniqueSlug(baseSlug, params.id, 'service')
    }

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        slug,
      },
    })

    return NextResponse.json({
      success: true,
      service,
      message: 'Service updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating service:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE service
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it exists
    if (service.imageUrl && service.imageUrl.includes('cloudinary')) {
      try {
        const publicId = service.imageUrl.split('/').slice(-2).join('/').split('.')[0]
        await deleteCloudinaryImage(publicId)
      } catch (err) {
        console.error('Error deleting service image from Cloudinary:', err)
      }
    }

    await prisma.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting service:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
