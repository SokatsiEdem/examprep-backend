const prisma = require("../config/prisma");

const createBookmark = async (userId, questionId) => {
  // Check if the question exists
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  // Check if bookmark already exists
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
  });

  if (existingBookmark) {
    throw new Error("Question is already bookmarked.");
  }

  // Create bookmark
  return prisma.bookmark.create({
    data: {
      userId,
      questionId,
    },
  });
};

module.exports = {
  createBookmark,
};