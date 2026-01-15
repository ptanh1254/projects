import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { projectSchema } from '@/lib/validations'
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

// GET: Lấy chi tiết dự án
export async function GET(
  request: Request,
  // FIX: Định nghĩa params là Promise để tương thích Next.js 15
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // FIX: Await params trước khi lấy id
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryData: {
          select: { id: true, name: true, slug: true }
        }
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

// PUT: Cập nhật dự án
export async function PUT(
  request: Request,
  // FIX: Định nghĩa params là Promise
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // FIX: Await params
    const { id } = await params
    
    const body = await request.json()
    const validatedData = projectSchema.parse(body)
    const { images, ...projectData } = validatedData

    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { title: true, slug: true },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    let slug = existingProject.slug
    if (existingProject.title !== validatedData.title) {
      const baseSlug = slugify(validatedData.title)
      slug = await generateUniqueSlug(baseSlug, id, 'project')
    }

    // Transaction để update project và images
    const updatedProject = await prisma.$transaction(async (tx) => {
      // 1. Update Project info
      const p = await tx.project.update({
        where: { id },
        data: {
          ...projectData,
          slug,
        },
      })

      // 2. Update Images (nếu có gửi lên)
      if (images) {
        // Xóa ảnh cũ trong DB
        await tx.image.deleteMany({
          where: { projectId: id }
        })

        // Tạo ảnh mới
        if (images.length > 0) {
          await tx.image.createMany({
            data: images.map(img => ({
              url: img.url,
              publicId: getPublicIdFromUrl(img.url),
              order: img.order,
              projectId: id
            }))
          })
        }
      }

      return p
    })

    // Fetch lại data đầy đủ để trả về Frontend
    const result = await prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        categoryData: { select: { id: true, name: true, slug: true } }
      }
    })

    return NextResponse.json({
      success: true,
      project: result,
      message: 'Project updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating project:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE: Xóa dự án
export async function DELETE(
  request: Request,
  // FIX: Định nghĩa params là Promise
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // FIX: Await params
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Xóa ảnh trên Cloudinary
    for (const image of project.images) {
      try {
        await deleteCloudinaryImage(image.publicId)
      } catch (err) {
        console.error(`Failed to delete image ${image.publicId} from Cloudinary:`, err)
      }
    }

    // Xóa project trong DB (Cascade sẽ tự xóa record Image)
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Project and all associated images deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}