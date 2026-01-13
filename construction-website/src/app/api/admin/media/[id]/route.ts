import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { deleteCloudinaryImage } from '@/lib/cloudinary'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // Fetch image by ID
    const image = await prisma.image.findUnique({
      where: { id: params.id },
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    try {
      await deleteCloudinaryImage(image.publicId)
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting image:', error)

    // Prisma record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
