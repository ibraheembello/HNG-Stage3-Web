'use client';

import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface FilterState {
  gender: string;
  age_group: string;
  country_id: string;
  min_age: string;
  max_age: string;
  sort_by: string;
  order: string;
}

const empty: FilterState = {
  gender: '',
  age_group: '',
  country_id: '',
  min_age: '',
  max_age: '',
  sort_by: 'created_at',
  order: 'desc',
};

export const emptyFilters = empty;

export function ProfileFilters({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  const set = (k: keyof FilterState, v: string) => onChange({ ...value, [k]: v });

  const activeCount = Object.entries(value).filter(([k, v]) => {
    if (k === 'sort_by' || k === 'order') return false;
    return v !== '';
  }).length;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="card sticky top-20 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-white font-semibold">
          <Filter className="h-4 w-4 text-accent-500" />
          Filters
          {activeCount > 0 && (
            <span className="bg-accent-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-mono">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-ink-300 hover:text-white inline-flex items-center gap-1">
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div>
        <label className="label">Gender</label>
        <select className="input" value={value.gender} onChange={(e) => set('gender', e.target.value)}>
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label className="label">Age group</label>
        <select className="input" value={value.age_group} onChange={(e) => set('age_group', e.target.value)}>
          <option value="">Any</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      <div>
        <label className="label">Country (ISO 2)</label>
        <input
          className="input uppercase"
          placeholder="e.g. NG"
          maxLength={2}
          value={value.country_id}
          onChange={(e) => set('country_id', e.target.value.toUpperCase())}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Min age</label>
          <input
            className="input"
            type="number"
            min={0}
            placeholder="0"
            value={value.min_age}
            onChange={(e) => set('min_age', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Max age</label>
          <input
            className="input"
            type="number"
            min={0}
            placeholder="120"
            value={value.max_age}
            onChange={(e) => set('max_age', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <label className="label">Sort by</label>
        <select className="input" value={value.sort_by} onChange={(e) => set('sort_by', e.target.value)}>
          <option value="created_at">Created</option>
          <option value="age">Age</option>
          <option value="gender_probability">Gender confidence</option>
        </select>
      </div>

      <div>
        <label className="label">Order</label>
        <div className="grid grid-cols-2 gap-2">
          {(['desc', 'asc'] as const).map((o) => (
            <button
              key={o}
              onClick={() => set('order', o)}
              className={`btn text-sm justify-center ${
                value.order === o
                  ? 'bg-accent-500/20 text-accent-500 border border-accent-500/40'
                  : 'bg-ink-900/40 text-ink-300 border border-white/5 hover:bg-white/5'
              }`}
            >
              {o === 'desc' ? 'Newest first' : 'Oldest first'}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
