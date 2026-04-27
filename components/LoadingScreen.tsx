'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="min-h-screen grid place-items-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative h-12 w-12">
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-500 to-accent-700"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="absolute inset-1.5 rounded-full bg-ink-900" />
        </div>
        <p className="text-sm text-ink-300">Loading…</p>
      </motion.div>
    </div>
  );
}
