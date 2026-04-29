/**
 * Centralizovaná konfigurácia pre UI (dátumy, texty).
 * Jednoduchá zmena ročníka na jednom mieste.
 */
export const DEADLINE = {
  /** Formát pre badge / CTA (krátky) */
  short: '30.4.26',
  /** Formát pre footer a plný text */
  full: '30.4.2026',
  /** Text pre CTA napr. "Prihlášky do 30.4.2026" */
  label: 'Prihlášky do 30.4.2026',
} as const;
