// services/userService.js


import User from '../models/userModel.js';

//Get Profile

export const getProfile = async (userId) => {
	const user = await User.findById(userId).populate('subjects', 'name code');

	if (!user) {
		const error = new Error('User not found');
		error.statusCode = 404;
		throw error;
	}


	return user;
};


//Update Profile

export const updateProfile = async (userId, updates) => {
	const allowedFields = ['name', 'email',];
	const sanitizedUpdates = {};


	for (const field of allowedFields) {
		if (updates[field] !== undefined) {
			sanitizedUpdates[field] = updates[field];
		}
	}


	const user = await User.findByIdAndUpdate(userId, sanitizedUpdates, {
		new: true,
		runValidators: true,
	});


	if (!user) {
		const error = new Error('User not found');
		error.statusCode = 404;
		throw error;
	}

	return user;
};
