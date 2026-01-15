import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { categorySchema } from '@/lib/validations' // Đảm bảo đã thêm schema này
import { slugify, generateUniqueSlug } from '@/lib/utils'

// GET: Lấy chi tiết Category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Promise params cho Next.js 15
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { id } = await params // FIX: Await params

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT: Cập nhật Category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Promise params
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { id } = await params // FIX: Await params
    const body = await request.json()
    
    // Validate bằng Zod
    const validatedData = categorySchema.parse(body)

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Xử lý Slug nếu tên thay đổi
    let slug = existingCategory.slug
    if (existingCategory.name !== validatedData.name) {
      const baseSlug = slugify(validatedData.name)
      slug = await generateUniqueSlug(baseSlug, id, 'category')
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description || null,
        order: validatedData.order,
        active: validatedData.active,
      },
    })

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating category:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE: Xóa Category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // FIX: Promise params
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { id } = await params // FIX: Await params

    // Kiểm tra xem Category có đang được sử dụng trong Project nào không
    const projectsCount = await prisma.project.count({
      where: { category: id }
    })

    if (projectsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It is used in ${projectsCount} projects.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting category:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}