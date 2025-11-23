import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROGRAMS = [
  { name: 'Aplikovaná elektrotechnika', field: 'Elektrotechnika' },
  { name: 'Automobilová elektronika', field: 'Elektrotechnika' },
  { name: 'Elektroenergetika', field: 'Elektrotechnika' },
  { name: 'Fyzikálne inžinierstvo progresívnych materiálov', field: 'Elektrotechnika' },
  { name: 'Priemyselná elektrotechnika', field: 'Elektrotechnika' },
  { name: 'Hospodárska informatika', field: 'Informatika' },
  { name: 'Informatika', field: 'Informatika' },
  { name: 'Inteligentné systémy', field: 'Informatika' },
  { name: 'Kyberbezpečnosť', field: 'Informatika' },
  { name: 'Počítačové modelovanie', field: 'Informatika' },
  { name: 'Počítačové siete', field: 'Informatika' },
  { name: 'Aplikovaná informatika', field: 'Informatika' },
];

async function main() {
  console.log('Zacinam seedovanie databazy...');

  await prisma.program.deleteMany({});
  console.log('Vymazane stare programy');

  for (const program of PROGRAMS) {
    await prisma.program.create({
      data: program,
    });
    console.log(`Vytvoreny: ${program.name} (${program.field})`);
  }

  console.log('Seedovanie dokoncene!');
}

main()
  .catch((e) => {
    console.error('Chyba pri seedovani:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

