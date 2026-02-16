import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'

// GET /api/badges/progress - Progress towards unearned badges
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    
    let userId = session.user.id
    
    // If requesting for another user
    if (username) {
      const user = await prisma.user.findUnique({
        where: { username }
      })
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      userId = user.id
    }

    // Get progress
    const progress = await BadgeEngine.getBadgeProgress(userId)
    
    // Get stats
    const stats = await BadgeEngine.getUserStats(userId)

    return NextResponse.json({
      stats,
      progress,
      nextBadges: progress.slice(0, 5), // The 5 closest
    })
  } catch (error) {
    console.error('Error fetching badge progress:', error)
    return NextResponse.json(
      { error: 'Error fetching progress' },
      { status: 500 }
    )
  }
}
