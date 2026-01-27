import express from "express";
import {
    createEnquiry,
    getEnquiryByReference,
    getAllEnquiries,
    getEnquiryById,
    updateEnquiryStatus,
    toggleEnquirySeenStatus,
    getEnquiryStats,
    deleteEnquiry,
  } from "../controllers/enquiry.controller.js";

const router = express.Router();
// Submit enquiry
router.post("/", createEnquiry);

// Track enquiry using reference number
router.get("/track/:reference", getEnquiryByReference);

/* =========================
   ADMIN ROUTES (future auth)
========================= */

// Get all enquiries (dashboard)
router.get("/", getAllEnquiries);

// Enquiry statistics
router.get("/stats", getEnquiryStats);

// Get single enquiry by ID
router.get("/:id", getEnquiryById);

// Update enquiry status
router.patch("/:id/status", updateEnquiryStatus);

// Toggle seen / unseen
router.patch("/:id/seen", toggleEnquirySeenStatus);

// Delete enquiry
router.delete("/:id", deleteEnquiry);

export default router;
