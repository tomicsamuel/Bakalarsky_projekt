'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logos from '@/components/Logos';
import { Button } from '@heroui/button';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.user?.isAdmin) {
        if (data.cookieSet === false) {
          setError('Server nemá nastavený ADMIN_SECRET. Pridaj do .env premennú ADMIN_SECRET=nejaky-dlhy-retezec (min. 16 znakov) a reštartuj server.');
          return;
        }
        router.push('/admin');
        router.refresh();
      } else if (data.success) {
        setError('Tento účet nemá oprávnenie admina.');
      } else {
        setError(data.error || 'Nesprávny email alebo heslo');
      }
    } catch (err) {
      setError('Chyba pri prihlasovaní');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = searchParams.get('session');
    if (session === '0' && !error) {
      setError('Session sa nepodarilo nastaviť. Do súboru .env pridaj premennú ADMIN_SECRET (min. 16 znakov) a reštartuj server (npm run dev).');
    }
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-container loaded">
        <Logos className="auth-logo" feiWidth={200} feiHeight={56} kpsWidth={130} kpsHeight={56} />

        <div className="auth-card">
          <div className="auth-header">
            <h1>Prihlásenie pre administrátorov</h1>
            <p>Zadaj svoje prihlasovacie údaje. Prístup majú len účty s oprávnením admina.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="admin@email.sk"
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

            {error && <div className="error-message" role="alert">{error}</div>}

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold"
              isLoading={loading}
              size="lg"
            >
              {loading ? 'Prihlasujem...' : 'Prihlásiť sa'}
            </Button>
          </form>

          <div className="auth-footer">
            <Link href="/" className="auth-back">
              <ArrowLeft size={18} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Späť na domov
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="auth-page" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
