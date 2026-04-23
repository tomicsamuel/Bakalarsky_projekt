'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import './radar-chart.css';

import { RadarChart as MuiRadarChart, type RadarSeries } from '@mui/x-charts/RadarChart';

import { getRadarLabel, groupResultsBySimilarity } from '@/lib/mapCoords';
import type { ScoreResult } from '@/lib/types';

type Props = {
  results: ScoreResult[];
  onCompare?: (r: ScoreResult) => void;
  onExplain?: (r: ScoreResult, rank: number) => void;
};

const withOptions = (series: RadarSeries[], fillArea: boolean, hideMark: boolean): RadarSeries[] =>
  series.map((item) => ({ ...item, fillArea, hideMark }));

export default function RadarChart({ results, onCompare, onExplain }: Props) {
  const [active, setActive] = useState<ScoreResult | null>(null);

  const grouped = useMemo(() => groupResultsBySimilarity(results), [results]);

  if (!results.length) {
    return (
      <div className="radar-chart-wrap radar-chart-wrap--fullscreen">
        <h3 className="radar-chart__title">Radar odborov</h3>
        <p className="radar-chart__desc">Žiadne odporúčania na zobrazenie.</p>
      </div>
    );
  }

  const metrics = grouped.map((r) => getRadarLabel(r.name));
  const zhodaSeries: RadarSeries = {
    label: 'Tvoja zhoda',
    data: grouped.map((r) => r.score),
    hideMark: false,
  } satisfies RadarSeries;
  const series = withOptions([zhodaSeries], true, false);

  const handleTooltipItemChange = (tooltipItem: { dataIndex?: number; type?: string } | null) => {
    if (tooltipItem?.dataIndex != null && grouped[tooltipItem.dataIndex]) {
      setActive(grouped[tooltipItem.dataIndex]);
    } else {
      setActive(null);
    }
  };

  const handleAxisClick = (
    _event: MouseEvent,
    data: { dataIndex?: number; axisValue?: number | string | Date } | null
  ) => {
    const axisIdx =
      typeof data?.axisValue === 'number' ? data.axisValue : undefined;
    const idx = data?.dataIndex ?? axisIdx;
    if (idx != null && grouped[idx]) {
      setActive(grouped[idx]);
    }
  };

  return (
    <div className="radar-chart-wrap radar-chart-wrap--fullscreen">
      <h3 className="radar-chart__title">Radar odborov</h3>
      <p className="radar-chart__desc">
        Každá os = jeden odbor, hodnota = tvoja zhoda. Prejdi myšou alebo klikni na os.
      </p>

      <div
        className="radar-chart__layout"
        onMouseLeave={() => setActive(null)}
      >
        <div className="radar-chart__main radar-chart__main--mui">
          <MuiRadarChart
            height={400}
            series={series}
            margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
            radar={{
              max: 100,
              metrics,
              labelGap: 36,
              labelFormatter: (label, ctx) =>
                ctx.location === 'tooltip'
                  ? (grouped.find((r) => getRadarLabel(r.name) === label)?.name ?? label)
                  : label,
            }}
            shape="circular"
            hideLegend
            slotProps={{
              tooltip: { trigger: 'axis' },
            }}
            onTooltipItemChange={handleTooltipItemChange}
            onAxisClick={handleAxisClick}
            colors={['#FF6B1A']}
            stripeColor={(index) =>
              index % 2 === 1 ? 'rgba(255, 138, 42, 0.18)' : 'rgba(255, 196, 74, 0.12)'
            }
            sx={{
              '& .MuiChartsAxis-line': { stroke: 'rgba(255, 106, 26, 0.45)' },
              '& .MuiChartsAxis-tick': { stroke: 'rgba(255, 106, 26, 0.5)' },
              '& .MuiRadarSeriesPlot-area': {
                filter: 'drop-shadow(0 2px 10px rgba(255, 106, 26, 0.3))',
              },
            }}
          />
        </div>

        {active && (
          <div className="radar-chart__menu">
            <strong className="radar-chart__menu-name">{active.name}</strong>
            <span className="radar-chart__menu-field">{active.field}</span>
            <span className="radar-chart__menu-score">{active.score}% zhoda</span>
            <div className="radar-chart__menu-actions">
              <Link
                href={`/program/${encodeURIComponent(active.name)}/${encodeURIComponent(active.field)}`}
                className="radar-chart__menu-btn"
              >
                Detail
              </Link>
              {onCompare && (
                <button
                  type="button"
                  className="radar-chart__menu-btn"
                  onClick={() => onCompare(active)}
                >
                  Porovnať
                </button>
              )}
              {onExplain && (
                <button
                  type="button"
                  className="radar-chart__menu-btn"
                  onClick={() => {
                    const idx = grouped.findIndex((r) => r.name === active.name && r.field === active.field);
                    onExplain(active, idx >= 0 ? idx + 1 : 1);
                  }}
                >
                  Prečo?
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
