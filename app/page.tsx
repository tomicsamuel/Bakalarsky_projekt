'use client'; // Next.js direktíva – tento komponent beží na klientovi

import { useState } from 'react';

/* ========================================
   DÁTA ŠTUDIJNÝCH PROGRAMOV
   ======================================== */

// Typ pre študijný program (aby TypeScript vedel, čo očakávať)
type Program = {
  name: string;        // názov programu napr. "Kyberbezpečnosť"
  field: string;       // odbor napr. "Informatika" alebo "Elektrotechnika"
  score: number;       // vypočítané skóre (začína 0)
};

// Všetky programy FEI – každý začína so skóre 0
const PROGRAMS: Program[] = [
  // Elektrotechnické programy
  { name: 'Aplikovaná elektrotechnika', field: 'Elektrotechnika', score: 0 },
  { name: 'Automobilová elektronika', field: 'Elektrotechnika', score: 0 },
  { name: 'Elektroenergetika', field: 'Elektrotechnika', score: 0 },
  { name: 'Fyzikálne inžinierstvo progresívnych materiálov', field: 'Elektrotechnika', score: 0 },
  { name: 'Priemyselná elektrotechnika', field: 'Elektrotechnika', score: 0 },
  
  // Informatické programy
  { name: 'Hospodárska informatika', field: 'Informatika', score: 0 },
  { name: 'Informatika', field: 'Informatika', score: 0 },
  { name: 'Inteligentné systémy', field: 'Informatika', score: 0 },
  { name: 'Kyberbezpečnosť', field: 'Informatika', score: 0 },
  { name: 'Počítačové modelovanie', field: 'Informatika', score: 0 },
  { name: 'Počítačové siete', field: 'Informatika', score: 0 },
  { name: 'Aplikovaná informatika', field: 'Informatika', score: 0 },
];

/* ========================================
   POMOCNÝ KOMPONENT: CHIP
   Klikateľné tlačidlo, ktoré sa dá zapnúť/vypnúť
   ======================================== */

type ChipProps = {
  label: string;           // text na chipe
  active: boolean;         // je zapnutý?
  onClick: () => void;     // čo sa stane po kliknutí
};

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={active}  // prístupnosť – screen reader vie, že je pressed
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* ========================================
   POMOCNÝ KOMPONENT: PROGRESS BAR
   Ukazuje percentuálny postup farbou
   ======================================== */

type ProgressBarProps = {
  percent: number;  // 0 až 100
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

/* ========================================
   SCORING FUNKCIA
   Vypočíta skóre pre každý program na základe
   používateľských odpovedí
   ======================================== */

function calculateScores(
  school: string,
  interests: string[],
  experience: string[]
): Program[] {
  // Skopírujeme programy, aby sme mohli počítať skóre
  const programs = PROGRAMS.map(p => ({ ...p, score: 0 }));

  // 1) ZÁUJMY – najdôležitejšia časť
  interests.forEach(interest => {
    switch (interest) {
      // Programovanie a AI → informatické programy +3
      case 'Programovanie':
      case 'AI/ML':
        programs.forEach(p => {
          if (p.field === 'Informatika') p.score += 3;
        });
        break;
      
      // Siete → extra +4 pre Počítačové siete
      case 'Siete':
        programs.forEach(p => {
          if (p.name === 'Počítačové siete') p.score += 4;
        });
        break;
      
      // Kyberbezpečnosť → extra +4 pre Kyberbezpečnosť
      case 'Kyberbezpečnosť':
        programs.forEach(p => {
          if (p.name === 'Kyberbezpečnosť') p.score += 4;
        });
        break;
      
      // Elektronika/Robotika → elektrotechnické +3
      case 'Elektronika':
      case 'Robotika':
        programs.forEach(p => {
          if (
            p.name === 'Aplikovaná elektrotechnika' ||
            p.name === 'Automobilová elektronika' ||
            p.name === 'Priemyselná elektrotechnika'
          ) {
            p.score += 3;
          }
        });
        break;
      
      // Fyzika → Fyzikálne inžinierstvo +3
      case 'Fyzika':
        programs.forEach(p => {
          if (p.name === 'Fyzikálne inžinierstvo progresívnych materiálov') {
            p.score += 3;
          }
        });
        break;
      
      // PC → všetky informatické +1
      case 'PC':
        programs.forEach(p => {
          if (p.field === 'Informatika') p.score += 1;
        });
        break;
      
      // Lietadlá → Automobilová elektronika +1
      case 'Lietadlá':
        programs.forEach(p => {
          if (p.name === 'Automobilová elektronika') p.score += 1;
        });
        break;
      
      // Administratíva → Hospodárska informatika +1
      case 'Administratíva':
        programs.forEach(p => {
          if (p.name === 'Hospodárska informatika') p.score += 1;
        });
        break;
    }
  });

  // 2) STREDNÁ ŠKOLA – bonus podľa typu školy
  switch (school) {
    case 'SOŠ elektrotechnická':
    case 'Priemyslovka':
      // Elektrotechnická škola → elektro programy +2
      programs.forEach(p => {
        if (p.field === 'Elektrotechnika') p.score += 2;
      });
      break;
    
    case 'SOŠ informačných technológií':
      // IT škola → info programy +2
      programs.forEach(p => {
        if (p.field === 'Informatika') p.score += 2;
      });
      break;
    
    case 'Gymnázium':
      // Gymnázium → všetky programy +1 (všeobecný základ)
      programs.forEach(p => {
        p.score += 1;
      });
      break;
  }

  // 3) PRAX – skúsenosť z brigád
  experience.forEach(exp => {
    switch (exp) {
      case 'IT support':
        // IT support → Info, Kyber, Siete +2
        programs.forEach(p => {
          if (
            p.name === 'Informatika' ||
            p.name === 'Kyberbezpečnosť' ||
            p.name === 'Počítačové siete'
          ) {
            p.score += 2;
          }
        });
        break;
      
      case 'Servis elektroniky':
      case 'Elektroinštalácie':
        // Servis → elektro programy +2
        programs.forEach(p => {
          if (p.field === 'Elektrotechnika') p.score += 2;
        });
        break;
      
      case 'Administratíva':
        // Admin → Hospodárska informatika +1
        programs.forEach(p => {
          if (p.name === 'Hospodárska informatika') p.score += 1;
        });
        break;
      
      // "Žiadny" neprináša žiadne body
    }
  });

  // 4) NORMALIZÁCIA NA PERCENTÁ
  // Nájdeme najvyššie skóre
  const maxScore = Math.max(...programs.map(p => p.score), 1); // min 1, aby sme nedelili nulou
  
  // Prepočítame každé skóre na percentá 0–100
  programs.forEach(p => {
    p.score = Math.round((p.score / maxScore) * 100);
  });

  // 5) ZORADÍME ZOSTUPNE (najlepšie hore) a vrátíme TOP 5
  return programs
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

/* ========================================
   HLAVNÝ KOMPONENT: FEI FINDER
   ======================================== */

export default function Home() {
  // State (stav) – React si pamätá tieto hodnoty
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [results, setResults] = useState<Program[]>([]);

  // Možnosti pre záujmy
  const interestOptions = [
    'PC', 'Programovanie', 'Siete', 'Elektronika', 'Fyzika',
    'AI/ML', 'Kyberbezpečnosť', 'Robotika', 'Lietadlá', 'Administratíva'
  ];

  // Možnosti pre prax
  const experienceOptions = [
    'Žiadny', 'IT support', 'Servis elektroniky', 'Auto servis',
    'Administratíva', 'Elektroinštalácie'
  ];

  // Funkcia na zapnutie/vypnutie chipu v záujmoch
  const toggleInterest = (value: string) => {
    if (interests.includes(value)) {
      // Ak už je zapnutý → vypneme ho
      setInterests(interests.filter(i => i !== value));
    } else {
      // Inak → pridáme ho
      setInterests([...interests, value]);
    }
  };

  // Funkcia na zapnutie/vypnutie chipu v praxi
  const toggleExperience = (value: string) => {
    if (experience.includes(value)) {
      setExperience(experience.filter(e => e !== value));
    } else {
      setExperience([...experience, value]);
    }
  };

  // Funkcia pri kliknutí na "Zobraziť výsledky"
  const handleSubmit = () => {
    const scored = calculateScores(school, interests, experience);
    setResults(scored);
  };

  return (
    <div className="page-container">
      {/* Logo v ľavom hornom rohu */}
      <div className="logo">FEI TUKE</div>

      {/* Badge s termínom */}
      <div className="deadline-badge">
        <div>Prihlášky</div>
        <div>do 30 6025</div>
      </div>

      {/* Header – nadpis a stepper */}
      <header className="page-header">
        <h1 className="page-title">
          Zisti, aké odbory<br />sa ti hodia na fakultu
        </h1>
        <div className="stepper">
          <div className="stepper-dot">1</div>
          <div className="stepper-dot">2</div>
          <div className="stepper-dot">3</div>
          <div className="stepper-dot">4</div>
        </div>
      </header>

      {/* Dva stĺpce: formulár + výsledky */}
      <div className="content-grid">
        {/* ĽAVÁ KARTA: Formulár */}
        <div className="card">
          <h2 className="card-title">Tvoje údaje</h2>

          {/* Meno */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Tvoje meno
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Samuel"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Stredná škola */}
          <div className="form-group">
            <label htmlFor="school" className="form-label">
              Na akej strednej škole si bol(a)
            </label>
            <select
              id="school"
              className="form-select"
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

          {/* Záujmy */}
          <div className="form-group">
            <div className="form-label">Aké sú tvoje záujmy</div>
            <div className="chips-container">
              {interestOptions.map(option => (
                <Chip
                  key={option}
                  label={option}
                  active={interests.includes(option)}
                  onClick={() => toggleInterest(option)}
                />
              ))}
            </div>
          </div>

          {/* Prax */}
          <div className="form-group">
            <div className="form-label">
              V akom odbore si pracoval(a)/brigadoval(a)
            </div>
            <div className="chips-container">
              {experienceOptions.map(option => (
                <Chip
                  key={option}
                  label={option}
                  active={experience.includes(option)}
                  onClick={() => toggleExperience(option)}
                />
              ))}
            </div>
          </div>

          {/* CTA tlačidlo */}
          <button
            type="button"
            className="cta-button"
            onClick={handleSubmit}
          >
            Zobraziť výsledky
          </button>
        </div>

        {/* PRAVÁ KARTA: Výsledky */}
        <div className="card">
          <h2 className="card-title">
            Odbory, ktoré sa k tebe najviac hodia
          </h2>

          {results.length === 0 ? (
            // Prázdny stav – ešte neboli vygenerované výsledky
            <div className="empty-state">
              Vyber svoje údaje a klikni na „Zobraziť výsledky"
            </div>
          ) : (
            // Zobrazíme TOP 5 programov
            <div className="results-list">
              {results.map((program, index) => (
                <div key={index} className="result-item">
                  <div className="result-header">
                    <div>
                      <div className="result-title">{program.name}</div>
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
    </div>
  );
}
