import type { Major, MajorField } from './types';

/** Tematické štítky podľa dimenzií: Elektro, Matematika, Programovanie, Siete */
export type MajorTag =
  | 'Sieťovanie'
  | 'Infraštruktúra'
  | 'Bezpečnosť'
  | 'Cloud'
  | 'Diagnostika'
  | 'Hardware'
  | 'Obvody'
  | 'Energetika'
  | 'Merania'
  | 'Štatistika'
  | 'Algoritmy'
  | 'Modelovanie'
  | 'Fyzika'
  | 'Kód'
  | 'Vývoj'
  | 'Dáta'
  | 'AI'
  | 'Prax'
  | 'Tím';

export type StarProfile = {
  elektro: number;
  matematika: number;
  programovanie: number;
  siete: number;
};

export type DuelCardKey = 'Predmety' | 'Typ práce' | 'Skills' | 'Baví ťa' | 'Ťaží ťa';

export type MajorMeta = {
  tagline: string;
  tags: [MajorTag, MajorTag, MajorTag];
  /** Hviezdičkové hodnotenie 1–5: Elektro, Matematika, Programovanie, Siete */
  stars: StarProfile;
  duel: Record<DuelCardKey, string>;
  /** Top 3 predmety/aktivity pre hover na mape */
  topActivities: [string, string, string];
};

function k(name: string, field: string) {
  return `${name}__${field}`;
}

const DEFAULT_META: MajorMeta = {
  tagline: 'Silný všeobecný základ s dobrou uplatniteľnosťou.',
  tags: ['Kód', 'Algoritmy', 'Prax'],
  stars: { elektro: 3, matematika: 3, programovanie: 3, siete: 3 },
  duel: {
    Predmety: 'Základné predmety + profilové témy podľa zamerania.',
    'Typ práce': 'Mix analýzy, implementácie a tímovej spolupráce.',
    Skills: 'Základy + schopnosť učiť sa nové veci rýchlo.',
    'Baví ťa': 'Keď chceš mať otvorené možnosti a skúšať rôzne oblasti.',
    'Ťaží ťa': 'Keď potrebuješ jasnú špecializáciu hneď od začiatku.',
  },
  topActivities: ['Predmety', 'Prax', 'Projekty'],
};

export const majorsMeta: Record<string, MajorMeta> = {
  [k('Informatika', 'Informatika')]: {
    tagline: 'Pre teba, ak chceš univerzálny IT základ a veľa smerov.',
    tags: ['Kód', 'Algoritmy', 'Vývoj'],
    stars: { elektro: 1, matematika: 4, programovanie: 5, siete: 2 },
    duel: {
      Predmety: 'Programovanie, algoritmy, databázy, systémy.',
      'Typ práce': 'Vývoj softvéru, product teams, startupy.',
      Skills: 'Kód, systémové myslenie, debug.',
      'Baví ťa': 'Keď chceš tvoriť produkty a aplikácie.',
      'Ťaží ťa': 'Ak chceš úzku špecializáciu (AI/Siete) hneď.',
    },
    topActivities: ['Programovanie', 'Algoritmy', 'Databázy'],
  },
  [k('Kyberbezpečnosť', 'Informatika')]: {
    tagline: 'Pre teba, ak ťa baví bezpečnosť, útok/obrana a analýza.',
    tags: ['Bezpečnosť', 'Sieťovanie', 'Infraštruktúra'],
    stars: { elektro: 2, matematika: 4, programovanie: 4, siete: 5 },
    duel: {
      Predmety: 'Kryptografia, bezpečnosť, forenzika, siete.',
      'Typ práce': 'Security analyst, pentester, SOC.',
      Skills: 'Threat model, incident response, audit.',
      'Baví ťa': 'Hľadanie chýb a ochrana systémov.',
      'Ťaží ťa': 'Veľa disciplíny a detailov, neustále učenie.',
    },
    topActivities: ['Kryptografia', 'Bezpečnosť', 'Forenzika'],
  },
  [k('Počítačové siete', 'Informatika')]: {
    tagline: 'Pre teba, ak chceš rozumieť infraštruktúre a sieťam do hĺbky.',
    tags: ['Sieťovanie', 'Infraštruktúra', 'Cloud'],
    stars: { elektro: 2, matematika: 4, programovanie: 4, siete: 5 },
    duel: {
      Predmety: 'Siete, protokoly, routing, systémy.',
      'Typ práce': 'Network engineer, admin, cloud infra.',
      Skills: 'Troubleshooting, konfigurácia, monitoring.',
      'Baví ťa': 'Keď rád riešiš „prečo to nejde“.',
      'Ťaží ťa': 'On-call a zodpovednosť za dostupnosť.',
    },
    topActivities: ['Siete a protokoly', 'Routing', 'Cloud infra'],
  },
  [k('Umelá inteligencia', 'Informatika')]: {
    tagline: 'Pre teba, ak ťa baví ML, dáta a modely, ktoré robia rozhodnutia.',
    tags: ['AI', 'Dáta', 'Štatistika'],
    stars: { elektro: 1, matematika: 5, programovanie: 5, siete: 2 },
    duel: {
      Predmety: 'Strojové učenie, štatistika, neurónové siete.',
      'Typ práce': 'ML engineer, data scientist.',
      Skills: 'Modelovanie, experimenty, interpretácia.',
      'Baví ťa': 'Keď chceš „učiť“ stroje z dát.',
      'Ťaží ťa': 'Matika a iterovanie pokus/omyl.',
    },
    topActivities: ['Strojové učenie', 'Štatistika', 'Neurónové siete'],
  },
  [k('Počítačové modelovanie', 'Informatika')]: {
    tagline: 'Pre teba, ak chceš kombinovať programovanie, modely a dáta.',
    tags: ['Modelovanie', 'Dáta', 'Algoritmy'],
    stars: { elektro: 1, matematika: 4, programovanie: 4, siete: 2 },
    duel: {
      Predmety: 'Modelovanie, simulácie, dáta, algoritmy.',
      'Typ práce': 'Simulácie, analýza, R&D.',
      Skills: 'Analýza, abstrahovanie, validácia.',
      'Baví ťa': 'Keď ťa baví „ako to funguje“ pod povrchom.',
      'Ťaží ťa': 'Menej „produktového“ vývoja, viac analýzy.',
    },
    topActivities: ['Modelovanie', 'Simulácie', 'Algoritmy'],
  },
  [k('Aplikovaná elektrotechnika', 'Elektrotechnika')]: {
    tagline: 'Pre teba, ak chceš praktický hardware a systémy v reálnom svete.',
    tags: ['Hardware', 'Obvody', 'Merania'],
    stars: { elektro: 5, matematika: 3, programovanie: 3, siete: 2 },
    duel: {
      Predmety: 'Elektronika, merania, obvody, systémy.',
      'Typ práce': 'Vývoj HW, integrácia, testovanie.',
      Skills: 'Meranie, návrh, prototypovanie.',
      'Baví ťa': 'Keď chceš vidieť výsledok „v rukách“.',
      'Ťaží ťa': 'Viac fyziky a laboratórií.',
    },
    topActivities: ['Elektronika', 'Merania', 'Obvody'],
  },
  [k('Priemyselná elektrotechnika', 'Elektrotechnika')]: {
    tagline: 'Pre teba, ak ťa láka automatizácia, PLC a priemysel.',
    tags: ['Hardware', 'Merania', 'Diagnostika'],
    stars: { elektro: 4, matematika: 3, programovanie: 3, siete: 2 },
    duel: {
      Predmety: 'Automatizácia, riadenie, merania.',
      'Typ práce': 'Priemysel, výroba, integrátor.',
      Skills: 'PLC, diagnostika, procesy.',
      'Baví ťa': 'Keď chceš riešiť reálne výrobné systémy.',
      'Ťaží ťa': 'Práca s normami a bezpečnosťou.',
    },
    topActivities: ['Automatizácia', 'PLC', 'Riadenie'],
  },
  [k('Automobilová elektronika', 'Elektrotechnika')]: {
    tagline: 'Pre teba, ak ťa baví automotive, embedded a senzory.',
    tags: ['Hardware', 'Merania', 'Diagnostika'],
    stars: { elektro: 5, matematika: 3, programovanie: 3, siete: 2 },
    duel: {
      Predmety: 'Elektronika, embedded, diagnostika.',
      'Typ práce': 'Automotive R&D, testovanie, integrácia.',
      Skills: 'Systémy, embedded, kvalita.',
      'Baví ťa': 'Keď ťa lákajú autá a elektronika.',
      'Ťaží ťa': 'Procesy, compliance, dokumentácia.',
    },
    topActivities: ['Embedded', 'Diagnostika', 'Automotive'],
  },
  [k('Elektroenergetika', 'Elektrotechnika')]: {
    tagline: 'Pre teba, ak chceš energie, siete a „smart grid“ svet.',
    tags: ['Energetika', 'Infraštruktúra', 'Prax'],
    stars: { elektro: 5, matematika: 4, programovanie: 2, siete: 3 },
    duel: {
      Predmety: 'Energetika, stroje, rozvodné siete.',
      'Typ práce': 'Distribúcia, návrh, audit, smart grid.',
      Skills: 'Analýza, normy, technické myslenie.',
      'Baví ťa': 'Keď chceš riešiť infraštruktúru spoločnosti.',
      'Ťaží ťa': 'Normy, bezpečnosť, zodpovednosť.',
    },
    topActivities: ['Energetika', 'Stroje', 'Smart grid'],
  },
  [k('Fyzikálne inžinierstvo progresívnych materiálov', 'Elektrotechnika')]: {
    tagline: 'Pre teba, ak ťa baví fyzika, materiály a výskum.',
    tags: ['Fyzika', 'Modelovanie', 'Merania'],
    stars: { elektro: 4, matematika: 5, programovanie: 2, siete: 2 },
    duel: {
      Predmety: 'Materiály, fyzika, laboratóriá, analýza.',
      'Typ práce': 'Výskum, vývoj, lab.',
      Skills: 'Experiment, meranie, interpretácia.',
      'Baví ťa': 'Keď chceš objavovať nové materiály.',
      'Ťaží ťa': 'Viac teórie a experimentovania.',
    },
    topActivities: ['Materiály', 'Fyzika', 'Laboratóriá'],
  },
};

export function getMajorMeta(major: Major): MajorMeta {
  return majorsMeta[k(major.name, major.field)] ?? DEFAULT_META;
}

export function majorHasTag(major: Major, tag: MajorTag): boolean {
  const meta = getMajorMeta(major);
  return meta.tags.includes(tag);
}

export function fieldDefaults(field: MajorField | string) {
  if (field === 'Informatika') {
    return { tags: ['Kód', 'Algoritmy', 'Vývoj'] as const };
  }
  if (field === 'Elektrotechnika') {
    return { tags: ['Hardware', 'Obvody', 'Merania'] as const };
  }
  return { tags: DEFAULT_META.tags };
}

