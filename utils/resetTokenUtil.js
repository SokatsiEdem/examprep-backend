// utils/resetTokenUtil.js


import crypto from 'crypto';

export const generateResetToken = () => {
	const rawToken = crypto.randomBytes(32).toString('hex');
	const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
	const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

	return { rawToken, hashedToken, expires };
};

export const hashResetToken = (rawToken) => {
	return crypto.createHash('sha256').update(rawToken).digest('hex');
};