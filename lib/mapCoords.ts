/**
 * Súradnice odborov pre mapu konštelácie.
 * Vzdialenosť = podobnosť: AI bližšie k dátam/modelovaniu, elektro odbory k sebe.
 * x, y v rozsahu 0–1 (normalizované).
 */

export type Coord2D = { x: number; y: number };

const POSITIONS: Record<string, Coord2D> = {
  /* Informatika – AI/dáta vpravo hore, siete/kyber v strede */
  'Umelá inteligencia': { x: 0.82, y: 0.22 },
  'Počítačové modelovanie': { x: 0.78, y: 0.38 },
  'Informatika': { x: 0.68, y: 0.52 },
  'Kyberbezpečnosť': { x: 0.52, y: 0.38 },
  'Počítačové siete': { x: 0.48, y: 0.58 },
  /* Elektrotechnika – vľavo */
  'Aplikovaná elektrotechnika': { x: 0.28, y: 0.48 },
  'Priemyselná elektrotechnika': { x: 0.22, y: 0.62 },
  'Automobilová elektronika': { x: 0.32, y: 0.35 },
  'Elektroenergetika': { x: 0.18, y: 0.78 },
  'Fyzikálne inžinierstvo progresívnych materiálov': { x: 0.38, y: 0.18 },
};

/** Dvojice podobných odborov – medzi nimi sa kreslí hrana (bližšie = podobnejšie). */
export const SIMILAR_PAIRS: [string, string][] = [
  ['Umelá inteligencia', 'Počítačové modelovanie'],
  ['Počítačové modelovanie', 'Informatika'],
  ['Informatika', 'Kyberbezpečnosť'],
  ['Kyberbezpečnosť', 'Počítačové siete'],
  ['Počítačové siete', 'Informatika'],
  ['Aplikovaná elektrotechnika', 'Priemyselná elektrotechnika'],
  ['Aplikovaná elektrotechnika', 'Automobilová elektronika'],
  ['Priemyselná elektrotechnika', 'Elektroenergetika'],
  ['Automobilová elektronika', 'Aplikovaná elektrotechnika'],
  ['Fyzikálne inžinierstvo progresívnych materiálov', 'Aplikovaná elektrotechnika'],
];

export function getPosition(majorName: string): Coord2D {
  return POSITIONS[majorName] ?? { x: 0.5, y: 0.5 };
}

export function areSimilar(nameA: string, nameB: string): boolean {
  if (nameA > nameB) [nameA, nameB] = [nameB, nameA];
  return SIMILAR_PAIRS.some(([a, b]) => a === nameA && b === nameB);
}

/** Vráti mená odborov podobných danému (pre stĺpec Preskúmaj). */
export function getSimilarMajors(majorName: string): string[] {
  const out = new Set<string>();
  for (const [a, b] of SIMILAR_PAIRS) {
    if (a === majorName) out.add(b);
    if (b === majorName) out.add(a);
  }
  return [...out];
}

/** Poradie pre vizuálne zhlukovanie – Informatika, potom Elektro. */
const ORDER: string[] = [
  'Umelá inteligencia',
  'Počítačové modelovanie',
  'Informatika',
  'Kyberbezpečnosť',
  'Počítačové siete',
  'Aplikovaná elektrotechnika',
  'Automobilová elektronika',
  'Priemyselná elektrotechnika',
  'Elektroenergetika',
  'Fyzikálne inžinierstvo progresívnych materiálov',
];

/** Preusporiada výsledky – podobné odbory k sebe (Informatika, Elektro). */
export function groupResultsBySimilarity<T extends { name: string }>(results: T[]): T[] {
  const orderMap = new Map(ORDER.map((n, i) => [n, i]));
  return [...results].sort((a, b) => {
    const ia = orderMap.get(a.name) ?? 999;
    const ib = orderMap.get(b.name) ?? 999;
    return ia - ib;
  });
}

/** Skrátené labely pre radar – čitateľné, neodrezané. */
export const RADAR_LABELS: Record<string, string> = {
  'Fyzikálne inžinierstvo progresívnych materiálov': 'Fyz. inž. materiálov',
  'Aplikovaná elektrotechnika': 'Apl. elektrotechnika',
  'Priemyselná elektrotechnika': 'Priem. elektrotechnika',
  'Automobilová elektronika': 'Automob. elektronika',
  'Počítačové modelovanie': 'Poč. modelovanie',
  'Počítačové siete': 'Poč. siete',
  'Umelá inteligencia': 'Umelá intel.',
  Kyberbezpečnosť: 'Kyberbezpečnosť',
  Informatika: 'Informatika',
  Elektroenergetika: 'Elektroenergetika',
};

export function getRadarLabel(name: string): string {
  return RADAR_LABELS[name] ?? (name.length > 18 ? name.slice(0, 16) + '…' : name);
}
