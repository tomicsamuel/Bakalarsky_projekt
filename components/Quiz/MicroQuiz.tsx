import './micro-quiz.css';

import { useMemo, useState } from 'react';

type Props = {
  onClose: () => void;
  onDone: (delta: number) => void; // +/- 10
};

type Answer = 'A' | 'B' | 'C' | null;

export default function MicroQuiz({ onClose, onDone }: Props) {
  const questions = useMemo(
    () => [
      {
        q: 'Keď sa niečo pokazí, čo ťa láka viac?',
        opts: [
          { id: 'A' as const, label: 'Nájsť príčinu a opraviť systém (debug)' },
          { id: 'B' as const, label: 'Zmerať/overiť v praxi a doladiť (laboratórium)' },
          { id: 'C' as const, label: 'Pozrieť sa na dáta a spraviť záver (analýza)' },
        ],
      },
      {
        q: 'Ako sa cítiš pri matematike?',
        opts: [
          { id: 'A' as const, label: 'OK, keď to má zmysel v praxi' },
          { id: 'B' as const, label: 'Baví ma, keď je to výzva' },
          { id: 'C' as const, label: 'Skôr sa jej vyhýbam' },
        ],
      },
      {
        q: 'Ktoré prostredie ti sedí viac?',
        opts: [
          { id: 'A' as const, label: 'Tímový vývoj produktu' },
          { id: 'B' as const, label: 'Priemysel / infra / zodpovednosť' },
          { id: 'C' as const, label: 'R&D / experimentovanie' },
        ],
      },
    ],
    []
  );

  const [answers, setAnswers] = useState<Answer[]>([null, null, null]);

  const doneEnabled = answers.every(Boolean);

  const computeDelta = () => {
    // Simple heuristic: more consistent answers => higher confidence.
    const counts = new Map<string, number>();
    for (const a of answers) counts.set(String(a), (counts.get(String(a)) ?? 0) + 1);
    const max = Math.max(...counts.values());
    if (max === 3) return 10;
    if (max === 2) return 6;
    return 2;
  };

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-label="Micro quiz">
      <div className="quiz">
        <h3>Micro‑quiz (1 min)</h3>
        <p>Nezmení poradie odborov výrazne — iba spresní meter istoty.</p>

        <div style={{ display: 'grid', gap: 12 }}>
          {questions.map((qq, idx) => (
            <div key={qq.q} className="quiz-q">
              <strong>{qq.q}</strong>
              <div className="quiz-opts">
                {qq.opts.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="filter-pill"
                    aria-pressed={answers[idx] === o.id}
                    onClick={() => setAnswers((prev) => prev.map((v, i) => (i === idx ? o.id : v)) as Answer[])}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button type="button" className="duel-close" onClick={onClose}>
            Zavrieť
          </button>
          <button
            type="button"
            className="result-btn result-btn--primary"
            disabled={!doneEnabled}
            onClick={() => onDone(Math.min(10, computeDelta()))}
          >
            Dokončiť
          </button>
        </div>
      </div>
    </div>
  );
}

