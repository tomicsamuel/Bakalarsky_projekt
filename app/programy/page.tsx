'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { PROGRAMS_INFO, getProgramInfo } from '@/lib/programs';

const FIELDS = ['Všetky', 'Informatika', 'Elektrotechnika'] as const;

type ProgramItem = {
  name: string;
  field: string;
  description: string;
};

export default function ProgramyPage() {
  const [filter, setFilter] = useState<string>('Všetky');
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'Všetky') params.set('field', filter);
    fetch(`/api/programs?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) {
          const list = json.data.map(
            (p: { name: string; field: string; description?: string | null }) => {
              const fromDb = p.description?.trim();
              const info = getProgramInfo(p.name, p.field);
              return {
                name: p.name,
                field: p.field,
                description: fromDb || info?.description || 'Popis programu bude doplnený.',
              };
            }
          );
          setPrograms(list);
        } else {
          const list = filter === 'Všetky' ? PROGRAMS_INFO : PROGRAMS_INFO.filter((p) => p.field === filter);
          setPrograms(list.map((p) => ({ name: p.name, field: p.field, description: p.description })));
        }
      })
      .catch(() => {
        if (cancelled) return;
        const list = filter === 'Všetky' ? PROGRAMS_INFO : PROGRAMS_INFO.filter((p) => p.field === filter);
        setPrograms(list.map((p) => ({ name: p.name, field: p.field, description: p.description })));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="page-container">
      <Logo variant="fei" href="/" className="logo" width={180} height={50} />
      <nav className="platform-nav" aria-label="Prehľad sekcií">
        <Link href="/">Domov</Link>
        <Link href="/programy">Študijné odbory</Link>
        <Link href="/aktivity">Aktivity katedry</Link>
        <Link href="/uspechy">Študijné aktuality</Link>
        <Link href="/finder">Nájdi odbor</Link>
      </nav>

      <div className="card" style={{ maxWidth: '1000px', margin: '32px auto' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>
          Študijné odbory
        </h1>
        <p className="landing-description" style={{ marginBottom: '24px' }}>
          Prehľad bakalárskych študijných programov na FEI TUKE. Klikni na program a dozvieš sa viac.
        </p>

        <div className="filter-row" style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Pole:</span>
          {FIELDS.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p>Načítavam...</p>
          </div>
        ) : (
          <>
            <div
              className="program-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {programs.map((program) => (
                <Link
                  key={`${program.name}-${program.field}`}
                  href={`/program/${encodeURIComponent(program.name)}/${encodeURIComponent(program.field)}`}
                  className="card program-card"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    padding: '24px',
                    display: 'block',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                    {program.field}
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>
                    {program.name}
                  </h2>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {program.description}
                  </p>
                  <span className="card-link" style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--primary)' }}>
                    Detail programu
                    <ArrowRight size={18} strokeWidth={2} />
                  </span>
                </Link>
              ))}
            </div>

            {programs.length === 0 && !loading && (
              <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <p>Pre zvolený filter neboli nájdené žiadne programy.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
