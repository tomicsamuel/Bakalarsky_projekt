'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [mode, setMode] = useState<'select' | 'guest' | 'auth'>('select');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setLoggedInUser(user);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email je povinný');
      return;
    }

    if (!validateEmail(email)) {
      setError('Zadaj platný email (napr. meno@email.sk)');
      return;
    }

    router.push(`/finder?email=${encodeURIComponent(email)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedInUser(null);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="logo">FEI TUKE</div>

        {loggedInUser && (
          <button onClick={handleLogout} className="logout-button">
            Odhlásiť sa
          </button>
        )}

        <div className="deadline-badge">
          <div>Prihlášky</div>
          <div>do 30 6025</div>
        </div>

        <div className="landing-content">
          <h1 className="landing-title">
            {loggedInUser ? `Vitaj späť, ${loggedInUser.name}!` : 'Nevieš, ktorý odbor na FEI je pre teba?'}
          </h1>
          
          <p className="landing-description">
            {loggedInUser 
              ? 'Pokračuj vo svojom teste alebo si pozri tvoje výsledky.'
              : 'Pomôžeme ti vybrať študijný program, ktorý sedí tvojim záujmom a skúsenostiam. Odpovedz na pár otázok a zisti, kam patríš.'
            }
          </p>

          {!loggedInUser && (
            <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Rýchle</h3>
              <p>Otázky vyplníš za 2 minúty</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Presné</h3>
              <p>Výsledky na základe tvojho profilu</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Uložené</h3>
              <p>Výsledky si môžeš kedykoľvek pozrieť</p>
            </div>
          </div>
          )}

          {loggedInUser ? (
            <div className="auth-options">
              <Link href={`/finder?userId=${loggedInUser.id}`} className="auth-option-card" style={{ textDecoration: 'none' }}>
                <div className="auth-icon">📊</div>
                <h3>Moje výsledky</h3>
                <p>Pozri si svoje uložené odpovede a výsledky</p>
              </Link>
              <Link href={`/finder?userId=${loggedInUser.id}`} className="auth-option-card" style={{ textDecoration: 'none' }}>
                <div className="auth-icon">✏️</div>
                <h3>Nový test</h3>
                <p>Vyplň test s novými odpoveďami</p>
              </Link>
            </div>
          ) : mode === 'select' ? (
            <div className="auth-options">
              <button
                type="button"
                className="auth-option-card"
                onClick={() => setMode('auth')}
              >
                <div className="auth-icon">🔐</div>
                <h3>Prihlásenie / Registrácia</h3>
                <p>Ulož si výsledky navždy a pozri históriu</p>
              </button>
              <button
                type="button"
                className="auth-option-card"
                onClick={() => setMode('guest')}
              >
                <div className="auth-icon">✉️</div>
                <h3>Pokračovať bez prihlásenia</h3>
                <p>Zadaj iba email a začni hneď</p>
              </button>
            </div>
          ) : null}

          {mode === 'guest' && (
            <form onSubmit={handleStart} className="email-form">
              <div>
                <input
                  type="email"
                  placeholder="Tvoj email (napr. meno@email.sk)"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`email-input ${error ? 'email-input-error' : ''}`}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
              <div className="step-buttons">
                <button
                  type="button"
                  className="step-button step-button-back"
                  onClick={() => setMode('select')}
                >
                  Späť
                </button>
                <button type="submit" className="cta-button-large">
                  Začať test
                </button>
              </div>
            </form>
          )}

          {mode === 'auth' && (
            <div className="auth-links">
              <Link href="/login" className="auth-link-button auth-link-primary">
                Prihlásenie
              </Link>
              <Link href="/register" className="auth-link-button auth-link-secondary">
                Registrácia
              </Link>
              <button
                type="button"
                className="auth-back-link"
                onClick={() => setMode('select')}
              >
                Späť na výber
              </button>
            </div>
          )}

          <div className="landing-stats">
            <div className="stat">
              <div className="stat-number">12</div>
              <div className="stat-label">študijných programov</div>
            </div>
            <div className="stat">
              <div className="stat-number">2</div>
              <div className="stat-label">odbory (Informatika & Elektrotechnika)</div>
            </div>
          </div>
        </div>

        <div className="landing-footer">
          <p>Fakulta elektrotechniky a informatiky TUKE</p>
          <p>Prihláška do 30.6.2025</p>
        </div>
      </div>
    </div>
  );
}
