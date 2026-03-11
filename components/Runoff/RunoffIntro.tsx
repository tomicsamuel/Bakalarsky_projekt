'use client';

import { motion } from 'motion/react';
import { getPackRarity, getRarityLabel } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';
import './runoff.css';

type Props = {
  candidates: ScoreResult[];
  onStart: () => void;
  onBackToSwipes: () => void;
};

export default function RunoffIntro({ candidates, onStart, onBackToSwipes }: Props) {
  const n = candidates.length;

  return (
    <motion.div
      className="runoff-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="runoff-intro__card">
        <h1 className="runoff-intro__title">ROZSTREL</h1>
        <p className="runoff-intro__sub">
          {n === 2
            ? 'Odpovedz na 3 rýchle otázky – tvoj výber rozhodne víťaza.'
            : `Zostali ti ${n} odbory. Vyberieme finálny top pick.`}
        </p>
        <div className="runoff-intro__chips" role="list">
          {candidates.map((c, i) => {
            const rarity = getPackRarity(i + 1);
            const label = getRarityLabel(rarity);
            return (
              <motion.span
                key={`${c.name}__${c.field}`}
                className={`runoff-intro__chip runoff-intro__chip--${rarity.toLowerCase()}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 400, damping: 24 }}
                role="listitem"
              >
                {c.name} <span className="runoff-intro__chip-rarity">({label})</span>
              </motion.span>
            );
          })}
        </div>
        <div className="runoff-intro__actions">
          <motion.button
            type="button"
            className="runoff-intro__btn runoff-intro__btn--primary"
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {n === 2 ? 'Začať duel' : 'Začať'}
          </motion.button>
          <button
            type="button"
            className="runoff-intro__link"
            onClick={onBackToSwipes}
          >
            Chcem sa vrátiť a upraviť swipy
          </button>
        </div>
      </div>
    </motion.div>
  );
}
