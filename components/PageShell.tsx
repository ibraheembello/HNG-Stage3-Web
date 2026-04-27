'use client';

import { motion } from 'framer-motion';
import { Navbar } from './Navbar';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-ink-500">
        Insighta Labs+ · Profile Intelligence Platform
      </footer>
    </div>
  );
}
