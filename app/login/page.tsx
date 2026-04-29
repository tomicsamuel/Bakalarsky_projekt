'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (error && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(`/finder?userId=${data.user.id}`);
      } else {
        setError(data.error || 'Nesprávny email alebo heslo');
      }
    } catch (err) {
      setError('Chyba pri prihlasovaní');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container loaded">
        <main id="main-content" className="auth-card">
          <div className="auth-header">
            <h1>Vitaj späť</h1>
            <p>Prihlás sa a pokračuj tam, kde si skončil. Tvoje odporúčania na teba čakajú.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                className={`form-input ${error ? 'form-input-error' : ''}`}
                placeholder="meno@email.sk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Heslo</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div id="login-error" className="auth-form-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Prihlasujem...' : 'Prihlásiť sa'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Nemáš účet?{' '}
              <Link href="/register">Zaregistruj sa</Link>
            </p>
            <Link href="/" className="auth-back">
              <ArrowLeft size={18} strokeWidth={2} aria-hidden />
              Späť na domov
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
