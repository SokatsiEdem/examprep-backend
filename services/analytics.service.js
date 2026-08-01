import prisma from "../config/prisma.js";



/**
 * Get CBT analytics
 */
export const getCBTAnalytics = async (userId) => {
  const exams = await prisma.exam.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    include: {
      answers: true,
    },
    orderBy: {
      startedAt: "asc",
    },
  });

  if (exams.length === 0) {
    return {
      totalExams: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      averagePercentage: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      performanceTrend: [],
      subjectBreakdown: [],
    };
  }

  const totalExams = exams.length;

  const totalScore = exams.reduce(
    (sum, exam) => sum + exam.score,
    0
  );

  const highestScore = Math.max(
    ...exams.map((exam) => exam.score)
  );

  const lowestScore = Math.min(
    ...exams.map((exam) => exam.score)
  );

  const totalQuestionsAnswered = exams.reduce(
    (sum, exam) => sum + exam.answers.length,
    0
  );

  const totalCorrectAnswers = exams.reduce(
    (sum, exam) =>
      sum +
      exam.answers.filter((a) => a.isCorrect).length,
    0
  );

  const totalIncorrectAnswers =
    totalQuestionsAnswered -
    totalCorrectAnswers;

  const averageScore = Number(
    (totalScore / totalExams).toFixed(2)
  );

  const averagePercentage =
    totalQuestionsAnswered === 0
      ? 0
      : Number(
          (
            (totalCorrectAnswers /
              totalQuestionsAnswered) *
            100
          ).toFixed(2)
        );

  /**
   * Performance trend
   */
  const performanceTrend = exams.map((exam) => ({
    examId: exam.id,
    subject: exam.subject,
    score: exam.score,
    percentage:
      exam.answers.length === 0
        ? 0
        : Number(
            (
              (exam.answers.filter(
                (a) => a.isCorrect
              ).length /
                exam.answers.length) *
              100
            ).toFixed(2)
          ),
    date: exam.startedAt,
  }));

  /**
   * Subject breakdown
   */
  const groupedSubjects = {};

  for (const exam of exams) {
    if (!groupedSubjects[exam.subject]) {
      groupedSubjects[exam.subject] = {
        subject: exam.subject,
        examsTaken: 0,
        totalScore: 0,
        totalQuestions: 0,
        totalCorrect: 0,
      };
    }

    groupedSubjects[exam.subject].examsTaken += 1;
    groupedSubjects[exam.subject].totalScore += exam.score;
    groupedSubjects[exam.subject].totalQuestions +=
      exam.answers.length;
    groupedSubjects[exam.subject].totalCorrect +=
      exam.answers.filter((a) => a.isCorrect).length;
  }

  const subjectBreakdown = Object.values(
    groupedSubjects
  ).map((subject) => ({
    subject: subject.subject,
    examsTaken: subject.examsTaken,
    averageScore: Number(
      (
        subject.totalScore /
        subject.examsTaken
      ).toFixed(2)
    ),
    averagePercentage:
      subject.totalQuestions === 0
        ? 0
        : Number(
            (
              (subject.totalCorrect /
                subject.totalQuestions) *
              100
            ).toFixed(2)
          ),
  }));

  return {
    totalExams,
    averageScore,
    highestScore,
    lowestScore,
    averagePercentage,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    totalIncorrectAnswers,
    performanceTrend,
    subjectBreakdown,
  };
};
/**
 * --------------------------------------------------------
 * Helper Functions
 * --------------------------------------------------------
 */

/**
 * Safely calculate percentage
 */
const calculatePercentage = (score, total) => {
  if (!total || total === 0) return 0;
  return Number(((score / total) * 100).toFixed(2));
};

/**
 * Average helper
 */
const average = (numbers = []) => {
  if (!numbers.length) return 0;

  const total = numbers.reduce((sum, num) => sum + num, 0);

  return Number((total / numbers.length).toFixed(2));
};

/**
 * Get latest practice session
 */
const getLatestPractice = async (userId) => {
  return prisma.practiceSession.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      score: true,
      percentage: true,
      createdAt: true,
    },
  });
};

/**
 * Get latest CBT exam
 */
const getLatestExam = async (userId) => {
  return prisma.exam.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      subject: true,
      score: true,
      createdAt: true,
    },
  });
};

/**
 * --------------------------------------------------------
 * Dashboard Overview
 * --------------------------------------------------------
 */

export const getDashboard = async (userId) => {
  const [
    user,
    practiceCount,
    examCount,
    bookmarkCount,
    totalQuestions,
    settings,
    latestPractice,
    latestExam,
    practices,
    exams,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    }),

    prisma.practiceSession.count({
      where: {
        userId,
      },
    }),

    prisma.exam.count({
      where: {
        userId,
      },
    }),

    prisma.bookmark.count({
      where: {
        userId,
      },
    }),

    prisma.question.count(),

    prisma.userSetting.findUnique({
      where: {
        userId,
      },
    }),

    getLatestPractice(userId),

    getLatestExam(userId),

    prisma.practiceSession.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        score: true,
        percentage: true,
      },
    }),

    prisma.exam.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        score: true,
      },
    }),
  ]);

  if (!user) {
    throw new Error("User not found.");
  }

  const practiceScores = practices.map((p) => p.percentage);

  const examScores = exams.map((e) => e.score);

  const overallAverage = average([
    ...practiceScores,
    ...examScores,
  ]);

  const bestPractice =
    practices.length > 0
      ? Math.max(...practiceScores)
      : 0;

  const bestExam =
    exams.length > 0
      ? Math.max(...examScores)
      : 0;

  const bestScore = Math.max(bestPractice, bestExam);

  return {
    user,

    overview: {
      totalQuestions,
      practiceSessions: practiceCount,
      examSessions: examCount,
      bookmarks: bookmarkCount,
      averageScore: overallAverage,
      bestScore,
    },

    preferences: {
      preferredExamType:
        settings?.preferredExamType ?? null,

      preferredSubjects:
        settings?.preferredSubjects ?? [],

      notificationsEnabled:
        settings?.notificationsEnabled ?? true,
    },

    latestActivity: {
      latestPractice,
      latestExam,
    },
  };
};

/**
 * Get Practice Analytics
 */
export const getPracticeAnalytics = async (userId) => {
  const practices = await prisma.practiceSession.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    orderBy: {
      startedAt: "asc",
    },
    select: {
      id: true,
      score: true,
      percentage: true,
      totalQuestions: true,
      attemptedCount: true,
      correctCount: true,
      incorrectCount: true,
      unansweredCount: true,
      durationMinutes: true,
      startedAt: true,
      submittedAt: true,
    },
  });

  if (practices.length === 0) {
    return {
      totalPracticeSessions: 0,
      averageScore: 0,
      averagePercentage: 0,
      highestScore: 0,
      lowestScore: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalUnanswered: 0,
      averageTimePerSession: 0,
      progress: [],
    };
  }

  const totalSessions = practices.length;

  const totalScore = practices.reduce(
    (sum, session) => sum + session.score,
    0
  );

  const totalPercentage = practices.reduce(
    (sum, session) => sum + session.percentage,
    0
  );

  const totalAnswered = practices.reduce(
    (sum, session) => sum + session.attemptedCount,
    0
  );

  const totalCorrect = practices.reduce(
    (sum, session) => sum + session.correctCount,
    0
  );

  const totalIncorrect = practices.reduce(
    (sum, session) => sum + session.incorrectCount,
    0
  );

  const totalUnanswered = practices.reduce(
    (sum, session) => sum + session.unansweredCount,
    0
  );

  const totalDuration = practices.reduce(
    (sum, session) => sum + session.durationMinutes,
    0
  );

  const highestScore = Math.max(
    ...practices.map((p) => p.score)
  );

  const lowestScore = Math.min(
    ...practices.map((p) => p.score)
  );

  const progress = practices.map((session) => ({
    sessionId: session.id,
    score: session.score,
    percentage: session.percentage,
    attempted: session.attemptedCount,
    correct: session.correctCount,
    incorrect: session.incorrectCount,
    unanswered: session.unansweredCount,
    date: session.startedAt,
  }));

  return {
    totalPracticeSessions: totalSessions,

    averageScore: Number(
      (totalScore / totalSessions).toFixed(2)
    ),

    averagePercentage: Number(
      (totalPercentage / totalSessions).toFixed(2)
    ),

    highestScore,

    lowestScore,

    totalQuestionsAnswered: totalAnswered,

    totalCorrectAnswers: totalCorrect,

    totalIncorrectAnswers: totalIncorrect,

    totalUnanswered,

    averageTimePerSession: Number(
      (totalDuration / totalSessions).toFixed(2)
    ),

    progress,
  };
};

/**
 * Get subject performance analytics
 */
export const getSubjectAnalytics = async (userId) => {
  // Practice answers
  const practiceAnswers = await prisma.practiceAnswer.findMany({
    where: {
      session: {
        userId,
        status: "COMPLETED",
      },
    },
    include: {
      question: {
        select: {
          subject: true,
        },
      },
    },
  });

  // CBT answers
  const examAnswers = await prisma.examAnswer.findMany({
    where: {
      exam: {
        userId,
        status: "COMPLETED",
      },
    },
    include: {
      question: {
        select: {
          subject: true,
        },
      },
    },
  });

  const stats = {};

  // Merge both practice and CBT answers
  [...practiceAnswers, ...examAnswers].forEach((answer) => {
    const subject = answer.question.subject;

    if (!stats[subject]) {
      stats[subject] = {
        subject,
        totalQuestions: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
      };
    }

    stats[subject].totalQuestions++;

    if (answer.isCorrect) {
      stats[subject].correct++;
    } else {
      stats[subject].incorrect++;
    }
  });

  // Calculate accuracy
  Object.values(stats).forEach((subject) => {
    subject.accuracy =
      subject.totalQuestions === 0
        ? 0
        : Number(
            (
              (subject.correct / subject.totalQuestions) *
              100
            ).toFixed(2)
          );
  });

  return Object.values(stats).sort(
    (a, b) => b.accuracy - a.accuracy
  );
};

/**
 * Performance Trend
 * Returns score trend from both Practice and CBT
 */
export const getPerformanceTrend = async (
  userId,
  limit = 10
) => {
  const practice = await prisma.practiceSession.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    select: {
      score: true,
      percentage: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  const exams = await prisma.exam.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    select: {
      score: true,
      startedAt: true,
    },
    orderBy: {
      startedAt: "asc",
    },
  });

  const trend = [
    ...practice.map((item) => ({
      type: "Practice",
      score: item.score,
      percentage: item.percentage,
      date: item.submittedAt,
    })),

    ...exams.map((item) => ({
      type: "CBT",
      score: item.score,
      percentage: null,
      date: item.startedAt,
    })),
  ];

  trend.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return trend.slice(-limit);
};

/**
 * Bookmark Analytics
 */
export const getBookmarksAnalytics = async (userId) => {
  const totalBookmarks = await prisma.bookmark.count({
    where: {
      userId,
    },
  });

  const recentBookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      question: {
        select: {
          id: true,
          subject: true,
          topic: true,
          year: true,
          questionText: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return {
    totalBookmarks,
    recentBookmarks,
  };
};

/**
 * Recent User Activities
 */
export const getRecentActivities = async (
  userId,
  limit = 20
) => {

  const practices =
    await prisma.practiceSession.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        score: true,
        percentage: true,
        status: true,
        createdAt: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

  const exams =
    await prisma.exam.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        subject: true,
        score: true,
        status: true,
        createdAt: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

  const bookmarks =
    await prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        question: {
          select: {
            subject: true,
            topic: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

  const activities = [

    ...practices.map((item) => ({
      type: "Practice",
      action: "Completed Practice Session",
      id: item.id,
      score: item.score,
      percentage: item.percentage,
      status: item.status,
      date: item.createdAt,
    })),

    ...exams.map((item) => ({
      type: "CBT",
      action: "Completed CBT Exam",
      id: item.id,
      subject: item.subject,
      score: item.score,
      status: item.status,
      date: item.createdAt,
    })),

    ...bookmarks.map((item) => ({
      type: "Bookmark",
      action: "Bookmarked Question",
      id: item.id,
      subject: item.question.subject,
      topic: item.question.topic,
      date: item.createdAt,
    })),
  ];

  activities.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return activities.slice(0, limit);
};