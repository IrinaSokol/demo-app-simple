import { apiFetch, setStoredToken } from './client';

type LoginResponse = { token: string };

export async function login(email: string, password: string): Promise<void> {
  const data = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(data.token);
}
