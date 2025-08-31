const errorHandler = (err, req, res, next) => {
  process.env.NODE_ENV !== "production" && console.error(err.stack);

  // Log additional error details for debugging
  console.log("Error details:", {
    message: err.message,
    cause: err.cause,
    status: err.status,
    stack: err.stack,
  });

  res.status(err.status || err.cause || 500).json({
    error: err.message,
    details: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

export default errorHandler;
