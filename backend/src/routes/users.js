/**
 * Users API Routes
 * User profiles and leaderboards
 */

import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

// Validation schemas
const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional()
})

/**
 * GET /api/users/me
 * Get authenticated user's profile
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      organization: {
        select: { id: true, name: true, slug: true }
      },
      team: {
        select: { id: true, name: true }
      },
      _count: {
        select: {
          kudosReceived: true,
          kudosGiven: true,
          badges: true
        }
      }
    }
  })

  res.json({
    ...user,
    stats: {
      kudosReceived: user._count.kudosReceived,
      kudosGiven: user._count.kudosGiven,
      badges: user._count.badges
    },
    _count: undefined
  })
}))

/**
 * PATCH /api/users/me
 * Update authenticated user's profile
 */
router.patch('/me', authenticate, asyncHandler(async (req, res) => {
  const data = updateProfileSchema.parse(req.body)

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...data,
      updatedAt: new Date()
    }
  })

  res.json(user)
}))

/**
 * GET /api/users/:username
 * Get public profile
 */
router.get('/:username', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      organization: {
        select: { name: true, slug: true }
      },
      team: {
        select: { name: true }
      },
      _count: {
        select: {
          kudosReceived: true,
          kudosGiven: true,
          badges: true
        }
      }
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    ...user,
    stats: {
      kudosReceived: user._count.kudosReceived,
      kudosGiven: user._count.kudosGiven,
      badges: user._count.badges
    },
    _count: undefined
  })
}))

/**
 * GET /api/users/leaderboard
 * Get top users by kudos received
 */
router.get('/leaderboard', optionalAuth, asyncHandler(async (req, res) => {
  const { period = 'all', limit = 10, category } = req.query

  // Calculate date filter
  let dateFilter = {}
  const now = new Date()
  
  switch (period) {
    case 'week':
      dateFilter = { createdAt: { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } }
      break
    case 'month':
      dateFilter = { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } }
      break
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3)
      dateFilter = { createdAt: { gte: new Date(now.getFullYear(), quarter * 3, 1) } }
      break
    // 'all' = no filter
  }

  // Build where clause
  const where = {
    ...dateFilter,
    ...(category && { category }),
    ...(req.user?.organizationId && {
      receiver: { organizationId: req.user.organizationId }
    })
  }

  // Get top receivers
  const topReceivers = await prisma.kudo.groupBy({
    by: ['receiverId'],
    where,
    _count: true,
    orderBy: { _count: { receiverId: 'desc' } },
    take: parseInt(limit)
  })

  // Get user details
  const userIds = topReceivers.map(r => r.receiverId)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true
    }
  })

  const userMap = new Map(users.map(u => [u.id, u]))

  const leaderboard = topReceivers.map((r, index) => ({
    rank: index + 1,
    user: userMap.get(r.receiverId),
    kudosCount: r._count
  }))

  res.json({
    period,
    category: category || 'all',
    leaderboard
  })
}))

/**
 * GET /api/users/search
 * Search users by username or display name
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query

  if (!q || q.length < 2) {
    return res.json([])
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true
    },
    take: parseInt(limit)
  })

  res.json(users)
}))

export default router
