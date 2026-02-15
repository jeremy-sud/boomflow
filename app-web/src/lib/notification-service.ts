/**
 * BOOMFLOW Notification Service
 * Sistema de notificaciones en tiempo real
 */

import prisma from '@/lib/prisma'
import { NotificationType, Prisma } from '@/generated/prisma'

export interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export class NotificationService {
  /**
   * Crear una notificación
   */
  static async create(input: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data as Prisma.InputJsonValue || Prisma.JsonNull,
      },
    })
  }

  /**
   * Notificar que recibió un kudo
   */
  static async notifyKudoReceived(
    toUserId: string,
    fromUsername: string,
    kudoId: string,
    message: string
  ) {
    return this.create({
      userId: toUserId,
      type: NotificationType.KUDO_RECEIVED,
      title: '🎉 ¡Recibiste un Kudo!',
      message: `${fromUsername} te envió un kudo: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      data: { kudoId, fromUsername },
    })
  }

  /**
   * Notificar que ganó un badge
   */
  static async notifyBadgeEarned(
    userId: string,
    badge: { id: string; name: string; slug: string; tier: string }
  ) {
    const tierEmoji = badge.tier === 'GOLD' ? '🥇' : badge.tier === 'SILVER' ? '🥈' : '🥉'
    
    return this.create({
      userId,
      type: NotificationType.BADGE_EARNED,
      title: `${tierEmoji} ¡Nuevo Badge Desbloqueado!`,
      message: `Has obtenido el badge "${badge.name}"`,
      data: { badgeId: badge.id, badgeSlug: badge.slug, tier: badge.tier },
    })
  }

  /**
   * Notificar progreso hacia un badge
   */
  static async notifyBadgeProgress(
    userId: string,
    badge: { name: string; slug: string },
    progress: number,
    target: number
  ) {
    const percentage = Math.round((progress / target) * 100)
    
    // Solo notificar en hitos: 50%, 75%, 90%
    if (percentage !== 50 && percentage !== 75 && percentage !== 90) {
      return null
    }

    return this.create({
      userId,
      type: NotificationType.BADGE_PROGRESS,
      title: `🎯 ¡Estás cerca de "${badge.name}"!`,
      message: `Progreso: ${progress}/${target} (${percentage}%)`,
      data: { badgeSlug: badge.slug, progress, target, percentage },
    })
  }

  /**
   * Obtener notificaciones de un usuario
   */
  static async getByUser(userId: string, options?: { limit?: number; unreadOnly?: boolean }) {
    const { limit = 20, unreadOnly = false } = options || {}

    return prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Contar notificaciones no leídas
   */
  static async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    })
  }

  /**
   * Marcar notificación como leída
   */
  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    })
  }

  /**
   * Marcar todas como leídas
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }

  /**
   * Eliminar notificaciones antiguas (más de 30 días)
   */
  static async cleanOld() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return prisma.notification.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        read: true,
      },
    })
  }
}

export default NotificationService
