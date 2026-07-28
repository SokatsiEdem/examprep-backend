const prisma = require('../config/prisma');

/**
 * Start a new practice session and randomize questions based on user selection.
 */
exports.createPracticeSession = async (userId, { subjects, durationMinutes, year = 'random', limit = 20 }) => {
  console.log(`[PracticeService] Starting practice session for User: ${userId}`);
  console.log(`[PracticeService] Parameters - Subjects: ${subjects.join(', ')}, Duration: ${durationMinutes} mins, Year: ${year}`);

  // Normalize array strings to lowercase for consistent database matching
  const normalizedSubjects = subjects.map((s) => s.toLowerCase());

  // Build raw SQL string for parameterized filtering
  let whereConditions = `WHERE LOWER(subject) IN (${normalizedSubjects.map((s) => `'${s}'`).join(',')})`;
  if (year !== 'random') {
    whereConditions += ` AND year = ${Number(year)}`;
  }

  // Fetch random questions using PostgreSQL's native RANDOM() function
  console.log('[PracticeService] Executing raw SQL query for randomized question set...');
  const rawQuestions = await prisma.$queryRawUnsafe(`
    SELECT id, "examType", subject, topic, year, "questionText", "questionImage", options
    FROM questions
    ${whereConditions}
    ORDER BY RANDOM()
    LIMIT ${Number(limit)};
  `);

  if (!rawQuestions.length) {
    console.log('[PracticeService] Failed to create session: No questions matched criteria.');
    throw new Error('No questions found for selected criteria');
  }

  // Create practice session record with default IN_PROGRESS status
  const session = await prisma.practiceSession.create({
    data: {
      userId,
      subjects: normalizedSubjects,
      durationMinutes,
      selectedYear: String(year),
      totalQuestions: rawQuestions.length,
    },
  });

  console.log(`[PracticeService] Session successfully created with ID: ${session.id} (${rawQuestions.length} questions attached).`);

  // Return session data & questions without revealing correct options
  return { session, questions: rawQuestions };
};

/**
 * Grade submitted answers, compute metrics, and lock practice session.
 */
exports.submitPracticeAnswers = async (userId, sessionId, answers) => {
  console.log(`[PracticeService] Submitting answers for Session ID: ${sessionId} by User: ${userId}`);
  console.log(`[PracticeService] Total submitted response items: ${answers.length}`);

  // Retrieve existing session and verify ownership
  const session = await prisma.practiceSession.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    console.log(`[PracticeService] Session ${sessionId} not found or access denied.`);
    throw new Error('Practice session not found');
  }

  if (session.status === 'COMPLETED') {
    console.log(`[PracticeService] Re-submission attempt rejected for completed session ${sessionId}.`);
    throw new Error('Session already submitted');
  }

  // Extract all question IDs to query actual correct options from DB
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });

  // Map questions by ID for fast lookup during answer evaluation
  const questionMap = new Map();
  questions.forEach((q) => questionMap.set(q.id, q));

  let correctCount = 0;
  let attemptedCount = 0;
  const answerDocs = [];

  // Loop through submitted answers and evaluate correctness
  for (const item of answers) {
    const question = questionMap.get(item.questionId);
    if (!question) continue;

    // Check if question was attempted (not skipped)
    const isAttempted = Boolean(item.selectedOption);
    if (isAttempted) attemptedCount++;

    // Compare user selected option against correct answer stored in DB
    const isCorrect = isAttempted && item.selectedOption === question.correctOption;
    if (isCorrect) correctCount++;

    answerDocs.push({
      sessionId: session.id,
      questionId: question.id,
      selectedOption: item.selectedOption || null,
      correctOption: question.correctOption,
      isCorrect,
    });
  }

  // Calculate final performance metrics
  const incorrectCount = attemptedCount - correctCount;
  const unansweredCount = session.totalQuestions - attemptedCount;
  const percentage = Math.round((correctCount / session.totalQuestions) * 100);

  console.log(`[PracticeService] Session ${sessionId} results calculated:`);
  console.log(`  -> Correct: ${correctCount}, Incorrect: ${incorrectCount}, Unanswered: ${unansweredCount}`);
  console.log(`  -> Final Score: ${correctCount}/${session.totalQuestions} (${percentage}%)`);

  // Execute Database Transaction: Ensure answers save AND session updates atomically
  console.log('[PracticeService] Executing DB transaction to finalize session...');
  const [_, updatedSession] = await prisma.$transaction([
    prisma.practiceAnswer.createMany({ data: answerDocs }),
    prisma.practiceSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        score: correctCount,
        attemptedCount,
        correctCount,
        incorrectCount,
        unansweredCount,
        percentage,
        submittedAt: new Date(),
      },
    }),
  ]);

  console.log(`[PracticeService] Session ${sessionId} marked as COMPLETED.`);
  return updatedSession;
};

/**
 * Retrieve user practice session history.
 */
exports.getUserPracticeHistory = async (userId, { page = 1, limit = 10 }) => {
  console.log(`[PracticeService] Fetching practice history for User: ${userId}`);

  const skip = (Number(page) - 1) * Number(limit);

  const [history, total] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.practiceSession.count({ where: { userId } }),
  ]);

  console.log(`[PracticeService] Retrieved ${history.length} past sessions.`);

  return {
    history,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Fetch full details of a specific practice session along with question details.
 */
exports.getPracticeSessionDetails = async (userId, sessionId) => {
  console.log(`[PracticeService] Fetching session details for Session ID: ${sessionId}`);

  const session = await prisma.practiceSession.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    console.log(`[PracticeService] Practice session ${sessionId} not found.`);
    throw new Error('Practice session not found');
  }

  // Retrieve individual submitted answers and join question information for answer review
  const answers = await prisma.practiceAnswer.findMany({
    where: { sessionId },
    include: { question: true },
  });

  console.log(`[PracticeService] Retrieved ${answers.length} answer records for review.`);

  return { session, answers };
};