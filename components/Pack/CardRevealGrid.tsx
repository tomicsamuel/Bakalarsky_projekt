'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@heroui/button';

import './pack.css';

import MajorCard from './MajorCard';
import { getPackRarity, getRarity } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';

const SHUFFLE_DURATION_MS = 800;
const REVEAL_STAGGER_S = 0.14;

type DuelSlots = [ScoreResult | null, ScoreResult | null];

type Props = {
  results: ScoreResult[];
  confidence?: number;
  /** Pack flow: slot A, B pre duel */
  duelSlots?: DuelSlots;
  onAddToDuel?: (r: ScoreResult) => void;
  onExplain?: (r: ScoreResult, rank: number) => void;
  /** Klasický režim (Porovnať) */
  compare?: ScoreResult[];
  onCompare?: (r: ScoreResult) => void;
  onRevealComplete: () => void;
};

export default function CardRevealGrid({
  results,
  confidence = 0,
  duelSlots = [null, null],
  onAddToDuel,
  onExplain,
  compare = [],
  onCompare,
  onRevealComplete,
}: Props) {
  const top6 = results.slice(0, 6);
  const [isShuffling, setIsShuffling] = useState(true);
  const packFlow = onAddToDuel != null;

  useEffect(() => {
    const t = setTimeout(() => setIsShuffling(false), SHUFFLE_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  const getDuelSlot = (r: ScoreResult): 'A' | 'B' | null => {
    if (duelSlots[0]?.name === r.name && duelSlots[0]?.field === r.field) return 'A';
    if (duelSlots[1]?.name === r.name && duelSlots[1]?.field === r.field) return 'B';
    return null;
  };

  return (
    <div className="card-reveal">
      <AnimatePresence mode="wait">
        {isShuffling ? (
          <motion.div
            key="shuffle"
            className="card-shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-shuffle__deck" aria-hidden>
              {top6.map((_, i) => {
                const offsetX = (i - 2.5) * 4;
                const offsetY = (i - 2.5) * 6;
                return (
                  <motion.div
                    key={i}
                    className="card-shuffle__card"
                    style={{ zIndex: i }}
                    initial={{
                      x: offsetX,
                      y: offsetY,
                      rotate: -8 + i * 3,
                      scale: 0.85,
                    }}
                    animate={{
                      x: [offsetX, offsetX + 15, offsetX - 10, offsetX + 8, offsetX],
                      y: [offsetY, offsetY - 8, offsetY + 12, offsetY - 5, offsetY],
                      rotate: [-8 + i * 3, 5 - i * 2, -6 + i, 8 - i, -8 + i * 3],
                      scale: [0.85, 0.9, 0.88, 0.92, 0.9],
                    }}
                    transition={{
                      duration: SHUFFLE_DURATION_MS / 1000,
                      repeat: 0,
                      delay: i * 0.04,
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="card-reveal__content"
          >
      <h2 className="card-reveal__title">Tvoje odbory</h2>
      <div className="card-reveal__grid">
        <AnimatePresence mode="popLayout">
          {top6.map((r, i) => {
            const rank = i + 1;
            const rarity = packFlow ? getPackRarity(rank) : getRarity(r, rank);
            const isLegendary = rank === 1;
            return (
              <motion.div
                key={`${r.name}__${r.field}`}
                initial={{ opacity: 0, scale: 0.5, y: 60 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: i * REVEAL_STAGGER_S,
                }}
                layout
                className={isLegendary ? 'card-reveal__item card-reveal__item--legendary' : 'card-reveal__item'}
              >
                <MajorCard
                  result={r}
                  rank={rank}
                  rarity={rarity}
                  duelSlot={packFlow ? getDuelSlot(r) : null}
                  onAddToDuel={packFlow ? onAddToDuel : undefined}
                  onAddToShortlist={packFlow ? undefined : undefined}
                  onExplain={onExplain}
                  confidence={confidence}
                  isInCompare={!packFlow && compare.some((c) => c.name === r.name && c.field === r.field)}
                  onCompare={packFlow ? undefined : onCompare}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
            {top6.length > 0 && (
        <motion.div
          className="card-reveal__done"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: top6.length * REVEAL_STAGGER_S + 0.5 }}
        >
          <Button
            type="button"
            color="primary"
            variant="solid"
            size="lg"
            onPress={onRevealComplete}
            className="card-reveal__done-btn"
          >
            Prejsť na výsledky
          </Button>
        </motion.div>
      )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
