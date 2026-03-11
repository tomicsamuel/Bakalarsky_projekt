import './progress-unlock.css';

type Props = {
  completenessPercent: number;
};

export default function ProgressUnlock({ completenessPercent }: Props) {
  const v = Math.max(0, Math.min(100, Math.round(completenessPercent)));
  return (
    <div className="unlock">
      <h3>Čím viac vyplníš, tým presnejšie</h3>
      <p>Plný súhrn a prax zvyšujú istotu odporúčania.</p>
      <div className="unlock-bar" aria-hidden>
        <div className="unlock-fill" style={{ width: `${v}%` }} />
      </div>
      <div className="unlock-row">
        <span>{v}%</span>
        <span>doplnenosť</span>
      </div>
    </div>
  );
}

