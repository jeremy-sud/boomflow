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

  // Collect all awarded badges
  const awardedBadges = []

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
          type: 'badge_earned',
          title: '🏆 New Badge Unlocked!',
          body: `You earned the ${badge.name} badge!`,
          data: {
            badgeId: badge.id,
            badgeSlug: badge.slug
          }
        }
      })

      // Log to audit
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'badge_awarded',
          resource: 'Badge',
          resourceId: badge.id,
          metadata: {
            badgeSlug: badge.slug,
            trigger: badge.triggerType,
            triggerCount: badge.triggerCount
          }
        }
      })

      awardedBadges.push({
        slug: userBadge.badge.slug,
        name: userBadge.badge.name,
        description: userBadge.badge.description,
        message: `🏆 ${userBadge.badge.name} badge unlocked!`
      })
    }
  }

  // Return all awarded badges, or null if none
  return awardedBadges.length > 0 ? awardedBadges : null
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
      type: 'badge_earned',
      title: '🏆 New Badge Awarded!',
      body: reason || `You were awarded the ${badge.name} badge!`,
      data: {
        badgeId: badge.id,
        badgeSlug: badge.slug,
        awardedBy
      }
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
 * Seed default global badges - 89 professional badges
 */
export async function seedDefaultBadges() {
  const defaultBadges = [
    // ═══════════════════════════════════════════════════════════════
    // 🟢 ONBOARDING - Getting started badges (Green)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'hello-world', name: 'Hello World', description: 'Joined the platform', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'first-commit', name: 'First Commit', description: 'Made your first contribution', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'first-pr', name: 'First PR', description: 'Opened your first pull request', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'first-review', name: 'First Review', description: 'Completed your first code review', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'first-merge', name: 'First Merge', description: 'Got your first PR merged', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'week-one', name: 'Week One', description: 'Completed first week', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'month-one', name: 'Month One', description: 'Completed first month', category: 'ONBOARDING', tier: 'SILVER', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'profile-complete', name: 'Profile Complete', description: 'Filled out complete profile', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'year-one-diamond', name: 'Year One Diamond', description: 'One year anniversary!', category: 'ONBOARDING', tier: 'GOLD', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'welcome-wagon', name: 'Welcome Wagon', description: 'Welcomed a new team member', category: 'ONBOARDING', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // 🔵 CODING - Technical excellence badges (Blue)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'code-ninja', name: 'Code Ninja', description: 'Master of stealthy code', category: 'CODING', tier: 'GOLD', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 20 },
    { slug: 'bug-hunter', name: 'Bug Hunter', description: 'Expert at finding bugs', category: 'CODING', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 10 },
    { slug: 'bug-slayer', name: 'Bug Slayer', description: 'Destroyed 100+ bugs', category: 'CODING', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'clean-code', name: 'Clean Code', description: 'Writes maintainable code', category: 'CODING', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 15 },
    { slug: 'clean-coder', name: 'Clean Coder', description: 'Pristine code quality', category: 'CODING', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 12 },
    { slug: 'full-stack', name: 'Full Stack', description: 'Master of all layers', category: 'CODING', tier: 'GOLD', triggerType: 'KUDO_CATEGORY', triggerCategory: 'CODING', triggerCount: 25 },
    { slug: 'full-stack-hero', name: 'Full Stack Hero', description: 'Frontend + Backend + DevOps', category: 'CODING', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'algorithm-ace', name: 'Algorithm Ace', description: 'Solves complex problems', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'refactor-master', name: 'Refactor Master', description: 'Expert at code refactoring', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'performance-guru', name: 'Performance Guru', description: 'Optimization expert', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'security-champion', name: 'Security Champion', description: 'Security-first mindset', category: 'CODING', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'test-master', name: 'Test Master', description: 'Testing perfectionist', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'git-guru', name: 'Git Guru', description: 'Version control expert', category: 'CODING', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'frontend-wizard', name: 'Frontend Wizard', description: 'UI/UX magic maker', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'backend-boss', name: 'Backend Boss', description: 'Server-side master', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'database-dynamo', name: 'Database Dynamo', description: 'Database optimization pro', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'mobile-master', name: 'Mobile Master', description: 'Mobile development expert', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'api-artisan', name: 'API Artisan', description: 'Creates beautiful APIs', category: 'CODING', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'data-wizard', name: 'Data Wizard', description: 'Data analysis expert', category: 'CODING', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'ai-pioneer', name: 'AI Pioneer', description: 'AI/ML implementation expert', category: 'CODING', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // 🟣 DEVOPS - Operations badges (Purple)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'pipeline-pro', name: 'Pipeline Pro', description: 'CI/CD expert', category: 'DEVOPS', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 5 },
    { slug: 'docker-captain', name: 'Docker Captain', description: 'Container master', category: 'DEVOPS', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 10 },
    { slug: 'cloud-deployer', name: 'Cloud Deployer', description: 'Cloud deployment expert', category: 'DEVOPS', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 5 },
    { slug: 'cicd-master', name: 'CI/CD Master', description: 'Automation champion', category: 'DEVOPS', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DEVOPS', triggerCount: 15 },
    { slug: 'kubernetes-knight', name: 'Kubernetes Knight', description: 'K8s orchestration expert', category: 'DEVOPS', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'terraform-titan', name: 'Terraform Titan', description: 'Infrastructure as code master', category: 'DEVOPS', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'monitoring-maven', name: 'Monitoring Maven', description: 'Observability expert', category: 'DEVOPS', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'incident-commander', name: 'Incident Commander', description: 'Incident response leader', category: 'DEVOPS', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'sre-specialist', name: 'SRE Specialist', description: 'Site reliability engineer', category: 'DEVOPS', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'deploy-master', name: 'Deploy Master', description: 'Zero-downtime deployments', category: 'DEVOPS', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // 🩷 COLLABORATION - Teamwork badges (Pink)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'team-spirit', name: 'Team Spirit', description: 'Excellent team player', category: 'COLLABORATION', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 5 },
    { slug: 'team-player', name: 'Team Player', description: 'Always supports teammates', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 10 },
    { slug: 'code-reviewer', name: 'Code Reviewer', description: 'Thorough code reviews', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 10 },
    { slug: 'crisis-averted', name: 'Crisis Averted', description: 'Saved the day in production', category: 'COLLABORATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'pair-programmer', name: 'Pair Programmer', description: 'Great at pair programming', category: 'COLLABORATION', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'sprint-hero', name: 'Sprint Hero', description: 'Delivered exceptional sprint', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'all-star', name: 'All Star', description: 'Team MVP', category: 'COLLABORATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'hackathon-hero', name: 'Hackathon Hero', description: 'Hackathon winner', category: 'COLLABORATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'knowledge-sharer', name: 'Knowledge Sharer', description: 'Shares expertise freely', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 8 },
    { slug: 'bridge-builder', name: 'Bridge Builder', description: 'Connects teams together', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'remote-champion', name: 'Remote Champion', description: 'Remote work excellence', category: 'COLLABORATION', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'helping-hand', name: 'Helping Hand', description: 'Always ready to help', category: 'COLLABORATION', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'COLLABORATION', triggerCount: 3 },
    { slug: 'positive-vibes', name: 'Positive Vibes', description: 'Spreads positivity', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'first-feedback', name: 'First Feedback', description: 'Gave helpful feedback', category: 'COLLABORATION', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 1 },
    { slug: 'customer-champion', name: 'Customer Champion', description: 'Customer satisfaction hero', category: 'COLLABORATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'problem-solver', name: 'Problem Solver', description: 'Creative problem solver', category: 'COLLABORATION', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // 🟡 LEADERSHIP - Leadership badges (Amber/Orange)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'mentor', name: 'Mentor', description: 'Helps others grow', category: 'LEADERSHIP', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'LEADERSHIP', triggerCount: 5 },
    { slug: 'mentor-master', name: 'Mentor Master', description: 'Dedicated mentor', category: 'LEADERSHIP', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'LEADERSHIP', triggerCount: 15 },
    { slug: 'tech-lead', name: 'Tech Lead', description: 'Technical leadership', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'KUDO_CATEGORY', triggerCategory: 'LEADERSHIP', triggerCount: 25 },
    { slug: 'architect', name: 'Architect', description: 'System design expert', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'visionary', name: 'Visionary', description: 'Strategic thinker', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'culture-champion', name: 'Culture Champion', description: 'Builds great culture', category: 'LEADERSHIP', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'change-agent', name: 'Change Agent', description: 'Drives positive change', category: 'LEADERSHIP', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'innovator', name: 'Innovator', description: 'Brings new ideas', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'people-first', name: 'People First', description: 'Prioritizes people', category: 'LEADERSHIP', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'mvp-month', name: 'MVP of Month', description: 'Most Valuable Player', category: 'LEADERSHIP', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // 🔵 DOCUMENTATION - Docs & knowledge badges (Cyan)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'docs-hero', name: 'Docs Hero', description: 'Great documentation', category: 'DOCUMENTATION', tier: 'BRONZE', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DOCUMENTATION', triggerCount: 5 },
    { slug: 'api-designer', name: 'API Designer', description: 'Clean API design', category: 'DOCUMENTATION', tier: 'SILVER', triggerType: 'KUDO_CATEGORY', triggerCategory: 'DOCUMENTATION', triggerCount: 10 },
    { slug: 'open-source', name: 'Open Source', description: 'Open source contributor', category: 'DOCUMENTATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'open-source-contributor', name: 'Open Source Contributor', description: 'Major OSS contribution', category: 'DOCUMENTATION', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'tutorial-creator', name: 'Tutorial Creator', description: 'Creates helpful tutorials', category: 'DOCUMENTATION', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'wiki-warrior', name: 'Wiki Warrior', description: 'Keeps wiki updated', category: 'DOCUMENTATION', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'readme-ranger', name: 'README Ranger', description: 'Great README files', category: 'DOCUMENTATION', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // 🌱 GROWTH - Learning & development badges (Teal)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'fast-learner', name: 'Fast Learner', description: 'Learns new tech quickly', category: 'GROWTH', tier: 'BRONZE', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'skill-builder', name: 'Skill Builder', description: 'Constantly improving', category: 'GROWTH', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'conference-speaker', name: 'Conference Speaker', description: 'Spoke at conference', category: 'GROWTH', tier: 'GOLD', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'lifelong-learner', name: 'Lifelong Learner', description: 'Continuous learner', category: 'GROWTH', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'eco-coder', name: 'Eco Coder', description: 'Sustainable coding practices', category: 'GROWTH', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // ✅ QUALITY - Quality assurance badges (Green)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'quality-guardian', name: 'Quality Guardian', description: 'Protects code quality', category: 'QUALITY', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    { slug: 'accessibility-advocate', name: 'Accessibility Advocate', description: 'Champions a11y', category: 'QUALITY', tier: 'SILVER', triggerType: 'MANUAL', triggerCount: 1 },
    
    // ═══════════════════════════════════════════════════════════════
    // ❤️ MILESTONES - Kudo & Achievement milestones (Red)
    // ═══════════════════════════════════════════════════════════════
    { slug: 'kudo-starter', name: 'Kudo Starter', description: 'Received 10 kudos', category: 'MILESTONE', tier: 'BRONZE', triggerType: 'KUDO_COUNT', triggerCount: 10 },
    { slug: 'kudo-collector', name: 'Kudo Collector', description: 'Received 50 kudos', category: 'MILESTONE', tier: 'SILVER', triggerType: 'KUDO_COUNT', triggerCount: 50 },
    { slug: 'kudo-legend', name: 'Kudo Legend', description: 'Received 100 kudos', category: 'MILESTONE', tier: 'GOLD', triggerType: 'KUDO_COUNT', triggerCount: 100 },
    { slug: 'kudo-giver', name: 'Kudo Giver', description: 'Given 25+ kudos', category: 'MILESTONE', tier: 'SILVER', triggerType: 'SYSTEM', triggerCount: 25 },
    { slug: 'badge-hunter', name: 'Badge Hunter', description: 'Earned 5 badges', category: 'MILESTONE', tier: 'BRONZE', triggerType: 'SYSTEM', triggerCount: 5 },
    { slug: 'badge-master', name: 'Badge Master', description: 'Earned 10 badges', category: 'MILESTONE', tier: 'SILVER', triggerType: 'SYSTEM', triggerCount: 10 },
    { slug: 'badge-legend', name: 'Badge Legend', description: 'Earned 20 badges', category: 'MILESTONE', tier: 'GOLD', triggerType: 'SYSTEM', triggerCount: 20 },
    { slug: 'streak-keeper', name: 'Streak Keeper', description: '7-day activity streak', category: 'MILESTONE', tier: 'SILVER', triggerType: 'SYSTEM', triggerCount: 7 },
    { slug: 'streak-master', name: 'Streak Master', description: '30-day activity streak', category: 'MILESTONE', tier: 'GOLD', triggerType: 'SYSTEM', triggerCount: 30 }
  ]

  for (const badge of defaultBadges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        description: badge.description,
        category: badge.category,
        tier: badge.tier,
        triggerType: badge.triggerType,
        triggerCount: badge.triggerCount,
        triggerCategory: badge.triggerCategory || null
      },
      create: {
        ...badge,
        svgUrl: `/assets/badge-${badge.slug}.svg`,
        isGlobal: true
      }
    })
  }

  console.log(`✅ Seeded ${defaultBadges.length} default badges`)
}
