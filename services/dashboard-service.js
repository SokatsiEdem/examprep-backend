import prisma from '../config/db.js';

export const getDashboardData = async (userId) => {
  // 1. Fetch aggregates and recent sessions in parallel
  const [aggregations, recentSessions] = await Promise.all([
    prisma.practiceSession.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { score: true },
      _sum: { totalQuestions: true, correctAnswers: true },
    }),
    prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { subject: { select: { name: true } } }
    })
  ]);

  // 2. Perform business logic (calculations)
  const totalQ = aggregations._sum.totalQuestions  0;
  const totalCorrect = aggregations._sum.correctAnswers  0;
  const overallAccuracy = totalQ > 0 ? ((totalCorrect / totalQ) * 100).toFixed(1) : 0;
  const averageScore = aggregations._avg.score ? aggregations._avg.score.toFixed(1) : 0;

  // 3. Return a clean data object to the controller
  return {
    totalSessions: aggregations._count.id,
    averageScore: Number(averageScore),
    overallAccuracy: Number(overallAccuracy),
    progressStatus: averageScore >= 60 ? 'On Track' : 'Needs Review',
    recentSessions
  };
};