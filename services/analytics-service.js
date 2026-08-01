import prisma from '../config/db.js';

export const getOverallStats = async (userId) => {
  // 1. Group by Subject to find Strongest/Weakest
  const subjectStats = await prisma.practiceSession.groupBy({
    by: ['subjectId'],
    where: { userId },
    _avg: { score: true },
  });

  if (subjectStats.length === 0) {
    return { message: "No practice data available yet." };
  }

  subjectStats.sort((a, b) => b._avg.score - a._avg.score);
  const strongestId = subjectStats[0].subjectId;
  const weakestId = subjectStats[subjectStats.length - 1].subjectId;

  const subjects = await prisma.subject.findMany({
    where: { id: { in: [strongestId, weakestId] } }
  });

  // 2. Calculate Topic-Level Accuracy (The 60% Threshold Logic)
  const answers = await prisma.practiceAnswer.findMany({
    where: { session: { userId } },
    include: { question: { include: { topic: true } } }
  });

  const topicStats = {};
  answers.forEach(ans => {
    const topicName = ans.question.topic.name;
    if (!topicStats[topicName]) {
      topicStats[topicName] = { correct: 0, total: 0 };
    }
    topicStats[topicName].total += 1;
    if (ans.isCorrect) topicStats[topicName].correct += 1;
  });

  const weakTopics = [];
  for (const [topic, stats] of Object.entries(topicStats)) {
    const accuracy = (stats.correct / stats.total) * 100;
    if (accuracy < 60) {
      weakTopics.push({ topic, accuracy: Number(accuracy.toFixed(1)) });
    }
  }

  return {
    strongestSubject: subjects.find(s => s.id === strongestId)?.name,
    strongestScore: subjectStats[0]._avg.score.toFixed(1),
    weakestSubject: subjects.find(s => s.id === weakestId)?.name,
    weakestScore: subjectStats[subjectStats.length - 1]._avg.score.toFixed(1),
    weakTopics
  };
};

export const getTrendData = async (userId) => {
  return await prisma.practiceSession.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: {
      score: true,
      examType: true,
      createdAt: true,
      subject: { select: { name: true } }
    }
  });
};