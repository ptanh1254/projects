import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { updateContactStatusSchema } from '@/lib/validations'

// PUT update contact status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const validatedData = updateContactStatusSchema.parse(body)

    const contact = await prisma.contactMessage.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      contact,
      message: 'Contact status updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating contact:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE contact
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    await prisma.contactMessage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting contact:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
