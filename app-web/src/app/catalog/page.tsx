'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BADGE_CATALOG, CATEGORIES, TIERS, USERS, Badge } from '@/lib/data';

// Current user (mock)
const CURRENT_USER = USERS.find(u => u.username === 'jeremy-sud') ?? USERS[0];

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-10 bg-white/10 rounded w-64"></div>
      <div className="h-16 bg-white/10 rounded-2xl"></div>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyOwned, setShowOnlyOwned] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = useMemo(() => {
    return BADGE_CATALOG.filter(badge => {
      // Category filter
      if (filterCategory !== 'all' && badge.category !== filterCategory) return false;
      // Tier filter
      if (filterTier !== 'all' && badge.tier !== filterTier) return false;
      // Owned filter
      if (showOnlyOwned && !CURRENT_USER.badges.includes(badge.id)) return false;
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          badge.name.toLowerCase().includes(query) ||
          badge.description.toLowerCase().includes(query) ||
          badge.howToGet.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [filterCategory, filterTier, searchQuery, showOnlyOwned]);

  // Group by category for display
  const badgesByCategory = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      badges: filteredBadges.filter(b => b.category === cat.id),
    })).filter(cat => cat.badges.length > 0);
  }, [filteredBadges]);

  const stats = {
    total: BADGE_CATALOG.length,
    owned: CURRENT_USER.badges.length,
    filtered: filteredBadges.length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Badge Catalog</h1>
          <p className="text-zinc-500 mt-1">
            {stats.filtered} of {stats.total} badges • {stats.owned} earned
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="🔍 Search badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                filterCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(filterCategory === cat.id ? 'all' : cat.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
                title={cat.name}
              >
                {cat.emoji} <span className="hidden md:inline">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex gap-1">
            {TIERS.map(tier => (
              <button
                key={tier.id}
                onClick={() => setFilterTier(filterTier === tier.id ? 'all' : tier.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  filterTier === tier.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                {tier.emoji}
              </button>
            ))}
          </div>

          {/* Owned Toggle */}
          <button
            onClick={() => setShowOnlyOwned(!showOnlyOwned)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              showOnlyOwned
                ? 'bg-green-600/30 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            ✓ My badges
          </button>
        </div>
      </div>

      {/* Badge Grid */}
      {filterCategory === 'all' && !searchQuery ? (
        // Grouped by category
        <div className="space-y-8">
          {badgesByCategory.map(category => (
            <div key={category.id}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                {category.name}
                <span className="text-sm font-normal text-zinc-500">
                  ({category.badges.length})
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {category.badges.map(badge => (
                  <CatalogBadgeCard
                    key={badge.id}
                    badge={badge}
                    owned={CURRENT_USER.badges.includes(badge.id)}
                    onClick={() => setSelectedBadge(badge)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat grid when filtered
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBadges.map(badge => (
            <CatalogBadgeCard
              key={badge.id}
              badge={badge}
              owned={CURRENT_USER.badges.includes(badge.id)}
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      )}

      {filteredBadges.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg">No badges found</p>
          <p className="text-sm">Try different filters</p>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          owned={CURRENT_USER.badges.includes(selectedBadge.id)}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}

function CatalogBadgeCard({ badge, owned, onClick }: {
  badge: Badge;
  owned: boolean;
  onClick: () => void;
}) {
  const tierColors = {
    gold: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30',
    silver: 'from-zinc-400/20 to-zinc-600/20 border-zinc-400/30',
    bronze: 'from-orange-500/20 to-orange-700/20 border-orange-500/30',
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-4 border bg-gradient-to-br ${tierColors[badge.tier]} backdrop-blur-lg hover:scale-105 transition-all cursor-pointer ${
        owned ? 'ring-2 ring-green-500/50' : 'opacity-70 hover:opacity-100'
      }`}
    >
      {owned && (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">
          ✓
        </div>
      )}
      <div className="flex flex-col items-center text-center">
        <img
          src={`https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${badge.id}.svg`}
          alt={badge.name}
          className={`w-14 h-14 mb-2 ${!owned ? 'grayscale' : ''}`}
        />
        <h4 className="font-medium text-sm">{badge.name}</h4>
        <div className="mt-1 text-xs text-zinc-500">
          {badge.tier === 'gold' ? '🥇' : badge.tier === 'silver' ? '🥈' : '🥉'}
        </div>
      </div>
    </div>
  );
}

function BadgeDetailModal({ badge, owned, onClose }: {
  badge: Badge;
  owned: boolean;
  onClose: () => void;
}) {
  const category = CATEGORIES.find(c => c.id === badge.category);
  const tier = TIERS.find(t => t.id === badge.tier);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={`https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${badge.id}.svg`}
            alt={badge.name}
            className="w-24 h-24 mb-4"
          />
          <h2 className="text-2xl font-bold">{badge.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
              {category?.emoji} {category?.name}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
              {tier?.emoji} {tier?.name}
            </span>
          </div>

          <p className="mt-4 text-zinc-300">{badge.description}</p>
          
          <div className="mt-4 p-4 rounded-lg bg-white/5 w-full">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">How to earn</p>
            <p className="text-sm text-zinc-300">{badge.howToGet}</p>
          </div>

          {owned ? (
            <div className="mt-4 flex items-center gap-2 text-green-400">
              <span className="text-xl">✓</span>
              <span>You already have this badge!</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-zinc-500">
              <span className="text-xl">🔒</span>
              <span>Not yet earned</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
