import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedConsultants() {
  const hash = bcryptjs.hashSync('123456', 10);
  const consultantsData = Array.from({ length: 10 }).map((_, i) => ({
    full_name: `Consultant ${i + 1}`,
    email: `consultant${i + 1}@email.com`,
    phone: `+1234567890${i}`,
    profile_image: `https://randomuser.me/api/portraits/men/${i + 10}.jpg`,
    password: hash,
    timezone: 'UTC',
    is_active: i % 2 === 0, // Alternate true/false
    is_mocktest: i % 3 === 0,
    is_conversation: i % 4 === 0,
    is_verified: i % 2 === 0,
    is_test_user: true,
    bio: `Experienced consultant in domain ${i + 1}.`,
    experience: 2 + i, // Years of experience
    skills: ['JavaScript', 'Python', 'SQL', 'React'][i % 4],
    hourly_rate: 50 + i * 5,
    available_times: {
      days: ['Monday', 'Wednesday', 'Friday'],
      start: '09:00',
      end: '17:00',
    },
  }));

  await prisma.consultant.createMany({
    data: consultantsData,
    skipDuplicates: true, // In case of reruns
  });

  console.log('✅ Seeded 10 consultants');
}
