// models/userModel.js


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
{
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true,
	}, 

	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^\S+@\S+\.\S+$/, 'Please, provide a valid email'],
	},

	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: 8,
		select: false,
	},

	subjects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
		},
	],

	resetPasswordToken: {
		type: String,
		select: false,
	},

	resetPasswordExpires: {
		type: Date,
		select: false,
	},
},

 { 
 	timestamps: true,
 }
);


const User = mongoose.model('User', userSchema);

export default User;