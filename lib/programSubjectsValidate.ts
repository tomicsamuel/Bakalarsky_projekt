const OPTIONAL_KEYS = ['evaluation', 'outcomes', 'syllabus', 'phZh', 'focus'] as const;

export type ValidatedSubjectRow = {
  name: string;
  semester: string;
  evaluation?: string;
  outcomes?: string;
  syllabus?: string;
  phZh?: string;
  focus?: string;
};

/**
 * Telo PATCH/POST: pole predmetov alebo null.
 * Prázdne pole → uložiť ako null v DB (verejný detail použije statické predmety z lib/programProfiles).
 */
export function validateProgramSubjectsInput(
  value: unknown,
): { ok: true; subjects: ValidatedSubjectRow[] | null } | { ok: false; error: string } {
  if (value === null) {
    return { ok: true, subjects: null };
  }
  if (!Array.isArray(value)) {
    return { ok: false, error: 'subjects musí byť pole alebo null' };
  }
  if (value.length === 0) {
    return { ok: true, subjects: null };
  }

  const out: ValidatedSubjectRow[] = [];
  for (let i = 0; i < value.length; i++) {
    const row = value[i];
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return { ok: false, error: `Predmet ${i + 1}: neplatný záznam` };
    }
    const rec = row as Record<string, unknown>;
    const name = String(rec.name ?? '').trim();
    const semester = String(rec.semester ?? '').trim();
    if (!name || !semester) {
      return { ok: false, error: `Predmet ${i + 1}: name a semester sú povinné` };
    }

    const obj: ValidatedSubjectRow = { name, semester };
    for (const k of OPTIONAL_KEYS) {
      if (rec[k] === undefined || rec[k] === null) continue;
      const s = String(rec[k]).trim();
      if (s) obj[k] = s;
    }
    out.push(obj);
  }

  return { ok: true, subjects: out };
}

export function normalizeSubjectsFromDb(value: unknown): ValidatedSubjectRow[] {
  if (!Array.isArray(value)) return [];
  const list: ValidatedSubjectRow[] = [];
  for (const row of value) {
    if (!row || typeof row !== 'object') continue;
    const rec = row as Record<string, unknown>;
    const name = String(rec.name ?? '').trim();
    const semester = String(rec.semester ?? '').trim();
    if (!name || !semester) continue;
    const obj: ValidatedSubjectRow = { name, semester };
    for (const k of OPTIONAL_KEYS) {
      const v = rec[k];
      if (typeof v === 'string' && v.trim()) obj[k] = v.trim();
    }
    list.push(obj);
  }
  return list;
}
