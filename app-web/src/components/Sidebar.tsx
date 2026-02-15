'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/profile', label: 'Mi Perfil', icon: '👤' },
  { href: '/catalog', label: 'Catálogo', icon: '🏅' },
  { href: '/feed', label: 'Actividad', icon: '📣' },
  { href: '/leaderboard', label: 'Ranking', icon: '🏆' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🚀</span>
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
                      ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-white/20'
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
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">jeremy-sud</p>
            <p className="text-xs text-zinc-500">6 medallas</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-zinc-600">
        BOOMFLOW v2.1.0
      </div>
    </aside>
  );
}
