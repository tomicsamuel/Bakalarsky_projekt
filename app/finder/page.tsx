'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Target, Briefcase, X } from 'lucide-react';
import { Button } from '@heroui/button';
import Confetti from '@/components/Confetti';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingElements from '@/components/FloatingElements';
import SidebarMenu from '@/components/SidebarMenu';
import ResultsDisplay from '@/components/ResultsDisplay';
import ResultsDashboard from '@/components/Results/ResultsDashboard';
import { calculateScores } from '@/lib/scoring';
import type { ScoreResult } from '@/lib/types';

type ChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function ChipButton({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip ${active ? 'active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

type ToastMessageProps = {
  message: string;
  onClose: () => void;
};

function ToastMessage({ message, onClose }: ToastMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast" role="status">
      <div className="toast-icon"><Check size={22} strokeWidth={2.5} /></div>
      <div className="toast-message">{message}</div>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Zavrieť"
      >
        ×
      </button>
    </div>
  );
}

type CategoryProps = {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

function Category({ title, items, selected, onToggle }: CategoryProps) {
  const [expanded, setExpanded] = useState(false);
  const selectedCount = items.filter(item => selected.includes(item)).length;

  return (
    <div className="category-group">
      <button
        type="button"
        className="category-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span>
          {title}
          {selectedCount > 0 && (
            <span className="category-count"> ({selectedCount})</span>
          )}
        </span>
        <span style={{ fontSize: '20px' }}>{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="chips-container" style={{ marginTop: '12px' }}>
          {items.map(item => (
            <ChipButton
              key={item}
              label={item}
              active={selected.includes(item)}
              onClick={() => onToggle(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ProgressBarProps = {
  percent: number;
};

function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

// Kraje a konkrétnejšie časti (okresy / mestá) pre dropdown „Odkiaľ si?“ 
const LOCATION_REGIONS: Record<string, string[]> = {
  'Bratislavský kraj': ['Bratislava I', 'Bratislava II', 'Bratislava III', 'Bratislava IV', 'Bratislava V', 'Malacky', 'Pezinok', 'Senec'],
  'Trnavský kraj': ['Dunajská Streda', 'Galanta', 'Hlohovec', 'Piešťany', 'Senica', 'Skalica', 'Trnava'],
  'Trenčiansky kraj': ['Bánovce nad Bebravou', 'Ilava', 'Myjava', 'Nové Mesto nad Váhom', 'Partizánske', 'Považská Bystrica', 'Prievidza', 'Púchov', 'Trenčín'],
  'Nitriansky kraj': ['Komárno', 'Levice', 'Nitra', 'Nové Zámky', 'Šaľa', 'Topoľčany', 'Zlaté Moravce'],
  'Žilinský kraj': ['Bytča', 'Čadca', 'Dolný Kubín', 'Kysucké Nové Mesto', 'Liptovský Mikuláš', 'Martin', 'Námestovo', 'Ružomberok', 'Turčianske Teplice', 'Tvrdošín', 'Žilina'],
  'Banskobystrický kraj': ['Banská Bystrica', 'Banská Štiavnica', 'Brezno', 'Detva', 'Krupina', 'Lučenec', 'Poltár', 'Revúca', 'Rimavská Sobota', 'Veľký Krtíš', 'Zvolen', 'Žarnovica', 'Žiar nad Hronom'],
  'Prešovský kraj': ['Bardejov', 'Humenné', 'Kežmarok', 'Levoča', 'Medzilaborce', 'Poprad', 'Prešov', 'Sabinov', 'Snina', 'Stará Ľubovňa', 'Stropkov', 'Svidník', 'Vranov nad Topľou'],
  'Košický kraj': ['Gelnica', 'Košice I', 'Košice II', 'Košice III', 'Košice IV', 'Michalovce', 'Rožňava', 'Sobrance', 'Spišská Nová Ves', 'Trebišov'],
};

const REGION_OPTIONS = Object.keys(LOCATION_REGIONS);

function FinderContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  // Mounted flag – počas SSR a prvého renderu nevieme, čo je v URL,
  // takže nebudeme renderovať nič (zabráni SSR „flashu" GDPR modalu).
  const [mounted, setMounted] = useState(false);
  // Pri prechode na /finder?userId=... – najprv načítame históriu, aby neblikal GDPR modal
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [locationRegion, setLocationRegion] = useState('');
  const [locationPart, setLocationPart] = useState('');
  const [age, setAge] = useState('');
  const [wantsToStudyAtTUKE, setWantsToStudyAtTUKE] = useState<boolean | null>(null);
  const [howDidYouHear, setHowDidYouHear] = useState<string[]>([]);
  const [howDidYouHearOther, setHowDidYouHearOther] = useState('');
  const [whyThisSchool, setWhyThisSchool] = useState<string[]>([]);
  const [expectations, setExpectations] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [results, setResults] = useState<ScoreResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const stepCardRef = useRef<HTMLDivElement>(null);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const summaryTriggerRef = useRef<HTMLButtonElement>(null);
  const summaryCloseRef = useRef<HTMLButtonElement>(null);

  const completenessPercent =
    ([
      Boolean(name.trim()),
      Boolean(school),
      howDidYouHear.length > 0,
      interests.length > 0,
      experience.length > 0,
    ].filter(Boolean).length /
      5) *
    100;

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const userIdParam = searchParams.get('userId');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (userIdParam) {
      setUserId(parseInt(userIdParam));
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setEmail(user.email);
        setName(user.name);
      }
      
      loadUserHistory(parseInt(userIdParam));
    } else {
      // Pre istotu – ak userId chýba, nečakáme na žiadnu históriu
      setIsLoadingHistory(false);
    }
    // Až teraz môžeme renderovať UI (po určení, či máme userId)
    setMounted(true);
  }, [searchParams]);

  useEffect(() => {
    if (step < 7) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      stepTitleRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (!showSummaryModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSummaryModal(false);
    };
    summaryCloseRef.current?.focus();
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      summaryTriggerRef.current?.focus();
    };
  }, [showSummaryModal]);

  useEffect(() => {
    if (!showEmailModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEmailModal(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showEmailModal]);

  const loadUserHistory = async (accountId: number) => {
    try {
      const response = await fetch(`/api/user-results?accountId=${accountId}`);
      const data = await response.json();
      
      if (data.success && data.hasHistory) {
        setName(data.data.name);
        setEmail(data.data.email);
        setSchool(data.data.school);
        const loc = data.data.location || '';
        const dashIdx = loc.indexOf(' - ');
        if (dashIdx >= 0) {
          setLocationRegion(loc.slice(0, dashIdx));
          setLocationPart(loc.slice(dashIdx + 3));
        } else {
          setLocationRegion(loc);
          setLocationPart('');
        }
        setAge(data.data.age != null ? String(data.data.age) : '');
        setWantsToStudyAtTUKE(data.data.wantsToStudyAtTUKE ?? null);
        setHowDidYouHear(data.data.howDidYouHear || []);
        setHowDidYouHearOther(data.data.howDidYouHearOther || '');
        setWhyThisSchool(data.data.whyThisSchool || []);
        setExpectations(data.data.expectations || []);
        setInterests(data.data.interests);
        setExperience(data.data.experience);
        
        const resultsData = data.data.results.map((r: any) => ({
          name: r.name,
          field: r.field,
          score: r.score,
        }));
        setResults(resultsData);
        setStep(7);
        setSaved(true);
        setConsentChecked(true);
      }
    } catch (error) {
      console.error('Chyba pri načítaní histórie:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const interestCategories = {
    'Programovanie': [
      'Web programovanie',
      'Aplikačné programovanie',
      'Herné programovanie',
      'Mobilné aplikácie',
      'Desktop aplikácie',
      'Backend programovanie',
      'Frontend programovanie',
      'Full-stack programovanie'
    ],
    'Siete a komunikácia': [
      'Siete a sieťové technológie',
      'Bezpečnosť sietí',
      'Systémová administrácia',
      'Cloud computing',
      'Virtualizácia',
      'Sieťová bezpečnosť',
      'WiFi a bezdrôtové siete'
    ],
    'Dáta a databázy': [
      'Databázy',
      'Big Data',
      'Data Science',
      'Data Analytics',
      'SQL',
      'NoSQL databázy',
      'Data mining'
    ],
    'AI a Machine Learning': [
      'AI/ML',
      'Strojové učenie',
      'Hlboké učenie',
      'Spracovanie prirodzeného jazyka',
      'Počítačové videnie',
      'Neurónové siete',
      'Robotika a AI'
    ],
    'Bezpečnosť': [
      'Kyberbezpečnosť',
      'Ethical hacking',
      'Penetračné testovanie',
      'Kryptografia',
      'Informačná bezpečnosť',
      'Digitálna forenzika'
    ],
    'Elektronika': [
      'Elektronika',
      'Mikroprocesory',
      'Mikrokontroléry',
      'Arduino/Raspberry Pi',
      'Digitálna elektronika',
      'Analógová elektronika',
      'Elektronické obvody'
    ],
    'Automatizácia a riadenie': [
      'Automatizácia',
      'Robotika',
      'PLC programovanie',
      'SCADA systémy',
      'Priemyselná automatizácia',
      'Riadiace systémy'
    ],
    'Energetika': [
      'Energetika',
      'Obnoviteľné zdroje',
      'Solárna energia',
      'Veterná energia',
      'Energetická efektívnosť',
      'Smart grid',
      'Elektrické stroje'
    ],
    'Fyzika a materiály': [
      'Fyzika',
      'Materiálové inžinierstvo',
      'Nanotechnológie',
      'Kvantová fyzika',
      'Optika',
      'Magnetizmus'
    ],
    'Ostatné': [
      'PC',
      'Lietadlá',
      'Automobilový priemysel',
      'Administratíva',
      'Projektový manažment',
      'Grafika a dizajn'
    ]
  };

  const experienceCategories = {
    'Bez praxe': [
      'Žiadny'
    ],
    'IT a programovanie': [
      'IT support',
      'Web programovanie',
      'Aplikačné programovanie',
      'Mobilné aplikácie',
      'Backend vývoj',
      'Frontend vývoj',
      'Full-stack vývoj',
      'Herný vývoj'
    ],
    'Siete a administrácia': [
      'Siete a administrácia',
      'Systémová administrácia',
      'Cloud administrácia',
      'Sieťová bezpečnosť',
      'Server administrácia'
    ],
    'Dáta a databázy': [
      'Databázy',
      'Data Science',
      'Data Analytics',
      'Big Data',
      'Database administrácia'
    ],
    'Bezpečnosť': [
      'Kyberbezpečnosť',
      'Penetračné testovanie',
      'Security analýza',
      'Incident response'
    ],
    'Elektrotechnika': [
      'Servis elektroniky',
      'Elektroinštalácie',
      'Elektrické merania',
      'Opravy elektroniky',
      'Montáž elektroniky'
    ],
    'Automatizácia': [
      'Automatizácia',
      'PLC programovanie',
      'SCADA systémy',
      'Priemyselná automatizácia',
      'Robotika'
    ],
    'Energetika': [
      'Energetika',
      'Elektrické rozvodne',
      'Energetické audity',
      'Obnoviteľné zdroje',
      'Elektrické inštalácie'
    ],
    'Ostatné': [
      'Auto servis',
      'Administratíva',
      'Projektový manažment',
      'Technická dokumentácia'
    ]
  };

  const toggleInterest = (value: string) => {
    if (interests.includes(value)) {
      setInterests(interests.filter(i => i !== value));
    } else {
      setInterests([...interests, value]);
    }
  };

  const toggleExperience = (value: string) => {
    if (experience.includes(value)) {
      setExperience(experience.filter(e => e !== value));
    } else {
      setExperience([...experience, value]);
    }
  };

  useEffect(() => {
    if (name || school || interests.length > 0 || experience.length > 0) {
      // calculateScores now returns ALL majors; UI can show top5 or all later.
      setResults(calculateScores(school, interests, experience));
    }
  }, [name, school, interests, experience]);

  const nextStep = async () => {
    if (step === 0) {
      if (consentChecked) setStep(1);
      return;
    }
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !school) return;
    if (step === 4 && howDidYouHear.length === 0) return;
    if (step === 5 && interests.length === 0) return;
    if (step === 6 && experience.length === 0) return;
    
    // Confetti pri dokončení kroku
    if (step < 6) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    
    if (step === 6 && userId) {
      await handleSubmit();
      setStep(step + 1);
      setTimeout(() => {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    
    if (step < 8) {
      setStep(step + 1);
      // Smooth scroll k výsledkom po kroku 2–6
      if (step >= 2 && step < 7) {
        setTimeout(() => {
          const resultsSection = document.querySelector('.results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSaved(false);
    setSaveError(null);

    if (name.trim()) {
      try {
        setLoading(true);

        const requestData = {
          name: name.trim(),
          email: email,
          school,
          location: (locationRegion && locationPart)
            ? `${locationRegion} - ${locationPart}`
            : (locationRegion || locationPart).trim() || null,
          age: (() => {
            if (!age.trim()) return null;
            const n = parseInt(age, 10);
            return (Number.isNaN(n) || n < 7 || n > 99) ? null : n;
          })(),
          wantsToStudyAtTUKE,
          howDidYouHear,
          howDidYouHearOther: howDidYouHearOther.trim() || null,
          whyThisSchool,
          expectations,
          interests,
          experience,
          accountId: userId,
          results: results.map(p => ({
            programName: p.name,
            programField: p.field,
            score: p.score,
          })),
        };

        const response = await fetch('/api/save-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (data.success) {
          setSaved(true);
          console.log('Výsledky uložené:', data);
          return true;
        } else {
          setSaveError(data.error || 'Nepodarilo sa uložiť výsledky.');
          return false;
        }

      } catch (error) {
        console.error('Chyba pri volaní API:', error);
        setSaveError('Nepodarilo sa uložiť výsledky. Skúste to znova.');
        return false;
      } finally {
        setLoading(false);
      }
    }
    return false;
  };

  // Počas SSR / prvého renderu / načítavania histórie nič nerenderujeme –
  // zabráni to SSR flashu GDPR modalu pred tým, než sa spustí JS a nastaví step=7.
  if (!mounted || isLoadingHistory) {
    return (
      <div className="page-container finder-page">
        <AnimatedBackground />
      </div>
    );
  }

  return (
    <div className="page-container finder-page">
      <AnimatedBackground />
      <FloatingElements />
      <Confetti active={showConfetti} />

      <div className="finder-layout">
        <SidebarMenu
          currentStep={step}
          totalSteps={8}
          onStepClick={(stepNum) => {
            if (stepNum <= step && stepNum >= 0) {
              setStep(stepNum);
            }
          }}
        />
        <main id="main-content" className="finder-main">
      <header className={`page-header ${step === 7 ? 'page-header--compact-results' : ''}`}>
        <h1 className={`page-title ${step === 7 ? 'page-title--compact' : ''}`}>
          Ktorý odbor na FEI je pre teba?
        </h1>
      </header>

      {step === 7 ? (
        <>
          <div className="results-fullscreen">
            {saveError && (
              <div className="results-save-error-banner" role="alert">
                {saveError}
                {saveError.includes('Prihláste sa') && (
                  <> <Link href="/login" className="results-save-error-banner__link">Prihlásiť sa a uložiť</Link></>
                )}
                {saveError.includes('Email je povinný') && (
                  <> <button type="button" className="results-save-error-banner__link" onClick={() => setShowEmailModal(true)}>Doplniť email</button></>
                )}
              </div>
            )}
            <div className="results-toolbar">
              <button
                ref={summaryTriggerRef}
                type="button"
                className="results-toolbar-btn"
                onClick={() => setShowSummaryModal(true)}
                aria-label="Súhrn odpovedí"
              >
                <span className="results-toolbar-btn__long">Súhrn odpovedí</span>
                <span className="results-toolbar-btn__short" aria-hidden>Súhrn</span>
              </button>
              {userId && (
                <button
                  type="button"
                  className="results-toolbar-btn"
                  onClick={() => setStep(1)}
                >
                  <span className="results-toolbar-btn__long">Vyplniť nový test</span>
                  <span className="results-toolbar-btn__short" aria-hidden>Nový test</span>
                </button>
              )}
              {!userId && (
                <>
                  <button
                    type="button"
                    className="results-toolbar-btn results-toolbar-btn--primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    aria-label={loading ? 'Ukladám výsledky' : 'Uložiť výsledky'}
                  >
                    <span className="results-toolbar-btn__long">{loading ? 'Ukladám...' : 'Uložiť výsledky'}</span>
                    <span className="results-toolbar-btn__short" aria-hidden>{loading ? '…' : 'Uložiť'}</span>
                  </button>
                  {saveError && saveError.includes('Prihláste sa') && (
                    <Link href="/login" className="results-toolbar-btn results-toolbar-btn--secondary">
                      <span className="results-toolbar-btn__long">Prihlásiť sa a uložiť</span>
                      <span className="results-toolbar-btn__short" aria-hidden>Prihlásiť</span>
                    </Link>
                  )}
                </>
              )}
              {userId && (
                <Link href="/" className="results-toolbar-btn results-toolbar-btn--primary">
                  <span className="results-toolbar-btn__long">Späť na domov</span>
                  <span className="results-toolbar-btn__short" aria-hidden>Domov</span>
                </Link>
              )}
              {!userId && saved && (
                <span className="results-toolbar-success">Výsledky boli uložené</span>
              )}
            </div>
            <div className="results-section results-section--full">
              <ResultsDashboard baseResults={results} completenessPercent={completenessPercent} />
            </div>
          </div>

          {showSummaryModal && (
            <div
              className="summary-modal-overlay"
              onClick={() => setShowSummaryModal(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Súhrn odpovedí"
            >
              <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
                <div className="summary-modal-header">
                  <h3>Súhrn odpovedí</h3>
                  <button ref={summaryCloseRef} type="button" className="summary-modal-close" onClick={() => setShowSummaryModal(false)}>
                    Zavrieť
                  </button>
                </div>
                <div className="summary">
                  <div className="summary-item">
                    <div className="summary-label">Email:</div>
                    <div className="summary-value">{email}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Meno:</div>
                    <div className="summary-value">{name}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Škola:</div>
                    <div className="summary-value">{school}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Ako sa dozvedel(a) o fakulte:</div>
                    <div className="summary-value">
                      {howDidYouHear.join(', ')}
                      {howDidYouHearOther && howDidYouHear.includes('Iné') && ` (${howDidYouHearOther})`}
                    </div>
                  </div>
                  {whyThisSchool.length > 0 && (
                    <div className="summary-item">
                      <div className="summary-label">Prečo si si vybral(a) túto fakultu:</div>
                      <div className="summary-value">{whyThisSchool.join(', ')}</div>
                    </div>
                  )}
                  {expectations.length > 0 && (
                    <div className="summary-item">
                      <div className="summary-label">Čo od štúdia očakávaš:</div>
                      <div className="summary-value">{expectations.join(', ')}</div>
                    </div>
                  )}
                  <div className="summary-item">
                    <div className="summary-label">Záujmy:</div>
                    <div className="summary-value">{interests.join(', ')}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Prax:</div>
                    <div className="summary-value">{experience.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEmailModal && (
            <div
              className="summary-modal-overlay"
              onClick={() => setShowEmailModal(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Doplniť email"
            >
              <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
                <div className="summary-modal-header">
                  <h3>Doplniť email</h3>
                  <button type="button" className="summary-modal-close" onClick={() => setShowEmailModal(false)}>
                    Zavrieť
                  </button>
                </div>
                <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Zadaj svoj email, aby sme mohli uložiť tvoje výsledky.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[type="email"]');
                    const value = input?.value?.trim();
                    if (value) {
                      setEmail(value);
                      setSaveError(null);
                      setShowEmailModal(false);
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div>
                    <label htmlFor="email-modal-input" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
                      Email
                    </label>
                    <input
                      id="email-modal-input"
                      type="email"
                      className="form-input"
                      placeholder="meno@email.sk"
                      defaultValue={email}
                      required
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="results-toolbar-btn"
                      onClick={() => setShowEmailModal(false)}
                    >
                      Zrušiť
                    </button>
                    <button type="submit" className="results-toolbar-btn results-toolbar-btn--primary">
                      Uložiť email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
      <div className="finder-form-fullscreen">
        {step === 0 && !isLoadingHistory && typeof document !== 'undefined' && createPortal(
          <div
            className="consent-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-modal-title"
            aria-describedby="consent-description"
          >
            <div className="consent-modal" onClick={(e) => e.stopPropagation()}>
              <Link
                href="/"
                className="consent-modal-close"
                aria-label="Zavrieť a vrátiť sa na úvodnú stránku"
              >
                <X size={20} strokeWidth={2.5} />
              </Link>
              <h2 id="consent-modal-title" className="consent-modal-title">
                Súhlas so spracovaním osobných údajov
              </h2>
              <div className="consent-modal-body">
                <div id="consent-description" className="consent-modal-text">
                  <p><strong>Správca:</strong> Fakulta elektrotechniky a informatiky Slovenskej technickej univerzity v Košiciach (FEI TUKE).</p>
                  <p><strong>Účel spracovania:</strong> Odporúčanie študijného programu na základe vašich odpovedí v dotazníku. Zozbierané údaje môžu byť využité na interný štatistický výskum fakulty; využitie na štatistiky nie je povinné.</p>
                  <p><strong>Rozsah údajov:</strong> Údaje vyplnené v dotazníku (meno, e-mail, škola, odkiaľ ste, vek, či plánujete študovať na TUKE, ako ste sa dozvedeli o fakulte, prečo ste si vybrali fakultu, očakávania, záujmy, prax) a výsledky odporúčania.</p>
                  <p><strong>Právny základ:</strong> Súhlas podľa čl. 6 ods. 1 písm. a) GDPR.</p>
                  <p><strong>Práva:</strong> Máte právo súhlas kedykoľvek odvolať, právo na prístup k údajom, na ich opravu alebo vymazanie, na obmedzenie spracovania a na podanie sťažnosti u dozorného úradu. Viac informácií, vrátane vašich práv, nájdete v zásadách ochrany osobných údajov.</p>
                  <p>
                    <Link href="/ochrana-udajov" className="consent-modal-link">Zásady ochrany osobných údajov</Link>
                  </p>
                </div>
              </div>
              <div className="consent-modal-footer">
                <label className="consent-modal-checkbox">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    aria-required
                    aria-describedby="consent-description"
                  />
                  <span>Súhlasím</span>
                </label>
                <Button
                  type="button"
                  color="primary"
                  className="step-button step-button-next consent-modal-btn"
                  onPress={() => {
                    if (consentChecked) {
                      setConsentChecked(true);
                      setStep(1);
                    }
                  }}
                  isDisabled={!consentChecked}
                >
                  Pokračovať
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
        <div className="finder-progress-bar" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={8} aria-label="Priebeh testu">
          <div className="finder-progress-bar-inner">
            <span className="finder-progress-label">
              Krok {step + 1} z 8
            </span>
            <div className="finder-progress-track">
              <div 
                className="finder-progress-fill" 
                style={{ width: `${((step + 1) / 8) * 100}%` }}
              />
            </div>
          </div>
          <div className="finder-progress-steps" aria-hidden>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <span 
                key={i} 
                className={`finder-progress-dot ${i <= step + 1 ? 'done' : ''} ${i === step + 1 ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>

        {step !== 0 && (
        <div className="form-section form-section--full">
          <div ref={stepCardRef} className={`card step-content step-visible`} key={step}>
          <h2 ref={stepTitleRef} className="card-title" tabIndex={-1}>
            {step === 1 && 'Tvoje meno'}
            {step === 2 && 'Tvoja škola'}
            {step === 3 && 'O vás'}
            {step === 4 && 'Ako sa dozvedel o škole'}
            {step === 5 && `Tvoje záujmy${interests.length > 0 ? ` (${interests.length} vybraných)` : ''}`}
            {step === 6 && `Tvoja prax${experience.length > 0 ? ` (${experience.length} vybraných)` : ''}`}
          </h2>

          {step === 1 && (
            <div className="form-group step-content">
              <label htmlFor="name" className="form-label">
                Ako sa voláš?
                {!name.trim() && <span className="error-hint"> (povinné)</span>}
              </label>
              {!name.trim() && (
                <div className="error-message" style={{ marginBottom: '12px' }}>
                  Meno je povinné
                </div>
              )}
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  className={`form-input ${!name.trim() ? 'form-input-error' : ''}`}
                  placeholder="Napríklad: Samuel"
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[^\p{L}\p{M}\s-]/gu, ''))}
                  autoComplete="name"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-group step-content">
              <label htmlFor="school" className="form-label">
                Na akej strednej škole si bol(a)?
                {!school && <span className="error-hint"> (povinné)</span>}
              </label>
              {!school && (
                <div className="error-message" style={{ marginBottom: '8px' }}>
                  Musíš vybrať školu
                </div>
              )}
              <select
                id="school"
                className={`form-select ${!school ? 'form-input-error' : ''}`}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <option value="">– Vyber školu –</option>
                <option value="Gymnázium">Gymnázium</option>
                <option value="SOŠ elektrotechnická">SOŠ elektrotechnická</option>
                <option value="SOŠ informačných technológií">SOŠ informačných technológií</option>
                <option value="Priemyslovka">Priemyslovka</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="form-group step-content">
              <label htmlFor="location-region" className="form-label">
                Odkiaľ si? (kraj)
              </label>
              <div className="input-wrapper" style={{ marginBottom: '16px' }}>
                <select
                  id="location-region"
                  className="form-select"
                  value={locationRegion}
                  onChange={(e) => {
                    setLocationRegion(e.target.value);
                    setLocationPart('');
                  }}
                >
                  <option value="">– Vyber kraj –</option>
                  {REGION_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              {locationRegion && (
                <>
                  <label htmlFor="location-part" className="form-label">
                    Konkrétnejšie (okres / mesto)
                  </label>
                  <div className="input-wrapper" style={{ marginBottom: '16px' }}>
                    <select
                      id="location-part"
                      className="form-select"
                      value={locationPart}
                      onChange={(e) => setLocationPart(e.target.value)}
                    >
                      <option value="">– Vyber –</option>
                      {(LOCATION_REGIONS[locationRegion] || []).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <label htmlFor="age" className="form-label">
                Koľko máš rokov?
              </label>
              <div className="input-wrapper" style={{ marginBottom: '16px' }}>
                <input
                  type="number"
                  id="age"
                  className="form-input"
                  min={7}
                  max={99}
                  step={1}
                  placeholder="Napríklad: 18"
                  value={age}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setAge(raw);
                  }}
                  onBlur={() => {
                    if (age === '') return;
                    const num = parseInt(age, 10);
                    if (Number.isNaN(num) || num < 7) setAge('');
                    else if (num > 99) setAge('99');
                  }}
                />
              </div>
              <div className="form-label" style={{ marginBottom: '8px' }}>
                Plánuješ študovať na TUKE?
              </div>
              <div className="chips-container">
                <ChipButton
                  label="Áno"
                  active={wantsToStudyAtTUKE === true}
                  onClick={() => setWantsToStudyAtTUKE(true)}
                />
                <ChipButton
                  label="Nie"
                  active={wantsToStudyAtTUKE === false}
                  onClick={() => setWantsToStudyAtTUKE(false)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-group step-content">
              <div className="form-label">
                Ako sa dozvedel(a) o fakulte FEI?
                {howDidYouHear.length === 0 && (
                  <span className="error-hint"> (povinné)</span>
                )}
              </div>
              {howDidYouHear.length === 0 && (
                <div className="error-message" style={{ marginBottom: '16px' }}>
                  Musíš vybrať aspoň jednu možnosť
                </div>
              )}
              <div className="chips-container">
                {['Cez kamaráta/známeho', 'Sociálne siete (Facebook, Instagram, TikTok)', 'Web stránka fakulty', 'Dni otvorených dverí', 'Stredoškolský učiteľ', 'Maturitná prednáška', 'Výstava/veľtrh', 'Školský poradca', 'Mediá (TV, rádio, tlač)', 'Iné'].map(option => (
                  <ChipButton
                    key={option}
                    label={option}
                    active={howDidYouHear.includes(option)}
                    onClick={() => {
                      if (howDidYouHear.includes(option)) {
                        setHowDidYouHear(howDidYouHear.filter(h => h !== option));
                        if (option === 'Iné') {
                          setHowDidYouHearOther('');
                        }
                      } else {
                        setHowDidYouHear([...howDidYouHear, option]);
                      }
                    }}
                  />
                ))}
              </div>
              {howDidYouHear.includes('Iné') && (
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="howDidYouHearOther" className="form-label">
                    Napíš, ako sa o fakulte dozvedel(a):
                  </label>
                  <input
                    type="text"
                    id="howDidYouHearOther"
                    className="form-input"
                    placeholder="Napríklad: cez spolupracujúcu firmu"
                    value={howDidYouHearOther}
                    onChange={(e) => setHowDidYouHearOther(e.target.value)}
                  />
                </div>
              )}
              
              <div className="form-label" style={{ marginTop: '32px' }}>
                Prečo si si vybral(a) túto fakultu? (voliteľné)
              </div>
              <div className="chips-container">
                {['Zaujímavé študijné programy', 'Dobrá reputácia', 'Blízko k domu', 'Tip od rodičov/rodiny', 'Možnosť brigády', 'Perspektívny odbor', 'Moderné vybavenie', 'Možnosť pokračovať v štúdiu'].map(option => (
                  <ChipButton
                    key={option}
                    label={option}
                    active={whyThisSchool.includes(option)}
                    onClick={() => {
                      if (whyThisSchool.includes(option)) {
                        setWhyThisSchool(whyThisSchool.filter(w => w !== option));
                      } else {
                        setWhyThisSchool([...whyThisSchool, option]);
                      }
                    }}
                  />
                ))}
              </div>
              
              <div className="form-label" style={{ marginTop: '32px' }}>
                Čo od štúdia očakávaš? (voliteľné)
              </div>
              <div className="chips-container">
                {['Praktické zručnosti', 'Teoretické vedomosti', 'Networking a kontakty', 'Výborné zamestnanie', 'Možnosť štúdia v zahraničí', 'Zaujímavé projekty', 'Kvalitné vzdelanie', 'Osobnostný rozvoj'].map(option => (
                  <ChipButton
                    key={option}
                    label={option}
                    active={expectations.includes(option)}
                    onClick={() => {
                      if (expectations.includes(option)) {
                        setExpectations(expectations.filter(e => e !== option));
                      } else {
                        setExpectations([...expectations, option]);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="form-group step-content">
              <div className="form-label">
                Vyber si aspoň jeden záujem
                {interests.length === 0 && (
                  <span className="error-hint"> (povinné)</span>
                )}
              </div>
              {interests.length === 0 && (
                <div className="error-message" style={{ marginBottom: '16px' }}>
                  Musíš vybrať aspoň jeden záujem
                </div>
              )}
              {interests.length === 0 && (
                <div className="empty-state-hint">
                  <div className="empty-state-icon"><Target size={32} strokeWidth={2} /></div>
                  <div className="empty-state-text">
                    Rozklikni kategórie a vyber si, čo ťa zaujíma. Môžeš vybrať viacero možností.
                  </div>
                </div>
              )}
              <div className="categories-container">
                {Object.entries(interestCategories).map(([category, items]) => (
                  <Category
                    key={category}
                    title={category}
                    items={items}
                    selected={interests}
                    onToggle={toggleInterest}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="form-group step-content">
              <div className="form-label">
                V akom odbore si pracoval(a)/brigadoval(a)?
                {experience.length === 0 && (
                  <span className="error-hint"> (povinné)</span>
                )}
              </div>
              {experience.length === 0 && (
                <div className="error-message" style={{ marginBottom: '16px' }}>
                  Musíš vybrať aspoň jednu možnosť (môžeš vybrať "Žiadny")
                </div>
              )}
              {experience.length === 0 && (
                <div className="empty-state-hint">
                  <div className="empty-state-icon"><Briefcase size={32} strokeWidth={2} /></div>
                  <div className="empty-state-text">
                    Ak si ešte nepracoval(a) alebo brigádoval(a), vyber možnosť <strong>"Žiadny"</strong> v kategórii <strong>"Bez praxe"</strong>.
                  </div>
                </div>
              )}
              <div className="categories-container">
                {Object.entries(experienceCategories).map(([category, items]) => (
                  <Category
                    key={category}
                    title={category}
                    items={items}
                    selected={experience}
                    onToggle={toggleExperience}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="step-buttons">
            {step === 0 ? null : (
              <Button
                type="button"
                color="primary"
                className="step-button step-button-next"
                onPress={nextStep}
                isDisabled={
                  (step === 1 && !name.trim()) ||
                  (step === 2 && !school) ||
                  (step === 4 && howDidYouHear.length === 0) ||
                  (step === 5 && interests.length === 0) ||
                  (step === 6 && experience.length === 0)
                }
              >
                Ďalej
              </Button>
            )}

            {step > 0 && step < 7 && (
              <Button
                type="button"
                variant="bordered"
                className="step-button step-button-back"
                onPress={prevStep}
              >
                Späť
              </Button>
            )}
          </div>

          </div>
        </div>
        )}
      </div>
      )}

      {userId && saved && (
        <ToastMessage 
          message="Výsledky boli úspešne uložené" 
          onClose={() => setSaved(false)}
        />
      )}
        </main>
      </div>
    </div>
  );
}

export default function FinderPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container finder-page">
          <AnimatedBackground />
        </div>
      }
    >
      <FinderContent />
    </Suspense>
  );
}

