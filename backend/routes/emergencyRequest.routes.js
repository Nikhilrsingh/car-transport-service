import express from "express";
import {
  createEmergencyRequest,
  getEmergencyRequestByReference,
  getAllEmergencyRequests
} from "../controllers/emergencyRequest.controller.js";

const router = express.Router();

router.post("/emergency", createEmergencyRequest);
router.get("/emergency/:reference", getEmergencyRequestByReference);
router.get("/emergencies", getAllEmergencyRequests); // For admin dashboard

export default router;
