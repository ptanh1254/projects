import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { updateQuoteStatusSchema } from '@/lib/validations'
import { deleteCloudinaryImage } from '@/lib/cloudinary'

// GET single quote by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Auto-update status from 'new' to 'viewed'
    if (quote.status === 'new') {
      await prisma.quote.update({
        where: { id: params.id },
        data: { status: 'viewed' },
      })
      quote.status = 'viewed'
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

// PUT update quote status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const validatedData = updateQuoteStatusSchema.parse(body)

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      quote,
      message: 'Quote updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating quote:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

// DELETE quote
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Delete file from Cloudinary if exists
    if (quote.fileUrl && quote.fileUrl.includes('cloudinary')) {
      try {
        const publicId = quote.fileUrl.split('/').slice(-2).join('/').split('.')[0]
        await deleteCloudinaryImage(publicId)
      } catch (err) {
        console.error('Error deleting quote file from Cloudinary:', err)
      }
    }

    await prisma.quote.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting quote:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    )
  }
}
