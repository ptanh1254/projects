import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { projectSchema } from '@/lib/validations'
import { slugify, generateUniqueSlug } from '@/lib/utils'
import { Prisma } from '@prisma/client'

// Hàm helper để lấy publicId từ URL Cloudinary
function getPublicIdFromUrl(url: string): string {
  try {
    // Tách public ID từ URL (VD: .../upload/v12345/folder/image.jpg -> folder/image)
    const parts = url.split('/upload/')
    if (parts.length < 2) return 'unknown'
    const subParts = parts[1].split('/')
    subParts.shift() // bỏ version (v12345)
    const filenameWithExt = subParts.join('/')
    return filenameWithExt.split('.')[0]
  } catch (e) {
    return 'unknown'
  }
}

// GET all projects (Giữ nguyên logic cũ đã sửa)
export async function GET(request: Request) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Prisma.ProjectWhereInput = {}

    if (status !== 'all') {
      where.status = status as 'draft' | 'published' | 'archived'
    }

    if (category !== 'all') {
      where.category = category 
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          categoryData: {
            select: { id: true, name: true, slug: true }
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

// POST create new project (FIX MẤT ẢNH)
export async function POST(request: Request) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    // Validation bao gồm cả images
    const validatedData = projectSchema.parse(body)

    const baseSlug = slugify(validatedData.title)
    const uniqueSlug = await generateUniqueSlug(baseSlug, undefined, 'project')

    // Tách images ra khỏi data project
    const { images, ...projectData } = validatedData

    const project = await prisma.project.create({
      data: {
        ...projectData,
        slug: uniqueSlug,
        // FIX: Xử lý lưu ảnh ngay khi tạo project
        images: {
          create: images?.map((img) => ({
            url: img.url,
            publicId: getPublicIdFromUrl(img.url),
            order: img.order
          })) || []
        }
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

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      )
    }

    // Lỗi P2003 thường do Category ID không tồn tại
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid Category ID. Please check if category exists.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}