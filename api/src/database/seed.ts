/* eslint-disable */
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { packageSeed } from './seeds/packageSeed';
import { seedConsultants } from './seeds/consultant';
import { seedUsers } from './seeds/users';
import { seedBooks } from './seeds/books';
import { seedAppointmentsAndOrders } from './seeds/seedAppointmentsAndOrders';
const prisma = new PrismaClient();

async function main() {
  const hash = bcryptjs.hashSync('123456', 10);

  await prisma.adminUser.deleteMany({ where: {} });
  await prisma.adminUser.deleteMany({ where: {} });
  await prisma.adminUser.create({
    data: {
      email: 'admin@email.com',
      first_name: 'Admin',
      last_name: '',
      password: hash,
      role: 'SUPER_ADMIN'
    },
  });
  await prisma.package.createMany({
    data: packageSeed,
    skipDuplicates: true,
  });

  await seedConsultants();
  await seedUsers();
  await seedBooks();
  await seedAppointmentsAndOrders();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
