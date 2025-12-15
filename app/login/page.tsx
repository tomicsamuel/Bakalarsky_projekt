'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div className="landing-page">
      <div className="landing-container">
        <Link href="/" className="logo" style={{ display: 'inline-block', textDecoration: 'none' }}>
          FEI TUKE
        </Link>

        <div className="landing-content" style={{ maxWidth: '500px', margin: '32px auto' }}>
          <h1 className="landing-title" style={{ fontSize: '32px' }}>Prihlásenie</h1>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="meno@email.sk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="cta-button"
              disabled={loading}
              style={{ width: '100%', marginTop: '16px' }}
            >
              {loading ? 'Prihlasovanie...' : 'Prihlásiť sa'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Nemáš účet?{' '}
              <Link href="/register" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                Zaregistruj sa
              </Link>
            </p>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', display: 'block' }}>
              Späť na domov
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



