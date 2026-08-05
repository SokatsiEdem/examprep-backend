const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the full error

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Prisma Errors
  if (err.code === "P2002") {
    statusCode = 409;
    return res.status(statusCode).json({
      success: false,
      message: "A record with this value already exists.",
    });
  }

  if (err.code === "P2025") {
    statusCode = 404;
    return res.status(statusCode).json({
      success: false,
      message: "Requested resource was not found.",
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    return res.status(statusCode).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    return res.status(statusCode).json({
      success: false,
      message: "Authentication token has expired.",
    });
  }

  // Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Default Error Response
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.stack,
  });
};

export default errorHandler;