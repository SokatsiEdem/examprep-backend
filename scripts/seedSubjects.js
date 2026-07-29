// scripts/seedSubjects.js


import 'dotenv/config';
import mongoose from 'mongoose';
import Subject from '../models/subjectModel.js';


const jambSubjects = [
	{ name: 'English Language', code:'ENG' },
	{ name: 'Mathematics', code:'MTH' },
	{ name: 'Physics', code:'PHY' },
	{ name: 'Chemistry', code:'CHM' },
	{ name: 'Biology', code:'BIO' },
	{ name: 'Agricultural Science', code:'AGR' },
	{ name: 'Economics', code:'ECO' },
	{ name: 'Government', code:'GOV' },
	{ name: 'Commerce', code:'COM' },
	{ name: 'Accounting / Principles of Accounts', code:'Accounting' },
	{ name: 'Geography', code:'GEO' },
	{ name: 'Literature in English', code:'LIT' },
	{ name: 'Christian Religious Studies', code:'CRS' },
	{ name: 'Islamic Religious Studies', code:'IRS' },
	{ name: 'Arabic', code:'ARA' },
	{ name: 'History', code:'HIS' },
	{ name: 'Art', code:'ART' },
	{ name: 'Music', code:'MUS' },
	{ name: 'French', code:'FRE' },
	{ name: 'Hausa', code:'HAU' },
	{ name: 'Igbo', code:'IGB' },
	{ name: 'Yoruba', code:'YOR' },
	{ name: 'Further Mathematics', code:'F-MTH' },
	{ name: 'Computer Studies', code:'CMP' },
	{ name: 'Physical and Health Education', code:'PHE' },
	{ name: 'Home Economics', code:'H-ECO' },
];

const seedSubjects = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('MongoDB connected for seeding');


		for (const subject of jambSubjects) {
			await Subject.findOneAndUpdate(
				{ name: subject.name },
				subject,
				{ upsert: true, new: true }
		    );
		    console.log(`Seeded: ${subject.name}`);
		}

		console.log('Subject seeding complete');
		process.exit(0);
	} catch (error) {
		console.error('Seeding failed:', error.message);
		process.exit(1);
	}
};

seedSubjects();