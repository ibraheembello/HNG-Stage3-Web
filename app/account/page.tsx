'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Github, Mail, Calendar, Sparkles } from 'lucide-react';
import { AuthGate } from '@/components/AuthGate';
import { PageShell } from '@/components/PageShell';
import { useUser } from '@/lib/useUser';
import { apiFetch } from '@/lib/api';
import { RoleBadge } from '@/components/RoleBadge';

function AccountInner() {
  const { user, mutate } = useUser();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    await mutate(undefined, { revalidate: false });
    router.push('/');
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-6"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Account</h1>

      <section className="card flex items-start gap-4">
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt={user.github_username}
            className="h-16 w-16 rounded-full border border-white/10"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-accent-500/20 grid place-items-center text-accent-500 font-bold text-xl">
            {user.github_username[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xl font-semibold text-white">{user.name || user.github_username}</p>
            <RoleBadge role={user.role} />
          </div>
          <p className="text-sm text-ink-300">@{user.github_username}</p>
          {user.email && (
            <p className="text-sm text-ink-300 inline-flex items-center gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
          )}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Github className="h-3 w-3" /> GitHub ID
          </p>
          <p className="font-mono text-white mt-1.5 text-sm break-all">{user.github_id}</p>
        </div>
        <div className="card">
          <p className="text-xs text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Role
          </p>
          <p className="text-white mt-1.5 capitalize">{user.role}</p>
        </div>
        <div className="card">
          <p className="text-xs text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> Joined
          </p>
          <p className="text-white mt-1.5 text-sm">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="card">
        <h3 className="text-white font-semibold">Sign out of all sessions</h3>
        <p className="text-sm text-ink-300 mt-1">
          Revokes the current refresh token. You can log back in with GitHub anytime.
        </p>
        <button onClick={onLogout} className="btn-primary mt-4">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </section>
    </motion.div>
  );
}

export default function AccountPage() {
  return (
    <AuthGate>
      <PageShell>
        <AccountInner />
      </PageShell>
    </AuthGate>
  );
}
