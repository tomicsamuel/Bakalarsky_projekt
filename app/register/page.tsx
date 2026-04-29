'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Heslá sa nezhodujú');
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mať aspoň 6 znakov');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(`/finder?userId=${data.user.id}`);
      } else {
        setError(data.error || 'Chyba pri registrácii');
      }
    } catch (err) {
      setError('Chyba pri registrácii');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container loaded">
        <main id="main-content" className="auth-card">
          <div className="auth-header">
            <h1>Vytvor si účet</h1>
            <p>Zaberie to len chvíľu. Potom môžeš ukladať výsledky a kedykoľvek sa k nim vrátiť.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Meno</label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Ako ťa môžeme osloviť?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Min. 6 znakov"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="form-hint">Heslo musí mať aspoň 6 znakov.</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Potvrď heslo</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                placeholder="Zadaj heslo znova"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="auth-form-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Registrujem...' : 'Zaregistrovať sa'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Už máš účet?{' '}
              <Link href="/login">Prihlás sa</Link>
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
