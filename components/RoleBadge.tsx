import { ShieldCheck, Eye } from 'lucide-react';

export function RoleBadge({ role }: { role: 'admin' | 'analyst' }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isAdmin
          ? 'bg-accent-500/10 text-accent-500 border-accent-500/30'
          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      }`}
    >
      {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      {role}
    </span>
  );
}
