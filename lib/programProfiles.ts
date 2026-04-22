/**
 * Rozšírené profily programov: hviezdičkové zloženie + predmety po semestroch.
 * Používa sa na detail stránke programu (/program/[name]/[field]).
 *
 * Polia pros/cons/forWho sú ponechané v type kvôli spätnej kompatibilite UI,
 * ale v obsahu sú prázdne – reálne sa nezobrazujú.
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
  evaluation?: string;
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

function names(semester: string, list: string[]): Subject[] {
  return list.map((name) => ({ name, semester }));
}

const profiles: Record<string, ProgramProfile> = {
  // =========================================================================
  // INFORMATIKA
  // =========================================================================
  [k('Informatika', 'Informatika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 1, matematika: 3, programovanie: 5, siete: 2 },
    subjects: [
      ...names('1. rok ZS', [
        'FEI – Jazyk 1',
        'Repetitórium z matematiky',
        'ZAP',
        'Základy inžinierstva materiálov',
        'Úvod do inžinierstva',
        'Telesná výchova I',
        'Základy elektrotechnického inžinierstva',
        'Matematika I',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'Princípy počítačového inžinierstva',
        'Telesná výchova II',
        'Základy softvérového inžinierstva',
        'Matematika II',
        'Programovanie',
        'FEI – Jazyk 2',
        'Fyzika I',
      ]),
      ...names('2. rok ZS', [
        'Údajové štruktúry a algoritmy',
        'Architektúry počítačových systémov',
        'Objektovo orientované programovanie',
        'Diskrétna matematika',
        'Operačné systémy',
      ]),
      ...names('2. rok LS', [
        'Počítačové siete',
        'Formálne jazyky',
        'Numerická matematika, pravdepodobnosť a štatistika',
        'Databázové systémy',
        'Programovanie v DotNET',
        'Komponentové programovanie',
        'Fyzika II',
      ]),
      ...names('3. rok ZS', [
        'Bakalársky projekt',
        'Inteligentné systémy v informatike',
        'UX',
        'Manažment softvérových projektov',
        'Aplikácie počítačových sietí',
        'SAP ABAP',
        'Internet vecí',
      ]),
      ...names('3. rok LS', [
        'Spoločenské vedy a technika',
        'Bezpečnosť v počítačových systémoch',
        'Dizajn a vývoj počítačových hier',
        'Asembler',
        'Základy Internetu vecí',
      ]),
    ],
  },

  // =========================================================================
  // POČÍTAČOVÉ SIETE
  // =========================================================================
  [k('Počítačové siete', 'Informatika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 2, matematika: 3, programovanie: 4, siete: 5 },
    subjects: [
      ...names('1. rok ZS', [
        'Matematika I',
        'Základy elektrotechnického inžinierstva',
        'Úvod do inžinierstva',
        'Základy inžinierstva materiálov',
        'Telesná výchova I',
        'ZAP',
        'FEI – Jazyk 1',
        'Repetitórium z matematiky',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'Fyzika I',
        'Programovanie',
        'Telesná výchova II',
        'FEI – Jazyk 2',
        'Základy komunikačných technológií',
        'Matematika II',
        'Princípy počítačového inžinierstva',
      ]),
      ...names('2. rok ZS', [
        'Operačné systémy',
        'Údajové štruktúry a algoritmy',
        'Diskrétna matematika',
        'Úvod do počítačových sietí',
        'Architektúry počítačových systémov',
      ]),
      ...names('2. rok LS', [
        'Numerická matematika, pravdepodobnosť a matematická štatistika',
        'Databázové systémy',
        'Počítačové siete',
        'Multimediálne signály v komunikačných sieťach',
        'Fyzika II',
        'Úvod do digitálnych komunikácií',
        'Prenosové médiá',
        'Základy elektroniky a logických obvodov',
        'Vedecký projekt',
      ]),
      ...names('3. rok ZS', [
        'Objektovo orientované programovanie',
        'Bakalársky projekt',
        'Aplikácie počítačových sietí',
        'Programovanie audio aplikácií',
        'Webové technológie',
        'Programovanie meracích systémov',
        'Mobilné technológie a služby',
        'Náhľad do modernej fyziky',
      ]),
      ...names('3. rok LS', [
        'Spoločenské vedy a technika',
        'Bezpečnosť v počítačových systémoch',
        'Základy klaudových technológií',
        'Rečové interaktívne komunikačné systémy',
        'Optoelektronika',
        'Základy softvérového inžinierstva',
      ]),
    ],
  },

  // =========================================================================
  // APLIKOVANÁ ELEKTROTECHNIKA
  // =========================================================================
  [k('Aplikovaná elektrotechnika', 'Elektrotechnika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 5, matematika: 3, programovanie: 2, siete: 1 },
    subjects: [
      ...names('1. rok ZS', [
        'ZAP',
        'Repetitórium z matematiky',
        'Matematika I',
        'Základy inžinierstva materiálov',
        'Úvod do inžinierstva',
        'Základy elektrotechnického inžinierstva',
        'FEI – Jazyk 1',
        'Telesná výchova I',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'FEI – Jazyk 2',
        'Elektrotechnika',
        'Počítačové aplikácie',
        'Telesná výchova II',
        'Fyzika 1',
        'Programovanie',
        'Matematika II',
      ]),
      ...names('2. rok ZS', [
        'Matematika III',
        'Fyzika II',
        'Základy elektrických strojov',
        'Priemyselná elektronika',
        'Snímače a meranie v elektrotechnike',
        'Automobilová elektrotechnika',
      ]),
      ...names('2. rok LS', [
        'Riadenie priemyselných systémov',
        'Výkonová elektronika',
        'Základy programovania mikropočítačov',
        'Elektrické pohony',
        'Pneumatické a hydraulické systémy',
        'Modelovanie a simulácie v elektrotechnike',
      ]),
      ...names('3. rok ZS', [
        'Regulované pohony',
        'Tvorba používateľských rozhraní',
        'Bakalársky projekt',
        'Prenos a rozvod elektrickej energie',
        'Základy robotiky',
        'Modelovanie elektromechanických systémov',
      ]),
      ...names('3. rok LS', [
        'Elektrické prístroje',
        'Spoločenské vedy a technika',
      ]),
    ],
  },

  // =========================================================================
  // AUTOMOBILOVÁ ELEKTRONIKA
  // =========================================================================
  [k('Automobilová elektronika', 'Elektrotechnika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 5, matematika: 3, programovanie: 2, siete: 1 },
    subjects: [
      ...names('1. rok ZS', [
        'Základy inžinierstva materiálov',
        'Repetitórium z matematiky',
        'Základy elektrotechnického inžinierstva',
        'Telesná výchova I',
        'ZAP',
        'Úvod do inžinierstva',
        'FEI – Jazyk 1',
        'Matematika I',
      ]),
      ...names('1. rok LS', [
        'FEI – Jazyk 2',
        'Elektrotechnika',
        'Fyzika 1',
        'Programovanie',
        'Matematika II',
        'Telesná výchova II',
        'Počítačové aplikácie',
      ]),
      ...names('2. rok ZS', [
        'Elektronika I',
        'Signály a sústavy',
        'Matematika III',
        'Materiály a princípy výroby súčiastok v elektrotechnike',
        'Automobilová elektrotechnika',
        'Základy konštrukcie automobilov',
      ]),
      ...names('2. rok LS', [
        'Meranie v elektronike',
        'Základy mikroprocesorovej techniky',
        'Numerická matematika, pravdepodobnosť a matematická štatistika',
        'Elektronika II',
        'Databázové systémy',
        'Počítačové siete',
        'Úvod do Matlabu',
      ]),
      ...names('3. rok ZS', [
        'Bakalársky projekt',
        'Automobilová elektronika',
        'Programovanie meracích systémov',
        'Mikrosystémy v elektronike',
      ]),
      ...names('3. rok LS', [
        'Elektronika III',
        'Spoločenské vedy a technika',
        'Optoelektronika',
        'Metódy vedeckej práce',
      ]),
    ],
  },

  // =========================================================================
  // ELEKTROENERGETIKA
  // =========================================================================
  [k('Elektroenergetika', 'Elektrotechnika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 5, matematika: 3, programovanie: 1, siete: 1 },
    subjects: [
      ...names('1. rok ZS', [
        'Repetitórium z matematiky',
        'Základy inžinierstva materiálov',
        'Matematika I',
        'Úvod do inžinierstva',
        'FEI – Jazyk 1',
        'ZAP',
        'Základy elektrotechnického inžinierstva',
      ]),
      ...names('1. rok LS', [
        'Elektrotechnika',
        'Fyzika 1',
        'Programovanie',
        'Matematika II',
        'FEI – Jazyk 2',
        'Telesná výchova II',
      ]),
      ...names('2. rok ZS', [
        'Matematika III',
        'Fyzika II',
        'Základy elektrických strojov',
        'Energetický základ',
      ]),
      ...names('2. rok LS', [
        'Jadro energetiky',
        'Silnoprúdové predmety',
      ]),
      ...names('3. rok ZS', [
        'Energetické zariadenia',
        'Elektrizačná sústava',
      ]),
      ...names('3. rok LS', [
        'Bakalárska časť',
        'Záverečné predmety',
      ]),
    ],
  },

  // =========================================================================
  // FYZIKÁLNE INŽINIERSTVO PROGRESÍVNYCH MATERIÁLOV
  // =========================================================================
  [k('Fyzikálne inžinierstvo progresívnych materiálov', 'Elektrotechnika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 2, matematika: 4, programovanie: 2, siete: 1 },
    subjects: [
      ...names('1. rok ZS', [
        'Telesná výchova I',
        'FEI – Jazyk 1',
        'Repetitórium z matematiky',
        'Základy inžinierstva materiálov',
        'Základy elektrotechnického inžinierstva',
        'ZAP',
        'Úvod do inžinierstva',
      ]),
      ...names('1. rok LS', [
        'Fyzika',
        'Matematika',
        'Programovanie',
        'Základný technický blok',
      ]),
      ...names('2. rok ZS', [
        'Fyzikálne a materiálové jadro',
        'Merania',
        'Kvantové a materiálové základy',
      ]),
      ...names('2. rok LS', [
        'Experimentálne metódy',
        'Fyzika tuhých látok',
        'Modelovanie',
        'Spracovanie dát',
      ]),
      ...names('3. rok ZS', [
        'Odborné materiálové a fyzikálne predmety',
        'Bakalársky projekt',
      ]),
      ...names('3. rok LS', [
        'Odborná prax',
        'Záverečné predmety',
        'Spoločenskovedný blok',
      ]),
    ],
  },

  // =========================================================================
  // PRIEMYSELNÁ ELEKTROTECHNIKA
  // =========================================================================
  [k('Priemyselná elektrotechnika', 'Elektrotechnika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 5, matematika: 3, programovanie: 3, siete: 1 },
    subjects: [
      ...names('1. rok ZS', [
        'Repetitórium z matematiky',
        'FEI – Jazyk 1',
        'Základy elektrotechnického inžinierstva',
        'Matematika I',
        'Telesná výchova I',
        'Úvod do inžinierstva',
        'ZAP',
        'Základy inžinierstva materiálov',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'Telesná výchova II',
        'Fyzika I',
        'FEI – Jazyk 2',
        'Elektrotechnické praktikum',
        'Matematika II',
        'Elektrotechnika',
        'Programovanie',
      ]),
      ...names('2. rok ZS', [
        'Aplikovaná analógová elektronika',
        'Priemyselná elektrotechnika',
        'Matematika III',
        'Windows Server I',
        'Fyzika II',
        'CAD systémy v elektrotechnike',
      ]),
      ...names('2. rok LS', [
        'Simulačný softvér pre analýzu elektrických obvodov',
        'Aplikovaná číslicová elektronika',
        'Metrológia',
        'Senzory a akčné členy',
        'MS Office v technickej praxi',
        'Semestrálny projekt I',
      ]),
      ...names('3. rok ZS', [
        'Mikroprocesorová technika',
        'Databázové systémy',
        'Bakalársky projekt',
        'Marketing a manažment priemyslu',
        'Výpočtová a multimediálna technika',
        'Modelovanie a meranie',
      ]),
      ...names('3. rok LS', [
        'Spoločenské vedy a technika',
        'Linux I',
        'Priemyselné logické automaty',
        'Magnetoelektronika a informačné technológie',
      ]),
    ],
  },

  // =========================================================================
  // KYBERBEZPEČNOSŤ
  // =========================================================================
  [k('Kyberbezpečnosť', 'Informatika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 1, matematika: 3, programovanie: 4, siete: 4 },
    subjects: [
      ...names('1. rok ZS', [
        'FEI – Jazyk 1',
        'Základy inžinierstva materiálov',
        'Úvod do inžinierstva',
        'Repetitórium z matematiky',
        'Telesná výchova I',
        'Základy elektrotechnického inžinierstva',
        'Matematika I',
        'ZAP',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'Fyzika I',
        'Telesná výchova II',
        'Počítačové inžinierstvo a zabezpečený hardvér',
        'Matematika II',
        'FEI – Jazyk 2',
        'Programovanie',
        'Kyberbezpečnosť',
      ]),
      ...names('2. rok ZS', [
        'Diskrétna matematika',
        'Operačné systémy a kyberbezpečnosť',
        'Bezpečnostný manažment',
        'Údajové štruktúry a algoritmy v bezpečnom softvéri',
        'Objektovo orientované programovanie',
      ]),
      ...names('2. rok LS', [
        'Numerická matematika, pravdepodobnosť a štatistika',
        'Databázové systémy a ich zabezpečenie',
        'Základy kryptografie',
        'Bezpečnosť počítačových sietí',
        'Komponentové programovanie',
        'Formálne jazyky',
        'DotNET',
      ]),
      ...names('3. rok ZS', [
        'Inteligentné systémy v kyberbezpečnosti',
        'Priemyselná a systémová bezpečnosť',
        'Aplikácie zabezpečenia počítačových sietí',
        'Bakalársky projekt',
        'Internet vecí',
        'Manažment softvérových projektov',
        'CCNA Security',
        'UX',
      ]),
      ...names('3. rok LS', [
        'Asembler pre reverzné inžinierstvo',
        'Spoločenské vedy a technika',
        'Právne otázky kybernetickej bezpečnosti',
      ]),
    ],
  },

  // =========================================================================
  // POČÍTAČOVÉ MODELOVANIE
  // =========================================================================
  [k('Počítačové modelovanie', 'Informatika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 2, matematika: 5, programovanie: 4, siete: 1 },
    subjects: [
      ...names('1. rok ZS', [
        'Matematika I',
        'ZAP',
        'Repetitórium z matematiky',
        'FEI – Jazyk 1',
        'Úvod do inžinierstva',
        'Základy elektrotechnického inžinierstva',
        'Telesná výchova I',
        'Základy inžinierstva materiálov',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'Počítačové modelovanie',
        'FEI – Jazyk 2',
        'Telesná výchova II',
        'Elektrotechnika',
        'Matematika II',
        'Fyzika I',
        'Programovanie',
        'Seminár z fyziky 1',
      ]),
      ...names('2. rok ZS', [
        'Matematika III',
        'Softvérové výpočtové prostriedky',
        'Objektovo orientované programovanie',
        'Teória kódovania',
        'Údajové štruktúry a algoritmy',
      ]),
      ...names('2. rok LS', [
        'Numerická matematika, pravdepodobnosť a matematická štatistika',
        'Teoretická informatika',
        'Projektový seminár',
        'Aplikácie diferenciálnych rovníc',
        'Databázové systémy',
        'DotNET',
        'Komponentové programovanie',
        'Fyzika II',
      ]),
      ...names('3. rok ZS', [
        'Matematicko-počítačové modelovanie',
        'Odborná prax',
        'Inteligentné systémy v informatike',
        'Bakalársky projekt',
        'Programovanie vo formátovacích jazykoch',
        'Počítačové modelovanie II',
        'Počítačová grafika',
        'Internet vecí',
        'Náhľad do modernej fyziky',
      ]),
      ...names('3. rok LS', [
        'Operačná analýza',
        'Spoločenské vedy a technika',
        'Úvod do logiky',
        'Finančná matematika',
      ]),
    ],
  },

  // =========================================================================
  // UMELÁ INTELIGENCIA
  // =========================================================================
  [k('Umelá inteligencia', 'Informatika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 1, matematika: 4, programovanie: 5, siete: 2 },
    subjects: [
      ...names('1. rok ZS', [
        'FEI – Jazyk 1',
        'Repetitórium z matematiky',
        'ZAP',
        'Matematika I',
        'Telesná výchova I',
        'Základy elektrotechnického inžinierstva',
        'Úvod do inžinierstva',
        'Základy inžinierstva materiálov',
        'Úvod do fyziky',
      ]),
      ...names('1. rok LS', [
        'Jazyk Python',
        'Telesná výchova II',
        'Úvod do umelej inteligencie',
        'Fyzika',
        'Programovanie',
        'FEI – Jazyk 2',
        'Matematika II',
      ]),
      ...names('2. rok ZS', [
        'Aplikácie databázových systémov',
        'Diskrétna matematika',
        'Aplikácie generatívnej umelej inteligencie',
        'Spracovanie obrazu a robotika',
        'Úvod do dátovej vedy',
      ]),
      ...names('2. rok LS', [
        'Mobilná robotika',
        'Strojové učenie',
        'Numerická matematika, pravdepodobnosť a matematická štatistika',
        'Internet vecí',
        'Fuzzy systémy',
        'Aplikácia logiky v inteligentných systémoch',
        'Rozvrhovanie a logistika',
      ]),
      ...names('3. rok ZS', [
        'Bakalársky projekt',
        'Hlboké učenie',
        'Digitálna transformácia a inteligentné inovácie',
        'Učenie posilňovaním',
        'Manažment projektov',
        'Vizualizácia dát',
        'Riadenie a umelá inteligencia',
      ]),
      ...names('3. rok LS', [
        'Spoločenské vedy a technika',
        'Umelá inteligencia v praxi',
        'Cloudové technológie',
        'Prototypovanie UI riešení',
        'Aplikovaná UI v podnikových systémoch',
      ]),
    ],
  },

  // =========================================================================
  // APLIKOVANÁ INFORMATIKA
  // =========================================================================
  [k('Aplikovaná informatika', 'Informatika')]: {
    pros: [],
    cons: [],
    forWho: '',
    starProfile: { elektro: 1, matematika: 3, programovanie: 5, siete: 3 },
    subjects: [
      ...names('1. rok ZS', [
        'ZAP',
        'Úvod do inžinierstva',
        'Telesná výchova I',
        'Základy elektrotechnického inžinierstva',
        'Repetitórium z matematiky',
        'Matematika I – ApI',
        'FEI – Jazyk 1',
      ]),
      ...names('1. rok LS', [
        'Pokračovanie všeobecného IT základu',
      ]),
      ...names('2. rok', [
        'Praktický IT mix – softvér',
        'Správa systémov',
        'Databázy',
        'Siete',
      ]),
      ...names('3. rok', [
        'Nasadenie technológií do praxe',
        'Aplikovaná IT vetva',
        'Bakalársky projekt',
      ]),
      ...names('4. rok', [
        'Záverečné predmety',
        'Bakalárska práca',
      ]),
    ],
  },
};

export function getProgramProfile(name: string, field: string): ProgramProfile | undefined {
  return profiles[k(name, field)];
}
