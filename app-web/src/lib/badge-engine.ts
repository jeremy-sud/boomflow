/**
 * BOOMFLOW Badge Engine
 * Automatic badge evaluation and awarding system
 */

import prisma from '@/lib/prisma'
import { TriggerType } from '@/generated/prisma'

// Re-export TriggerType for external use
export type { TriggerType } from '@/generated/prisma'

export interface BadgeCheckResult {
  awarded: boolean
  badge?: {
    id: string
    name: string
    slug: string
    tier: string
  }
  reason?: string
}

export interface UserStats {
  kudosReceived: number
  kudosSent: number
  codeReviews: number
  pullRequests: number
  issuesClosed: number
  streakDays: number
  tenureDays: number
  // GitHub stats
  githubCommits: number
  githubPRs: number
  githubReviews: number
  // Peer-to-peer stats
  peerAwardsReceived: number
  peerAwardsGiven: number
  // Badge count
  totalBadges: number
}

/**
 * Badge Engine - Automatic badge evaluation
 */
export class BadgeEngine {
  /**
   * Evaluates all automatic badges for a user
   * and awards those that are earned
   */
  static async evaluateUserBadges(userId: string): Promise<BadgeCheckResult[]> {
    const results: BadgeCheckResult[] = []
    
    // Get user stats
    const stats = await this.getUserStats(userId)
    
    // Get automatic badges the user does NOT have
    const automaticBadges = await prisma.badge.findMany({
      where: {
        isAutomatic: true,
        isActive: true,
        userBadges: {
          none: { userId }
        }
      }
    })

    for (const badge of automaticBadges) {
      const shouldAward = this.checkTrigger(badge.triggerType, badge.triggerValue, stats)
      
      if (shouldAward) {
        // Award badge
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            awardedBy: 'system',
            reason: `Automatic achievement: ${badge.name}`,
          }
        })

        results.push({
          awarded: true,
          badge: {
            id: badge.id,
            name: badge.name,
            slug: badge.slug,
            tier: badge.tier,
          },
          reason: `You completed the requirement for ${badge.name}`,
        })
      }
    }

    return results
  }

  /**
   * Evaluates a specific trigger after an action
   * (e.g., after receiving a kudo)
   */
  static async evaluateTrigger(
    userId: string, 
    triggerType: TriggerType
  ): Promise<BadgeCheckResult[]> {
    const results: BadgeCheckResult[] = []
    
    const stats = await this.getUserStats(userId)
    
    // Find badges with this trigger that the user doesn't have
    const badges = await prisma.badge.findMany({
      where: {
        isAutomatic: true,
        isActive: true,
        triggerType,
        userBadges: {
          none: { userId }
        }
      }
    })

    for (const badge of badges) {
      const shouldAward = this.checkTrigger(badge.triggerType, badge.triggerValue, stats)
      
      if (shouldAward) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            awardedBy: 'system',
            reason: `Automatic achievement: ${badge.name}`,
          }
        })

        results.push({
          awarded: true,
          badge: {
            id: badge.id,
            name: badge.name,
            slug: badge.slug,
            tier: badge.tier,
          },
          reason: 'New badge unlocked!',
        })
      }
    }

    return results
  }

  /**
   * Manually awards a badge to a user
   */
  static async awardBadge(
    userId: string,
    badgeSlug: string,
    awardedBy: string,
    reason?: string
  ): Promise<BadgeCheckResult> {
    // Verify badge exists
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug }
    })

    if (!badge) {
      return {
        awarded: false,
        reason: 'Badge not found',
      }
    }

    // Check if user already has this badge
    const existing = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        }
      }
    })

    if (existing) {
      return {
        awarded: false,
        reason: 'User already has this badge',
      }
    }

    // Award badge
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
        awardedBy,
        reason: reason || `Awarded by ${awardedBy}`,
      }
    })

    return {
      awarded: true,
      badge: {
        id: badge.id,
        name: badge.name,
        slug: badge.slug,
        tier: badge.tier,
      },
      reason: reason || `Badge ${badge.name} awarded successfully`,
    }
  }

  /**
   * Revokes a badge from a user
   */
  static async revokeBadge(
    userId: string,
    badgeSlug: string
  ): Promise<{ success: boolean; message: string }> {
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug }
    })

    if (!badge) {
      return { success: false, message: 'Badge not found' }
    }

    const userBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        }
      }
    })

    if (!userBadge) {
      return { success: false, message: 'User does not have this badge' }
    }

    await prisma.userBadge.delete({
      where: { id: userBadge.id }
    })

    return { success: true, message: `Badge ${badge.name} revoked` }
  }

  /**
   * Gets statistics for a user
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    const [kudosReceived, kudosSent, githubStats, peerAwardsReceived, peerAwardsGiven, totalBadges, user] = await Promise.all([
      prisma.kudo.count({ where: { toId: userId } }),
      prisma.kudo.count({ where: { fromId: userId } }),
      prisma.gitHubStats.findUnique({ where: { userId } }),
      // Count badges of type MANUAL_PEER_AWARD received
      prisma.userBadge.count({ 
        where: { 
          userId,
          badge: { triggerType: TriggerType.MANUAL_PEER_AWARD }
        } 
      }),
      // Count badges of type MANUAL_PEER_AWARD awarded by this user
      prisma.userBadge.count({ 
        where: { 
          awardedBy: userId,
          badge: { triggerType: TriggerType.MANUAL_PEER_AWARD }
        } 
      }),
      // Total badges count
      prisma.userBadge.count({ where: { userId } }),
      // User record for tenure calculation
      prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } }),
    ])

    // Calculate tenure days
    const tenureDays = user?.createdAt 
      ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Calculate streak days from GitHub activity
    const streakDays = await this.calculateStreakDays(userId)

    return {
      kudosReceived,
      kudosSent,
      codeReviews: githubStats?.reviews || 0,
      pullRequests: githubStats?.pullRequests || 0,
      issuesClosed: githubStats?.issuesClosed || 0,
      streakDays,
      tenureDays,
      // GitHub stats
      githubCommits: githubStats?.commits || 0,
      githubPRs: githubStats?.pullRequests || 0,
      githubReviews: githubStats?.reviews || 0,
      // Peer-to-peer stats
      peerAwardsReceived,
      peerAwardsGiven,
      // Badge count
      totalBadges,
    }
  }

  /**
   * Calculates consecutive activity days (streak)
   */
  private static async calculateStreakDays(userId: string): Promise<number> {
    const recentBadges = await prisma.userBadge.findMany({
      where: { userId },
      orderBy: { awardedAt: 'desc' },
      take: 30,
      select: { awardedAt: true }
    })

    if (recentBadges.length === 0) return 0

    // Simple streak calculation based on recent activity
    // In production, this would integrate with GitHub activity data
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activityDates = new Set(
      recentBadges.map(b => {
        const d = new Date(b.awardedAt)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      if (activityDates.has(checkDate.getTime())) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  }

  /**
   * Checks if a trigger condition is met based on user stats
   */
  private static checkTrigger(
    triggerType: TriggerType | null,
    triggerValue: number | null,
    stats: UserStats
  ): boolean {
    if (!triggerType || triggerValue === null) return false

    switch (triggerType) {
      case TriggerType.KUDOS_RECEIVED:
        return stats.kudosReceived >= triggerValue
      
      case TriggerType.KUDOS_SENT:
        return stats.kudosSent >= triggerValue
      
      case TriggerType.CODE_REVIEWS:
        return stats.codeReviews >= triggerValue
      
      case TriggerType.PULL_REQUESTS:
        return stats.pullRequests >= triggerValue
      
      case TriggerType.ISSUES_CLOSED:
        return stats.issuesClosed >= triggerValue
      
      case TriggerType.STREAK_DAYS:
        return stats.streakDays >= triggerValue
      
      case TriggerType.TENURE_DAYS:
        return stats.tenureDays >= triggerValue
      
      case TriggerType.BADGES_COUNT:
        return stats.totalBadges >= triggerValue
      
      case TriggerType.FIRST_ACTION:
        // First action triggers are handled directly
        return false
      
      case TriggerType.MANUAL:
        // Manual badges are never awarded automatically
        return false

      // GitHub triggers
      case TriggerType.GITHUB_COMMIT:
        return stats.githubCommits >= triggerValue

      case TriggerType.GITHUB_PR:
        return stats.githubPRs >= triggerValue

      case TriggerType.GITHUB_REVIEW:
        return stats.githubReviews >= triggerValue

      // Peer-to-peer triggers
      case TriggerType.MANUAL_PEER_AWARD:
        // Peer badges are handled via awardPeerBadge()
        return false

      case TriggerType.INVESTMENT:
        // Investment badges are handled via awardPatronBadge()
        return false

      case TriggerType.PEER_AWARDS_COUNT:
        return stats.peerAwardsReceived >= triggerValue
      
      default:
        return false
    }
  }

  /**
   * Gets a user's progress towards unlocking badges
   */
  static async getBadgeProgress(userId: string): Promise<Array<{
    badge: { id: string; name: string; slug: string; tier: string }
    progress: number
    target: number
    percentage: number
  }>> {
    const stats = await this.getUserStats(userId)
    
    const unlockedBadges = await prisma.badge.findMany({
      where: {
        isAutomatic: true,
        isActive: true,
        triggerValue: { not: null },
        userBadges: {
          none: { userId }
        }
      }
    })

    return unlockedBadges.map(badge => {
      let progress = 0
      const target = badge.triggerValue || 1

      switch (badge.triggerType) {
        case TriggerType.KUDOS_RECEIVED:
          progress = stats.kudosReceived
          break
        case TriggerType.KUDOS_SENT:
          progress = stats.kudosSent
          break
        case TriggerType.CODE_REVIEWS:
          progress = stats.codeReviews
          break
        case TriggerType.PULL_REQUESTS:
          progress = stats.pullRequests
          break
        case TriggerType.ISSUES_CLOSED:
          progress = stats.issuesClosed
          break
        case TriggerType.STREAK_DAYS:
          progress = stats.streakDays
          break
        case TriggerType.TENURE_DAYS:
          progress = stats.tenureDays
          break
        case TriggerType.BADGES_COUNT:
          progress = stats.totalBadges
          break
        case TriggerType.PEER_AWARDS_COUNT:
          progress = stats.peerAwardsReceived
          break
      }

      return {
        badge: {
          id: badge.id,
          name: badge.name,
          slug: badge.slug,
          tier: badge.tier,
        },
        progress,
        target,
        percentage: Math.min(100, Math.round((progress / target) * 100)),
      }
    }).filter(p => p.percentage < 100)
      .sort((a, b) => b.percentage - a.percentage)
  }

  /**
   * Awards a Resonance badge (Peer-to-Peer)
   * Each user has a maximum of 2 per year to give
   */
  static async awardPeerBadge(
    fromUserId: string,
    toUserId: string,
    message: string
  ): Promise<BadgeCheckResult> {
    // Validate no self-award
    if (fromUserId === toUserId) {
      return {
        awarded: false,
        reason: 'You cannot award a Resonance badge to yourself',
      }
    }

    // Check annual limit (2 per user per year)
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59)

    const peerAwardsThisYear = await prisma.userBadge.count({
      where: {
        awardedBy: fromUserId,
        badge: { triggerType: TriggerType.MANUAL_PEER_AWARD },
        awardedAt: {
          gte: startOfYear,
          lte: endOfYear,
        }
      }
    })

    if (peerAwardsThisYear >= 2) {
      return {
        awarded: false,
        reason: `You have used all 2 Resonance badges for ${currentYear}`,
      }
    }

    // Find the Resonance badge
    const resonanceBadge = await prisma.badge.findFirst({
      where: {
        triggerType: TriggerType.MANUAL_PEER_AWARD,
        isActive: true,
      }
    })

    if (!resonanceBadge) {
      return {
        awarded: false,
        reason: 'Resonance badge not configured in the system',
      }
    }

    // Award the badge
    await prisma.userBadge.create({
      data: {
        userId: toUserId,
        badgeId: resonanceBadge.id,
        awardedBy: fromUserId,
        reason: message,
      }
    })

    // Evaluate if the user now qualifies for cumulative peer award badges
    await this.evaluateTrigger(toUserId, TriggerType.PEER_AWARDS_COUNT)

    return {
      awarded: true,
      badge: {
        id: resonanceBadge.id,
        name: resonanceBadge.name,
        slug: resonanceBadge.slug,
        tier: resonanceBadge.tier,
      },
      reason: `Resonance badge awarded: "${message}"`,
    }
  }

  /**
   * Awards a Patron badge (Investment)
   */
  static async awardPatronBadge(
    userId: string,
    tier: 'seed' | 'growth' | 'bloom',
    paymentReference?: string,
    impactChoice?: string
  ): Promise<BadgeCheckResult> {
    const tierSlugMap = {
      seed: 'patron-seed',
      growth: 'patron-growth',
      bloom: 'patron-bloom',
    }

    const patronBadge = await prisma.badge.findUnique({
      where: { slug: tierSlugMap[tier] }
    })

    if (!patronBadge) {
      return {
        awarded: false,
        reason: `Patron ${tier} badge not configured in the system`,
      }
    }

    // Check if user already has this badge
    const existing = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: patronBadge.id,
        }
      }
    })

    if (existing) {
      return {
        awarded: false,
        reason: 'You already have this Patron badge',
      }
    }

    // Build reason string
    const impactPart = impactChoice ? ' - Impact: ' + impactChoice : ''
    const refPart = paymentReference ? ' (Ref: ' + paymentReference + ')' : ''
    const reasonText = 'Patron ' + tier + impactPart + refPart

    // Award the badge
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: patronBadge.id,
        awardedBy: 'system',
        reason: reasonText,
      }
    })

    return {
      awarded: true,
      badge: {
        id: patronBadge.id,
        name: patronBadge.name,
        slug: patronBadge.slug,
        tier: patronBadge.tier,
      },
      reason: `Thank you for your support! Patron ${tier} badge awarded`,
    }
  }

  /**
   * Gets remaining Resonance badges a user can award this year
   */
  static async getRemainingPeerAwards(userId: string): Promise<number> {
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59)

    const peerAwardsThisYear = await prisma.userBadge.count({
      where: {
        awardedBy: userId,
        badge: { triggerType: TriggerType.MANUAL_PEER_AWARD },
        awardedAt: {
          gte: startOfYear,
          lte: endOfYear,
        }
      }
    })

    return Math.max(0, 2 - peerAwardsThisYear)
  }
}

export default BadgeEngine
