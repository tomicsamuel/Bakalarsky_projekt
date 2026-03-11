import { getSimilarMajors } from './mapCoords';
import type { ScoreResult } from './types';

export type ShelfColumns = {
  best: ScoreResult[];
  alternatives: ScoreResult[];
  ifYouChange: ScoreResult[];
  explore: ScoreResult[];
};

const SCORE_CLOSE_THRESHOLD = 12; // bodov pod 6. miestom

/**
 * Rozdelí výsledky do 4 stĺpcov shelfu.
 * - best: top 1–2
 * - alternatives: top 3–6
 * - ifYouChange: rank 7+ s score tesne pod 6. (do ~12 bodov)
 * - explore: podobné top 1–2, ktoré ešte nie sú v predošlých stĺpcoch
 */
export function getShelfColumns(results: ScoreResult[]): ShelfColumns {
  const best = results.slice(0, 2);
  const alternatives = results.slice(2, 6);
  const top6Set = new Set(results.slice(0, 6).map((r) => `${r.name}__${r.field}`));

  const sixthScore = results[5]?.score ?? 0;
  const threshold = Math.max(0, sixthScore - SCORE_CLOSE_THRESHOLD);
  const ifYouChange = results.slice(6).filter((r) => r.score >= threshold);

  const exploreNames = new Set<string>();
  if (results[0]) getSimilarMajors(results[0].name).forEach((n) => exploreNames.add(n));
  if (results[1]) getSimilarMajors(results[1].name).forEach((n) => exploreNames.add(n));

  const alreadyPlaced = new Set([
    ...results.slice(0, 6).map((r) => r.name),
    ...ifYouChange.map((r) => r.name),
  ]);
  const explore = results.filter((r) => exploreNames.has(r.name) && !alreadyPlaced.has(r.name));

  return { best, alternatives, ifYouChange, explore };
}

export type ChangeLogEntry = string;

/**
 * Porovná predošlé a nové poradie, vráti krátke správy pre UI.
 */
export function getChangeLog(prev: ScoreResult[], next: ScoreResult[]): ChangeLogEntry[] {
  const entries: ChangeLogEntry[] = [];
  const prevRank = new Map(prev.map((r, i) => [`${r.name}__${r.field}`, i + 1]));
  const nextRank = new Map(next.map((r, i) => [`${r.name}__${r.field}`, i + 1]));

  const key = (r: ScoreResult) => `${r.name}__${r.field}`;

  next.forEach((r, i) => {
    const k = key(r);
    const oldR = prevRank.get(k);
    const newR = i + 1;
    if (oldR == null) return;
    const delta = oldR - newR;
    if (delta > 0) entries.push(`${r.name} ↑${delta} ${delta === 1 ? 'pozíciu' : 'pozície'}`);
    if (delta < 0) entries.push(`${r.name} ↓${-delta} ${-delta === 1 ? 'pozíciu' : 'pozície'}`);
  });

  // "X preskočila Y": v next je X pred Y, v prev bolo Y pred X
  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      const a = next[i];
      const b = next[j];
      const prevA = prevRank.get(key(a)) ?? 99;
      const prevB = prevRank.get(key(b)) ?? 99;
      if (prevB < prevA && a.name !== b.name) {
        entries.push(`${a.name} preskočila ${b.name}`);
        break;
      }
    }
  }

  return entries.slice(0, 5);
}
