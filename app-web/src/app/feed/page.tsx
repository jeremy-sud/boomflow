'use client';

import { useState } from 'react';
import { ACTIVITY_FEED, USERS, getBadgeById, getUserById, formatTimeAgo, Activity } from '@/lib/data';

// Current user (mock)
const CURRENT_USER = USERS.find(u => u.username === 'jeremy-sud') ?? USERS[0];

type FilterType = 'all' | 'badges' | 'kudos' | 'milestones';

export default function FeedPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [kudoMessage, setKudoMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const filteredActivity = ACTIVITY_FEED.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'badges') return activity.type === 'badge_earned';
    if (filter === 'kudos') return activity.type === 'kudo_sent' || activity.type === 'kudo_received';
    if (filter === 'milestones') return activity.type === 'milestone';
    return true;
  });

  const handleSendKudo = () => {
    if (!selectedUser || !kudoMessage.trim()) return;
    // In production, this would call an API
    alert(`Kudo sent to ${selectedUser}!\n\n"${kudoMessage}"`);
    setKudoMessage('');
    setSelectedUser('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Actividad</h1>
        <p className="text-zinc-500 mt-1">Team recognition and achievement feed</p>
      </div>

      {/* Send Kudo Card */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          💜 Send a Kudo
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="kudo-recipient" className="text-sm text-zinc-500 mb-1 block">Who do you want to recognize?</label>
            <select
              id="kudo-recipient"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a teammate</option>
              {USERS.filter(u => u.id !== CURRENT_USER.id).map(user => (
                <option key={user.id} value={user.username}>
                  {user.displayName} (@{user.username})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="kudo-message" className="text-sm text-zinc-500 mb-1 block">Recognition message</label>
            <textarea
              id="kudo-message"
              value={kudoMessage}
              onChange={(e) => setKudoMessage(e.target.value)}
              placeholder="Write why you want to recognize this person..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none resize-none h-24"
            />
          </div>
          <button
            onClick={handleSendKudo}
            disabled={!selectedUser || !kudoMessage.trim()}
            className="px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💜 Send Kudo
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All', icon: '📋' },
          { id: 'badges', label: 'Badges', icon: '🏅' },
          { id: 'kudos', label: 'Kudos', icon: '💜' },
          { id: 'milestones', label: 'Milestones', icon: '🎉' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as FilterType)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              filter === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="glass-panel rounded-2xl divide-y divide-white/5">
        {filteredActivity.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <span className="text-4xl">📭</span>
            <p className="mt-4">No activity with this filter</p>
          </div>
        ) : (
          filteredActivity.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 text-center">
          <span className="text-3xl">🏅</span>
          <p className="text-2xl font-bold mt-2">
            {ACTIVITY_FEED.filter(a => a.type === 'badge_earned').length}
          </p>
          <p className="text-xs text-zinc-500">Badges awarded</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <span className="text-3xl">💜</span>
          <p className="text-2xl font-bold mt-2">
            {ACTIVITY_FEED.filter(a => a.type === 'kudo_sent').length}
          </p>
          <p className="text-xs text-zinc-500">Kudos sent</p>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <span className="text-3xl">🎉</span>
          <p className="text-2xl font-bold mt-2">
            {ACTIVITY_FEED.filter(a => a.type === 'milestone').length}
          </p>
          <p className="text-xs text-zinc-500">Milestones reached</p>
        </div>
      </div>
    </div>
  );
}

/** Props for ActivityCard component */
interface ActivityCardProps {
  readonly activity: Activity;
}

/**
 * Displays a single activity card in the feed
 */
function ActivityCard({ activity }: ActivityCardProps) {
  const user = getUserById(activity.userId);
  const targetUser = activity.targetUserId ? getUserById(activity.targetUserId) : null;
  const badge = activity.badgeId ? getBadgeById(activity.badgeId) : null;

  let icon: string;
  let bgColor: string;

  switch (activity.type) {
    case 'badge_earned':
      icon = '🏅';
      bgColor = 'from-yellow-500/10 to-amber-600/10';
      break;
    case 'kudo_sent':
    case 'kudo_received':
      icon = '💜';
      bgColor = 'from-purple-500/10 to-pink-600/10';
      break;
    case 'milestone':
      icon = '🎉';
      bgColor = 'from-green-500/10 to-emerald-600/10';
      break;
    default:
      icon = '📌';
      bgColor = 'from-zinc-500/10 to-zinc-600/10';
  }

  return (
    <div className={`p-6 bg-gradient-to-r ${bgColor}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activity.type === 'badge_earned' && badge && (
            <>
              <p className="text-sm">
                <span className="font-bold">{user?.displayName}</span>
                <span className="text-zinc-500"> earned the badge </span>
                <span className="font-bold text-yellow-400">{badge.name}</span>
              </p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={`https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-${badge.id}.svg`}
                  alt={badge.name}
                  className="w-12 h-12"
                />
                <div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-xs text-zinc-500">{badge.description}</p>
                </div>
              </div>
            </>
          )}

          {activity.type === 'kudo_sent' && (
            <>
              <p className="text-sm">
                <span className="font-bold">{user?.displayName}</span>
                <span className="text-zinc-500"> recognized </span>
                <span className="font-bold">{targetUser?.displayName}</span>
              </p>
              {activity.message && (
                <div className="mt-3 p-3 rounded-lg bg-white/5 border-l-2 border-purple-500">
                  <p className="text-sm text-zinc-300 italic">"{activity.message}"</p>
                </div>
              )}
            </>
          )}

          {activity.type === 'milestone' && (
            <p className="text-sm text-zinc-300">{activity.message}</p>
          )}

          <p className="text-xs text-zinc-600 mt-3">
            {formatTimeAgo(activity.timestamp)}
          </p>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
          {user?.displayName?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
    </div>
  );
}
