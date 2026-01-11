import express from "express";
import upload from "../middleware/upload.js";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";

const router = express.Router();

// Public route (form submission)
router.post(
  "/",
  upload.array("images", 5), // Allow up to 5 images with field name "images"
  submitContact
);

// Admin routes (future auth middleware)
router.get("/", getAllContacts);
router.patch("/:id", updateContactStatus);

export default router;
