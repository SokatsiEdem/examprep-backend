import XLSX from "xlsx";
import prisma from "../config/prisma.js";

const workbook = XLSX.readFile("./data/question.xlsx");

const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet);

async function importQuestions() {
  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    try {
      const exists = await prisma.question.findFirst({
        where: {
          questionText: row.questionText,
          year: Number(row.year),
        },
      });

      if (exists) {
        skipped++;
        continue;
      }

      await prisma.question.create({
        data: {
          examType: row.examType,
          subject: row.subject,
          topic: row.topic,
          year: Number(row.year),
          questionText: row.questionText,

          questionImage: row.questionImage || null,

          options: {
            A: row.optionA,
            B: row.optionB,
            C: row.optionC,
            D: row.optionD,
          },

          correctOption: row.correctOption,

          explanation: row.explanation,

          explanationImage: row.explanationImage || null,
        },
      });

      imported++;
    } catch (err) {
      console.error(err);
    }
  }

  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);

  await prisma.$disconnect();
}

importQuestions();