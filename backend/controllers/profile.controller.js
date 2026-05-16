import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { success, error } from "../utils/response.js";
import { isStrongPassword } from "../utils/validators.js";

/**
 * @desc    Get current user's profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return error(res, 404, "User not found");
    }

    return success(res, 200, "Profile fetched successfully", { user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current user's profile details
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, phone, address, profilePicture } = req.body;

    // Build update object — only include fields that were provided
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) {
      // Normalize phone number to +91XXXXXXXXXX
      let normalizedPhone = phone.replace(/\D/g, "");
      if (normalizedPhone.length === 10) {
        normalizedPhone = `+91${normalizedPhone}`;
      } else if (normalizedPhone.length === 12 && normalizedPhone.startsWith("91")) {
        normalizedPhone = `+${normalizedPhone}`;
      }
      updateData.phone = normalizedPhone;
    }
    if (address !== undefined) updateData.address = address;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return error(res, 404, "User not found");
    }

    return success(res, 200, "Profile updated successfully", { user });
  } catch (err) {
    // Surface Mongoose validation errors as 400 so the client gets useful feedback
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return error(res, 400, messages.join(", "));
    }

    next(err);
  }
};

/**
 * @desc    Change the current user's password
 * @route   PUT /api/profile/password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error(res, 400, "Old and new passwords are required");
    }

    if (!isStrongPassword(newPassword)) {
      return error(res, 400, "Password must have 8 chars, uppercase, number & symbol");
    }

    // Fetch user with password field (hidden by default via select: false)
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return error(res, 404, "User not found");
    }

    // Verify old password
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidOldPassword) {
      return error(res, 401, "Current password is incorrect");
    }

    // Prevent reusing the same password
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return error(res, 400, "New password must be different from current password");
    }

    // Hash and persist the new password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return success(res, 200, "Password changed successfully", {});
  } catch (err) {
    next(err);
  }
};
