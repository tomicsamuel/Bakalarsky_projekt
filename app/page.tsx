'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Target, Save, BarChart2, Pencil, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@heroui/button';
import AnimatedStats from '@/components/AnimatedStats';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingElements from '@/components/FloatingElements';
import Logo from '@/components/Logo';
import { DEADLINE } from '@/lib/config';

export default function Home() {
  const [mode, setMode] = useState<'select' | 'guest' | 'auth'>('select');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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
    
    // Animácia načítania
    setTimeout(() => setIsLoaded(true), 100);
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

    setIsRedirecting(true);
    router.push(`/finder?email=${encodeURIComponent(email)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedInUser(null);
  };

  return (
    <div className="landing-page">
      <AnimatedBackground />
      <FloatingElements />
      
      <main id="main-content" className={`landing-container ${isLoaded ? 'loaded' : ''}`}>
        <div className="landing-top-row">
          <div className="landing-logos">
            <Logo variant="fei" href="/" className="logo" width={180} height={52} />
            <Logo variant="kps" href="/" className="logo" width={120} height={52} />
          </div>
          {loggedInUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="logout-button"
              aria-label="Odhlásiť sa"
            >
              Odhlásiť sa
            </button>
          )}
        </div>

        <div className="deadline-badge" aria-label={DEADLINE.label}>
          <div>Prihlášky</div>
          <div>do {DEADLINE.short}</div>
        </div>

        <nav className="platform-nav" aria-label="Hlavná navigácia platformy">
          <Link href="/programy">Študijné odbory</Link>
          <Link href="/aktivity">Aktivity katedry</Link>
          <Link href="/uspechy">Študijné aktuality</Link>
          <Link href="/finder">Nájdi odbor</Link>
        </nav>

        <div className="landing-content glass-card">
          {!loggedInUser ? (
            <>
              <h1 className="landing-title">
                Ktorý odbor na FEI je pre teba?
              </h1>
              
              <AnimatedStats />
              
              <p className="landing-description">
                Pár otázok o záujmoch a praxi — potom uvidíš odbory, ktoré ti sedia, a môžeš si ich porovnať.
              </p>

              <div className="landing-features">
                <div className="feature-card glass-feature">
                  <div className="feature-icon"><Zap size={28} strokeWidth={2} /></div>
                  <h3>Rýchlo</h3>
                  <p>Pár minút a máš prvý prehľad</p>
                </div>
                <div className="feature-card glass-feature">
                  <div className="feature-icon"><Target size={28} strokeWidth={2} /></div>
                  <h3>Na mieru</h3>
                  <p>Podľa toho, čo ťa baví a čo si skúsil</p>
                </div>
                <div className="feature-card glass-feature">
                  <div className="feature-icon"><Save size={28} strokeWidth={2} /></div>
                  <h3>Uložíš si</h3>
                  <p>Výsledky môžeš mať uložené a vrátiť sa k nim</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="landing-title">
                Ahoj, {loggedInUser.name}
              </h1>
              <p className="landing-description">
                Môžeš ísť na test alebo si znova pozrieť výsledky.
              </p>
            </>
          )}

          {loggedInUser ? (
            <div className="auth-options">
              <Link href={`/finder?userId=${loggedInUser.id}`} className="auth-option-card" style={{ textDecoration: 'none' }}>
                <div className="auth-icon"><BarChart2 size={28} strokeWidth={2} /></div>
                <h3>Moje výsledky</h3>
                <p>Pozri si uložené odpovede a odporúčania</p>
              </Link>
              <Link href={`/finder?userId=${loggedInUser.id}`} className="auth-option-card" style={{ textDecoration: 'none' }}>
                <div className="auth-icon"><Pencil size={28} strokeWidth={2} /></div>
                <h3>Znova od začiatku</h3>
                <p>Vyplň test znova s inými odpoveďami</p>
              </Link>
            </div>
          ) : mode === 'select' ? (
            <div className="auth-options">
              <button
                type="button"
                className="auth-option-card auth-option-card--primary"
                onClick={() => setMode('auth')}
              >
                <div className="auth-icon"><Lock size={28} strokeWidth={2} /></div>
                <h3>Prihlásenie alebo registrácia</h3>
                <p>Výsledky si uložíš a kedykoľvek sa k nim vrátiš</p>
                <ul className="auth-option-bullets" aria-hidden>
                  <li>Účet a heslo</li>
                  <li>História výsledkov</li>
                </ul>
              </button>
              <button
                type="button"
                className="auth-option-card auth-option-card--secondary"
                onClick={() => setMode('guest')}
              >
                <div className="auth-icon"><Mail size={28} strokeWidth={2} /></div>
                <h3>Iba s emailom</h3>
                <p>Bez účtu — zadaj email a môžeš ísť na test</p>
                <ul className="auth-option-bullets" aria-hidden>
                  <li>Žiadna registrácia</li>
                  <li>Rýchly štart</li>
                </ul>
              </button>
            </div>
          ) : null}

          {mode === 'guest' && (
            <form onSubmit={handleStart} className="email-form" aria-label="Email formulár">
              {isRedirecting && (
                <p className="landing-redirect-hint" role="status" aria-live="polite">
                  Presmerovávame na test…
                </p>
              )}
              <div>
                <label htmlFor="email-input" className="sr-only">
                  Zadaj svoj email
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Tvoj email (napr. meno@email.sk)"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`email-input glass-input ${error ? 'email-input-error' : ''}`}
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'email-error' : undefined}
                  disabled={isRedirecting}
                />
                {error && (
                  <div id="email-error" className="error-message" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <div className="step-buttons">
                <Button
                  type="button"
                  variant="bordered"
                  className="step-button step-button-back"
                  onPress={() => setMode('select')}
                  aria-label="Späť na výber"
                  isDisabled={isRedirecting}
                >
                  <span className="step-button-inner">Späť</span>
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="cta-button-large"
                  aria-label="Začať test"
                  endContent={isRedirecting ? null : <ArrowRight size={18} strokeWidth={2} />}
                  isLoading={isRedirecting}
                >
                  <span className="step-button-inner">{isRedirecting ? 'Presmerovávam…' : 'Ísť na test'}</span>
                </Button>
              </div>
            </form>
          )}

          {mode === 'auth' && (
            <div className="auth-links">
              <Link 
                href="/login" 
                className="auth-link-button auth-link-primary"
                aria-label="Prihlásiť sa"
              >
                Prihlásenie
              </Link>
              <Link 
                href="/register" 
                className="auth-link-button auth-link-secondary"
                aria-label="Registrovať sa"
              >
                Registrácia
              </Link>
              <Button
                type="button"
                variant="light"
                className="auth-back-link"
                onPress={() => setMode('select')}
                aria-label="Späť na výber"
              >
                Späť na výber
              </Button>
            </div>
          )}
        </div>

        <div className="landing-footer">
          <p>Fakulta elektrotechniky a informatiky TUKE</p>
          <p>{DEADLINE.label}</p>
        </div>
      </main>
    </div>
  );
}
