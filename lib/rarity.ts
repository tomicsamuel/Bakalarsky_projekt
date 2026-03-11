import type { ScoreResult } from './types';

export type Rarity = 'Legendary' | 'Epic' | 'Rare' | 'Common';

/**
 * Deterministická rarity logika (Režim A).
 * Výsledok je stabilný – rarity sa priraďuje podľa skóre a poradia.
 *
 * Legendary: #1 a score > 90
 * Epic: #2–#3
 * Rare: #4–#6
 * Common: ostatné
 */
export function getRarity(result: ScoreResult, rank: number): Rarity {
  if (rank === 1 && result.score > 90) return 'Legendary';
  if (rank === 2 || rank === 3) return 'Epic';
  if (rank >= 4 && rank <= 6) return 'Rare';
  return 'Common';
}

/** Pack: deterministická rarity podľa ranku (1 Legendary, 2–3 Epic, 4–6 Rare). */
export function getPackRarity(rank: number): Rarity {
  if (rank === 1) return 'Legendary';
  if (rank === 2 || rank === 3) return 'Epic';
  if (rank >= 4 && rank <= 6) return 'Rare';
  return 'Common';
}

/** Slovenský label pre zobrazenie v UI. */
const RARITY_LABELS: Record<Rarity, string> = {
  Common: 'Bežná',
  Rare: 'Vzácna',
  Epic: 'Epická',
  Legendary: 'Legendárna',
};

export function getRarityLabel(rarity: Rarity): string {
  return RARITY_LABELS[rarity] ?? rarity;
}
