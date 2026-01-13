import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { updateProfileSchema } from '@/lib/validations'

// PUT update admin profile
export async function PUT(request: Request) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Check if email is already taken by another user
    if (validatedData.email !== auth.session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser && existingUser.id !== auth.session.user.id) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 409 }
        )
      }
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: auth.session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        avatar: validatedData.avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user,
      message: 'Profile updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating profile:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
