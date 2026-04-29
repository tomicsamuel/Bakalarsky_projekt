import type { Major, ScoreResult } from './types';

export const MAJORS: Major[] = [
  { name: 'Aplikovaná elektrotechnika', field: 'Elektrotechnika' },
  { name: 'Automobilová elektronika', field: 'Elektrotechnika' },
  { name: 'Elektroenergetika', field: 'Elektrotechnika' },
  { name: 'Fyzikálne inžinierstvo progresívnych materiálov', field: 'Elektrotechnika' },
  { name: 'Priemyselná elektrotechnika', field: 'Elektrotechnika' },
  { name: 'Informatika', field: 'Informatika' },
  { name: 'Kyberbezpečnosť', field: 'Informatika' },
  { name: 'Počítačové modelovanie', field: 'Informatika' },
  { name: 'Počítačové siete', field: 'Informatika' },
  { name: 'Umelá inteligencia', field: 'Informatika' },
  { name: 'Aplikovaná informatika', field: 'Informatika' },
];

function initScores(): ScoreResult[] {
  return MAJORS.map((m) => ({ ...m, score: 0, rawScore: 0 }));
}

/**
 * Calculates match scores for all majors (sorted desc).
 *
 * Important: Returns ALL majors (not sliced to top5).
 * UI is free to slice top N.
 */
export function calculateScores(school: string, interests: string[], experience: string[]): ScoreResult[] {
  const programs = initScores();

  const add = (predicate: (p: ScoreResult) => boolean, points: number) => {
    programs.forEach((p) => {
      if (predicate(p)) {
        p.rawScore = (p.rawScore ?? 0) + points;
      }
    });
  };

  interests.forEach((interest) => {
    switch (interest) {
      case 'Web programovanie':
      case 'Frontend programovanie':
      case 'Aplikačné programovanie':
      case 'Desktop aplikácie':
      case 'Mobilné aplikácie':
        add((p) => p.name === 'Informatika', 4);
        add((p) => p.name !== 'Informatika' && p.field === 'Informatika', 2);
        break;

      case 'Herné programovanie':
        add((p) => p.name === 'Informatika' || p.name === 'Počítačové modelovanie', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika' && p.name !== 'Počítačové modelovanie', 1);
        break;

      case 'Backend programovanie':
      case 'Full-stack programovanie':
        add((p) => p.name === 'Informatika', 5);
        add((p) => p.name !== 'Informatika' && p.field === 'Informatika', 2);
        break;

      case 'Siete a sieťové technológie':
      case 'Systémová administrácia':
      case 'WiFi a bezdrôtové siete':
        add((p) => p.name === 'Počítačové siete', 5);
        add((p) => p.name === 'Kyberbezpečnosť', 2);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové siete' && p.name !== 'Kyberbezpečnosť', 1);
        break;

      case 'Bezpečnosť sietí':
      case 'Sieťová bezpečnosť':
        add((p) => p.name === 'Počítačové siete' || p.name === 'Kyberbezpečnosť', 5);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové siete' && p.name !== 'Kyberbezpečnosť', 1);
        break;

      case 'Cloud computing':
      case 'Virtualizácia':
        add((p) => p.name === 'Počítačové siete' || p.name === 'Informatika', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové siete' && p.name !== 'Informatika', 2);
        break;

      case 'Databázy':
      case 'SQL':
      case 'NoSQL databázy':
        add((p) => p.name === 'Informatika' || p.name === 'Počítačové modelovanie', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika' && p.name !== 'Počítačové modelovanie', 2);
        break;

      case 'Big Data':
      case 'Data mining':
        add((p) => p.name === 'Počítačové modelovanie', 5);
        add((p) => p.name === 'Informatika', 3);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové modelovanie' && p.name !== 'Informatika', 1);
        break;

      case 'Data Science':
      case 'Data Analytics':
        add((p) => p.name === 'Počítačové modelovanie' || p.name === 'Umelá inteligencia', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové modelovanie' && p.name !== 'Umelá inteligencia', 2);
        break;

      case 'AI/ML':
      case 'Strojové učenie':
      case 'Hlboké učenie':
      case 'Neurónové siete':
        add((p) => p.name === 'Umelá inteligencia', 5);
        add((p) => p.name === 'Počítačové modelovanie', 3);
        add((p) => p.field === 'Informatika' && p.name !== 'Umelá inteligencia' && p.name !== 'Počítačové modelovanie', 2);
        break;

      case 'Spracovanie prirodzeného jazyka':
      case 'Počítačové videnie':
        add((p) => p.name === 'Umelá inteligencia', 5);
        add((p) => p.name === 'Počítačové modelovanie', 3);
        add((p) => p.field === 'Informatika' && p.name !== 'Umelá inteligencia' && p.name !== 'Počítačové modelovanie', 1);
        break;

      case 'Robotika a AI':
        add((p) => p.name === 'Umelá inteligencia', 4);
        add((p) => p.name === 'Aplikovaná elektrotechnika' || p.name === 'Priemyselná elektrotechnika', 3);
        add((p) => p.field === 'Informatika' || p.field === 'Elektrotechnika', 1);
        break;

      case 'Kyberbezpečnosť':
      case 'Ethical hacking':
      case 'Penetračné testovanie':
      case 'Kryptografia':
      case 'Informačná bezpečnosť':
      case 'Digitálna forenzika':
        add((p) => p.name === 'Kyberbezpečnosť', 5);
        add((p) => p.name === 'Počítačové siete', 2);
        add((p) => p.field === 'Informatika' && p.name !== 'Kyberbezpečnosť' && p.name !== 'Počítačové siete', 1);
        break;

      case 'Elektronika':
      case 'Mikroprocesory':
      case 'Mikrokontroléry':
      case 'Arduino/Raspberry Pi':
      case 'Digitálna elektronika':
      case 'Analógová elektronika':
      case 'Elektronické obvody':
        add(
          (p) =>
            p.name === 'Aplikovaná elektrotechnika' ||
            p.name === 'Automobilová elektronika' ||
            p.name === 'Priemyselná elektrotechnika',
          4
        );
        add(
          (p) =>
            p.field === 'Elektrotechnika' &&
            p.name !== 'Aplikovaná elektrotechnika' &&
            p.name !== 'Automobilová elektronika' &&
            p.name !== 'Priemyselná elektrotechnika',
          2
        );
        break;

      case 'Robotika':
        add((p) => p.name === 'Aplikovaná elektrotechnika' || p.name === 'Priemyselná elektrotechnika', 4);
        add((p) => p.name === 'Umelá inteligencia', 3);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Aplikovaná elektrotechnika' && p.name !== 'Priemyselná elektrotechnika', 2);
        break;

      case 'Automatizácia':
      case 'PLC programovanie':
      case 'SCADA systémy':
      case 'Priemyselná automatizácia':
      case 'Riadiace systémy':
        add((p) => p.name === 'Priemyselná elektrotechnika' || p.name === 'Aplikovaná elektrotechnika', 5);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Priemyselná elektrotechnika' && p.name !== 'Aplikovaná elektrotechnika', 2);
        break;

      case 'Energetika':
      case 'Obnoviteľné zdroje':
      case 'Solárna energia':
      case 'Veterná energia':
      case 'Energetická efektívnosť':
      case 'Smart grid':
      case 'Elektrické stroje':
        add((p) => p.name === 'Elektroenergetika', 5);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Elektroenergetika', 2);
        break;

      case 'Fyzika':
      case 'Materiálové inžinierstvo':
      case 'Nanotechnológie':
      case 'Kvantová fyzika':
      case 'Optika':
      case 'Magnetizmus':
        add((p) => p.name === 'Fyzikálne inžinierstvo progresívnych materiálov', 5);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Fyzikálne inžinierstvo progresívnych materiálov', 1);
        break;

      case 'PC':
        add((p) => p.field === 'Informatika', 1);
        break;

      case 'Lietadlá':
      case 'Automobilový priemysel':
        add((p) => p.name === 'Automobilová elektronika', 3);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Automobilová elektronika', 1);
        break;

      case 'Administratíva':
      case 'Projektový manažment':
        add((p) => p.name === 'Informatika', 2);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika', 1);
        break;

      case 'Grafika a dizajn':
        add((p) => p.name === 'Informatika' || p.name === 'Počítačové modelovanie', 2);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika' && p.name !== 'Počítačové modelovanie', 1);
        break;
    }
  });

  switch (school) {
    case 'Gymnázium':
    case 'Bilingválne gymnázium':
    case 'Osemročné gymnázium':
    case 'Športové gymnázium / športová škola':
      add(() => true, 1);
      add((p) => p.name === 'Počítačové modelovanie' || p.name === 'Umelá inteligencia', 1);
      break;

    case 'SPŠ informačných technológií':
    case 'SOŠ informačných technológií':
      add((p) => p.field === 'Informatika', 3);
      add((p) => p.name === 'Informatika' || p.name === 'Aplikovaná informatika', 2);
      add((p) => p.name === 'Počítačové siete' || p.name === 'Kyberbezpečnosť', 1);
      break;

    case 'SPŠ elektrotechnická':
    case 'SOŠ elektrotechnická':
      add((p) => p.field === 'Elektrotechnika', 3);
      add(
        (p) =>
          p.name === 'Aplikovaná elektrotechnika' ||
          p.name === 'Priemyselná elektrotechnika' ||
          p.name === 'Automobilová elektronika',
        1
      );
      break;

    case 'Stredná priemyselná škola (SPŠ)':
    case 'SOŠ technická':
      add((p) => p.field === 'Elektrotechnika', 2);
      add((p) => p.field === 'Informatika', 1);
      break;

    case 'SPŠ strojnícka':
    case 'SOŠ strojnícka':
    case 'SOŠ automobilová':
      add((p) => p.name === 'Automobilová elektronika' || p.name === 'Priemyselná elektrotechnika', 3);
      add((p) => p.name === 'Aplikovaná elektrotechnika', 2);
      add((p) => p.field === 'Elektrotechnika', 1);
      break;

    case 'SPŠ dopravná':
    case 'SOŠ dopravná':
      add((p) => p.name === 'Automobilová elektronika', 3);
      add((p) => p.name === 'Priemyselná elektrotechnika' || p.name === 'Aplikovaná elektrotechnika', 2);
      add((p) => p.field === 'Elektrotechnika', 1);
      break;

    case 'SPŠ stavebná':
    case 'SOŠ stavebná':
      add((p) => p.name === 'Fyzikálne inžinierstvo progresívnych materiálov', 3);
      add((p) => p.name === 'Počítačové modelovanie', 2);
      add((p) => p.field === 'Elektrotechnika', 1);
      break;

    case 'SOŠ ekonomická':
    case 'Obchodná akadémia':
      add((p) => p.name === 'Aplikovaná informatika' || p.name === 'Informatika', 3);
      add((p) => p.name === 'Počítačové modelovanie', 2);
      add((p) => p.field === 'Informatika', 1);
      break;

    case 'Hotelová akadémia':
    case 'SOŠ obchodu a služieb':
      add((p) => p.name === 'Aplikovaná informatika' || p.name === 'Informatika', 2);
      add((p) => p.field === 'Informatika', 1);
      break;

    case 'Stredná zdravotnícka škola':
    case 'Pedagogická a sociálna akadémia':
      add((p) => p.name === 'Aplikovaná informatika' || p.name === 'Informatika', 1);
      add((p) => p.name === 'Umelá inteligencia' || p.name === 'Počítačové modelovanie', 1);
      break;

    case 'Konzervatórium':
    case 'Škola umeleckého priemyslu':
      add((p) => p.name === 'Informatika' || p.name === 'Aplikovaná informatika', 2);
      add((p) => p.name === 'Počítačové modelovanie' || p.name === 'Umelá inteligencia', 1);
      break;

    case 'Súkromná stredná škola':
    case 'Cirkevná stredná škola':
    case 'Zahraničná stredná škola':
    case 'Iná stredná škola':
      add(() => true, 1);
      break;
  }

  experience.forEach((exp) => {
    switch (exp) {
      case 'IT support':
        add(
          (p) => p.name === 'Informatika' || p.name === 'Kyberbezpečnosť' || p.name === 'Počítačové siete',
          3
        );
        add(
          (p) => p.field === 'Informatika' && p.name !== 'Informatika' && p.name !== 'Kyberbezpečnosť' && p.name !== 'Počítačové siete',
          1
        );
        break;

      case 'Web programovanie':
      case 'Frontend vývoj':
      case 'Aplikačné programovanie':
      case 'Mobilné aplikácie':
      case 'Desktop aplikácie':
        add((p) => p.name === 'Informatika', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika', 2);
        break;

      case 'Backend vývoj':
      case 'Full-stack vývoj':
        add((p) => p.name === 'Informatika', 5);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika', 2);
        break;

      case 'Herný vývoj':
        add((p) => p.name === 'Informatika' || p.name === 'Počítačové modelovanie', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika' && p.name !== 'Počítačové modelovanie', 1);
        break;

      case 'Siete a administrácia':
      case 'Systémová administrácia':
      case 'Server administrácia':
        add((p) => p.name === 'Počítačové siete', 5);
        add((p) => p.name === 'Kyberbezpečnosť', 3);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové siete' && p.name !== 'Kyberbezpečnosť', 1);
        break;

      case 'Cloud administrácia':
        add((p) => p.name === 'Počítačové siete' || p.name === 'Informatika', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové siete' && p.name !== 'Informatika', 2);
        break;

      case 'Sieťová bezpečnosť':
        add((p) => p.name === 'Počítačové siete' || p.name === 'Kyberbezpečnosť', 5);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové siete' && p.name !== 'Kyberbezpečnosť', 1);
        break;

      case 'Databázy':
      case 'Database administrácia':
        add((p) => p.name === 'Informatika' || p.name === 'Počítačové modelovanie', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika' && p.name !== 'Počítačové modelovanie', 2);
        break;

      case 'Data Science':
      case 'Data Analytics':
      case 'Big Data':
        add((p) => p.name === 'Počítačové modelovanie' || p.name === 'Umelá inteligencia', 4);
        add((p) => p.field === 'Informatika' && p.name !== 'Počítačové modelovanie' && p.name !== 'Umelá inteligencia', 2);
        break;

      case 'Kyberbezpečnosť':
      case 'Penetračné testovanie':
      case 'Security analýza':
      case 'Incident response':
        add((p) => p.name === 'Kyberbezpečnosť', 5);
        add((p) => p.name === 'Počítačové siete', 2);
        add((p) => p.field === 'Informatika' && p.name !== 'Kyberbezpečnosť' && p.name !== 'Počítačové siete', 1);
        break;

      case 'Servis elektroniky':
      case 'Opravy elektroniky':
      case 'Montáž elektroniky':
      case 'Elektrické merania':
        add(
          (p) =>
            p.name === 'Aplikovaná elektrotechnika' ||
            p.name === 'Automobilová elektronika' ||
            p.name === 'Priemyselná elektrotechnika',
          4
        );
        add(
          (p) =>
            p.field === 'Elektrotechnika' &&
            p.name !== 'Aplikovaná elektrotechnika' &&
            p.name !== 'Automobilová elektronika' &&
            p.name !== 'Priemyselná elektrotechnika',
          2
        );
        break;

      case 'Elektroinštalácie':
      case 'Elektrické inštalácie':
        add((p) => p.name === 'Elektroenergetika' || p.name === 'Priemyselná elektrotechnika', 4);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Elektroenergetika' && p.name !== 'Priemyselná elektrotechnika', 2);
        break;

      case 'Automatizácia':
      case 'PLC programovanie':
      case 'SCADA systémy':
      case 'Priemyselná automatizácia':
      case 'Robotika':
        add((p) => p.name === 'Priemyselná elektrotechnika' || p.name === 'Aplikovaná elektrotechnika', 5);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Priemyselná elektrotechnika' && p.name !== 'Aplikovaná elektrotechnika', 2);
        break;

      case 'Energetika':
      case 'Elektrické rozvodne':
      case 'Energetické audity':
      case 'Obnoviteľné zdroje':
        add((p) => p.name === 'Elektroenergetika', 5);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Elektroenergetika', 2);
        break;

      case 'Auto servis':
        add((p) => p.name === 'Automobilová elektronika', 4);
        add((p) => p.field === 'Elektrotechnika' && p.name !== 'Automobilová elektronika', 1);
        break;

      case 'Administratíva':
      case 'Projektový manažment':
      case 'Technická dokumentácia':
        add((p) => p.name === 'Informatika', 2);
        add((p) => p.field === 'Informatika' && p.name !== 'Informatika', 1);
        break;
    }
  });

  const maxRaw = Math.max(...programs.map((p) => p.rawScore ?? 0), 1);
  programs.forEach((p) => {
    const raw = p.rawScore ?? 0;
    p.score = Math.round((raw / maxRaw) * 100);
  });

  return programs.sort((a, b) => b.score - a.score);
}

