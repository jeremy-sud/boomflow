import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'
import { NotificationService } from '@/lib/notification-service'
import { TriggerType } from '@/generated/prisma'

// GET /api/kudos - Get kudos feed
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10)
    const cursor = searchParams.get('cursor') // For pagination

    const kudos = await prisma.kudo.findMany({
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      include: {
        from: {
          select: { id: true, name: true, username: true, image: true }
        },
        to: {
          select: { id: true, name: true, username: true, image: true }
        },
        category: true,
      },
    })

    return NextResponse.json({
      kudos,
      nextCursor: kudos.length === limit ? kudos.at(-1)?.id : null,
    })
  } catch (error) {
    console.error('Error fetching kudos:', error)
    return NextResponse.json(
      { error: 'Error fetching kudos' },
      { status: 500 }
    )
  }
}

// POST /api/kudos - Create a new kudo
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
    const { toUsername, message, categoryId, isPublic = true } = body

    // Validations
    if (!toUsername || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (toUsername, message)' },
        { status: 400 }
      )
    }

    if (message.length < 3 || message.length > 500) {
      return NextResponse.json(
        { error: 'Message must be between 3 and 500 characters' },
        { status: 400 }
      )
    }

    // Find target user
    const toUser = await prisma.user.findUnique({
      where: { username: toUsername },
    })

    if (!toUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      )
    }

    // You cannot send kudos to yourself
    if (toUser.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot send kudos to yourself' },
        { status: 400 }
      )
    }

    // Create kudo
    const kudo = await prisma.kudo.create({
      data: {
        message,
        isPublic,
        fromId: session.user.id,
        toId: toUser.id,
        categoryId: categoryId || null,
      },
      include: {
        from: {
          select: { id: true, name: true, username: true, image: true }
        },
        to: {
          select: { id: true, name: true, username: true, image: true }
        },
        category: true,
      },
    })

    // Badge Engine: Evaluate automatic triggers
    // For the kudo receiver
    const receiverBadges = await BadgeEngine.evaluateTrigger(
      toUser.id, 
      TriggerType.KUDOS_RECEIVED
    )
    // For the kudo sender
    const senderBadges = await BadgeEngine.evaluateTrigger(
      session.user.id, 
      TriggerType.KUDOS_SENT
    )

    // Send notifications
    const senderUsername = session.user.username || session.user.name || 'Someone'
    
    // Notify kudo received
    await NotificationService.notifyKudoReceived(
      toUser.id,
      senderUsername,
      kudo.id,
      message
    )

    // Notify badges earned by the receiver
    for (const result of receiverBadges.filter(b => b.awarded && b.badge)) {
      await NotificationService.notifyBadgeEarned(toUser.id, result.badge!)
    }

    // Notify badges earned by the sender
    for (const result of senderBadges.filter(b => b.awarded && b.badge)) {
      await NotificationService.notifyBadgeEarned(session.user.id, result.badge!)
    }

    return NextResponse.json({
      kudo,
      badgesAwarded: {
        receiver: receiverBadges.filter(b => b.awarded),
        sender: senderBadges.filter(b => b.awarded),
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating kudo:', error)
    return NextResponse.json(
      { error: 'Error creating kudo' },
      { status: 500 }
    )
  }
}
