/**
 * BOOMFLOW UI Constants
 * Static display metadata for badge categories, tiers, and utility functions.
 * These are NOT data — they're UI display configuration that maps to DB enum values.
 */

// ============================================
// TYPES
// ============================================

export interface BadgeDisplay {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  tier: string;       // DB enum: BRONZE | SILVER | GOLD
  category: string;   // DB enum: ONBOARDING | CODING | ...
  description: string;
  svgIcon?: string;
}

export interface UserDisplay {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
}

export interface KudoDisplay {
  id: string;
  message: string;
  isPublic: boolean;
  createdAt: string;
  from: UserDisplay;
  to: UserDisplay;
  category?: { id: string; name: string; emoji: string } | null;
}

// ============================================
// BADGE CATEGORIES — UI display metadata
// Maps to BadgeCategory enum values (uppercase)
// ============================================

export const CATEGORIES = [
  { id: 'ONBOARDING', name: 'Onboarding', emoji: '🟢', color: 'emerald' },
  { id: 'CODING', name: 'Coding', emoji: '🔵', color: 'blue' },
  { id: 'DEVOPS', name: 'DevOps', emoji: '🟣', color: 'purple' },
  { id: 'COLLABORATION', name: 'Collaboration', emoji: '🟡', color: 'yellow' },
  { id: 'LEADERSHIP', name: 'Leadership', emoji: '🔴', color: 'red' },
  { id: 'DOCUMENTATION', name: 'Documentation', emoji: '⚪', color: 'zinc' },
  { id: 'QUALITY', name: 'Quality', emoji: '🟤', color: 'amber' },
  { id: 'INNOVATION', name: 'Innovation', emoji: '🟠', color: 'orange' },
  { id: 'SPECIAL', name: 'Special', emoji: '⭐', color: 'pink' },
  { id: 'COMMUNITY', name: 'Community', emoji: '🌍', color: 'teal' },
  { id: 'PREMIUM', name: 'Premium', emoji: '💎', color: 'indigo' },
  { id: 'MILESTONE', name: 'Milestone', emoji: '🎯', color: 'lime' },
  { id: 'GROWTH', name: 'Growth', emoji: '📈', color: 'cyan' },
];

// ============================================
// BADGE TIERS — UI display metadata
// Maps to BadgeTier enum values (uppercase)
// ============================================

export const TIERS = [
  { id: 'GOLD', name: 'Gold', emoji: '🥇', color: 'from-yellow-400 to-amber-600' },
  { id: 'SILVER', name: 'Silver', emoji: '🥈', color: 'from-zinc-300 to-zinc-500' },
  { id: 'BRONZE', name: 'Bronze', emoji: '🥉', color: 'from-orange-400 to-orange-700' },
];

// ============================================
// TIER STYLING for badge cards
// ============================================

export const TIER_CARD_COLORS: Record<string, string> = {
  GOLD: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30',
  SILVER: 'from-zinc-400/20 to-zinc-600/20 border-zinc-400/30',
  BRONZE: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Returns a human-readable relative time string
 * @param timestamp - ISO timestamp string
 */
export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/**
 * Get tier emoji from DB enum value
 */
export function getTierEmoji(tier: string): string {
  const tierMap: Record<string, string> = { GOLD: '🥇', SILVER: '🥈', BRONZE: '🥉' };
  return tierMap[tier] ?? '🥉';
}

/**
 * Get tier display label with emoji
 */
export function getTierLabel(tier: string): string {
  const tierLabels: Record<string, string> = { GOLD: '🥇 Gold', SILVER: '🥈 Silver', BRONZE: '🥉 Bronze' };
  return tierLabels[tier] ?? '🥉 Bronze';
}

/**
 * Build SVG URL for a badge by its slug
 */
export function getBadgeSvgUrl(slug: string): string {
  return `https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${slug}.svg`;
}

/**
 * Find category display metadata by DB enum value
 */
export function getCategoryMeta(categoryId: string) {
  return CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Find tier display metadata by DB enum value
 */
export function getTierMeta(tierId: string) {
  return TIERS.find(t => t.id === tierId);
}
