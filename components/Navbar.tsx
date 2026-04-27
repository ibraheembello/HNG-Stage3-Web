'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Search, UserCircle, LogOut, Plus, Sparkles } from 'lucide-react';
import { useUser } from '@/lib/useUser';
import { apiFetch } from '@/lib/api';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profiles', label: 'Profiles', icon: Users },
  { href: '/profiles/search', label: 'Search', icon: Search },
  { href: '/account', label: 'Account', icon: UserCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, mutate } = useUser();

  const onLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    await mutate(undefined, { revalidate: false });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-semibold">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-700/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Insighta Labs+</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  active ? 'text-white' : 'text-ink-300 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <Link
              href="/profiles/new"
              className="ml-1 btn-primary text-sm hidden sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New
            </Link>
          )}

          <button onClick={onLogout} className="btn-ghost text-sm" title="Sign out">
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">Sign out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
