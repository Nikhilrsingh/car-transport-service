import express from "express";
import { createEnquiry, getEnquiryByReference , getAllEnquiries } from "../controllers/enquiry.controller.js";

const router = express.Router();

router.post("/enquiry", createEnquiry);
router.get("/enquiry/:reference", getEnquiryByReference);
router.get("/enquiries", getAllEnquiries); // For admin dashboard

export default router;
