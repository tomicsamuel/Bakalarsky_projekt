'use client'



// Importujeme useState z Reactu pre správu stavu (dát) v komponente
import { useState } from 'react'



// Typ pre študijný program - popisuje jeden odbor na FEI
type StudijnyProgram = {
  nazov: string           // Napríklad "Kyberbezpečnosť"
  odbor: string           // Napríklad "Informatika"
  score: number           // Počiatočné skóre (vždy 0)
}

// Typ pre výsledok s percentuálnou zhodou
type VysledokProgram = {
  nazov: string
  odbor: string
  percento: number        // Zhoda v percentách (0-100)
}

/* ─────────────────────────────────────────────────────────────────
   DÁTA PROGRAMOV (hard-coded zoznam všetkých odborov na FEI)
   ───────────────────────────────────────────────────────────────── */

const PROGRAMY: StudijnyProgram[] = [
  // Elektrotechnické odbory
  { nazov: 'Aplikovaná elektrotechnika', odbor: 'Elektrotechnika', score: 0 },
  { nazov: 'Automobilová elektronika', odbor: 'Elektrotechnika', score: 0 },
  { nazov: 'Elektroenergetika', odbor: 'Elektrotechnika', score: 0 },
  { nazov: 'Fyzikálne inžinierstvo progresívnych materiálov', odbor: 'Elektrotechnika', score: 0 },
  { nazov: 'Priemyselná elektrotechnika', odbor: 'Elektrotechnika', score: 0 },
  
  // Informatické odbory
  { nazov: 'Hospodárska informatika', odbor: 'Informatika', score: 0 },
  { nazov: 'Informatika', odbor: 'Informatika', score: 0 },
  { nazov: 'Inteligentné systémy', odbor: 'Informatika', score: 0 },
  { nazov: 'Kyberbezpečnosť', odbor: 'Informatika', score: 0 },
  { nazov: 'Počítačové modelovanie', odbor: 'Informatika', score: 0 },
  { nazov: 'Počítačové siete', odbor: 'Informatika', score: 0 },
  { nazov: 'Aplikovaná informatika', odbor: 'Informatika', score: 0 },
]

/* ─────────────────────────────────────────────────────────────────
   ZOZNAMY PRE CHIPS (možnosti záujmov a praxe)
   ───────────────────────────────────────────────────────────────── */

const ZAUIMY = [
  'PC', 'Programovanie', 'Siete', 'Elektronika', 'Fyzika', 
  'AI/ML', 'Kyberbezpečnosť', 'Robotika', 'Lietadlá', 'Administratíva'
]

const PRAX = [
  'Žiadny', 'IT support', 'Servis elektroniky', 'Auto servis', 
  'Administratíva', 'Elektroinštalácie'
]

/* ─────────────────────────────────────────────────────────────────
   SCORING FUNKCIA (výpočet zhody používateľa s jednotlivými odbormi)
   ───────────────────────────────────────────────────────────────── */

function vypocitajScore(
  skola: string,
  zauimy: string[],
  prax: string[]
): VysledokProgram[] {
  
  // Vytvoríme kópiu programov, aby sme mohli pridávať body
  const programySoScore = PROGRAMY.map(p => ({ ...p }))
  
  // ─────────────────────────────────────────────────
  // 1. BODY ZA ZÁUJMY
  // ─────────────────────────────────────────────────
  
  zauimy.forEach(zaujm => {
    switch (zaujm) {
      
      // Programovanie a AI/ML → +3 pre základné informatické odbory
      case 'Programovanie':
      case 'AI/ML':
        programySoScore.forEach(p => {
          if (['Informatika', 'Aplikovaná informatika', 'Inteligentné systémy'].includes(p.nazov)) {
            p.score += 3
          }
        })
        break
      
      // Siete → +4 pre Počítačové siete (špecializácia)
      case 'Siete':
        programySoScore.forEach(p => {
          if (p.nazov === 'Počítačové siete') {
            p.score += 4
          }
        })
        break
      
      // Kyberbezpečnosť → +4 pre Kyberbezpečnosť (špecializácia)
      case 'Kyberbezpečnosť':
        programySoScore.forEach(p => {
          if (p.nazov === 'Kyberbezpečnosť') {
            p.score += 4
          }
        })
        break
      
      // Elektronika a Robotika → +3 pre aplikované elektrotechnické odbory
      case 'Elektronika':
      case 'Robotika':
        programySoScore.forEach(p => {
          if (['Aplikovaná elektrotechnika', 'Automobilová elektronika', 'Priemyselná elektrotechnika'].includes(p.nazov)) {
            p.score += 3
          }
        })
        break
      
      // Fyzika → +3 pre Fyzikálne inžinierstvo
      case 'Fyzika':
        programySoScore.forEach(p => {
          if (p.nazov === 'Fyzikálne inžinierstvo progresívnych materiálov') {
            p.score += 3
          }
        })
        break
      
      // PC → +1 pre všetky informatické odbory (všeobecný záujem)
      case 'PC':
        programySoScore.forEach(p => {
          if (p.odbor === 'Informatika') {
            p.score += 1
          }
        })
        break
      
      // Lietadlá → +1 pre Automobilová elektronika (vozidlová elektronika)
      case 'Lietadlá':
        programySoScore.forEach(p => {
          if (p.nazov === 'Automobilová elektronika') {
            p.score += 1
          }
        })
        break
      
      // Administratíva → +1 pre Hospodárska informatika (biznis zameranie)
      case 'Administratíva':
        programySoScore.forEach(p => {
          if (p.nazov === 'Hospodárska informatika') {
            p.score += 1
          }
        })
        break
    }
  })
  
  // ─────────────────────────────────────────────────
  // 2. BODY ZA STREDNÚ ŠKOLU
  // ─────────────────────────────────────────────────
  
  switch (skola) {
    // SOŠ elektrotechnická alebo Priemyslovka → +2 pre elektrotechniku
    case 'SOŠ elektrotechnická':
    case 'Priemyslovka':
      programySoScore.forEach(p => {
        if (p.odbor === 'Elektrotechnika') {
          p.score += 2
        }
      })
      break
    
    // SOŠ IT → +2 pre informatiku
    case 'SOŠ informačných technológií':
      programySoScore.forEach(p => {
        if (p.odbor === 'Informatika') {
          p.score += 2
        }
      })
      break
    
    // Gymnázium → +1 pre všetky (všeobecné vzdelanie)
    case 'Gymnázium':
      programySoScore.forEach(p => {
        p.score += 1
      })
      break
  }
  
  // ─────────────────────────────────────────────────
  // 3. BODY ZA PRAX/BRIGÁDY
  // ─────────────────────────────────────────────────
  
  prax.forEach(p => {
    switch (p) {
      
      // IT support → +2 pre Informatika, Kyberbezpečnosť a Siete
      case 'IT support':
        programySoScore.forEach(prog => {
          if (['Informatika', 'Kyberbezpečnosť', 'Počítačové siete'].includes(prog.nazov)) {
            prog.score += 2
          }
        })
        break
      
      // Servis elektroniky alebo Elektroinštalácie → +2 pre elektrotechniku
      case 'Servis elektroniky':
      case 'Elektroinštalácie':
        programySoScore.forEach(prog => {
          if (prog.odbor === 'Elektrotechnika') {
            prog.score += 2
          }
        })
        break
      
      // Administratíva → +1 pre Hospodárska informatika
      case 'Administratíva':
        programySoScore.forEach(prog => {
          if (prog.nazov === 'Hospodárska informatika') {
            prog.score += 1
          }
        })
        break
      
      // Žiadny → žiadne body
      case 'Žiadny':
        break
    }
  })
  
  // ─────────────────────────────────────────────────
  // 4. NORMALIZÁCIA NA PERCENTÁ
  // ─────────────────────────────────────────────────
  
  // Nájdeme najvyššie skóre
  const maxScore = Math.max(...programySoScore.map(p => p.score))
  
  // Ak je maximálne skóre 0, všetky programy budú mať 0%
  if (maxScore === 0) {
    return programySoScore.map(p => ({
      nazov: p.nazov,
      odbor: p.odbor,
      percento: 0
    }))
  }
  
  // Prevedieme skóre na percentá (0-100) a zaokrúhlime
  const vysledky: VysledokProgram[] = programySoScore.map(p => ({
    nazov: p.nazov,
    odbor: p.odbor,
    percento: Math.round((p.score / maxScore) * 100)
  }))
  
  // Zoradíme zostupne (najvyššie percento prvé)
  vysledky.sort((a, b) => b.percento - a.percento)
  
  // Vrátíme len TOP 5
  return vysledky.slice(0, 5)
}

/* ─────────────────────────────────────────────────────────────────
   POMOCNÝ KOMPONENT: CHIP (jeden klikací štítok)
   ───────────────────────────────────────────────────────────────── */

type ChipProps = {
  label: string         // Text na chipe
  isActive: boolean     // Je chip vybraný?
  onClick: () => void   // Čo sa stane pri kliknutí
}

function Chip({ label, isActive, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}  // Pre prístupnosť (screen readery)
    >
      {label}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────
   POMOCNÝ KOMPONENT: PROGRESS BAR (ukazovateľ zhody v percentách)
   ───────────────────────────────────────────────────────────────── */

type ProgressBarProps = {
  percento: number      // Hodnota 0-100
}

function ProgressBar({ percento }: ProgressBarProps) {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${percento}%` }}
        role="progressbar"           // Pre prístupnosť
        aria-valuenow={percento}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   HLAVNÝ KOMPONENT: DOMOVSKÁ STRÁNKA
   ───────────────────────────────────────────────────────────────── */

export default function Home() {
  
  // ─────────────────────────────────────────────────
  // STATE (dáta, ktoré sa môžu meniť v komponente)
  // ─────────────────────────────────────────────────
  
  // Používateľské meno
  const [meno, setMeno] = useState('')
  
  // Vybratá stredná škola
  const [skola, setSkola] = useState('Gymnázium')
  
  // Vybrané záujmy (pole stringov)
  const [vybraneZauimy, setVybraneZauimy] = useState<string[]>([])
  
  // Vybratá prax (pole stringov)
  const [vybranaPrax, setVybranaPrax] = useState<string[]>([])
  
  // Výsledky (pole programov s percentami)
  const [vysledky, setVysledky] = useState<VysledokProgram[]>([])
  
  // ─────────────────────────────────────────────────
  // FUNKCIE PRE MANIPULÁCIU SO STATE
  // ─────────────────────────────────────────────────
  
  // Prepnutie záujmu (pridanie/odobranie zo zoznamu)
  const toggleZaujm = (zaujm: string) => {
    if (vybraneZauimy.includes(zaujm)) {
      // Ak je už vybraný, odstránime ho
      setVybraneZauimy(vybraneZauimy.filter(z => z !== zaujm))
    } else {
      // Ak nie je vybraný, pridáme ho
      setVybraneZauimy([...vybraneZauimy, zaujm])
    }
  }
  
  // Prepnutie praxe (pridanie/odobranie zo zoznamu)
  const togglePrax = (p: string) => {
    if (vybranaPrax.includes(p)) {
      setVybranaPrax(vybranaPrax.filter(pr => pr !== p))
    } else {
      setVybranaPrax([...vybranaPrax, p])
    }
  }
  
  // Zobrazenie výsledkov (výpočet a nastavenie state)
  const handleZobrazVysledky = () => {
    const novyVysledok = vypocitajScore(skola, vybraneZauimy, vybranaPrax)
    setVysledky(novyVysledok)
  }
  
  // ─────────────────────────────────────────────────
  // RENDER (čo sa zobrazí na stránke)
  // ─────────────────────────────────────────────────
  
  return (
    <div className="page-container">
      
      {/* HLAVIČKA */}
      <header className="header">
        
        {/* Logo/značka */}
        <div className="brand">FEI TUKE</div>
        
        {/* Horná časť: nadpis + deadline badge */}
        <div className="header-top">
          <div className="header-title-section">
            <h1 className="header-title">
              <span className="highlight">Zisti, aké odbory</span>
              <br />
              sa ti hodia na fakultu
            </h1>
            
            {/* Stepper (kroky 1-2-3-4) */}
            <div className="stepper">
              <div className="step">1</div>
              <div className="step">2</div>
              <div className="step">3</div>
              <div className="step">4</div>
            </div>
          </div>
          
          {/* Odznáčik s termínom prihlášok */}
          <div className="deadline-badge">
            <div className="deadline-badge-label">Prihlásky<br />do</div>
            <div className="deadline-badge-date">30 6025</div>
          </div>
        </div>
      </header>
      
      {/* HLAVNÝ OBSAH: formulár + výsledky */}
      <div className="content">
        
        {/* ─────────────────────────────────────────
            ĽAVÁ KARTA: FORMULÁR
            ───────────────────────────────────────── */}
        <div className="card">
          <h2 className="card-title">Tvoje meno</h2>
          
          {/* 1. POLE PRE MENO */}
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Martin"
              value={meno}
              onChange={(e) => setMeno(e.target.value)}
            />
          </div>
          
          {/* 2. VÝBER STREDNEJ ŠKOLY */}
          <div className="form-group">
            <label className="form-label">
              Na akej strednej škole si bol(a)
            </label>
            <select 
              className="form-select"
              value={skola}
              onChange={(e) => setSkola(e.target.value)}
            >
              <option>Gymnázium</option>
              <option>SOŠ elektrotechnická</option>
              <option>SOŠ informačných technológií</option>
              <option>Priemyslovka</option>
            </select>
          </div>
          
          {/* 3. VÝBER ZÁUJMOV (multiselect chips) */}
          <div className="form-group">
            <label className="form-label">
              Aké sú tvoje záujmy
            </label>
            <div className="chips-container">
              {ZAUIMY.map(zaujm => (
                <Chip
                  key={zaujm}
                  label={zaujm}
                  isActive={vybraneZauimy.includes(zaujm)}
                  onClick={() => toggleZaujm(zaujm)}
                />
              ))}
            </div>
          </div>
          
          {/* 4. VÝBER PRAXE (multiselect chips) */}
          <div className="form-group">
            <label className="form-label">
              V akom odbore si pracoval(a)/brigádoval(a)
            </label>
            <div className="chips-container">
              {PRAX.map(p => (
                <Chip
                  key={p}
                  label={p}
                  isActive={vybranaPrax.includes(p)}
                  onClick={() => togglePrax(p)}
                />
              ))}
            </div>
          </div>
          
          {/* 5. CTA TLAČIDLO */}
          <button 
            className="cta-button"
            onClick={handleZobrazVysledky}
          >
            Zobraziť výsledky
          </button>
        </div>
        
        {/* ─────────────────────────────────────────
            PRAVÁ KARTA: VÝSLEDKY
            ───────────────────────────────────────── */}
        <div className="card">
          <h2 className="card-title">
            Odbory, ktoré sa k tebe najviac hodia
          </h2>
          
          {/* Ak sú výsledky, zobrazíme ich */}
          {vysledky.length > 0 ? (
            <div className="results-list">
              {vysledky.map((vysledok, index) => (
                <div key={index} className="result-item">
                  
                  {/* Hlavička výsledku: názov + percento */}
                  <div className="result-header">
                    <div className="result-info">
                      <div className="result-name">
                        {vysledok.nazov}
                      </div>
                      <div className="result-field">
                        {vysledok.odbor}
                      </div>
                    </div>
                    <div className="result-percentage">
                      {vysledok.percento} %
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <ProgressBar percento={vysledok.percento} />
                </div>
              ))}
            </div>
          ) : (
            /* Prázdny stav (keď ešte nie sú výsledky) */
            <div className="empty-state">
              <p className="empty-state-text">
                👈 Vyplň formulár a klikni na tlačidlo „Zobraziť výsledky",
                <br />
                aby si zistil(a), ktoré odbory sú pre teba najvhodnejšie.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
