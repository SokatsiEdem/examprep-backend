import { body } from "express-validator";
import validateRequest from "../middleware/validateRequest.js";

export const validateSelectSubjects = [
  body("subjectIds")
    .exists()
    .withMessage("subjectIds is required.")
    .isArray({ min: 4, max: 4 })
    .withMessage("You must select exactly 4 subjects."),

  body("subjectIds.*")
    .isString()
    .notEmpty()
    .withMessage("Each subject ID must be a valid string."),

  body("subjectIds").custom((subjectIds) => {
    const uniqueSubjects = [...new Set(subjectIds)];

    if (uniqueSubjects.length !== subjectIds.length) {
      throw new Error("Duplicate subjects are not allowed.");
    }

    return true;
  }),

  validateRequest,
];