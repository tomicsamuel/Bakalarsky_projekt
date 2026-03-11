import './confidence-meter.css';

type Props = {
  confidence: number;
  onQuiz?: () => void;
};

export default function ConfidenceMeter({ confidence, onQuiz }: Props) {
  const value = Math.max(0, Math.min(100, confidence));
  let label = 'Stredná istota';
  if (value >= 80) label = 'Vysoká istota';
  else if (value <= 45) label = 'Nižšia istota';

  return (
    <div className="confidence">
      <h3>Aká si istý/istá</h3>
      <p>{label}. Krátky kvíz môže istotu ešte posunúť (poradie ostáva).</p>
      <div className="confidence-bar" aria-hidden>
        <div className="confidence-fill" style={{ width: `${value}%` }} />
      </div>
      <div className="confidence-row">
        <span>{value}%</span>
        {onQuiz ? (
          <button type="button" className="result-btn" onClick={onQuiz}>
            Skúsiť micro‑quiz
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

