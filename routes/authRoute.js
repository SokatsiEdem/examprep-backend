// routes/authRoutes.js

import express from 'express';
const router = express.Router();


import * as authController  from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
	registerValidator,
	loginValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
	changePasswordValidator,
} from '../validators/authValidator.js';


router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);
router.put('/change-password', protect, changePasswordValidator, validate, authController.changePassword);


export default router;
