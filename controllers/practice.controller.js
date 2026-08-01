import * as practiceService from "../services/practice.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc Start a practice session
 * @route POST /api/practice/start
 * @access Private
 */
export const startPractice = asyncHandler(async (req, res) => {
  const practice = await practiceService.createPracticeSession(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Practice session started successfully.",
    data: practice,
  });
});

/**
 * @desc Auto save progress
 * @route PATCH /api/practice/:id/autosave
 * @access Private
 */
export const autoSavePractice = asyncHandler(async (req, res) => {
  const practice = await practiceService.autoSavePractice(
    req.user.id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Progress saved successfully.",
    data: practice,
  });
});

/**
 * @desc Submit practice session
 * @route POST /api/practice/:id/submit
 * @access Private
 */
export const submitPractice = asyncHandler(async (req, res) => {
  const summary = await practiceService.submitPracticeAnswers(
    req.user.id,
    req.params.id,
    req.body.answers
  );

  res.status(200).json({
    success: true,
    message: "Practice submitted successfully.",
    data: summary,
  });
});

/**
 * @desc Review submitted practice
 * @route GET /api/practice/:id/review
 * @access Private
 */
export const reviewPractice = asyncHandler(async (req, res) => {
  const review = await practiceService.reviewPractice(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc Get practice history
 * @route GET /api/practice/history
 * @access Private
 */
export const getPracticeHistory = asyncHandler(async (req, res) => {
  const history = await practiceService.getPracticeHistory(
    req.user.id,
    req.query
  );

  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

/**
 * @desc Get practice session by ID
 * @route GET /api/practice/:id
 * @access Private
 */
export const getPracticeById = asyncHandler(async (req, res) => {
  const practice = await practiceService.getPracticeById(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: practice,
  });
});