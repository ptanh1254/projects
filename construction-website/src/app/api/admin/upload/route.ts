import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  // Check admin authentication
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxFileSize = 10 * 1024 * 1024
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      )
    }

    // Convert file to base64 for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'construction-website/projects',
      allowed_formats: ['jpg', 'png', 'webp'],
      resource_type: 'image',
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    // Get the next order number for this project if projectId is provided
    let order = 0
    if (projectId) {
      const maxOrder = await prisma.image.findFirst({
        where: { projectId },
        orderBy: { order: 'desc' },
        select: { order: true },
      })
      order = (maxOrder?.order ?? -1) + 1
    }

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        projectId: projectId || null,
        order,
      },
    })

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        url: image.url,
        publicId: image.publicId,
      },
      message: 'Image uploaded successfully',
    })
  } catch (error: any) {
    console.error('Error uploading image:', error)

    // Cloudinary-specific errors
    if (error.http_code) {
      return NextResponse.json(
        { error: `Cloudinary error: ${error.message}` },
        { status: error.http_code }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
