import { getMajorMeta } from './majorsMeta';
import type { ScoreResult } from './types';

/**
 * Vráti top 3 dôvody, prečo bol odbor odporúčaný.
 * Používa tagy, tagline a skóre.
 */
export function getExplainReasons(result: ScoreResult, rank: number): string[] {
  const meta = getMajorMeta(result);
  const reasons: string[] = [];

  reasons.push(
    `Skóre ${result.score}% — ${result.score >= 80 ? 'vysoká' : result.score >= 60 ? 'dobrá' : 'stredná'} zhoda s tvojimi odpoveďami`
  );
  reasons.push(
    `Tagy (${meta.tags.join(', ')}) — súlad s tvojimi záujmami a zameraním`
  );
  reasons.push(`Poradie #${rank} — jeden z top odporúčaných odborov`);

  return reasons;
}
