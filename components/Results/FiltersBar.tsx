import './filters-bar.css';

import type { FilterState } from '@/lib/types';

type Props = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  explanation?: string;
};

const TOGGLES: Array<keyof FilterState['toggles']> = ['Kód', 'Algoritmy', 'Hardware', 'Bezpečnosť', 'Sieťovanie'];

export default function FiltersBar({ value, onChange, explanation }: Props) {
  return (
    <div className="filters-bar">
      <div className="filters-bar__title">
        <h3>Pohni preferenciami</h3>
        <p className="filters-bar__hint">Skús zmeniť dôraz alebo zapnúť preferencie – poradie odborov sa hneď prepočíta („čo ak“ experiment).</p>
      </div>

      <div className="filters-row">
        <div className="filters-control">
          <label htmlFor="emphasis">Dôraz ({value.emphasis}%)</label>
          <input
            id="emphasis"
            className="filters-slider"
            type="range"
            min={0}
            max={100}
            value={value.emphasis}
            onChange={(e) => {
              const next = { ...value, emphasis: Number(e.target.value) };
              onChange(next);
            }}
          />
        </div>

        <div className="filters-control">
          <label>Preferencie</label>
          <div className="filters-toggles">
            {TOGGLES.map((t) => {
              const pressed = Boolean(value.toggles?.[t]);
              return (
                <button
                  key={t}
                  type="button"
                  className="filter-pill"
                  aria-pressed={pressed}
                  onClick={() => onChange({ ...value, toggles: { ...value.toggles, [t]: !pressed } })}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {explanation && <div className="filters-explain">{explanation}</div>}
    </div>
  );
}

