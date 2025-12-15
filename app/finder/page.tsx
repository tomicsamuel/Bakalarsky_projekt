'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Program = {
  name: string;
  field: string;
  score: number;
};

const PROGRAMS: Program[] = [
  { name: 'Aplikovaná elektrotechnika', field: 'Elektrotechnika', score: 0 },
  { name: 'Automobilová elektronika', field: 'Elektrotechnika', score: 0 },
  { name: 'Elektroenergetika', field: 'Elektrotechnika', score: 0 },
  { name: 'Fyzikálne inžinierstvo progresívnych materiálov', field: 'Elektrotechnika', score: 0 },
  { name: 'Priemyselná elektrotechnika', field: 'Elektrotechnika', score: 0 },
  { name: 'Informatika', field: 'Informatika', score: 0 },
  { name: 'Kyberbezpečnosť', field: 'Informatika', score: 0 },
  { name: 'Počítačové modelovanie', field: 'Informatika', score: 0 },
  { name: 'Počítačové siete', field: 'Informatika', score: 0 },
  { name: 'Umelá inteligencia', field: 'Informatika', score: 0 },
];

type ChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className="chip"
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
    <div className="toast">
      <div className="toast-icon">✓</div>
      <div className="toast-message">{message}</div>
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
            <Chip
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

function calculateScores(
  school: string,
  interests: string[],
  experience: string[]
): Program[] {
  const programs = PROGRAMS.map(p => ({ ...p, score: 0 }));

  interests.forEach(interest => {
    switch (interest) {
      case 'Web programovanie':
      case 'Frontend programovanie':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Aplikačné programovanie':
      case 'Desktop aplikácie':
      case 'Mobilné aplikácie':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Herné programovanie':
        programs.forEach(p => {
          if (p.name === 'Informatika' || p.name === 'Počítačové modelovanie') p.score += 4;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Backend programovanie':
      case 'Full-stack programovanie':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 5;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Siete a sieťové technológie':
      case 'Systémová administrácia':
      case 'WiFi a bezdrôtové siete':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete') p.score += 5;
          else if (p.name === 'Kyberbezpečnosť') p.score += 2;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Bezpečnosť sietí':
      case 'Sieťová bezpečnosť':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete' || p.name === 'Kyberbezpečnosť') p.score += 5;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Cloud computing':
      case 'Virtualizácia':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete' || p.name === 'Informatika') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Databázy':
      case 'SQL':
      case 'NoSQL databázy':
        programs.forEach(p => {
          if (p.name === 'Informatika' || p.name === 'Počítačové modelovanie') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Big Data':
      case 'Data mining':
        programs.forEach(p => {
          if (p.name === 'Počítačové modelovanie') p.score += 5;
          else if (p.name === 'Informatika') p.score += 3;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Data Science':
      case 'Data Analytics':
        programs.forEach(p => {
          if (p.name === 'Počítačové modelovanie' || p.name === 'Umelá inteligencia') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'AI/ML':
      case 'Strojové učenie':
      case 'Hlboké učenie':
      case 'Neurónové siete':
        programs.forEach(p => {
          if (p.name === 'Umelá inteligencia') p.score += 5;
          else if (p.name === 'Počítačové modelovanie') p.score += 3;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Spracovanie prirodzeného jazyka':
      case 'Počítačové videnie':
        programs.forEach(p => {
          if (p.name === 'Umelá inteligencia') p.score += 5;
          else if (p.name === 'Počítačové modelovanie') p.score += 3;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Robotika a AI':
        programs.forEach(p => {
          if (p.name === 'Umelá inteligencia') p.score += 4;
          else if (p.name === 'Aplikovaná elektrotechnika' || p.name === 'Priemyselná elektrotechnika') p.score += 3;
          else if (p.field === 'Informatika' || p.field === 'Elektrotechnika') p.score += 1;
        });
        break;
      
      case 'Kyberbezpečnosť':
      case 'Ethical hacking':
      case 'Penetračné testovanie':
      case 'Kryptografia':
      case 'Informačná bezpečnosť':
      case 'Digitálna forenzika':
        programs.forEach(p => {
          if (p.name === 'Kyberbezpečnosť') p.score += 5;
          else if (p.name === 'Počítačové siete') p.score += 2;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Elektronika':
      case 'Mikroprocesory':
      case 'Mikrokontroléry':
      case 'Arduino/Raspberry Pi':
      case 'Digitálna elektronika':
      case 'Analógová elektronika':
      case 'Elektronické obvody':
        programs.forEach(p => {
          if (
            p.name === 'Aplikovaná elektrotechnika' ||
            p.name === 'Automobilová elektronika' ||
            p.name === 'Priemyselná elektrotechnika'
          ) {
            p.score += 4;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 2;
          }
        });
        break;
      
      case 'Robotika':
        programs.forEach(p => {
          if (p.name === 'Aplikovaná elektrotechnika' || p.name === 'Priemyselná elektrotechnika') {
            p.score += 4;
          } else if (p.name === 'Umelá inteligencia') {
            p.score += 3;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 2;
          }
        });
        break;
      
      case 'Automatizácia':
      case 'PLC programovanie':
      case 'SCADA systémy':
      case 'Priemyselná automatizácia':
      case 'Riadiace systémy':
        programs.forEach(p => {
          if (p.name === 'Priemyselná elektrotechnika' || p.name === 'Aplikovaná elektrotechnika') {
            p.score += 5;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 2;
          }
        });
        break;
      
      case 'Energetika':
      case 'Obnoviteľné zdroje':
      case 'Solárna energia':
      case 'Veterná energia':
      case 'Energetická efektívnosť':
      case 'Smart grid':
      case 'Elektrické stroje':
        programs.forEach(p => {
          if (p.name === 'Elektroenergetika') p.score += 5;
          else if (p.field === 'Elektrotechnika') p.score += 2;
        });
        break;
      
      case 'Fyzika':
      case 'Materiálové inžinierstvo':
      case 'Nanotechnológie':
      case 'Kvantová fyzika':
      case 'Optika':
      case 'Magnetizmus':
        programs.forEach(p => {
          if (p.name === 'Fyzikálne inžinierstvo progresívnych materiálov') {
            p.score += 5;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 1;
          }
        });
        break;
      
      case 'PC':
        programs.forEach(p => {
          if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Lietadlá':
      case 'Automobilový priemysel':
        programs.forEach(p => {
          if (p.name === 'Automobilová elektronika') p.score += 3;
          else if (p.field === 'Elektrotechnika') p.score += 1;
        });
        break;
      
      case 'Administratíva':
      case 'Projektový manažment':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 2;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Grafika a dizajn':
        programs.forEach(p => {
          if (p.name === 'Informatika' || p.name === 'Počítačové modelovanie') p.score += 2;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
    }
  });

  switch (school) {
    case 'SOŠ elektrotechnická':
    case 'Priemyslovka':
      programs.forEach(p => {
        if (p.field === 'Elektrotechnika') p.score += 2;
      });
      break;
    
    case 'SOŠ informačných technológií':
      programs.forEach(p => {
        if (p.field === 'Informatika') p.score += 2;
      });
      break;
    
    case 'Gymnázium':
      programs.forEach(p => {
        p.score += 1;
      });
      break;
  }

  experience.forEach(exp => {
    switch (exp) {
      case 'IT support':
        programs.forEach(p => {
          if (
            p.name === 'Informatika' ||
            p.name === 'Kyberbezpečnosť' ||
            p.name === 'Počítačové siete'
          ) {
            p.score += 3;
          } else if (p.field === 'Informatika') {
            p.score += 1;
          }
        });
        break;
      
      case 'Web programovanie':
      case 'Frontend vývoj':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Aplikačné programovanie':
      case 'Mobilné aplikácie':
      case 'Desktop aplikácie':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Backend vývoj':
      case 'Full-stack vývoj':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 5;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Herný vývoj':
        programs.forEach(p => {
          if (p.name === 'Informatika' || p.name === 'Počítačové modelovanie') p.score += 4;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Siete a administrácia':
      case 'Systémová administrácia':
      case 'Server administrácia':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete') p.score += 5;
          else if (p.name === 'Kyberbezpečnosť') p.score += 3;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Cloud administrácia':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete' || p.name === 'Informatika') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Sieťová bezpečnosť':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete' || p.name === 'Kyberbezpečnosť') p.score += 5;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Databázy':
      case 'Database administrácia':
        programs.forEach(p => {
          if (p.name === 'Informatika' || p.name === 'Počítačové modelovanie') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Data Science':
      case 'Data Analytics':
      case 'Big Data':
        programs.forEach(p => {
          if (p.name === 'Počítačové modelovanie' || p.name === 'Umelá inteligencia') p.score += 4;
          else if (p.field === 'Informatika') p.score += 2;
        });
        break;
      
      case 'Kyberbezpečnosť':
      case 'Penetračné testovanie':
      case 'Security analýza':
      case 'Incident response':
        programs.forEach(p => {
          if (p.name === 'Kyberbezpečnosť') p.score += 5;
          else if (p.name === 'Počítačové siete') p.score += 2;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      case 'Servis elektroniky':
      case 'Opravy elektroniky':
      case 'Montáž elektroniky':
      case 'Elektrické merania':
        programs.forEach(p => {
          if (
            p.name === 'Aplikovaná elektrotechnika' ||
            p.name === 'Automobilová elektronika' ||
            p.name === 'Priemyselná elektrotechnika'
          ) {
            p.score += 4;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 2;
          }
        });
        break;
      
      case 'Elektroinštalácie':
      case 'Elektrické inštalácie':
        programs.forEach(p => {
          if (p.name === 'Elektroenergetika' || p.name === 'Priemyselná elektrotechnika') {
            p.score += 4;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 2;
          }
        });
        break;
      
      case 'Automatizácia':
      case 'PLC programovanie':
      case 'SCADA systémy':
      case 'Priemyselná automatizácia':
      case 'Robotika':
        programs.forEach(p => {
          if (p.name === 'Priemyselná elektrotechnika' || p.name === 'Aplikovaná elektrotechnika') {
            p.score += 5;
          } else if (p.field === 'Elektrotechnika') {
            p.score += 2;
          }
        });
        break;
      
      case 'Energetika':
      case 'Elektrické rozvodne':
      case 'Energetické audity':
      case 'Obnoviteľné zdroje':
        programs.forEach(p => {
          if (p.name === 'Elektroenergetika') p.score += 5;
          else if (p.field === 'Elektrotechnika') p.score += 2;
        });
        break;
      
      case 'Auto servis':
        programs.forEach(p => {
          if (p.name === 'Automobilová elektronika') p.score += 4;
          else if (p.field === 'Elektrotechnika') p.score += 1;
        });
        break;
      
      case 'Administratíva':
      case 'Projektový manažment':
      case 'Technická dokumentácia':
        programs.forEach(p => {
          if (p.name === 'Informatika') p.score += 2;
          else if (p.field === 'Informatika') p.score += 1;
        });
        break;
    }
  });

  const maxScore = Math.max(...programs.map(p => p.score), 1);
  
  programs.forEach(p => {
    p.score = Math.round((p.score / maxScore) * 100);
  });

  return programs
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export default function FinderPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [howDidYouHear, setHowDidYouHear] = useState<string[]>([]);
  const [howDidYouHearOther, setHowDidYouHearOther] = useState('');
  const [whyThisSchool, setWhyThisSchool] = useState<string[]>([]);
  const [expectations, setExpectations] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [results, setResults] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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
    }
  }, [searchParams]);

  const loadUserHistory = async (accountId: number) => {
    try {
      const response = await fetch(`/api/user-results?accountId=${accountId}`);
      const data = await response.json();
      
      if (data.success && data.hasHistory) {
        setName(data.data.name);
        setEmail(data.data.email);
        setSchool(data.data.school);
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
        setStep(6);
        setSaved(true);
      }
    } catch (error) {
      console.error('Chyba pri načítaní histórie:', error);
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
      const scored = calculateScores(school, interests, experience);
      setResults(scored);
    }
  }, [name, school, interests, experience]);

  const nextStep = async () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !school) return;
    if (step === 3 && howDidYouHear.length === 0) return;
    if (step === 4 && interests.length === 0) return;
    if (step === 5 && experience.length === 0) return;
    
      if (step === 5 && userId) {
      const success = await handleSubmit();
      if (success && step < 7) {
        setStep(step + 1);
        // Smooth scroll k výsledkom
        setTimeout(() => {
          const resultsCard = document.querySelector('.results-card');
          if (resultsCard) {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      return;
    }
    
    if (step < 7) {
      setStep(step + 1);
      // Smooth scroll k výsledkom po kroku 2, 3, 4, 5
      if (step >= 2 && step < 6) {
        setTimeout(() => {
          const resultsCard = document.querySelector('.results-card');
          if (resultsCard) {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSaved(false);

    if (name.trim()) {
      try {
        setLoading(true);

        const requestData = {
          name: name.trim(),
          email: email,
          school,
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
          console.error('Chyba:', data.error);
          return false;
        }

      } catch (error) {
        console.error('Chyba pri volaní API:', error);
        return false;
      } finally {
        setLoading(false);
      }
    }
    return false;
  };

  return (
    <div className="page-container">
      <Link href="/" className="logo" style={{ display: 'inline-block', textDecoration: 'none' }}>
        FEI TUKE
      </Link>

      {userId && (
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="logout-button"
        >
          Odhlásiť sa
        </button>
      )}

      <div className="deadline-badge">
        <div>Prihlášky</div>
        <div>do 30 6025</div>
      </div>

      <header className="page-header">
        <h1 className="page-title">
          Zisti, aké odbory<br />sa ti hodia na fakultu
        </h1>
        <div className="stepper">
          <div className="stepper-item">
            <div className={`stepper-dot ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className="stepper-label">Meno</div>
          </div>
          <div className={`stepper-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className="stepper-item">
            <div className={`stepper-dot ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className="stepper-label">Škola</div>
          </div>
          <div className={`stepper-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className="stepper-item">
            <div className={`stepper-dot ${step >= 3 ? 'active' : ''} ${step === 3 ? 'current' : ''}`}>
              {step > 3 ? '✓' : '3'}
            </div>
            <div className="stepper-label">Info</div>
          </div>
          <div className={`stepper-line ${step >= 4 ? 'active' : ''}`}></div>
          <div className="stepper-item">
            <div className={`stepper-dot ${step >= 4 ? 'active' : ''} ${step === 4 ? 'current' : ''}`}>
              {step > 4 ? '✓' : '4'}
            </div>
            <div className="stepper-label">Záujmy</div>
          </div>
          <div className={`stepper-line ${step >= 5 ? 'active' : ''}`}></div>
          <div className="stepper-item">
            <div className={`stepper-dot ${step >= 5 ? 'active' : ''} ${step === 5 ? 'current' : ''}`}>
              {step > 5 ? '✓' : '5'}
            </div>
            <div className="stepper-label">Prax</div>
          </div>
          <div className={`stepper-line ${step >= 6 ? 'active' : ''}`}></div>
          <div className="stepper-item">
            <div className={`stepper-dot ${step >= 6 ? 'active' : ''} ${step === 6 ? 'current' : ''}`}>
              ✓
            </div>
            <div className="stepper-label">Výsledky</div>
          </div>
        </div>
      </header>

      <div className="content-grid">
        <div className={`card step-content step-visible`} key={step}>
          <h2 className="card-title">
            {step === 1 && 'Tvoje meno'}
            {step === 2 && 'Tvoja škola'}
            {step === 3 && 'Ako sa dozvedel o škole'}
            {step === 4 && `Tvoje záujmy${interests.length > 0 ? ` (${interests.length} vybraných)` : ''}`}
            {step === 5 && `Tvoja prax${experience.length > 0 ? ` (${experience.length} vybraných)` : ''}`}
            {step === 6 && 'Súhrn tvojich odpovedí'}
          </h2>

          {step === 1 && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Ako sa voláš?
                {!name.trim() && <span className="error-hint"> (povinné)</span>}
              </label>
              {!name.trim() && (
                <div className="error-message" style={{ marginBottom: '8px' }}>
                  Meno je povinné
                </div>
              )}
              <input
                type="text"
                id="name"
                className={`form-input ${!name.trim() ? 'form-input-error' : ''}`}
                placeholder="Samuel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="form-group">
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
            <div className="form-group">
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
                  <Chip
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
                  <Chip
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
                  <Chip
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

          {step === 4 && (
            <div className="form-group">
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
                  <div className="empty-state-icon">🎯</div>
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

          {step === 5 && (
            <div className="form-group">
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
                  <div className="empty-state-icon">💼</div>
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

          {step === 6 && (
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
                  {howDidYouHearOther && howDidYouHear.includes('Iné') && (
                    <span> ({howDidYouHearOther})</span>
                  )}
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
          )}

          <div className="step-buttons">
            {step > 1 && step < 6 && (
              <button
                type="button"
                className="step-button step-button-back"
                onClick={prevStep}
              >
                Späť
              </button>
            )}
            
            {step === 6 && userId && (
              <button
                type="button"
                className="step-button step-button-back"
                onClick={() => setStep(1)}
              >
                Vyplniť nový test
              </button>
            )}
            
            {step < 6 ? (
              <button
                type="button"
                className="step-button step-button-next"
                onClick={nextStep}
                disabled={
                  (step === 1 && !name.trim()) ||
                  (step === 2 && !school) ||
                  (step === 3 && howDidYouHear.length === 0) ||
                  (step === 4 && interests.length === 0)
                }
              >
                Ďalej
              </button>
            ) : step === 5 ? (
              <button
                type="button"
                className="step-button step-button-next"
                onClick={nextStep}
                disabled={experience.length === 0}
              >
                Ďalej
              </button>
            ) : userId ? (
              <Link href="/" className="step-button step-button-next" style={{ textAlign: 'center', textDecoration: 'none' }}>
                Späť na domov
              </Link>
            ) : (
              <button
                type="button"
                className="cta-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Ukladám...
                  </>
                ) : (
                  'Uložiť výsledky'
                )}
              </button>
            )}
          </div>

          {!userId && saved && (
            <div style={{ 
              marginTop: '12px', 
              padding: '12px', 
              background: '#4ade80', 
              color: '#0B0F14', 
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: 600
            }}>
              Výsledky boli úspešne uložené do databázy
            </div>
          )}
        </div>

        <div className="card results-card">
          <h2 className="card-title">
            Odbory, ktoré sa k tebe najviac hodia
          </h2>

          {results.length === 0 ? (
            <div className="empty-state">
              Postupne odpovedaj na otázky a uvidíš výsledky
            </div>
          ) : (
            <div className="results-list">
              {results.map((program, index) => (
                <div key={index} className="result-item">
                  <div className="result-header">
                    <div style={{ flex: 1 }}>
                      <Link 
                        href={`/program/${encodeURIComponent(program.name)}/${encodeURIComponent(program.field)}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="result-title" style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                          {program.name}
                        </div>
                      </Link>
                      <div className="result-subtitle">{program.field}</div>
                    </div>
                    <div className="result-percent">{program.score} %</div>
                  </div>
                  <ProgressBar percent={program.score} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {userId && saved && (
        <ToastMessage 
          message="Výsledky boli úspešne uložené" 
          onClose={() => setSaved(false)}
        />
      )}
    </div>
  );
}

