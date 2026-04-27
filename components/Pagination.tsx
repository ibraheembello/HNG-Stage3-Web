'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <p className="text-ink-300">
        Page <span className="text-white font-medium">{page}</span> of{' '}
        <span className="text-white font-medium">{Math.max(totalPages, 1)}</span> · {total} total
      </p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
