import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const subjects = [
  {
    name: "English Language",
    code: "ENG",
    description: "English Language",
  },
  {
    name: "Mathematics",
    code: "MTH",
    description: "Mathematics",
  },
  {
    name: "Physics",
    code: "PHY",
    description: "Physics",
  },
  {
    name: "Chemistry",
    code: "CHM",
    description: "Chemistry",
  },
  {
    name: "Biology",
    code: "BIO",
    description: "Biology",
  },
  {
    name: "Economics",
    code: "ECO",
    description: "Economics",
  },
  {
    name: "Government",
    code: "GOV",
    description: "Government",
  },
  {
    name: "Literature in English",
    code: "LIT",
    description: "Literature in English",
  },
  {
    name: "Commerce",
    code: "COM",
    description: "Commerce",
  },
  {
    name: "Geography",
    code: "GEO",
    description: "Geography",
  },
  {
    name: "Agricultural Science",
    code: "AGR",
    description: "Agricultural Science",
  },
  {
    name: "Further Mathematics",
    code: "FMTH",
    description: "Further Mathematics",
  },
  {
    name: "Computer Studies",
    code: "CST",
    description: "Computer Studies",
  },
  {
    name: "Civic Education",
    code: "CVE",
    description: "Civic Education",
  },
  {
    name: "Christian Religious Studies",
    code: "CRS",
    description: "Christian Religious Studies",
  },
  {
    name: "Islamic Religious Studies",
    code: "IRS",
    description: "Islamic Religious Studies",
  },
];

async function main() {
  console.log("🌱 Seeding subjects...");

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: {
        name: subject.name,
      },
      update: {},
      create: subject,
    });
  }

  console.log("✅ Subjects seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });