// controllers/authController.js


import * as authService from '../services/authService.js';


// Register 

export const register = async (req, res, next) => {
	try {
		const { name, email, password, subjectIds } = req.body;
		const result = await authService.registerUser({ name, email, password,subjectIds });

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: result,
		});
	} catch (error) {
		next(error);
	}
};


// Login 

export const login = async(req, res, next) => {
	try {
		const { email, password } = req.body;
		const result = await authService.loginUser({ email, password });

		res.status(200).json({
			success: true,
			message: 'Login successful',
			data: result,
		});
	} catch (error) {
		next(error);
	}
};


// Logout 

export const logout = async(req, res, next) => {
	try {
		res.status(200).json({
			success: true,
			message: 'Logout successful',
		});
	} catch (error) {
		next(error);
	}
};


// Forgot Password 

export const forgotPassword = async(req, res,next) => {
	try {
		const { email } = req.body;
		await authService.forgotPassword(email);

		res.status(200).json({
			success: true,
			message: 'If an account with that email exists, a reset link has been sent',
		});
	} catch(error) {
		next(error);
	}
};


// Reset Password

export const resetPassword = async(req, res, next) => {
	try {
		const { token, newPassword} = req.body;
		await authService.resetPassword({ token, newPassword });

		res.status(200).json({
			success: true,
			message: 'Password has been reset successfully',
		});
	} catch (error) {
		next(error);
	}
};


// Change Password 

export const changePassword = async(req, res, next) => {
	try {
		const { oldPassword, newPassword } = req.body;
		await authService.changePassword({
			userId: req.user._id,
			oldPassword,
			newPassword,
		});

		res.status(200).json({
			success: true,
			message: 'Password changed successfully',
		});
	} catch (error) {
		next(error);
	}
};

