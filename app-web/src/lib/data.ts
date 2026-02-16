// Centralized mock data for BOOMFLOW Dashboard
// In production this will come from the API/Database

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  tier: 'bronze' | 'silver' | 'gold';
  category: string;
  description: string;
  howToGet: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  badges: string[]; // badge IDs
  kudosReceived: number;
  kudosGiven: number;
  streak: number;
  joinedAt: string;
}

export interface Activity {
  id: string;
  type: 'badge_earned' | 'kudo_sent' | 'kudo_received' | 'milestone';
  userId: string;
  targetUserId?: string;
  badgeId?: string;
  message?: string;
  timestamp: string;
}

// ============================================
// BADGE CATALOG - All 89 badges
// ============================================

export const BADGE_CATALOG: Badge[] = [
  // ONBOARDING (4)
  { id: 'hello-world', name: 'Hello World', emoji: '👋', tier: 'bronze', category: 'onboarding', description: 'First day on the team. Welcome!', howToGet: 'Join the Sistemas Ursol team' },
  { id: 'first-commit', name: 'First Commit', emoji: '📝', tier: 'bronze', category: 'onboarding', description: 'First commit to the team repository.', howToGet: 'Make your first commit in any org repo' },
  { id: 'first-pr', name: 'First PR', emoji: '🔀', tier: 'bronze', category: 'onboarding', description: 'First Pull Request approved and merged.', howToGet: 'Merge your first PR' },
  { id: 'first-review', name: 'First Review', emoji: '👀', tier: 'bronze', category: 'onboarding', description: 'First code review completed.', howToGet: 'Review a teammate\'s code' },
  
  // CODING (15)
  { id: 'code-ninja', name: 'Code Ninja', emoji: '🥷', tier: 'silver', category: 'coding', description: 'Clean, fast, and efficient code.', howToGet: '10+ PRs with high-quality code' },
  { id: 'bug-hunter', name: 'Bug Hunter', emoji: '🐛', tier: 'silver', category: 'coding', description: 'Detects and fixes bugs before production.', howToGet: 'Find and fix 20+ bugs' },
  { id: 'refactor-master', name: 'Refactor Master', emoji: '♻️', tier: 'silver', category: 'coding', description: 'Improves legacy code without breaking functionality.', howToGet: 'Refactor 5+ critical modules' },
  { id: 'algorithm-ace', name: 'Algorithm Ace', emoji: '🧮', tier: 'gold', category: 'coding', description: 'Solves complex problems with optimal algorithms.', howToGet: 'Implement algorithms that improve performance 10x' },
  { id: 'clean-code', name: 'Clean Code', emoji: '✨', tier: 'silver', category: 'coding', description: 'Readable, documented, and maintainable code.', howToGet: 'Maintain 95%+ code coverage and documentation' },
  { id: 'full-stack', name: 'Full Stack', emoji: '🌐', tier: 'gold', category: 'coding', description: 'Masters both frontend and backend.', howToGet: 'Contribute significantly to both sides' },
  { id: 'typescript-wizard', name: 'TypeScript Wizard', emoji: '🔷', tier: 'silver', category: 'coding', description: 'Strict typing and advanced generics.', howToGet: 'Write complex types that prevent bugs' },
  { id: 'python-master', name: 'Python Master', emoji: '🐍', tier: 'silver', category: 'coding', description: 'Advanced Python proficiency.', howToGet: 'Lead successful Python projects' },
  { id: 'rust-pioneer', name: 'Rust Pioneer', emoji: '🦀', tier: 'gold', category: 'coding', description: 'Systems programming in Rust.', howToGet: 'Implement critical components in Rust' },
  { id: 'regex-guru', name: 'Regex Guru', emoji: '🔍', tier: 'bronze', category: 'coding', description: 'Complex regular expressions.', howToGet: 'Write regex that others can\'t read' },
  { id: 'sql-sorcerer', name: 'SQL Sorcerer', emoji: '🗃️', tier: 'silver', category: 'coding', description: 'Optimized queries and DB design.', howToGet: 'Optimize critical queries' },
  { id: 'api-artisan', name: 'API Artisan', emoji: '🔗', tier: 'silver', category: 'coding', description: 'Well-designed RESTful APIs.', howToGet: 'Design APIs used by the team' },
  { id: 'graphql-guru', name: 'GraphQL Guru', emoji: '◈', tier: 'silver', category: 'coding', description: 'Efficient schemas and resolvers.', howToGet: 'Implement GraphQL API in production' },
  { id: 'test-champion', name: 'Test Champion', emoji: '✅', tier: 'silver', category: 'coding', description: 'Robust tests and high coverage.', howToGet: '90%+ coverage in key projects' },
  { id: 'performance-ninja', name: 'Performance Ninja', emoji: '⚡', tier: 'gold', category: 'coding', description: 'Extreme performance optimization.', howToGet: 'Reduce load times 50%+' },
  
  // DEVOPS (12)
  { id: 'pipeline-pro', name: 'Pipeline Pro', emoji: '🔄', tier: 'silver', category: 'devops', description: 'Fast and reliable CI/CD pipelines.', howToGet: 'Configure pipelines for 5+ projects' },
  { id: 'docker-captain', name: 'Docker Captain', emoji: '🐳', tier: 'silver', category: 'devops', description: 'Clean and efficient containerization.', howToGet: 'Dockerize production applications' },
  { id: 'cloud-deployer', name: 'Cloud Deployer', emoji: '☁️', tier: 'gold', category: 'devops', description: 'Zero-downtime cloud deployments.', howToGet: 'Implement zero-downtime deployments' },
  { id: 'cicd-master', name: 'CI/CD Master', emoji: '🚀', tier: 'gold', category: 'devops', description: 'Full development cycle automation.', howToGet: 'Automate the entire deployment flow' },
  { id: 'kubernetes-king', name: 'Kubernetes King', emoji: '☸️', tier: 'gold', category: 'devops', description: 'Container orchestration at scale.', howToGet: 'Manage production clusters' },
  { id: 'terraform-titan', name: 'Terraform Titan', emoji: '🏗️', tier: 'silver', category: 'devops', description: 'Impeccable infrastructure as code.', howToGet: 'IaC for the entire infrastructure' },
  { id: 'monitoring-maven', name: 'Monitoring Maven', emoji: '📊', tier: 'silver', category: 'devops', description: 'Complete system observability.', howToGet: 'Implement dashboards and alerts' },
  { id: 'security-sentinel', name: 'Security Sentinel', emoji: '🛡️', tier: 'gold', category: 'devops', description: 'Security at every layer.', howToGet: 'Implement security best practices' },
  { id: 'aws-architect', name: 'AWS Architect', emoji: '🌩️', tier: 'gold', category: 'devops', description: 'Professional-level AWS architecture.', howToGet: 'Design scalable AWS architectures' },
  { id: 'gcp-guru', name: 'GCP Guru', emoji: '🌈', tier: 'silver', category: 'devops', description: 'Google Cloud Platform expert.', howToGet: 'Implement solutions on GCP' },
  { id: 'azure-ace', name: 'Azure Ace', emoji: '💠', tier: 'silver', category: 'devops', description: 'Microsoft Azure master.', howToGet: 'Implement solutions on Azure' },
  { id: 'sre-specialist', name: 'SRE Specialist', emoji: '⚙️', tier: 'gold', category: 'devops', description: 'Site Reliability Engineering.', howToGet: 'Maintain 99.9% uptime' },
  
  // COLLABORATION (12)
  { id: 'mentor', name: 'Mentor', emoji: '🧑‍🏫', tier: 'bronze', category: 'collaboration', description: 'Guides new teammates.', howToGet: 'Mentor 3+ new members' },
  { id: 'mentor-master', name: 'Mentor Master', emoji: '🎓', tier: 'gold', category: 'collaboration', description: 'Has guided 20+ colleagues to success.', howToGet: 'Mentor 20+ people' },
  { id: 'team-spirit', name: 'Team Spirit', emoji: '🤝', tier: 'silver', category: 'collaboration', description: 'Keeps team morale high.', howToGet: 'Recognized by the team for attitude' },
  { id: 'code-reviewer', name: 'Code Reviewer', emoji: '🔎', tier: 'silver', category: 'collaboration', description: 'Detailed and constructive reviews.', howToGet: 'Do 100+ quality code reviews' },
  { id: 'pair-programmer', name: 'Pair Programmer', emoji: '👥', tier: 'silver', category: 'collaboration', description: 'Effective pair programming.', howToGet: 'Regular pairing sessions' },
  { id: 'knowledge-sharer', name: 'Knowledge Sharer', emoji: '📚', tier: 'silver', category: 'collaboration', description: 'Shares knowledge with the team.', howToGet: 'Give 5+ tech talks or workshops' },
  { id: 'conflict-resolver', name: 'Conflict Resolver', emoji: '🕊️', tier: 'silver', category: 'collaboration', description: 'Resolves conflicts diplomatically.', howToGet: 'Mediate technical disagreements' },
  { id: 'feedback-friend', name: 'Feedback Friend', emoji: '💬', tier: 'bronze', category: 'collaboration', description: 'Always gives constructive feedback.', howToGet: 'Be recognized for giving good feedback' },
  { id: 'culture-champion', name: 'Culture Champion', emoji: '🎭', tier: 'silver', category: 'collaboration', description: 'Promotes team culture.', howToGet: 'Organize team building events' },
  { id: 'remote-rockstar', name: 'Remote Rockstar', emoji: '🏠', tier: 'silver', category: 'collaboration', description: 'Excellent remote collaboration.', howToGet: 'Excel at remote work' },
  { id: 'onboarding-hero', name: 'Onboarding Hero', emoji: '🦸', tier: 'silver', category: 'collaboration', description: 'Makes onboarding memorable.', howToGet: 'Create onboarding materials' },
  { id: 'community-builder', name: 'Community Builder', emoji: '🌱', tier: 'gold', category: 'collaboration', description: 'Builds internal community.', howToGet: 'Create communities of practice' },
  
  // LEADERSHIP (10)
  { id: 'crisis-averted', name: 'Crisis Averted', emoji: '🚨', tier: 'gold', category: 'leadership', description: 'Saved the deploy at a critical moment.', howToGet: 'Resolve production crises' },
  { id: 'sprint-hero', name: 'Sprint Hero', emoji: '🏃', tier: 'silver', category: 'leadership', description: 'Exceptional sprint delivery.', howToGet: 'Excel in 5+ consecutive sprints' },
  { id: 'architect', name: 'Architect', emoji: '🏛️', tier: 'gold', category: 'leadership', description: 'Solid and scalable architecture.', howToGet: 'Design critical system architecture' },
  { id: 'tech-lead', name: 'Tech Lead', emoji: '👑', tier: 'gold', category: 'leadership', description: 'Leads technical decisions with vision.', howToGet: 'Successfully lead a technical team' },
  { id: 'decision-maker', name: 'Decision Maker', emoji: '⚖️', tier: 'silver', category: 'leadership', description: 'Makes difficult decisions wisely.', howToGet: 'Make decisions that benefit the team' },
  { id: 'project-captain', name: 'Project Captain', emoji: '🧭', tier: 'silver', category: 'leadership', description: 'Ships projects successfully.', howToGet: 'Lead a project from start to finish' },
  { id: 'innovation-leader', name: 'Innovation Leader', emoji: '💡', tier: 'gold', category: 'leadership', description: 'Drives team innovation.', howToGet: 'Propose and implement innovations' },
  { id: 'change-agent', name: 'Change Agent', emoji: '🔄', tier: 'silver', category: 'leadership', description: 'Facilitates organizational change.', howToGet: 'Lead successful transformations' },
  { id: 'stakeholder-whisperer', name: 'Stakeholder Whisperer', emoji: '🗣️', tier: 'silver', category: 'leadership', description: 'Expert stakeholder communication.', howToGet: 'Manage stakeholder expectations' },
  { id: 'roadmap-visionary', name: 'Roadmap Visionary', emoji: '🗺️', tier: 'gold', category: 'leadership', description: 'Long-term product vision.', howToGet: 'Define an adopted technical roadmap' },
  
  // DOCUMENTATION (8)
  { id: 'docs-hero', name: 'Docs Hero', emoji: '📖', tier: 'bronze', category: 'documentation', description: 'Clear documentation for the whole team.', howToGet: 'Write quality documentation' },
  { id: 'api-designer', name: 'API Designer', emoji: '📋', tier: 'silver', category: 'documentation', description: 'Well-designed and documented APIs.', howToGet: 'Fully document APIs' },
  { id: 'open-source', name: 'Open Source', emoji: '🌍', tier: 'silver', category: 'documentation', description: 'Open source project contributions.', howToGet: 'Contribute to recognized OSS' },
  { id: 'readme-writer', name: 'README Writer', emoji: '📄', tier: 'bronze', category: 'documentation', description: 'READMEs people actually read.', howToGet: 'Write exemplary READMEs' },
  { id: 'wiki-wizard', name: 'Wiki Wizard', emoji: '📚', tier: 'silver', category: 'documentation', description: 'Organized and useful wikis.', howToGet: 'Maintain the team wiki' },
  { id: 'diagram-artist', name: 'Diagram Artist', emoji: '🎨', tier: 'bronze', category: 'documentation', description: 'Diagrams that explain everything.', howToGet: 'Create clear architecture diagrams' },
  { id: 'changelog-keeper', name: 'Changelog Keeper', emoji: '📝', tier: 'bronze', category: 'documentation', description: 'Detailed changelogs always.', howToGet: 'Keep changelogs up to date' },
  { id: 'tutorial-teacher', name: 'Tutorial Teacher', emoji: '🎬', tier: 'silver', category: 'documentation', description: 'Tutorials that really teach.', howToGet: 'Create tutorials for the team' },
  
  // QUALITY (10)
  { id: 'zero-bugs', name: 'Zero Bugs', emoji: '🎯', tier: 'gold', category: 'quality', description: 'Bug-free code in production.', howToGet: 'Sprint with no bugs reported' },
  { id: 'qa-champion', name: 'QA Champion', emoji: '🔬', tier: 'silver', category: 'quality', description: 'Rigorous and complete testing.', howToGet: 'Implement QA strategy' },
  { id: 'accessibility-advocate', name: 'Accessibility Advocate', emoji: '♿', tier: 'silver', category: 'quality', description: 'Accessibility as a priority.', howToGet: 'Implement a11y in projects' },
  { id: 'performance-guardian', name: 'Performance Guardian', emoji: '📈', tier: 'silver', category: 'quality', description: 'Monitors performance constantly.', howToGet: 'Maintain performance SLOs' },
  { id: 'code-coverage-king', name: 'Code Coverage King', emoji: '📊', tier: 'silver', category: 'quality', description: 'Impeccable test coverage.', howToGet: 'Maintain 90%+ coverage' },
  { id: 'load-tester', name: 'Load Tester', emoji: '🏋️', tier: 'silver', category: 'quality', description: 'Professional load testing.', howToGet: 'Implement complete load testing' },
  { id: 'e2e-expert', name: 'E2E Expert', emoji: '🔄', tier: 'silver', category: 'quality', description: 'Robust end-to-end tests.', howToGet: 'Complete E2E test suite' },
  { id: 'security-scanner', name: 'Security Scanner', emoji: '🔒', tier: 'silver', category: 'quality', description: 'Vulnerability scanning.', howToGet: 'Implement security scanning' },
  { id: 'tech-debt-fighter', name: 'Tech Debt Fighter', emoji: '⚔️', tier: 'silver', category: 'quality', description: 'Actively reduces technical debt.', howToGet: 'Eliminate significant tech debt' },
  { id: 'standards-setter', name: 'Standards Setter', emoji: '📏', tier: 'silver', category: 'quality', description: 'Defines team standards.', howToGet: 'Create adopted coding standards' },
  
  // INNOVATION (10)
  { id: 'hackathon-winner', name: 'Hackathon Winner', emoji: '🏆', tier: 'gold', category: 'innovation', description: 'Internal hackathon winner.', howToGet: 'Win the company hackathon' },
  { id: 'poc-pioneer', name: 'PoC Pioneer', emoji: '🧪', tier: 'silver', category: 'innovation', description: 'Convincing Proof of Concepts.', howToGet: 'Create a PoC that gets implemented' },
  { id: 'tech-explorer', name: 'Tech Explorer', emoji: '🔭', tier: 'bronze', category: 'innovation', description: 'Explores new technologies.', howToGet: 'Evaluate 5+ new technologies' },
  { id: 'automation-ace', name: 'Automation Ace', emoji: '🤖', tier: 'silver', category: 'innovation', description: 'Automates everything repetitive.', howToGet: 'Automate manual processes' },
  { id: 'tool-builder', name: 'Tool Builder', emoji: '🔧', tier: 'silver', category: 'innovation', description: 'Creates tools for the team.', howToGet: 'Develop internal tools' },
  { id: 'ai-integrator', name: 'AI Integrator', emoji: '🧠', tier: 'gold', category: 'innovation', description: 'Practically integrates AI.', howToGet: 'Implement AI-powered solutions' },
  { id: 'patent-holder', name: 'Patent Holder', emoji: '📜', tier: 'gold', category: 'innovation', description: 'Inventor with registered patent.', howToGet: 'Obtain a patent' },
  { id: 'research-lead', name: 'Research Lead', emoji: '🔬', tier: 'silver', category: 'innovation', description: 'Leads technical research.', howToGet: 'Lead a research project' },
  { id: 'early-adopter', name: 'Early Adopter', emoji: '🚀', tier: 'bronze', category: 'innovation', description: 'First to adopt the new.', howToGet: 'Implement new technology first' },
  { id: 'disruptor', name: 'Disruptor', emoji: '💥', tier: 'gold', category: 'innovation', description: 'Game-changing ideas.', howToGet: 'Propose a transformative change' },
  
  // SPECIAL (8)
  { id: 'ursol-founder', name: 'Ursol Founder', emoji: '⭐', tier: 'gold', category: 'special', description: 'Fundador de Sistemas Ursol.', howToGet: 'Ser fundador de la organización' },
  { id: 'anniversary-1', name: '1 Year', emoji: '🎂', tier: 'bronze', category: 'special', description: '1 año en Sistemas Ursol.', howToGet: 'Cumplir 1 año en la org' },
  { id: 'anniversary-3', name: '3 Years', emoji: '🎉', tier: 'silver', category: 'special', description: '3 años en Sistemas Ursol.', howToGet: 'Cumplir 3 años en la org' },
  { id: 'anniversary-5', name: '5 Years', emoji: '🏅', tier: 'gold', category: 'special', description: '5 años en Sistemas Ursol.', howToGet: 'Cumplir 5 años en la org' },
  { id: 'boomflow-creator', name: 'BOOMFLOW Creator', emoji: '🚀', tier: 'gold', category: 'special', description: 'Creador del sistema BOOMFLOW.', howToGet: 'Crear BOOMFLOW' },
  { id: 'first-100', name: 'First 100', emoji: '💯', tier: 'silver', category: 'special', description: 'Entre los primeros 100 usuarios.', howToGet: 'Unirse entre los primeros 100' },
  { id: 'mvp', name: 'MVP', emoji: '🌟', tier: 'gold', category: 'special', description: 'Most Valuable Player del trimestre.', howToGet: 'Ser elegido MVP del trimestre' },
  { id: 'legend', name: 'Legend', emoji: '🏛️', tier: 'gold', category: 'special', description: 'Contribución legendaria al equipo.', howToGet: 'Reconocimiento unánime del equipo' },
];

// ============================================
// CATEGORIES
// ============================================

export const CATEGORIES = [
  { id: 'onboarding', name: 'Onboarding', emoji: '🟢', color: 'emerald' },
  { id: 'coding', name: 'Coding', emoji: '🔵', color: 'blue' },
  { id: 'devops', name: 'DevOps', emoji: '🟣', color: 'purple' },
  { id: 'collaboration', name: 'Colaboración', emoji: '🟡', color: 'yellow' },
  { id: 'leadership', name: 'Liderazgo', emoji: '🔴', color: 'red' },
  { id: 'documentation', name: 'Documentación', emoji: '⚪', color: 'zinc' },
  { id: 'quality', name: 'Calidad', emoji: '🟤', color: 'amber' },
  { id: 'innovation', name: 'Innovación', emoji: '🟠', color: 'orange' },
  { id: 'special', name: 'Especiales', emoji: '⭐', color: 'pink' },
];

export const TIERS = [
  { id: 'gold', name: 'Oro', emoji: '🥇', color: 'from-yellow-400 to-amber-600' },
  { id: 'silver', name: 'Plata', emoji: '🥈', color: 'from-zinc-300 to-zinc-500' },
  { id: 'bronze', name: 'Bronce', emoji: '🥉', color: 'from-orange-400 to-orange-700' },
];

// ============================================
// MOCK USERS
// ============================================

export const USERS: User[] = [
  {
    id: '1',
    username: 'ursolcr',
    displayName: 'ursolcr',
    badges: [
      'ursol-founder', 'boomflow-creator', 'hello-world', 'first-commit', 
      'first-pr', 'first-review', 'code-ninja', 'mentor-master', 
      'team-spirit', 'architect'
    ],
    kudosReceived: 156,
    kudosGiven: 89,
    streak: 45,
    joinedAt: '2020-01-15',
  },
  {
    id: '2',
    username: 'jeremy-sud',
    displayName: 'Jeremy Sud',
    badges: [
      'hello-world', 'first-commit', 'first-pr', 'first-review', 
      'code-ninja', 'team-spirit'
    ],
    kudosReceived: 45,
    kudosGiven: 32,
    streak: 12,
    joinedAt: '2024-06-01',
  },
];

// ============================================
// MOCK ACTIVITY FEED
// ============================================

export const ACTIVITY_FEED: Activity[] = [
  {
    id: '1',
    type: 'badge_earned',
    userId: '2',
    badgeId: 'team-spirit',
    timestamp: '2026-02-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'kudo_sent',
    userId: '1',
    targetUserId: '2',
    message: '¡Excelente trabajo en el dashboard de BOOMFLOW!',
    timestamp: '2026-02-15T09:15:00Z',
  },
  {
    id: '3',
    type: 'badge_earned',
    userId: '2',
    badgeId: 'code-ninja',
    timestamp: '2026-02-14T16:45:00Z',
  },
  {
    id: '4',
    type: 'kudo_sent',
    userId: '2',
    targetUserId: '1',
    message: 'Gracias por la mentoría en arquitectura de sistemas',
    timestamp: '2026-02-14T14:20:00Z',
  },
  {
    id: '5',
    type: 'milestone',
    userId: '1',
    message: '¡ursolcr alcanzó 150 kudos recibidos!',
    timestamp: '2026-02-13T11:00:00Z',
  },
  {
    id: '6',
    type: 'badge_earned',
    userId: '1',
    badgeId: 'mentor-master',
    timestamp: '2026-02-12T15:30:00Z',
  },
  {
    id: '7',
    type: 'kudo_sent',
    userId: '1',
    targetUserId: '2',
    message: 'Gran refactor del módulo de autenticación',
    timestamp: '2026-02-11T10:00:00Z',
  },
  {
    id: '8',
    type: 'badge_earned',
    userId: '2',
    badgeId: 'first-review',
    timestamp: '2026-02-10T09:00:00Z',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getBadgeById(id: string): Badge | undefined {
  return BADGE_CATALOG.find(b => b.id === id);
}

export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return USERS.find(u => u.username === username);
}

export function getUserBadges(user: User): Badge[] {
  return user.badges.map(id => getBadgeById(id)).filter((b): b is Badge => b !== undefined);
}

export function getBadgesByCategory(category: string): Badge[] {
  return BADGE_CATALOG.filter(b => b.category === category);
}

export function getBadgesByTier(tier: 'bronze' | 'silver' | 'gold'): Badge[] {
  return BADGE_CATALOG.filter(b => b.tier === tier);
}

export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Stats para el leaderboard
export function getLeaderboard(): User[] {
  return [...USERS].sort((a, b) => b.kudosReceived - a.kudosReceived);
}

export function getBadgeStats() {
  const total = BADGE_CATALOG.length;
  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    count: getBadgesByCategory(cat.id).length,
  }));
  const byTier = {
    gold: getBadgesByTier('gold').length,
    silver: getBadgesByTier('silver').length,
    bronze: getBadgesByTier('bronze').length,
  };
  return { total, byCategory, byTier };
}
