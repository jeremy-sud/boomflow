/**
 * BOOMFLOW Badge Catalog
 * Single source of truth for all badge definitions
 * 
 * This file exports all 97 badges organized by category.
 * Import this for seed data, documentation generation, and runtime reference.
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold'

export type BadgeCategory = 
  | 'ONBOARDING'
  | 'CODING'
  | 'DEVOPS'
  | 'COLLABORATION'
  | 'LEADERSHIP'
  | 'DOCUMENTATION'
  | 'QUALITY'
  | 'INNOVATION'
  | 'SPECIAL'
  | 'COMMUNITY'
  | 'PREMIUM'
  | 'MILESTONE'
  | 'GROWTH'

export type TriggerType =
  | 'MANUAL'
  | 'FIRST_ACTION'
  | 'KUDOS_RECEIVED'
  | 'KUDOS_SENT'
  | 'CODE_REVIEWS'
  | 'PULL_REQUESTS'
  | 'ISSUES_CLOSED'
  | 'STREAK_DAYS'
  | 'TENURE_DAYS'
  | 'BADGES_COUNT'
  | 'GITHUB_COMMIT'
  | 'GITHUB_PR'
  | 'GITHUB_REVIEW'
  | 'MANUAL_PEER_AWARD'
  | 'INVESTMENT'
  | 'PEER_AWARDS_COUNT'

export interface BadgeDefinition {
  slug: string
  name: string
  emoji: string
  tier: BadgeTier
  category: BadgeCategory
  description: string
  triggerType: TriggerType
  triggerValue?: number
}

// =============================================================================
// ONBOARDING BADGES (4)
// =============================================================================
export const ONBOARDING_BADGES: BadgeDefinition[] = [
  { slug: 'hello-world', name: 'Hello World', emoji: '👋', tier: 'bronze', category: 'ONBOARDING', description: 'First day on the team. Welcome!', triggerType: 'FIRST_ACTION' },
  { slug: 'first-commit', name: 'First Commit', emoji: '📝', tier: 'bronze', category: 'ONBOARDING', description: 'First commit to the team repository.', triggerType: 'FIRST_ACTION' },
  { slug: 'first-pr', name: 'First PR', emoji: '🔀', tier: 'bronze', category: 'ONBOARDING', description: 'First Pull Request approved and merged.', triggerType: 'PULL_REQUESTS', triggerValue: 1 },
  { slug: 'first-review', name: 'First Review', emoji: '👀', tier: 'bronze', category: 'ONBOARDING', description: 'First code review completed.', triggerType: 'CODE_REVIEWS', triggerValue: 1 },
]

// =============================================================================
// CODING BADGES (15)
// =============================================================================
export const CODING_BADGES: BadgeDefinition[] = [
  { slug: 'code-ninja', name: 'Code Ninja', emoji: '🥷', tier: 'silver', category: 'CODING', description: 'Clean, fast, and efficient code.', triggerType: 'PULL_REQUESTS', triggerValue: 10 },
  { slug: 'bug-hunter', name: 'Bug Hunter', emoji: '🐛', tier: 'silver', category: 'CODING', description: 'Detects and fixes bugs before production.', triggerType: 'ISSUES_CLOSED', triggerValue: 20 },
  { slug: 'refactor-master', name: 'Refactor Master', emoji: '♻️', tier: 'silver', category: 'CODING', description: 'Improves legacy code without breaking functionality.', triggerType: 'MANUAL' },
  { slug: 'algorithm-ace', name: 'Algorithm Ace', emoji: '🧮', tier: 'gold', category: 'CODING', description: 'Solves complex problems with optimal algorithms.', triggerType: 'MANUAL' },
  { slug: 'clean-code', name: 'Clean Code', emoji: '✨', tier: 'silver', category: 'CODING', description: 'Readable, documented, and maintainable code.', triggerType: 'MANUAL' },
  { slug: 'full-stack', name: 'Full Stack', emoji: '🌐', tier: 'gold', category: 'CODING', description: 'Masters both frontend and backend.', triggerType: 'MANUAL' },
  { slug: 'typescript-wizard', name: 'TypeScript Wizard', emoji: '🔷', tier: 'silver', category: 'CODING', description: 'Strict typing and advanced generics.', triggerType: 'MANUAL' },
  { slug: 'python-master', name: 'Python Master', emoji: '🐍', tier: 'silver', category: 'CODING', description: 'Advanced Python proficiency.', triggerType: 'MANUAL' },
  { slug: 'rust-pioneer', name: 'Rust Pioneer', emoji: '🦀', tier: 'gold', category: 'CODING', description: 'Systems programming in Rust.', triggerType: 'MANUAL' },
  { slug: 'regex-guru', name: 'Regex Guru', emoji: '🔍', tier: 'bronze', category: 'CODING', description: 'Complex regular expressions.', triggerType: 'MANUAL' },
  { slug: 'sql-sorcerer', name: 'SQL Sorcerer', emoji: '🗃️', tier: 'silver', category: 'CODING', description: 'Optimized queries and DB design.', triggerType: 'MANUAL' },
  { slug: 'api-artisan', name: 'API Artisan', emoji: '🔗', tier: 'silver', category: 'CODING', description: 'Well-designed RESTful APIs.', triggerType: 'MANUAL' },
  { slug: 'graphql-guru', name: 'GraphQL Guru', emoji: '◈', tier: 'silver', category: 'CODING', description: 'Efficient schemas and resolvers.', triggerType: 'MANUAL' },
  { slug: 'test-champion', name: 'Test Champion', emoji: '✅', tier: 'silver', category: 'CODING', description: 'Robust tests and high coverage.', triggerType: 'MANUAL' },
  { slug: 'performance-ninja', name: 'Performance Ninja', emoji: '⚡', tier: 'gold', category: 'CODING', description: 'Extreme performance optimization.', triggerType: 'MANUAL' },
]

// =============================================================================
// DEVOPS BADGES (12)
// =============================================================================
export const DEVOPS_BADGES: BadgeDefinition[] = [
  { slug: 'pipeline-pro', name: 'Pipeline Pro', emoji: '🔄', tier: 'silver', category: 'DEVOPS', description: 'Fast and reliable CI/CD pipelines.', triggerType: 'MANUAL' },
  { slug: 'docker-captain', name: 'Docker Captain', emoji: '🐳', tier: 'silver', category: 'DEVOPS', description: 'Clean and efficient containerization.', triggerType: 'MANUAL' },
  { slug: 'cloud-deployer', name: 'Cloud Deployer', emoji: '☁️', tier: 'gold', category: 'DEVOPS', description: 'Zero-downtime cloud deployments.', triggerType: 'MANUAL' },
  { slug: 'cicd-master', name: 'CI/CD Master', emoji: '🚀', tier: 'gold', category: 'DEVOPS', description: 'Full development cycle automation.', triggerType: 'MANUAL' },
  { slug: 'kubernetes-king', name: 'Kubernetes King', emoji: '☸️', tier: 'gold', category: 'DEVOPS', description: 'Container orchestration at scale.', triggerType: 'MANUAL' },
  { slug: 'terraform-titan', name: 'Terraform Titan', emoji: '🏗️', tier: 'silver', category: 'DEVOPS', description: 'Impeccable infrastructure as code.', triggerType: 'MANUAL' },
  { slug: 'monitoring-maven', name: 'Monitoring Maven', emoji: '📊', tier: 'silver', category: 'DEVOPS', description: 'Complete system observability.', triggerType: 'MANUAL' },
  { slug: 'security-sentinel', name: 'Security Sentinel', emoji: '🛡️', tier: 'gold', category: 'DEVOPS', description: 'Security at every layer.', triggerType: 'MANUAL' },
  { slug: 'aws-architect', name: 'AWS Architect', emoji: '🌩️', tier: 'gold', category: 'DEVOPS', description: 'Professional-level AWS architecture.', triggerType: 'MANUAL' },
  { slug: 'gcp-guru', name: 'GCP Guru', emoji: '🌈', tier: 'silver', category: 'DEVOPS', description: 'Google Cloud Platform expert.', triggerType: 'MANUAL' },
  { slug: 'azure-ace', name: 'Azure Ace', emoji: '💠', tier: 'silver', category: 'DEVOPS', description: 'Microsoft Azure master.', triggerType: 'MANUAL' },
  { slug: 'sre-specialist', name: 'SRE Specialist', emoji: '⚙️', tier: 'gold', category: 'DEVOPS', description: 'Site Reliability Engineering.', triggerType: 'MANUAL' },
]

// =============================================================================
// COLLABORATION BADGES (12)
// =============================================================================
export const COLLABORATION_BADGES: BadgeDefinition[] = [
  { slug: 'mentor', name: 'Mentor', emoji: '🧑‍🏫', tier: 'bronze', category: 'COLLABORATION', description: 'Guides new team members.', triggerType: 'MANUAL' },
  { slug: 'mentor-master', name: 'Mentor Master', emoji: '🎓', tier: 'gold', category: 'COLLABORATION', description: 'Has guided 20+ colleagues to success.', triggerType: 'MANUAL' },
  { slug: 'team-spirit', name: 'Team Spirit', emoji: '🤝', tier: 'silver', category: 'COLLABORATION', description: 'Keeps team morale high.', triggerType: 'KUDOS_RECEIVED', triggerValue: 50 },
  { slug: 'code-reviewer', name: 'Code Reviewer', emoji: '🔎', tier: 'silver', category: 'COLLABORATION', description: 'Detailed and constructive reviews.', triggerType: 'CODE_REVIEWS', triggerValue: 100 },
  { slug: 'pair-programmer', name: 'Pair Programmer', emoji: '👥', tier: 'silver', category: 'COLLABORATION', description: 'Effective pair programming.', triggerType: 'MANUAL' },
  { slug: 'knowledge-sharer', name: 'Knowledge Sharer', emoji: '📚', tier: 'silver', category: 'COLLABORATION', description: 'Shares knowledge with the team.', triggerType: 'MANUAL' },
  { slug: 'conflict-resolver', name: 'Conflict Resolver', emoji: '🕊️', tier: 'silver', category: 'COLLABORATION', description: 'Resolves conflicts diplomatically.', triggerType: 'MANUAL' },
  { slug: 'feedback-friend', name: 'Feedback Friend', emoji: '💬', tier: 'bronze', category: 'COLLABORATION', description: 'Always gives constructive feedback.', triggerType: 'KUDOS_SENT', triggerValue: 20 },
  { slug: 'culture-champion', name: 'Culture Champion', emoji: '🎭', tier: 'silver', category: 'COLLABORATION', description: 'Promotes team culture.', triggerType: 'MANUAL' },
  { slug: 'remote-rockstar', name: 'Remote Rockstar', emoji: '🏠', tier: 'silver', category: 'COLLABORATION', description: 'Excellent remote collaboration.', triggerType: 'MANUAL' },
  { slug: 'onboarding-hero', name: 'Onboarding Hero', emoji: '🦸', tier: 'silver', category: 'COLLABORATION', description: 'Makes onboarding memorable.', triggerType: 'MANUAL' },
  { slug: 'community-builder', name: 'Community Builder', emoji: '🌱', tier: 'gold', category: 'COLLABORATION', description: 'Builds internal community.', triggerType: 'MANUAL' },
]

// =============================================================================
// LEADERSHIP BADGES (10)
// =============================================================================
export const LEADERSHIP_BADGES: BadgeDefinition[] = [
  { slug: 'crisis-averted', name: 'Crisis Averted', emoji: '🚨', tier: 'gold', category: 'LEADERSHIP', description: 'Saved the deploy at a critical moment.', triggerType: 'MANUAL' },
  { slug: 'sprint-hero', name: 'Sprint Hero', emoji: '🏃', tier: 'silver', category: 'LEADERSHIP', description: 'Exceptional sprint delivery.', triggerType: 'MANUAL' },
  { slug: 'architect', name: 'Architect', emoji: '🏛️', tier: 'gold', category: 'LEADERSHIP', description: 'Solid and scalable architecture.', triggerType: 'MANUAL' },
  { slug: 'tech-lead', name: 'Tech Lead', emoji: '👑', tier: 'gold', category: 'LEADERSHIP', description: 'Leads technical decisions with vision.', triggerType: 'MANUAL' },
  { slug: 'decision-maker', name: 'Decision Maker', emoji: '⚖️', tier: 'silver', category: 'LEADERSHIP', description: 'Makes difficult decisions wisely.', triggerType: 'MANUAL' },
  { slug: 'project-captain', name: 'Project Captain', emoji: '🧭', tier: 'silver', category: 'LEADERSHIP', description: 'Ships projects successfully.', triggerType: 'MANUAL' },
  { slug: 'innovation-leader', name: 'Innovation Leader', emoji: '💡', tier: 'gold', category: 'LEADERSHIP', description: 'Drives team innovation.', triggerType: 'MANUAL' },
  { slug: 'change-agent', name: 'Change Agent', emoji: '🔄', tier: 'silver', category: 'LEADERSHIP', description: 'Facilitates organizational change.', triggerType: 'MANUAL' },
  { slug: 'stakeholder-whisperer', name: 'Stakeholder Whisperer', emoji: '🗣️', tier: 'silver', category: 'LEADERSHIP', description: 'Expert stakeholder communication.', triggerType: 'MANUAL' },
  { slug: 'roadmap-visionary', name: 'Roadmap Visionary', emoji: '🗺️', tier: 'gold', category: 'LEADERSHIP', description: 'Long-term product vision.', triggerType: 'MANUAL' },
]

// =============================================================================
// DOCUMENTATION BADGES (8)
// =============================================================================
export const DOCUMENTATION_BADGES: BadgeDefinition[] = [
  { slug: 'docs-hero', name: 'Docs Hero', emoji: '📖', tier: 'bronze', category: 'DOCUMENTATION', description: 'Clear documentation for the whole team.', triggerType: 'MANUAL' },
  { slug: 'api-designer', name: 'API Designer', emoji: '📋', tier: 'silver', category: 'DOCUMENTATION', description: 'Well-designed and documented APIs.', triggerType: 'MANUAL' },
  { slug: 'open-source', name: 'Open Source', emoji: '🌍', tier: 'silver', category: 'DOCUMENTATION', description: 'Open source contributions.', triggerType: 'MANUAL' },
  { slug: 'readme-writer', name: 'README Writer', emoji: '📄', tier: 'bronze', category: 'DOCUMENTATION', description: 'READMEs people actually read.', triggerType: 'MANUAL' },
  { slug: 'wiki-wizard', name: 'Wiki Wizard', emoji: '📚', tier: 'silver', category: 'DOCUMENTATION', description: 'Organized and useful wikis.', triggerType: 'MANUAL' },
  { slug: 'diagram-artist', name: 'Diagram Artist', emoji: '🎨', tier: 'bronze', category: 'DOCUMENTATION', description: 'Diagrams that explain everything.', triggerType: 'MANUAL' },
  { slug: 'changelog-keeper', name: 'Changelog Keeper', emoji: '📝', tier: 'bronze', category: 'DOCUMENTATION', description: 'Detailed changelogs always.', triggerType: 'MANUAL' },
  { slug: 'tutorial-teacher', name: 'Tutorial Teacher', emoji: '🎬', tier: 'silver', category: 'DOCUMENTATION', description: 'Tutorials that really teach.', triggerType: 'MANUAL' },
]

// =============================================================================
// QUALITY BADGES (10)
// =============================================================================
export const QUALITY_BADGES: BadgeDefinition[] = [
  { slug: 'zero-bugs', name: 'Zero Bugs', emoji: '🎯', tier: 'gold', category: 'QUALITY', description: 'Bug-free code in production.', triggerType: 'MANUAL' },
  { slug: 'qa-champion', name: 'QA Champion', emoji: '🔬', tier: 'silver', category: 'QUALITY', description: 'Rigorous and complete testing.', triggerType: 'MANUAL' },
  { slug: 'accessibility-advocate', name: 'Accessibility Advocate', emoji: '♿', tier: 'silver', category: 'QUALITY', description: 'Accessibility as a priority.', triggerType: 'MANUAL' },
  { slug: 'performance-guardian', name: 'Performance Guardian', emoji: '📈', tier: 'silver', category: 'QUALITY', description: 'Monitors performance constantly.', triggerType: 'MANUAL' },
  { slug: 'code-coverage-king', name: 'Code Coverage King', emoji: '📊', tier: 'silver', category: 'QUALITY', description: 'Impeccable test coverage.', triggerType: 'MANUAL' },
  { slug: 'load-tester', name: 'Load Tester', emoji: '🏋️', tier: 'silver', category: 'QUALITY', description: 'Professional load testing.', triggerType: 'MANUAL' },
  { slug: 'e2e-expert', name: 'E2E Expert', emoji: '🔄', tier: 'silver', category: 'QUALITY', description: 'Robust end-to-end tests.', triggerType: 'MANUAL' },
  { slug: 'security-scanner', name: 'Security Scanner', emoji: '🔒', tier: 'silver', category: 'QUALITY', description: 'Vulnerability scanning.', triggerType: 'MANUAL' },
  { slug: 'tech-debt-fighter', name: 'Tech Debt Fighter', emoji: '⚔️', tier: 'silver', category: 'QUALITY', description: 'Actively reduces technical debt.', triggerType: 'MANUAL' },
  { slug: 'standards-setter', name: 'Standards Setter', emoji: '📏', tier: 'silver', category: 'QUALITY', description: 'Defines team standards.', triggerType: 'MANUAL' },
]

// =============================================================================
// INNOVATION BADGES (10)
// =============================================================================
export const INNOVATION_BADGES: BadgeDefinition[] = [
  { slug: 'hackathon-winner', name: 'Hackathon Winner', emoji: '🏆', tier: 'gold', category: 'INNOVATION', description: 'Internal hackathon winner.', triggerType: 'MANUAL' },
  { slug: 'poc-pioneer', name: 'PoC Pioneer', emoji: '🧪', tier: 'silver', category: 'INNOVATION', description: 'Convincing Proof of Concepts.', triggerType: 'MANUAL' },
  { slug: 'tech-explorer', name: 'Tech Explorer', emoji: '🔭', tier: 'bronze', category: 'INNOVATION', description: 'Explores new technologies.', triggerType: 'MANUAL' },
  { slug: 'automation-ace', name: 'Automation Ace', emoji: '🤖', tier: 'silver', category: 'INNOVATION', description: 'Automates everything repetitive.', triggerType: 'MANUAL' },
  { slug: 'tool-builder', name: 'Tool Builder', emoji: '🔧', tier: 'silver', category: 'INNOVATION', description: 'Creates tools for the team.', triggerType: 'MANUAL' },
  { slug: 'ai-integrator', name: 'AI Integrator', emoji: '🧠', tier: 'gold', category: 'INNOVATION', description: 'Practically integrates AI.', triggerType: 'MANUAL' },
  { slug: 'patent-holder', name: 'Patent Holder', emoji: '📜', tier: 'gold', category: 'INNOVATION', description: 'Inventor with registered patent.', triggerType: 'MANUAL' },
  { slug: 'research-lead', name: 'Research Lead', emoji: '🔬', tier: 'silver', category: 'INNOVATION', description: 'Leads technical research.', triggerType: 'MANUAL' },
  { slug: 'early-adopter', name: 'Early Adopter', emoji: '🚀', tier: 'bronze', category: 'INNOVATION', description: 'First to adopt the new.', triggerType: 'MANUAL' },
  { slug: 'disruptor', name: 'Disruptor', emoji: '💥', tier: 'gold', category: 'INNOVATION', description: 'Game-changing ideas.', triggerType: 'MANUAL' },
]

// =============================================================================
// SPECIAL BADGES (8)
// =============================================================================
export const SPECIAL_BADGES: BadgeDefinition[] = [
  { slug: 'ursol-founder', name: 'Ursol Founder', emoji: '⭐', tier: 'gold', category: 'SPECIAL', description: 'Founder of Sistemas Ursol.', triggerType: 'MANUAL' },
  { slug: 'anniversary-1', name: '1 Year', emoji: '🎂', tier: 'bronze', category: 'SPECIAL', description: '1 year at the organization.', triggerType: 'TENURE_DAYS', triggerValue: 365 },
  { slug: 'anniversary-3', name: '3 Years', emoji: '🎉', tier: 'silver', category: 'SPECIAL', description: '3 years at the organization.', triggerType: 'TENURE_DAYS', triggerValue: 1095 },
  { slug: 'anniversary-5', name: '5 Years', emoji: '🏅', tier: 'gold', category: 'SPECIAL', description: '5 years at the organization.', triggerType: 'TENURE_DAYS', triggerValue: 1825 },
  { slug: 'boomflow-creator', name: 'BOOMFLOW Creator', emoji: '🚀', tier: 'gold', category: 'SPECIAL', description: 'Creator of the BOOMFLOW system.', triggerType: 'MANUAL' },
  { slug: 'first-100', name: 'First 100', emoji: '💯', tier: 'silver', category: 'SPECIAL', description: 'Among the first 100 users.', triggerType: 'MANUAL' },
  { slug: 'mvp', name: 'MVP', emoji: '🌟', tier: 'gold', category: 'SPECIAL', description: 'Most Valuable Player of the quarter.', triggerType: 'MANUAL' },
  { slug: 'legend', name: 'Legend', emoji: '🏛️', tier: 'gold', category: 'SPECIAL', description: 'Legendary contribution to the team.', triggerType: 'MANUAL' },
]

// =============================================================================
// COMMUNITY BADGES - Peer-to-Peer (4)
// =============================================================================
export const COMMUNITY_BADGES: BadgeDefinition[] = [
  { slug: 'resonancia', name: 'Resonance', emoji: '🔔', tier: 'bronze', category: 'COMMUNITY', description: 'Received first peer-to-peer badge.', triggerType: 'PEER_AWARDS_COUNT', triggerValue: 1 },
  { slug: 'vinculo-fuerte', name: 'Strong Bond', emoji: '🔗', tier: 'silver', category: 'COMMUNITY', description: 'Received 5+ peer badges from different colleagues.', triggerType: 'PEER_AWARDS_COUNT', triggerValue: 5 },
  { slug: 'alma-del-equipo', name: 'Team Soul', emoji: '💎', tier: 'gold', category: 'COMMUNITY', description: 'Received 10+ peer badges. True team pillar.', triggerType: 'PEER_AWARDS_COUNT', triggerValue: 10 },
  { slug: 'generous-spirit', name: 'Generous Spirit', emoji: '🎁', tier: 'silver', category: 'COMMUNITY', description: 'Awarded all available peer badges this year.', triggerType: 'MANUAL_PEER_AWARD' },
]

// =============================================================================
// PREMIUM BADGES - Patron/Supporter (4)
// =============================================================================
export const PREMIUM_BADGES: BadgeDefinition[] = [
  { slug: 'patron-seed', name: 'Patron Seed', emoji: '🌱', tier: 'bronze', category: 'PREMIUM', description: 'Early supporter of BOOMFLOW platform.', triggerType: 'INVESTMENT' },
  { slug: 'patron-growth', name: 'Patron Growth', emoji: '🌿', tier: 'silver', category: 'PREMIUM', description: 'Sustained supporter with continued investment.', triggerType: 'INVESTMENT' },
  { slug: 'patron-bloom', name: 'Patron Bloom', emoji: '🌸', tier: 'gold', category: 'PREMIUM', description: 'Major supporter enabling platform growth.', triggerType: 'INVESTMENT' },
  { slug: 'eco-champion', name: 'Eco Champion', emoji: '🌍', tier: 'gold', category: 'PREMIUM', description: 'Champion of the BOOMFLOW ecosystem.', triggerType: 'MANUAL' },
]

// =============================================================================
// ALL BADGES COMBINED
// =============================================================================
export const ALL_BADGES: BadgeDefinition[] = [
  ...ONBOARDING_BADGES,
  ...CODING_BADGES,
  ...DEVOPS_BADGES,
  ...COLLABORATION_BADGES,
  ...LEADERSHIP_BADGES,
  ...DOCUMENTATION_BADGES,
  ...QUALITY_BADGES,
  ...INNOVATION_BADGES,
  ...SPECIAL_BADGES,
  ...COMMUNITY_BADGES,
  ...PREMIUM_BADGES,
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all badges by category
 */
export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return ALL_BADGES.filter(badge => badge.category === category)
}

/**
 * Get badge by slug
 */
export function getBadgeBySlug(slug: string): BadgeDefinition | undefined {
  return ALL_BADGES.find(badge => badge.slug === slug)
}

/**
 * Get all badges by tier
 */
export function getBadgesByTier(tier: BadgeTier): BadgeDefinition[] {
  return ALL_BADGES.filter(badge => badge.tier === tier)
}

/**
 * Get automatic badges (non-manual triggers)
 */
export function getAutomaticBadges(): BadgeDefinition[] {
  return ALL_BADGES.filter(badge => badge.triggerType !== 'MANUAL')
}

/**
 * Get badge statistics
 */
export function getBadgeStats() {
  const total = ALL_BADGES.length
  const byCategory = {} as Record<BadgeCategory, number>
  const byTier = {} as Record<BadgeTier, number>
  
  ALL_BADGES.forEach(badge => {
    byCategory[badge.category] = (byCategory[badge.category] || 0) + 1
    byTier[badge.tier] = (byTier[badge.tier] || 0) + 1
  })

  return { total, byCategory, byTier }
}

// Export default for convenience
export default ALL_BADGES
