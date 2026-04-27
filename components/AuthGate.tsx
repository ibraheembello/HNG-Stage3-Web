'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/useUser';
import { LoadingScreen } from './LoadingScreen';

export function AuthGate({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: 'admin' | 'analyst';
}) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (error || !user) {
      router.replace('/');
      return;
    }
    if (requireRole === 'admin' && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, error, isLoading, requireRole, router]);

  if (isLoading) return <LoadingScreen />;
  if (error || !user) return <LoadingScreen />;
  if (requireRole === 'admin' && user.role !== 'admin') return <LoadingScreen />;

  return <>{children}</>;
}
