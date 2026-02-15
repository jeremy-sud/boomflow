/**
 * BOOMFLOW Notification Service
 * Handles creating and managing notifications for users
 * 
 * @module services/notificationService
 * @description Servicio de notificaciones en tiempo real para BOOMFLOW.
 *              Crea notificaciones para eventos como kudos recibidos, badges ganados, etc.
 */

import { prisma } from '../lib/prisma.js'

/**
 * Notification types supported by the system
 * @readonly
 * @enum {string}
 */
export const NotificationType = {
  /** User received a kudo from another user */
  KUDO_RECEIVED: 'kudo_received',
  /** User earned a new badge */
  BADGE_EARNED: 'badge_earned',
  /** Progress update on earning a badge */
  BADGE_PROGRESS: 'badge_progress',
  /** User received an organization invite */
  INVITE_RECEIVED: 'invite_received',
  /** System announcement */
  SYSTEM: 'system',
}

/**
 * Emoji mapping for badge tiers
 * @readonly
 */
const TIER_EMOJI = {
  GOLD: '🥇',
  SILVER: '🥈',
  BRONZE: '🥉',
}

/**
 * Creates a new notification for a user
 * 
 * @async
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - ID of the user to notify
 * @param {string} params.type - Type of notification (from NotificationType)
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body/message
 * @param {Object} [params.data={}] - Additional data payload
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification({ userId, type, title, body, data = {} }) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data,
    },
  })
}

/**
 * Notifies a user that they received a kudo
 * 
 * @async
 * @param {Object} params - Kudo notification parameters
 * @param {string} params.toUserId - ID of the kudo recipient
 * @param {string} params.fromUsername - Username of the kudo sender
 * @param {string} params.kudoId - ID of the kudo
 * @param {string} params.message - The kudo message (truncated if too long)
 * @param {string} params.category - Category of the kudo
 * @returns {Promise<Object>} Created notification
 * 
 * @example
 * await notifyKudoReceived({
 *   toUserId: 'user123',
 *   fromUsername: 'jeremy-sud',
 *   kudoId: 'kudo456',
 *   message: 'Great job on the PR review!',
 *   category: 'COLLABORATION'
 * })
 */
export async function notifyKudoReceived({ toUserId, fromUsername, kudoId, message, category }) {
  // Truncate message for notification display
  const truncatedMessage = message.length > 100 
    ? `${message.substring(0, 97)}...` 
    : message

  return createNotification({
    userId: toUserId,
    type: NotificationType.KUDO_RECEIVED,
    title: '💜 ¡Recibiste un Kudo!',
    body: `${fromUsername} te reconoció: "${truncatedMessage}"`,
    data: {
      kudoId,
      fromUsername,
      category,
    },
  })
}

/**
 * Notifies a user that they earned a new badge
 * 
 * @async
 * @param {Object} params - Badge notification parameters
 * @param {string} params.userId - ID of the user who earned the badge
 * @param {Object} params.badge - Badge information
 * @param {string} params.badge.id - Badge ID
 * @param {string} params.badge.name - Badge name
 * @param {string} params.badge.slug - Badge slug
 * @param {string} params.badge.tier - Badge tier (GOLD, SILVER, BRONZE)
 * @returns {Promise<Object>} Created notification
 * 
 * @example
 * await notifyBadgeEarned({
 *   userId: 'user123',
 *   badge: { id: 'badge456', name: 'Code Ninja', slug: 'code-ninja', tier: 'GOLD' }
 * })
 */
export async function notifyBadgeEarned({ userId, badge }) {
  const emoji = TIER_EMOJI[badge.tier] || '🏅'

  return createNotification({
    userId,
    type: NotificationType.BADGE_EARNED,
    title: `${emoji} ¡Nuevo Badge Desbloqueado!`,
    body: `Has obtenido el badge "${badge.name}"`,
    data: {
      badgeId: badge.id,
      badgeSlug: badge.slug,
      tier: badge.tier,
    },
  })
}

/**
 * Gets notifications for a user with optional filters
 * 
 * @async
 * @param {string} userId - ID of the user
 * @param {Object} [options] - Query options
 * @param {number} [options.limit=20] - Max notifications to return
 * @param {boolean} [options.unreadOnly=false] - Only return unread notifications
 * @returns {Promise<Object[]>} Array of notifications
 */
export async function getNotificationsByUser(userId, { limit = 20, unreadOnly = false } = {}) {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly && { isRead: false }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

/**
 * Marks notifications as read
 * 
 * @async
 * @param {string[]} notificationIds - IDs of notifications to mark as read
 * @param {string} userId - User ID (for security validation)
 * @returns {Promise<Object>} Update result with count of affected rows
 */
export async function markAsRead(notificationIds, userId) {
  return prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId, // Security: only update user's own notifications
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

/**
 * Counts unread notifications for a user
 * 
 * @async
 * @param {string} userId - ID of the user
 * @returns {Promise<number>} Count of unread notifications
 */
export async function countUnread(userId) {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  })
}

export default {
  NotificationType,
  createNotification,
  notifyKudoReceived,
  notifyBadgeEarned,
  getNotificationsByUser,
  markAsRead,
  countUnread,
}
