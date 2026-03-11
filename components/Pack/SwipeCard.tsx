'use client';

import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'motion/react';

import { getMajorMeta } from '@/lib/majorsMeta';
import { getPackRarity, getRarityLabel } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';

import './pack.css';
import './swipe-draft.css';

type Props = {
  result: ScoreResult;
  rank: number;
  onSwipe: (direction: 'like' | 'pass' | 'superlike') => void;
  canSuperlike: boolean;
};

export default function SwipeCard({ result, rank, onSwipe, canSuperlike }: Props) {
  const meta = getMajorMeta(result);
  const rarity = getPackRarity(rank);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-12, 12]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superOpacity = useTransform(y, [0, -80], [0, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const dx = info.offset.x;
    const dy = info.offset.y;
    const vx = info.velocity.x;
    const vy = info.velocity.y;
    const threshold = 70;
    const velThreshold = 280;

    if (dy < -threshold || vy < -velThreshold) {
      if (canSuperlike) {
        animate(y, -380, { type: 'spring', stiffness: 200, damping: 25 }).then(() => onSwipe('superlike'));
        return;
      }
    }
    if (dx > threshold || vx > velThreshold) {
      animate(x, 380, { type: 'spring', stiffness: 200, damping: 25 }).then(() => onSwipe('like'));
      return;
    }
    if (dx < -threshold || vx < -velThreshold) {
      animate(x, -380, { type: 'spring', stiffness: 200, damping: 25 }).then(() => onSwipe('pass'));
      return;
    }
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
  };

  return (
    <motion.div
      className={`swipe-card swipe-card--${rarity.toLowerCase()}`}
      style={{ x, y, rotate }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      drag
      dragDirectionLock
      dragConstraints={{ left: -400, right: 400, top: -400, bottom: 200 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <motion.span
        className="swipe-card__hint swipe-card__hint--pass"
        style={{ opacity: passOpacity }}
      >
        Nie
      </motion.span>
      <motion.span
        className="swipe-card__hint swipe-card__hint--like"
        style={{ opacity: likeOpacity }}
      >
        Záujem
      </motion.span>
      {canSuperlike && (
        <motion.span
          className="swipe-card__hint swipe-card__hint--super"
          style={{ opacity: superOpacity }}
        >
          Super
        </motion.span>
      )}

      <article
        className={`swipe-card__inner major-card major-card--${rarity.toLowerCase()}`}
        aria-label={`#${rank} ${result.name}, ${result.field}`}
      >
        <div className="major-card__frame" aria-hidden />
        <div className="major-card__badge">{getRarityLabel(rarity)}</div>
        <div className="major-card__rank">#{rank}</div>
        <h3 className="major-card__name">{result.name}</h3>
        <p className="major-card__field">{result.field}</p>
        <div className="major-card__score">{result.score}%</div>
        <p className="major-card__tagline">{meta.tagline}</p>
        <div className="major-card__tags">
          {meta.tags.slice(0, 3).map((t) => (
            <span key={t} className="major-card__tag">
              {t}
            </span>
          ))}
        </div>
        <div className="major-card__stars" role="img" aria-label="Hviezdičkové zloženie">
          <div className="major-card__stars-header">Profil</div>
          {[
            { key: 'elektro' as const, label: 'Elektro' },
            { key: 'matematika' as const, label: 'Matematika' },
            { key: 'programovanie' as const, label: 'Programovanie' },
            { key: 'siete' as const, label: 'Siete' },
          ].map(({ key, label }) => {
            const n = meta.stars[key];
            return (
              <div key={key} className="major-card__star-row">
                <span className="major-card__star-label">{label}</span>
                <span className="major-card__star-dots" aria-label={`${n} z 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`major-card__star ${i < n ? 'major-card__star--filled' : 'major-card__star--empty'}`}
                      aria-hidden
                    >
                      {i < n ? '★' : '☆'}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </article>
    </motion.div>
  );
}
