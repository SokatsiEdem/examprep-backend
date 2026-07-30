import { query, param } from "express-validator";

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