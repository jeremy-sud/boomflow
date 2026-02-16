/**
 * BOOMFLOW Audit Log Service
 * Tracks important actions for compliance and debugging
 * 
 * @module services/auditLogService
 * @description Audit logging service for BOOMFLOW.
 *              Logs important actions for compliance and debugging.
 */

import { prisma } from '../lib/prisma.js'

/**
 * Action types for audit logging
 * @readonly
 * @enum {string}
 */
export const AuditAction = {
  // Kudo actions
  KUDO_CREATED: 'kudo_created',
  KUDO_DELETED: 'kudo_deleted',
  
  // Badge actions  
  BADGE_CREATED: 'badge_created',
  BADGE_AWARDED: 'badge_awarded',
  BADGE_REVOKED: 'badge_revoked',
  BADGE_DEACTIVATED: 'badge_deactivated',
  
  // User actions
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_ROLE_CHANGED: 'user_role_changed',
  
  // Organization actions
  ORG_CREATED: 'org_created',
  ORG_UPDATED: 'org_updated',
  ORG_MEMBER_ADDED: 'org_member_added',
  ORG_MEMBER_REMOVED: 'org_member_removed',
  
  // Auth actions
  AUTH_LOGIN: 'auth_login',
  AUTH_LOGOUT: 'auth_logout',
  AUTH_FAILED: 'auth_failed',
  
  // GitHub sync
  GITHUB_SYNC: 'github_sync',
  GITHUB_PROFILE_UPDATED: 'github_profile_updated',
}

/**
 * Resource types that can be audited
 * @readonly
 * @enum {string}
 */
export const AuditResource = {
  KUDO: 'Kudo',
  BADGE: 'Badge',
  USER_BADGE: 'UserBadge',
  USER: 'User',
  ORGANIZATION: 'Organization',
  TEAM: 'Team',
  INVITE: 'Invite',
}

/**
 * Creates an audit log entry
 * 
 * @async
 * @param {Object} params - Audit log parameters
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - Action type (from AuditAction)
 * @param {string} params.resource - Resource type (from AuditResource)
 * @param {string} params.resourceId - ID of the affected resource
 * @param {Object} [params.metadata={}] - Additional context data
 * @param {string} [params.ipAddress] - Client IP address
 * @param {string} [params.userAgent] - Client user agent
 * @returns {Promise<Object>} Created audit log entry
 * 
 * @example
 * await createAuditLog({
 *   userId: 'user123',
 *   action: AuditAction.KUDO_CREATED,
 *   resource: AuditResource.KUDO,
 *   resourceId: 'kudo456',
 *   metadata: { receiverId: 'user789', category: 'CODING' }
 * })
 */
export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  metadata = {},
  ipAddress = null,
  userAgent = null,
}) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      resourceId,
      metadata,
      ipAddress,
      userAgent,
    },
  })
}

/**
 * Logs a kudo creation event
 * 
 * @async
 * @param {Object} params - Kudo audit parameters
 * @param {string} params.userId - ID of the user who sent the kudo
 * @param {string} params.kudoId - ID of the created kudo
 * @param {string} params.receiverId - ID of the kudo recipient
 * @param {string} params.category - Category of the kudo
 * @param {Object} [params.req] - Express request object for IP/UA extraction
 * @returns {Promise<Object>} Created audit log entry
 */
export async function logKudoCreated({ userId, kudoId, receiverId, category, req }) {
  return createAuditLog({
    userId,
    action: AuditAction.KUDO_CREATED,
    resource: AuditResource.KUDO,
    resourceId: kudoId,
    metadata: {
      receiverId,
      category,
      timestamp: new Date().toISOString(),
    },
    ipAddress: extractIpAddress(req),
    userAgent: extractUserAgent(req),
  })
}

/**
 * Logs a badge award event
 * 
 * @async
 * @param {Object} params - Badge award audit parameters
 * @param {string} params.awarderId - ID of the user awarding the badge
 * @param {string} params.userId - ID of the user receiving the badge
 * @param {string} params.badgeId - ID of the badge
 * @param {string} params.userBadgeId - ID of the UserBadge record
 * @param {string} [params.badgeName] - Name of the badge
 * @param {string} [params.reason] - Reason for awarding
 * @param {Object} [params.req] - Express request object for IP/UA extraction
 * @returns {Promise<Object>} Created audit log entry
 */
export async function logBadgeAwarded({
  awarderId,
  userId,
  badgeId,
  userBadgeId,
  badgeName,
  reason,
  req,
}) {
  return createAuditLog({
    userId: awarderId,
    action: AuditAction.BADGE_AWARDED,
    resource: AuditResource.USER_BADGE,
    resourceId: userBadgeId,
    metadata: {
      recipientUserId: userId,
      badgeId,
      badgeName,
      reason,
      timestamp: new Date().toISOString(),
    },
    ipAddress: extractIpAddress(req),
    userAgent: extractUserAgent(req),
  })
}

/**
 * Logs a GitHub sync event
 * 
 * @async
 * @param {Object} params - GitHub sync audit parameters
 * @param {string} params.userId - ID of the user being synced
 * @param {Object} params.stats - Sync statistics
 * @param {number} params.badgesAwarded - Number of badges awarded during sync
 * @returns {Promise<Object>} Created audit log entry
 */
export async function logGitHubSync({ userId, stats, badgesAwarded }) {
  return createAuditLog({
    userId,
    action: AuditAction.GITHUB_SYNC,
    resource: AuditResource.USER,
    resourceId: userId,
    metadata: {
      stats,
      badgesAwarded,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Gets audit logs with optional filters
 * 
 * @async
 * @param {Object} [filters={}] - Query filters
 * @param {string} [filters.userId] - Filter by user ID
 * @param {string} [filters.action] - Filter by action type
 * @param {string} [filters.resource] - Filter by resource type
 * @param {Date} [filters.startDate] - Filter logs after this date
 * @param {Date} [filters.endDate] - Filter logs before this date
 * @param {number} [filters.limit=100] - Max entries to return
 * @param {number} [filters.offset=0] - Pagination offset
 * @returns {Promise<Object[]>} Array of audit log entries
 */
export async function getAuditLogs({
  userId,
  action,
  resource,
  startDate,
  endDate,
  limit = 100,
  offset = 0,
} = {}) {
  return prisma.auditLog.findMany({
    where: {
      ...(userId && { userId }),
      ...(action && { action }),
      ...(resource && { resource }),
      ...(startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

/**
 * Extracts IP address from Express request
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} IP address or null
 */
function extractIpAddress(req) {
  if (!req) return null
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
    || req.socket?.remoteAddress 
    || null
}

/**
 * Extracts User-Agent from Express request
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} User agent or null
 */
function extractUserAgent(req) {
  if (!req) return null
  return req.headers['user-agent'] || null
}

export default {
  AuditAction,
  AuditResource,
  createAuditLog,
  logKudoCreated,
  logBadgeAwarded,
  logGitHubSync,
  getAuditLogs,
}
