import * as questionService from "../services/question.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { parseExcel } from "../utils/excelParser.js";
/**
 * @desc Get all questions
 * @route GET /api/questions
 * @access Public
 */
export const getQuestions = asyncHandler(async (req, res) => {
  const data = await questionService.fetchQuestions(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc Search questions
 * @route GET /api/questions/search?q=
 * @access Public
 */
export const searchQuestions = asyncHandler(async (req, res) => {
  const results = await questionService.searchQuestions(req.query.q);

  res.status(200).json({
    success: true,
    data: results,
  });
});

/**
 * @desc Get question by ID
 * @route GET /api/questions/:id
 * @access Public
 */
export const getQuestionById = asyncHandler(async (req, res) => {
  const question = await questionService.getQuestionById(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});

/**
 * @desc Create a new question
 * @route POST /api/questions
 * @access Admin
 */
export const createQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.createQuestion(req.body);

  res.status(201).json({
    success: true,
    message: "Question created successfully.",
    data: question,
  });
});

/**
 * @desc Update a question
 * @route PATCH /api/questions/:id
 * @access Admin
 */
export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.updateQuestion(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Question updated successfully.",
    data: question,
  });
});

/**
 * @desc Delete a question
 * @route DELETE /api/questions/:id
 * @access Admin
 */
export const deleteQuestion = asyncHandler(async (req, res) => {
  await questionService.deleteQuestion(req.params.id);

  res.status(200).json({
    success: true,
    message: "Question deleted successfully.",
  });
});

// export const uploadQuestions = asyncHandler(async (req, res) => {
//   const result = await importQuestions(req.file.path);

//   res.status(201).json(result);
// });

export const uploadQuestions = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an Excel file.",
    });
  }

  const result = await questionService.importQuestions(req.file.path);

  res.status(201).json(result);
});