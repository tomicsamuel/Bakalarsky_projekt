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
  console.log('Seedovanie...');
  
  await prisma.program.deleteMany({});

  for (const program of PROGRAMS) {
    await prisma.program.create({ data: program });
    console.log(`OK: ${program.name}`);
  }

  console.log('Hotovo!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

