import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// GET /api/kudos - Obtener feed de kudos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const cursor = searchParams.get('cursor') // Para paginación

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
      nextCursor: kudos.length === limit ? kudos[kudos.length - 1]?.id : null,
    })
  } catch (error) {
    console.error('Error fetching kudos:', error)
    return NextResponse.json(
      { error: 'Error al obtener kudos' },
      { status: 500 }
    )
  }
}

// POST /api/kudos - Crear un nuevo kudo
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
    const { toUsername, message, categoryId, isPublic = true } = body

    // Validaciones
    if (!toUsername || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (toUsername, message)' },
        { status: 400 }
      )
    }

    if (message.length < 3 || message.length > 500) {
      return NextResponse.json(
        { error: 'El mensaje debe tener entre 3 y 500 caracteres' },
        { status: 400 }
      )
    }

    // Buscar usuario destino
    const toUser = await prisma.user.findUnique({
      where: { username: toUsername },
    })

    if (!toUser) {
      return NextResponse.json(
        { error: 'Usuario destino no encontrado' },
        { status: 404 }
      )
    }

    // No puedes enviarte kudos a ti mismo
    if (toUser.id === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes enviarte kudos a ti mismo' },
        { status: 400 }
      )
    }

    // Crear kudo
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

    // TODO: Verificar triggers de badges automáticos
    // Por ejemplo: si el usuario recibió X kudos, otorgar badge "team-spirit"

    return NextResponse.json(kudo, { status: 201 })
  } catch (error) {
    console.error('Error creating kudo:', error)
    return NextResponse.json(
      { error: 'Error al crear kudo' },
      { status: 500 }
    )
  }
}
