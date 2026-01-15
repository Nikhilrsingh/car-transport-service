import EmergencyRequest from "../models/emergencyRequest.model.js";
import { sendEmergencyEmail } from "../utils/sendEmail.js";

const generateReferenceNumber = () => {
  return `EMG${Date.now()}`;
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

/**
 * @desc    Get all emergency requests (Admin dashboard)
 * @route   GET /api/emergency
 * @access  Admin (future)
 */
export const getAllEmergencyRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      urgency,
      issueType,
    } = req.query;

    const query = {};

    // 🔍 Search by name, email, phone, reference, location
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { emailAddress: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { referenceNumber: { $regex: search, $options: "i" } },
        { currentLocation: { $regex: search, $options: "i" } },
      ];
    }

    // 🚨 Filter by urgency
    if (urgency) {
      query.urgencyLevel = urgency;
    }

    // 🛠 Filter by issue type
    if (issueType) {
      query.issueType = issueType;
    }

    const total = await EmergencyRequest.countDocuments(query);

    const requests = await EmergencyRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

