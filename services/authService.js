// services/authService.js


import User from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/hashUtil.js';
import { generateToken } from '../utils/jwtUtil.js';
import { generateResetToken, hashResetToken } from '../utils/resetTokenUtil.js';
import { sendResetPasswordEmail } from '../utils/emailUtil.js';
import { validateJambCombination } from './subjectsService.js';


//Register User

export const registerUser = async ({ name, email, password }) => {
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		const error = new Error('A user with this email already exists');
		error.statusCode = 409;
		throw error;
	}

	await validateJambCombination(subjectIds);

	const hashedPassword = await hashPassword(password);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		subjects: subjectIds,
	});

	const token = generateToken(user._id);


	const populatedUser = await user.populate('subjects', 'name code');


	return {
		user: {
			id: populatedUser._id,
			name: populatedUser.name,
			email: populatedUser.email,
			subjects: populatedUser.subjects,
		},
		token,
	};
};



//Login User

export const loginUser = async ({ email, password }) => {
	const user = await User.findOne({ email }).select('password');


	if (!user) {
		const error = new Error('Invalid email or password');
		error.statusCode = 401;
		throw error;
	}


	const isMatch = await comparePassword(password, user.password);
	if (!isMatch) {
		const error = new Error('Invalid email or password');
		error.statusCode = 401;
		throw error;
	}

	const token = generateToken(user._id);


	return {
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			examType: user.examType,
		},
		token,
	};
};


// Forgot Password

export const forgotPassword = async (email) => {
	const user = await User.findOne({ email });


	if (!user) {
		return;
	}

	const { rawToken, hashedToken, expires } = generateResetToken();

	user.resetPasswordToken = hashedToken;
	user.resetPasswordExpires = expires;
	await user.save();


	await sendResetPasswordEmail(user.email, rawToken);
};


//Reset Password

export const resetPassword = async ({ token, newPassword }) => {
	const hashedToken = hashResetToken(token);


	const user = await User.findOne({
		resetPasswordToken: hashedToken,
		resetPasswordExpires: { $gt: new Date() },
	}).select('+resetPasswordToken +resetPasswordExpires');


	if (!user) {
		const error = new Error('Reset token is invalid or has expired');
		error.statusCode = 400;
		throw error;
	}


	user.password = await hashPassword(newPassword);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();
};


// Change Password

export const changePassword = async ({ userId, oldPassword, newPassword }) => {
	const user = await User.findById(userId).select('+password');


	const isMatch = await comparePassword(oldPassword, user.password);
	if (!isMatch) {
		const error = new Error('Old password is incorrect');
		error.statusCode = 400;
		throw error;
	}

	user.password = await hashPassword(newPassword);
	await user.save();
};


