// middlewares/authMiddleware.js

import { verifyToken } from '../utils/jwtUtil.js';
import User from '../models/userModel.js';


export const protect = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized, no token provided',
			});
		}

		const token = authHeader.split(' ')[1];
		const decoded = verifyToken(token);

		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized, user no longer exists',
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Not authorized, invalid or expired token',
		});
	}
};


