// middlewares/errorHandlerMiddleware.js


const errorHandler = (err, req, res, next) => {
	console.error(err);

	const statusCode = err.statusCode || 500;
	const message = err.message || 'Something went wrong on the server';


	if (err.name === 'ValidationError') {
		return res.status(400).json({
			success: false,
			message: 'Validation failed',
			errors: Object.values(err.errors).map((e) => e.message),
		});
	}

	if (err.code === 11000) {
		return res.status(409).json({
			success: false,
			message: 'Duplicate value entered for a unique field',
		});
	}


	res.status(statusCode).json({
		success: false,
		message,
	});
};


export default errorHandler;
