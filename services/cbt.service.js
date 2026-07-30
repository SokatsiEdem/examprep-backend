import prisma from "../config/prisma.js";

/**
 * Start a new CBT exam
 */
export const startExam = async (userId, payload) => {
  return await prisma.exam.create({
    data: {
      userId,
      subject: payload.subject,
      duration: payload.duration,
      year: payload.year,
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });
};

/**
 * Auto-save an answer
 */
export const saveAnswer = async (userId, examId, payload) => {
  // Ensure exam exists and belongs to the user
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
    },
  });

  if (!exam) {
    throw new Error("Exam not found.");
  }

  return await prisma.examAnswer.upsert({
    where: {
      examId_questionId: {
        examId,
        questionId: payload.questionId,
      },
    },
    update: {
      selectedOption: payload.selectedOption,
    },
    create: {
      examId,
      questionId: payload.questionId,
      selectedOption: payload.selectedOption,
    },
  });
};

/**
 * Submit exam
 */
export const submitExam = async (userId, examId, answers) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
    },
  });

  if (!exam) {
    throw new Error("Exam not found.");
  }

  if (exam.status === "COMPLETED") {
    throw new Error("Exam has already been submitted.");
  }

  // Save answers
  for (const answer of answers) {
    await prisma.examAnswer.upsert({
      where: {
        examId_questionId: {
          examId,
          questionId: answer.questionId,
        },
      },
      update: {
        selectedOption: answer.selectedOption,
      },
      create: {
        examId,
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
      },
    });
  }

  // TODO: Calculate score
  const score = 0;

  await prisma.exam.update({
    where: {
      id: examId,
    },
    data: {
      status: "COMPLETED",
      score,
      submittedAt: new Date(),
    },
  });

  return {
    examId,
    score,
    totalQuestions: answers.length,
  };
};

/**
 * Get a single exam session
 */
export const getExam = async (userId, examId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
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

  if (!exam) {
    throw new Error("Exam not found.");
  }

  return exam;
};

/**
 * Get exam history
 */
export const getExamHistory = async (userId) => {
  return await prisma.exam.findMany({
    where: {
      userId,
    },
    orderBy: {
      startedAt: "desc",
    },
    select: {
      id: true,
      subject: true,
      year: true,
      score: true,
      status: true,
      duration: true,
      startedAt: true,
      submittedAt: true,
    },
  });
};

/**
 * Get exam result
 */
export const getExamResult = async (userId, examId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
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

  if (!exam) {
    throw new Error("Exam not found.");
  }

  if (exam.status !== "COMPLETED") {
    throw new Error("Exam has not been submitted yet.");
  }

  return exam;
};

/**
 * Review completed exam
 */
export const reviewExam = async (userId, examId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
      status: "COMPLETED",
    },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!exam) {
    throw new Error("Completed exam not found.");
  }

  return exam;
};