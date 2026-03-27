const TOKEN_KEY = 'auth_token';

/**
 * Optional: set `VITE_API_BASE_URL=http://localhost:3001` in `.env.local` to call Express
 * directly (CORS is enabled). When unset, use same-origin `/api/...` (Vite proxy or `npm start`).
 */
function resolveApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';
  const normalized = base.replace(/\/$/, '');
  return normalized ? `${normalized}${path}` : path;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = resolveApiUrl(path);
  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    if (res.status === 404 && message === 'Not Found') {
      message =
        'API not found (404). Use npm run dev (Vite + Express), or npm start after build. If you use vite preview, ensure Express is running on port 3001. Restart the server after pulling API changes.';
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
