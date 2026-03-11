import type { FilterState, ScoreResult } from './types';
import { getMajorMeta } from './majorsMeta';

type ExplainInput = {
  prev: ScoreResult[];
  next: ScoreResult[];
  filter: FilterState;
};

function topN(list: ScoreResult[], n: number) {
  return list.slice(0, n).map((r) => r.name);
}

function enabledToggles(filter: FilterState) {
  return Object.entries(filter.toggles)
    .filter(([, v]) => v)
    .map(([k]) => k);
}

export function explainWhatIf({ prev, next, filter }: ExplainInput): string {
  const prevTop = topN(prev, 3);
  const nextTop = topN(next, 3);

  const changed = prevTop.join('|') !== nextTop.join('|');
  if (!changed) {
    const toggles = enabledToggles(filter);
    if (toggles.length === 0) return 'Rebríček ostal rovnaký. Skús zapnúť nejakú preferenciu.';
    return `S ${toggles.join(', ')} sa poradie len mierne posunulo.`;
  }

  const prev1 = prevTop[0];
  const next1 = nextTop[0];
  const toggles = enabledToggles(filter);

  if (prev1 !== next1) {
    if (toggles.length) {
      return `„${next1}“ je teraz #1 — dôraz na ${toggles.join(' a ')} to posunul.`;
    }
    return `„${next1}“ sa dostal na prvú priečku.`;
  }

  const joined = nextTop.filter((x) => !prevTop.includes(x));
  if (joined.length) {
    return `Do trojky sa dostal „${joined[0]}“.`;
  }

  return 'Rebríček sa po úprave posunul.';
}

/** Krátky dôvod prečo si používateľ vybral víťaza duelu (na základe tagov). */
export function explainDuelWinner(winner: ScoreResult): string {
  const meta = getMajorMeta(winner);
  const tags = meta.tags.slice(0, 2).join(' a ');
  return `Vybral si ${winner.name}, lebo ti sedí ${tags}.`;
}