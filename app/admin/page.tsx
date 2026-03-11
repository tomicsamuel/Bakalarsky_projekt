'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Program = { id: number; name: string; field: string; description?: string | null; occupations?: string | null };
type BlogPost = { id: number; title: string; content: string; summary?: string | null; section?: string; publishedAt?: string | null; createdAt: string };
type UserRow = {
  id: number;
  name: string;
  email: string;
  school: string;
  howDidYouHear: string[];
  howDidYouHearOther?: string | null;
  whyThisSchool: string[];
  expectations: string[];
  interests: string[];
  experience: string[];
  consentGivenAt?: string | null;
  createdAt: string;
  results: Array<{ score: number; program: { name: string; field: string } }>;
};

export default function AdminPage() {
  const router = useRouter();
  const [authOk, setAuthOk] = useState<boolean | null>(null);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [programForm, setProgramForm] = useState({ name: '', field: 'Informatika', description: '', occupations: '' });
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null);
  const [programsLoading, setProgramsLoading] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postForm, setPostForm] = useState<{ title: string; content: string; summary: string; section: 'aktivity' | 'studijne'; publishedAt: boolean }>({
    title: '', content: '', summary: '', section: 'aktivity', publishedAt: false,
  });
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [adminTab, setAdminTab] = useState<'odbory' | 'blog' | 'pouzivatelia'>('odbory');

  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((r) => {
        if (r.ok) setAuthOk(true);
        else {
          setAuthOk(false);
          router.replace('/admin/login?session=0');
        }
      })
      .catch(() => {
        setAuthOk(false);
        router.replace('/admin/login?session=0');
      });
  }, [router]);

  useEffect(() => {
    if (!authOk) return;
    setProgramsLoading(true);
    fetch('/api/admin/programs', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) setPrograms(j.data);
      })
      .finally(() => setProgramsLoading(false));
  }, [authOk]);

  useEffect(() => {
    if (!authOk) return;
    setBlogLoading(true);
    fetch('/api/admin/blog', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) setPosts(j.data);
      })
      .finally(() => setBlogLoading(false));
  }, [authOk]);

  useEffect(() => {
    if (!authOk) return;
    setUsersLoading(true);
    fetch('/api/admin/users', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) setUsers(j.data);
      })
      .finally(() => setUsersLoading(false));
  }, [authOk]);

  const reloadPrograms = () => {
    fetch('/api/admin/programs', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => { if (j.success && Array.isArray(j.data)) setPrograms(j.data); });
  };

  const reloadBlog = () => {
    fetch('/api/admin/blog', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => { if (j.success && Array.isArray(j.data)) setPosts(j.data); });
  };

  const saveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgramId) {
      await fetch(`/api/admin/programs/${editingProgramId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(programForm),
      });
      setEditingProgramId(null);
    } else {
      await fetch('/api/admin/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(programForm),
      });
    }
    setProgramForm({ name: '', field: 'Informatika', description: '', occupations: '' });
    reloadPrograms();
  };

  const deleteProgram = async (id: number) => {
    if (!confirm('Naozaj zmazať odbor?')) return;
    await fetch(`/api/admin/programs/${id}`, { method: 'DELETE', credentials: 'include' });
    reloadPrograms();
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...postForm,
      publishedAt: postForm.publishedAt ? new Date().toISOString() : null,
    };
    if (editingPostId) {
      await fetch(`/api/admin/blog/${editingPostId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      setEditingPostId(null);
    } else {
      await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
    }
    setPostForm({ title: '', content: '', summary: '', section: 'aktivity', publishedAt: false });
    reloadBlog();
  };

  const deletePost = async (id: number) => {
    if (!confirm('Naozaj zmazať článok?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', credentials: 'include' });
    reloadBlog();
  };

  if (authOk === null) {
    return (
      <div className="page-container" style={{ padding: '48px', textAlign: 'center' }}>
        <p>Kontrolujem oprávnenie...</p>
      </div>
    );
  }

  const sectionLabel = (s: string) => s === 'studijne' ? 'Študijné aktuality' : 'Aktivity katedry';

  if (!authOk) return null;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>FEI TUKE</Link>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Admin rozhranie</span>
      </div>

      <nav aria-label="Sekcie adminu" style={{ marginBottom: '24px', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={adminTab === 'odbory' ? 'chip active' : 'chip'}
            onClick={() => setAdminTab('odbory')}
            aria-pressed={adminTab === 'odbory'}
          >
            Odbory
          </button>
          <button
            type="button"
            className={adminTab === 'blog' ? 'chip active' : 'chip'}
            onClick={() => setAdminTab('blog')}
            aria-pressed={adminTab === 'blog'}
          >
            Blog
          </button>
          <button
            type="button"
            className={adminTab === 'pouzivatelia' ? 'chip active' : 'chip'}
            onClick={() => setAdminTab('pouzivatelia')}
            aria-pressed={adminTab === 'pouzivatelia'}
          >
            Data používateľov
          </button>
        </div>
      </nav>

      {adminTab === 'odbory' && (
      <div className="card" style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Študijné odbory</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Správa názvov, polí a popisov odborov.</p>
        {programsLoading ? <p>Načítavam...</p> : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Názov</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Pole</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Popis</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Typ. povolania</th>
                  <th style={{ padding: '8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '8px' }}>{p.name}</td>
                    <td style={{ padding: '8px' }}>{p.field}</td>
                    <td style={{ padding: '8px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description || '–'}</td>
                    <td style={{ padding: '8px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.occupations || '–'}</td>
                    <td style={{ padding: '8px' }}>
                      <button type="button" className="chip" onClick={() => { setProgramForm({ name: p.name, field: p.field, description: p.description || '', occupations: p.occupations || '' }); setEditingProgramId(p.id); }}>Upraviť</button>
                      {' '}
                      <button type="button" className="chip" onClick={() => deleteProgram(p.id)} style={{ background: 'var(--error, #dc2626)', color: 'white' }}>Odstrániť</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={saveProgram} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
                <input
                  className="form-input"
                  placeholder="Názov odboru"
                  value={programForm.name}
                  onChange={(e) => setProgramForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  style={{ width: '220px' }}
                />
                <select
                  className="form-select"
                  value={programForm.field}
                  onChange={(e) => setProgramForm((f) => ({ ...f, field: e.target.value }))}
                  style={{ width: '160px' }}
                >
                  <option value="Informatika">Informatika</option>
                  <option value="Elektrotechnika">Elektrotechnika</option>
                </select>
                <button type="submit" className="cta-button">{editingProgramId ? 'Uložiť zmeny' : 'Pridať odbor'}</button>
                {editingProgramId && <button type="button" className="chip" onClick={() => { setEditingProgramId(null); setProgramForm({ name: '', field: 'Informatika', description: '', occupations: '' }); }}>Zrušiť</button>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>O programe (popis)</label>
                <textarea
                  className="form-input"
                  placeholder="Text sekcie „O programe“ na detail stránke odboru"
                  value={programForm.description}
                  onChange={(e) => setProgramForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Typické povolania</label>
                <textarea
                  className="form-input"
                  placeholder="Jedno povolanie na riadok, môžete použiť • pred položkou (zobrazí sa ako zoznam)"
                  value={programForm.occupations}
                  onChange={(e) => setProgramForm((f) => ({ ...f, occupations: e.target.value }))}
                  rows={3}
                  style={{ width: '100%' }}
                />
              </div>
            </form>
          </>
        )}
      </div>
      )}

      {adminTab === 'blog' && (
      <div className="card" style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Blog</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Články zobrazované v sekcii Aktivity katedry alebo Študijné aktuality.</p>
        {blogLoading ? <p>Načítavam...</p> : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Názov</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Sekcia</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Dátum</th>
                  <th style={{ padding: '8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '8px' }}>{p.title}</td>
                    <td style={{ padding: '8px' }}>{sectionLabel(p.section || 'aktivity')}</td>
                    <td style={{ padding: '8px' }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('sk-SK') : '–'}</td>
                    <td style={{ padding: '8px' }}>
                      <button type="button" className="chip" onClick={() => { setPostForm({ title: p.title, content: p.content, summary: p.summary || '', section: (p.section === 'studijne' ? 'studijne' : 'aktivity'), publishedAt: !!p.publishedAt }); setEditingPostId(p.id); }}>Upraviť</button>
                      {' '}
                      <button type="button" className="chip" onClick={() => deletePost(p.id)} style={{ background: 'var(--error, #dc2626)', color: 'white' }}>Odstrániť</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={savePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="form-input" placeholder="Názov článku" value={postForm.title} onChange={(e) => setPostForm((f) => ({ ...f, title: e.target.value }))} required />
              <input className="form-input" placeholder="Úvod (summary)" value={postForm.summary} onChange={(e) => setPostForm((f) => ({ ...f, summary: e.target.value }))} />
              <textarea className="form-input" placeholder="Obsah" value={postForm.content} onChange={(e) => setPostForm((f) => ({ ...f, content: e.target.value }))} required rows={4} />
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Sekcia (kde sa zobrazí)</label>
                <select
                  className="form-select"
                  value={postForm.section}
                  onChange={(e) => setPostForm((f) => ({ ...f, section: e.target.value as 'aktivity' | 'studijne' }))}
                  style={{ width: '100%', maxWidth: '320px' }}
                >
                  <option value="aktivity">Aktivity katedry</option>
                  <option value="studijne">Študijné aktuality</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={postForm.publishedAt} onChange={(e) => setPostForm((f) => ({ ...f, publishedAt: e.target.checked }))} />
                Zverejnené
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="cta-button">{editingPostId ? 'Uložiť zmeny' : 'Pridať článok'}</button>
                {editingPostId && <button type="button" className="chip" onClick={() => { setEditingPostId(null); setPostForm({ title: '', content: '', summary: '', section: 'aktivity', publishedAt: false }); }}>Zrušiť</button>}
              </div>
            </form>
          </>
        )}
      </div>
      )}

      {adminTab === 'pouzivatelia' && (
      <div className="card" style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Data používateľov</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Odpovede z formulára Nájdi odbor a súvisiace údaje.</p>
        {usersLoading ? <p>Načítavam...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Meno</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Škola</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Ako sa dozvedel</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Záujmy</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Dátum</th>
                <th style={{ padding: '8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '8px' }}>{u.name}</td>
                  <td style={{ padding: '8px' }}>{u.email}</td>
                  <td style={{ padding: '8px' }}>{u.school}</td>
                  <td style={{ padding: '8px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.howDidYouHear?.join(', ') || '–'}{u.howDidYouHearOther ? ` (${u.howDidYouHearOther})` : ''}</td>
                  <td style={{ padding: '8px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.interests?.slice(0, 3).join(', ') || '–'}</td>
                  <td style={{ padding: '8px' }}>{new Date(u.createdAt).toLocaleDateString('sk-SK')}</td>
                  <td style={{ padding: '8px' }}>
                    <button type="button" className="chip" onClick={() => setSelectedUser(u)}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      )}

      {selectedUser && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={() => setSelectedUser(null)}
        >
          <div className="card" style={{ maxWidth: '500px', width: '100%', maxHeight: '80vh', overflow: 'auto', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Detail odpovede</h3>
            <p><strong>Meno:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Škola:</strong> {selectedUser.school}</p>
            <p><strong>Ako sa dozvedel:</strong> {selectedUser.howDidYouHear?.join(', ') || '–'} {selectedUser.howDidYouHearOther && `(${selectedUser.howDidYouHearOther})`}</p>
            <p><strong>Prečo táto škola:</strong> {selectedUser.whyThisSchool?.join(', ') || '–'}</p>
            <p><strong>Očakávania:</strong> {selectedUser.expectations?.join(', ') || '–'}</p>
            <p><strong>Záujmy:</strong> {selectedUser.interests?.join(', ') || '–'}</p>
            <p><strong>Skúsenosti:</strong> {selectedUser.experience?.join(', ') || '–'}</p>
            <p><strong>Súhlas:</strong> {selectedUser.consentGivenAt ? new Date(selectedUser.consentGivenAt).toLocaleString('sk-SK') : '–'}</p>
            <p><strong>Odporúčané programy:</strong> {selectedUser.results?.map((r) => `${r.program.name} (${r.score})`).join(', ') || '–'}</p>
            <button type="button" className="cta-button" style={{ marginTop: '16px' }} onClick={() => setSelectedUser(null)}>Zavrieť</button>
          </div>
        </div>
      )}
    </div>
  );
}
