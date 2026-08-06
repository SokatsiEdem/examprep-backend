import prisma from "../config/prisma.js";
import { parseExcel } from "../utils/excelParser.js";

async function importQuestions() {
  try {
    console.log("================================");
    console.log("Reading Excel file...");

    const questions = await parseExcel("./data/questions.xlsx");

    console.log(`Found ${questions.length} questions`);

    const validQuestions = [];
    const errors = [];

    questions.forEach((question, index) => {
      const validOptions = ["A", "B", "C", "D"];

      if (
        !question.questionText ||
        !question.options?.A ||
        !question.options?.B ||
        !question.options?.C ||
        !question.options?.D ||
        !question.correctOption
      ) {
        errors.push({
          row: index + 2,
          reason: "Missing required fields",
        });

        return;
      }

      // Validate correct option
      const correctOption = question.correctOption
        .toString()
        .trim()
        .toUpperCase();

      if (!validOptions.includes(correctOption)) {
        errors.push({
          row: index + 2,
          reason: `Invalid correct option '${question.correctOption}'. Must be A, B, C or D.`,
        });

        return;
      }

      // Normalize before saving
      question.correctOption = correctOption;

      validQuestions.push(question);
    });

    const existingQuestions = await prisma.question.findMany({
      where: {
        questionText: {
          in: validQuestions.map((q) => q.questionText),
        },
      },
      select: {
        questionText: true,
      },
    });

    const existingSet = new Set(
      existingQuestions.map((q) => q.questionText)
    );

    const newQuestions = validQuestions.filter(
      (q) => !existingSet.has(q.questionText)
    );

    if (newQuestions.length > 0) {
      await prisma.question.createMany({
        data: newQuestions,
        skipDuplicates: true,
      });
    }

    console.log("================================");
    console.log(`Imported: ${newQuestions.length}`);
    console.log(`Duplicates: ${existingQuestions.length}`);
    console.log(`Failed: ${errors.length}`);

    if (errors.length) {
      console.table(errors);
    }

    console.log("Import completed successfully.");
  } catch (error) {
    console.error("================================");
    console.error("Import failed!");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importQuestions();