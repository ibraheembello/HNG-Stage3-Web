import { Inbox } from 'lucide-react';

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card text-center py-12">
      <div className="grid place-items-center h-12 w-12 rounded-full bg-white/5 border border-white/10 mx-auto mb-3">
        <Inbox className="h-5 w-5 text-ink-300" />
      </div>
      <p className="text-white font-medium">{title}</p>
      {hint && <p className="text-sm text-ink-300 mt-1">{hint}</p>}
    </div>
  );
}
