export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
  
  export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && {stack: err.stack }),
    });
  };
  