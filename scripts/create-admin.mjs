import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'samuel.tomic03@gmail.com';
const ADMIN_PASSWORD = 'admin1';
const ADMIN_NAME = 'Admin';

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const account = await prisma.account.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true,
    },
    update: {
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('Admin účet vytvorený / aktualizovaný:');
  console.log('  Email:', account.email);
  console.log('  isAdmin:', account.isAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
