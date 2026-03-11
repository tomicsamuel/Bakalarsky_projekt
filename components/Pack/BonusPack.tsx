'use client';

import { motion } from 'motion/react';
import { Button } from '@heroui/button';

import './pack.css';

import MajorCard from './MajorCard';
import { getRarity } from '@/lib/rarity';
import { getSimilarMajors } from '@/lib/mapCoords';
import type { ScoreResult } from '@/lib/types';

type Props = {
  results: ScoreResult[];
  confidence: number;
  bonusUnlocked: boolean;
  compare?: ScoreResult[];
  onQuiz: () => void;
  onCompare: (r: ScoreResult) => void;
};

function getBonusCard(results: ScoreResult[]): ScoreResult | null {
  if (results.length > 6) return results[6];
  const top1 = results[0];
  if (!top1) return null;
  const similar = getSimilarMajors(top1.name);
  const candidate = results.find((r) => similar.includes(r.name) && r.name !== top1.name);
  return candidate ?? results[results.length - 1] ?? null;
}

export default function BonusPack({ results, confidence, bonusUnlocked, compare = [], onQuiz, onCompare }: Props) {
  const bonusCard = getBonusCard(results);
  const showBonus = confidence < 80 && bonusCard;

  if (!showBonus) return null;

  if (!bonusUnlocked) {
    return (
      <motion.div
        className="bonus-pack bonus-pack--locked"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bonus-pack__card">
          <h3 className="bonus-pack__title">Bonus pack</h3>
          <p className="bonus-pack__desc">
            Sprav 60 sekundový challenge a odomkni bonus pack s jedným ďalším odporúčaním.
          </p>
          <Button
            type="button"
            color="primary"
            variant="solid"
            size="lg"
            onPress={onQuiz}
            aria-label="Otvoriť krátky kvíz pre odomknutie bonus packu"
          >
            Spraviť kvíz a odomknúť
          </Button>
        </div>
      </motion.div>
    );
  }

  const rank = results.indexOf(bonusCard) + 1 || 7;
  const rarity = getRarity(bonusCard, rank);

  return (
    <motion.div
      className="bonus-pack bonus-pack--unlocked"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <h3 className="bonus-pack__label">Bonus pack odomknutý</h3>
      <div className="bonus-pack__card-wrapper">
        <MajorCard
          result={bonusCard}
          rank={rank}
          rarity={rarity}
          isInCompare={compare.some((c) => c.name === bonusCard.name && c.field === bonusCard.field)}
          onCompare={onCompare}
          confidence={confidence}
        />
      </div>
    </motion.div>
  );
}
