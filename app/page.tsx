'use client';

import { Suspense, useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Zap, Target, Save, BarChart2, Pencil, Lock, UserRound } from 'lucide-react';
import { Button } from '@heroui/button';
import AnimatedStats from '@/components/AnimatedStats';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingElements from '@/components/FloatingElements';
import Logos from '@/components/Logos';
import { DEADLINE } from '@/lib/config';

const VALID_FLOWS = new Set(['vyber', 'auth']);

function parseFlow(flow: string | null): 'vyber' | 'auth' | null {
  if (flow === 'vyber' || flow === 'auth') return flow;
  return null;
}

function useMaxWidth639() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {};
      const m = window.matchMedia('(max-width: 639px)');
      m.addEventListener('change', onChange);
      return () => m.removeEventListener('change', onChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false),
    () => false
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /** Na úzkom mobile: URL „flow“ namiesto useState mobileFlowOpen / mode pre históriu prehliadača. */
  const flowParamRaw = searchParams.get('flow');
  const parsedFlow = parseFlow(flowParamRaw);
  const isCompactMobile = useMaxWidth639();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const mobileFlowOpen = isCompactMobile && !loggedInUser && !!parsedFlow;
  const mode: 'select' | 'auth' = parsedFlow === 'auth' ? 'auth' : 'select';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setLoggedInUser(user);
      } catch {
        localStorage.removeItem('user');
      }
    }

    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  /** Neplatný flow query → vyčistenie URL. */
  useEffect(() => {
    const f = searchParams.get('flow');
    if (f === null || f === '') return;
    if (!VALID_FLOWS.has(f)) {
      router.replace('/');
    }
  }, [searchParams, router]);

  /** Prihlásený používateľ: žiadny flow query. */
  useEffect(() => {
    if (loggedInUser && flowParamRaw) {
      router.replace('/');
    }
  }, [loggedInUser, flowParamRaw, router]);

  /** Široké okno: flow v URL ignorovať vizuálne a URL vyčistiť. */
  useEffect(() => {
    if (!isCompactMobile && flowParamRaw) {
      router.replace('/');
    }
  }, [isCompactMobile, flowParamRaw, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedInUser(null);
  };

  const goSplash = () => router.push('/');
  const goVyber = () => router.push('/?flow=vyber');
  const goAuth = () => router.push('/?flow=auth');

  return (
    <div className={`landing-page ${isCompactMobile ? 'landing-page--compact' : ''}`}>
      <AnimatedBackground />
      <FloatingElements />

      <main id="main-content" className={`landing-container ${isLoaded ? 'loaded' : ''}`}>
        {(!isCompactMobile || !mobileFlowOpen) && (
          <div className="landing-top-row">
            <Logos />
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
        )}

        {(loggedInUser || !isCompactMobile || mobileFlowOpen) && (
          <>
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
          </>
        )}

        <div className={`landing-content glass-card ${isCompactMobile ? 'landing-content--compact-splash' : ''}`}>
          {loggedInUser ? (
            <>
              <h1 className="landing-title">Ahoj, {loggedInUser.name}</h1>
              <p className="landing-description">Môžeš ísť na test alebo si znova pozrieť výsledky.</p>
              <div className="auth-options">
                <Link
                  href={`/finder?userId=${loggedInUser.id}&step=7`}
                  className="auth-option-card"
                  style={{ textDecoration: 'none' }}
                >
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
            </>
          ) : (
            <>
              {isCompactMobile && !mobileFlowOpen ? (
                <div className="landing-mobile-splash">
                  <h1 className="landing-title landing-title--splash">Ktorý odbor na FEI je pre teba?</h1>
                  <p className="landing-description landing-description--splash">
                    Krátky test záujmov a získaš návrhy študijných programov.
                  </p>
                  <Button
                    color="primary"
                    size="lg"
                    className="cta-button-large landing-mobile-splash-start"
                    onPress={() => goVyber()}
                    aria-label="Začať test"
                  >
                    Začať test
                  </Button>
                  <nav className="landing-mobile-more-links" aria-label="Ďalšie stránky">
                    <Link href="/programy">Študijné odbory</Link>
                    <span aria-hidden>·</span>
                    <Link href="/finder">Nájdi odbor</Link>
                  </nav>
                </div>
              ) : (
                <>
                  {!isCompactMobile && (
                    <>
                      <h1 className="landing-title">Ktorý odbor na FEI je pre teba?</h1>
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
                  )}

                  {isCompactMobile && mobileFlowOpen && mode === 'select' ? (
                    <div className="landing-mobile-splash">
                      <h2 className="landing-title landing-title--compact-heading">Vyber začiatok</h2>
                      <p className="landing-description landing-description--compact">
                        Prihlás sa (výsledky si uložíš), alebo začni anonymne – email zadáš až pri registrácii na uloženie.
                      </p>
                      <div className="auth-options">
                        <button type="button" className="auth-option-card auth-option-card--primary" onClick={() => goAuth()}>
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
                          onClick={() => router.push('/finder?step=0')}
                          aria-label="Začať test anonymne bez emailu"
                        >
                          <div className="auth-icon"><UserRound size={28} strokeWidth={2} /></div>
                          <h3>Anonymne (bez mailu)</h3>
                          <p>Žiadny účet ani email pri štarte — výsledky si uložíš po registrácii</p>
                          <ul className="auth-option-bullets" aria-hidden>
                            <li>Rýchly štart</li>
                            <li>Účet neskôr</li>
                          </ul>
                        </button>
                      </div>
                      <button type="button" className="landing-back-to-splash link-button-reset" onClick={() => goSplash()}>
                        ← Späť na úvod
                      </button>
                    </div>
                  ) : (
                    <>
                      {!isCompactMobile && mode === 'select' && (
                        <div className="auth-options">
                          <button type="button" className="auth-option-card auth-option-card--primary" onClick={() => goAuth()}>
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
                            onClick={() => router.push('/finder?step=0')}
                            aria-label="Začať test anonymne bez emailu"
                          >
                            <div className="auth-icon"><UserRound size={28} strokeWidth={2} /></div>
                            <h3>Anonymne (bez mailu)</h3>
                            <p>Žiadny účet ani email pri štarte — uloženie cez registráciu</p>
                            <ul className="auth-option-bullets" aria-hidden>
                              <li>Rýchly štart</li>
                              <li>Účet neskôr</li>
                            </ul>
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {mode === 'auth' && (
                    <div className="auth-links">
                      <Link href="/login" className="auth-link-button auth-link-primary" aria-label="Prihlásiť sa">
                        Prihlásenie
                      </Link>
                      <Link href="/register" className="auth-link-button auth-link-secondary" aria-label="Registrovať sa">
                        Registrácia
                      </Link>
                      <Button
                        type="button"
                        variant="light"
                        className="auth-back-link"
                        onPress={() => goVyber()}
                        aria-label="Späť na výber"
                      >
                        Späť na výber
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {(loggedInUser || !isCompactMobile || mobileFlowOpen) && (
          <div className="landing-footer">
            <p>Fakulta elektrotechniky a informatiky TUKE</p>
            <p>{DEADLINE.label}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="landing-page" aria-hidden />}>
      <HomeInner />
    </Suspense>
  );
}
