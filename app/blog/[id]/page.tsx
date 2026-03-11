'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

type Post = {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  section?: string;
  publishedAt?: string | null;
  createdAt: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data) setPost(j.data);
        else setError('Článok sa nenašiel.');
      })
      .catch(() => setError('Chyba pri načítaní.'))
      .finally(() => setLoading(false));
  }, [id]);

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

      <div className="card" style={{ maxWidth: '720px', margin: '32px auto' }}>
        {loading && <p>Načítavam...</p>}
        {error && <p style={{ color: 'var(--error, #dc2626)' }}>{error}</p>}
        {post && (
          <article>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('sk-SK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h1 className="page-title" style={{ marginBottom: '16px' }}>
              {post.title}
            </h1>
            {post.summary && (
              <p className="landing-description" style={{ marginBottom: '24px' }}>
                {post.summary}
              </p>
            )}
            <div
              style={{ lineHeight: 1.7, color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
            <p style={{ marginTop: '24px' }}>
              <Link
                href={post.section === 'studijne' ? '/uspechy' : '/aktivity'}
                className="cta-button"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={18} strokeWidth={2} />
                Späť na {post.section === 'studijne' ? 'študijné aktuality' : 'aktivity katedry'}
              </Link>
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
