/**
 * Kudos API Routes
 * CRUD operations for kudos (peer recognition)
 */

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { checkAndAwardBadges } from '../services/badgeEngine.js'
import { notifyKudoReceived } from '../services/notificationService.js'
import { logKudoCreated } from '../services/auditLogService.js'

const router = Router()

/**
 * Parses pagination query params safely
 * @param {Object} query - Express query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
function parsePagination(query) {
  const page = Number.parseInt(query.page || '1', 10)
  const limit = Number.parseInt(query.limit || '20', 10)
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

// Validation schemas
const createKudoSchema = z.object({
  receiverUsername: z.string().min(1).max(50),
  message: z.string().min(5).max(500),
  category: z.enum(['ONBOARDING', 'CODING', 'DEVOPS', 'COLLABORATION', 'LEADERSHIP', 'DOCUMENTATION']),
  isPublic: z.boolean().default(true)
})

/**
 * POST /api/kudos
 * Send a kudo to another user
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const data = createKudoSchema.parse(req.body)
  
  // Find receiver
  const receiver = await prisma.user.findUnique({
    where: { username: data.receiverUsername }
  })

  if (!receiver) {
    return res.status(404).json({ error: 'User not found' })
  }

  // Can't kudo yourself
  if (receiver.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot send kudo to yourself' })
  }

  // Create the kudo
  const kudo = await prisma.kudo.create({
    data: {
      message: data.message,
      category: data.category,
      isPublic: data.isPublic,
      giverId: req.user.id,
      receiverId: receiver.id
    },
    include: {
      giver: {
        select: { username: true, displayName: true, avatarUrl: true }
      },
      receiver: {
        select: { username: true, displayName: true, avatarUrl: true }
      }
    }
  })

  // Check if receiver unlocked any badges
  const unlockedBadge = await checkAndAwardBadges(receiver.id, data.category)

  // Send notification to receiver
  await notifyKudoReceived({
    toUserId: receiver.id,
    fromUsername: req.user.username,
    kudoId: kudo.id,
    message: kudo.message,
    category: data.category,
  })

  // Log to audit trail for compliance
  await logKudoCreated({
    userId: req.user.id,
    kudoId: kudo.id,
    receiverId: receiver.id,
    category: data.category,
    req,
  })

  res.status(201).json({
    ...kudo,
    badgeUnlocked: unlockedBadge
  })
}))

/**
 * GET /api/kudos/feed
 * Get public kudos feed (for organization or global)
 */
router.get('/feed', optionalAuth, asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)

  const where = {
    isPublic: true,
    // If user is logged in and part of org, show org's kudos
    ...(req.user?.organizationId && {
      OR: [
        { giver: { organizationId: req.user.organizationId } },
        { receiver: { organizationId: req.user.organizationId } }
      ]
    })
  }

  const [kudos, total] = await Promise.all([
    prisma.kudo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        giver: {
          select: { username: true, displayName: true, avatarUrl: true }
        },
        receiver: {
          select: { username: true, displayName: true, avatarUrl: true }
        }
      }
    }),
    prisma.kudo.count({ where })
  ])

  res.json({
    data: kudos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}))

/**
 * GET /api/kudos/received
 * Get kudos received by the authenticated user
 */
router.get('/received', authenticate, asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)
  const { category } = req.query

  const where = {
    receiverId: req.user.id,
    ...(category && { category })
  }

  const [kudos, total] = await Promise.all([
    prisma.kudo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        giver: {
          select: { username: true, displayName: true, avatarUrl: true }
        }
      }
    }),
    prisma.kudo.count({ where })
  ])

  res.json({
    data: kudos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}))

/**
 * GET /api/kudos/given
 * Get kudos given by the authenticated user
 */
router.get('/given', authenticate, asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query)

  const [kudos, total] = await Promise.all([
    prisma.kudo.findMany({
      where: { giverId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        receiver: {
          select: { username: true, displayName: true, avatarUrl: true }
        }
      }
    }),
    prisma.kudo.count({ where: { giverId: req.user.id } })
  ])

  res.json({
    data: kudos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}))

/**
 * GET /api/kudos/stats
 * Get kudo statistics for the authenticated user
 */
router.get('/stats', authenticate, asyncHandler(async (req, res) => {
  const [received, given, byCategory] = await Promise.all([
    // Total received
    prisma.kudo.count({ where: { receiverId: req.user.id } }),
    // Total given
    prisma.kudo.count({ where: { giverId: req.user.id } }),
    // Received by category
    prisma.kudo.groupBy({
      by: ['category'],
      where: { receiverId: req.user.id },
      _count: true
    })
  ])

  const categoryStats = {}
  byCategory.forEach(item => {
    categoryStats[item.category] = item._count
  })

  res.json({
    received,
    given,
    byCategory: categoryStats
  })
}))

/**
 * GET /api/kudos/:id
 * Get a single kudo by ID
 */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const kudo = await prisma.kudo.findUnique({
    where: { id: req.params.id },
    include: {
      giver: {
        select: { username: true, displayName: true, avatarUrl: true }
      },
      receiver: {
        select: { username: true, displayName: true, avatarUrl: true }
      }
    }
  })

  if (!kudo) {
    return res.status(404).json({ error: 'Kudo not found' })
  }

  // Check visibility
  if (!kudo.isPublic && 
      req.user?.id !== kudo.giverId && 
      req.user?.id !== kudo.receiverId) {
    return res.status(403).json({ error: 'This kudo is private' })
  }

  res.json(kudo)
}))

export default router
