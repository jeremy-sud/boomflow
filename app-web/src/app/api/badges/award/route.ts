import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { BadgeEngine } from '@/lib/badge-engine'

// POST /api/badges/award - Otorgar un badge manualmente
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
    const { toUsername, badgeSlug, reason } = body

    // Validaciones
    if (!toUsername || !badgeSlug) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (toUsername, badgeSlug)' },
        { status: 400 }
      )
    }

    // Buscar usuario destino
    const toUser = await prisma.user.findUnique({
      where: { username: toUsername },
    })

    if (!toUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // TODO: Verificar permisos (solo admins/managers pueden otorgar badges)
    // Por ahora, cualquier usuario autenticado puede otorgar
    
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
      { error: 'Error al otorgar badge' },
      { status: 500 }
    )
  }
}

// DELETE /api/badges/award - Revocar un badge
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { username, badgeSlug } = body

    if (!username || !badgeSlug) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (username, badgeSlug)' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // TODO: Verificar permisos de admin
    
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
      { error: 'Error al revocar badge' },
      { status: 500 }
    )
  }
}
