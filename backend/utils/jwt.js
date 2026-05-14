import jwt from "jsonwebtoken";

/**
 * Generate a short-lived access token (15 minutes).
 * Uses JWT_SECRET from environment; falls back to a dev-only default
 * so the server does not crash on startup if the env var is missing.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "devsecret_changeme", {
    expiresIn: "15m",
  });
};

/**
 * Generate a long-lived refresh token (7 days).
 * Uses JWT_REFRESH_SECRET from environment; falls back to a dev-only default.
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || "refreshsecret_changeme", {
    expiresIn: "7d",
  });
};
