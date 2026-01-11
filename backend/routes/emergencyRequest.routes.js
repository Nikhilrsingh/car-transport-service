import express from "express";
import {
  createEmergencyRequest,
  getEmergencyRequestByReference
} from "../controllers/emergencyRequest.controller.js";

const router = express.Router();

router.post("/emergency", createEmergencyRequest);
router.get("/emergency/:reference", getEmergencyRequestByReference);

export default router;
