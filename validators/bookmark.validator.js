const { body } = require("express-validator");

const createBookmarkValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required.")
    .isString()
    .withMessage("User ID must be a string."),

  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required.")
    .isString()
    .withMessage("Question ID must be a string."),
];

module.exports = {
  createBookmarkValidator,
};