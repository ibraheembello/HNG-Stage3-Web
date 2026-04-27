'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { AuthGate } from '@/components/AuthGate';
import { PageShell } from '@/components/PageShell';
import { ProfileCard } from '@/components/ProfileCard';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { swrFetcher } from '@/lib/api';
import type { PaginatedEnvelope, Profile } from '@/lib/types';

const examples = [
  'young males from nigeria',
  'female teenagers from kenya',
  'adults above 30',
  'seniors from united states',
  'children from ghana',
];

function SearchInner() {
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const swrKey = query
    ? `/profiles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    : null;

  const { data, isLoading } = useSWR<PaginatedEnvelope<Profile>>(swrKey, swrFetcher);

  const submit = (q: string) => {
    setQuery(q.trim());
    setPage(1);
  };

  const items = data?.data ?? [];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-xs text-accent-500 font-medium">
            <Sparkles className="h-3 w-3" />
            Natural Language Search
          </span>
          <h1 className="mt-2 text-2xl font-bold text-white">Ask in plain English</h1>
          <p className="text-sm text-ink-300 mt-1">
            Try queries like &ldquo;young males from nigeria&rdquo; or &ldquo;adults above 30&rdquo;.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(draft);
            }}
            className="mt-5 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
              <input
                className="input pl-9 text-base"
                placeholder="What are you looking for?"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary justify-center">
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setDraft(ex);
                  submit(ex);
                }}
                className="text-xs text-ink-300 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {query && (
        <section>
          <p className="text-sm text-ink-300 mb-3">
            Results for{' '}
            <span className="font-mono text-white px-2 py-0.5 bg-white/5 rounded">{query}</span>
            {data && ` · ${data.total} match${data.total === 1 ? '' : 'es'}`}
          </p>

          {isLoading && (
            <div className="card flex items-center gap-3 text-ink-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          )}

          {!isLoading && data && items.length === 0 && (
            <EmptyState
              title="No matches"
              hint="The natural-language parser interprets common terms but is intentionally conservative."
            />
          )}

          <AnimatePresence mode="popLayout">
            <motion.div
              key={swrKey}
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
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AuthGate>
      <PageShell>
        <SearchInner />
      </PageShell>
    </AuthGate>
  );
}
