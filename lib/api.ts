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

// Singleton in-flight refresh — collapses concurrent 401s into one rotation
// so the rotated refresh token isn't burned twice.
let refreshPromise: Promise<boolean> | null = null;

const performRefresh = (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const resp = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-API-Version': '1' },
      });
      if (resp.ok) {
        // Refresh rotates the csrf cookie too — invalidate the cache.
        csrfTokenCache = null;
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      // Release the lock on next microtask so all awaiters resolve first.
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    }
  })();
  return refreshPromise;
};

const buildHeaders = async (path: string, method: string, init: RequestInit) => {
  const headers = new Headers(init.headers);
  headers.set('X-API-Version', '1');
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (needsCsrf(path, method)) {
    const token = await ensureCsrfToken();
    if (token) headers.set('X-CSRF-Token', token);
  }
  return headers;
};

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const method = init.method || 'GET';

  const send = async () => {
    const headers = await buildHeaders(path, method, init);
    return fetch(`/api/v1${path}`, {
      ...init,
      method,
      credentials: 'include',
      headers,
    });
  };

  let resp = await send();

  // Auto-refresh on 401 — but only for non-auth endpoints, to avoid an infinite
  // loop when /auth/refresh itself returns 401 (refresh token expired).
  if (resp.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await performRefresh();
    if (refreshed) {
      resp = await send();
    }
  }

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
