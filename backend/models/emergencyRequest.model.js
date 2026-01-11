import mongoose from "mongoose";

const emergencyRequestSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true
    },

    urgencyLevel: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: true
    },

    issueType: {
      type: String,
      enum: [
        "accident",
        "breakdown",
        "delay",
        "damage",
        "lost",
        "other"
      ],
      required: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },

    emailAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    bookingId: {
      type: String
    },

    currentLocation: {
      type: String
    },

    issueDescription: {
      type: String,
      required: true
    },

    smsUpdates: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "resolved"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("EmergencyRequest", emergencyRequestSchema);
