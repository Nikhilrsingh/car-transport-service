import express from "express";
import upload from "../middleware/upload.js";
import {
  createInspection,
  getAllInspections,
  getInspectionById,
  getInspectionsByVehicle,
  deleteInspection,
  getInspectionStats,
} from "../controllers/inspection.controller.js";

const router = express.Router();

// Create inspection (with 6 photos)
router.post(
  "/",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "rear", maxCount: 1 },
    { name: "leftSide", maxCount: 1 },
    { name: "rightSide", maxCount: 1 },
    { name: "interior", maxCount: 1 },
    { name: "dashboard", maxCount: 1 },
  ]),
  createInspection
);

// Get all inspections (with filters)
router.get("/", getAllInspections);

// Get inspection statistics
router.get("/stats", getInspectionStats);

// Get inspections by vehicle number
router.get("/vehicle/:vehicleNumber", getInspectionsByVehicle);

// Get inspection by ID
router.get("/:id", getInspectionById);

// Delete inspection
router.delete("/:id", deleteInspection);

export default router;
