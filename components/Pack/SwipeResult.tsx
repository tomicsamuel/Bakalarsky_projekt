'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

import type { ScoreResult } from '@/lib/types';

import './swipe-draft.css';

type Props = {
  winner: ScoreResult;
  alternative: ScoreResult;
  explanation: string;
  superlikeName?: string | null;
  /** 2–3 dôvody (napr. z Final Boss roundov alebo bracketu) */
  reasons?: string[];
  onBack: () => void;
};

export default function SwipeResult({ winner, alternative, explanation, superlikeName, reasons, onBack }: Props) {
  const html = superlikeName
    ? explanation.replace(superlikeName, `<span class="swipe-result__super">${superlikeName}</span>`)
    : explanation;
  return (
    <motion.div
      className="swipe-result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="swipe-result__title"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 26 }}
      >
        Tvoj odporúčaný odbor
      </motion.h2>
      <motion.p
        className="swipe-result__explain"
        dangerouslySetInnerHTML={{ __html: html }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      <div className="swipe-result__cards">
        <motion.div
          className="swipe-result__card swipe-result__card--winner"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 280, damping: 24 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="swipe-result__card-label">TOP PICK</div>
          <div className="swipe-result__card-name">{winner.name}</div>
          <p className="swipe-result__card-score">{winner.score}%</p>
        </motion.div>
        <motion.div
          className="swipe-result__card"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 280, damping: 24 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="swipe-result__card-label">STRONG ALT</div>
          <div className="swipe-result__card-name">{alternative.name}</div>
          <p className="swipe-result__card-score">{alternative.score}%</p>
        </motion.div>
      </div>
      {reasons && reasons.length > 0 && (
        <motion.div
          className="swipe-result__reasons"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="swipe-result__reasons-title">Prečo tento odbor</h4>
          <ul className="swipe-result__reasons-list">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </motion.div>
      )}
      <motion.div
        className="swipe-result__actions"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Link
          href={`/program/${encodeURIComponent(winner.name)}/${encodeURIComponent(winner.field)}`}
          className="duel-bar__btn duel-bar__btn--secondary"
        >
          Detail víťaza
        </Link>
        <button type="button" className="duel-bar__btn duel-bar__btn--outline" onClick={onBack}>
          Späť na výsledky
        </button>
      </motion.div>
    </motion.div>
  );
}
