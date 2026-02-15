/**
 * Badge Engine Service
 * Automatically awards badges based on triggers
 */

import { prisma } from '../lib/prisma.js'

/**
 * Check if a user qualifies for any new badges after receiving a kudo
 * @param {string} userId - The user who received the kudo
 * @param {string} kudoCategory - The category of the kudo received
 * @returns {object|null} - The badge that was unlocked, or null
 */
export async function checkAndAwardBadges(userId, kudoCategory) {
  // Get all badges that can be auto-awarded
  const eligibleBadges = await prisma.badge.findMany({
    where: {
      isActive: true,
      triggerType: { in: ['KUDO_COUNT', 'KUDO_CATEGORY'] },
      // Exclude badges user already has
      NOT: {
        userBadges: {
          some: { userId }
        }
      }
    }
  })

  if (eligibleBadges.length === 0) {
    return null
  }

  // Get user's kudo counts
  const [totalKudos, categoryKudos] = await Promise.all([
    prisma.kudo.count({ where: { receiverId: userId } }),
    prisma.kudo.groupBy({
      by: ['category'],
      where: { receiverId: userId },
      _count: true
    })
  ])

  // Convert to map for easy access
  const categoryCount = new Map(
    categoryKudos.map(c => [c.category, c._count])
  )

  // Check each eligible badge
  for (const badge of eligibleBadges) {
    let qualifies = false

    switch (badge.triggerType) {
      case 'KUDO_COUNT':
        // User needs X total kudos
        qualifies = totalKudos >= badge.triggerCount
        break

      case 'KUDO_CATEGORY':
        // User needs X kudos in a specific category
        if (badge.triggerCategory) {
          const count = categoryCount.get(badge.triggerCategory) || 0
          qualifies = count >= badge.triggerCount
        }
        break
    }

    if (qualifies) {
      // Award the badge!
      const userBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          awardedBy: 'system',
          reason: `Achieved ${badge.triggerCount} ${badge.triggerCategory || 'total'} kudos`
        },
        include: {
          badge: {
            select: {
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

      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          type: 'badge_unlocked',
          title: '🏆 New Badge Unlocked!',
          body: `You earned the ${badge.name} badge!`,
          data: JSON.stringify({
            badgeId: badge.id,
            badgeSlug: badge.slug
          })
        }
      })

      // Log to audit
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'badge_awarded',
          resource: 'Badge',
          resourceId: badge.id,
          metadata: JSON.stringify({
            badgeSlug: badge.slug,
            trigger: badge.triggerType,
            triggerCount: badge.triggerCount
          })
        }
      })

      // Return the first badge unlocked (could be multiple in theory)
      return {
        slug: userBadge.badge.slug,
        name: userBadge.badge.name,
        description: userBadge.badge.description,
        message: `🏆 ${userBadge.badge.name} badge unlocked!`
      }
    }
  }

  return null
}

/**
 * Award a badge manually (by admin or through special events)
 * @param {string} userId - User to award badge to
 * @param {string} badgeSlug - Badge slug to award
 * @param {string} awardedBy - Who awarded it (user ID or 'system')
 * @param {string} reason - Optional reason for the award
 */
export async function awardBadgeManually(userId, badgeSlug, awardedBy, reason = null) {
  // Find the badge
  const badge = await prisma.badge.findUnique({
    where: { slug: badgeSlug }
  })

  if (!badge) {
    throw new Error(`Badge not found: ${badgeSlug}`)
  }

  // Check if already awarded
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: { userId, badgeId: badge.id }
    }
  })

  if (existing) {
    throw new Error('User already has this badge')
  }

  // Award it
  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
      awardedBy,
      reason
    },
    include: {
      badge: true,
      user: {
        select: { username: true, displayName: true }
      }
    }
  })

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'badge_unlocked',
      title: '🏆 New Badge Awarded!',
      body: reason || `You were awarded the ${badge.name} badge!`,
      data: JSON.stringify({
        badgeId: badge.id,
        badgeSlug: badge.slug,
        awardedBy
      })
    }
  })

  return userBadge
}

/**
 * Get progress towards all badges for a user
 * @param {string} userId - User to check progress for
 */
export async function getBadgeProgress(userId) {
  // Get all possible badges
  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { tier: 'asc' }]
  })

  // Get user's current badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true, awardedAt: true }
  })
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId))

  // Get kudo counts
  const [totalKudos, categoryKudos] = await Promise.all([
    prisma.kudo.count({ where: { receiverId: userId } }),
    prisma.kudo.groupBy({
      by: ['category'],
      where: { receiverId: userId },
      _count: true
    })
  ])

  const categoryCount = new Map(
    categoryKudos.map(c => [c.category, c._count])
  )

  // Calculate progress for each badge
  const progress = allBadges.map(badge => {
    const earned = earnedBadgeIds.has(badge.id)
    let current = 0
    let total = badge.triggerCount

    if (badge.triggerType === 'KUDO_COUNT') {
      current = Math.min(totalKudos, total)
    } else if (badge.triggerType === 'KUDO_CATEGORY' && badge.triggerCategory) {
      current = Math.min(categoryCount.get(badge.triggerCategory) || 0, total)
    } else if (badge.triggerType === 'MANUAL' || badge.triggerType === 'SYSTEM') {
      // Manual/system badges don't have numeric progress
      current = earned ? 1 : 0
      total = 1
    }

    return {
      badge: {
        id: badge.id,
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        tier: badge.tier,
        svgUrl: badge.svgUrl
      },
      earned,
      earnedAt: earned 
        ? userBadges.find(ub => ub.badgeId === badge.id)?.awardedAt 
        : null,
      progress: {
        current,
        total,
        percentage: Math.round((current / total) * 100)
      }
    }
  })

  return progress
}

/**
 * Seed default global badges
 */
export async function seedDefaultBadges() {
  const defaultBadges = [
    // Onboarding
    { slug: 'hello-world', name: 'Hello World', description: 'Joined the platform', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'first-commit', name: 'First Commit', description: 'Made your first contribution', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'first-kudo', name: 'First Kudo', description: 'Received your first recognition', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'KUDO_COUNT', triggerCount: 1 },
    
    // Coding
    { slug: 'code-ninja', name: 'Code Ninja', description: 'Recognized for coding excellence', category: 'CODING', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 5 },
    { slug: 'bug-hunter', name: 'Bug Hunter', description: 'Expert at finding bugs', category: 'CODING', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 10 },
    { slug: 'clean-code', name: 'Clean Code', description: 'Writes maintainable code', category: 'CODING', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 15 },
    { slug: 'full-stack', name: 'Full Stack', description: 'Master of all layers', category: 'CODING', tier: 'GOLD', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 25 },
    
    // DevOps
    { slug: 'pipeline-pro', name: 'Pipeline Pro', description: 'CI/CD expert', category: 'DEVOPS', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 5 },
    { slug: 'docker-captain', name: 'Docker Captain', description: 'Container master', category: 'DEVOPS', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 10 },
    { slug: 'cloud-architect', name: 'Cloud Architect', description: 'Cloud infrastructure expert', category: 'DEVOPS', tier: 'GOLD', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 20 },
    
    // Collaboration
    { slug: 'team-spirit', name: 'Team Spirit', description: 'Excellent team player', category: 'COLLABORATION', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 5 },
    { slug: 'code-reviewer', name: 'Code Reviewer', description: 'Thorough code reviews', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 10 },
    { slug: 'crisis-averted', name: 'Crisis Averted', description: 'Saved the day in production', category: 'COLLABORATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    
    // Leadership
    { slug: 'mentor', name: 'Mentor', description: 'Helps others grow', category: 'LEADERSHIP', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'LEADERSHIP', triggerCount: 5 },
    { slug: 'mentor-master', name: 'Mentor Master', description: 'Dedicated mentor', category: 'LEADERSHIP', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'LEADERSHIP', triggerCount: 15 },
    { slug: 'tech-lead', name: 'Tech Lead', description: 'Technical leadership', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'KUDO_CATEGORY', triggerCategory: 'LEADERSHIP', triggerCount: 25 },
    { slug: 'architect', name: 'Architect', description: 'System design expert', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    
    // Documentation
    { slug: 'docs-hero', name: 'Docs Hero', description: 'Great documentation', category: 'DOCUMENTATION', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DOCUMENTATION', triggerCount: 5 },
    { slug: 'api-designer', name: 'API Designer', description: 'Clean API design', category: 'DOCUMENTATION', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DOCUMENTATION', triggerCount: 10 },
    { slug: 'open-source', name: 'Open Source', description: 'Open source contributor', category: 'DOCUMENTATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 }
  ]

  for (const badge of defaultBadges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: {
        ...badge,
        svgUrl: `/assets/${badge.slug}.svg`,
        isGlobal: true
      }
    })
  }

  console.log(`✅ Seeded ${defaultBadges.length} default badges`)
}
