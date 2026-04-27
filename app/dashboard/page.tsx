'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Users, ArrowUpRight, Sparkles, Globe2, FileSpreadsheet, Search } from 'lucide-react';
import { AuthGate } from '@/components/AuthGate';
import { PageShell } from '@/components/PageShell';
import { swrFetcher } from '@/lib/api';
import { useUser } from '@/lib/useUser';
import { RoleBadge } from '@/components/RoleBadge';
import { ProfileCard } from '@/components/ProfileCard';
import type { PaginatedEnvelope, Profile } from '@/lib/types';

function StatCard({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: any;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card flex items-center justify-between"
    >
      <div>
        <p className="text-xs text-ink-300 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <div className="grid place-items-center h-12 w-12 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-500">
        <Icon className="h-6 w-6" />
      </div>
    </motion.div>
  );
}

function DashboardInner() {
  const { user } = useUser();
  const { data: recent } = useSWR<PaginatedEnvelope<Profile>>(
    '/profiles?limit=6&sort_by=created_at&order=desc',
    swrFetcher
  );
  const { data: all } = useSWR<PaginatedEnvelope<Profile>>('/profiles?limit=1', swrFetcher);

  const total = all?.total ?? 0;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <p className="text-ink-300 text-sm">Welcome back,</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
            {user?.name || user?.github_username}
            {user && <RoleBadge role={user.role} />}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/profiles" className="btn-ghost">
            <Users className="h-4 w-4" />
            Browse profiles
          </Link>
          <Link href="/profiles/search" className="btn-ghost">
            <Search className="h-4 w-4" />
            NL search
          </Link>
        </div>
      </motion.section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total profiles" value={total} icon={Users} delay={0} />
        <StatCard label="Your role" value={user?.role || '—'} icon={Sparkles} delay={0.05} />
        <StatCard
          label="Quick action"
          value={user?.role === 'admin' ? 'Create' : 'Export'}
          icon={user?.role === 'admin' ? Globe2 : FileSpreadsheet}
          delay={0.1}
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent profiles</h2>
          <Link href="/profiles" className="text-sm text-accent-500 hover:text-accent-600 inline-flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(recent?.data || []).map((p, i) => (
            <ProfileCard key={p.id} profile={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate>
      <PageShell>
        <DashboardInner />
      </PageShell>
    </AuthGate>
  );
}
