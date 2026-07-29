// controllers/usersController.js

import * as usersService from '../services/usersService.js';


// Get Profile 

export const getProfile = async (req, res, next) => {
	try {
		const user = await usersService.getProfile(req.user._id);

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		next(error);
	}
};


// Update Profile 

export const updateProfile = async (req, res, next) => {
	try {
		const updatedUser = await usersService.updateProfile(req.user._id, req.body);

		res.status(200).json({
			success: true,
			message: 'Profile updated successfully',
			data: updatedUser,
		});
	} catch (error) {
		next(error);
	}
};

