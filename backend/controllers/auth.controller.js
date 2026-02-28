import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";
import { success, error } from "../utils/response.js";
import {
  isEmailValid,
  isStrongPassword,
  isValidPhone,
} from "../utils/validators.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (email) email = email.toLowerCase();

    if (!name || !email || !password)
      return error(res, 400, "All fields required");

    if (!isEmailValid(email))
      return error(res, 400, "Invalid email format");

    if (!isStrongPassword(password))
      return error(
        res,
        400,
        "Password must have 8 chars, uppercase, number & symbol"
      );

    const exists = await User.findOne({ email });
    if (exists)
      return error(res, 409, "User already exists");

    const hashed = await bcrypt.hash(password, 12);

    // Normalize phone number to +91XXXXXXXXXX
    let normalizedPhone = phone.replace(/\D/g, ""); // remove non-digits
    if (normalizedPhone.length === 10) {
      normalizedPhone = `+91${normalizedPhone}`;
    } else if (normalizedPhone.length === 12 && normalizedPhone.startsWith("91")) {
      normalizedPhone = `+${normalizedPhone}`;
    }

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashed,
      phone: normalizedPhone,
    });

    success(res, 201, "User registered", {
      token: generateToken(user._id),
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    error(res, 500, err.message);
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (email) email = email.toLowerCase();

    if (!email || !password)
      return error(res, 400, "Email & password required");

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return error(res, 401, "Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return error(res, 401, "Invalid credentials");

    success(res, 200, "Login successful", {
      token: generateToken(user._id),
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    error(res, 500, err.message);
  }
};


/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Respond success
    return success(res, 200, "Logout successful");
  } catch (err) {
    return error(res, 500, err.message);
  }
};

/* ================= GOOGLE LOGIN ================= */
export const googleLogin = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id);

    // Send token + user data to client
    success(res, 200, "Google login successful", {
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    error(res, 500, err.message);
  }
};

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query)
      .select("-password")              // never expose passwords
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    success(res, 200, "Users fetched successfully", {
      total,
      page: Number(page),
      limit: Number(limit),
      users,
    });
  } catch (err) {
    error(res, 500, err.message);
  }
};

