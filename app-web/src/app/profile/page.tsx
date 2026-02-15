'use client';

import { USERS, CATEGORIES, TIERS, getBadgeById, getUserBadges } from '@/lib/data';
import { useState } from 'react';

/**
 * Maps badge tier to emoji display
 * @param tier - Badge tier (gold, silver, bronze)
 * @returns Corresponding emoji
 */
function getTierEmoji(tier: string): string {
  const tierMap: Record<string, string> = {
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉'
  };
  return tierMap[tier] ?? '🥉';
}

/**
 * Maps badge tier to display label with emoji
 * @param tier - Badge tier (gold, silver, bronze)
 * @returns Label with emoji (e.g., "🥇 Oro")
 */
function getTierLabel(tier: string): string {
  const tierLabels: Record<string, string> = {
    gold: '🥇 Oro',
    silver: '🥈 Plata',
    bronze: '🥉 Bronce'
  };
  return tierLabels[tier] ?? '🥉 Bronce';
}

// Current user (mock - in production this would come from auth)
const CURRENT_USER = USERS.find(u => u.username === 'jeremy-sud')!;

export default function ProfilePage() {
  const userBadges = getUserBadges(CURRENT_USER);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredBadges = userBadges.filter(badge => {
    if (filterTier !== 'all' && badge.tier !== filterTier) return false;
    if (filterCategory !== 'all' && badge.category !== filterCategory) return false;
    return true;
  });

  // Group badges by category for display
  const badgesByCategory = CATEGORIES.map(cat => ({
    ...cat,
    badges: userBadges.filter(b => b.category === cat.id),
  })).filter(cat => cat.badges.length > 0);

  // Stats
  const tierCounts = {
    gold: userBadges.filter(b => b.tier === 'gold').length,
    silver: userBadges.filter(b => b.tier === 'silver').length,
    bronze: userBadges.filter(b => b.tier === 'bronze').length,
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
                {CURRENT_USER.displayName[0].toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-800 rounded-full px-3 py-1 text-sm border border-white/20">
              🔥 {CURRENT_USER.streak}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{CURRENT_USER.displayName}</h1>
            <p className="text-zinc-500">@{CURRENT_USER.username}</p>
            <p className="text-sm text-zinc-600 mt-2">
              Miembro desde {new Date(CURRENT_USER.joinedAt).toLocaleDateString('es-ES', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-400">{CURRENT_USER.kudosReceived}</p>
              <p className="text-xs text-zinc-500">Kudos recibidos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">{CURRENT_USER.kudosGiven}</p>
              <p className="text-xs text-zinc-500">Kudos enviados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">{userBadges.length}</p>
              <p className="text-xs text-zinc-500">Medallas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Summary */}
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
            <p className="text-2xl font-bold mt-2">{tierCounts[tier.id as keyof typeof tierCounts]}</p>
            <p className="text-xs text-zinc-500">{tier.name}</p>
          </button>
        ))}
      </div>

      {/* Badges Section */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">🏅 Mis Medallas ({userBadges.length})</h2>
          
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
              Todas
            </button>
            {badgesByCategory.map(cat => (
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
            <p className="mt-4">No hay medallas con estos filtros</p>
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
      {filterCategory === 'all' && filterTier === 'all' && (
        <div className="space-y-6">
          {badgesByCategory.map(category => (
            <div key={category.id} className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.name}
                <span className="text-sm font-normal text-zinc-500">
                  ({category.badges.length} medallas)
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
                      src={`https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${badge.id}.svg`}
                      alt={badge.name}
                      className="w-8 h-8"
                    />
                    <span className="text-sm">{badge.name}</span>
                    <span className="text-xs">
                      {getTierEmoji(badge.tier)}
                    </span>
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

function BadgeCard({ badge }: Readonly<{ badge: ReturnType<typeof getBadgeById> }>) {
  if (!badge) return null;

  const tierColors = {
    gold: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30',
    silver: 'from-zinc-400/20 to-zinc-600/20 border-zinc-400/30',
    bronze: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
  };

  return (
    <div
      className={`rounded-xl p-4 border bg-linear-to-br ${tierColors[badge.tier]} backdrop-blur-lg hover:scale-105 transition-transform cursor-pointer`}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={`https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${badge.id}.svg`}
          alt={badge.name}
          className="w-16 h-16 mb-3"
        />
        <h4 className="font-medium text-sm">{badge.name}</h4>
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{badge.description}</p>
        <div className="mt-2 text-xs">
          {getTierLabel(badge.tier)}
        </div>
      </div>
    </div>
  );
}
