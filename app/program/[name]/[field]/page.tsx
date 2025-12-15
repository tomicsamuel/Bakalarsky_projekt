'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProgramInfo } from '@/lib/programs';

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

    const programInfo = getProgramInfo(name, field);

    if (programInfo) {
      setProgram({
        name: programInfo.name,
        field: programInfo.field,
        description: programInfo.description,
        occupations: programInfo.occupations,
      });
    }

    setLoading(false);
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
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div>Načítavam...</div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Program nebol nájdený</h2>
          <Link href="/" className="cta-button" style={{ marginTop: '24px', display: 'inline-block' }}>
            Späť na domov
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link href="/" className="logo" style={{ display: 'inline-block', textDecoration: 'none' }}>
        FEI TUKE
      </Link>

      <div className="card" style={{ maxWidth: '900px', margin: '32px auto' }}>
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
              padding: 0
            }}
          >
            ← Späť na výsledky
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

