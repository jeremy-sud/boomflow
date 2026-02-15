import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ badgeId: string }>
}

/**
 * GET /api/badges/skins/[badgeId] - Get the current skin for a user's badge
 * 
 * Note: Requires `prisma generate` after schema update to enable skin relations
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { badgeId } = await params

    const userBadge = await prisma.userBadge.findFirst({
      where: {
        userId: session.user.id,
        badgeId,
      },
      include: {
        badge: true,
        skin: true,
      },
    })

    if (!userBadge) {
      return NextResponse.json(
        { error: 'Badge not found for this user' },
        { status: 404 }
      )
    }

    const badge = userBadge.badge
    const skin = userBadge.skin

    return NextResponse.json({
      badge: {
        id: badge.id,
        name: badge.name,
        slug: badge.slug,
      },
      currentSkin: skin ? {
        id: skin.id,
        name: skin.name,
        slug: skin.slug,
        style: skin.style,
      } : null,
    })
  } catch (error) {
    console.error('Error fetching badge skin:', error)
    return NextResponse.json(
      { error: 'Error fetching badge skin' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/badges/skins/[badgeId] - Set the skin for a user's badge
 * 
 * Note: Requires `prisma generate` after schema update to enable skin relations
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { badgeId } = await params
    const body = await request.json()
    const { skinId } = body

    // Find the user's badge
    const userBadge = await prisma.userBadge.findFirst({
      where: {
        userId: session.user.id,
        badgeId,
      },
      include: {
        badge: true,
      },
    })

    if (!userBadge) {
      return NextResponse.json(
        { error: 'Badge not found for this user' },
        { status: 404 }
      )
    }

    // If skinId is null, remove the skin (use default)
    if (skinId === null) {
      const updated = await prisma.userBadge.update({
        where: { id: userBadge.id },
        data: { skinId: null },
        include: { badge: true },
      })

      return NextResponse.json({
        success: true,
        message: 'Badge skin reset to default',
        badge: updated.badge.name,
        skin: null,
      })
    }

    // Find the skin
    const skin = await prisma.badgeSkin.findUnique({
      where: { id: skinId },
    })

    if (!skin) {
      return NextResponse.json(
        { error: 'Skin not found' },
        { status: 404 }
      )
    }

    // Check if user has access to premium skins
    if (skin.isPremium) {
      const userPatronBadges = await prisma.userBadge.count({
        where: {
          userId: session.user.id,
          badge: {
            category: 'PREMIUM',
          },
        },
      })

      if (userPatronBadges === 0) {
        return NextResponse.json(
          { error: 'Premium skin access requires a Patron badge' },
          { status: 403 }
        )
      }
    }

    // Update the skin
    const updated = await prisma.userBadge.update({
      where: { id: userBadge.id },
      data: { skinId: skin.id },
      include: {
        badge: true,
        skin: true,
      },
    })

    const updatedSkin = updated.skin

    return NextResponse.json({
      success: true,
      message: `Badge skin updated to ${skin.name}`,
      badge: updated.badge.name,
      skin: updatedSkin ? {
        id: updatedSkin.id,
        name: updatedSkin.name,
        style: updatedSkin.style,
      } : null,
    })
  } catch (error) {
    console.error('Error updating badge skin:', error)
    return NextResponse.json(
      { error: 'Error updating badge skin' },
      { status: 500 }
    )
  }
}
