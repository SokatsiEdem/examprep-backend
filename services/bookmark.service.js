import prisma from "../config/prisma.js";

/**
 * Create a bookmark
 */
export const createBookmark = async (userId, questionId) => {
  // Check if question exists
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error("Question not found.");
  }

  // Check if already bookmarked
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

  return await prisma.bookmark.create({
    data: {
      userId,
      questionId,
    },
  });
};

/**
 * Get all bookmarks for a user
 */
export const getBookmarks = async (userId) => {
  return await prisma.bookmark.findMany({
    where: { userId },
    include: {
      question: true, // Include question details
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Delete bookmark by bookmark ID
 */
export const deleteBookmark = async (userId, bookmarkId) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  });

  if (!bookmark) {
    throw new Error("Bookmark not found.");
  }

  await prisma.bookmark.delete({
    where: {
      id: bookmarkId,
    },
  });

  return true;
};

/**
 * Delete bookmark by question ID
 */
export const deleteBookmarkByQuestion = async (userId, questionId) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
  });

  if (!bookmark) {
    throw new Error("Bookmark not found.");
  }

  await prisma.bookmark.delete({
    where: {
      id: bookmark.id,
    },
  });

  return true;
};