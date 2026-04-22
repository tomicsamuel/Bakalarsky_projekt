'use client';

import Link from 'next/link';
import { Button } from '@heroui/button';

import TiltedCard from '@/components/TiltedCard/TiltedCard';
import './shelf-card.css';

import type { Rarity } from '@/lib/rarity';
import type { ScoreResult } from '@/lib/types';
import { getMajorMeta } from '@/lib/majorsMeta';

type Props = {
  result: ScoreResult;
  rank?: number;
  variant?: 'default' | 'hero';
  rarity?: Rarity;
  isInCompare?: boolean;
  onCompare: (r: ScoreResult) => void;
  onExplain?: (r: ScoreResult, rank: number) => void;
  disableTilt?: boolean;
};

export default function ShelfCard({ result, rank, variant = 'default', rarity, isInCompare = false, onCompare, onExplain, disableTilt = false }: Props) {
  const meta = getMajorMeta(result);
  const detailHref = `/program/${encodeURIComponent(result.name)}/${encodeURIComponent(result.field)}`;

  return (
    <TiltedCard rotateAmplitude={12} scaleOnHover={1.05} className="shelf-card-tilt" disabled={disableTilt}>
      <article
        className={`shelf-card shelf-card--${variant} ${rarity ? `shelf-card--rarity shelf-card--${rarity.toLowerCase()}` : ''}`}
        data-rank={rank}
        data-rarity={rarity}
        aria-label={`${rank ? `#${rank} ` : ''}${result.name}, ${result.field}${rarity ? `, ${rarity}` : ''}`}
      >
      {rarity && <div className="shelf-card__rarity-frame" aria-hidden />}
      <div className="shelf-card__accent" aria-hidden />
      {rank != null && (
        <div className="shelf-card__rank" aria-hidden>
          #{rank}
        </div>
      )}
      <div className="shelf-card__main">
        <h3 className="shelf-card__name">
          <Link href={detailHref} className="shelf-card__name-link">
            {result.name}
          </Link>
        </h3>
        <p className="shelf-card__field">{result.field}</p>
        <div className="shelf-card__score">{result.score}%</div>
        <p className="shelf-card__tagline">{meta.tagline}</p>
        <div className="shelf-card__tags">
          {meta.tags.map((t) => (
            <span key={t} className="shelf-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="shelf-card__cta">
        <Button
          as={Link}
          href={detailHref}
          color="primary"
          variant="solid"
          size="sm"
          className="shelf-btn shelf-btn--primary"
        >
          Detail
        </Button>
        <Button
          type="button"
          color="primary"
          variant="bordered"
          size="sm"
          onPress={() => onCompare(result)}
          className={`shelf-btn shelf-btn--compare ${isInCompare ? 'shelf-btn--active' : ''}`}
          aria-pressed={isInCompare}
        >
          Porovnať
        </Button>
        {onExplain && rank != null && (
          <Button
            type="button"
            color="primary"
            variant="ghost"
            size="sm"
            onPress={() => onExplain(result, rank)}
            aria-label="Prečo tento odbor"
            className="shelf-btn shelf-btn--explain"
          >
            Prečo?
          </Button>
        )}
      </div>
    </article>
    </TiltedCard>
  );
}
