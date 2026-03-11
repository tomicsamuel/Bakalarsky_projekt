'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Sparkles, ArrowRight } from 'lucide-react';
import './results-display.css';

type Program = {
  name: string;
  field: string;
  score: number;
};

interface ResultsDisplayProps {
  results: Program[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (results.length === 0) {
    return (
      <div className="results-empty-state">
        <div className="empty-icon"><Target size={48} strokeWidth={2} /></div>
        <h3>Začni vyplňovať formulár</h3>
        <p>Postupne odpovedaj na otázky a uvidíš výsledky v reálnom čase</p>
      </div>
    );
  }

  const maxScore = Math.max(...results.map(r => r.score));

  return (
    <div className="results-display-container">
      <div className="results-header">
        <h2 className="results-title">
          <span className="title-icon"><Sparkles size={24} strokeWidth={2} /></span>
          Tvoje výsledky
        </h2>
        <div className="results-subtitle">
          {results.length} {results.length === 1 ? 'odbor' : 'odborov'} nájdených
        </div>
      </div>

      <div className="results-grid">
        {results.map((program, index) => {
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          const scorePercent = (program.score / maxScore) * 100;
          const rank = index + 1;

          return (
            <div
              key={index}
              className={`result-card ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                '--delay': `${index * 0.1}s`,
                '--score': `${scorePercent}%`,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
            >
              <div className="result-rank">
                #{rank}
              </div>
              
              <div className="result-content">
                <div className="result-name-wrapper">
                  <Link 
                    href={`/program/${encodeURIComponent(program.name)}/${encodeURIComponent(program.field)}`}
                    className="result-name"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {program.name}
                  </Link>
                  <div className="result-field">{program.field}</div>
                </div>

                <div className="result-score-wrapper">
                  <div className="result-score-value">{program.score}%</div>
                  <div className="result-score-bar">
                    <div 
                      className="result-score-fill"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="result-details">
                  <Link 
                    href={`/program/${encodeURIComponent(program.name)}/${encodeURIComponent(program.field)}`}
                    className="result-details-link"
                  >
                    Zistiť viac <ArrowRight size={18} strokeWidth={2} style={{ verticalAlign: 'middle' }} />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


