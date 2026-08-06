import XLSX from "xlsx";
import prisma from "../config/prisma.js";

export const importQuestions = async (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const exists = await prisma.question.findFirst({
  where: {
    questionText: row.questionText,
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
  }

  return {
    success: true,
    imported,
    skipped,
  };
};