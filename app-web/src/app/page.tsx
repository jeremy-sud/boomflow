'use client';

import { USERS, BADGE_CATALOG, ACTIVITY_FEED, CATEGORIES, getBadgeById, getUserById, formatTimeAgo, getBadgeStats } from '@/lib/data';
import Link from 'next/link';

// Current user (mock - in production this would come from auth)
const CURRENT_USER = USERS.find(u => u.username === 'jeremy-sud')!;

export default function Home() {
  const stats = getBadgeStats();
  const recentActivity = ACTIVITY_FEED.slice(0, 5);
  const topUsers = [...USERS].sort((a, b) => b.kudosReceived - a.kudosReceived).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Bienvenido de vuelta, {CURRENT_USER.displayName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500">Racha actual</p>
          <p className="text-2xl font-bold text-orange-500">🔥 {CURRENT_USER.streak} días</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon="🏅"
          label="Mis Medallas"
          value={CURRENT_USER.badges.length}
          subtext={`de ${stats.total} disponibles`}
          color="blue"
        />
        <StatCard
          icon="💜"
          label="Kudos Recibidos"
          value={CURRENT_USER.kudosReceived}
          subtext="reconocimientos"
          color="purple"
        />
        <StatCard
          icon="💚"
          label="Kudos Enviados"
          value={CURRENT_USER.kudosGiven}
          subtext="reconocimientos"
          color="green"
        />
        <StatCard
          icon="📊"
          label="Total Sistema"
          value={stats.total}
          subtext="medallas disponibles"
          color="zinc"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Actividad Reciente</h2>
            <Link href="/feed" className="text-sm text-blue-400 hover:text-blue-300">
              Ver todo →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">🏆 Top Kudos</h2>
            <Link href="/leaderboard" className="text-sm text-blue-400 hover:text-blue-300">
              Ver ranking →
            </Link>
          </div>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.displayName[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.displayName}</p>
                  <p className="text-sm text-zinc-500">{user.badges.length} medallas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-400">{user.kudosReceived}</p>
                  <p className="text-xs text-zinc-500">kudos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Badges Preview */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Mis Medallas</h2>
          <Link href="/profile" className="text-sm text-blue-400 hover:text-blue-300">
            Ver perfil →
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {CURRENT_USER.badges.slice(0, 8).map((badgeId) => {
            const badge = getBadgeById(badgeId);
            if (!badge) return null;
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                title={badge.description}
              >
                <img
                  src={`https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${badge.id}.svg`}
                  alt={badge.name}
                  className="w-12 h-12"
                />
                <span className="text-xs mt-2 text-zinc-400">{badge.name}</span>
              </div>
            );
          })}
          {CURRENT_USER.badges.length > 8 && (
            <Link
              href="/profile"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors w-20 h-20"
            >
              <span className="text-2xl">+{CURRENT_USER.badges.length - 8}</span>
              <span className="text-xs text-zinc-500">más</span>
            </Link>
          )}
        </div>
      </div>

      {/* Categories Overview */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Categorías de Medallas</h2>
          <Link href="/catalog" className="text-sm text-blue-400 hover:text-blue-300">
            Ver catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.byCategory.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="font-medium text-sm">{cat.name}</span>
              <span className="text-xs text-zinc-500">{cat.count} medallas</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color }: {
  icon: string;
  label: string;
  value: number;
  subtext: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
    green: 'from-green-600/20 to-green-900/20 border-green-500/30',
    zinc: 'from-zinc-600/20 to-zinc-900/20 border-zinc-500/30',
  };

  return (
    <div className={`rounded-2xl p-6 bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{subtext}</p>
    </div>
  );
}

function ActivityItem({ activity }: { activity: typeof ACTIVITY_FEED[0] }) {
  const user = getUserById(activity.userId);
  const targetUser = activity.targetUserId ? getUserById(activity.targetUserId) : null;
  const badge = activity.badgeId ? getBadgeById(activity.badgeId) : null;

  let content: React.ReactNode;
  let icon: string;

  switch (activity.type) {
    case 'badge_earned':
      icon = '🏅';
      content = (
        <>
          <span className="font-medium">{user?.displayName}</span>
          <span className="text-zinc-500"> obtuvo la medalla </span>
          <span className="font-medium text-yellow-400">{badge?.name}</span>
        </>
      );
      break;
    case 'kudo_sent':
      icon = '💜';
      content = (
        <>
          <span className="font-medium">{user?.displayName}</span>
          <span className="text-zinc-500"> envió un kudo a </span>
          <span className="font-medium">{targetUser?.displayName}</span>
          {activity.message && (
            <p className="text-sm text-zinc-400 mt-1 italic">"{activity.message}"</p>
          )}
        </>
      );
      break;
    case 'milestone':
      icon = '🎉';
      content = <span className="text-zinc-300">{activity.message}</span>;
      break;
    default:
      icon = '📌';
      content = <span className="text-zinc-500">Actividad</span>;
  }

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
      <span className="text-xl mt-1">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm">{content}</div>
      </div>
      <span className="text-xs text-zinc-600 whitespace-nowrap">
        {formatTimeAgo(activity.timestamp)}
      </span>
    </div>
  );
}
