import { prisma } from './prisma'
import { Octokit } from '@octokit/rest'
import { BadgeEngine, TriggerType } from './badge-engine'
import { NotificationService } from './notification-service'

interface GitHubContributions {
  commits: number
  pullRequests: number
  reviews: number
  issues: number
  totalContributions: number
}

export class GitHubSyncService {
  private octokit: Octokit
  private userId: string
  private username: string

  constructor(accessToken: string, userId: string, username: string) {
    this.octokit = new Octokit({ auth: accessToken })
    this.userId = userId
    this.username = username
  }

  /**
   * Sincroniza estadísticas de GitHub y evalúa badges
   */
  async sync(): Promise<GitHubContributions> {
    const stats = await this.fetchStats()
    await this.saveStats(stats)
    await this.evaluateBadges(stats)
    return stats
  }

  /**
   * Obtiene estadísticas de GitHub del usuario
   */
  private async fetchStats(): Promise<GitHubContributions> {
    try {
      // Obtener repositorios del usuario
      const { data: repos } = await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'pushed',
      })

      // Contadores
      let commits = 0
      let pullRequests = 0
      let reviews = 0
      let issues = 0

      // Obtener PRs del usuario
      const { data: prs } = await this.octokit.search.issuesAndPullRequests({
        q: `author:${this.username} type:pr`,
        per_page: 100,
      })
      pullRequests = prs.total_count

      // Obtener issues del usuario
      const { data: issuesData } = await this.octokit.search.issuesAndPullRequests({
        q: `author:${this.username} type:issue`,
        per_page: 100,
      })
      issues = issuesData.total_count

      // Estimar commits (basado en contribuciones recientes a repos propios)
      for (const repo of repos.slice(0, 10)) {
        try {
          const { data: repoCommits } = await this.octokit.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            author: this.username,
            per_page: 100,
          })
          commits += repoCommits.length
        } catch {
          // Repo sin commits o sin acceso
        }
      }

      // Obtener reviews realizados
      try {
        const { data: reviewsData } = await this.octokit.search.issuesAndPullRequests({
          q: `reviewed-by:${this.username} type:pr`,
          per_page: 100,
        })
        reviews = reviewsData.total_count
      } catch {
        reviews = 0
      }

      return {
        commits,
        pullRequests,
        reviews,
        issues,
        totalContributions: commits + pullRequests + reviews + issues,
      }
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
      throw error
    }
  }

  /**
   * Guarda las estadísticas en la base de datos
   */
  private async saveStats(stats: GitHubContributions): Promise<void> {
    await prisma.gitHubStats.upsert({
      where: { userId: this.userId },
      create: {
        userId: this.userId,
        commits: stats.commits,
        pullRequests: stats.pullRequests,
        reviews: stats.reviews,
        issuesClosed: stats.issues,
        contributions: stats.totalContributions,
        lastSyncAt: new Date(),
      },
      update: {
        commits: stats.commits,
        pullRequests: stats.pullRequests,
        reviews: stats.reviews,
        issuesClosed: stats.issues,
        contributions: stats.totalContributions,
        lastSyncAt: new Date(),
      },
    })
  }

  /**
   * Evalúa badges basados en las estadísticas de GitHub
   */
  private async evaluateBadges(stats: GitHubContributions): Promise<void> {
    const badgeResults = []

    // Evaluar commits
    if (stats.commits > 0) {
      const commitBadges = await BadgeEngine.evaluateTrigger(
        this.userId,
        TriggerType.GITHUB_COMMIT
      )
      badgeResults.push(...commitBadges)
    }

    // Evaluar PRs
    if (stats.pullRequests > 0) {
      const prBadges = await BadgeEngine.evaluateTrigger(
        this.userId,
        TriggerType.GITHUB_PR
      )
      badgeResults.push(...prBadges)
    }

    // Evaluar reviews
    if (stats.reviews > 0) {
      const reviewBadges = await BadgeEngine.evaluateTrigger(
        this.userId,
        TriggerType.GITHUB_REVIEW
      )
      badgeResults.push(...reviewBadges)
    }

    // Notificar badges ganados
    for (const result of badgeResults.filter(b => b.awarded && b.badge)) {
      await NotificationService.notifyBadgeEarned(this.userId, result.badge!)
    }
  }

  /**
   * Obtiene las estadísticas guardadas de un usuario
   */
  static async getStats(userId: string) {
    return prisma.gitHubStats.findUnique({
      where: { userId },
    })
  }

  /**
   * Verifica si necesita sincronización (más de 1 hora desde la última)
   */
  static async needsSync(userId: string): Promise<boolean> {
    const stats = await prisma.gitHubStats.findUnique({
      where: { userId },
      select: { lastSyncAt: true },
    })

    if (!stats?.lastSyncAt) return true

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return stats.lastSyncAt < hourAgo
  }
}

// Configuración de triggers de GitHub para el Badge Engine
export const GITHUB_BADGE_RULES = [
  {
    badgeId: 'first-commit',
    trigger: TriggerType.GITHUB_COMMIT,
    threshold: 1,
    description: 'Primer commit detectado',
  },
  {
    badgeId: 'code-ninja',
    trigger: TriggerType.GITHUB_COMMIT,
    threshold: 50,
    description: '50 commits realizados',
  },
  {
    badgeId: 'first-pr',
    trigger: TriggerType.GITHUB_PR,
    threshold: 1,
    description: 'Primer PR mergeado',
  },
  {
    badgeId: 'first-review',
    trigger: TriggerType.GITHUB_REVIEW,
    threshold: 1,
    description: 'Primera code review',
  },
  {
    badgeId: 'code-reviewer',
    trigger: TriggerType.GITHUB_REVIEW,
    threshold: 10,
    description: '10 code reviews realizadas',
  },
]
