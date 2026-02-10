import mongoose from "mongoose";

const annotationSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
}, { _id: false });

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  annotations: [annotationSchema],
}, { _id: false });

const vehicleInspectionSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },

    inspectionType: {
      type: String,
      enum: ["pickup", "delivery"],
      required: [true, "Inspection type is required"],
    },

    driverName: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    customerName: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    photos: {
      front: photoSchema,
      rear: photoSchema,
      leftSide: photoSchema,
      rightSide: photoSchema,
      interior: photoSchema,
      dashboard: photoSchema,
    },

    generalNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    odometerReading: {
      type: Number,
      min: 0,
    },

    fuelLevel: {
      type: String,
      enum: ["Empty", "1/4", "1/2", "3/4", "Full"],
    },

    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
vehicleInspectionSchema.index({ vehicleNumber: 1 });
vehicleInspectionSchema.index({ createdAt: -1 });

const VehicleInspection = mongoose.model("VehicleInspection", vehicleInspectionSchema);

export default VehicleInspection;
