// validators/usersValidator.js


import { body } from 'express-validator';


// Update Profile Validator

export const updateProfileValidator = [
	body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
	body('email').optional().isEmail().withMessage('A valid email is required').normalizeEmail(),
];


// Subjects Validator

export const subjectValidator = [
	body('subjectIds')
	  .isArray({ min: 1 })
	  .withMessage('subjectIds must be a non-empty array'),
	body('subjectIds.*').isMongoId().withMessage('Each subjects id must be a valid id'),
];

