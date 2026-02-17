'use client';

import { useState, useEffect } from 'react';
import { formatTimeAgo, type KudoDisplay } from '@/lib/constants';

export default function FeedPage() {
  const [kudos, setKudos] = useState<KudoDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [kudoMessage, setKudoMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [kudoStatus, setKudoStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch kudos feed from API
  useEffect(() => {
    fetchKudos();
  }, []);

  const fetchKudos = () => {
    fetch('/api/kudos?limit=50')
      .then(res => res.json())
      .then(data => {
        setKudos(data.kudos ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSendKudo = async () => {
    if (!selectedUser || !kudoMessage.trim()) return;
    setIsSending(true);
    setKudoStatus(null);

    try {
      const res = await fetch('/api/kudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUsername: selectedUser.trim(),
          message: kudoMessage.trim(),
          isPublic: true,
        }),
      });

      if (res.ok) {
        setKudoStatus({ type: 'success', text: `Kudo sent to ${selectedUser}!` });
        setKudoMessage('');
        setSelectedUser('');
        // Refresh feed to show new kudo
        fetchKudos();
      } else {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }));
        setKudoStatus({ type: 'error', text: data.error || 'Failed to send kudo' });
      }
    } catch {
      setKudoStatus({ type: 'error', text: 'Network error — please try again' });
    } finally {
      setIsSending(false);
      setTimeout(() => setKudoStatus(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Activity</h1>
        <p className="text-zinc-500 mt-1">Team recognition and achievement feed</p>
      </div>

      {/* Send Kudo Card */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          💜 Send a Kudo
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="kudo-recipient" className="text-sm text-zinc-500 mb-1 block">Username to recognize</label>
            <input
              id="kudo-recipient"
              type="text"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="e.g. jeremy-sud"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none"
            />
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
            disabled={!selectedUser || !kudoMessage.trim() || isSending}
            className="px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? '⏳ Sending...' : '💜 Send Kudo'}
          </button>
          {kudoStatus && (
            <p className={`text-sm mt-2 ${kudoStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {kudoStatus.type === 'success' ? '✅' : '❌'} {kudoStatus.text}
            </p>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      {loading ? (
        <div className="glass-panel rounded-2xl p-8 animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      ) : kudos.length === 0 ? (
        <div className="glass-panel rounded-2xl text-center py-12 text-zinc-500">
          <span className="text-4xl">📭</span>
          <p className="mt-4">No activity yet</p>
          <p className="text-sm">Be the first to send a kudo!</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl divide-y divide-white/5">
          {kudos.map(kudo => (
            <KudoCard key={kudo.id} kudo={kudo} />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {!loading && kudos.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-xl p-4 text-center">
            <span className="text-3xl">💜</span>
            <p className="text-2xl font-bold mt-2">{kudos.length}</p>
            <p className="text-xs text-zinc-500">Kudos in feed</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <span className="text-3xl">👥</span>
            <p className="text-2xl font-bold mt-2">
              {new Set(kudos.map(k => k.from.id)).size}
            </p>
            <p className="text-xs text-zinc-500">Active recognizers</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Displays a single kudo card in the feed
 */
function KudoCard({ kudo }: Readonly<{ kudo: KudoDisplay }>) {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-600/10">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl shrink-0">
          💜
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-bold">{kudo.from.name ?? kudo.from.username}</span>
            <span className="text-zinc-500"> recognized </span>
            <span className="font-bold">{kudo.to.name ?? kudo.to.username}</span>
          </p>
          {kudo.message && (
            <div className="mt-3 p-3 rounded-lg bg-white/5 border-l-2 border-purple-500">
              <p className="text-sm text-zinc-300 italic">&quot;{kudo.message}&quot;</p>
            </div>
          )}
          {kudo.category && (
            <span className="inline-block mt-2 px-2 py-1 rounded-full bg-white/5 text-xs text-zinc-400">
              {kudo.category.emoji} {kudo.category.name}
            </span>
          )}
          <p className="text-xs text-zinc-600 mt-3">
            {formatTimeAgo(kudo.createdAt)}
          </p>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
          {(kudo.from.name ?? kudo.from.username)?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
    </div>
  );
}
