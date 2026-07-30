import prisma from "../config/prisma.js";

/**
 * Create a new practice session
 */
export const createPracticeSession = async (userId, payload) => {
  return await prisma.practiceSession.create({
    data: {
      userId,
      durationMinutes: payload.durationMinutes,
      year: payload.year,
      status: "IN_PROGRESS",
    },
  });
};

/**
 * Submit a practice session
 */
export const submitPracticeAnswers = async (
  userId,
  sessionId,
  answers
) => {
  // Check session
  const session = await prisma.practiceSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error("Practice session not found.");
  }

  // Prevent multiple submissions
  if (session.status === "COMPLETED") {
    throw new Error("Practice session has already been submitted.");
  }

  // Save answers
  for (const answer of answers) {
    await prisma.practiceAnswer.create({
      data: {
        practiceSessionId: sessionId,
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
      },
    });
  }

  // TODO: Calculate score
  const score = 0;

  // Update session
  await prisma.practiceSession.update({
    where: {
      id: sessionId,
    },
    data: {
      status: "COMPLETED",
      score,
      completedAt: new Date(),
    },
  });

  return {
    sessionId,
    score,
    totalQuestions: answers.length,
  };
};

/**
 * Get user's practice history
 */
export const getPracticeHistory = async (userId) => {
  return await prisma.practiceSession.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      score: true,
      status: true,
      durationMinutes: true,
      year: true,
      createdAt: true,
      completedAt: true,
    },
  });
};

/**
 * Get a single practice session
 */
export const getPracticeById = async (
  userId,
  sessionId
) => {
  const session = await prisma.practiceSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error("Practice session not found.");
  }

  return session;
};