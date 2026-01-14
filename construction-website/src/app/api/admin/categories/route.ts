import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { slugify, generateUniqueSlug } from '@/lib/utils'

// GET all categories
export async function GET() {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST create new category
export async function POST(request: Request) {
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

    const baseSlug = slugify(name)
    const slug = await generateUniqueSlug(baseSlug, null, 'category')

    const category = await prisma.category.create({
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
      message: 'Category created successfully',
    })
  } catch (error: any) {
    console.error('Error creating category:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
