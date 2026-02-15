import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'
import { NotificationService } from '@/lib/notification-service'

/**
 * POST /api/badges/peer-award - Award a Resonance badge (peer-to-peer)
 * 
 * Each user can award up to 2 Resonance badges per year to colleagues.
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

    const body = await request.json()
    const { toUsername, message } = body

    // Validate required fields
    if (!toUsername || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (toUsername, message)' },
        { status: 400 }
      )
    }

    // Message must be meaningful (minimum 10 characters)
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
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

    // Award the peer badge
    const result = await BadgeEngine.awardPeerBadge(
      session.user.id,
      toUser.id,
      message
    )

    if (!result.awarded) {
      return NextResponse.json(
        { error: result.reason },
        { status: 400 }
      )
    }

    // Send notification to the recipient
    try {
      await NotificationService.notifyBadgeEarned(
        toUser.id,
        {
          id: result.badge!.id,
          name: result.badge!.name,
          slug: result.badge!.slug,
          tier: result.badge!.tier,
        }
      )
    } catch (notifyError) {
      console.warn('Failed to send notification:', notifyError)
      // Don't fail the request if notification fails
    }

    // Get remaining awards for the sender
    const remaining = await BadgeEngine.getRemainingPeerAwards(session.user.id)

    return NextResponse.json({
      success: true,
      badge: result.badge,
      message: result.reason,
      remainingAwards: remaining,
    }, { status: 201 })
  } catch (error) {
    console.error('Error awarding peer badge:', error)
    return NextResponse.json(
      { error: 'Error awarding peer badge' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/badges/peer-award - Get remaining peer awards for the current user
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const remaining = await BadgeEngine.getRemainingPeerAwards(session.user.id)
    const currentYear = new Date().getFullYear()
    
    let statusMessage: string
    if (remaining > 0) {
      const plural = remaining === 1 ? '' : 's'
      statusMessage = `You have ${remaining} Resonance badge${plural} left to award this year`
    } else {
      statusMessage = 'You have used all your Resonance badges for this year'
    }

    return NextResponse.json({
      remainingAwards: remaining,
      maxAwards: 2,
      year: currentYear,
      message: statusMessage,
    })
  } catch (error) {
    console.error('Error getting peer award status:', error)
    return NextResponse.json(
      { error: 'Error getting peer award status' },
      { status: 500 }
    )
  }
}
