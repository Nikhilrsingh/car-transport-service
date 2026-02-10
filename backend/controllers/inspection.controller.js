import VehicleInspection from "../models/vehicleInspection.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// CREATE INSPECTION
export const createInspection = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      vehicleNumber,
      inspectionType,
      driverName,
      customerName,
      generalNotes,
      odometerReading,
      fuelLevel,
      annotations, // JSON string with annotations for each photo
    } = req.body;

    // Parse annotations if provided
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

    res.status(201).json({
      success: true,
      message: "Inspection created successfully",
      data: inspection,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL INSPECTIONS
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

    res.status(200).json({
      success: true,
      data: inspections,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET INSPECTION BY ID
export const getInspectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inspection = await VehicleInspection.findById(id);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inspection,
    });
  } catch (error) {
    next(error);
  }
};

// GET INSPECTIONS BY VEHICLE NUMBER
export const getInspectionsByVehicle = async (req, res, next) => {
  try {
    const { vehicleNumber } = req.params;

    const inspections = await VehicleInspection.find({
      vehicleNumber: vehicleNumber.toUpperCase(),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE INSPECTION
export const deleteInspection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inspection = await VehicleInspection.findById(id);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

    // Delete photos from Cloudinary
    const photoTypes = ["front", "rear", "leftSide", "rightSide", "interior", "dashboard"];

    for (const type of photoTypes) {
      if (inspection.photos[type]?.public_id) {
        try {
          await cloudinary.uploader.destroy(inspection.photos[type].public_id);
        } catch (error) {
          console.error(`Failed to delete ${type} photo from Cloudinary:`, error);
        }
      }
    }

    await VehicleInspection.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Inspection deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET INSPECTION STATS
export const getInspectionStats = async (req, res, next) => {
  try {
    const total = await VehicleInspection.countDocuments();
    const pickupCount = await VehicleInspection.countDocuments({ inspectionType: "pickup" });
    const deliveryCount = await VehicleInspection.countDocuments({ inspectionType: "delivery" });

    const recentInspections = await VehicleInspection.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("vehicleNumber inspectionType createdAt");

    res.status(200).json({
      success: true,
      data: {
        total,
        pickupCount,
        deliveryCount,
        recent: recentInspections,
      },
    });
  } catch (error) {
    next(error);
  }
};
