// controllers/subjectsController.js

import * as subjectsService from '../services/subjectsService.js';


// Get All Subjects

export const getAllSubjects = async (req, res, next) => {
	try {
		const subjects = await subjectsService.getAllSubjects();

		res.status(200).json({
			success: true,
			data: subjects,
		});
	} catch (error) {
		next(error);
	}
};


// Save User Subjects

export const saveUserSubjects = async (req, res, next) => {
	try {
		const { subjectIds } = req.body;
		const subjects = await subjectsService.saveUserSubjects(req.user._id, subjectIds);

		res.status(200).json({
			success: true,
			message: 'Subjects saved successfully',
			data: subjects,
		});
	} catch (error) {
		next(error);
	}
};


// Update User Subjects 

export const updateUserSubjects = async (req, res, next) => {
	try {
		const { subjectIds } = req.body;
		const subjects = await subjectsService.updateUserSubjects(req.user._id, subjectIds);

		res.status(200).json({
			success: true,
			message: 'Subjects updated successfully',
			data: subjects,
		});
	} catch (error) {
		next(error);
	}
};


