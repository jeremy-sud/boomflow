import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/badges/user/[username] - User badges
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        badges: {
          include: {
            badge: true,
          },
          orderBy: { awardedAt: 'desc' },
        },
        organization: true,
        team: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Group badges by category
    const badgesByCategory = user.badges.reduce((acc, ub) => {
      const cat = ub.badge.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push({
        ...ub.badge,
        awardedAt: ub.awardedAt,
        awardedBy: ub.awardedBy,
        reason: ub.reason,
      })
      return acc
    }, {} as Record<string, unknown[]>)

    // Statistics
    const stats = {
      total: user.badges.length,
      gold: user.badges.filter(b => b.badge.tier === 'GOLD').length,
      silver: user.badges.filter(b => b.badge.tier === 'SILVER').length,
      bronze: user.badges.filter(b => b.badge.tier === 'BRONZE').length,
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        organization: user.organization?.name,
        team: user.team?.name,
        createdAt: user.createdAt,
      },
      badges: user.badges.map(ub => ({
        ...ub.badge,
        awardedAt: ub.awardedAt,
        awardedBy: ub.awardedBy,
        reason: ub.reason,
      })),
      badgesByCategory,
      stats,
    })
  } catch (error) {
    console.error('Error fetching user badges:', error)
    return NextResponse.json(
      { error: 'Error fetching user badges' },
      { status: 500 }
    )
  }
}
