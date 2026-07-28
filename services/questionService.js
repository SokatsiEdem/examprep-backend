const prisma = require('../config/prisma');

/**
 * Fetch a paginated list of questions with optional subject and year filters.
 */
exports.fetchQuestions = async ({ subject, year, page = 1, limit = 20 }) => {
  console.log(`[QuestionService] Fetching questions - Subject: ${subject || 'All'}, Year: ${year || 'All'}, Page: ${page}`);

  // Build dynamic SQL filter object
  const where = {};
  if (subject) where.subject = subject.toLowerCase();
  if (year) where.year = Number(year);

  // Calculate skip offset for pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Run database query and total count in parallel for speed
  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.question.count({ where }),
  ]);

  console.log(`[QuestionService] Found ${questions.length} questions out of ${total} total matches.`);

  return {
    questions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Perform a case-insensitive search across question text.
 */
exports.searchQuestions = async (queryText) => {
  console.log(`[QuestionService] Searching question text for query: "${queryText}"`);

  const results = await prisma.question.findMany({
    where: {
      questionText: { contains: queryText, mode: 'insensitive' },
    },
    take: 30, // Cap results at 30 to prevent overloading responses
  });

  console.log(`[QuestionService] Search returned ${results.length} matching questions.`);
  return results;
};

/**
 * Retrieve a single question by its unique UUID.
 */
exports.getQuestionById = async (id) => {
  console.log(`[QuestionService] Looking up question ID: ${id}`);
  
  const question = await prisma.question.findUnique({ where: { id } });
  
  if (!question) {
    console.log(`[QuestionService] Question ID ${id} was not found.`);
  }

  return question;
};