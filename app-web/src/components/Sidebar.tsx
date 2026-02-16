'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { NotificationBell } from './NotificationBell';

/** User information for sidebar display */
interface User {
  readonly name?: string | null;
  readonly email?: string | null;
  readonly image?: string | null;
  readonly username?: string;
}

/** Props for Sidebar component */
interface SidebarProps {
  readonly user?: User | null;
  readonly badgeCount?: number;
}

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/profile', label: 'My Profile', icon: '👤' },
  { href: '/catalog', label: 'Catalog', icon: '🏅' },
  { href: '/feed', label: 'Activity', icon: '📣' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
];

export default function Sidebar({ user, badgeCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🌸</span>
          <div>
            <h1 className="text-xl font-bold text-gradient">BOOMFLOW</h1>
            <p className="text-xs text-zinc-500">Sistemas Ursol</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600/30 to-purple-600/30 text-white border border-white/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Avatar'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {(user.name || user.username || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.username || user.name}
                </p>
                <p className="text-xs text-zinc-500">{badgeCount} badges</p>
              </div>
              <NotificationBell />
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <span>🚪</span> Sign Out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <span>🔐</span> Sign In
          </Link>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-zinc-600">
        BOOMFLOW v0.1.0
      </div>
    </aside>
  );
}
