import EmergencyRequest from "../models/emergencyRequest.model.js";
import { sendEmergencyEmail } from "../utils/sendEmail.js";
import { success, error } from "../utils/response.js";
import crypto from "crypto";

/**
 * Generate a UUID-based reference number for emergency requests.
 * Using crypto.randomUUID ensures global uniqueness even under high load.
 */
const generateReferenceNumber = () => {
  return `EMG-${crypto.randomUUID()}`;
};

/**
 * @desc    Submit a new emergency request
 * @route   POST /api/emergencies
 * @access  Public
 */
export const createEmergencyRequest = async (req, res, next) => {
  try {
    const referenceNumber = generateReferenceNumber();

    const emergencyRequest = await EmergencyRequest.create({
      referenceNumber,
      ...req.body,
    });

    // Fire-and-forget email — failure must not affect the HTTP response
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
      `,
    }).catch((err) => {
      console.error("Emergency email failed but request saved:", err.message);
    });

    return success(res, 201, "Emergency request submitted successfully", { referenceNumber });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Track a single emergency request by reference number
 * @route   GET /api/emergencies/track/:reference
 * @access  Public
 */
export const getEmergencyRequestByReference = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findOne({
      referenceNumber: req.params.reference,
    });

    if (!request) {
      return error(res, 404, "Emergency request not found");
    }

    return success(res, 200, "Emergency request fetched successfully", request);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all emergency requests (admin dashboard)
 * @route   GET /api/emergencies
 * @access  Admin (future)
 */
export const getAllEmergencyRequests = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      urgency,
      issueType,
    } = req.query;

    const query = {};

    // Search by name, email, phone, reference, or location
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { emailAddress: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { referenceNumber: { $regex: search, $options: "i" } },
        { currentLocation: { $regex: search, $options: "i" } },
      ];
    }

    if (urgency) query.urgencyLevel = urgency;
    if (issueType) query.issueType = issueType;

    const total = await EmergencyRequest.countDocuments(query);

    const requests = await EmergencyRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return success(res, 200, "Emergency requests fetched successfully", {
      total,
      page: Number(page),
      limit: Number(limit),
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single emergency request by MongoDB ID
 * @route   GET /api/emergencies/:id
 * @access  Admin (future)
 */
export const getEmergencyRequestById = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return error(res, 404, "Emergency request not found");
    }

    return success(res, 200, "Emergency request fetched successfully", request);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update emergency request status
 * @route   PATCH /api/emergencies/:id/status
 * @access  Admin (future)
 */
export const updateEmergencyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["new", "in-progress", "resolved"];

    if (!status) {
      return error(res, 400, "Status is required");
    }

    if (!allowed.includes(status)) {
      return error(res, 400, "Invalid status value");
    }

    const request = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return error(res, 404, "Emergency request not found");
    }

    return success(res, 200, "Status updated successfully", request);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle the seen/unseen status of an emergency request
 * @route   PATCH /api/emergencies/:id/seen
 * @access  Admin (future)
 */
export const toggleSeenStatus = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return error(res, 404, "Emergency request not found");
    }

    request.isSeen = !request.isSeen;
    await request.save();

    return success(res, 200, "Seen status updated", request);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get emergency request statistics
 * @route   GET /api/emergencies/stats
 * @access  Admin (future)
 */
export const getEmergencyStats = async (req, res, next) => {
  try {
    const total = await EmergencyRequest.countDocuments();

    const byStatus = await EmergencyRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byUrgency = await EmergencyRequest.aggregate([
      { $group: { _id: "$urgencyLevel", count: { $sum: 1 } } },
    ]);

    return success(res, 200, "Emergency stats fetched successfully", {
      total,
      byStatus,
      byUrgency,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an emergency request by ID
 * @route   DELETE /api/emergencies/:id
 * @access  Admin (future)
 */
export const deleteEmergencyRequest = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return error(res, 404, "Emergency request not found");
    }

    return success(res, 200, "Emergency request deleted successfully");
  } catch (err) {
    next(err);
  }
};
