import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBooks() {
  const booksData = [
    {
      title: 'Cambridge IELTS 16 Academic Student\'s Book with Answers',
      description: 'A comprehensive guide for the IELTS Academic test with authentic practice tests.',
      isbn: '9781108933860',
      price: 25,
      writer: 'Cambridge University Press',
      category: 'IELTS',
      image: 'https://ieltsliz.com/wp-content/uploads/2070/03/ielts-trainer-book.jpg',
      is_available: true,
    },
    {
      title: 'The Official Cambridge Guide to IELTS',
      description: 'A definitive guide to the IELTS test, with practice tests and detailed explanations.',
      isbn: '9781107620855',
      price: 35,
      writer: 'Pauline Cullen',
      category: 'IELTS',
      image: 'https://abbeys-product-images.s3.ap-southeast-2.amazonaws.com/original/978/935/681/9789356810501.jpg',
      is_available: true,
    },
    {
      title: 'Vocabulary for IELTS',
      description: 'Focuses on improving vocabulary skills essential for the IELTS test.',
      isbn: '9780521703673',
      price: 18,
      writer: 'Pauline Cullen',
      category: 'IELTS',
      image: 'https://images.unsplash.com/photo-1582210574042-3a54b3585c49?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'Grammar for IELTS',
      description: 'A self-study reference and practice book for the IELTS grammar component.',
      isbn: '9780521616904',
      price: 20,
      writer: 'Diana Hopkins',
      category: 'IELTS',
      image: 'https://images.unsplash.com/photo-1582210574042-3a54b3585c49?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'IELTS Trainer 2 General Training',
      description: 'Six practice tests with easy-to-follow training and exam tips for the IELTS General Training test.',
      isbn: '9781108719877',
      price: 28,
      writer: 'Louise Hashemi',
      category: 'IELTS',
      image: 'https://images.unsplash.com/photo-1629864272186-b48ec789b708?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'IELTS Trainer 2 Academic',
      description: 'Six full practice tests plus easy-to-follow expert guidance and exam tips.',
      isbn: '9781108719860',
      price: 28,
      writer: 'Louise Hashemi',
      category: 'IELTS',
      image: 'https://images.unsplash.com/photo-1584964686001-38294a535697?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'English Collocations in Use',
      description: 'Focuses on improving natural English usage by learning common collocations.',
      isbn: '9780521149460',
      price: 22,
      writer: 'Michael McCarthy',
      category: 'English Learning',
      image: 'https://images.unsplash.com/photo-1586769490333-f54c944122d2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'English Idioms in Use',
      description: 'Helps learners understand and use common idioms in both written and spoken English.',
      isbn: '9780521677684',
      price: 19,
      writer: 'Michael McCarthy',
      category: 'English Learning',
      image: 'https://images.unsplash.com/photo-1549419137-9af962451f04?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'Destination B1: Grammar & Vocabulary',
      description: 'A grammar and vocabulary book designed for intermediate-level English learners.',
      isbn: '9781405081037',
      price: 21,
      writer: 'Malcolm Mann',
      category: 'English Learning',
      image: 'https://images.unsplash.com/photo-1583492576302-393282f6f4d2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
    {
      title: 'Destination B2: Grammar & Vocabulary',
      description: 'Comprehensive resource for grammar and vocabulary for upper-intermediate students.',
      isbn: '9780230006721',
      price: 24,
      writer: 'Malcolm Mann',
      category: 'English Learning',
      image: 'https://images.unsplash.com/photo-1586769490333-f54c944122d2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      is_available: true,
    },
  ];

  try {
    await prisma.book.createMany({
      data: booksData,
      skipDuplicates: true,
    });
    console.log('✅ Seeded 10 books successfully!');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  }
}