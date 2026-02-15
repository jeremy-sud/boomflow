/**
 * BOOMFLOW Badge Engine
 * Sistema de evaluación y otorgamiento automático de badges
 */

import prisma from '@/lib/prisma'
import { TriggerType } from '@/generated/prisma'

// Re-export TriggerType for external use
export { TriggerType }

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
  // GitHub stats
  githubCommits: number
  githubPRs: number
  githubReviews: number
}

/**
 * Badge Engine - Evaluación automática de badges
 */
export class BadgeEngine {
  /**
   * Evalúa todos los badges automáticos para un usuario
   * y otorga los que correspondan
   */
  static async evaluateUserBadges(userId: string): Promise<BadgeCheckResult[]> {
    const results: BadgeCheckResult[] = []
    
    // Obtener stats del usuario
    const stats = await this.getUserStats(userId)
    
    // Obtener badges automáticos que el usuario NO tiene
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
        // Otorgar badge
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            awardedBy: 'system',
            reason: `Logro automático: ${badge.name}`,
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
          reason: `Completaste el requisito para ${badge.name}`,
        })
      }
    }

    return results
  }

  /**
   * Evalúa un trigger específico después de una acción
   * (ej: después de recibir un kudo)
   */
  static async evaluateTrigger(
    userId: string, 
    triggerType: TriggerType
  ): Promise<BadgeCheckResult[]> {
    const results: BadgeCheckResult[] = []
    
    const stats = await this.getUserStats(userId)
    
    // Buscar badges con este trigger que el usuario no tenga
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
            reason: `Logro automático: ${badge.name}`,
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
          reason: `¡Nuevo badge desbloqueado!`,
        })
      }
    }

    return results
  }

  /**
   * Otorga un badge manualmente a un usuario
   */
  static async awardBadge(
    userId: string,
    badgeSlug: string,
    awardedBy: string,
    reason?: string
  ): Promise<BadgeCheckResult> {
    // Verificar si el badge existe
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug }
    })

    if (!badge) {
      return {
        awarded: false,
        reason: 'Badge no encontrado',
      }
    }

    // Verificar si el usuario ya tiene el badge
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
        reason: 'El usuario ya tiene este badge',
      }
    }

    // Otorgar badge
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
        awardedBy,
        reason: reason || `Otorgado por ${awardedBy}`,
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
      reason: reason || `Badge ${badge.name} otorgado exitosamente`,
    }
  }

  /**
   * Revoca un badge de un usuario
   */
  static async revokeBadge(
    userId: string,
    badgeSlug: string
  ): Promise<{ success: boolean; message: string }> {
    const badge = await prisma.badge.findUnique({
      where: { slug: badgeSlug }
    })

    if (!badge) {
      return { success: false, message: 'Badge no encontrado' }
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
      return { success: false, message: 'El usuario no tiene este badge' }
    }

    await prisma.userBadge.delete({
      where: { id: userBadge.id }
    })

    return { success: true, message: `Badge ${badge.name} revocado` }
  }

  /**
   * Obtiene estadísticas de un usuario
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    const [kudosReceived, kudosSent, githubStats] = await Promise.all([
      prisma.kudo.count({ where: { toId: userId } }),
      prisma.kudo.count({ where: { fromId: userId } }),
      prisma.gitHubStats.findUnique({ where: { userId } }),
    ])

    return {
      kudosReceived,
      kudosSent,
      codeReviews: githubStats?.reviews || 0,
      pullRequests: githubStats?.pullRequests || 0,
      issuesClosed: githubStats?.issuesClosed || 0,
      streakDays: 0, // TODO: Calcular desde actividad
      // GitHub stats
      githubCommits: githubStats?.commits || 0,
      githubPRs: githubStats?.pullRequests || 0,
      githubReviews: githubStats?.reviews || 0,
    }
  }

  /**
   * Verifica si un trigger se cumple según las stats del usuario
   */
  private static checkTrigger(
    triggerType: TriggerType | null,
    triggerValue: number | null,
    stats: UserStats
  ): boolean {
    if (!triggerType || triggerValue === null) return false

    switch (triggerType) {
      case 'KUDOS_RECEIVED':
        return stats.kudosReceived >= triggerValue
      
      case 'KUDOS_SENT':
        return stats.kudosSent >= triggerValue
      
      case 'CODE_REVIEWS':
        return stats.codeReviews >= triggerValue
      
      case 'PULL_REQUESTS':
        return stats.pullRequests >= triggerValue
      
      case 'ISSUES_CLOSED':
        return stats.issuesClosed >= triggerValue
      
      case 'STREAK_DAYS':
        return stats.streakDays >= triggerValue
      
      case 'FIRST_ACTION':
        // First action triggers se manejan directamente
        return false
      
      case 'MANUAL':
        // Badges manuales nunca se otorgan automáticamente
        return false

      // GitHub triggers
      case 'GITHUB_COMMIT':
        return stats.githubCommits >= triggerValue

      case 'GITHUB_PR':
        return stats.githubPRs >= triggerValue

      case 'GITHUB_REVIEW':
        return stats.githubReviews >= triggerValue
      
      default:
        return false
    }
  }

  /**
   * Obtiene el progreso de un usuario hacia badges no obtenidos
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
        case 'KUDOS_RECEIVED':
          progress = stats.kudosReceived
          break
        case 'KUDOS_SENT':
          progress = stats.kudosSent
          break
        case 'CODE_REVIEWS':
          progress = stats.codeReviews
          break
        case 'PULL_REQUESTS':
          progress = stats.pullRequests
          break
        case 'ISSUES_CLOSED':
          progress = stats.issuesClosed
          break
        case 'STREAK_DAYS':
          progress = stats.streakDays
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
}

export default BadgeEngine
