/**
 * @desc    404 Not Found handler — catches requests to undefined routes
 *          and forwards a structured error to the global errorHandler.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * @desc    Global error handler middleware.
 *          Must be registered LAST in server.js (after all routes).
 *
 *          Accepts errors forwarded via next(err) from any controller
 *          and returns a consistent JSON response shape:
 *
 *          {
 *            success : false,
 *            message : <human-readable message>,
 *            stack   : <stack trace — development only>
 *          }
 *
 * @param   {Error}  err  - The error object (may carry .statusCode / .status)
 */
export const errorHandler = (err, req, res, next) => {
  // Honour an explicit status code attached to the error; fall back to 500
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Expose stack trace only outside production to aid debugging
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};