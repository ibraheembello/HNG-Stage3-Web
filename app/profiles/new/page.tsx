'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { AuthGate } from '@/components/AuthGate';
import { PageShell } from '@/components/PageShell';
import { apiFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

const initial = {
  name: '',
  gender: 'male',
  gender_probability: '0.95',
  age: '',
  age_group: 'adult',
  country_id: 'NG',
  country_name: 'Nigeria',
  country_probability: '0.9',
};

function NewProfileInner() {
  const [form, setForm] = useState({ ...initial });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        gender: form.gender,
        gender_probability: parseFloat(form.gender_probability),
        age: parseInt(form.age, 10),
        age_group: form.age_group,
        country_id: form.country_id.toUpperCase(),
        country_name: form.country_name,
        country_probability: parseFloat(form.country_probability),
      };
      const resp = await apiFetch<{ status: string; data: Profile }>('/profiles', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      router.push(`/profiles/${resp.data.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create profile');
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Create profile</h1>
      <p className="text-sm text-ink-300 mt-1">Admin only · all fields are required.</p>

      <form onSubmit={onSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
          <div>
            <label className="label">Gender probability (0–1)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              className="input"
              value={form.gender_probability}
              onChange={(e) => set('gender_probability', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Age</label>
            <input
              type="number"
              min="0"
              max="150"
              className="input"
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Age group</label>
            <select className="input" value={form.age_group} onChange={(e) => set('age_group', e.target.value)}>
              <option value="child">child</option>
              <option value="teenager">teenager</option>
              <option value="adult">adult</option>
              <option value="senior">senior</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Country (ISO 2)</label>
            <input
              className="input uppercase"
              maxLength={2}
              value={form.country_id}
              onChange={(e) => set('country_id', e.target.value.toUpperCase())}
              required
            />
          </div>
          <div>
            <label className="label">Country name</label>
            <input
              className="input"
              value={form.country_name}
              onChange={(e) => set('country_name', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Country probability (0–1)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            className="input"
            value={form.country_probability}
            onChange={(e) => set('country_probability', e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {submitting ? 'Creating…' : 'Create profile'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function NewProfilePage() {
  return (
    <AuthGate requireRole="admin">
      <PageShell>
        <NewProfileInner />
      </PageShell>
    </AuthGate>
  );
}
