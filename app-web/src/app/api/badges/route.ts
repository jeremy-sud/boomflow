import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma'

// GET /api/badges - Full badge catalog (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const tier = searchParams.get('tier')

    const where: Prisma.BadgeWhereInput = { isActive: true }
    if (category) {
      where.category = category.toUpperCase() as Prisma.EnumBadgeCategoryFilter['equals']
    }
    if (tier) {
      where.tier = tier.toUpperCase() as Prisma.EnumBadgeTierFilter['equals']
    }

    const badges = await prisma.badge.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { tier: 'desc' },
        { name: 'asc' },
      ],
    })

    // Group by category
    const grouped = badges.reduce((acc, badge) => {
      const cat = badge.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(badge)
      return acc
    }, {} as Record<string, typeof badges>)

    return NextResponse.json({
      total: badges.length,
      badges,
      grouped,
    })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Error fetching badges' },
      { status: 500 }
    )
  }
}
