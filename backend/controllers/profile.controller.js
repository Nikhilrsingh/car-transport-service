import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { success, error } from "../utils/response.js";
import { isStrongPassword } from "../utils/validators.js";

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return error(res, 404, "User not found");
    }

    return success(res, 200, "Profile fetched successfully", { user });
  } catch (err) {
    console.error("Get profile error:", err);
    return error(res, 500, err.message || "Failed to fetch profile");
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, address, profilePicture } = req.body;

    // Build update object
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    // Update user
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
    console.error("Update profile error:", err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return error(res, 400, messages.join(', '));
    }

    return error(res, 500, err.message || "Failed to update profile");
  }
};

/**
 * Change user password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error(res, 400, "Old and new passwords are required");
    }

    if (!isStrongPassword(newPassword)) {
      return error(
        res,
        400,
        "Password must have 8 chars, uppercase, number & symbol"
      );
    }

    // Get user with password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return error(res, 404, "User not found");
    }

    // Verify old password
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidOldPassword) {
      return error(res, 401, "Current password is incorrect");
    }

    // Check if new password is same as old
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return error(res, 400, "New password must be different from current password");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return success(res, 200, "Password changed successfully", {});
  } catch (err) {
    console.error("Change password error:", err);
    return error(res, 500, err.message || "Failed to change password");
  }
};
