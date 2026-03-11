'use client';

import Link from 'next/link';
import './interactive-results.css';

import type { ScoreResult } from '@/lib/types';

interface InteractiveResultsProps {
  results: ScoreResult[];
}

function ScoreRing({ score, size = 80, stroke = 6, id = 'scoreRing' }: { score: number; size?: number; stroke?: number; id?: string }) {
  const r = (size - stroke) / 2 - 2;
  const circumference = 2 * Math.PI * r;
  const percent = Math.min(100, Math.max(0, score));
  const dash = (percent / 100) * circumference;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="score-ring-svg" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gradient-start)" />
          <stop offset="50%" stopColor="var(--gradient-mid)" />
          <stop offset="100%" stopColor="var(--gradient-end)" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="score-ring-fill"
      />
    </svg>
  );
}

export default function InteractiveResults({ results }: InteractiveResultsProps) {
  if (results.length === 0) {
    return (
      <div className="interactive-results-empty">
        <div className="empty-animation">
          <div className="empty-circle"></div>
          <div className="empty-circle"></div>
          <div className="empty-circle"></div>
        </div>
        <h3>Začni vyplňovať formulár</h3>
        <p>Postupne odpovedaj na otázky a uvidíš výsledky v reálnom čase</p>
      </div>
    );
  }

  const maxScore = Math.max(...results.map((r) => r.score));
  const hero = results[0];
  const rest = results.slice(1);
  const heroScorePercent = maxScore > 0 ? (hero.score / maxScore) * 100 : 0;

  return (
    <div className="interactive-results-container">
      {/* Hero – #1 odporúčanie */}
      <Link
        href={`/program/${encodeURIComponent(hero.name)}/${encodeURIComponent(hero.field)}`}
        className="results-hero"
        style={{ animationDelay: '0.05s' }}
        aria-label={`Najlepší výber: ${hero.name}, skóre ${hero.score} percent`}
      >
        <div className="results-hero-accent" aria-hidden />
        <span className="results-hero-rank">#1</span>
        <div className="results-hero-content">
          <h2 className="results-hero-title">{hero.name}</h2>
          <p className="results-hero-field">{hero.field}</p>
          <div className="results-hero-score-wrap">
            <div className="results-hero-score-ring">
              <ScoreRing score={heroScorePercent} size={100} stroke={8} />
              <span className="results-hero-score-value">{hero.score}%</span>
            </div>
          </div>
          <span className="results-hero-cta">Zistiť viac</span>
        </div>
      </Link>

      {/* Bento – pozri aj ostatné */}
      {rest.length > 0 && (
        <div className="results-bento-wrap">
          <h3 className="results-bento-heading">Pozri aj ostatné</h3>
          <div className="results-bento">
            {rest.map((program, index) => {
              const rank = index + 2;
              const scorePercent = maxScore > 0 ? (program.score / maxScore) * 100 : 0;
              const isLarge = index === 0;
              const isMedium = index === 1 || index === 2;
              const delay = 0.1 + (index + 1) * 0.06;
              return (
                <Link
                  key={index}
                  href={`/program/${encodeURIComponent(program.name)}/${encodeURIComponent(program.field)}`}
                  className={`bento-item ${isLarge ? 'bento-item--large' : ''} ${isMedium ? 'bento-item--medium' : ''}`}
                  style={{ animationDelay: `${delay}s` }}
                  aria-label={`${program.name}, ${program.field}, skóre ${program.score} percent`}
                >
                  <span className="bento-rank">#{rank}</span>
                  <span className="bento-name">{program.name}</span>
                  <span className="bento-field">{program.field}</span>
                  <div className="bento-score-row">
                    <div className="bento-score-bar-wrap">
                      <div
                        className="bento-score-bar-fill"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                    <span className="bento-score-value">{program.score}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
