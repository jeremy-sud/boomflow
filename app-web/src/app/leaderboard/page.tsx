'use client';

import { useState, useEffect } from 'react';

type SortBy = 'kudos_received' | 'badges' | 'kudos_sent';

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  count: number;
}

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortBy>('kudos_received');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/leaderboard?type=${sortBy}&limit=50`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setEntries(data.leaderboard ?? []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [sortBy]);

  // Calculate totals from current entries
  const totalCount = entries.reduce((sum, e) => sum + e.count, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Leaderboard</h1>
        <p className="text-zinc-500 mt-1">Top collaborators</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-6 text-center">
          <span className="text-4xl">💜</span>
          <p className="text-3xl font-bold mt-2 text-purple-400">{totalCount}</p>
          <p className="text-sm text-zinc-500">
            {sortBy === 'kudos_received' ? 'Total Kudos Received' :
             sortBy === 'kudos_sent' ? 'Total Kudos Sent' : 'Total Badges'}
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6 text-center">
          <span className="text-4xl">🏅</span>
          <p className="text-3xl font-bold mt-2 text-yellow-400">{entries.length}</p>
          <p className="text-sm text-zinc-500">Ranked members</p>
        </div>
        <div className="glass-panel rounded-xl p-6 text-center">
          <span className="text-4xl">👥</span>
          <p className="text-3xl font-bold mt-2 text-blue-400">{entries.length}</p>
          <p className="text-sm text-zinc-500">Active members</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        {[
          { id: 'kudos_received' as SortBy, label: 'Kudos received', icon: '💜' },
          { id: 'badges' as SortBy, label: 'Badges', icon: '🏅' },
          { id: 'kudos_sent' as SortBy, label: 'Kudos sent', icon: '💚' },
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
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading…</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load leaderboard: {error}</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">No data yet. Start giving kudos!</div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="p-6 bg-gradient-to-b from-yellow-500/10 to-transparent">
              <div className="flex justify-center items-end gap-4">
                {entries[1] && <PodiumCard entry={entries[1]} position={2} />}
                {entries[0] && <PodiumCard entry={entries[0]} position={1} />}
                {entries[2] && <PodiumCard entry={entries[2]} position={3} />}
              </div>
            </div>

            {/* Rest of Rankings */}
            <div className="divide-y divide-white/5">
              {entries.slice(3).map(entry => (
                <RankingRow key={entry.user.id} entry={entry} />
              ))}
            </div>

            {entries.length <= 3 && (
              <div className="p-8 text-center text-zinc-500">
                <p>Invite more collaborators to see more rankings!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PodiumCard({ entry, position }: {
  entry: LeaderboardEntry;
  position: number;
}) {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const sizes = { 1: 'w-20 h-20 text-2xl', 2: 'w-16 h-16 text-xl', 3: 'w-16 h-16 text-xl' };

  const displayName = entry.user.name || entry.user.username;

  return (
    <div className={`flex flex-col items-center ${position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'}`}>
      <span className="text-3xl mb-2">{medals[position as keyof typeof medals]}</span>
      {entry.user.image ? (
        <img
          src={entry.user.image}
          alt={displayName}
          className={`rounded-full object-cover ${sizes[position as keyof typeof sizes]}`}
        />
      ) : (
        <div className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${sizes[position as keyof typeof sizes]}`}>
          {displayName[0].toUpperCase()}
        </div>
      )}
      <p className="font-bold mt-2">{displayName}</p>
      <p className="text-sm text-zinc-500">@{entry.user.username}</p>
      <div className={`w-24 ${heights[position as keyof typeof heights]} bg-gradient-to-t from-yellow-600/30 to-yellow-400/30 rounded-t-lg mt-4 flex items-end justify-center pb-2`}>
        <div className="text-center">
          <p className="text-xl font-bold">{entry.count}</p>
        </div>
      </div>
    </div>
  );
}

function RankingRow({ entry }: {
  entry: LeaderboardEntry;
}) {
  const displayName = entry.user.name || entry.user.username;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
      <span className="w-8 text-center text-zinc-500 font-mono">#{entry.rank}</span>
      {entry.user.image ? (
        <img
          src={entry.user.image}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          {displayName[0].toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <p className="font-medium">{displayName}</p>
        <p className="text-sm text-zinc-500">@{entry.user.username}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">{entry.count}</p>
      </div>
    </div>
  );
}
