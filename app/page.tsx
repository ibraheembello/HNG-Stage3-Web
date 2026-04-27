'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, ShieldCheck, Cpu, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useUser } from '@/lib/useUser';
import { apiFetch } from '@/lib/api';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    body: 'GitHub OAuth + PKCE, http-only cookies, CSRF, role-based access on every endpoint.',
  },
  {
    icon: Cpu,
    title: 'Natural-language queries',
    body: 'Ask in plain English — "young males from Nigeria" — get filtered results instantly.',
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV export',
    body: 'Export the entire result set with applied filters in one click. Built for analysts.',
  },
];

export default function Landing() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  const onSignIn = async () => {
    try {
      setSigning(true);
      const resp = await apiFetch<{ data: { authorize_url: string } }>('/auth/github', {
        method: 'POST',
        body: JSON.stringify({
          client_type: 'web',
          redirect_uri: `${window.location.origin}/dashboard`,
        }),
      });
      window.location.href = resp.data.authorize_url;
    } catch (e: any) {
      setSigning(false);
      alert(e?.message || 'Failed to start sign-in');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-700/30">
            <Sparkles className="h-4 w-4" />
          </span>
          Insighta Labs+
        </div>
        <a
          href="https://github.com/ibraheembello/HNG-Stage3-Backend"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-sm"
        >
          <Github className="h-4 w-4" />
          Source
        </a>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent-500/10 text-accent-500 border border-accent-500/30">
            <Sparkles className="h-3 w-3" /> HNG Stage 3 · Profile Intelligence
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Profile intelligence,{' '}
            <span className="bg-gradient-to-br from-accent-500 to-sky-400 bg-clip-text text-transparent">
              securely accessible
            </span>{' '}
            from anywhere.
          </h1>
          <p className="mt-5 text-lg text-ink-200 max-w-2xl">
            A multi-interface platform for analysts and admins. CLI, web, and API — same data, same
            permissions, same security model.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onSignIn} disabled={signing} className="btn-primary text-base">
              <Github className="h-5 w-5" />
              {signing ? 'Redirecting…' : 'Sign in with GitHub'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://github.com/ibraheembello/HNG-Stage3-CLI"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost text-base"
            >
              <Cpu className="h-4 w-4" />
              Or use the CLI
            </a>
          </div>
        </motion.div>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="card hover:border-accent-500/30"
            >
              <div className="grid place-items-center h-10 w-10 rounded-lg bg-accent-500/10 border border-accent-500/30 text-accent-500 mb-3">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-white font-semibold">{f.title}</h3>
              <p className="text-sm text-ink-300 mt-1.5">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-ink-500">
        Insighta Labs+ · Built for HNG Stage 3
      </footer>
    </div>
  );
}
