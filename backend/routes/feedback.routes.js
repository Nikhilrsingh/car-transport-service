import express from "express";
import upload from "../middleware/upload.js";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  getPublicFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
  getFeedbackStats,
  toggleFeaturedFeedback,
  getAverageRating,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// Submit feedback (with images)
router.post(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
  ]),
  createFeedback
);

// Get approved feedbacks (for website)
router.get("/public", getPublicFeedbacks);

// Get average rating
router.get("/average-rating", getAverageRating);

/* =========================
   ADMIN ROUTES (future auth)
========================= */

// Get all feedbacks (dashboard)
router.get("/", getAllFeedbacks);

// Feedback statistics
router.get("/stats", getFeedbackStats);

// Get single feedback
router.get("/:id", getFeedbackById);

// Update status (approve / reject / pending)
router.patch("/:id/status", updateFeedbackStatus);

// Toggle featured feedback
router.patch("/:id/featured", toggleFeaturedFeedback);

// Delete feedback (also deletes Cloudinary images)
router.delete("/:id", deleteFeedback);


export default router;
