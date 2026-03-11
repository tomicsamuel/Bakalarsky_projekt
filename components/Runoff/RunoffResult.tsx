'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import type { ScoreResult } from '@/lib/types';
import './runoff-result.css';

type ImpactChip = { label: string; tag?: string };

type Props = {
  winner: ScoreResult;
  alternative: ScoreResult;
  reasons: string[];
  impactChips?: ImpactChip[];
  superlikeName?: string | null;
  onBack: () => void;
  onTryAgain?: () => void;
};

export default function RunoffResult({
  winner,
  alternative,
  reasons,
  impactChips = [],
  superlikeName,
  onBack,
  onTryAgain,
}: Props) {
  const topTags = impactChips
    .filter((c) => c.tag)
    .map((c) => c.tag as string)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 2);
  const winnerPicks = impactChips.filter((c) => c.label.includes(winner.name)).length;

  const bullets: string[] = [];
  if (topTags.length) bullets.push(`Najviac ťa zaujalo: ${topTags.join(', ')}`);
  if (winnerPicks > 0) bullets.push(`V rozstrele si ${winnerPicks}× vybral: ${winner.name}`);
  if (superlikeName) bullets.push(`Superlike si dal: ${superlikeName}`);
  const finalBullets = bullets.length ? bullets : reasons.slice(0, 3);

  return (
    <motion.div
      className="runoff-result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="runoff-result__inner">
        <h2 className="runoff-result__title">Tvoj odporúčaný odbor</h2>

        <div className="runoff-result__cards">
          <motion.div
            className="runoff-result__card runoff-result__card--winner"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 24 }}
          >
            <span className="runoff-result__card-label">TOP PICK</span>
            <div className="runoff-result__card-name">{winner.name}</div>
            <p className="runoff-result__card-score">{winner.score}%</p>
          </motion.div>
          <motion.div
            className="runoff-result__card runoff-result__card--alt"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 24 }}
          >
            <span className="runoff-result__card-label">STRONG ALTERNATIVE</span>
            <div className="runoff-result__card-name">{alternative.name}</div>
            <p className="runoff-result__card-score">{alternative.score}%</p>
          </motion.div>
        </div>

        {finalBullets.length > 0 && (
          <div className="runoff-result__why">
            <h4 className="runoff-result__why-title">Prečo</h4>
            <ul className="runoff-result__why-list">
              {finalBullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="runoff-result__cta-hint">Pozri si detail odporúčaného odboru alebo sa vráť k výsledkom.</p>
        <div className="runoff-result__actions">
          <Link
            href={`/program/${encodeURIComponent(winner.name)}/${encodeURIComponent(winner.field)}`}
            className="runoff-result__btn runoff-result__btn--primary"
          >
            Pozrieť detail víťaza
          </Link>
          <button type="button" className="runoff-result__btn runoff-result__btn--secondary" onClick={onBack}>
            Späť na výsledky
          </button>
          <Link
            href={`/program/${encodeURIComponent(alternative.name)}/${encodeURIComponent(alternative.field)}`}
            className="runoff-result__link"
          >
            Porovnať s alternatívou
          </Link>
          {onTryAgain && (
            <button type="button" className="runoff-result__link" onClick={onTryAgain}>
              Skúsiť rozstrel znova
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
