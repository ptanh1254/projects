import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { reorderServicesSchema } from '@/lib/validations'

// PUT reorder services
export async function PUT(request: Request) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const validatedData = reorderServicesSchema.parse(body)

    // Update all services in a transaction
    await prisma.$transaction(
      validatedData.services.map((service) =>
        prisma.service.update({
          where: { id: service.id },
          data: { order: service.order },
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Services reordered successfully',
    })
  } catch (error: any) {
    console.error('Error reordering services:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to reorder services' },
      { status: 500 }
    )
  }
}
