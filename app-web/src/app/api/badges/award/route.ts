import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'
import { PermissionService } from '@/lib/permission-service'

/**
 * POST /api/badges/award - Manually award a badge
 * Requires admin permission: grant_badges
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check admin permission
    const username = session.user.username || session.user.name || ''
    if (!PermissionService.canGrantBadges(username)) {
      return NextResponse.json(
        { error: 'Permission denied: only admins can manually award badges' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { toUsername, badgeSlug, reason } = body

    // Validations
    if (!toUsername || !badgeSlug) {
      return NextResponse.json(
        { error: 'Missing required fields (toUsername, badgeSlug)' },
        { status: 400 }
      )
    }

    // Find target user
    const toUser = await prisma.user.findUnique({
      where: { username: toUsername },
    })

    if (!toUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const result = await BadgeEngine.awardBadge(
      toUser.id,
      badgeSlug,
      session.user.username || session.user.name || 'unknown',
      reason
    )

    if (!result.awarded) {
      return NextResponse.json(
        { error: result.reason },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      badge: result.badge,
      message: result.reason,
    }, { status: 201 })
  } catch (error) {
    console.error('Error awarding badge:', error)
    return NextResponse.json(
      { error: 'Error awarding badge' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/badges/award - Revoke a badge
 * Requires admin permission: revoke_badges
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check admin permission
    const username = session.user.username || session.user.name || ''
    if (!PermissionService.canRevokeBadges(username)) {
      return NextResponse.json(
        { error: 'Permission denied: only admins can revoke badges' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username: targetUsername, badgeSlug } = body

    if (!targetUsername || !badgeSlug) {
      return NextResponse.json(
        { error: 'Missing required fields (username, badgeSlug)' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username: targetUsername },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const result = await BadgeEngine.revokeBadge(user.id, badgeSlug)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error('Error revoking badge:', error)
    return NextResponse.json(
      { error: 'Error revoking badge' },
      { status: 500 }
    )
  }
}
