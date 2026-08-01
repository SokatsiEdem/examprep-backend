import { body, param } from "express-validator";

/**
 * Validate Start CBT
 * POST /api/exams/start
 */
export const validateStartCBT = [
  body("subjectId")
    .isUUID()
    .withMessage("Invalid subject ID"),

  body("duration")
    .isInt({ min: 10, max: 180 })
    .withMessage("Duration must be between 10 and 180 minutes"),

  body("questionCount")
    .isInt({ min: 10, max: 200 })
    .withMessage("Question count must be between 10 and 200"),
];

/**
 * Validate Save Answer
 * POST /api/exams/:id/save-answer
 */
export const validateSaveAnswer = [
  param("id")
    .isUUID()
    .withMessage("Invalid exam ID"),

  body("questionId")
    .isUUID()
    .withMessage("Invalid question ID"),

  body("selectedOption")
    .isIn(["A", "B", "C", "D", "E"])
    .withMessage("Selected option must be A, B, C, D or E"),
];

/**
 * Validate Submit CBT
 * POST /api/exams/:id/submit
 */
export const validateSubmitCBT = [
  param("id")
    .isUUID()
    .withMessage("Invalid exam ID"),

  body("answers")
    .isArray({ min: 1 })
    .withMessage("Answers must be an array"),

  body("answers.*.questionId")
    .isUUID()
    .withMessage("Invalid question ID"),

  body("answers.*.selectedOption")
    .isIn(["A", "B", "C", "D", "E"])
    .withMessage("Answer must be A, B, C, D or E"),
];

/**
 * Validate Exam ID
 * GET /api/exams/:id
 * GET /api/exams/:id/result
 * GET /api/exams/:id/review
 */
export const validateExamId = [
  param("id")
    .isUUID()
    .withMessage("Invalid exam ID"),
];