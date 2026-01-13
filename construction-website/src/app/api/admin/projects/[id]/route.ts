import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { projectSchema } from '@/lib/validations'
import { slugify, generateUniqueSlug } from '@/lib/utils'
import { deleteCloudinaryImage } from '@/lib/cloudinary'

// GET single project by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()

    // Validate input
    const validatedData = projectSchema.parse(body)

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
      select: { title: true, slug: true },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Generate new slug if title changed
    let slug = existingProject.slug
    if (existingProject.title !== validatedData.title) {
      const baseSlug = slugify(validatedData.title)
      slug = await generateUniqueSlug(baseSlug, params.id, 'project')
    }

    // Update project
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        slug,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating project:', error)

    // Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    // Prisma record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
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
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // Fetch project with all images
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { images: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary
    const cloudinaryErrors: string[] = []
    for (const image of project.images) {
      try {
        await deleteCloudinaryImage(image.publicId)
      } catch (err) {
        console.error(`Failed to delete image ${image.publicId} from Cloudinary:`, err)
        cloudinaryErrors.push(image.publicId)
      }
    }

    // Delete project from database (cascade will delete images)
    await prisma.project.delete({
      where: { id: params.id },
    })

    // Log Cloudinary errors but still consider it a success
    if (cloudinaryErrors.length > 0) {
      console.warn('Some images failed to delete from Cloudinary:', cloudinaryErrors)
    }

    return NextResponse.json({
      success: true,
      message: 'Project and all associated images deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting project:', error)

    // Prisma record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
