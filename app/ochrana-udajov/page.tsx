import Link from 'next/link';
import Logos from '@/components/Logos';

export default function OchranaUdajovPage() {
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
      <div className="card" style={{ maxWidth: '800px', margin: '32px auto', padding: '24px' }}>
        <h1 className="page-title" style={{ marginBottom: '16px' }}>
          Ochrana osobných údajov
        </h1>
        <div style={{ lineHeight: 1.65, color: 'var(--text-primary)' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>Správca osobných údajov</strong> je Fakulta elektrotechniky a informatiky Slovenskej technickej univerzity v Košiciach (FEI TUKE).
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Účel spracovania:</strong> Vaše údaje spracúvame na odporúčanie študijného programu na základe odpovedí v dotazníku „Nájdi odbor“. Zozbierané údaje môžu byť využité na interný štatistický výskum fakulty; využitie na štatistiky nie je povinné.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Rozsah údajov:</strong> Spracúvame údaje, ktoré vyplníte v dotazníku: meno, e-mail, škola, odkiaľ ste, vek, či plánujete študovať na TUKE, ako ste sa dozvedeli o fakulte, prečo ste si vybrali fakultu, očakávania, záujmy, prax, a výsledky odporúčania. Tretím stranám tieto údaje nepredávame.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Právny základ:</strong> Spracovanie prebieha na základe vášho súhlasu podľa čl. 6 ods. 1 písm. a) nariadenia GDPR.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Vaše práva:</strong> Máte právo súhlas kedykoľvek odvolať, právo na prístup k svojim údajom, na ich opravu alebo vymazanie, na obmedzenie spracovania a na podanie sťažnosti u dozorného úradu. Súhlas môžete odvolať písomným kontaktom na fakultu.
          </p>
        </div>
        <Link href="/finder" className="cta-button" style={{ display: 'inline-block' }}>
          Späť na Nájdi odbor
        </Link>
      </div>
    </div>
  );
}
