/**
 * GitHub Sync API Routes
 * Sync badges to GitHub profile
 */

import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { syncUserBadgesToGitHub } from '../services/githubSync.js'

const router = Router()

/**
 * POST /api/sync/github
 * Trigger a sync of user's badges to their GitHub profile
 */
router.post('/github', authenticate, asyncHandler(async (req, res) => {
  // Get user with GitHub info
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      displayName: true,
      githubId: true,
      githubToken: true,
      organization: {
        select: { name: true }
      }
    }
  })

  if (!user.githubId) {
    return res.status(400).json({ 
      error: 'GitHub account not connected',
      message: 'Please connect your GitHub account to sync badges'
    })
  }

  // Get user's badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    orderBy: { awardedAt: 'desc' },
    include: {
      badge: {
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          tier: true
        }
      }
    }
  })

  // Build JSON for GitHub Action
  const userData = {
    username: user.username,
    displayName: user.displayName,
    org: user.organization?.name || null,
    badges: userBadges.map(ub => ({
      id: ub.badge.slug,
      awardedAt: ub.awardedAt.toISOString().split('T')[0],
      awardedBy: ub.awardedBy || 'system'
    }))
  }

  // Try to sync if user has GitHub token
  if (user.githubToken) {
    try {
      await syncUserBadgesToGitHub(user.username, userData, user.githubToken)
      
      res.json({
        success: true,
        message: 'Badges synced to GitHub',
        badges: userData.badges.length
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to sync to GitHub',
        message: error.message
      })
    }
  } else {
    // Return the JSON for manual sync via GitHub Action
    res.json({
      success: true,
      message: 'Export ready for GitHub Action sync',
      userData,
      instructions: 'Use this data in your BOOMFLOW repo users/{username}.json file'
    })
  }
}))

/**
 * GET /api/sync/export/:username
 * Export user's badge data in GitHub Action format
 */
router.get('/export/:username', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      username: true,
      displayName: true,
      role: true,
      organization: { select: { name: true } },
      createdAt: true
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const userBadges = await prisma.userBadge.findMany({
    where: { user: { username: req.params.username } },
    orderBy: { awardedAt: 'desc' },
    include: {
      badge: {
        select: { slug: true }
      }
    }
  })

  const exportData = {
    username: user.username,
    displayName: user.displayName,
    role: user.role || 'Member',
    org: user.organization?.name || null,
    joinedAt: user.createdAt.toISOString().split('T')[0],
    badges: userBadges.map(ub => ({
      id: ub.badge.slug,
      awardedAt: ub.awardedAt.toISOString().split('T')[0],
      awardedBy: ub.awardedBy || 'system'
    }))
  }

  res.json(exportData)
}))

/**
 * GET /api/sync/status
 * Get sync status for authenticated user
 */
router.get('/status', authenticate, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      githubId: true,
      lastActiveAt: true,
      _count: {
        select: { badges: true }
      }
    }
  })

  res.json({
    githubConnected: !!user.githubId,
    badgeCount: user._count.badges,
    lastSync: user.lastActiveAt
  })
}))

export default router
