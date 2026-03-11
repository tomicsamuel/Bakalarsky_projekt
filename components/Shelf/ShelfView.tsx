'use client';

import './shelf.css';

import ShelfCard from './ShelfCard';
import { getRarity } from '@/lib/rarity';
import { getShelfColumns, getChangeLog } from '@/lib/shelfLogic';
import type { ScoreResult } from '@/lib/types';

type Props = {
  results: ScoreResult[];
  prevResults: ScoreResult[] | null;
  compare?: ScoreResult[];
  onCompare: (r: ScoreResult) => void;
  onExplain?: (r: ScoreResult, rank: number) => void;
};

function rankOf(results: ScoreResult[], r: ScoreResult): number {
  const idx = results.findIndex((x) => x.name === r.name && x.field === r.field);
  return idx >= 0 ? idx + 1 : 99;
}

export default function ShelfView({ results, prevResults, compare = [], onCompare, onExplain }: Props) {
  const cols = getShelfColumns(results);
  const changeLog = prevResults && prevResults.length > 0 ? getChangeLog(prevResults, results) : [];

  if (results.length === 0) {
    return (
      <div className="shelf-wrap">
        <h3 className="shelf-title">Kam ťa to ťahá</h3>
        <p className="shelf-desc shelf-desc--empty">
          Až vyplníš záujmy a prax, tu uvidíš odbory rozložené do stĺpcov — čo ti sedí najviac a čo stojí za prezretie.
        </p>
      </div>
    );
  }

  return (
    <div className="shelf-wrap">
      <h3 className="shelf-title">Kam ťa to ťahá</h3>
      <p className="shelf-desc">
        Posúvaj dôraz a preferencie vľavo — karty sa presunú. Detail otvorí stránku odboru, Porovnať pridá do duelu.
      </p>

      {changeLog.length > 0 && (
        <div className="shelf-changelog" role="status" aria-live="polite">
          <span className="shelf-changelog__label">Po posunutí:</span>
          {changeLog.map((entry, i) => (
            <span key={i} className="shelf-changelog__item">
              {entry}
            </span>
          ))}
        </div>
      )}

      <div className="shelf-columns">
        <section className="shelf-col shelf-col--best" aria-label="Najviac sedí">
          <h4 className="shelf-col__title">Najviac sedí</h4>
          <p className="shelf-col__hint">Dva odbory, ktoré ti podľa odpovedí najviac sedia</p>
          <div className="shelf-col__cards">
            {cols.best.map((r, i) => (
              <ShelfCard
                key={`${r.name}__${r.field}`}
                result={r}
                rank={i + 1}
                rarity={getRarity(r, i + 1)}
                variant="hero"
                isInCompare={compare.some((c) => c.name === r.name && c.field === r.field)}
                onCompare={onCompare}
                onExplain={onExplain}
              />
            ))}
          </div>
        </section>

        <section className="shelf-col shelf-col--alt" aria-label="Dobré alternatívy">
          <h4 className="shelf-col__title">Stojí za to pozrieť</h4>
          <p className="shelf-col__hint">Ďalšie odbory blízko tvojmu profilu</p>
          <div className="shelf-col__cards">
            {cols.alternatives.map((r, i) => (
              <ShelfCard
                key={`${r.name}__${r.field}`}
                result={r}
                rank={3 + i}
                rarity={getRarity(r, 3 + i)}
                variant="default"
                isInCompare={compare.some((c) => c.name === r.name && c.field === r.field)}
                onCompare={onCompare}
                onExplain={onExplain}
              />
            ))}
          </div>
        </section>

        <section className="shelf-col shelf-col--change" aria-label="Ak zmeníš preferencie">
          <h4 className="shelf-col__title">Skús pohnúť posuvníkom</h4>
          <p className="shelf-col__hint">Odbory tesne pod rebríčkom — malá zmena dôrazu ich môže posunúť hore</p>
          <div className="shelf-col__cards">
            {cols.ifYouChange.map((r) => (
              <ShelfCard
                key={`${r.name}__${r.field}`}
                result={r}
                rank={rankOf(results, r)}
                rarity={getRarity(r, rankOf(results, r))}
                variant="default"
                isInCompare={compare.some((c) => c.name === r.name && c.field === r.field)}
                onCompare={onCompare}
                onExplain={onExplain}
              />
            ))}
          </div>
        </section>

        <section className="shelf-col shelf-col--explore" aria-label="Preskúmaj">
          <h4 className="shelf-col__title">V rovnakých vodách</h4>
          <p className="shelf-col__hint">Odbory blízke tvojmu #1 — iná špecializácia, podobná oblasť</p>
          <div className="shelf-col__cards">
            {cols.explore.map((r) => (
              <ShelfCard
                key={`${r.name}__${r.field}`}
                result={r}
                rank={rankOf(results, r)}
                rarity={getRarity(r, rankOf(results, r))}
                variant="default"
                isInCompare={compare.some((c) => c.name === r.name && c.field === r.field)}
                onCompare={onCompare}
                onExplain={onExplain}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
