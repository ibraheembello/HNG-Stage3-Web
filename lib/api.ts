'use client';

let csrfTokenCache: string | null = null;

const readCsrfFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const ensureCsrfToken = async (): Promise<string> => {
  const cookieToken = readCsrfFromCookie();
  if (cookieToken) {
    csrfTokenCache = cookieToken;
    return cookieToken;
  }
  if (csrfTokenCache) return csrfTokenCache;
  const resp = await fetch('/api/v1/auth/csrf', { credentials: 'include' });
  const json = await resp.json();
  csrfTokenCache = json?.data?.csrf_token ?? null;
  return csrfTokenCache as string;
};

const isMutating = (method: string) =>
  ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

// Backend skips CSRF on /auth/* routes (they're public or pre-session), so fetching
// a CSRF token before sign-in is dead weight that can stall the click.
const needsCsrf = (path: string, method: string) =>
  isMutating(method) && !path.startsWith('/auth/');

export interface ApiError extends Error {
  status: number;
  code?: string;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const method = init.method || 'GET';
  const headers = new Headers(init.headers);
  headers.set('X-API-Version', '1');
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (needsCsrf(path, method)) {
    const token = await ensureCsrfToken();
    if (token) headers.set('X-CSRF-Token', token);
  }

  const resp = await fetch(`/api/v1${path}`, {
    ...init,
    method,
    credentials: 'include',
    headers,
  });

  if (resp.status === 204) return undefined as T;

  const ctype = resp.headers.get('content-type') || '';
  const body = ctype.includes('application/json') ? await resp.json() : await resp.text();

  if (!resp.ok) {
    const err = new Error(
      typeof body === 'object' && body && 'error' in body
        ? (body as any).error?.message || 'Request failed'
        : typeof body === 'string'
          ? body
          : 'Request failed'
    ) as ApiError;
    err.status = resp.status;
    err.code = typeof body === 'object' && body ? (body as any).error?.code : undefined;
    throw err;
  }

  return body as T;
}

export const swrFetcher = <T = unknown>(path: string) => apiFetch<T>(path);
