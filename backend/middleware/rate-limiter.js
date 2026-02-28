// Simple in-memory rate limiter middleware to prevent spam
const rateLimitStore = new Map();

/**
 * Rate limiting middleware factory
 * @param {number} windowMs - Time window in milliseconds (default: 1 minute)
 * @param {number} maxRequests - Maximum requests per window (default: 5)
 */
export const rateLimiter = (windowMs = 60000, maxRequests = 5) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const data = rateLimitStore.get(ip);

    // Window has passed, reset the counter
    if (now > data.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    data.count++;
    if (data.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait a moment and try again."
      });
    }

    next();
  };
};
