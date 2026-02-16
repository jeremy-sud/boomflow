import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'

// POST /api/badges/evaluate - Evaluate and award pending badges
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const username = body.username
    
    let userId = session.user.id
    
    // If another user is specified, require admin permission
    if (username && username !== session.user.username) {
      const { PermissionService } = await import('@/lib/permission-service')
      const currentUsername = session.user.username || session.user.name || ''
      if (!PermissionService.canGrantBadges(currentUsername)) {
        return NextResponse.json(
          { error: 'Permission denied: only admins can evaluate badges for other users' },
          { status: 403 }
        )
      }
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

    // Evaluate all automatic badges
    const results = await BadgeEngine.evaluateUserBadges(userId)
    
    const awarded = results.filter(r => r.awarded)

    return NextResponse.json({
      evaluated: results.length,
      awarded: awarded.length,
      badges: awarded.map(r => r.badge),
    })
  } catch (error) {
    console.error('Error evaluating badges:', error)
    return NextResponse.json(
      { error: 'Error evaluating badges' },
      { status: 500 }
    )
  }
}
