import express from "express";
import * as profileController from "../controllers/profile.controller.js";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get current user profile
router.get("/", profileController.getProfile);

// Update profile
router.put("/", profileController.updateProfile);

// Upload profile picture (uses existing Cloudinary setup)
router.post("/picture", upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Cloudinary URL is in req.file.path
    const profilePicture = req.file.path;

    // Update user's profile picture
    const user = await req.app.get("models").User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: { profilePicture, user },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Change password
router.post("/change-password", profileController.changePassword);

export default router;
