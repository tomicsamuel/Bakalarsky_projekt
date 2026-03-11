import type { ScoreResult } from './types';
import { getMajorMeta } from './majorsMeta';
import type { MajorTag } from './majorsMeta';

export type SwipeChoice = 'like' | 'pass' | 'superlike';

export type SwipeOutcome = {
  result: ScoreResult;
  rank: number;
  choice: SwipeChoice;
};

/** One duel pair; after duel we get winner. */
export type DuelPair = [ScoreResult, ScoreResult];

/** Step: (a, b) or (a, null) where null = use previous duel winner. */
export type DuelStep = [ScoreResult, ScoreResult | null];

/**
 * Resolution after 6 swipes.
 * - 0 liked: 1 duel (top2 by score)
 * - 1 liked: no duel, winner = liked[0], alternative = best from top6 \\ {winner} (prefer non-passed)
 * - 2 liked: 1 duel (A vs B)
 * - 3 liked: duel B vs C, then winner vs A → steps [[B,C], [A, null]]
 * - 4+ liked: A vs D, B vs C, then winners → steps [[A,D], [B,C], [null, null]] (both null = use w1, w2)
 */
export type DuelResolution = {
  duelSteps: DuelStep[];
  /** If true, run one more duel: winner of step 0 vs winner of step 1. */
  finalDuel?: boolean;
  fallbackWinner?: ScoreResult;
  fallbackAlternative?: ScoreResult;
};

export function computeDuelQueue(
  top6: ScoreResult[],
  liked: ScoreResult[],
  passed: ScoreResult[]
): DuelResolution {
  if (liked.length === 0) {
    const [a, b] = top6.slice(0, 2);
    return { duelSteps: [[a, b]] };
  }

  if (liked.length === 1) {
    const winner = liked[0];
    const rest = top6.filter((r) => r.name !== winner.name || r.field !== winner.field);
    const preferred = rest.filter((r) => !passed.some((p) => p.name === r.name && p.field === r.field));
    const pool = preferred.length > 0 ? preferred : rest;
    const alternative = pool.sort((x, y) => y.score - x.score)[0];
    return { duelSteps: [], fallbackWinner: winner, fallbackAlternative: alternative };
  }

  if (liked.length === 2) {
    return { duelSteps: [[liked[0], liked[1]]] };
  }

  if (liked.length === 3) {
    const [A, B, C] = [...liked].sort((a, b) => b.score - a.score);
    return { duelSteps: [[B, C], [A, null]] };
  }

  if (liked.length >= 4) {
    const sorted = [...liked].sort((a, b) => b.score - a.score);
    const [A, B, C, D] = sorted.slice(0, 4);
    return { duelSteps: [[A, D], [B, C]], finalDuel: true };
  }

  return { duelSteps: [] };
}

/** Resolve step: null means "previous winner". Returns [left, right] for this duel. */
export function resolveStep(step: DuelStep, prevWinner: ScoreResult | null): DuelPair | null {
  const [a, b] = step;
  if (a && b) return [a, b];
  if (a && !b && prevWinner) return [a, prevWinner];
  return null;
}

/** Top 2 most frequent tags in liked results (no vectors). */
export function getTopTagsFromLiked(liked: ScoreResult[], limit = 2): MajorTag[] {
  const count: Record<string, number> = {};
  for (const r of liked) {
    const meta = getMajorMeta(r);
    for (const t of meta.tags) {
      count[t] = (count[t] ?? 0) + 1;
    }
  }
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, limit).map(([tag]) => tag as MajorTag);
}

/** Explanation sentence from liked + optional superlike highlight. */
export function explainLiked(
  liked: ScoreResult[],
  superlike: ScoreResult | null
): string {
  if (liked.length === 0) return 'Skús znova rozbaliť pack a niečo lajknuť.';
  const top = getTopTagsFromLiked(liked, 2);
  const tagStr = top.length ? top.join(', ') : '';
  let msg = tagStr ? `Najviac ťa láka: ${tagStr}.` : 'Vybral si odbory podľa svojho záujmu.';
  if (superlike) {
    msg += ` Tvoj superlike: ${superlike.name}.`;
  }
  return msg;
}
