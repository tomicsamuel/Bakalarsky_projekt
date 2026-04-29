'use client';

import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'motion/react';

import { usePreferLightweightUI } from '@/hooks/usePreferLightweightUI';
import { getMajorMeta } from '@/lib/majorsMeta';
import { getPackRarity, getRarityLabel } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';

import './pack.css';
import './swipe-draft.css';

type Props = {
  result: ScoreResult;
  rank: number;
  onSwipe: (direction: 'like' | 'pass') => void;
};

export default function SwipeCard({ result, rank, onSwipe }: Props) {
  const prefersLightUi = usePreferLightweightUI();
  const meta = getMajorMeta(result);
  const rarity = getPackRarity(rank);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-12, 12]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const threshold = 70;
    const velThreshold = 280;

    const exitSpring =
      prefersLightUi
        ? { type: 'spring' as const, stiffness: 280, damping: 32 }
        : { type: 'spring' as const, stiffness: 200, damping: 25 };
    const resetSpring =
      prefersLightUi
        ? { type: 'spring' as const, stiffness: 340, damping: 34 }
        : { type: 'spring' as const, stiffness: 300, damping: 30 };

    if (dx > threshold || vx > velThreshold) {
      animate(x, 380, exitSpring).then(() => onSwipe('like'));
      return;
    }
    if (dx < -threshold || vx < -velThreshold) {
      animate(x, -380, exitSpring).then(() => onSwipe('pass'));
      return;
    }
    animate(x, 0, resetSpring);
  };

  return (
    <motion.div
      className={`swipe-card swipe-card--${rarity.toLowerCase()}`}
      style={{ x, rotate }}
      initial={{ opacity: 0, scale: prefersLightUi ? 0.99 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        prefersLightUi
          ? { type: 'spring', stiffness: 320, damping: 28 }
          : { type: 'spring', stiffness: 260, damping: 24 }
      }
      drag="x"
      dragConstraints={{ left: -400, right: 400 }}
      dragElastic={prefersLightUi ? 0.22 : 0.5}
      onDragEnd={handleDragEnd}
      {...(prefersLightUi ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } })}
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
