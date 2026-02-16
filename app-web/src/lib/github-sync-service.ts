import prisma from '@/lib/prisma'
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
  private readonly octokit: Octokit
  private readonly userId: string
  private readonly username: string

  constructor(accessToken: string, userId: string, username: string) {
    this.octokit = new Octokit({ auth: accessToken })
    this.userId = userId
    this.username = username
  }

  /**
   * Syncs GitHub stats and evaluates badges
   */
  async sync(): Promise<GitHubContributions> {
    const stats = await this.fetchStats()
    await this.saveStats(stats)
    await this.evaluateBadges(stats)
    return stats
  }

  /**
   * Gets GitHub stats for user
   */
  private async fetchStats(): Promise<GitHubContributions> {
    try {
      // Get user repositories
      const { data: repos } = await this.octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'pushed',
      })

      // Counters
      let commits = 0
      let pullRequests = 0
      let reviews = 0
      let issues = 0

      // Get user PRs
      const { data: prs } = await this.octokit.search.issuesAndPullRequests({
        q: `author:${this.username} type:pr`,
        per_page: 100,
      })
      pullRequests = prs.total_count

      // Get user issues
      const { data: issuesData } = await this.octokit.search.issuesAndPullRequests({
        q: `author:${this.username} type:issue`,
        per_page: 100,
      })
      issues = issuesData.total_count

      // Estimate commits (based on recent contributions to own repos — parallel)
      const repoSlice = repos.slice(0, 10)
      const commitResults = await Promise.allSettled(
        repoSlice.map(repo =>
          this.octokit.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            author: this.username,
            per_page: 100,
          })
        )
      )
      for (const result of commitResults) {
        if (result.status === 'fulfilled') {
          commits += result.value.data.length
        }
      }

      // Get completed reviews
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
   * Saves stats to database
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
   * Evaluates badges based on GitHub stats
   */
  private async evaluateBadges(stats: GitHubContributions): Promise<void> {
    const badgeResults = []

    // Evaluate commits
    if (stats.commits > 0) {
      const commitBadges = await BadgeEngine.evaluateTrigger(
        this.userId,
        TriggerType.GITHUB_COMMIT
      )
      badgeResults.push(...commitBadges)
    }

    // Evaluate PRs
    if (stats.pullRequests > 0) {
      const prBadges = await BadgeEngine.evaluateTrigger(
        this.userId,
        TriggerType.GITHUB_PR
      )
      badgeResults.push(...prBadges)
    }

    // Evaluate reviews
    if (stats.reviews > 0) {
      const reviewBadges = await BadgeEngine.evaluateTrigger(
        this.userId,
        TriggerType.GITHUB_REVIEW
      )
      badgeResults.push(...reviewBadges)
    }

    // Notify earned badges
    for (const result of badgeResults.filter(b => b.awarded && b.badge)) {
      await NotificationService.notifyBadgeEarned(this.userId, result.badge!)
    }
  }

  /**
   * Gets saved stats for a user
   */
  static async getStats(userId: string) {
    return prisma.gitHubStats.findUnique({
      where: { userId },
    })
  }

  /**
   * Checks if sync is needed (more than 1 hour since last)
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
