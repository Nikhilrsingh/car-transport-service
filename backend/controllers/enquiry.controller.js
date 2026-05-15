import Enquiry from "../models/enquiry.model.js";
import { sendEnquiryEmail } from "../utils/sendEmail.js";
import { success, error } from "../utils/response.js";

/**
 * Generate a time-based enquiry reference number.
 * Prefixed with ENQ so it is human-readable in emails/admin dashboards.
 */
const generateReferenceNumber = () => {
  return `ENQ${Date.now()}`;
};

/**
 * @desc    Submit a new enquiry
 * @route   POST /api/enquiries
 * @access  Public
 */
export const createEnquiry = async (req, res, next) => {
  try {
    const referenceNumber = generateReferenceNumber();

    // Save enquiry in MongoDB
    const enquiry = await Enquiry.create({
      referenceNumber,
      ...req.body,
      documents: req.files?.map((file) => ({
        filename: file.originalname,
        path: file.path,
        size: file.size,
      })) || [],
    });

    // Fire-and-forget email — failure must not affect the HTTP response
    sendEnquiryEmail({
      subject: `📨 New Enquiry: ${referenceNumber}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Reference Number:</strong> ${referenceNumber}</p>
        <p><strong>Name:</strong> ${enquiry.name || "N/A"}</p>
        <p><strong>Email:</strong> ${enquiry.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${enquiry.phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${enquiry.message || "N/A"}</p>
        <p><strong>Documents:</strong> ${enquiry.documents.length}</p>
      `,
    }).catch((err) => console.error("Enquiry email failed:", err.message));

    return success(res, 201, "Enquiry submitted successfully", { referenceNumber });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Track a single enquiry by reference number
 * @route   GET /api/enquiries/track/:reference
 * @access  Public
 */
export const getEnquiryByReference = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findOne({
      referenceNumber: req.params.reference,
    });

    if (!enquiry) {
      return error(res, 404, "Enquiry not found");
    }

    return success(res, 200, "Enquiry fetched successfully", enquiry);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all enquiries (admin dashboard)
 * @route   GET /api/enquiries
 * @access  Admin (future)
 */
export const getAllEnquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};

    // Search by reference, name, email, or phone
    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Enquiry.countDocuments(query);

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return success(res, 200, "Enquiries fetched successfully", {
      total,
      page: Number(page),
      limit: Number(limit),
      data: enquiries,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single enquiry by MongoDB ID
 * @route   GET /api/enquiries/:id
 * @access  Admin (future)
 */
export const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return error(res, 404, "Enquiry not found");
    }

    return success(res, 200, "Enquiry fetched successfully", enquiry);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update enquiry status
 * @route   PATCH /api/enquiries/:id/status
 * @access  Admin (future)
 */
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["new", "in-progress", "resolved"];

    if (!status) {
      return error(res, 400, "Status is required");
    }

    if (!allowed.includes(status)) {
      return error(res, 400, "Invalid status value");
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return error(res, 404, "Enquiry not found");
    }

    return success(res, 200, "Status updated successfully", enquiry);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle the seen/unseen status of an enquiry
 * @route   PATCH /api/enquiries/:id/seen
 * @access  Admin (future)
 */
export const toggleEnquirySeenStatus = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return error(res, 404, "Enquiry not found");
    }

    enquiry.isSeen = !enquiry.isSeen;
    await enquiry.save();

    return success(res, 200, "Seen status updated", enquiry);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get enquiry statistics grouped by status
 * @route   GET /api/enquiries/stats
 * @access  Admin (future)
 */
export const getEnquiryStats = async (req, res, next) => {
  try {
    const total = await Enquiry.countDocuments();

    const byStatus = await Enquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return success(res, 200, "Enquiry stats fetched successfully", {
      total,
      byStatus,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an enquiry by ID
 * @route   DELETE /api/enquiries/:id
 * @access  Admin (future)
 */
export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return error(res, 404, "Enquiry not found");
    }

    return success(res, 200, "Enquiry deleted successfully");
  } catch (err) {
    next(err);
  }
};
