// services/subjectService.js


import Subject from '../models/subjectModel.js';
import User from '../models/userModel.js';

const JAMB_SUBJECT_COUNT = 4;
const COMPULSORY_SUBJECT_NAME = 'English Language';


// Validate Jamb Subject Combination

export const validateJambCombination = async (subjectIds) => {
	if (subjectIds.length !== JAMB_SUBJECT_COUNT) {
		const error = new Error(
			`JAMB requires exactly ${JAMB_SUBJECT_COUNT} subjects (English Language + 3 electives)`
		);

		error.statusCode = 400;
		throw error;
	}

	const selectedSubjects = await Subject.find({ _id: {$in: subjectIds } });


	if (selectedSubjects.length !== subjectIds.length) {
	const error = new Error('One or more subject ids are invalid');
	error.statusCode = 400;
	throw error;
	}

	const hasEnglish = selectedSubjects.some(
		(subject) => subject.name === COMPULSORY_SUBJECT_NAME
	);

	if (!hasEnglish) {
		const error = new Error('English Language is compulsory and must be included');
		error.statusCode = 400;
		throw error;
	}
};


//Get All Subjects

export const getAllSubjects = async () => {
	return Subject.find().sort({ name: 1 });
};


//Save User Subjects

export const saveUserSubjects = async (userId, subjectIds) => {
	await validateJambCombination(subjectIds);

	const user = await User.findByIdAndUpdate(
		userId,
		{ subjects: subjectIds },
		{ new: true }
		).populate('subjects', 'name code');

	if (!user) {
		const error = new Error('User not found');
		error.statusCode = 404;
		throw error;
	}


	return user.subjects;
};


// Update User Subjects

export const updateUserSubjects = async (userId, subjectIds) => {
	return saveUserSubjects(userId, subjectIds);
};


