'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from 'motion/react';
import { getMajorMeta, type DuelCardKey } from '@/lib/majorsMeta';
import type { ScoreResult } from '@/lib/types';
import './final-boss-duel.css';

const ROUND_KEYS: DuelCardKey[] = ['Predmety', 'Typ práce', 'Skills'];
const TOTAL_ROUNDS = 3;

type ToastState = { message: string; key: number } | null;

type Props = {
  left: ScoreResult;
  right: ScoreResult;
  onComplete: (winner: ScoreResult, alternative: ScoreResult, reasons: string[]) => void;
};

export default function FinalBossDuel({ left, right, onComplete }: Props) {
  const [round, setRound] = useState(1);
  const [leftPoints, setLeftPoints] = useState(0);
  const [rightPoints, setRightPoints] = useState(0);
  const [roundReasons, setRoundReasons] = useState<{ question: string; winnerName: string; text: string }[]>([]);
  const [toast, setToast] = useState<ToastState>(null);

  const leftMeta = getMajorMeta(left);
  const rightMeta = getMajorMeta(right);
  const dragX = useMotionValue(0);

  const showToast = useCallback((message: string) => {
    const key = Date.now();
    setToast({ message, key });
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, []);

  const pick = useCallback(
    (chosen: 'left' | 'right') => {
      const question = ROUND_KEYS[round - 1];
      const candidate = chosen === 'left' ? left : right;
      const meta = chosen === 'left' ? leftMeta : rightMeta;
      const text = meta.duel[question] ?? '';

      if (chosen === 'left') {
        setLeftPoints((p) => p + 1);
        showToast(`Bod pre ${left.name}`);
      } else {
        setRightPoints((p) => p + 1);
        showToast(`Bod pre ${right.name}`);
      }

      const nextReasons = [...roundReasons, { question, winnerName: candidate.name, text }];
      setRoundReasons(nextReasons);

      if (round >= TOTAL_ROUNDS) {
        const leftTotal = chosen === 'left' ? leftPoints + 1 : leftPoints;
        const rightTotal = chosen === 'right' ? rightPoints + 1 : rightPoints;
        let winner: ScoreResult;
        let alternative: ScoreResult;
        if (leftTotal > rightTotal) {
          winner = left;
          alternative = right;
        } else if (rightTotal > leftTotal) {
          winner = right;
          alternative = left;
        } else {
          winner = left.score >= right.score ? left : right;
          alternative = left.score >= right.score ? right : left;
        }
        const reasons = nextReasons
          .filter((r) => r.winnerName === winner.name)
          .slice(0, 3)
          .map((r) => `${r.question}: ${r.text}`);
        if (reasons.length === 0) reasons.push(`Vybral si ${winner.name} v rozstrele.`);
        onComplete(winner, alternative, reasons);
        return;
      }
      setRound((r) => r + 1);
    },
    [round, leftPoints, rightPoints, roundReasons, left, right, leftMeta, rightMeta, showToast, onComplete]
  );

  const question = ROUND_KEYS[round - 1];
  const leftText = leftMeta.duel[question] ?? '';
  const rightText = rightMeta.duel[question] ?? '';

  const handleSwipeZoneDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const dx = info.offset.x;
      const vx = info.velocity.x;
      const threshold = 60;
      const velThreshold = 200;
      if (dx > threshold || vx > velThreshold) {
        pick('right');
        animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
        return;
      }
      if (dx < -threshold || vx < -velThreshold) {
        pick('left');
        animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
        return;
      }
      animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
    },
    [pick]
  );

  return (
    <div className="final-boss">
      <div className="final-boss__header">
        <h2 className="final-boss__title">Final Boss Duel</h2>
        <p className="final-boss__sub">3 kola – vyber A alebo B (klik alebo swipe)</p>
        <div className="final-boss__progress" aria-label={`Kolo ${round} z ${TOTAL_ROUNDS}`}>
          Round {round}/{TOTAL_ROUNDS}
        </div>
      </div>

      <div className="final-boss__question-label">{question}</div>

      <div className="final-boss__options">
        <motion.button
          type="button"
          className="final-boss__option final-boss__option--a"
          onClick={() => pick('left')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <span className="final-boss__option-badge">A</span>
          <span className="final-boss__option-name">{left.name}</span>
          <p className="final-boss__option-text">{leftText}</p>
        </motion.button>

        <div className="final-boss__vs">vs</div>

        <motion.button
          type="button"
          className="final-boss__option final-boss__option--b"
          onClick={() => pick('right')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <span className="final-boss__option-badge">B</span>
          <span className="final-boss__option-name">{right.name}</span>
          <p className="final-boss__option-text">{rightText}</p>
        </motion.button>
      </div>

      <motion.div
        className="final-boss__swipe-zone"
        style={{ x: dragX }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.4}
        onDragEnd={handleSwipeZoneDragEnd}
      >
        <span className="final-boss__swipe-hint">← Swipe pre A · Swipe pre B →</span>
      </motion.div>

      <div className="final-boss__scores">
        <span>{left.name}: {leftPoints}</span>
        <span>{right.name}: {rightPoints}</span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="final-boss-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
