'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Logos from '@/components/Logos';

const FEI_ARCHIVE_URL = 'https://www.fei.tuke.sk/sk/archive/clanky?category=aktuality_studijne_oddelenie&page=1';

type FeiAktualityItem = {
  title: string;
  link: string;
  date: string;
  summary?: string;
};

type BlogItem = {
  id: number;
  title: string;
  summary?: string | null;
  publishedAt?: string | null;
};

export default function UspechyPage() {
  const [feiAktuality, setFeiAktuality] = useState<FeiAktualityItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogItem[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/fei-aktuality-studijne')
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) {
          setFeiAktuality(json.data);
        } else {
          setFeiAktuality(null);
        }
      })
      .catch(() => {
        if (!cancelled) setFeiAktuality(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setBlogLoading(true);
    fetch('/api/blog?section=studijne')
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) setBlogPosts(json.data);
        else setBlogPosts([]);
      })
      .catch(() => { if (!cancelled) setBlogPosts([]); })
      .finally(() => { if (!cancelled) setBlogLoading(false); });
    return () => { cancelled = true; };
  }, []);

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

      <div className="card" style={{ maxWidth: '1000px', margin: '32px auto' }}>
        <h1 className="page-title" style={{ marginBottom: '8px' }}>
          Študijné aktuality
        </h1>
        <p className="landing-description" style={{ marginBottom: '24px' }}>
          Oznámenia študijného oddelenia FEI TUKE: zápisy do rozvrhu, skúškové obdobie, študijné pokyny a ďalšie informácie pre študentov.
        </p>

        <section aria-labelledby="studijne-aktuality-heading" className="card glass-feature" style={{ padding: '24px', marginBottom: '32px' }}>
          <h2 id="studijne-aktuality-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
            Články (fei.tuke.sk)
          </h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Najnovšie aktuality študijného oddelenia priamo z oficiálnej stránky FEI TUKE.
          </p>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Načítavam aktuality...</p>
          ) : feiAktuality && feiAktuality.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {feiAktuality.map((article, i) => (
                <li key={i}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', textDecoration: 'none', color: 'inherit', transition: 'background 0.2s' }}
                  >
                    <span style={{ fontWeight: 700 }}>{article.title}</span>
                    {article.date && (
                      <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {new Date(article.date).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                    {article.summary && (
                      <span style={{ display: 'block', fontSize: '14px', marginTop: '6px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {article.summary}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <a
            href={FEI_ARCHIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
            style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            Všetky študijné aktuality na fei.tuke.sk
            <ArrowRight size={18} strokeWidth={2} />
          </a>
        </section>

        <section aria-labelledby="blog-studijne-heading" className="card glass-feature" style={{ padding: '24px', marginBottom: '32px' }}>
          <h2 id="blog-studijne-heading" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
            Články – Študijné aktuality
          </h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Články a oznámenia pre študentov publikované na tejto stránke.
          </p>
          {blogLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Načítavam články...</p>
          ) : blogPosts.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blogPosts.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.id}`}
                    style={{ display: 'block', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', textDecoration: 'none', color: 'inherit', transition: 'background 0.2s' }}
                  >
                    <span style={{ fontWeight: 700 }}>{article.title}</span>
                    {article.publishedAt && (
                      <span style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {new Date(article.publishedAt).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                    {article.summary && (
                      <span style={{ display: 'block', fontSize: '14px', marginTop: '6px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {article.summary}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Zatiaľ tu nie sú žiadne články.</p>
          )}
        </section>
      </div>
    </div>
  );
}
