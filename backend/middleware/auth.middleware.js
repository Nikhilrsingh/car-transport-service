import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * Protect middleware — verifies the Bearer JWT and attaches the full
 * user document to req.user.  Forwards a consistent JSON 401/403 on failure.
 */
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorised, token missing" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret_changeme");

    // Support both plain string IDs and object IDs (used by Google Auth)
    const userId = typeof decoded.id === "object" ? decoded.id._id : decoded.id;

    // Fetch full user from DB to get the latest role / isAdmin status
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorised, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    // jwt.verify throws on expired / tampered tokens — return 401, not 403
    return res.status(401).json({ success: false, message: "Not authorised, invalid token" });
  }
};

/**
 * Admin middleware — must be used AFTER protect.
 * Returns a JSON 403 when the authenticated user is not an admin.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Forbidden: admin access required" });
  }
};

export default protect;
