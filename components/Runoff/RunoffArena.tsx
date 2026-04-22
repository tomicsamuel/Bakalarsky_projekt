'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Undo2 } from 'lucide-react';
import type { ScoreResult } from '@/lib/types';
import type { MajorTag } from '@/lib/majorsMeta';
import { getMajorMeta } from '@/lib/majorsMeta';
import './runoff-arena.css';

type RunoffQuestion = { question: string; optionA: string; optionB: string };
type ProgramKey = string; // `${name}__${field}`

/** Univerzálne otázky – baseline, vždy k dispozícii ako filler. */
const CORE_QUESTIONS: RunoffQuestion[] = [
  {
    question: 'Čo je pre teba prirodzenejšie pochopiť?',
    optionA: 'routing medzi sieťami + podsiete',
    optionB: 'dátové štruktúry (stromy/hash) a ich zložitosť',
  },
  {
    question: 'Viac ťa baví:',
    optionA: '"prečo nejde ping a kde to padá"',
    optionB: '"prečo padá kód a kde je bug"',
  },
  {
    question: 'Keď počuješ "bezpečnosť", predstavíš si skôr:',
    optionA: 'ochranu siete (kto sa môže pripojiť)',
    optionB: 'ochranu aplikácie (kto sa môže prihlásiť a čo vidí)',
  },
  {
    question: 'Viac ťa láka:',
    optionA: 'práca s infraštruktúrou (systémy, sieť, prístup)',
    optionB: 'práca s produktom (funkcie, dizajn, UX)',
  },
  {
    question: 'Čo je ti bližšie?',
    optionA: '"sieť je základ, bez toho nič nejde"',
    optionB: '"softvér je základ, to je to, čo ľudia používajú"',
  },
];

/**
 * Otázky tematicky viazané na konkrétny program. Pri rozstrele sa z poolov
 * oboch programov v dueli vytvorí kandidátny zoznam, zamieša a doplní
 * z CORE_QUESTIONS do počtu 5.
 *
 * Konvencia: A = "hardware / infraštruktúra / fyzika / meranie / siete / pohony",
 *            B = "softvér / kód / AI / produkt / dáta".
 * Bodovanie zostáva (A → vyšší stars.siete, B → vyšší stars.programovanie).
 */
const PROGRAM_QUESTIONS: Record<ProgramKey, RunoffQuestion[]> = {
  'Aplikovaná elektrotechnika__Elektrotechnika': [
    {
      question: 'Čo ťa viac baví?',
      optionA: 'zapojiť reálny obvod a merať ho osciloskopom',
      optionB: 'simulovať ten istý obvod softvérom',
    },
    {
      question: 'Bližšie ti je:',
      optionA: 'motor, pohon a silnoprúd',
      optionB: 'algoritmus a kód, ktorý ich riadi',
    },
    {
      question: 'Kde chceš tráviť čas?',
      optionA: 'v laboratóriu s pájkou a meračmi',
      optionB: 'za klávesnicou s IDE',
    },
  ],
  'Automobilová elektronika__Elektrotechnika': [
    {
      question: 'Čo radšej ladíš?',
      optionA: 'riadiacu jednotku (ECU) v aute',
      optionB: 'kód self-driving algoritmu',
    },
    {
      question: 'Bližšie ti je:',
      optionA: 'CAN-bus, senzory a aktuátory',
      optionB: 'API medzi modulmi softvéru',
    },
    {
      question: 'Keď auto nejde:',
      optionA: 'pozrieš OBD-II diagnostiku a kabeláž',
      optionB: 'debuguješ firmware a logy',
    },
  ],
  'Elektroenergetika__Elektrotechnika': [
    {
      question: 'Čo ti znie lepšie?',
      optionA: 'prenosová sústava, trafostanice, rozvodne',
      optionB: 'dátové centrá, servery, routre',
    },
    {
      question: 'Spravovať chceš skôr:',
      optionA: 'gigawatty v sieti',
      optionB: 'petabajty v klastri',
    },
    {
      question: 'Baví ťa:',
      optionA: 'fyzika energie a jej tok',
      optionB: 'spracovanie dát a ich tok',
    },
  ],
  'Fyzikálne inžinierstvo progresívnych materiálov__Elektrotechnika': [
    {
      question: 'Väčšia záľuba?',
      optionA: 'merať materiál v laboratóriu',
      optionB: 'simulovať materiál v kóde',
    },
    {
      question: 'Keď riešiš problém:',
      optionA: 'skúmaš atómy a zliatiny',
      optionB: 'píšeš numerický solver',
    },
    {
      question: 'Baví ťa:',
      optionA: 'experiment a prístroj',
      optionB: 'algoritmus a model',
    },
  ],
  'Priemyselná elektrotechnika__Elektrotechnika': [
    {
      question: 'Čo ti sadne?',
      optionA: 'automatizovať výrobnú linku cez PLC',
      optionB: 'automatizovať softvérový pipeline',
    },
    {
      question: 'Bližšie ti je:',
      optionA: 'robot, relé, pohon, fabrika',
      optionB: 'API, služba, kontajner, cloud',
    },
    {
      question: 'Tvoriť chceš:',
      optionA: 'fyzický výrobný systém',
      optionB: 'softvérový systém',
    },
  ],
  'Kyberbezpečnosť__Informatika': [
    {
      question: 'Čo ti znie viac ako ty?',
      optionA: 'loviť útočníka v sieťovom trafficu',
      optionB: 'audit zdrojového kódu a hľadanie vulnerabilít',
    },
    {
      question: 'Keď chrániš:',
      optionA: 'firewall, IDS, pentest siete',
      optionB: 'secure coding a code review',
    },
    {
      question: 'Bližšie ti je:',
      optionA: 'bezpečná infraštruktúra',
      optionB: 'bezpečná aplikácia',
    },
  ],
  'Počítačové modelovanie__Informatika': [
    {
      question: 'Čo radšej?',
      optionA: 'rovnice a fyzika za modelom',
      optionB: 'kód, ktorý ho počíta',
    },
    {
      question: 'Baví ťa:',
      optionA: 'výsledok simulácie a grafy',
      optionB: 'architektúra simulátora',
    },
    {
      question: 'Viac si vyberáš:',
      optionA: 'matematika a numerika',
      optionB: 'softvérový design',
    },
  ],
  'Umelá inteligencia__Informatika': [
    {
      question: 'Bližšie ti je:',
      optionA: 'infraštruktúra pre AI (GPU klastre, deploy)',
      optionB: 'návrh modelu (vrstvy, loss)',
    },
    {
      question: 'Čo radšej robíš?',
      optionA: 'zbieraš a čistíš dáta',
      optionB: 'trénuješ a ladíš model',
    },
    {
      question: 'Chceš skôr:',
      optionA: 'dostať model do produkcie',
      optionB: 'vymyslieť nový algoritmus',
    },
  ],
  'Aplikovaná informatika__Informatika': [
    {
      question: 'Čo ťa viac láka?',
      optionA: 'správa IT systémov a infraštruktúry',
      optionB: 'vývoj novej aplikácie',
    },
    {
      question: 'Bližšie ti je:',
      optionA: 'databáza, siete, integrácie',
      optionB: 'UI a aplikačná logika',
    },
    {
      question: 'Chceš skôr:',
      optionA: 'nasadiť IT riešenie vo firme',
      optionB: 'napísať novú feature',
    },
  ],
};

const SUDDEN_DEATH_QUESTION: RunoffQuestion = {
  question: 'S ktorým smerom sa viac stotožňuješ?',
  optionA: 'hardware / infraštruktúra',
  optionB: 'softvér / AI / produkt',
};

const TOTAL_ROUNDS = 5;

/** Fisher–Yates shuffle (nemutuje vstup). */
function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type ToastState = { message: string; key: number } | null;
type ImpactChip = { label: string; tag?: MajorTag };

type Props = {
  left: ScoreResult;
  right: ScoreResult;
  onBack: () => void;
  onComplete: (winner: ScoreResult, alternative: ScoreResult, reasons: string[], impactChips: ImpactChip[]) => void;
};

export default function RunoffArena({ left, right, onBack, onComplete }: Props) {
  const [round, setRound] = useState(1);
  const [leftPoints, setLeftPoints] = useState(0);
  const [rightPoints, setRightPoints] = useState(0);
  const [suddenDeath, setSuddenDeath] = useState(false);
  const [roundHistory, setRoundHistory] = useState<{ chosen: 'left' | 'right'; questionIndex: number }[]>([]);
  const [toast, setToast] = useState<ToastState>(null);
  const [impactChips, setImpactChips] = useState<ImpactChip[]>([]);
  const [exitDir, setExitDir] = useState<1 | -1>(1); // smer odchodu karty

  const leftMeta = getMajorMeta(left);
  const rightMeta = getMajorMeta(right);

  /**
   * 5 otázok pre aktuálny rozstrel: najprv tematické z poolov oboch programov,
   * doplnené náhodne z CORE_QUESTIONS do počtu 5. Stabilné v rámci mountu
   * – pri zmene dvojice (napr. bracket postupuje ďalej) sa prepočíta.
   */
  const roundQuestions = useMemo<RunoffQuestion[]>(() => {
    const leftKey: ProgramKey = `${left.name}__${left.field}`;
    const rightKey: ProgramKey = `${right.name}__${right.field}`;
    const themed = [
      ...(PROGRAM_QUESTIONS[leftKey] ?? []),
      ...(PROGRAM_QUESTIONS[rightKey] ?? []),
    ];
    const shuffledThemed = shuffle(themed).slice(0, TOTAL_ROUNDS);
    const fillerNeeded = Math.max(0, TOTAL_ROUNDS - shuffledThemed.length);
    const filler = shuffle(CORE_QUESTIONS).slice(0, fillerNeeded);
    return [...shuffledThemed, ...filler].slice(0, TOTAL_ROUNDS);
  }, [left.name, left.field, right.name, right.field]);

  const showToast = useCallback((message: string) => {
    const key = Date.now();
    setToast({ message, key });
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, []);

  const addImpactChip = useCallback((label: string, tag?: MajorTag) => {
    setImpactChips((prev) => [...prev.slice(-5), { label, tag }]);
  }, []);

  /** A = sieťový smer → bod programu s vyšším stars.siete; B = softvérový → vyšší stars.programovanie */
  const resolveChoiceToSide = useCallback(
    (option: 'A' | 'B'): 'left' | 'right' => {
      if (option === 'A') {
        return leftMeta.stars.siete >= rightMeta.stars.siete ? 'left' : 'right';
      }
      return leftMeta.stars.programovanie >= rightMeta.stars.programovanie ? 'left' : 'right';
    },
    [leftMeta.stars.siete, leftMeta.stars.programovanie, rightMeta.stars.siete, rightMeta.stars.programovanie]
  );

  const buildReasons = useCallback(
    (winner: ScoreResult, history: { chosen: 'left' | 'right'; questionIndex: number }[]) => {
      const winnerSide = winner.name === left.name ? 'left' : 'right';
      const winnerName = winner.name;
      return history
        .filter((r) => r.chosen === winnerSide)
        .map((r) => `Vybral si ${winnerName} v otázke: ${roundQuestions[r.questionIndex]?.question ?? ''}`);
    },
    [left.name, roundQuestions]
  );

  const pick = useCallback(
    (option: 'A' | 'B') => {
      setExitDir(option === 'A' ? -1 : 1);
      const chosen: 'left' | 'right' = resolveChoiceToSide(option);
      const candidate = chosen === 'left' ? left : right;
      const meta = chosen === 'left' ? leftMeta : rightMeta;

      if (suddenDeath) {
        const winner = chosen === 'left' ? left : right;
        const alternative = chosen === 'left' ? right : left;
        const reasons = [`Vybral si ${winner.name} v sudden death otázke.`];
        const chips = [...impactChips, { label: `Víťaz: ${winner.name}`, tag: meta.tags[0] as MajorTag }].slice(-6);
        showToast(`Víťaz: ${winner.name}`);
        onComplete(winner, alternative, reasons, chips);
        return;
      }

      const questionIndex = round - 1;
      setRoundHistory((h) => [...h, { chosen, questionIndex }]);
      if (chosen === 'left') {
        setLeftPoints((p) => p + 1);
        showToast(`Bod pre ${left.name}`);
      } else {
        setRightPoints((p) => p + 1);
        showToast(`Bod pre ${right.name}`);
      }
      addImpactChip(`Bod pre ${candidate.name} v otázke ${round}`, meta.tags[0]);

      if (round >= TOTAL_ROUNDS) {
        const newLeft = chosen === 'left' ? leftPoints + 1 : leftPoints;
        const newRight = chosen === 'right' ? rightPoints + 1 : rightPoints;

        if (newLeft !== newRight) {
          const winner = newLeft > newRight ? left : right;
          const alternative = newLeft > newRight ? right : left;
          const newHistory = [...roundHistory, { chosen, questionIndex }];
          const reasons = buildReasons(winner, newHistory);
          if (reasons.length === 0) reasons.push(`Vybral si ${winner.name} v rozstrele.`);
          const chips = [...impactChips, { label: `Vybral si: ${candidate.name}`, tag: meta.tags[0] as MajorTag }].slice(-6);
          onComplete(winner, alternative, reasons, chips);
          return;
        }

        setSuddenDeath(true);
        return;
      }

      setRound((r) => r + 1);
    },
    [
      round,
      leftPoints,
      rightPoints,
      suddenDeath,
      left,
      right,
      leftMeta,
      rightMeta,
      roundHistory,
      impactChips,
      showToast,
      addImpactChip,
      buildReasons,
      resolveChoiceToSide,
      onComplete,
    ]
  );

  const undo = useCallback(() => {
    if (suddenDeath) {
      setSuddenDeath(false);
      const last = roundHistory[roundHistory.length - 1];
      setRoundHistory((h) => h.slice(0, -1));
      setImpactChips((c) => c.slice(0, -1));
      if (last.chosen === 'left') setLeftPoints((p) => Math.max(0, p - 1));
      else setRightPoints((p) => Math.max(0, p - 1));
      setRound(TOTAL_ROUNDS);
      return;
    }
    if (roundHistory.length === 0) return;
    const last = roundHistory[roundHistory.length - 1];
    setRoundHistory((h) => h.slice(0, -1));
    setImpactChips((c) => c.slice(0, -1));
    if (last.chosen === 'left') setLeftPoints((p) => Math.max(0, p - 1));
    else setRightPoints((p) => Math.max(0, p - 1));
    setRound((r) => Math.max(1, r - 1));
  }, [suddenDeath, roundHistory]);

  const currentQ = suddenDeath ? SUDDEN_DEATH_QUESTION : roundQuestions[round - 1];
  const progressPct = suddenDeath ? 100 : (round / TOTAL_ROUNDS) * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pick('A');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        pick('B');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pick]);

  const questionKey = suddenDeath ? 'sudden' : `round-${round}`;

  return (
    <div className="runoff-arena">
      <header className="runoff-arena__bar">
        <button type="button" className="runoff-arena__back" onClick={onBack} aria-label="Späť">
          ← Späť
        </button>
        <div className="runoff-arena__scoreboard">
          <span className="runoff-arena__score runoff-arena__score--a">
            A <span className="runoff-arena__score-value">{leftPoints}</span>
          </span>
          <span className="runoff-arena__score-sep">:</span>
          <span className="runoff-arena__score runoff-arena__score--b">
            <span className="runoff-arena__score-value">{rightPoints}</span> B
          </span>
        </div>
        <button
          type="button"
          className="runoff-arena__undo"
          onClick={undo}
          disabled={roundHistory.length === 0 && !suddenDeath}
          aria-label="Vrátiť"
        >
          <Undo2 size={20} />
        </button>
      </header>

      <div className="runoff-arena__content">
        {!suddenDeath && (
          <div className="runoff-arena__progress-wrap">
            <span className="runoff-arena__progress-label">
              Kolo {round}/{TOTAL_ROUNDS}
            </span>
            <div className="runoff-arena__progress-bar">
              <motion.span
                className="runoff-arena__progress-fill"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            </div>
          </div>
        )}

        {suddenDeath && (
          <div className="runoff-arena__sudden-badge">Sudden Death</div>
        )}

        {/* AnimatePresence animuje prechod medzi otázkami */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={questionKey}
            className="runoff-arena__question-block"
            initial={{ opacity: 0, x: exitDir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: exitDir * -40 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.7 }}
          >
            <div className="runoff-arena__question-card">
              <p className="runoff-arena__question-text">{currentQ.question}</p>
            </div>

            <div className="runoff-arena__answers">
              <motion.button
                type="button"
                className="runoff-arena__answer runoff-arena__answer--a"
                onClick={() => pick('A')}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <span className="runoff-arena__answer-label">A</span>
                <span className="runoff-arena__answer-name">{currentQ.optionA}</span>
              </motion.button>
              <motion.button
                type="button"
                className="runoff-arena__answer runoff-arena__answer--b"
                onClick={() => pick('B')}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <span className="runoff-arena__answer-label">B</span>
                <span className="runoff-arena__answer-name">{currentQ.optionB}</span>
              </motion.button>
            </div>

            <p className="runoff-arena__hint">alebo šípky ← →</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="runoff-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
