import type { ScoreResult } from './types';

export function confidenceFromCompleteness(completeness01: number) {
  const c = Math.max(0, Math.min(1, completeness01));
  return Math.round(30 + c * 50); // 30..80
}

export function confidenceFromStability(results: ScoreResult[]) {
  if (results.length < 2) return 10;
  const top = results[0].score ?? 0;
  const second = results[1].score ?? 0;
  const gap = Math.max(0, Math.min(100, top - second)); // 0..100
  // small gap => lower stability, bigger gap => higher
  return Math.round(Math.min(20, gap / 5)); // 0..20
}

export function computeConfidence(params: {
  completeness01: number;
  results: ScoreResult[];
  duelDelta?: number;
}) {
  const base = confidenceFromCompleteness(params.completeness01) + confidenceFromStability(params.results);
  const total = base + (params.duelDelta ?? 0);
  return Math.max(0, Math.min(100, Math.round(total)));
}

