import express from "express";
import upload from "../middleware/upload.js";
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  toggleReadStatus,
  getContactStats,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 5), // field name = images
  submitContact
);

/* =======================
   ADMIN ROUTES (future auth)
======================= */

// Get all contacts (pagination, search, filter)
router.get("/", getAllContacts);

// Get contact stats (dashboard)
router.get("/stats", getContactStats);

// Get single contact by ID
router.get("/:id", getContactById);

// Update contact status (new | in-progress | resolved)
router.patch("/:id/status", updateContactStatus);

// Toggle read / unread
router.patch("/:id/read", toggleReadStatus);

// Delete contact
router.delete("/:id", deleteContact);

export default router;
