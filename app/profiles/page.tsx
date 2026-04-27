'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { AuthGate } from '@/components/AuthGate';
import { PageShell } from '@/components/PageShell';
import { ProfileCard } from '@/components/ProfileCard';
import { ProfileFilters, emptyFilters, FilterState } from '@/components/ProfileFilters';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { swrFetcher } from '@/lib/api';
import type { PaginatedEnvelope, Profile } from '@/lib/types';

function ProfilesInner() {
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters });
  const [page, setPage] = useState(1);
  const limit = 12;

  const queryString = useMemo(() => {
    const usp = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) usp.set(k, v);
    });
    usp.set('page', String(page));
    usp.set('limit', String(limit));
    return usp.toString();
  }, [filters, page]);

  const { data, isLoading } = useSWR<PaginatedEnvelope<Profile>>(
    `/profiles?${queryString}`,
    swrFetcher
  );

  const onExport = async () => {
    const usp = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && usp.set(k, v));
    const url = `/api/v1/profiles/export?${usp.toString()}`;
    const resp = await fetch(url, {
      credentials: 'include',
      headers: { 'X-API-Version': '1' },
    });
    if (!resp.ok) {
      alert('Export failed');
      return;
    }
    const blob = await resp.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `profiles-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const items = data?.data ?? [];

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <ProfileFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        onReset={() => {
          setFilters({ ...emptyFilters });
          setPage(1);
        }}
      />

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Profiles</h1>
            <p className="text-sm text-ink-300">
              {data ? `${data.total} matching` : 'Loading…'}
            </p>
          </div>
          <button onClick={onExport} className="btn-ghost text-sm">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {isLoading && (
          <div className="card flex items-center gap-3 text-ink-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading profiles…
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <EmptyState title="No profiles match these filters" hint="Try clearing some filters." />
        )}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={queryString}
            className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {items.map((p, i) => (
              <ProfileCard key={p.id} profile={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {data && data.total > 0 && (
          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            onPage={setPage}
          />
        )}
      </section>
    </div>
  );
}

export default function ProfilesListPage() {
  return (
    <AuthGate>
      <PageShell>
        <ProfilesInner />
      </PageShell>
    </AuthGate>
  );
}
