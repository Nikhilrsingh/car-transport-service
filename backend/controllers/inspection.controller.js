import VehicleInspection from "../models/vehicleInspection.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { success, error } from "../utils/response.js";

/**
 * Upload an in-memory file buffer to Cloudinary.
 * Returns a Promise that resolves with the upload result object.
 */
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * @desc    Create a new vehicle inspection record with photo uploads
 * @route   POST /api/inspections
 * @access  Admin / Driver
 */
export const createInspection = async (req, res, next) => {
  try {
    const {
      vehicleNumber,
      inspectionType,
      driverName,
      customerName,
      generalNotes,
      odometerReading,
      fuelLevel,
      annotations, // JSON string with per-photo annotation data
    } = req.body;

    // Parse annotations if provided — fail silently on malformed JSON
    let parsedAnnotations = {};
    if (annotations) {
      try {
        parsedAnnotations = JSON.parse(annotations);
      } catch (e) {
        console.error("Failed to parse annotations:", e);
      }
    }

    // Upload photos to Cloudinary
    const photos = {};
    const photoTypes = ["front", "rear", "leftSide", "rightSide", "interior", "dashboard"];

    for (const type of photoTypes) {
      if (req.files?.[type]?.[0]) {
        const uploadResult = await uploadToCloudinary(
          req.files[type][0].buffer,
          `Car_transport_inspections/${vehicleNumber || "unknown"}/${inspectionType}`
        );

        photos[type] = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          annotations: parsedAnnotations[type] || [],
        };
      }
    }

    const inspection = await VehicleInspection.create({
      vehicleNumber,
      inspectionType,
      driverName,
      customerName,
      photos,
      generalNotes,
      odometerReading: odometerReading ? Number(odometerReading) : undefined,
      fuelLevel,
    });

    return success(res, 201, "Inspection created successfully", inspection);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all inspections with optional filters and pagination
 * @route   GET /api/inspections
 * @access  Admin
 */
export const getAllInspections = async (req, res, next) => {
  try {
    const { inspectionType, vehicleNumber, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (inspectionType) filter.inspectionType = inspectionType;
    if (vehicleNumber) filter.vehicleNumber = vehicleNumber.toUpperCase();

    const skip = (Number(page) - 1) * Number(limit);

    const inspections = await VehicleInspection.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await VehicleInspection.countDocuments(filter);

    return success(res, 200, "Inspections fetched successfully", {
      data: inspections,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single inspection by MongoDB ID
 * @route   GET /api/inspections/:id
 * @access  Admin
 */
export const getInspectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inspection = await VehicleInspection.findById(id);

    if (!inspection) {
      return error(res, 404, "Inspection not found");
    }

    return success(res, 200, "Inspection fetched successfully", inspection);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all inspections for a given vehicle number
 * @route   GET /api/inspections/vehicle/:vehicleNumber
 * @access  Admin
 */
export const getInspectionsByVehicle = async (req, res, next) => {
  try {
    const { vehicleNumber } = req.params;

    const inspections = await VehicleInspection.find({
      vehicleNumber: vehicleNumber.toUpperCase(),
    }).sort({ createdAt: -1 });

    return success(res, 200, "Inspections fetched successfully", {
      count: inspections.length,
      data: inspections,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an inspection and its associated Cloudinary photos
 * @route   DELETE /api/inspections/:id
 * @access  Admin
 */
export const deleteInspection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inspection = await VehicleInspection.findById(id);

    if (!inspection) {
      return error(res, 404, "Inspection not found");
    }

    // Delete photos from Cloudinary before removing the DB record
    const photoTypes = ["front", "rear", "leftSide", "rightSide", "interior", "dashboard"];

    for (const type of photoTypes) {
      if (inspection.photos[type]?.public_id) {
        try {
          await cloudinary.uploader.destroy(inspection.photos[type].public_id);
        } catch (cloudErr) {
          console.error(`Failed to delete ${type} photo from Cloudinary:`, cloudErr);
        }
      }
    }

    await VehicleInspection.findByIdAndDelete(id);

    return success(res, 200, "Inspection deleted successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get inspection statistics
 * @route   GET /api/inspections/stats
 * @access  Admin
 */
export const getInspectionStats = async (req, res, next) => {
  try {
    const total = await VehicleInspection.countDocuments();
    const pickupCount = await VehicleInspection.countDocuments({ inspectionType: "pickup" });
    const deliveryCount = await VehicleInspection.countDocuments({ inspectionType: "delivery" });

    const recentInspections = await VehicleInspection.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("vehicleNumber inspectionType createdAt");

    return success(res, 200, "Inspection stats fetched successfully", {
      total,
      pickupCount,
      deliveryCount,
      recent: recentInspections,
    });
  } catch (err) {
    next(err);
  }
};
