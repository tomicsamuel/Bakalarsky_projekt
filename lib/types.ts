export type MajorField = 'Elektrotechnika' | 'Informatika';

export type Major = {
  name: string;
  field: MajorField | string;
};

export type ScoreResult = Major & {
  /**
   * Normalized score in range 0-100 (integer).
   */
  score: number;
  /**
   * Raw (pre-normalization) score, useful for what-if explainability.
   */
  rawScore?: number;
};

export type FilterState = {
  /**
   * Global emphasis (0-100). PR2 will use this to shift weighting.
   */
  emphasis: number;
  /**
   * Optional toggles the user can play with (PR2).
   */
  toggles: Partial<Record<'Kód' | 'Algoritmy' | 'Hardware' | 'Bezpečnosť' | 'Sieťovanie', boolean>>;
  /**
   * Self-assessed difficulty preference (PR2).
   */
  difficulty: 'low' | 'mid' | 'high';
};

