import prisma from "../config/prisma.js";

/**
 * Fetch all questions with pagination and filters
 */
export const fetchQuestions = async ({
  subject,
  year,
  page = 1,
  limit = 20,
}) => {
  const where = {};

  if (subject) where.subject = subject;
  if (year) where.year = Number(year);

  const skip = (Number(page) - 1) * Number(limit);

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.question.count({ where }),
  ]);

  return {
    questions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Search questions
 */
export const searchQuestions = async (searchTerm) => {
  return await prisma.question.findMany({
    where: {
      questionText: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    take: 30,
  });
};

/**
 * Get question by ID
 */
export const getQuestionById = async (id) => {
  return await prisma.question.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Create a new question
 */
export const createQuestion = async (data) => {
  return await prisma.question.create({
    data,
  });
};

/**
 * Update question
 */
export const updateQuestion = async (id, data) => {
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  return await prisma.question.update({
    where: { id },
    data,
  });
};

/**
 * Delete question
 */
export const deleteQuestion = async (id) => {
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  return await prisma.question.delete({
    where: { id },
  });
};