import { body, param } from "express-validator";

export const createBookmarkValidator = [
  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required.")
    .isUUID()
    .withMessage("Question ID must be a valid UUID."),
];

export const validateBookmarkId = [
  param("id")
    .isUUID()
    .withMessage("Invalid bookmark ID."),
];

export const validateQuestionId = [
  param("questionId")
    .isUUID()
    .withMessage("Invalid question ID."),
];