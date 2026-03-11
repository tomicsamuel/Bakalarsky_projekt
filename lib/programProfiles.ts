/**
 * Rozšírené profily programov: plusy, mínusy, pre koho, hviezdy, predmety.
 * Používa sa na detail stránke programu (/program/[name]/[field]).
 */

export type StarProfile = {
  matematika: number;
  programovanie: number;
  siete: number;
  elektro: number;
};

export type Subject = {
  name: string;
  semester: string;
  evaluation: string;
  outcomes?: string;
  syllabus?: string;
  phZh?: string;
  focus?: string;
};

export type ProgramProfile = {
  pros: string[];
  cons: string[];
  forWho: string;
  starProfile: StarProfile;
  subjects: Subject[];
};

function k(name: string, field: string): string {
  return `${name}__${field}`;
}

const profiles: Record<string, ProgramProfile> = {
  [k('Informatika', 'Informatika')]: {
    pros: [
      'Silné jadro v programovaní (procedurálne C → pokročilé C → OOP).',
      'Veľa „core IT“: OS Linux + systémové programovanie, algoritmy a dátové štruktúry, databázy, formálne jazyky.',
      'Dobrá príprava na prax (Git, UML, testovanie, CI/CD, Docker, sieťové základy).',
    ],
    cons: [
      'Matematika a teória (DM, NMPaŠ) vedia byť náročné, ak ti nesedí abstrakcia.',
      '„Siete“ sú tu skôr ako dôležitý základ (CCNA intro), ale nie je to primárny fokus ako v odbore Počítačové siete.',
    ],
    forWho:
      'Ak chceš ísť smerom vývoj softvéru, backend, infra basics, databázy, alebo pokračovať na 2. stupeň informatika.',
    starProfile: {
      matematika: 4,
      programovanie: 5,
      siete: 2,
      elektro: 1,
    },
    subjects: [
      // 1. rok ZS
      {
        name: 'FEI – Jazyk 1',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        outcomes: 'Jazyk min. A2, terminológia pre elektro + IKT.',
        syllabus: 'OS a softvér, editor, tabuľky/databázy, grafika, DTP, programovanie a jazyky, multimédiá, internet/email/web, bezpečnosť internetu, komunikačné systémy.',
      },
      {
        name: 'Repetitórium z matematiky (RzM)',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        outcomes: 'Zopakovanie SŠ matematiky pre zvládnutie vyššej matematiky.',
        syllabus: 'Úpravy výrazov, rovnice/nerovnice, Gauss, abs hodnota, polynómy + Horner, funkcie, komplexné čísla.',
      },
      {
        name: 'Základy algoritmizácie a programovania (ZAP)',
        semester: '1. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Návrh algoritmov + implementácia v procedurálnom jazyku.',
        syllabus: 'Algoritmy, vývojové diagramy, typy, výrazy, vetvenie/cykly, I/O, funkcie/rekurzia, polia, záznamy, analýza algoritmov.',
        phZh: 'PH/ZH: testy + zadanie, skúška (záverečný test).',
      },
      {
        name: 'Základy inžinierstva materiálov (ZIM)',
        semester: '1. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Elektrofyzikálne vlastnosti materiálov (slaboprúd/silnoprúd), polovodiče, technológie.',
        syllabus: 'Vodivosť, optické vlákna, magnetizmus, supravodiče, dielektriká, PN prechod, kryštály, IO, trendy (nano).',
        phZh: 'PH/ZH: testy + projekty, záverečný test + ústna skúška.',
      },
      {
        name: 'Úvod do inžinierstva (UI)',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        outcomes: 'Prehľad odborov FEI + súvislosti medzi odbormi.',
        syllabus: 'Aplikovaná elektro, energetika, informatika, inteligentné systémy, siete, modelovanie, priemysel, automobilová elektronika.',
      },
      {
        name: 'Telesná výchova I (TV I)',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        outcomes: 'Kondícia, pohybové schopnosti, psychohygiena.',
      },
      {
        name: 'Základy elektrotechnického inžinierstva (ZEI)',
        semester: '1. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        outcomes: 'DC obvody, bezpečnosť a predpisy, ochrana pred úrazom, technická dokumentácia + CAD.',
        syllabus: 'Veličiny, topológia obvodov, prvky, lineárne obvody, účinky prúdu, prvá pomoc, ochrana, dokumentácia.',
        phZh: 'PH: elektrotechnika písomka, BOZP test, zadania (rešerš, výkresy, schémy, elektroinštalácia).',
      },
      {
        name: 'Matematika I (MAT I)',
        semester: '1. rok ZS',
        evaluation: 'klasifikovaný zápočet (min. 51 %)',
        outcomes: 'Lineárna algebra + derivácie 1 premennej.',
        syllabus: 'Komplexné čísla, matice/determinanty, sústavy rovníc, limita/spojitosť, derivácia, diferenciál, Taylor, extrémy, priebeh funkcie.',
      },
      {
        name: 'Úvod do fyziky (UDF)',
        semester: '1. rok ZS',
        evaluation: 'zápočet (min. 51 %)',
        outcomes: 'Zopakovanie SŠ fyziky.',
        syllabus: 'Kinematika, dynamika, kmity a vlny.',
      },
      // 1. rok LS
      {
        name: 'Fyzika I (FI)',
        semester: '1. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Mechanika, energia, rotácia, kmity/rezonancia, vlnenie, termodynamika, entropia.',
      },
      {
        name: 'Princípy počítačového inžinierstva (PPI)',
        semester: '1. rok LS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Architektúra + bezpečnosť PC systémov, HW/OS/aplikácie v sieťovom prostredí.',
        syllabus: 'Koncepcia PC, siete, telematika, bezpečnosť PC aj sietí, zobrazovanie, logická úroveň, periférie, paralelné systémy.',
      },
      {
        name: 'Telesná výchova II (TV II)',
        semester: '1. rok LS',
        evaluation: 'zápočet',
      },
      {
        name: 'Základy softvérového inžinierstva (ZSwI)',
        semester: '1. rok LS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Procesy vývoja softvéru, požiadavky, kvalita, tímová práca, iteratívny vývoj.',
        syllabus: 'UML, Scrum/XP, Git, testovanie + automatizácia, kvalita kódu, ladenie, CI/CD, Docker, dokumentácia.',
      },
      {
        name: 'Matematika II (MAT II)',
        semester: '1. rok LS',
        evaluation: 'klasifikovaný zápočet (min. 51 %)',
        outcomes: 'Integrály + viacpremenné derivácie.',
        syllabus: 'Neurčitý/určitý integrál, parciálne zlomky, nevlastné integrály, funkcia n-premenných, parciálne derivácie, Taylor, extrémy 2 premenných.',
      },
      {
        name: 'Programovanie (Progr)',
        semester: '1. rok LS',
        evaluation: 'klasifikovaný zápočet + skúška',
        outcomes: 'Pokročilé C (pamäť, štruktúry, regex, TDD základy), plus Arduino UNO základy.',
        syllabus: 'Alokácia pamäte, smerníky, serializácia, triedenie, regex, linked listy, BST, Arduino, sériová komunikácia, stavové stroje, prerušenia, polling.',
      },
      {
        name: 'FEI – Jazyk 2',
        semester: '1. rok LS',
        evaluation: 'zápočet',
        outcomes: 'Jazyk min. B1, terminológia pre elektro + IKT.',
      },
      // 2. rok ZS
      {
        name: 'Údajové štruktúry a algoritmy (ÚŠaA)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Efektívne algoritmy, spracovanie údajov.',
        syllabus: 'ADT, grafy/stromy, triedenia, hashovanie, BVS, vyvážené stromy, UF, haldy, B-stromy, externé pamäte.',
      },
      {
        name: 'Architektúry počítačových systémov (APS)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Stavebné prvky, automaty, VHDL, MIPS ISA, CPU implementácie, pipeline, pamäte, I/O, FPGA, paralelizmus.',
      },
      {
        name: 'Objektovo orientované programovanie (OOP)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'OOP princípy, LSP, generiká, lambda, výnimky, návrhové vzory, UML, OCP.',
      },
      {
        name: 'Operačné systémy (OS)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Jadro OS (procesy/pamäť/súbory), systémové programovanie v Linuxe.',
        syllabus: 'Procesy, plánovanie, pamäť, virtuálna pamäť, synchronizácia, zariadenia, súborový systém.',
      },
      {
        name: 'Diskrétna matematika (DM)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Boolovská algebra + grafy + základy pre algoritmy.',
        syllabus: 'Množiny, relácie, zväzy, boolovské funkcie, výroková logika, grafy/stromy, Euler/Hamilton, planárne grafy, digrafy, grafové algoritmy.',
      },
      // 2. rok LS
      {
        name: 'Počítačové siete (PS) – P',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: 'IP adresácia/podsiete, Ethernet, switching/routing základy, VLAN + interVLAN, DHCP/HSRP, routing základy, WLAN, sieťové programovanie.',
        phZh: 'PH: podsieťovanie písomka + teória + praktická konfigurácia. Výstup: Cisco NetAcad → základ pre CCNA 200-301.',
      },
      {
        name: 'Formálne jazyky (FJ) – P',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Regex, gramatiky, syntaktická analýza, základy prekladu a generovania kódu.',
        syllabus: 'Regulárne jazyky, automaty, lexikálna analýza, CFG, parsing top-down/bottom-up, sémantika, optimalizácia, Turing.',
      },
      {
        name: 'Numerická matematika, pravdepodobnosť a štatistika (NMPaŠ) – P',
        semester: '2. rok LS',
        evaluation: 'klasifikovaný zápočet (MATLAB zadanie)',
        syllabus: 'Numerické metódy (rovnice, sústavy), aproximácia, integrál, pravdepodobnosť, popisná štatistika.',
      },
      {
        name: 'Databázové systémy (DBS) – P',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Modelovanie, relačný model, algebra, normalizácia, SQL (DDL/DML/DCL), transakcie, indexy, procedurálne SQL, bezpečnosť.',
      },
      {
        name: 'Komponentové programovanie (KP) – PV',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Java + komponentový štýl, viacvrstvové aplikácie.',
        syllabus: 'Java základy, I/O, vlákna, DB prístup, DI, komponenty/služby, štandardy.',
      },
      {
        name: 'Programovanie v prostredí DotNET (PDotNET) – PV',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: '.NET platforma, C#, generiká/kolekcie, delegáty/udalosti, výnimky, XML serializácia, Visual Studio debugging, forms/controls, security.',
      },
      {
        name: 'Fyzika II (FII) – PV',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Elektrostatika, prúd, magnetizmus, indukcia, Maxwell, optika, kvantové základy.',
      },
      // 3. rok ZS
      {
        name: 'Bakalársky projekt (BProj) – P',
        semester: '3. rok ZS',
        evaluation: 'klasifikovaný zápočet (min. 51 %)',
        phZh: 'PH: samostatná práca na projekte. ZH: prezentácia výsledkov.',
        outcomes: 'Prvý „veľký“ projekt – plán, rozdelenie úloh (aj tímovo), dokumentácia a prezentácia.',
      },
      {
        name: 'Inteligentné systémy v informatike (ISI) – P',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Strojové učenie, dolovanie dát, agenti, vyhľadávanie (A*, UCS…). Prax: spam filter, basket analysis, detekcia podvodov, rozpoznávanie.',
        syllabus: 'Supervised learning (SVM, stromy, kNN…), predspracovanie, validácia, klastrovanie, redukcia dimenzie, agentové systémy, BFS/DFS/UCS, greedy/A*, CSP, optimalizácie (ACO, hill climbing), hybridy.',
      },
      {
        name: 'Používateľské rozhrania a používateľský zážitok (UX) – P',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'HCI + UX výskum, návrh, prototypovanie, použiteľnosť, prístupnosť, dizajn systémy. Prax: persony, scenáre, user stories, testovanie použiteľnosti, responzívny dizajn.',
        syllabus: 'UX pravidlá, výskum/persony, návrh obsahu a interakcie, psychológia v UI, konzistentnosť, testovanie UX, rapid prototyping, typografia a layout.',
      },
      {
        name: 'Manažment softvérových projektov (MSP) – P',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'Plánovanie, odhady, tímy, zdroje, procesy, kvalita, CMMI/SPICE/ITIL. Prax: plánovať, riadiť zmeny, testovanie, dokumentáciu, retrospektívy, agile vs waterfall.',
        syllabus: 'Plánovanie, odhady, tímy, zdroje, procesy, kvalita, CMMI/SPICE/ITIL.',
      },
      {
        name: 'Aplikácie počítačových sietí (AplikPS) – PV',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Pokračovanie Cisco (2.–3. semester), STP/EtherChannel, LAN security, WLAN, OSPF (single area), ACL, NAT/PAT, VPN + IPSec, QoS, troubleshooting, virtualizácia/automatizácia.',
      },
      {
        name: 'SAP ABAP Programovanie (SAP) – PV',
        semester: '3. rok ZS',
        evaluation: 'klasifikovaný zápočet (min. 51 %)',
        outcomes: 'Základy SAP + ABAP, práca s tabuľkami, reťazcami, výpočtami, databázové tabuľky. Výstup: vlastné jednoduché aplikácie v ABAP.',
      },
      {
        name: 'Internet vecí a chytré zariadenia (SMART-IoT) – PV',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        outcomes: 'IoT riešenie cez MQTT, Pico WH + MicroPython, Docker kompozícia, time-series DB, vizualizácia, bezpečnosť (OWASP IoT Top 10), PWA. Výstup: mini IoT stack (device → MQTT → služby → DB → dashboard/app).',
      },
      // 3. rok LS
      {
        name: 'Spoločenské vedy a technika (KSV_SVT) – P',
        semester: '3. rok LS',
        evaluation: 'klasifikovaný zápočet + test (min. 51 %)',
        syllabus: 'Človek v digitálnej spoločnosti, psychológia kognícií, sociológia IKT/AI, etika AI, politika a bezpečnosť online. Dá sa nahradiť krátkodobými mobilitami.',
      },
      {
        name: 'Bezpečnosť v počítačových systémoch (BvPS) – P',
        semester: '3. rok LS',
        evaluation: 'zápočet + skúška',
        phZh: 'PH: projekt.',
        outcomes: 'Kyberbezpečnosť – hrozby, techniky útočníkov, mechanizmy v sieťach/OS/aplikáciách + právne/etické minimum.',
        syllabus: 'Kryptografia, autentifikácia, kontrola prístupu, malware, DoS/DDoS, bezpečnosť emailu, fyzická bezpečnosť, ľudský faktor, risk/audit, plány, právne/etické aspekty.',
      },
      {
        name: 'Dizajn a vývoj počítačových hier (GameDev) – PV',
        semester: '3. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Trendy, platformy, typy hráčov, teória hier, MDA/DPE/FDD, prototypovanie (RITE), storytelling, enginy (Unity/Godot/Phaser), testovanie/QA/playtesting, GDD.',
      },
      {
        name: 'Generatívna umelá inteligencia (GenAI) – PV',
        semester: '3. rok LS',
        evaluation: 'zápočet + skúška (minimá 16 %/30 % + 36 %/70 %)',
        outcomes: 'Generatívne modely vs diskriminačné, transformery + attention, BERT/GPT/T5, tréning/finetuning, RAG, etika. Rozumieš princípom a vieš ich použiť v praxi.',
        syllabus: 'Generatívne modely, transformery, attention, BERT/GPT/T5, tréning, finetuning, RAG, etika.',
      },
      {
        name: 'Asembler (ASM) – PV',
        semester: '3. rok LS',
        evaluation: 'zápočet + skúška',
        outcomes: 'NASM, x86 (Pentium), prepojenie s vyššími jazykmi, zásobník, prerušenia, OS služby, FPU, x86-64 úvod. Nízkoúrovňové chápanie CPU, pamäť, calling convention.',
        syllabus: 'NASM, x86, zásobník, prerušenia, OS služby, FPU, x86-64.',
      },
      {
        name: 'Bakalárska práca (BP)',
        semester: '3. rok LS',
        evaluation: 'štátna skúška (obhajoba, min. 51 %)',
        outcomes: 'Spracovanie témy, štruktúra práce, písomná aj ústna prezentácia, priebežné konzultácie. Podmieňujúci predmet: Bakalársky projekt.',
      },
    ],
  },

  [k('Počítačové siete', 'Informatika')]: {
    pros: [
      'Siete do hĺbky – Cisco NetAcad, CCNA základy, OSI/TCP-IP, adresácia, routing, VPN.',
      'Silný základ z operačných systémov a systémového programovania (Linux) – dôležité pre sieťovú prax.',
      'Prax a tooling: Git, CI/CD, Docker, tímová práca už od prvého roka.',
    ],
    cons: [
      'Menej „čistého“ programovania ako v odbore Informatika – viac konfigurácie a infra.',
      'Elektro a fyzika v prvom roku – technický základ, nie primárny fokus.',
    ],
    forWho:
      'Ak chceš ísť smerom sieťový inžinier, infraštruktúra, cloud, bezpečnosť sietí alebo administrácia systémov.',
    starProfile: {
      matematika: 4,
      programovanie: 4,
      siete: 5,
      elektro: 2,
    },
    subjects: [
      // 1. rok ZS
      {
        name: 'FEI – Jazyk 1',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        focus: 'Angličtina (min. A2) + terminológia pre elektro/IKT.',
        syllabus: 'OS a softvér, text, tabuľky/databázy, grafika, web, internet/email, bezpečnosť, komunikačné systémy.',
      },
      {
        name: 'Repetitórium z matematiky (RzM)',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        focus: 'Dobeh stredoškolskej matematiky na vyššiu matiku.',
        syllabus: 'Rovnice/nerovnice, Gauss, funkcie, polynómy, komplexné čísla.',
      },
      {
        name: 'Základy algoritmizácie a programovania (ZAP)',
        semester: '1. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'Algoritmy + procedurálne programovanie (základy).',
        syllabus: 'Typy, výrazy, cykly, I/O, funkcie, rekurzia, polia, záznamy, riešenie úloh.',
      },
      {
        name: 'Základy inžinierstva materiálov (ZIM)',
        semester: '1. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'Elektrotechnické materiály a ich vlastnosti (vodivosť, dielektriká, polovodiče…).',
        outcomes: 'Prínos pre siete: skôr technický základ, nie „sieťarina“, ale dá kontext HW svetu.',
      },
      {
        name: 'Úvod do inžinierstva (UI)',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        focus: 'Prehľad odborov na FEI (aj Počítačové siete) + interdisciplinárne súvislosti.',
      },
      {
        name: 'Telesná výchova I',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        focus: 'Klasika TV.',
      },
      {
        name: 'Základy elektrotechnického inžinierstva (ZEI)',
        semester: '1. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        focus: 'Jednosmerné obvody + BOZP + základy technickej dokumentácie a CAD.',
        outcomes: 'Prínos pre siete: chápanie elektrických veličín + bezpečnosť práce.',
      },
      {
        name: 'Matematika I (MAT I)',
        semester: '1. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        focus: 'Lineárna algebra + derivácie.',
        syllabus: 'Matice/determinanty, sústavy rovníc, limity, derivácia, Taylor, extrémy.',
      },
      {
        name: 'Úvod do fyziky (UDF)',
        semester: '1. rok ZS',
        evaluation: 'zápočet',
        focus: 'Zopakovanie SŠ fyziky (hlavne mechanika, kmity, vlnenie).',
      },
      // 1. rok LS
      {
        name: 'Fyzika I (FI)',
        semester: '1. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'Mechanika + termodynamika ako základ pre technické predmety.',
      },
      {
        name: 'Princípy počítačového inžinierstva (PPI)',
        semester: '1. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'Ako funguje počítač + architektúra + bezpečnosť + siete v kontexte systémov.',
        syllabus: 'HW princípy, sieťové technológie, telematika, bezpečnosť, periférie, paralelné systémy.',
      },
      {
        name: 'Základy softvérového inžinierstva (ZSwI)',
        semester: '1. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'Procesy vývoja softvéru, Git, testovanie, CI/CD, Docker, UML, Scrum.',
        outcomes: 'Prínos pre siete: užitočné pre prax (projekty, tooling, tímová práca).',
      },
      {
        name: 'Matematika II (MAT II)',
        semester: '1. rok LS',
        evaluation: 'klasifikovaný zápočet',
        focus: 'Integrály + viac premenných.',
        syllabus: 'Integrály, aplikácie, parciálne derivácie, extrémy funkcie dvoch premenných.',
      },
      {
        name: 'Programovanie (Progr)',
        semester: '1. rok LS',
        evaluation: 'klasifikovaný zápočet + skúška',
        focus: 'Pokročilejší C: pointery, dynamická pamäť, štruktúry, regex, zoznamy, stromy + úvod Arduino.',
        outcomes: 'Prínos pre siete: silný základ na low-level myslenie a neskôr aj sieťové programovanie.',
      },
      {
        name: 'FEI – Jazyk 2',
        semester: '1. rok LS',
        evaluation: 'zápočet',
        focus: 'Jazyk na úrovni B1 + IKT terminológia.',
      },
      {
        name: 'Telesná výchova II',
        semester: '1. rok LS',
        evaluation: 'zápočet',
        focus: 'Klasika TV.',
      },
      // 2. rok ZS
      {
        name: 'Údajové štruktúry a algoritmy (ÚŠaA)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'Efektívne štruktúry a algoritmy.',
        syllabus: 'Grafy/stromy, triedenie, hashovanie, BVS, vyvážené stromy, haldy, B-stromy, externé pamäte.',
      },
      {
        name: 'Architektúry počítačových systémov (APS)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'CPU architektúra, pamäť, ISA (napr. MIPS), VHDL, FPGA, paralelizmus.',
        outcomes: 'Prínos pre siete: dobré „pod kapotou“ chápanie výkonu, HW limitov, systémov.',
      },
      {
        name: 'Objektovo orientované programovanie (OOP)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'OOP princípy, návrhové vzory, generics, výnimky, UML.',
        outcomes: 'Prínos pre siete: praktické pre vývoj nástrojov/služieb.',
      },
      {
        name: 'Operačné systémy (OS)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'Procesy, pamäť, plánovanie, FS, Linux systémové programovanie.',
        outcomes: 'Prínos pre siete: extrémne dôležité (sieťová prax stojí na OS).',
      },
      {
        name: 'Diskrétna matematika (DM)',
        semester: '2. rok ZS',
        evaluation: 'zápočet + skúška',
        focus: 'Logika, grafy, relácie, boolovská algebra, základy analýzy algoritmov.',
        outcomes: 'Prínos pre siete: grafy/logika = základ pre smerovanie a sieťové myslenie.',
      },
      // 2. rok LS
      {
        name: 'Počítačové siete (PS) – P',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'Základný sieťový predmet (OSI/TCP-IP, adresácia, subnetting, switching/routing).',
        outcomes: 'Pokrytie Cisco NetAcad (1. + časť 2. semestra) + základ pre CCNA.',
      },
      {
        name: 'Formálne jazyky (FJ) – P',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'Regex, gramatiky, syntaktická analýza, automaty.',
        outcomes: 'Prínos pre siete: nepriamo (logika/parsovanie/configy), hlavne teória informatiky.',
      },
      {
        name: 'Numerická matematika, pravdepodobnosť a štatistika (NMPaŠ) – P',
        semester: '2. rok LS',
        evaluation: 'klasifikovaný zápočet',
        focus: 'Numerika + štatistika v MATLABe.',
      },
      {
        name: 'Databázové systémy (DBS) – P',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'SQL + relačný model + normalizácia + transakcie.',
      },
      {
        name: 'Aplikácie počítačových sietí (AplikPS) – PV',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'Pokročilejšie siete (STP, VLAN, OSPF, ACL, NAT, VPN/IPSec, QoS, troubleshooting).',
        outcomes: 'Pokračovanie Cisco (2.–3. semester) + bližšie ku CCNA.',
      },
      {
        name: 'Internet vecí a chytré zariadenia (SMART-IoT) – PV',
        semester: '2. rok LS',
        evaluation: 'zápočet + skúška',
        focus: 'IoT stack (MQTT, Pico WH, Docker, TS DB, security, PWA).',
      },
      // 3. rok ZS
      {
        name: 'Objektovo orientované programovanie (OOP_PS) – P',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Triedy/objekty, dedičnosť, polymorfizmus, generiká, výnimky, modelovanie, návrhové vzory.',
      },
      {
        name: 'Bakalársky projekt (BPJ_PS) – P',
        semester: '3. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        syllabus: 'Analýza, štúdium zdrojov, návrh riešenia, priebežný progres, verejná prezentácia.',
      },
      {
        name: 'Aplikácie počítačových sietí (APCS_PS) – P',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'DHCP/DNS, STP pokročile, VTP, dynamické routing protokoly, VPN/IPsec, WAN, monitoring (syslog, SNMP, NetFlow), dizajn architektúr.',
      },
      {
        name: 'Programovanie audio aplikácií (PAA_PS) – PV',
        semester: '3. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        syllabus: 'DSP audio, časová/frekvenčná oblasť, filtrácia, kódeky, web audio.',
      },
      {
        name: 'Webové technológie (WT_PS) – PV',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'HTML/CSS/JS, PHP/Python, SQL, React/Angular, Django/Flask, UI/UX, dynamické weby.',
      },
      {
        name: 'Programovanie meracích systémov (PMS_PS) – PV',
        semester: '3. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        syllabus: 'LabVIEW, zber dát, automatizované meranie, súbory, HW ovládanie, synchronizácia.',
      },
      {
        name: 'Mobilné technológie a služby (MTS_PS) – PV',
        semester: '3. rok ZS',
        evaluation: 'zápočet + skúška',
        syllabus: 'GSM/UMTS/LTE/5G, MIMO, kanálové modely, antény, MANET/DTN.',
      },
      {
        name: 'Náhľad do modernej fyziky (Ndmf) – V',
        semester: '3. rok ZS',
        evaluation: 'klasifikovaný zápočet',
        syllabus: 'Relativita, kvantová fyzika, CERN, kozmológia.',
      },
      // 3. rok LS
      {
        name: 'Spoločenské vedy a technika (KSV_SVT) – P',
        semester: '3. rok LS',
        evaluation: 'klasifikovaný zápočet',
        syllabus: 'Psychológia v digitále, sociológia AI, infodémia, bezpečnosť/politika, etika AI, profesijná etika.',
      },
      {
        name: 'Bezpečnosť v počítačových systémoch (BPS_PS) – P',
        semester: '3. rok LS',
        evaluation: 'zápočet + skúška',
        syllabus: 'Kryptografia (sym/asym), hash, RNG, podpisy, certifikáty, autentifikácia/autorizácia, email security, malware, trendy.',
      },
    ],
  },
};

export function getProgramProfile(name: string, field: string): ProgramProfile | undefined {
  return profiles[k(name, field)];
}
