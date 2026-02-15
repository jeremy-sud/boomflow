import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'

// GET /api/badges/progress - Progreso hacia badges no obtenidos
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    
    let userId = session.user.id
    
    // Si se pide de otro usuario
    if (username) {
      const user = await prisma.user.findUnique({
        where: { username }
      })
      if (!user) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }
      userId = user.id
    }

    // Obtener progreso
    const progress = await BadgeEngine.getBadgeProgress(userId)
    
    // Obtener stats
    const stats = await BadgeEngine.getUserStats(userId)

    return NextResponse.json({
      stats,
      progress,
      nextBadges: progress.slice(0, 5), // Los 5 más cercanos
    })
  } catch (error) {
    console.error('Error fetching badge progress:', error)
    return NextResponse.json(
      { error: 'Error al obtener progreso' },
      { status: 500 }
    )
  }
}
