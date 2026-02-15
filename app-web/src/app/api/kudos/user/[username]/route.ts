import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/kudos/user/[username] - Kudos de un usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'received' // received | sent | all

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    let whereClause = {}
    if (type === 'received') {
      whereClause = { toId: user.id }
    } else if (type === 'sent') {
      whereClause = { fromId: user.id }
    } else {
      whereClause = {
        OR: [{ toId: user.id }, { fromId: user.id }],
      }
    }

    const kudos = await prisma.kudo.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50,
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

    // Estadísticas
    const stats = await prisma.kudo.groupBy({
      by: ['toId'],
      where: { toId: user.id },
      _count: true,
    })

    const sentStats = await prisma.kudo.groupBy({
      by: ['fromId'],
      where: { fromId: user.id },
      _count: true,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      },
      kudos,
      stats: {
        received: stats[0]?._count || 0,
        sent: sentStats[0]?._count || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching user kudos:', error)
    return NextResponse.json(
      { error: 'Error al obtener kudos del usuario' },
      { status: 500 }
    )
  }
}
