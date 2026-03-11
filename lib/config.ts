/**
 * Centralizovaná konfigurácia pre UI (dátumy, texty).
 * Jednoduchá zmena ročníka na jednom mieste.
 */
export const DEADLINE = {
  /** Formát pre badge / CTA (krátky) */
  short: '30.6.25',
  /** Formát pre footer a plný text */
  full: '30.6.2025',
  /** Text pre CTA napr. "Prihlášky do 30.6.2025" */
  label: 'Prihlášky do 30.6.2025',
} as const;
