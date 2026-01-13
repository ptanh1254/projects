import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { z } from 'zod'

const reorderSchema = z.object({
  slides: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { slides } = reorderSchema.parse(json)

    // Update order for each slide
    await Promise.all(
      slides.map((slide) =>
        prisma.heroSlide.update({
          where: { id: slide.id },
          data: { order: slide.order },
        })
      )
    )

    return NextResponse.json({ message: 'Slides reordered successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error reordering hero slides:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
