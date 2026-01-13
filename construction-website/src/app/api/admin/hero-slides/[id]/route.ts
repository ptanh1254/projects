import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { z } from 'zod'
import { deleteFromCloudinary } from '@/lib/cloudinary'

const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  subtitle: z.string().min(1, 'Subtitle is required').optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    })

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    }

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error fetching hero slide:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const data = heroSlideSchema.parse(json)

    // Get existing slide to check for old image
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    })

    if (!existingSlide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    }

    // If updating image, delete old one from Cloudinary
    if (data.imagePublicId && existingSlide.imagePublicId && data.imagePublicId !== existingSlide.imagePublicId) {
      await deleteFromCloudinary(existingSlide.imagePublicId)
    }

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(slide)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating hero slide:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    })

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 })
    }

    // Delete image from Cloudinary if exists
    if (slide.imagePublicId) {
      await deleteFromCloudinary(slide.imagePublicId)
    }

    await prisma.heroSlide.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Slide deleted successfully' })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
