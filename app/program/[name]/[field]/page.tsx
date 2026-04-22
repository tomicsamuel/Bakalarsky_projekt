'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Logos from '@/components/Logos';
import { getProgramInfo } from '@/lib/programs';
import { getProgramProfile } from '@/lib/programProfiles';

type Program = {
  name: string;
  field: string;
  description: string | null;
  occupations: string | null;
};

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const name = decodeURIComponent(params.name as string);
    const field = decodeURIComponent(params.field as string);

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.id);
      } catch (e) {
        // ignore
      }
    }

    const search = new URLSearchParams({ name, field }).toString();
    const staticFallback = getProgramInfo(name, field);

    fetch(`/api/program-by-name?${search}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.program) {
          const p = json.program;
          setProgram({
            name: p.name,
            field: p.field,
            description: (p.description && p.description.trim()) ? p.description.trim() : (staticFallback?.description ?? null),
            occupations: (p.occupations && p.occupations.trim()) ? p.occupations.trim() : (staticFallback?.occupations ?? null),
          });
        } else {
          if (staticFallback) {
            setProgram({
              name: staticFallback.name,
              field: staticFallback.field,
              description: staticFallback.description ?? null,
              occupations: staticFallback.occupations ?? null,
            });
          }
        }
      })
      .catch(() => {
        if (staticFallback) {
          setProgram({
            name: staticFallback.name,
            field: staticFallback.field,
            description: staticFallback.description ?? null,
            occupations: staticFallback.occupations ?? null,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [params.name, params.field]);

  const handleBackToResults = () => {
    if (userId) {
      router.push(`/finder?userId=${userId}`);
    } else {
      router.push('/finder');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Logos />
        <nav className="platform-nav" aria-label="Prehľad sekcií">
          <Link href="/">Domov</Link>
          <Link href="/programy">Študijné odbory</Link>
          <Link href="/aktivity">Aktivity katedry</Link>
          <Link href="/uspechy">Študijné aktuality</Link>
          <Link href="/finder">Nájdi odbor</Link>
        </nav>
        <div className="card program-detail-card" style={{ maxWidth: '900px', margin: '32px auto' }}>
          <div className="program-detail-skeleton">
            <div className="program-detail-skeleton__breadcrumb" aria-hidden />
            <div className="program-detail-skeleton__title" aria-hidden />
            <div className="program-detail-skeleton__subtitle" aria-hidden />
            <div className="program-detail-skeleton__block" aria-hidden />
            <div className="program-detail-skeleton__block program-detail-skeleton__block--short" aria-hidden />
            <p className="program-detail-loading-text" role="status" aria-live="polite">
              Načítavam odbor…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="page-container">
        <Logos />
        <nav className="platform-nav" aria-label="Prehľad sekcií">
          <Link href="/">Domov</Link>
          <Link href="/programy">Študijné odbory</Link>
          <Link href="/aktivity">Aktivity katedry</Link>
          <Link href="/uspechy">Študijné aktuality</Link>
          <Link href="/finder">Nájdi odbor</Link>
        </nav>
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Program sa nenašiel</h2>
          <Link href="/programy" className="cta-button" style={{ marginTop: '24px', display: 'inline-block' }}>
            Prejsť na študijné odbory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Logos />
      <nav className="platform-nav" aria-label="Prehľad sekcií">
        <Link href="/">Domov</Link>
        <Link href="/programy">Študijné odbory</Link>
        <Link href="/aktivity">Aktivity katedry</Link>
        <Link href="/uspechy">Študijné aktuality</Link>
        <Link href="/finder">Nájdi odbor</Link>
      </nav>

      <div className="card program-detail-card" style={{ maxWidth: '900px', margin: '32px auto' }}>
        <nav className="program-detail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/finder">Nájdi odbor</Link>
          <span className="program-detail-breadcrumb__sep" aria-hidden>›</span>
          <span>Výsledky</span>
          <span className="program-detail-breadcrumb__sep" aria-hidden>›</span>
          <span className="program-detail-breadcrumb__current">{program.name}</span>
        </nav>
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleBackToResults}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
            Späť na výsledky
          </button>
        </div>

        <h1 className="card-title" style={{ fontSize: '32px', marginBottom: '8px' }}>
          {program.name}
        </h1>
        <div style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {program.field}
        </div>

        {program.description && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              O programe
            </h2>
            <div style={{ 
              lineHeight: '1.8', 
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line'
            }}>
              {program.description}
            </div>
          </div>
        )}

        {program.occupations && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Typické povolania
            </h2>
            <div style={{ 
              lineHeight: '1.8', 
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid var(--card-border)'
            }}>
              {program.occupations}
            </div>
          </div>
        )}

        {(() => {
          const profile = getProgramProfile(program.name, program.field);
          if (!profile) return null;
          const starLabels: { key: keyof typeof profile.starProfile; label: string }[] = [
            { key: 'elektro', label: 'Elektro' },
            { key: 'matematika', label: 'Matematika' },
            { key: 'programovanie', label: 'Programovanie' },
            { key: 'siete', label: 'Siete' },
          ];
          const semesters = [...new Set(profile.subjects.map((s) => s.semester))].sort();
          return (
            <>
              {profile.pros.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Plusy
                  </h2>
                  <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                    {profile.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.cons.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Mínusy
                  </h2>
                  <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                    {profile.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.forWho && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Pre koho je to ideálne
                  </h2>
                  <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-primary)' }}>{profile.forWho}</p>
                </div>
              )}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Hviezdičkové zloženie
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {starLabels.map(({ key, label }) => {
                    const n = profile.starProfile[key];
                    const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, minWidth: '140px', color: 'var(--text-primary)' }}>{label}:</span>
                        <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '1.1rem', letterSpacing: 2 }} aria-label={`${n} z 5`}>{stars}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {profile.subjects.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Predmety podľa rokov
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {semesters.map((sem) => {
                      const list = profile.subjects.filter((s) => s.semester === sem);
                      return (
                        <div key={sem}>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
                            {sem}
                          </h3>
                          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                            {list.map((sub, i) => (
                              <li
                                key={i}
                                style={{
                                  padding: '14px 16px',
                                  marginBottom: '8px',
                                  background: 'white',
                                  borderRadius: '12px',
                                  border: '1px solid var(--card-border)',
                                }}
                              >
                                <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
                                  {sub.name}
                                </div>
                                {sub.evaluation && (
                                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    {sub.evaluation}
                                  </div>
                                )}
                                {sub.focus && (
                                  <div style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '6px', color: 'var(--text-primary)' }}>
                                    <strong>Zameranie:</strong> {sub.focus}
                                  </div>
                                )}
                                {sub.outcomes && (
                                  <div style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '6px', color: 'var(--text-primary)' }}>
                                    {sub.outcomes}
                                  </div>
                                )}
                                {sub.syllabus && (
                                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                                    {sub.syllabus}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: 700, 
            marginBottom: '16px', 
            color: 'var(--text-primary)',
            textAlign: 'center'
          }}>
            Tu budeš študovať
          </h2>
          <div style={{
            width: '100%',
            height: '600px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
            background: 'white'
          }}>
            <iframe
              src="https://mapa.fei.tuke.sk/"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Digitálna mapa FEI TUKE"
              allowFullScreen
            />
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={handleBackToResults}
            className="cta-button"
            style={{ display: 'inline-block', border: 'none', cursor: 'pointer' }}
          >
            Späť na výsledky
          </button>
        </div>
      </div>
    </div>
  );
}

