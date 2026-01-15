import Contact from "../models/contact.model.js";
import { sendContactEmail } from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Upload file buffer to Cloudinary
 */
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

/**
 * @desc    Submit contact form with Cloudinary file uploads
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    let { 
      name = "", 
      phone = "", 
      email = "", 
      vehicle = "", 
      service = "", 
      message = "" 
    } = req.body || {};


    // Trim & normalize input
    name = name?.trim();
    email = email?.trim().toLowerCase();
    message = message?.trim();

    // Validate required fields
    if (!name || !phone || !email || !vehicle || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Handle file uploads to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploaded = await uploadToCloudinary(file.buffer, "Car_transport_contact");
          images.push({
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
          });
        } catch (err) {
          console.error("Failed to upload file:", err.message);
        }
      }
    }

    // Save contact to DB
    const contact = await Contact.create({
      name,
      phone,
      email,
      vehicle,
      service,
      message,
      images,
    });

    // Non-blocking email notification
    // Build HTML for images
let imagesHtml = "";
if (contact.images && contact.images.length > 0) {
  imagesHtml = contact.images
    .map(
      (img) =>
        `<p><strong>Image:</strong><br><img src="${img.url}" alt="Contact Image" style="max-width:300px;"/></p>`
    )
    .join("");
}

// Send email
sendContactEmail({
  subject: "📩 New Contact Form Submission",
  html: `
    <h2>New Contact Received</h2>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone}</p>
    <p><strong>Vehicle:</strong> ${contact.vehicle}</p>
    <p><strong>Service:</strong> ${contact.service}</p>
    <p><strong>Message:</strong> ${contact.message}</p>
    ${imagesHtml} <!-- Insert uploaded images here -->
  `,
}).catch((err) => {
  console.error("Email failed but contact saved:", err.message);
});


    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Get all contact messages (with pagination, search & filter)
 * @route   GET /api/contact
 * @access  Admin (future)
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      service,
    } = req.query;

    const query = {};

    // Search by name, email, phone, vehicle
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { vehicle: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by service
    if (service) {
      query.service = service;
    }

    const total = await Contact.countDocuments(query);

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v");

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Update contact status
 * @route   PATCH /api/contact/:id
 * @access  Admin (future)
 */
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["new", "in-progress", "resolved"];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact status updated",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};


