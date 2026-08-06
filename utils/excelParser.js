import XLSX from "xlsx";
import prisma from "../config/prisma.js";

export const parseOptions = (text) => {
  if (!text) {
    return {
      A: "",
      B: "",
      C: "",
      D: "",
    };
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    A: lines[0]?.replace(/^A[).\s-]*/, "") || "",
    B: lines[1]?.replace(/^B[).\s-]*/, "") || "",
    C: lines[2]?.replace(/^C[).\s-]*/, "") || "",
    D: lines[3]?.replace(/^D[).\s-]*/, "") || "",
  };
};

export const parseExcel = async (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const questions = [];

  // Map worksheet names to database subject names
  const subjectMap = {
    ENGLISH: "English Language",
    GOVERNMENT: "Government",
    CHEMISTRY: "Chemistry",
    COMMERCE: "Commerce",
    "COMPUTER STUDIES": "Computer Studies",
  };

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    const subjectName = (subjectMap[sheetName] || sheetName).trim();

    console.log(`Looking for subject: '${subjectName}'`);

    const subject = await prisma.subject.findUnique({
      where: {
        name: subjectName,
      },
    });

    if (!subject) {
      throw new Error(
        `Subject '${subjectName}' does not exist in the database.`
      );
    }

    for (const row of rows) {
      questions.push({
        subjectId: subject.id,
        questionText: row.Question,
        options: parseOptions(row.Options),
        correctOption: row["Correct Option"],
        explanation: row.Explanation || "",
        tip: row.Tip || "",
        examType: "JAMB",
      });
    }
  }

  return questions;
};