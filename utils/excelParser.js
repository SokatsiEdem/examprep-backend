import XLSX from "xlsx";

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
    A: lines[0]?.replace(/^A[\).\s-]*/, "") || "",
    B: lines[1]?.replace(/^B[\).\s-]*/, "") || "",
    C: lines[2]?.replace(/^C[\).\s-]*/, "") || "",
    D: lines[3]?.replace(/^D[\).\s-]*/, "") || "",
  };
};

export const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const questions = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet);

    for (const row of rows) {
      questions.push({
        subject: sheetName,
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