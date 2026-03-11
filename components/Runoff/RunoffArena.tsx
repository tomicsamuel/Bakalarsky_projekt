'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from 'motion/react';
import { Undo2 } from 'lucide-react';
import type { ScoreResult } from '@/lib/types';
import type { MajorTag } from '@/lib/majorsMeta';
import { getMajorMeta } from '@/lib/majorsMeta';
import './runoff-arena.css';

type RunoffQuestion = { question: string; optionA: string; optionB: string };

const QUESTIONS: RunoffQuestion[] = [
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
const SUDDEN_DEATH_QUESTION: RunoffQuestion = {
  question: 'S ktorým smerom sa viac stotožňuješ?',
  optionA: 'sieťový / infraštruktúra',
  optionB: 'softvér / produkt',
};
const TOTAL_ROUNDS = QUESTIONS.length;

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
  const dragX = useMotionValue(0);

  const leftMeta = getMajorMeta(left);
  const rightMeta = getMajorMeta(right);

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
        .map((r) => `Vybral si ${winnerName} v otázke: ${QUESTIONS[r.questionIndex].question}`);
    },
    [left.name]
  );

  const pick = useCallback(
    (option: 'A' | 'B') => {
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

  const currentQ = suddenDeath ? SUDDEN_DEATH_QUESTION : QUESTIONS[round - 1];
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

  const handleSwipeEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const dx = info.offset.x;
      const vx = info.velocity.x;
      const th = 60;
      const vth = 200;
      if (dx > th || vx > vth) {
        pick('B');
        animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
      } else if (dx < -th || vx < -vth) {
        pick('A');
        animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
      } else {
        animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
      }
    },
    [pick]
  );

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

      <motion.div
        className="runoff-arena__content"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -80, right: 80 }}
        dragElastic={0.3}
        style={{ x: dragX }}
        onDragEnd={handleSwipeEnd}
      >
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

        <div className="runoff-arena__question-card">
          <p className="runoff-arena__question-text">{currentQ.question}</p>
        </div>

        <div className="runoff-arena__answers">
          <motion.button
            type="button"
            className="runoff-arena__answer runoff-arena__answer--a"
            onClick={() => pick('A')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="runoff-arena__answer-label">A</span>
            <span className="runoff-arena__answer-name">{currentQ.optionA}</span>
          </motion.button>
          <motion.button
            type="button"
            className="runoff-arena__answer runoff-arena__answer--b"
            onClick={() => pick('B')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="runoff-arena__answer-label">B</span>
            <span className="runoff-arena__answer-name">{currentQ.optionB}</span>
          </motion.button>
        </div>

        <p className="runoff-arena__hint">Swipe ← pre A, swipe → pre B (alebo šípky ← →)</p>
      </motion.div>

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
