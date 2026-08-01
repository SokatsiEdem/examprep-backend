import prisma from "../config/prisma.js";

/**
 * Shuffle array (Fisher-Yates)
 */
const shuffleArray = (array) => {
  const items = [...array];

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
};

/**
 * Get user's preferred settings
 */
const getUserSettings = async (userId) => {
  const settings = await prisma.userSetting.findUnique({
    where: {
      userId,
    },
  });

  if (!settings) {
    throw new Error(
      "Please configure your preferred exam type and subjects first."
    );
  }

  return settings;
};

/**
 * Fetch questions
 */
const fetchQuestions = async ({
  examType,
  subjects,
  selectedYear,
  limit,
}) => {
  const where = {
    examType,
    subject: {
      in: subjects,
    },
  };

  if (
    selectedYear &&
    selectedYear !== "random"
  ) {
    where.year = Number(selectedYear);
  }

  const questions = await prisma.question.findMany({
    where,
    select: {
      id: true,
      examType: true,
      subject: true,
      topic: true,
      year: true,
      questionText: true,
      questionImage: true,
      options: true,
      correctOption: true,
      explanation: true,
      explanationImage: true,
    },
  });

  if (questions.length === 0) {
    throw new Error(
      "No questions found for the selected criteria."
    );
  }

  return shuffleArray(questions).slice(0, limit);
};

/**
 * Create Practice Session
 */
export const createPracticeSession = async (
  userId,
  payload
) => {
  const settings = await getUserSettings(userId);

  const examType =
    payload.examType ||
    settings.preferredExamType;

  const subjects =
    payload.subjects?.length
      ? payload.subjects
      : settings.preferredSubjects;

  if (!subjects || subjects.length === 0) {
    throw new Error(
      "Please select at least one subject."
    );
  }

  const durationMinutes =
    payload.durationMinutes || 60;

  const selectedYear =
    payload.selectedYear || "random";

  const questionLimit =
    payload.totalQuestions || 40;

  const questions = await fetchQuestions({
    examType,
    subjects,
    selectedYear,
    limit: questionLimit,
  });

  const session =
    await prisma.practiceSession.create({
      data: {
        userId,
        subjects,
        durationMinutes,
        selectedYear,
        totalQuestions: questions.length,
      },
    });

  await prisma.practiceAnswer.createMany({
    data: questions.map((question) => ({
      sessionId: session.id,
      questionId: question.id,
      correctOption: question.correctOption,
    })),
  });

  const sessionWithQuestions =
    await prisma.practiceSession.findUnique({
      where: {
        id: session.id,
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                subject: true,
                topic: true,
                year: true,
                questionText: true,
                questionImage: true,
                options: true,
              },
            },
          },
        },
      },
    });

  return sessionWithQuestions;
};

/**
 * Save/Update Practice Answer (Auto Save)
 */
export const saveAnswer = async (
  userId,
  sessionId,
  payload
) => {
  const { questionId, selectedOption } = payload;

  // Check session belongs to user
  const session = await prisma.practiceSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error("Practice session not found.");
  }

  if (session.status === "COMPLETED") {
    throw new Error(
      "This practice session has already been submitted."
    );
  }

  // Find the existing answer
  const answer = await prisma.practiceAnswer.findFirst({
    where: {
      sessionId,
      questionId,
    },
  });

  if (!answer) {
    throw new Error("Question does not belong to this practice session.");
  }

  // Check correctness
  const isCorrect =
    selectedOption === answer.correctOption;

  // Update answer
  const updatedAnswer =
    await prisma.practiceAnswer.update({
      where: {
        id: answer.id,
      },
      data: {
        selectedOption,
        isCorrect,
      },
      include: {
        question: {
          select: {
            id: true,
            subject: true,
            topic: true,
            year: true,
            questionText: true,
            questionImage: true,
            options: true,
          },
        },
      },
    });

  return updatedAnswer;
};

/**
 * Get Current Practice Progress
 */
export const getPracticeProgress = async (
  userId,
  sessionId
) => {
  const session =
    await prisma.practiceSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        answers: true,
      },
    });

  if (!session) {
    throw new Error("Practice session not found.");
  }

  const attemptedCount = session.answers.filter(
    (answer) => answer.selectedOption !== null
  ).length;

  const unansweredCount =
    session.totalQuestions - attemptedCount;

  return {
    sessionId: session.id,
    status: session.status,
    totalQuestions: session.totalQuestions,
    attemptedCount,
    unansweredCount,
    durationMinutes: session.durationMinutes,
    startedAt: session.startedAt,
  };
};

/**
 * Submit Practice Session
 */
export const submitPracticeAnswers = async (
  userId,
  sessionId
) => {
  return await prisma.$transaction(async (tx) => {

    // Find session
    const session = await tx.practiceSession.findFirst({
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

    if (session.status === "COMPLETED") {
      throw new Error(
        "Practice session has already been submitted."
      );
    }

    let attemptedCount = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    // Evaluate every answer
    for (const answer of session.answers) {

      const attempted =
        answer.selectedOption !== null &&
        answer.selectedOption !== "";

      if (attempted) {

        attemptedCount++;

        const isCorrect =
          answer.selectedOption ===
          answer.correctOption;

        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }

        await tx.practiceAnswer.update({
          where: {
            id: answer.id,
          },
          data: {
            isCorrect,
          },
        });
      }
    }

    const unansweredCount =
      session.totalQuestions - attemptedCount;

    const score = correctCount;

    const percentage =
      session.totalQuestions === 0
        ? 0
        : Number(
            (
              (correctCount /
                session.totalQuestions) *
              100
            ).toFixed(2)
          );

    // Update session
    const updatedSession =
      await tx.practiceSession.update({
        where: {
          id: sessionId,
        },
        data: {
          status: "COMPLETED",
          score,
          percentage,
          attemptedCount,
          correctCount,
          incorrectCount,
          unansweredCount,
          submittedAt: new Date(),
        },
      });

    return {
      sessionId: updatedSession.id,

      status: updatedSession.status,

      score,

      percentage,

      totalQuestions:
        session.totalQuestions,

      attemptedCount,

      correctCount,

      incorrectCount,

      unansweredCount,

      durationMinutes:
        updatedSession.durationMinutes,

      startedAt:
        updatedSession.startedAt,

      submittedAt:
        updatedSession.submittedAt,
    };
  });
};

/**
 * Get Practice History
 */
export const getPracticeHistory = async (
  userId,
  query = {}
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const [sessions, total] = await prisma.$transaction([
    prisma.practiceSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        startedAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        subjects: true,
        selectedYear: true,
        durationMinutes: true,
        score: true,
        percentage: true,
        totalQuestions: true,
        attemptedCount: true,
        correctCount: true,
        incorrectCount: true,
        unansweredCount: true,
        status: true,
        startedAt: true,
        submittedAt: true,
      },
    }),

    prisma.practiceSession.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    sessions,
  };
};

/**
 * Get Practice Session
 */
export const getPracticeById = async (
  userId,
  sessionId
) => {

  const session =
    await prisma.practiceSession.findFirst({

      where: {
        id: sessionId,
        userId,
      },

      include: {

        answers: {

          orderBy: {
            createdAt: "asc",
          },

          include: {

            question: {

              select: {
                id: true,
                subject: true,
                topic: true,
                year: true,
                questionText: true,
                questionImage: true,
                options: true,
              },

            },

          },

        },

      },

    });

  if (!session) {
    throw new Error(
      "Practice session not found."
    );
  }

  return session;
};

/**
 * Review Completed Practice Session
 */
export const reviewPractice = async (
  userId,
  sessionId
) => {

  const session =
    await prisma.practiceSession.findFirst({

      where: {
        id: sessionId,
        userId,
        status: "COMPLETED",
      },

      include: {

        answers: {

          orderBy: {
            createdAt: "asc",
          },

          include: {

            question: {

              select: {
                id: true,
                subject: true,
                topic: true,
                year: true,

                questionText: true,
                questionImage: true,

                options: true,

                correctOption: true,

                explanation: true,
                explanationImage: true,
              },

            },

          },

        },

      },

    });

  if (!session) {
    throw new Error(
      "Completed practice session not found."
    );
  }

  return {

    session: {

      id: session.id,
      subjects: session.subjects,
      selectedYear: session.selectedYear,

      durationMinutes:
        session.durationMinutes,

      score: session.score,
      percentage: session.percentage,

      totalQuestions:
        session.totalQuestions,

      attemptedCount:
        session.attemptedCount,

      correctCount:
        session.correctCount,

      incorrectCount:
        session.incorrectCount,

      unansweredCount:
        session.unansweredCount,

      startedAt:
        session.startedAt,

      submittedAt:
        session.submittedAt,

    },

    questions: session.answers.map(
      (answer) => ({

        questionId:
          answer.question.id,

        subject:
          answer.question.subject,

        topic:
          answer.question.topic,

        year:
          answer.question.year,

        question:
          answer.question.questionText,

        questionImage:
          answer.question.questionImage,

        options:
          answer.question.options,

        selectedOption:
          answer.selectedOption,

        correctOption:
          answer.correctOption,

        isCorrect:
          answer.isCorrect,

        explanation:
          answer.question.explanation,

        explanationImage:
          answer.question.explanationImage,

      })
    ),

  };
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
      duration: true,
      status: true,
      score: true,
      startedAt: true,
      submittedAt: true,
      createdAt: true,
    },
  });
};

/**
 * Get a single exam session
 */
export const getExamById = async (userId, examId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
    },

    include: {
      answers: {
        include: {
          question: {
            select: {
              id: true,
              subject: true,
              topic: true,
              year: true,
              questionText: true,
              questionImage: true,
              options: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
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
 * Get completed exam result
 */
export const getExamResult = async (userId, examId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
      status: "COMPLETED",
    },

    include: {
      answers: {
        include: {
          question: {
            select: {
              id: true,
              subject: true,
              topic: true,
              year: true,
              questionText: true,
              options: true,
              correctOption: true,
              explanation: true,
              explanationImage: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!exam) {
    throw new Error(
      "Completed exam not found or has not been submitted."
    );
  }

  const totalQuestions = exam.answers.length;

  const attempted = exam.answers.filter(
    (answer) => answer.selectedOption !== null
  ).length;

  const correct = exam.answers.filter(
    (answer) => answer.isCorrect
  ).length;

  const incorrect = attempted - correct;

  const unanswered = totalQuestions - attempted;

  const percentage =
    totalQuestions > 0
      ? Number(
          ((correct / totalQuestions) * 100).toFixed(2)
        )
      : 0;

  return {
    examId: exam.id,
    subject: exam.subject,
    year: exam.year,
    duration: exam.duration,
    status: exam.status,
    score: exam.score,
    percentage,
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unanswered,
    startedAt: exam.startedAt,
    submittedAt: exam.submittedAt,
    answers: exam.answers,
  };
};

/**
 * Review a completed exam
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
          question: {
            select: {
              id: true,
              subject: true,
              topic: true,
              year: true,
              questionText: true,
              questionImage: true,
              options: true,
              correctOption: true,
              explanation: true,
              explanationImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!exam) {
    throw new Error("Completed exam not found.");
  }

  return exam;
};

/**
 * Resume an unfinished exam
 */
export const resumeExam = async (userId, examId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
      status: "IN_PROGRESS",
    },
    include: {
      answers: {
        include: {
          question: {
            select: {
              id: true,
              subject: true,
              topic: true,
              year: true,
              questionText: true,
              questionImage: true,
              options: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!exam) {
    throw new Error("No active exam found.");
  }

  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(exam.startedAt).getTime()) /
      (1000 * 60)
  );

  const remainingMinutes = Math.max(
    exam.duration - elapsedMinutes,
    0
  );

  return {
    ...exam,
    remainingMinutes,
  };
};

/**
 * Check whether an exam has expired
 */
export const isExamExpired = (exam) => {
  const endTime =
    new Date(exam.startedAt).getTime() +
    exam.duration * 60 * 1000;

  return Date.now() >= endTime;
};

/**
 * Get remaining time
 */
export const getRemainingTime = (exam) => {
  const endTime =
    new Date(exam.startedAt).getTime() +
    exam.duration * 60 * 1000;

  const remaining =
    Math.floor((endTime - Date.now()) / 1000);

  return remaining > 0 ? remaining : 0;
};

/**
 * Automatically submit expired exam
 */
export const autoSubmitExpiredExam = async (
  userId,
  examId
) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
      status: "IN_PROGRESS",
    },
    include: {
      answers: true,
    },
  });

  if (!exam) {
    throw new Error("Exam not found.");
  }

  if (!isExamExpired(exam)) {
    return {
      expired: false,
      message: "Exam is still active.",
    };
  }

  let score = 0;

  for (const answer of exam.answers) {
    if (answer.isCorrect) {
      score++;
    }
  }

  await prisma.exam.update({
    where: {
      id: exam.id,
    },
    data: {
      status: "COMPLETED",
      score,
      submittedAt: new Date(),
    },
  });

  return {
    expired: true,
    examId: exam.id,
    score,
    totalQuestions: exam.answers.length,
  };
};

/**
 * Get currently active exam
 */
export const getActiveExam = async (userId) => {
  const exam = await prisma.exam.findFirst({
    where: {
      userId,
      status: "IN_PROGRESS",
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  return exam;
};

/**
 * Cancel an unfinished exam
 */
export const abandonExam = async (
  userId,
  examId
) => {
  const exam = await prisma.exam.findFirst({
    where: {
      id: examId,
      userId,
      status: "IN_PROGRESS",
    },
  });

  if (!exam) {
    throw new Error("Active exam not found.");
  }

  return prisma.exam.update({
    where: {
      id: exam.id,
    },
    data: {
      status: "ABANDONED",
      submittedAt: new Date(),
    },
  });
};

/**
 * Ensure user has no active exam before starting another
 */
export const ensureNoActiveExam = async (
  userId
) => {
  const activeExam = await prisma.exam.findFirst({
    where: {
      userId,
      status: "IN_PROGRESS",
    },
  });

  if (activeExam) {
    throw new Error(
      "You already have an unfinished CBT exam."
    );
  }

  return true;
};

export const autoSavePractice = async (userId, practiceId, data) => {
    // Save answers, current question, remaining time, progress
};
