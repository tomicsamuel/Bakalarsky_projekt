'use client';

import './duel-modal.css';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@heroui/button';

import { getMajorMeta, type DuelCardKey } from '@/lib/majorsMeta';
import { getRarity } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';

const CARDS: DuelCardKey[] = ['Predmety', 'Typ práce', 'Skills', 'Baví ťa', 'Ťaží ťa'];

type Props = {
  left: ScoreResult;
  right: ScoreResult;
  onClose: () => void;
  onPickWinner?: (r: ScoreResult) => void;
  leftRank?: number;
  rightRank?: number;
};

function rarityClass(rarity: string): string {
  const r = rarity.toLowerCase();
  if (r === 'legendary') return 'duel-card-side--legendary';
  if (r === 'epic') return 'duel-card-side--epic';
  if (r === 'rare') return 'duel-card-side--rare';
  return 'duel-card-side--common';
}

export default function DuelModal({
  left,
  right,
  onClose,
  onPickWinner,
  leftRank = 1,
  rightRank = 2,
}: Props) {
  const [phase, setPhase] = useState<'battle' | 'result'>('battle');
  const [winner, setWinner] = useState<ScoreResult | null>(null);

  const leftMeta = getMajorMeta(left);
  const rightMeta = getMajorMeta(right);
  const leftRarity = getRarity(left, leftRank);
  const rightRarity = getRarity(right, rightRank);

  const handlePickWinner = (w: ScoreResult) => {
    setWinner(w);
    setPhase('result');
  };

  const handleContinue = () => {
    if (winner) {
      onPickWinner?.(winner);
    }
    onClose();
  };

  const isLeftWinner = winner && winner.name === left.name && winner.field === left.field;
  const isRightWinner = winner && winner.name === right.name && winner.field === right.field;

  return (
    <motion.div
      className="duel-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Duel odborov"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.target === e.currentTarget && phase === 'battle' && onClose()}
      >
        <motion.div
          className="duel-modal-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="duel-header">
            <div>
              <h3 className="duel-title">Duel: {left.name} vs {right.name}</h3>
              <p className="duel-sub">Rýchle porovnanie v 5 kartách.</p>
            </div>
            <Button type="button" color="default" variant="bordered" size="sm" onPress={onClose}>
              Zavrieť
            </Button>
          </div>

          <div className="duel-arena">
            {/* Left card */}
            <motion.div
              className={`duel-card-side ${rarityClass(leftRarity)} ${phase === 'result' ? (isLeftWinner ? 'duel-card-side--winner' : 'duel-card-side--loser') : ''}`}
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 20 }}
              whileHover={phase === 'battle' && onPickWinner ? { scale: 1.02, y: -4 } : undefined}
              whileTap={phase === 'battle' && onPickWinner ? { scale: 0.99 } : undefined}
              onClick={phase === 'battle' && onPickWinner ? () => handlePickWinner(left) : undefined}
              style={{ cursor: phase === 'battle' && onPickWinner ? 'pointer' : undefined }}
              layout
            >
              <AnimatePresence>
                {phase === 'result' && isLeftWinner && (
                  <motion.div
                    className="duel-stamp duel-stamp--winner"
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    TOP MATCH
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {phase === 'result' && !isLeftWinner && (
                  <motion.div
                    className="duel-stamp duel-stamp--loser"
                    aria-hidden
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    Alternatíva
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="duel-card-side__header">
                <div className="duel-card-side__rarity-badge">{leftRarity}</div>
                <h4 className="duel-card-side__name">{left.name}</h4>
                <p className="duel-card-side__field">{left.field}</p>
                <p className="duel-card-side__score">{Math.round(left.score)}%</p>
              </div>
              <div className="duel-card-side__rounds">
                {CARDS.map((key, i) => (
                  <motion.div
                    key={key}
                    className="duel-round-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.03 }}
                  >
                    <strong>{key}</strong>
                    <span>{leftMeta.duel[key]}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* VS badge */}
            <div className="duel-vs-wrap">
              <motion.div
                className="duel-vs-badge"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 280, damping: 16 }}
                whileHover={phase === 'battle' ? { scale: 1.1 } : undefined}
              >
                VS
              </motion.div>
            </div>

            {/* Right card */}
            <motion.div
              className={`duel-card-side ${rarityClass(rightRarity)} ${phase === 'result' ? (isRightWinner ? 'duel-card-side--winner' : 'duel-card-side--loser') : ''}`}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 20 }}
              whileHover={phase === 'battle' && onPickWinner ? { scale: 1.02, y: -4 } : undefined}
              whileTap={phase === 'battle' && onPickWinner ? { scale: 0.99 } : undefined}
              onClick={phase === 'battle' && onPickWinner ? () => handlePickWinner(right) : undefined}
              style={{ cursor: phase === 'battle' && onPickWinner ? 'pointer' : undefined }}
              layout
            >
              <AnimatePresence>
                {phase === 'result' && isRightWinner && (
                  <motion.div
                    className="duel-stamp duel-stamp--winner"
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    TOP MATCH
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {phase === 'result' && !isRightWinner && (
                  <motion.div
                    className="duel-stamp duel-stamp--loser"
                    aria-hidden
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    Alternatíva
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="duel-card-side__header">
                <div className="duel-card-side__rarity-badge">{rightRarity}</div>
                <h4 className="duel-card-side__name">{right.name}</h4>
                <p className="duel-card-side__field">{right.field}</p>
                <p className="duel-card-side__score">{Math.round(right.score)}%</p>
              </div>
              <div className="duel-card-side__rounds">
                {CARDS.map((key, i) => (
                  <motion.div
                    key={key}
                    className="duel-round-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.03 }}
                  >
                    <strong>{key}</strong>
                    <span>{rightMeta.duel[key]}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="duel-actions">
            {phase === 'battle' && onPickWinner && (
              <div className="duel-pick-winner">
                <span className="duel-pick-label">Vyber víťaza:</span>
                <Button
                  type="button"
                  color="primary"
                  variant="solid"
                  size="sm"
                  onPress={() => handlePickWinner(left)}
                >
                  {left.name}
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="solid"
                  size="sm"
                  onPress={() => handlePickWinner(right)}
                >
                  {right.name}
                </Button>
              </div>
            )}
            <AnimatePresence mode="wait">
              {phase === 'result' && (
                <motion.div
                  className="duel-pick-winner"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Button
                    type="button"
                    color="primary"
                    variant="solid"
                    size="md"
                    onPress={handleContinue}
                  >
                    Pokračovať
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="duel-detail-links">
              <Button
                as={Link}
                href={`/program/${encodeURIComponent(left.name)}/${encodeURIComponent(left.field)}`}
                color="primary"
                variant="bordered"
                size="sm"
              >
                Detail ľavý
              </Button>
              <Button
                as={Link}
                href={`/program/${encodeURIComponent(right.name)}/${encodeURIComponent(right.field)}`}
                color="primary"
                variant="bordered"
                size="sm"
              >
                Detail pravý
              </Button>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
}
