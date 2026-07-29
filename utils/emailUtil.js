// utils/emailUtil.js


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
})


export const sendResetPasswordEmail = async (to, rawToken) => {
	const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

	if (!process.env.EMAIL_HOST) {
		console.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
		return;
	}

	const mailOptions = {
		from: `"ExamPrep NG" <${process.env.EMAIL_FROM}>`,
		to,
		subject: 'Reset your ExamPrep NG Password',
		html: `
			<p> You requested a password reset.</p>
			<p> Click the link below to set a new password. This link expires in 15 minutes.</p>
			<a href ="${resetUrl}">${resetUrl}</a>
			<p> If you didn't request this, you can safely ignore this email.</p>
			`,
	};

	await transporter.sendMail(mailOptions);
};