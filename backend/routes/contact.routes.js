import express from "express";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";

const router = express.Router();

// Public route (form submission)
router.post("/", submitContact);

// Admin routes (future auth middleware)
router.get("/", getAllContacts);
router.patch("/:id", updateContactStatus);

export default router;
