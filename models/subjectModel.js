// models/subjectModel.js


import mongoose from'mongoose';

const subjectSchema = new mongoose.Schema(
 {
 	name: {
 		type: String,
 		required: [true, 'Subject name is required'],
 		unique: true,
 		trim: true,
 		enum: {
 			values: [
 				'English Language',
 				'Mathematics',
 				'Physics',
 				'Chemistry',
 				'Biology',
 				'Agricultural Science',
 				'Economics',
 				'Government',
 				'Commerce',
 				'Accounting / Principles of Accounts',
 				'Geography',
 				'Literature in English',
 				'Christian Religious Studies',
 				'Islamic Religious Studies',
 				'Arabic',
 				'History',
 				'Art',
 				'Music',
 				'French',
 				'Hausa',
 				'Igbo',
 				'Yoruba',
 				'Further Mathematics',
 				'Computer Studies',
 				'Physical and Health Education',
 				'Home Economics',
 			],
 			message: '{VALUE} is not a supported subject',
 		},
 	},

 	code: {
 		type: String,
 		trim: true,
 	},
 },

 {
 	timestamps: true,
 }
);


const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;