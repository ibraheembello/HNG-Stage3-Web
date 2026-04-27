'use client';

import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe2, User2, Cake, BarChart3, Calendar } from 'lucide-react';
import { AuthGate } from '@/components/AuthGate';
import { PageShell } from '@/components/PageShell';
import { swrFetcher } from '@/lib/api';
import { LoadingScreen } from '@/components/LoadingScreen';
import type { Profile } from '@/lib/types';

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 text-ink-300 text-xs uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-2xl font-semibold text-white mt-2">{value}</p>
    </div>
  );
}

function ProfileDetailInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, error, isLoading } = useSWR<{ status: string; data: Profile } | { data: Profile }>(
    `/profiles/${id}`,
    swrFetcher
  );

  if (isLoading) return <LoadingScreen />;
  if (error || !data) {
    return (
      <div className="card text-center py-12">
        <p className="text-white font-medium">Profile not found.</p>
        <button onClick={() => router.push('/profiles')} className="btn-ghost mt-3">
          Back to profiles
        </button>
      </div>
    );
  }

  const profile: Profile = (data as any).data ?? (data as any);

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-ink-300 hover:text-white inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <p className="text-xs text-ink-300 font-mono">{profile.id}</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-white">{profile.name}</h1>
        <p className="text-ink-300 mt-2">
          {profile.gender} · {profile.age_group} · {profile.country_name}
        </p>
      </motion.section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={User2} label="Gender" value={profile.gender} />
        <Stat icon={Cake} label="Age" value={profile.age} />
        <Stat icon={BarChart3} label="Age group" value={profile.age_group} />
        <Stat icon={Globe2} label="Country" value={`${profile.country_id} · ${profile.country_name}`} />
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-xs text-ink-300 uppercase tracking-wider">Gender confidence</p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">
            {(profile.gender_probability * 100).toFixed(1)}%
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-500 to-sky-400"
              initial={{ width: 0 }}
              animate={{ width: `${profile.gender_probability * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="card">
          <p className="text-xs text-ink-300 uppercase tracking-wider">Country confidence</p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">
            {(profile.country_probability * 100).toFixed(1)}%
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-sky-400"
              initial={{ width: 0 }}
              animate={{ width: `${profile.country_probability * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            />
          </div>
        </div>
      </section>

      <div className="card">
        <div className="flex items-center gap-2 text-ink-300 text-xs uppercase tracking-wider">
          <Calendar className="h-3.5 w-3.5" />
          Created
        </div>
        <p className="text-white mt-2 font-mono text-sm">
          {new Date(profile.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function ProfileDetailPage() {
  return (
    <AuthGate>
      <PageShell>
        <ProfileDetailInner />
      </PageShell>
    </AuthGate>
  );
}
