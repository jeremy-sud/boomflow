import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/leaderboard - Ranking de usuarios
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'badges' // badges | kudos_received | kudos_sent
    const limit = parseInt(searchParams.get('limit') || '10')

    let leaderboard: Array<{
      rank: number
      user: {
        id: string
        name: string | null
        username: string
        image: string | null
      }
      count: number
    }> = []

    if (type === 'badges') {
      // Ranking por cantidad de badges
      const users = await prisma.user.findMany({
        include: {
          badges: true,
          _count: { select: { badges: true } },
        },
        orderBy: {
          badges: { _count: 'desc' },
        },
        take: limit,
      })

      leaderboard = users.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
        count: user._count.badges,
      }))
    } else if (type === 'kudos_received') {
      // Ranking por kudos recibidos
      const users = await prisma.user.findMany({
        include: {
          _count: { select: { kudosReceived: true } },
        },
        orderBy: {
          kudosReceived: { _count: 'desc' },
        },
        take: limit,
      })

      leaderboard = users.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
        count: user._count.kudosReceived,
      }))
    } else if (type === 'kudos_sent') {
      // Ranking por kudos enviados
      const users = await prisma.user.findMany({
        include: {
          _count: { select: { kudosSent: true } },
        },
        orderBy: {
          kudosSent: { _count: 'desc' },
        },
        take: limit,
      })

      leaderboard = users.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
        count: user._count.kudosSent,
      }))
    }

    return NextResponse.json({
      type,
      leaderboard,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Error al obtener leaderboard' },
      { status: 500 }
    )
  }
}
