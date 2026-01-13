import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification, sendAutoReply } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)

    // Save to database
    const contact = await prisma.contactMessage.create({
      data: validatedData,
    })

    // Send notifications
    await sendContactNotification(validatedData)
    await sendAutoReply({
      to: validatedData.email,
      name: validatedData.name,
      type: 'contact',
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      id: contact.id,
    })
  } catch (error: any) {
    console.error('Error creating contact:', error)

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