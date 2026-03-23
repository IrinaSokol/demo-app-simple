import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { getStoredToken } from '@/api/client';

function getPostLoginPath(state: unknown): string {
  const from = (state as { from?: string } | undefined)?.from;
  if (
    typeof from === 'string' &&
    from.startsWith('/') &&
    from !== '/login'
  ) {
    return from;
  }
  return '/projects';
}

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = getPostLoginPath(location.state);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (getStoredToken()) {
    return <Navigate to="/projects" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      navigate(redirectTo, { replace: true });
    } catch {
      setError('Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-card">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              data-testid="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              data-testid="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="login-submit"
            data-testid="login-submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
          {error ? (
            <div className="login-error" data-testid="login-error" role="alert">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
