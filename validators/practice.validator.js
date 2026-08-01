import { body, query, param } from "express-validator";

export const validateStartPractice = [
  body("subjects")
    .isArray({ min: 1, max: 4 })
    .withMessage("Please select between 1 and 4 subjects"),

  body("subjects.*")
    .isString()
    .trim()
    .notEmpty(),

  body("durationMinutes")
    .isIn([10, 15, 25, 45, 60])
    .withMessage("Duration must be 10, 15, 25, 45, or 60 minutes"),

  body("year")
    .optional()
    .custom(
      (val) => val === "random" || (!isNaN(val) && Number(val) > 1900)
    ),
];

export const validateSubmitPractice = [
  param("id")
    .isUUID()
    .withMessage("Invalid practice session ID"),

  body("answers")
    .isArray()
    .withMessage("Answers must be an array"),

  body("answers.*.questionId")
    .isUUID()
    .withMessage("Invalid question ID"),
];

export const validateQuestionQuery = [
  query("subject")
    .optional()
    .isString()
    .trim(),

  query("year")
    .optional()
    .isInt({ min: 1970, max: 2026 }),

  query("page")
    .optional()
    .isInt({ min: 1 }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 }),
];

export const validateSearchQuery = [
  query("q")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters"),
];