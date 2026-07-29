// validators/authValidator.js

import { body } from 'express-validator';


// Register Validator

export const registerValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
	body('password')
	  .isLength({ min: 8 })
	  .withMessage('Password must be at least 8 characters long'),
	body('subjectIds')
	  .isArray({ min: 4, max: 4 })
	  .withMessage('You must select exactly 4 subjects'),
	body('subjectIds.*').isMongoId().withMessage('Each subject id must be a valid id'),
];


// Login Validator

export const loginValidator = [
	body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
	body('password').notEmpty().withMessage('Password is required'),
];


// Forgot Password Validator

export const forgotPasswordValidator = [
	body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
];


// Reset Password Validator 

export const resetPasswordValidator = [
	body('token').notEmpty().withMessage('Reset token is required'),
	body('newPassword')
	  .isLength({ min: 8 })
	  .withMessage('New password must be at least 8 characters long'),
];


// Change Password Validator

export const changePasswordValidator = [
	body('oldPassword').notEmpty().withMessage('Old password is required'),
	body('newPassword')
	  .isLength({ min: 8 })
	  .withMessage('New password must be at least 8 characters long'),
];

