import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    enquiryType: {
      type: String,
      enum: [
        "quote",
        "booking",
        "support",
        "tracking",
        "complaint",
        "partnership",
        "other"
      ],
      required: true
    },

    vehicleType: {
      type: String
    },

    pickupCity: {
      type: String
    },

    dropCity: {
      type: String
    },

    pickupDate: {
      type: Date
    },

    urgency: {
      type: String,
      enum: ["normal", "urgent", "express"],
      default: "normal"
    },

    message: {
      type: String,
      required: true,
      maxlength: 500
    },

    documents: [
      {
        filename: String,
        path: String,
        size: Number
      }
    ],

    contactMethod: {
      type: String,
      enum: ["phone", "email", "whatsapp"],
      default: "phone"
    },

    callbackTime: {
      type: String,
      enum: ["any", "morning", "afternoon", "evening"],
      default: "any"
    },

    vehicleValue: {
      type: Number,
      min: 0
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
