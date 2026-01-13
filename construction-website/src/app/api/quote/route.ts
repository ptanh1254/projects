import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { quoteSchema } from '@/lib/validations'
import { sendQuoteNotification, sendAutoReply } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = quoteSchema.parse(body)

    // Save to database
    const quote = await prisma.quote.create({
      data: validatedData,
    })

    // Send notifications
    await sendQuoteNotification(validatedData)
    await sendAutoReply({
      to: validatedData.email,
      name: validatedData.name,
      type: 'quote',
    })

    return NextResponse.json({
      success: true,
      message: 'Quote request sent successfully!',
      id: quote.id,
    })
  } catch (error: any) {
    console.error('Error creating quote:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred, please try again' },
      { status: 500 }
    )
  }
}