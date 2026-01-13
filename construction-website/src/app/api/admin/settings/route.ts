import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { settingsSchema } from '@/lib/validations'

// GET settings
export async function GET() {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    // Get first settings record (should only be one)
    let settings = await prisma.settings.findFirst()

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          companyName: 'Construction Company',
          email: 'info@company.com',
          phone: '(000) 000-0000',
          address: '123 Main St, City, State 00000',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT update settings
export async function PUT(request: Request) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // Get existing settings
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      // Create if doesn't exist
      settings = await prisma.settings.create({
        data: validatedData,
      })
    } else {
      // Update existing
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: validatedData,
      })
    }

    return NextResponse.json({
      success: true,
      settings,
      message: 'Settings updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating settings:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
