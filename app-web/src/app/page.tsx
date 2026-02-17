'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CATEGORIES, formatTimeAgo,
  type KudoDisplay,
} from '@/lib/constants';

/**
 * Maps leaderboard position to medal emoji
 * @param index - 0-based position index
 * @returns Medal emoji for position
 */
function getPositionEmoji(index: number): string {
  const positions: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };
  return positions[index] ?? '🏅';
}

interface LeaderboardUser {
  rank: number;
  user: { id: string; name: string | null; username: string; image: string | null };
  count: number;
}

interface ApiBadge {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  description: string;
  category: string;
  tier: string;
}

interface DashboardData {
  leaderboard: LeaderboardUser[];
  recentKudos: KudoDisplay[];
  badges: ApiBadge[];
  loading: boolean;
}

export default function Home() {
  const [data, setData] = useState<DashboardData>({
    leaderboard: [],
    recentKudos: [],
    badges: [],
    loading: true,
  });

  useEffect(() => {
    // Fetch all dashboard data in parallel
    Promise.allSettled([
      fetch('/api/leaderboard?type=kudos_received&limit=3').then(r => r.json()),
      fetch('/api/kudos?limit=5').then(r => r.json()),
      fetch('/api/badges').then(r => r.json()),
    ]).then(([leaderboardResult, kudosResult, badgesResult]) => {
      setData({
        leaderboard: leaderboardResult.status === 'fulfilled' ? leaderboardResult.value.leaderboard ?? [] : [],
        recentKudos: kudosResult.status === 'fulfilled' ? kudosResult.value.kudos ?? [] : [],
        badges: badgesResult.status === 'fulfilled' ? badgesResult.value.badges ?? [] : [],
        loading: false,
      });
    });
  }, []);

  if (data.loading) return <DashboardSkeleton />;

  // Build stats from real data
  const totalBadges = data.badges.length;
  const badgesByCategory = CATEGORIES.map(cat => ({
    ...cat,
    count: data.badges.filter(b => b.category === cat.id).length,
  })).filter(c => c.count > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Welcome to BOOMFLOW</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon="🏅"
          label="Total Badges"
          value={totalBadges}
          subtext="available in catalog"
          color="blue"
        />
        <StatCard
          icon="💜"
          label="Recent Kudos"
          value={data.recentKudos.length}
          subtext="in the feed"
          color="purple"
        />
        <StatCard
          icon="🏆"
          label="Top Recognizers"
          value={data.leaderboard.length}
          subtext="ranked users"
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Link href="/feed" className="text-sm text-blue-400 hover:text-blue-300">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentKudos.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No recent activity</p>
            ) : (
              data.recentKudos.map((kudo) => (
                <ActivityItem key={kudo.id} kudo={kudo} />
              ))
            )}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">🏆 Top Kudos</h2>
            <Link href="/leaderboard" className="text-sm text-blue-400 hover:text-blue-300">
              View ranking →
            </Link>
          </div>
          <div className="space-y-4">
            {data.leaderboard.map((entry) => (
              <div key={entry.user.id} className="flex items-center gap-3">
                <span className="text-2xl">
                  {getPositionEmoji(entry.rank - 1)}
                </span>
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {(entry.user.name ?? entry.user.username)[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.user.name ?? entry.user.username}</p>
                  <p className="text-sm text-zinc-500">@{entry.user.username}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-400">{entry.count}</p>
                  <p className="text-xs text-zinc-500">kudos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Badge Categories</h2>
          <Link href="/catalog" className="text-sm text-blue-400 hover:text-blue-300">
            View catalog →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badgesByCategory.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="font-medium text-sm">{cat.name}</span>
              <span className="text-xs text-zinc-500">{cat.count} badges</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-10 bg-white/10 rounded w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white/10 rounded-2xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-white/10 rounded-2xl"></div>
        <div className="h-64 bg-white/10 rounded-2xl"></div>
      </div>
    </div>
  );
}

/** Props for StatCard component */
interface StatCardProps {
  readonly icon: string;
  readonly label: string;
  readonly value: number;
  readonly subtext: string;
  readonly color: string;
}

/**
 * Displays a statistic card with icon and gradient background
 */
function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
    green: 'from-green-600/20 to-green-900/20 border-green-500/30',
    zinc: 'from-zinc-600/20 to-zinc-900/20 border-zinc-500/30',
  };

  return (
    <div className={`rounded-2xl p-6 bg-linear-to-br ${colorClasses[color]} border backdrop-blur-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{subtext}</p>
    </div>
  );
}

/**
 * Displays a single activity feed item (kudo)
 */
function ActivityItem({ kudo }: Readonly<{ kudo: KudoDisplay }>) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
      <span className="text-xl mt-1">💜</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm">
          <span className="font-medium">{kudo.from.name ?? kudo.from.username}</span>
          <span className="text-zinc-500"> sent a kudo to </span>
          <span className="font-medium">{kudo.to.name ?? kudo.to.username}</span>
          {kudo.message && (
            <p className="text-sm text-zinc-400 mt-1 italic">&quot;{kudo.message}&quot;</p>
          )}
        </div>
      </div>
      <span className="text-xs text-zinc-600 whitespace-nowrap">
        {formatTimeAgo(kudo.createdAt)}
      </span>
    </div>
  );
}
