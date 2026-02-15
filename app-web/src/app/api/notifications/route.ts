import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { NotificationService } from '@/lib/notification-service'

// GET /api/notifications - Obtener notificaciones del usuario
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const [notifications, unreadCount] = await Promise.all([
      NotificationService.getByUser(session.user.id, { limit, unreadOnly }),
      NotificationService.countUnread(session.user.id),
    ])

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Marcar como leída
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAll } = body

    if (markAll) {
      await NotificationService.markAllAsRead(session.user.id)
      return NextResponse.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' })
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Se requiere notificationId o markAll' },
        { status: 400 }
      )
    }

    await NotificationService.markAsRead(notificationId, session.user.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Error al marcar notificación' },
      { status: 500 }
    )
  }
}
