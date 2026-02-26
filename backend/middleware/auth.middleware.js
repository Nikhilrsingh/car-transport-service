import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Protected route middleware
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
      return res.sendStatus(401);

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from DB to get the latest role/isAdmin status
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.sendStatus(401);

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.sendStatus(403);
  }
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
  }
};

export default protect;
