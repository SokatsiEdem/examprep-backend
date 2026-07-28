// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// 1. Create the Postgres connection pool using the DATABASE_URL from .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Prisma PG adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter into the PrismaClient constructor (Required for Prisma v7)
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding initial questions...');

  await prisma.question.createMany({
    data: [
      {
        examType: 'JAMB',
        subject: 'english',
        topic: 'Grammar',
        year: 2022,
        questionText: 'Choose the option that best completes the sentence: She ____ to school yesterday.',
        options: [
          { optionId: 'A', text: 'go' },
          { optionId: 'B', text: 'went' },
          { optionId: 'C', text: 'gone' },
          { optionId: 'D', text: 'going' },
        ],
        correctOption: 'B',
        explanation: '"Went" is the correct simple past tense of "go".',
      },
      {
        examType: 'JAMB',
        subject: 'mathematics',
        topic: 'Algebra',
        year: 2022,
        questionText: 'Solve for x: 2x + 4 = 10',
        options: [
          { optionId: 'A', text: '2' },
          { optionId: 'B', text: '3' },
          { optionId: 'C', text: '4' },
          { optionId: 'D', text: '5' },
        ],
        correctOption: 'B',
        explanation: '2x = 10 - 4 => 2x = 6 => x = 3.',
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

// Execute the main function without any top-level awaits
main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    // Safely close both the Prisma connection and the pg Pool
    prisma.$disconnect();
    pool.end();
  });