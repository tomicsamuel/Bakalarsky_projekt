import Link from 'next/link';
import { Button } from '@heroui/button';

import './result-card.css';

import type { ScoreResult } from '@/lib/types';
import { getMajorMeta } from '@/lib/majorsMeta';

type Props = {
  result: ScoreResult;
  rank: number;
  onCompare?: (r: ScoreResult) => void;
};

export default function ResultCard({ result, rank, onCompare }: Props) {
  const meta = getMajorMeta(result);

  return (
    <div className="result-card" role="group" aria-label={`#${rank} ${result.name}`}>
      <div className="result-card__top">
        <div>
          <div className="result-card__name">
            #{rank} {result.name}
          </div>
          <div className="result-card__field">{result.field}</div>
        </div>
        <div className="result-card__score">{result.score}%</div>
      </div>

      <div className="result-card__tagline">{meta.tagline}</div>

      <div className="result-card__tags" aria-label="Tagy">
        {meta.tags.map((t) => (
          <span key={t} className="result-tag">
            {t}
          </span>
        ))}
      </div>

      <div className="result-card__stars" aria-label="Hviezdičkové zloženie">
        <div className="result-card__stars-header">Profil</div>
        {[
          { key: 'elektro' as const, label: 'Elektro' },
          { key: 'matematika' as const, label: 'Matematika' },
          { key: 'programovanie' as const, label: 'Programovanie' },
          { key: 'siete' as const, label: 'Siete' },
        ].map(({ key, label }) => {
          const n = meta.stars[key];
          return (
            <div key={key} className="star-row">
              <span className="star-label">{label}</span>
              <span className="star-dots" aria-label={`${n} z 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`star ${i < n ? 'star--filled' : 'star--empty'}`}
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

      <div className="result-card__cta">
        <Button type="button" color="primary" variant="solid" size="sm" onPress={() => onCompare?.(result)}>
          Porovnať
        </Button>
        <Button
          as={Link}
          href={`/program/${encodeURIComponent(result.name)}/${encodeURIComponent(result.field)}`}
          color="primary"
          variant="bordered"
          size="sm"
        >
          Detail
        </Button>
      </div>
    </div>
  );
}

