import { body, query, param } from "express-validator";

export const validateQuestionQuery = [
  query("subject").optional().isString().trim(),
  query("year").optional().isInt({ min: 1970, max: 2026 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];

export const validateSearchQuery = [
  query("q")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters"),
];

export const validateQuestionId = [
  param("id")
    .isUUID()
    .withMessage("Invalid question ID"),
];

/**
 * Create Question
 */
export const createQuestionValidator = [
  body("examType").notEmpty().withMessage("Exam type is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("topic").notEmpty().withMessage("Topic is required"),
  body("year").isInt().withMessage("Year is required"),
  body("questionText").notEmpty().withMessage("Question text is required"),
  body("options").isArray({ min: 2 }).withMessage("Options are required"),
  body("correctOption").notEmpty().withMessage("Correct option is required"),
  body("explanation").notEmpty().withMessage("Explanation is required"),
];

/**
 * Update Question
 */
export const updateQuestionValidator = [
  body("examType").optional(),
  body("subject").optional(),
  body("topic").optional(),
  body("year").optional().isInt(),
  body("questionText").optional(),
  body("options").optional().isArray(),
  body("correctOption").optional(),
  body("explanation").optional(),
];

