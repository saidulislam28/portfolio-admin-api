import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedUsers() {
  const hash = bcryptjs.hashSync('123456', 10);
  const consultantsData = Array.from({ length: 10 }).map((_, i) => ({
    full_name: `User ${i + 1}`,
    email: `user${i + 1}@email.com`,
    phone: `+1234567890${i}`,
    profile_image: `https://randomuser.me/api/portraits/men/${i + 10}.jpg`,
    password: hash,
    timezone: 'UTC',
    is_active: i % 2 === 0,
    is_verified: i % 2 === 0,
  }));

  await prisma.user.createMany({
    data: consultantsData,
    skipDuplicates: true, // In case of reruns
  });

  console.log('✅ Seeded 10 users');
}
