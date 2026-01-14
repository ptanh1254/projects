import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { slugify, generateUniqueSlug } from '@/lib/utils'

// GET single category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
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

// PUT update category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const { name, description, order, active } = body

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Category name must be at least 2 characters' },
        { status: 400 }
      )
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      select: { name: true, slug: true },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    let slug = existingCategory.slug
    if (existingCategory.name !== name.trim()) {
      const baseSlug = slugify(name)
      slug = await generateUniqueSlug(baseSlug, params.id, 'category')
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    })

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating category:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// PATCH partial update (for toggling active status)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()

    const category = await prisma.category.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating category:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    await prisma.category.delete({
      where: { id: params.id },
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
