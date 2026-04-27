'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe2, User2, Cake } from 'lucide-react';
import type { Profile } from '@/lib/types';

const genderColor = (g: string) =>
  g === 'male'
    ? 'text-sky-300 bg-sky-500/10 border-sky-500/30'
    : 'text-pink-300 bg-pink-500/10 border-pink-500/30';

export function ProfileCard({ profile, index = 0 }: { profile: Profile; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={`/profiles/${profile.id}`}
        className="card hover:border-accent-500/30 hover:shadow-2xl hover:shadow-accent-700/10 group block h-full"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-white group-hover:text-accent-500 transition-colors">
              {profile.name}
            </p>
            <p className="text-xs text-ink-300 mt-0.5 font-mono">
              {profile.id.slice(0, 8)}…
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-ink-500 group-hover:text-accent-500 transition-colors" />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${genderColor(profile.gender)}`}
          >
            <User2 className="h-3 w-3" />
            {profile.gender}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-ink-200">
            <Cake className="h-3 w-3" />
            {profile.age} · {profile.age_group}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-ink-200">
            <Globe2 className="h-3 w-3" />
            {profile.country_id} · {profile.country_name}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-300">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-500">Gender prob.</p>
            <p className="text-white font-mono">{(profile.gender_probability * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-500">Country prob.</p>
            <p className="text-white font-mono">{(profile.country_probability * 100).toFixed(0)}%</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
