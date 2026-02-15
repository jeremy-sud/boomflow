/**
 * Badges API Routes
 * Badge catalog and user badges
 */

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { notifyBadgeEarned } from '../services/notificationService.js'
import { logBadgeAwarded } from '../services/auditLogService.js'

const router = Router()

// Validation schemas
const createBadgeSchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(['ONBOARDING', 'CODING', 'DEVOPS', 'COLLABORATION', 'LEADERSHIP', 'DOCUMENTATION']),
  tier: z.enum(['BRONZE', 'SILVER', 'GOLD']),
  svgUrl: z.string().url().optional(),
  triggerType: z.enum(['KUDO_COUNT', 'KUDO_CATEGORY', 'MANUAL', 'SYSTEM']),
  triggerCount: z.number().int().min(1).default(1),
  triggerCategory: z.enum(['ONBOARDING', 'CODING', 'DEVOPS', 'COLLABORATION', 'LEADERSHIP', 'DOCUMENTATION']).optional(),
  isGlobal: z.boolean().default(false)
})

const awardBadgeSchema = z.object({
  userId: z.string().cuid(),
  badgeId: z.string().cuid(),
  reason: z.string().max(500).optional()
})

/**
 * GET /api/badges/catalog
 * Get all available badges
 */
router.get('/catalog', optionalAuth, asyncHandler(async (req, res) => {
  const { category, tier } = req.query

  const where = {
    isActive: true,
    OR: [
      { isGlobal: true },
      ...(req.user?.organizationId 
        ? [{ organizationId: req.user.organizationId }] 
        : [])
    ],
    ...(category && { category }),
    ...(tier && { tier })
  }

  const badges = await prisma.badge.findMany({
    where,
    orderBy: [
      { category: 'asc' },
      { tier: 'asc' },
      { name: 'asc' }
    ],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      category: true,
      tier: true,
      svgUrl: true,
      triggerType: true,
      triggerCount: true,
      triggerCategory: true,
      isGlobal: true,
      _count: {
        select: { userBadges: true }
      }
    }
  })

  res.json(badges.map(b => ({
    ...b,
    totalAwarded: b._count.userBadges,
    _count: undefined
  })))
}))

/**
 * GET /api/badges/my
 * Get authenticated user's badges
 */
router.get('/my', authenticate, asyncHandler(async (req, res) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: req.user.id },
    orderBy: { awardedAt: 'desc' },
    include: {
      badge: {
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          category: true,
          tier: true,
          svgUrl: true
        }
      }
    }
  })

  res.json(userBadges.map(ub => ({
    ...ub.badge,
    awardedAt: ub.awardedAt,
    awardedBy: ub.awardedBy,
    reason: ub.reason
  })))
}))

/**
 * GET /api/badges/user/:username
 * Get a user's public badges
 */
router.get('/user/:username', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username }
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    orderBy: { awardedAt: 'desc' },
    include: {
      badge: {
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          category: true,
          tier: true,
          svgUrl: true
        }
      }
    }
  })

  res.json({
    user: {
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl
    },
    badges: userBadges.map(ub => ({
      ...ub.badge,
      awardedAt: ub.awardedAt
    }))
  })
}))

/**
 * GET /api/badges/:id
 * Get badge details
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const badge = await prisma.badge.findUnique({
    where: { id: req.params.id },
    include: {
      _count: {
        select: { userBadges: true }
      },
      userBadges: {
        take: 10,
        orderBy: { awardedAt: 'desc' },
        include: {
          user: {
            select: { username: true, displayName: true, avatarUrl: true }
          }
        }
      }
    }
  })

  if (!badge) {
    return res.status(404).json({ error: 'Badge not found' })
  }

  res.json({
    ...badge,
    totalAwarded: badge._count.userBadges,
    recentRecipients: badge.userBadges.map(ub => ({
      ...ub.user,
      awardedAt: ub.awardedAt
    })),
    _count: undefined,
    userBadges: undefined
  })
}))

/**
 * POST /api/badges
 * Create a new badge (admin only)
 */
router.post('/', authenticate, requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const data = createBadgeSchema.parse(req.body)

  // If not global, must be tied to user's organization
  const badge = await prisma.badge.create({
    data: {
      ...data,
      svgUrl: data.svgUrl || `/assets/${data.slug}.svg`,
      organizationId: data.isGlobal ? null : req.user.organizationId
    }
  })

  res.status(201).json(badge)
}))

/**
 * POST /api/badges/award
 * Manually award a badge to a user (admin only)
 */
router.post('/award', authenticate, requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  const data = awardBadgeSchema.parse(req.body)

  // Check if already awarded
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId: data.userId,
        badgeId: data.badgeId
      }
    }
  })

  if (existing) {
    return res.status(409).json({ error: 'User already has this badge' })
  }

  const userBadge = await prisma.userBadge.create({
    data: {
      userId: data.userId,
      badgeId: data.badgeId,
      awardedBy: req.user.id,
      reason: data.reason
    },
    include: {
      badge: true,
      user: {
        select: { username: true, displayName: true }
      }
    }
  })

  // Send notification to user about their new badge
  await notifyBadgeEarned({
    userId: data.userId,
    badge: {
      id: userBadge.badge.id,
      name: userBadge.badge.name,
      slug: userBadge.badge.slug,
      tier: userBadge.badge.tier,
    },
  })

  // Log badge award to audit trail for compliance
  await logBadgeAwarded({
    awarderId: req.user.id,
    userId: data.userId,
    badgeId: data.badgeId,
    userBadgeId: userBadge.id,
    badgeName: userBadge.badge.name,
    reason: data.reason,
    req,
  })

  res.status(201).json(userBadge)
}))

/**
 * DELETE /api/badges/:id
 * Deactivate a badge (admin only)
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  await prisma.badge.update({
    where: { id: req.params.id },
    data: { isActive: false }
  })

  res.status(204).send()
}))

export default router
