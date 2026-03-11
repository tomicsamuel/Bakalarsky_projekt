import { getMajorMeta } from './majorsMeta';
import type { ScoreResult } from './types';

/** Štandardné osi pre radar chart – spoločné pre všetky odbory */
export const RADAR_AXES = ['Prax', 'Matika', 'Kód', 'Siete', 'Bezpečnosť', 'HW'] as const;

type RadarAxis = (typeof RADAR_AXES)[number];

/** Mapovanie meta labelov na štandardné osi */
const LABEL_MAP: Record<string, RadarAxis> = {
  Prax: 'Prax',
  Matika: 'Matika',
  Kód: 'Kód',
  Siete: 'Siete',
  'Bezpeč.': 'Bezpečnosť',
  Bezpečnosť: 'Bezpečnosť',
  HW: 'HW',
  Energia: 'HW',
  Modely: 'Kód',
  Analýza: 'Matika',
  AI: 'Kód',
  Dáta: 'Kód',
  Systémy: 'Siete',
  Autom: 'Prax',
  Embedded: 'HW',
  Fyzika: 'Matika',
  'R&D': 'Prax',
  Teória: 'Matika',
};

/** Hviezdy 1–5 → hodnota 0–100 pre radar */
function starToScale(n: number): number {
  return Math.max(0, Math.min(100, (n - 1) * 25));
}

/** Vráti hodnoty pre každú štandardnú os (0–100). Zdroj: meta.stars mapované na RADAR_AXES. */
export function getRadarData(result: ScoreResult): Record<RadarAxis, number> {
  const meta = getMajorMeta(result);
  const out: Record<string, number> = {};
  RADAR_AXES.forEach((axis) => (out[axis] = 40)); // default

  const s = meta.stars;
  out['HW'] = Math.max(out['HW'] ?? 40, starToScale(s.elektro));
  out['Matika'] = Math.max(out['Matika'] ?? 40, starToScale(s.matematika));
  out['Kód'] = Math.max(out['Kód'] ?? 40, starToScale(s.programovanie));
  out['Siete'] = Math.max(out['Siete'] ?? 40, starToScale(s.siete));

  meta.tags.forEach((tag) => {
    const mapped = LABEL_MAP[tag] ?? mapLabelToAxis(tag);
    if (mapped && (out[mapped] ?? 0) < 55) out[mapped] = 55;
  });

  return out as Record<RadarAxis, number>;
}

function mapLabelToAxis(label: string): RadarAxis | null {
  const lower = label.toLowerCase();
  if (lower.includes('prax') || lower.includes('autom')) return 'Prax';
  if (lower.includes('matika') || lower.includes('fyzika') || lower.includes('r&d')) return 'Matika';
  if (lower.includes('kód') || lower.includes('model') || lower.includes('ai') || lower.includes('dáta')) return 'Kód';
  if (lower.includes('siete') || lower.includes('systém')) return 'Siete';
  if (lower.includes('bezpeč')) return 'Bezpečnosť';
  if (lower.includes('hw') || lower.includes('hardware') || lower.includes('embedded') || lower.includes('energia')) return 'HW';
  return null;
}
