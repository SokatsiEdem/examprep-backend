import * as cbtService from "../services/cbt.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc Start a CBT exam
 * @route POST /api/exams/start
 * @access Private
 */
export const startCBT = asyncHandler(async (req, res) => {
  const exam = await cbtService.startExam(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "CBT started successfully.",
    data: exam,
  });
});

/**
 * @desc Save an answer during the exam
 * @route POST /api/exams/:id/save-answer
 * @access Private
 */
export const saveAnswer = asyncHandler(async (req, res) => {
  const answer = await cbtService.saveAnswer(
    req.user.id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Answer saved successfully.",
    data: answer,
  });
});

/**
 * @desc Submit CBT exam
 * @route POST /api/exams/:id/submit
 * @access Private
 */
export const submitCBT = asyncHandler(async (req, res) => {
  const result = await cbtService.submitExam(
    req.user.id,
    req.params.id,
    req.body.answers
  );

  res.status(200).json({
    success: true,
    message: "Exam submitted successfully.",
    data: result,
  });
});

/**
 * @desc Get a specific exam session
 * @route GET /api/exams/:id
 * @access Private
 */
export const getExam = asyncHandler(async (req, res) => {
  const exam = await cbtService.getExam(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: exam,
  });
});

/**
 * @desc Get exam history
 * @route GET /api/exams/history
 * @access Private
 */
export const getExamHistory = asyncHandler(async (req, res) => {
  const history = await cbtService.getExamHistory(
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
 * @desc Get exam result
 * @route GET /api/exams/:id/result
 * @access Private
 */
export const getResult = asyncHandler(async (req, res) => {
  const result = await cbtService.getExamResult(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc Review completed exam
 * @route GET /api/exams/:id/review
 * @access Private
 */
export const reviewCBT = asyncHandler(async (req, res) => {
  const review = await cbtService.reviewExam(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: review,
  });
});

export const resumeCBT = asyncHandler(async (req, res) => {
  const exam = await cbtService.resumeExam(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: exam,
  });
});