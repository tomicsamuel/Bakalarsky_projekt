'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './map-view.css';

import { getMajorMeta } from '@/lib/majorsMeta';
import { getPosition, areSimilar } from '@/lib/mapCoords';
import type { ScoreResult } from '@/lib/types';

type Props = {
  top: ScoreResult[];
  onCompare: (r: ScoreResult) => void;
  onExplain?: (r: ScoreResult, rank: number) => void;
  /** Keď false, klik len vyberie (tooltip s akciami), bez navigácie. */
  navigateOnClick?: boolean;
};

const SVG_PADDING = 48;
const SVG_W = 560;
const SVG_H = 320;
const MIN_R = 14;
const MAX_R = 32;

function px(x: number, y: number): { x: number; y: number } {
  return {
    x: SVG_PADDING + x * (SVG_W - 2 * SVG_PADDING),
    y: SVG_PADDING + y * (SVG_H - 2 * SVG_PADDING),
  };
}

export default function MapView({ top, onCompare, onExplain, navigateOnClick = true }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState<ScoreResult | null>(null);
  const [selected, setSelected] = useState<ScoreResult | null>(null);

  const maxScore = useMemo(() => Math.max(...top.map((t) => t.score), 1), [top]);

  const nodes = useMemo(
    () =>
      top.map((r) => {
        const pos = getPosition(r.name);
        const p = px(pos.x, pos.y);
        const rNorm = maxScore > 0 ? r.score / maxScore : 0;
        const radius = MIN_R + rNorm * (MAX_R - MIN_R);
        return { ...r, cx: p.x, cy: p.y, radius };
      }),
    [top, maxScore]
  );

  const edges = useMemo(() => {
    const names = new Set(top.map((t) => t.name));
    const out: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach((b) => {
        if (areSimilar(a.name, b.name)) {
          out.push({ x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy });
        }
      });
    });
    return out;
  }, [nodes]);

  const handleClick = (r: ScoreResult) => {
    if (!navigateOnClick) {
      setSelected((prev) => (prev?.name === r.name && prev?.field === r.field ? null : r));
      return;
    }
    onCompare(r);
    router.push(`/program/${encodeURIComponent(r.name)}/${encodeURIComponent(r.field)}`);
  };

  const display = hovered ?? selected;

  if (top.length === 0) {
    return (
      <div className="map-wrap map-wrap--empty">
        <h3 className="map-title">Mapa odborov</h3>
        <p className="map-desc">Vyplň záujmy a prax, aby sa zobrazila konštelácia odporúčaní.</p>
      </div>
    );
  }

  return (
    <div className="map-wrap">
      <h3 className="map-title">Mapa odborov</h3>
      <p className="map-desc">
        Bod = odbor, veľkosť = zhoda, vzdialenosť = podobnosť. Hover: popis + top 3. Klik: detail a pridanie do porovnania.
      </p>

      <div className="map-svg-wrap">
        <svg
          className="map-svg"
          viewBox={`0 0 ${SVG_W + 2 * SVG_PADDING} ${SVG_H + 2 * SVG_PADDING}`}
          role="img"
          aria-label="Konštelácia odborov podľa podobnosti a zhody"
        >
          <defs>
            <linearGradient id="map-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gradient-start)" />
              <stop offset="60%" stopColor="var(--gradient-mid)" />
              <stop offset="100%" stopColor="var(--gradient-end)" />
            </linearGradient>
            <filter id="map-node-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Hrany medzi podobnými */}
          <g className="map-edges" aria-hidden>
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                className="map-edge"
              />
            ))}
          </g>

          {/* Body (odbory) */}
          <g className="map-nodes">
            {nodes.map((r) => {
              const isHover = hovered?.name === r.name && hovered?.field === r.field;
              const isSelected = selected?.name === r.name && selected?.field === r.field;
              return (
                <g
                  key={`${r.name}__${r.field}`}
                  className="map-node-wrap"
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleClick(r)}
                >
                  <circle
                    className={`map-node ${isHover || isSelected ? 'map-node--hover' : ''} ${isSelected ? 'map-node--selected' : ''}`}
                    cx={r.cx}
                    cy={r.cy}
                    r={r.radius}
                    fill="url(#map-node-grad)"
                    filter="url(#map-node-shadow)"
                    aria-label={`${r.name}, zhoda ${r.score} percent, klikni pre detail a porovnanie`}
                  />
                  <text
                    className="map-node-label"
                    x={r.cx}
                    y={r.cy + r.radius + 16}
                    textAnchor="middle"
                    aria-hidden
                  >
                    {r.name.length > 18 ? r.name.slice(0, 16) + '…' : r.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Tooltip pri hover alebo výbere */}
      {display && (() => {
        const meta = getMajorMeta(display);
        const topActivities = meta.topActivities ?? ['–', '–', '–'];
        const rank = top.findIndex((r) => r.name === display.name && r.field === display.field) + 1 || 1;
        return (
          <div className="map-tooltip" role="tooltip">
            <div className="map-tooltip__name">{display.name}</div>
            <div className="map-tooltip__field">{display.field} · {display.score}% zhoda</div>
            <p className="map-tooltip__tagline">{meta.tagline}</p>
            <ul className="map-tooltip__activities">
              {topActivities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            {navigateOnClick ? (
              <span className="map-tooltip__hint">Klikni: detail + pridanie do porovnania</span>
            ) : (
              <div className="map-tooltip__actions">
                <Link
                  href={`/program/${encodeURIComponent(display.name)}/${encodeURIComponent(display.field)}`}
                  className="map-tooltip__btn"
                >
                  Detail
                </Link>
                <button
                  type="button"
                  className="map-tooltip__btn"
                  onClick={() => onCompare(display)}
                >
                  Porovnať
                </button>
                {onExplain && (
                  <button
                    type="button"
                    className="map-tooltip__btn"
                    onClick={() => onExplain(display, rank)}
                  >
                    Prečo?
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
