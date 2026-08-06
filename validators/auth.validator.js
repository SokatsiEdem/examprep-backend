import { body } from "express-validator";

export const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const forgotPasswordValidator = [
  body("email")
    .isEmail()
    .normalizeEmail(),
];


export const resetPasswordValidator = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required.")
    .isLength({ min: 5, max: 5 })
    .withMessage("Reset token must be a 5-digit OTP.")
    .isNumeric()
    .withMessage("Reset token must contain only numbers."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty(),

  body("newPassword")
    .isLength({ min: 6 }),
];

export const updateProfileValidator = [
  body("fullName")
    .optional()
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .normalizeEmail(),
];

export const updateSettingsValidator = [
  body("preferredExamType")
    .optional()
    .isIn(["JAMB", "WAEC", "NECO", "GCE"]),

  body("preferredSubjects")
    .optional()
    .isArray({ min: 1, max: 4 })
    .withMessage("Select between 1 and 4 subjects"),

  body("preferredSubjects.*")
    .optional()
    .isString()
    .trim(),

  body("notificationsEnabled")
    .optional()
    .isBoolean(),
];
export const resendVerificationOtpValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),
];