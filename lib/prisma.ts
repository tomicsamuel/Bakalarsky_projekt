// Prisma klient – singleton pattern
// Zabezpečuje, že sa v aplikácii používa len jedna inštancia Prisma klienta

import { PrismaClient } from '@prisma/client';

// Globálna premenná pre Prisma klienta (aby sme ho nemuseli vytvárať stále dookola)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ak už existuje Prisma klient, použi ho. Inak vytvor nový.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// V development režime si Prisma klienta uložíme do globálnej premennej
// (kvôli hot-reload – aby sa nevytváralo príliš veľa pripojení)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

