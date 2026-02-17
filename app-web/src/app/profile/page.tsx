'use client';

import { useState, useEffect } from 'react';
import {
  CATEGORIES, TIERS,
  TIER_CARD_COLORS, getBadgeSvgUrl,
  getTierEmoji, getTierLabel,
  type BadgeDisplay,
} from '@/lib/constants';

/** User profile data from the API */
interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  organization?: string | null;
  team?: string | null;
  createdAt: string;
}

/** Badge with award metadata */
interface UserBadge extends BadgeDisplay {
  awardedAt: string;
  awardedBy: string | null;
  reason: string | null;
}

/** Full API response from /api/badges/user/[username] */
interface UserBadgeResponse {
  user: UserProfile;
  badges: UserBadge[];
  badgesByCategory: Record<string, UserBadge[]>;
  stats: { gold: number; silver: number; bronze: number; total: number };
}

// Default demo username — in production this comes from auth session
const DEFAULT_USERNAME = 'jeremy-sud';

export default function ProfilePage() {
  const [data, setData] = useState<UserBadgeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetch(`/api/badges/user/${DEFAULT_USERNAME}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (error || !data) return (
    <div className="max-w-5xl mx-auto text-center py-20 text-zinc-500">
      <span className="text-5xl">😕</span>
      <p className="mt-4 text-lg">{error || 'Could not load profile'}</p>
    </div>
  );

  const { user, badges, stats } = data;

  const filteredBadges = badges.filter(badge => {
    if (filterTier !== 'all' && badge.tier !== filterTier) return false;
    if (filterCategory !== 'all' && badge.category !== filterCategory) return false;
    return true;
  });

  // Categories that actually have badges for this user
  const userCategories = CATEGORIES.filter(cat =>
    badges.some(b => b.category === cat.id)
  );

  const badgesByCategory = userCategories.map(cat => ({
    ...cat,
    badges: badges.filter(b => b.category === cat.id),
  }));

  // Stats per tier
  const tierCounts = {
    GOLD: stats.gold,
    SILVER: stats.silver,
    BRONZE: stats.bronze,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-4xl font-bold">
                {(user.name ?? user.username)[0].toUpperCase()}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.name ?? user.username}</h1>
            <p className="text-zinc-500">@{user.username}</p>
            {user.organization && (
              <p className="text-sm text-zinc-600 mt-1">{user.organization}{user.team ? ` · ${user.team}` : ''}</p>
            )}
            <p className="text-sm text-zinc-600 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-yellow-400">{stats.total}</p>
              <p className="text-xs text-zinc-500">Badges</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">{stats.gold}</p>
              <p className="text-xs text-zinc-500">Gold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Summary by Tier */}
      <div className="grid grid-cols-3 gap-4">
        {TIERS.map(tier => (
          <button
            type="button"
            key={tier.id}
            className={`glass-panel rounded-xl p-4 text-center cursor-pointer transition-all ${
              filterTier === tier.id ? 'ring-2 ring-white/30' : ''
            }`}
            onClick={() => setFilterTier(filterTier === tier.id ? 'all' : tier.id)}
            aria-pressed={filterTier === tier.id}
          >
            <span className="text-3xl">{tier.emoji}</span>
            <p className="text-2xl font-bold mt-2">{tierCounts[tier.id as keyof typeof tierCounts] ?? 0}</p>
            <p className="text-xs text-zinc-500">{tier.name}</p>
          </button>
        ))}
      </div>

      {/* Badges Section */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">🏅 My Badges ({badges.length})</h2>

          {/* Category Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {userCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(filterCategory === cat.id ? 'all' : cat.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
                title={cat.name}
              >
                {cat.emoji}
              </button>
            ))}
          </div>
        </div>

        {filteredBadges.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <span className="text-4xl">🔍</span>
            <p className="mt-4">No badges match these filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>

      {/* All Badges by Category (no filter) */}
      {filterCategory === 'all' && filterTier === 'all' && badgesByCategory.length > 0 && (
        <div className="space-y-6">
          {badgesByCategory.map(category => (
            <div key={category.id} className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.name}
                <span className="text-sm font-normal text-zinc-500">
                  ({category.badges.length} badges)
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.badges.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    title={badge.description}
                  >
                    <img
                      src={getBadgeSvgUrl(badge.slug)}
                      alt={badge.name}
                      className="w-8 h-8"
                    />
                    <span className="text-sm">{badge.name}</span>
                    <span className="text-xs">{getTierEmoji(badge.tier)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="h-40 bg-white/10 rounded-2xl"></div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/10 rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-white/10 rounded-2xl"></div>
    </div>
  );
}

function BadgeCard({ badge }: Readonly<{ badge: UserBadge }>) {
  const tierColors = TIER_CARD_COLORS[badge.tier] ?? TIER_CARD_COLORS.BRONZE;

  return (
    <div className={`rounded-xl p-4 border bg-linear-to-br ${tierColors} backdrop-blur-lg hover:scale-105 transition-transform cursor-pointer`}>
      <div className="flex flex-col items-center text-center">
        <img
          src={getBadgeSvgUrl(badge.slug)}
          alt={badge.name}
          className="w-16 h-16 mb-3"
        />
        <h4 className="font-medium text-sm">{badge.name}</h4>
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{badge.description}</p>
        <div className="mt-2 text-xs">{getTierLabel(badge.tier)}</div>
      </div>
    </div>
  );
}
