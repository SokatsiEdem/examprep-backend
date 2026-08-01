import prisma from "../config/prisma.js";

/**
 * Shuffle an array
 */
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
 * Validate user settings
 */
const getUserSettings = async (userId) => {
  const settings = await prisma.userSetting.findUnique({
    where: {
      userId,
    },
  });

  if (!settings) {
    throw new Error("User settings not found.");
  }

  if (
    !settings.preferredSubjects ||
    settings.preferredSubjects.length === 0
  ) {
    throw new Error(
      "Please select your preferred subjects first."
    );
  }

  return settings;
};

/**
 * Fetch exam questions
 */
const getQuestions = async ({
  subject,
  year,
  limit,
  examType,
}) => {
  const where = {
    subject,
  };

  if (year && year !== "random") {
    where.year = Number(year);
  }

  if (examType) {
    where.examType = examType;
  }

  const questions = await prisma.question.findMany({
    where,
  });

  if (questions.length === 0) {
    throw new Error(
      `No questions found for ${subject}.`
    );
  }

  return shuffleArray(questions).slice(0, limit);
};

/**
 * Start CBT Exam
 */
export const startExam = async (
  userId,
  payload
) => {

  const settings = await getUserSettings(userId);

  const subject =
    payload.subject ||
    settings.preferredSubjects[0];

  const year =
    payload.year || "random";

  const duration =
    payload.duration || 60;

  const totalQuestions =
    payload.totalQuestions || 60;

  const questions =
    await getQuestions({
      subject,
      year,
      limit: totalQuestions,
      examType:
        settings.preferredExamType,
    });

  return await prisma.$transaction(async (tx) => {

    // Create exam session
    const exam =
      await tx.exam.create({

        data: {
          userId,
          subject,
          year:
            year === "random"
              ? null
              : Number(year),

          duration,

          status: "IN_PROGRESS",
        },

      });

    // Pre-create answer rows
    await tx.examAnswer.createMany({

      data: questions.map((question) => ({

        examId: exam.id,

        questionId: question.id,

        selectedOption: null,

        correctOption:
          question.correctOption,

      })),

    });

    return {

      examId: exam.id,

      subject,

      year,

      duration,

      totalQuestions:
        questions.length,

      startedAt:
        exam.startedAt,

      questions: questions.map((q) => ({

        id: q.id,

        subject: q.subject,

        topic: q.topic,

        year: q.year,

        questionText:
          q.questionText,

        questionImage:
          q.questionImage,

        options:
          q.options,

      })),

    };

  });

};

/**
 * Save/Auto-save an Answer
 */
export const saveAnswer = async (
  userId,
  examId,
  payload
) => {

  const {
    questionId,
    selectedOption,
  } = payload;

  return await prisma.$transaction(async (tx) => {

    // Verify exam belongs to user
    const exam = await tx.exam.findFirst({
      where: {
        id: examId,
        userId,
      },
    });

    if (!exam) {
      throw new Error("Exam not found.");
    }

    // Prevent saving after submission
    if (exam.status === "COMPLETED") {
      throw new Error(
        "This exam has already been submitted."
      );
    }

    // Verify this question belongs to this exam
    const answer = await tx.examAnswer.findUnique({
      where: {
        examId_questionId: {
          examId,
          questionId,
        },
      },
      include: {
        question: {
          select: {
            id: true,
            subject: true,
            topic: true,
            year: true,
          },
        },
      },
    });

    if (!answer) {
      throw new Error(
        "Question does not belong to this exam."
      );
    }

    // Update selected option
    const updatedAnswer =
      await tx.examAnswer.update({
        where: {
          examId_questionId: {
            examId,
            questionId,
          },
        },
        data: {
          selectedOption,
        },
        select: {
          id: true,
          examId: true,
          questionId: true,
          selectedOption: true,
          updatedAt: true,
        },
      });

    return {
      message: "Answer saved successfully.",
      answer: updatedAnswer,
    };

  });

};