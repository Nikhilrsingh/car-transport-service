import Enquiry from "../models/enquiry.model.js";
import { sendEnquiryEmail } from "../utils/sendEmail.js";

const generateReferenceNumber = () => {
  return `ENQ${Date.now()}`;
};

export const createEnquiry = async (req, res) => {
  try {
    const referenceNumber = generateReferenceNumber();

    // Save enquiry in MongoDB
    const enquiry = await Enquiry.create({
      referenceNumber,
      ...req.body,
      documents: req.files?.map(file => ({
        filename: file.originalname,
        path: file.path,
        size: file.size,
      })) || []
    });

    // Send email (non-blocking, without attachments)
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
      `
    }).catch(err => console.error("Enquiry email failed:", err.message));

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      referenceNumber
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const getEnquiryByReference = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({
      referenceNumber: req.params.reference
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all enquiries (Admin dashboard)
 * @route   GET /api/enquiry
 * @access  Admin (future)
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const query = {};

    // 🔍 Search by reference, name, email, phone
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

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["new", "in-progress", "resolved"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const toggleEnquirySeenStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    enquiry.isSeen = !enquiry.isSeen;
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Seen status updated",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getEnquiryStats = async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();

    const byStatus = await Enquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      total,
      byStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
