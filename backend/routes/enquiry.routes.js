import express from "express";
import { createEnquiry, getEnquiryByReference } from "../controllers/enquiry.controller.js";

const router = express.Router();

router.post("/enquiry", createEnquiry);
router.get("/enquiry/:reference", getEnquiryByReference);

export default router;
