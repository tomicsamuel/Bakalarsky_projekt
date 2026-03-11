'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { DuelStep } from '@/lib/swipeDraft';
import './bracket-progress.css';

export type BracketMatch = { label: string; status: 'pending' | 'active' | 'done' };

type Props = {
  steps: DuelStep[];
  stepIndex: number;
  finalDuel: boolean;
  winnersCount: number;
  /** Mini bracket chips: A vs D, B vs C, Finále – aktívny zvýraznený, dohraný check */
  matches?: BracketMatch[];
};

export default function BracketProgress({ steps, stepIndex, finalDuel, winnersCount, matches }: Props) {
  const isFinal = finalDuel && winnersCount === 2;
  const label = isFinal
    ? 'Finále'
    : stepIndex === 0
      ? steps.length === 2
        ? 'Semifinále 1'
        : 'Semifinále'
      : 'Semifinále 2';

  const total = finalDuel ? 3 : 2;
  const current = isFinal ? 3 : stepIndex + 1;

  return (
    <motion.div
      className="bracket-progress"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      {matches && matches.length > 0 && (
        <div className="bracket-progress__chips">
          {matches.map((m, i) => (
            <span
              key={i}
              className={`bracket-progress__chip bracket-progress__chip--${m.status}`}
              aria-current={m.status === 'active' ? 'step' : undefined}
            >
              {m.status === 'done' && <Check size={14} aria-hidden />}
              {m.label}
            </span>
          ))}
        </div>
      )}
      <span className="bracket-progress__title">Rozstrel</span>
      <span className="bracket-progress__label">{label}</span>
      <span className="bracket-progress__step">
        Duel {Math.min(current, total)}/{total}
      </span>
    </motion.div>
  );
}
