'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Swords, Eye } from 'lucide-react';
import { Button } from '@heroui/button';

import TiltedCard from '@/components/TiltedCard/TiltedCard';
import './pack.css';

import { getMajorMeta } from '@/lib/majorsMeta';
import type { Rarity } from '@/lib/rarity';
import { getRarityLabel } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';

const PINNED_KEY = 'fei_finder_pinned';

function getPinnedSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function togglePin(name: string, field: string): void {
  const key = `${name}__${field}`;
  const set = getPinnedSet();
  if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
  localStorage.setItem(PINNED_KEY, JSON.stringify([...set]));
}

export default function MajorCard({
  result,
  rank,
  rarity,
  /** Pack flow: slot A, B alebo null */
  duelSlot = null,
  onAddToDuel,
  onAddToShortlist,
  onExplain,
  confidence = 0,
  /** Klasický režim (Shelf): Porovnať + Prečo */
  isInCompare = false,
  onCompare,
}: {
  result: ScoreResult;
  rank: number;
  rarity: Rarity;
  duelSlot?: 'A' | 'B' | null;
  onAddToDuel?: (r: ScoreResult) => void;
  onAddToShortlist?: (r: ScoreResult) => void;
  onExplain?: (r: ScoreResult, rank: number) => void;
  confidence?: number;
  isInCompare?: boolean;
  onCompare?: (r: ScoreResult) => void;
}) {
  const meta = getMajorMeta(result);
  const detailHref = `/program/${encodeURIComponent(result.name)}/${encodeURIComponent(result.field)}`;
  const key = `${result.name}__${result.field}`;
  const [isPinned, setIsPinned] = useState(() => getPinnedSet().has(key));

  const showFoil = (rarity === 'Epic' || rarity === 'Legendary') && confidence >= 70;
  const isPackFlow = onAddToDuel != null;

  const handleShortlist = () => {
    togglePin(result.name, result.field);
    setIsPinned(getPinnedSet().has(key));
    onAddToShortlist?.(result);
  };

  return (
    <TiltedCard rotateAmplitude={12} scaleOnHover={1.05} className="major-card-tilt">
      <article
        className={`major-card major-card--${rarity.toLowerCase()} ${showFoil ? 'major-card--foil' : ''}`}
        data-rank={rank}
        data-rarity={rarity}
        aria-label={`#${rank} ${result.name}, ${result.field}, ${getRarityLabel(rarity)}`}
      >
      <div className="major-card__frame" aria-hidden />
      {showFoil && <div className="major-card__foil" aria-hidden />}
      <div className="major-card__badge">{getRarityLabel(rarity)}</div>
      <div className="major-card__rank">#{rank}</div>
      <h3 className="major-card__name">
        <Link href={detailHref}>{result.name}</Link>
      </h3>
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
      <div className="major-card__cta">
        {isPackFlow ? (
          <>
            <Button
              as={Link}
              href={detailHref}
              color="primary"
              variant="solid"
              size="sm"
              className="major-card__btn major-card__btn--primary"
            >
              <Eye size={16} aria-hidden />
              <span>Detail</span>
            </Button>
            {onAddToDuel && (
              <Button
                type="button"
                color="primary"
                variant="bordered"
                size="sm"
                onPress={() => onAddToDuel(result)}
                className={`major-card__btn major-card__btn--duel ${duelSlot ? 'major-card__btn--active' : ''}`}
                aria-pressed={!!duelSlot}
              >
                <Swords size={16} aria-hidden />
                <span>Do duelu{duelSlot ? ` (${duelSlot})` : ''}</span>
              </Button>
            )}
            <button
              type="button"
              className={`major-card__pin ${isPinned ? 'major-card__pin--active' : ''}`}
              onClick={handleShortlist}
              aria-label={isPinned ? 'Odstrániť zo shortlistu' : 'Zaujíma ma'}
              aria-pressed={isPinned}
            >
              <Star size={18} fill={isPinned ? 'currentColor' : 'none'} strokeWidth={2} />
              <span className="major-card__pin-label">Zaujíma ma</span>
            </button>
            {onExplain && (
              <Button
                type="button"
                color="primary"
                variant="ghost"
                size="sm"
                onPress={() => onExplain(result, rank)}
                aria-label="Prečo tento odbor"
                className="major-card__explain"
              >
                Prečo?
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              as={Link}
              href={detailHref}
              color="primary"
              variant="solid"
              size="sm"
              className="major-card__btn major-card__btn--primary"
            >
              Detail
            </Button>
            {onCompare && (
              <Button
                type="button"
                color="primary"
                variant="bordered"
                size="sm"
                onPress={() => onCompare(result)}
                className={`major-card__btn major-card__btn--compare ${isInCompare ? 'major-card__btn--active' : ''}`}
                aria-pressed={isInCompare}
              >
                Porovnať
              </Button>
            )}
            {onExplain && (
              <Button
                type="button"
                color="primary"
                variant="ghost"
                size="sm"
                onPress={() => onExplain(result, rank)}
                aria-label="Prečo tento odbor"
                className="major-card__explain"
              >
                Prečo tento odbor?
              </Button>
            )}
            <button
              type="button"
              className={`major-card__pin ${isPinned ? 'major-card__pin--active' : ''}`}
              onClick={handleShortlist}
              aria-label={isPinned ? 'Odstrániť z obľúbených' : 'Pridať do obľúbených'}
              aria-pressed={isPinned}
            >
              <Star size={18} fill={isPinned ? 'currentColor' : 'none'} strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </article>
    </TiltedCard>
  );
}
