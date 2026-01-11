import express from "express";
import upload from "../middleware/upload.js";
import {
  createFeedback,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
} from "../controllers/feedback.controller.js";

const router = express.Router();

// Create feedback with images
router.post(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
  ]),
  createFeedback
);

// Get all feedback
router.get("/", getAllFeedbacks);

// Approve / Reject
router.put("/:id", updateFeedbackStatus);

// Delete feedback (also deletes images from Cloudinary)
router.delete("/:id", deleteFeedback);

export default router;
