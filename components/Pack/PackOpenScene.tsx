'use client';

import './pack.css';

type Props = {
  onOpen: () => void;
};

export default function PackOpenScene({ onOpen }: Props) {
  return (
    <div className="pack-open">
      <div className="pack-open__scene">
        <button
          type="button"
          className="pack-open__pack"
          onClick={onOpen}
          aria-label="Klikni na rozbalenie balíčka"
        >
          <div className="pack-open__pack-inner" />
          <div className="pack-open__pack-shine" aria-hidden />
        </button>
        <p className="pack-open__hint">Klikni na balíček a otvor ho</p>
      </div>
      <div className="pack-open__odds" role="presentation">
        <span>Epická 10%</span>
        <span>Vzácna 35%</span>
        <span>Bežná 55%</span>
      </div>
    </div>
  );
}
