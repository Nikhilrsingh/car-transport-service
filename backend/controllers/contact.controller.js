import Contact from "../models/contact.model.js";
import { sendContactEmail } from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { success, error } from "../utils/response.js";

/**
 * Upload file buffer to Cloudinary.
 * Returns a Promise that resolves with the Cloudinary upload result.
 */
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * @desc    Submit contact form with optional Cloudinary file uploads
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
      message = "",
    } = req.body || {};

    // Trim & normalize input
    name = name?.trim();
    email = email?.trim().toLowerCase();
    message = message?.trim();

    // Validate required fields
    if (!name || !phone || !email || !vehicle || !service || !message) {
      return error(res, 400, "All required fields must be filled");
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
        } catch (uploadErr) {
          // Log individual file failures but don't abort the whole submission
          console.error("Failed to upload file:", uploadErr.message);
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

    // Build HTML for images (non-blocking email notification)
    let imagesHtml = "";
    if (contact.images && contact.images.length > 0) {
      imagesHtml = contact.images
        .map(
          (img) =>
            `<p><strong>Image:</strong><br><img src="${img.url}" alt="Contact Image" style="max-width:300px;"/></p>`
        )
        .join("");
    }

    // Fire-and-forget — email failure must not affect the HTTP response
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
        ${imagesHtml}
      `,
    }).catch((emailErr) => {
      console.error("Email failed but contact saved:", emailErr.message);
    });

    return success(res, 201, "Message sent successfully", contact);
  } catch (err) {
    next(err);
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

    // Search by name, email, phone, or vehicle
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { vehicle: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (service) query.service = service;

    const total = await Contact.countDocuments(query);

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v");

    return success(res, 200, "Contacts fetched successfully", {
      total,
      page: Number(page),
      limit: Number(limit),
      data: contacts,
    });
  } catch (err) {
    next(err);
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
      return error(res, 400, "Status is required");
    }

    if (!allowedStatus.includes(status)) {
      return error(res, 400, "Invalid status value");
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return error(res, 404, "Contact message not found");
    }

    return success(res, 200, "Contact status updated", contact);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single contact by ID
 * @route   GET /api/contact/:id
 * @access  Admin (future)
 */
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id).select("-__v");

    if (!contact) {
      return error(res, 404, "Contact not found");
    }

    return success(res, 200, "Contact fetched successfully", contact);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a contact by ID
 * @route   DELETE /api/contact/:id
 * @access  Admin (future)
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return error(res, 404, "Contact not found");
    }

    return success(res, 200, "Contact deleted successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle read/unread status for a contact
 * @route   PATCH /api/contact/:id/read
 * @access  Admin (future)
 */
export const toggleReadStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return error(res, 404, "Contact not found");
    }

    contact.isRead = !contact.isRead;
    await contact.save();

    return success(res, 200, "Read status updated", contact);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get contact statistics grouped by status
 * @route   GET /api/contact/stats
 * @access  Admin (future)
 */
export const getContactStats = async (req, res, next) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Contact.countDocuments();

    return success(res, 200, "Contact stats fetched successfully", {
      total,
      stats,
    });
  } catch (err) {
    next(err);
  }
};
