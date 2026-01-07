// routes/feedback.routes.js
import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// Public route to submit feedback
router.post("/", createFeedback);

// Admin or authorized routes
router.get("/", getAllFeedbacks);
router.patch("/:id/status", updateFeedbackStatus);
router.delete("/:id", deleteFeedback);

export default router;
