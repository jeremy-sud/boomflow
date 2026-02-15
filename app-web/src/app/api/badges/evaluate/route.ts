import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'

// POST /api/badges/evaluate - Evalúa y otorga badges pendientes
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const username = body.username
    
    let userId = session.user.id
    
    // Si se especifica otro usuario (solo para admins en el futuro)
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

    // Evaluar todos los badges automáticos
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
      { error: 'Error al evaluar badges' },
      { status: 500 }
    )
  }
}
