'use client';

import useSWR from 'swr';
import { swrFetcher } from './api';
import type { User } from './types';

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<{ data: User } | { status: string; data: User } | User>(
    '/auth/me',
    swrFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // backend wraps /auth/me as {data: user}
  const user: User | null = data
    ? 'data' in (data as any)
      ? ((data as any).data as User)
      : ((data as unknown) as User)
    : null;

  return { user, error, isLoading, mutate };
}
