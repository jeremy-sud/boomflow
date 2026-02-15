import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/badges/skins - Get all available badge skins
 * 
 * Note: Requires `prisma generate` after schema update to enable BadgeSkin model
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

    const skins = await prisma.badgeSkin.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { isPremium: 'asc' },
        { name: 'asc' },
      ],
    })

    // Check which premium skins the user has access to
    // Note: Use 'PREMIUM' string literal until prisma generate is run
    const userPatronBadges = await prisma.userBadge.findMany({
      where: {
        userId: session.user.id,
        badge: {
          category: 'PREMIUM',
        },
      },
      include: {
        badge: true,
      },
    })

    const hasPremiumAccess = userPatronBadges.length > 0

    const skinsWithAccess = skins.map((skin: { id: string; name: string; slug: string; description: string | null; style: string; svgIcon: string | null; isDefault: boolean; isPremium: boolean }) => ({
      id: skin.id,
      name: skin.name,
      slug: skin.slug,
      description: skin.description,
      style: skin.style,
      svgIcon: skin.svgIcon,
      isDefault: skin.isDefault,
      isPremium: skin.isPremium,
      hasAccess: !skin.isPremium || hasPremiumAccess,
    }))

    return NextResponse.json({
      skins: skinsWithAccess,
      hasPremiumAccess,
    })
  } catch (error) {
    console.error('Error fetching badge skins:', error)
    return NextResponse.json(
      { error: 'Error fetching badge skins' },
      { status: 500 }
    )
  }
}
