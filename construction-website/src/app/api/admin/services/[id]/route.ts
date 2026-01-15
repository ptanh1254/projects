import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { serviceSchema } from '@/lib/validations'
import { slugify, generateUniqueSlug } from '@/lib/utils'
import { deleteCloudinaryImage } from '@/lib/cloudinary'

// Helper lấy Public ID từ URL Cloudinary
function getPublicIdFromUrl(url: string): string {
  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return 'unknown'
    const subParts = parts[1].split('/')
    subParts.shift()
    const filenameWithExt = subParts.join('/')
    return filenameWithExt.split('.')[0]
  } catch (e) {
    return 'unknown'
  }
}

// GET: Lấy chi tiết Service
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Promise params
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { id } = await params // FIX: Await params

    const service = await prisma.service.findUnique({
      where: { id },
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

// PUT: Cập nhật Service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Promise params
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { id } = await params // FIX: Await params
    const body = await request.json()
    
    // Validate dữ liệu
    const validatedData = serviceSchema.parse(body)

    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Xử lý Slug nếu Title thay đổi
    let slug = existingService.slug
    if (existingService.title !== validatedData.title) {
      const baseSlug = slugify(validatedData.title)
      slug = await generateUniqueSlug(baseSlug, id, 'service')
    }

    // Xử lý xóa ảnh cũ trên Cloudinary nếu người dùng thay ảnh mới
    if (
      existingService.imageUrl && 
      validatedData.imageUrl && 
      existingService.imageUrl !== validatedData.imageUrl &&
      existingService.imageUrl.includes('cloudinary')
    ) {
      try {
        const publicId = getPublicIdFromUrl(existingService.imageUrl)
        await deleteCloudinaryImage(publicId)
      } catch (err) {
        console.error('Error deleting old service image:', err)
      }
    }

    // Cập nhật DB
    const service = await prisma.service.update({
      where: { id },
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

// DELETE: Xóa Service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Promise params
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { id } = await params // FIX: Await params

    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Xóa ảnh trên Cloudinary nếu có
    if (service.imageUrl && service.imageUrl.includes('cloudinary')) {
      try {
        const publicId = getPublicIdFromUrl(service.imageUrl)
        await deleteCloudinaryImage(publicId)
      } catch (err) {
        console.error('Error deleting service image from Cloudinary:', err)
      }
    }

    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}