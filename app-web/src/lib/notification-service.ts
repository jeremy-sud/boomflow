/**
 * BOOMFLOW Notification Service
 * Real-time notification system
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
   * Create a notification
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
   * Notify that a kudo was received
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
      title: '🎉 You received a Kudo!',
      message: `${fromUsername} sent you a kudo: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      data: { kudoId, fromUsername },
    })
  }

  /**
   * Notify that a badge was earned
   */
  static async notifyBadgeEarned(
    userId: string,
    badge: { id: string; name: string; slug: string; tier: string }
  ) {
    // Determine emoji based on badge tier
    const tierEmojiMap: Record<string, string> = {
      GOLD: '🥇',
      SILVER: '🥈',
      BRONZE: '🥉'
    }
    const tierEmoji = tierEmojiMap[badge.tier] ?? '🥉'
    
    return this.create({
      userId,
      type: NotificationType.BADGE_EARNED,
      title: `${tierEmoji} New Badge Unlocked!`,
      message: `You earned the badge "${badge.name}"`,
      data: { badgeId: badge.id, badgeSlug: badge.slug, tier: badge.tier },
    })
  }

  /**
   * Notify progress towards a badge
   */
  static async notifyBadgeProgress(
    userId: string,
    badge: { name: string; slug: string },
    progress: number,
    target: number
  ) {
    const percentage = Math.round((progress / target) * 100)
    
    // Only notify at milestones: 50%, 75%, 90%
    if (percentage !== 50 && percentage !== 75 && percentage !== 90) {
      return null
    }

    return this.create({
      userId,
      type: NotificationType.BADGE_PROGRESS,
      title: `🎯 You're close to "${badge.name}"!`,
      message: `Progress: ${progress}/${target} (${percentage}%)`,
      data: { badgeSlug: badge.slug, progress, target, percentage },
    })
  }

  /**
   * Get notifications for a user
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
   * Count unread notifications
   */
  static async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    })
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    })
  }

  /**
   * Mark all as read
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }

  /**
   * Delete old notifications (older than 30 days)
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
