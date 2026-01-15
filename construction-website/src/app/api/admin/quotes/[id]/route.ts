import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin-auth'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const auth = await checkAdminAuth()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Prisma.QuoteWhereInput = {}

    if (status !== 'all') {
      where.status = status as 'new' | 'contacted' | 'closed'
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quote.count({ where }),
    ])

    return NextResponse.json({
      quotes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}