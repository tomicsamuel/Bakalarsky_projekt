'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@heroui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import './pack.css';

import MajorCard from './MajorCard';
import { usePreferLightweightUI } from '@/hooks/usePreferLightweightUI';
import { getPackRarity, getRarity } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';

const SHUFFLE_DURATION_MS_DESKTOP = 800;
const SHUFFLE_DURATION_MS_MOBILE = 380;
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
  /** Skryť tlačidlo "Prejsť na výsledky" – napr. keď sme už na stránke výsledkov */
  showDoneButton?: boolean;
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
  showDoneButton = true,
}: Props) {
  const prefersLightUi = usePreferLightweightUI();
  const shuffleDurationMs = prefersLightUi ? SHUFFLE_DURATION_MS_MOBILE : SHUFFLE_DURATION_MS_DESKTOP;
  const top6 = results.slice(0, 6);
  const shuffleDeck = prefersLightUi ? top6.slice(-3) : top6;
  const [isShuffling, setIsShuffling] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const packFlow = onAddToDuel != null;

  const goPrev = () => setCarouselIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCarouselIndex((i) => Math.min(top6.length - 1, i + 1));

  useEffect(() => {
    const t = setTimeout(() => setIsShuffling(false), shuffleDurationMs);
    return () => clearTimeout(t);
  }, [shuffleDurationMs]);

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
              {shuffleDeck.map((_, deckIdx) => {
                const i = deckIdx;
                const deckLen = shuffleDeck.length;
                const mid = (deckLen - 1) / 2 || 0;
                const offsetX = (i - mid) * 4;
                const offsetY = (i - mid) * 6;
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
                    animate={
                      prefersLightUi
                        ? {
                            x: offsetX,
                            y: offsetY,
                            rotate: -6 + i * 2,
                            scale: 0.92,
                          }
                        : {
                            x: [offsetX, offsetX + 15, offsetX - 10, offsetX + 8, offsetX],
                            y: [offsetY, offsetY - 8, offsetY + 12, offsetY - 5, offsetY],
                            rotate: [-8 + i * 3, 5 - i * 2, -6 + i, 8 - i, -8 + i * 3],
                            scale: [0.85, 0.9, 0.88, 0.92, 0.9],
                          }
                    }
                    transition={{
                      duration: shuffleDurationMs / 1000,
                      repeat: 0,
                      delay: i * 0.04,
                      ...(prefersLightUi ? { ease: [0.25, 0.1, 0.25, 1] } : {}),
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

      {/* Mobil/tablet: pager s bočnými kartičkami (CSS transform stacking) */}
      <div className="card-reveal__pager" aria-label="Prehľad odborov">
        {/* Wrapper drží tlačidlá mimo overflow:hidden kontajnera */}
        <div className="card-reveal__pager-track">
          {/* card kontajner orezáva bočné kartičky */}
          <div className="card-reveal__pager-card">
            {top6.map((r, i) => {
              const rank = i + 1;
              const rarity = packFlow ? getPackRarity(rank) : getRarity(r, rank);
              const offset = i - carouselIndex;
              const absOffset = Math.abs(offset);
              const clampedAbs = Math.min(absOffset, 2);
              return (
                <motion.div
                  key={`${r.name}__${r.field}`}
                  className="card-reveal__pager-slide"
                  aria-hidden={i !== carouselIndex}
                  animate={{
                    x: `${offset * 93}%`,
                    scale: 1 - clampedAbs * 0.1,
                    opacity: Math.max(
                      0,
                      prefersLightUi
                        ? 1 - absOffset * 0.75
                        : 1 - absOffset * 0.6
                    ),
                    ...(prefersLightUi
                      ? { filter: 'none' }
                      : { filter: `blur(${clampedAbs * 2}px)` }),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: prefersLightUi ? 420 : 320,
                    damping: prefersLightUi ? 42 : 32,
                    mass: prefersLightUi ? 0.55 : 0.75,
                  }}
                  style={{
                    zIndex: 10 - absOffset * 3,
                    pointerEvents: absOffset === 0 ? 'auto' : 'none',
                  }}
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
                    disableTilt={prefersLightUi}
                    isInCompare={!packFlow && compare.some((c) => c.name === r.name && c.field === r.field)}
                    onCompare={packFlow ? undefined : onCompare}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Tlačidlá sú mimo overflow:hidden, takže nie sú odrezané */}
          <button
            type="button"
            className={`card-reveal__pager-btn card-reveal__pager-btn--prev ${carouselIndex === 0 ? 'card-reveal__pager-btn--hidden' : ''}`}
            onClick={goPrev}
            disabled={carouselIndex === 0}
            aria-label="Predchádzajúci odbor"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`card-reveal__pager-btn card-reveal__pager-btn--next ${carouselIndex >= top6.length - 1 ? 'card-reveal__pager-btn--hidden' : ''}`}
            onClick={goNext}
            disabled={carouselIndex >= top6.length - 1}
            aria-label="Ďalší odbor"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="card-reveal__pager-nav">
          <div className="card-reveal__pager-dots">
            {top6.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`card-reveal__pager-dot ${i === carouselIndex ? 'active' : ''}`}
                onClick={() => setCarouselIndex(i)}
                aria-label={`Odbor ${i + 1} z ${top6.length}`}
                aria-current={i === carouselIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: mriežka */}
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
            {showDoneButton && top6.length > 0 && (
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
