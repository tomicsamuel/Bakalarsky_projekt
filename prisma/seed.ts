// Seed súbor – naplní databázu počiatočnými dátami
// Spustí sa príkazom: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

// Všetky študijné programy FEI TUKE
const PROGRAMS = [
  // Elektrotechnické programy
  { name: 'Aplikovaná elektrotechnika', field: 'Elektrotechnika' },
  { name: 'Automobilová elektronika', field: 'Elektrotechnika' },
  { name: 'Elektroenergetika', field: 'Elektrotechnika' },
  { name: 'Fyzikálne inžinierstvo progresívnych materiálov', field: 'Elektrotechnika' },
  { name: 'Priemyselná elektrotechnika', field: 'Elektrotechnika' },
  
  // Informatické programy
  { name: 'Hospodárska informatika', field: 'Informatika' },
  { name: 'Informatika', field: 'Informatika' },
  { name: 'Inteligentné systémy', field: 'Informatika' },
  { name: 'Kyberbezpečnosť', field: 'Informatika' },
  { name: 'Počítačové modelovanie', field: 'Informatika' },
  { name: 'Počítačové siete', field: 'Informatika' },
  { name: 'Aplikovaná informatika', field: 'Informatika' },
];

async function main() {
  console.log('Začínam seedovanie databázy...');

  // Vymažeme staré programy (voliteľné)
  await prisma.program.deleteMany({});
  console.log('Vymazané staré programy');

  // Vytvoríme všetky programy
  for (const program of PROGRAMS) {
    await prisma.program.create({
      data: program,
    });
    console.log(`Vytvorený: ${program.name} (${program.field})`);
  }

  console.log('Seedovanie dokončené!');
}

// Spustíme main funkciu
main()
  .catch((e) => {
    console.error('Chyba pri seedovaní:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

