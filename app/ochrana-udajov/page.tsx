import Link from 'next/link';
import Logo from '@/components/Logo';

export default function OchranaUdajovPage() {
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
      <div className="card" style={{ maxWidth: '800px', margin: '32px auto', padding: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: '16px' }}>
          Ochrana osobných údajov
        </h1>
        <p style={{ lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Údaje z dotazníka (meno, e-mail, škola, odpovede) používame len na odporúčanie študijného programu a na interný štatistický výskum fakulty.
          Tretím stranám ich nepredávame. Súhlas môžeš kedykoľvek odvolať písomným kontaktom na fakultu.
        </p>
        <Link href="/finder" className="cta-button" style={{ display: 'inline-block' }}>
          Späť na Nájdi odbor
        </Link>
      </div>
    </div>
  );
}
