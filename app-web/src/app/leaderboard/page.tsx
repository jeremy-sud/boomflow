'use client';

import { useState } from 'react';
import { USERS, CATEGORIES, getUserBadges } from '@/lib/data';

type SortBy = 'kudos' | 'badges' | 'streak' | 'given';

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortBy>('kudos');

  const sortedUsers = [...USERS].sort((a, b) => {
    switch (sortBy) {
      case 'kudos':
        return b.kudosReceived - a.kudosReceived;
      case 'badges':
        return b.badges.length - a.badges.length;
      case 'streak':
        return b.streak - a.streak;
      case 'given':
        return b.kudosGiven - a.kudosGiven;
      default:
        return 0;
    }
  });

  // Calculate totals
  const totals = {
    kudos: USERS.reduce((sum, u) => sum + u.kudosReceived, 0),
    badges: USERS.reduce((sum, u) => sum + u.badges.length, 0),
    given: USERS.reduce((sum, u) => sum + u.kudosGiven, 0),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Leaderboard</h1>
        <p className="text-zinc-500 mt-1">Top collaborators at Sistemas Ursol</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-6 text-center">
          <span className="text-4xl">💜</span>
          <p className="text-3xl font-bold mt-2 text-purple-400">{totals.kudos}</p>
          <p className="text-sm text-zinc-500">Total Kudos</p>
        </div>
        <div className="glass-panel rounded-xl p-6 text-center">
          <span className="text-4xl">🏅</span>
          <p className="text-3xl font-bold mt-2 text-yellow-400">{totals.badges}</p>
          <p className="text-sm text-zinc-500">Badges awarded</p>
        </div>
        <div className="glass-panel rounded-xl p-6 text-center">
          <span className="text-4xl">👥</span>
          <p className="text-3xl font-bold mt-2 text-blue-400">{USERS.length}</p>
          <p className="text-sm text-zinc-500">Active members</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        {[
          { id: 'kudos' as SortBy, label: 'Kudos received', icon: '💜' },
          { id: 'badges' as SortBy, label: 'Badges', icon: '🏅' },
          { id: 'streak' as SortBy, label: 'Streak', icon: '🔥' },
          { id: 'given' as SortBy, label: 'Kudos given', icon: '💚' },
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              sortBy === option.id
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <span>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Top 3 Podium */}
        <div className="p-6 bg-gradient-to-b from-yellow-500/10 to-transparent">
          <div className="flex justify-center items-end gap-4">
            {/* 2nd Place */}
            {sortedUsers[1] && (
              <PodiumCard user={sortedUsers[1]} position={2} sortBy={sortBy} />
            )}
            {/* 1st Place */}
            {sortedUsers[0] && (
              <PodiumCard user={sortedUsers[0]} position={1} sortBy={sortBy} />
            )}
            {/* 3rd Place */}
            {sortedUsers[2] && (
              <PodiumCard user={sortedUsers[2]} position={3} sortBy={sortBy} />
            )}
          </div>
        </div>

        {/* Rest of Rankings */}
        <div className="divide-y divide-white/5">
          {sortedUsers.slice(3).map((user, index) => (
            <RankingRow 
              key={user.id} 
              user={user} 
              position={index + 4} 
              sortBy={sortBy}
            />
          ))}
        </div>

        {sortedUsers.length <= 3 && (
          <div className="p-8 text-center text-zinc-500">
            <p>Invite more collaborators to see more rankings!</p>
          </div>
        )}
      </div>

      {/* Category Leaders */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">🏆 Leaders by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.slice(0, 6).map(category => {
            // Find user with most badges in this category
            const leader = [...USERS].sort((a, b) => {
              const aBadges = getUserBadges(a).filter(badge => badge.category === category.id).length;
              const bBadges = getUserBadges(b).filter(badge => badge.category === category.id).length;
              return bBadges - aBadges;
            })[0];

            const leaderBadgeCount = leader ? getUserBadges(leader).filter(b => b.category === category.id).length : 0;

            return (
              <div key={category.id} className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{category.emoji}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                {leader && leaderBadgeCount > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {leader.displayName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{leader.displayName}</p>
                      <p className="text-xs text-zinc-500">{leaderBadgeCount} badges</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No leader yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ user, position, sortBy }: {
  user: typeof USERS[0];
  position: number;
  sortBy: SortBy;
}) {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const sizes = { 1: 'w-20 h-20 text-2xl', 2: 'w-16 h-16 text-xl', 3: 'w-16 h-16 text-xl' };

  const getValue = () => {
    switch (sortBy) {
      case 'kudos': return user.kudosReceived;
      case 'badges': return user.badges.length;
      case 'streak': return user.streak;
      case 'given': return user.kudosGiven;
    }
  };

  const getLabel = () => {
    switch (sortBy) {
      case 'kudos': return 'kudos';
      case 'badges': return 'badges';
      case 'streak': return 'days';
      case 'given': return 'given';
    }
  };

  return (
    <div className={`flex flex-col items-center ${position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'}`}>
      <span className="text-3xl mb-2">{medals[position as keyof typeof medals]}</span>
      <div className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${sizes[position as keyof typeof sizes]}`}>
        {user.displayName[0].toUpperCase()}
      </div>
      <p className="font-bold mt-2">{user.displayName}</p>
      <p className="text-sm text-zinc-500">@{user.username}</p>
      <div className={`w-24 ${heights[position as keyof typeof heights]} bg-gradient-to-t from-yellow-600/30 to-yellow-400/30 rounded-t-lg mt-4 flex items-end justify-center pb-2`}>
        <div className="text-center">
          <p className="text-xl font-bold">{getValue()}</p>
          <p className="text-xs text-zinc-400">{getLabel()}</p>
        </div>
      </div>
    </div>
  );
}

function RankingRow({ user, position, sortBy }: {
  user: typeof USERS[0];
  position: number;
  sortBy: SortBy;
}) {
  const getValue = () => {
    switch (sortBy) {
      case 'kudos': return user.kudosReceived;
      case 'badges': return user.badges.length;
      case 'streak': return user.streak;
      case 'given': return user.kudosGiven;
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
      <span className="w-8 text-center text-zinc-500 font-mono">#{position}</span>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
        {user.displayName[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="font-medium">{user.displayName}</p>
        <p className="text-sm text-zinc-500">@{user.username}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">{getValue()}</p>
        <p className="text-xs text-zinc-500">{user.badges.length} badges</p>
      </div>
    </div>
  );
}
