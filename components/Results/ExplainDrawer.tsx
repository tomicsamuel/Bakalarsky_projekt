'use client';

import './explain-drawer.css';

import { X } from 'lucide-react';

import { getExplainReasons } from '@/lib/explainReasons';
import type { ScoreResult } from '@/lib/types';

type Props = {
  result: ScoreResult | null;
  rank: number;
  onClose: () => void;
};

export default function ExplainDrawer({ result, rank, onClose }: Props) {
  if (!result) return null;

  const reasons = getExplainReasons(result, rank);

  return (
    <div
      className="explain-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Prečo tento odbor"
    >
      <div className="explain-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="explain-drawer__header">
          <h3 className="explain-drawer__title">Prečo tento odbor?</h3>
          <button
            type="button"
            className="explain-drawer__close"
            onClick={onClose}
            aria-label="Zavrieť"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>
        <div className="explain-drawer__body">
          <h4 className="explain-drawer__major">{result.name}</h4>
          <p className="explain-drawer__field">{result.field}</p>
          <ul className="explain-drawer__reasons" role="list">
            {reasons.map((r, i) => (
              <li key={i} className="explain-drawer__reason">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
