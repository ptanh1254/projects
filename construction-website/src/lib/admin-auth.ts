
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from './auth'

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  return { authorized: true, session }
}