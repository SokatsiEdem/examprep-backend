import { query } from "express-validator";

/**
 * Validate dashboard query
 */
export const dashboardValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid date (YYYY-MM-DD)"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date (YYYY-MM-DD)"),
];

/**
 * Validate practice analytics query
 */
export const practiceAnalyticsValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date"),

  query("subject")
    .optional()
    .trim()
    .isString()
    .withMessage("Subject must be a string"),
];

/**
 * Validate CBT analytics query
 */
export const cbtAnalyticsValidator = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date"),

  query("subject")
    .optional()
    .trim()
    .isString()
    .withMessage("Subject must be a string"),
];

/**
 * Validate subject analytics
 */
export const subjectAnalyticsValidator = [
  query("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .trim()
    .isString()
    .withMessage("Subject must be a string"),
];

/**
 * Validate performance trend
 */
export const performanceTrendValidator = [
  query("period")
    .optional()
    .isIn(["7d", "30d", "90d", "6m", "1y"])
    .withMessage(
      "Period must be one of: 7d, 30d, 90d, 6m, 1y"
    ),
];

/**
 * Validate recent activities
 */
export const recentActivitiesValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];