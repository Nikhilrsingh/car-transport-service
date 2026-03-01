import express from "express";
import {
  createEmergencyRequest,
  getEmergencyRequestByReference,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyStatus,
  toggleSeenStatus,
  getEmergencyStats,
  deleteEmergencyRequest,
} from "../controllers/emergencyRequest.controller.js";
import { rateLimiter } from "../middleware/rate-limiter.js";

const router = express.Router();


// Submit emergency request
router.post("/", rateLimiter(60000, 3), createEmergencyRequest);

// Track emergency using reference number
router.get("/track/:reference", getEmergencyRequestByReference);

/* =========================
   ADMIN ROUTES (future auth)
========================= */

// Get all emergency requests (dashboard)
router.get("/", getAllEmergencyRequests);

// Emergency statistics
router.get("/stats", getEmergencyStats);

// Get single emergency by ID
router.get("/:id", getEmergencyRequestById);

// Update emergency status
router.patch("/:id/status", updateEmergencyStatus);

// Toggle seen / unseen
router.patch("/:id/seen", toggleSeenStatus);

// Delete emergency request
router.delete("/:id", deleteEmergencyRequest);

export default router;
