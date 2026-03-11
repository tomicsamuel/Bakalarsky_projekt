import { calculateScores } from './scoring';

type Case = {
  name: string;
  input: { school: string; interests: string[]; experience: string[] };
  expectTop1?: string;
  expectIncludes?: string[];
};

const cases: Case[] = [
  {
    name: 'AI focus should push "Umelá inteligencia" high',
    input: {
      school: 'SOŠ informačných technológií',
      interests: ['AI/ML', 'Strojové učenie', 'Neurónové siete', 'Data Science'],
      experience: ['Data Science'],
    },
    expectTop1: 'Umelá inteligencia',
    expectIncludes: ['Počítačové modelovanie', 'Informatika'],
  },
  {
    name: 'Networks should push "Počítačové siete" #1',
    input: {
      school: 'SOŠ informačných technológií',
      interests: ['Siete a sieťové technológie', 'WiFi a bezdrôtové siete'],
      experience: ['Siete a administrácia', 'Server administrácia'],
    },
    expectTop1: 'Počítačové siete',
    expectIncludes: ['Kyberbezpečnosť', 'Informatika'],
  },
  {
    name: 'Energy should push "Elektroenergetika" #1',
    input: {
      school: 'SOŠ elektrotechnická',
      interests: ['Energetika', 'Obnoviteľné zdroje', 'Smart grid'],
      experience: ['Energetika', 'Elektrické rozvodne'],
    },
    expectTop1: 'Elektroenergetika',
    expectIncludes: ['Aplikovaná elektrotechnika', 'Priemyselná elektrotechnika'],
  },
];

function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function runScoringTestcases() {
  const failures: string[] = [];

  for (const tc of cases) {
    try {
      const out = calculateScores(tc.input.school, tc.input.interests, tc.input.experience);
      assert(out.length === 10, `${tc.name}: expected 10 results, got ${out.length}`);
      assert(out[0], `${tc.name}: missing top1 result`);

      if (tc.expectTop1) {
        assert(out[0].name === tc.expectTop1, `${tc.name}: expected top1 "${tc.expectTop1}", got "${out[0].name}"`);
      }

      if (tc.expectIncludes) {
        const names = new Set(out.map((r) => r.name));
        for (const expected of tc.expectIncludes) {
          assert(names.has(expected), `${tc.name}: expected output to include "${expected}"`);
        }
      }
    } catch (e: any) {
      failures.push(`${tc.name}: ${e?.message ?? String(e)}`);
    }
  }

  if (failures.length) {
    const msg = `Scoring testcases failed:\n- ${failures.join('\n- ')}`;
    // eslint-disable-next-line no-console
    console.error(msg);
    throw new Error(msg);
  }

  // eslint-disable-next-line no-console
  console.log(`Scoring testcases passed (${cases.length})`);
}

// Manual run helper:
// In Node:
//   node -e "import('./lib/scoring.testcases.ts').then(m => m.runScoringTestcases())"

