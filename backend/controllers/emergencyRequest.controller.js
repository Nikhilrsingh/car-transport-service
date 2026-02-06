import EmergencyRequest from "../models/emergencyRequest.model.js";
import { sendEmergencyEmail } from "../utils/sendEmail.js";

import crypto from "crypto"; // For generating unique reference numbers

const generateReferenceNumber = () => {
  return `EMG-${crypto.randomUUID()}`; // Fixed the function to generate a unique reference number using UUID
};


export const createEmergencyRequest = async (req, res) => {
  try {
    const referenceNumber = generateReferenceNumber();

    const emergencyRequest = await EmergencyRequest.create({
      referenceNumber,
      ...req.body
    });

   // 🔥 NON-BLOCKING EMAIL (won't break API)
sendEmergencyEmail({
  subject: "🚨 New Emergency Request Received",
  html: `
    <h2>New Emergency Request</h2>
    <p><strong>Reference Number:</strong> ${referenceNumber}</p>
    <p><strong>Name:</strong> ${req.body.fullName || "N/A"}</p>
    <p><strong>Email:</strong> ${req.body.emailAddress || "N/A"}</p>
    <p><strong>Phone:</strong> ${req.body.phoneNumber || "N/A"}</p>
    <p><strong>Urgency:</strong> ${req.body.urgencyLevel || "N/A"}</p>
    <p><strong>Issue Type:</strong> ${req.body.issueType || "N/A"}</p>
    <p><strong>Location:</strong> ${req.body.currentLocation || "N/A"}</p>
    <p><strong>Description:</strong></p>
    <p>${req.body.issueDescription || "N/A"}</p>
  `
}).catch((error) => {
  console.error("Emergency email failed but request saved:", error.message);
});

// ✅ API RESPONSE (always sent)
res.status(201).json({
  success: true,
  message: "Emergency request submitted successfully",
  referenceNumber
});

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getEmergencyRequestByReference = async (req, res) => {
  try {
    const request = await EmergencyRequest.findOne({
      referenceNumber: req.params.reference
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
