import Contact from "../models/contact.model.js";
import { sendContactEmail } from "../utils/sendEmail.js";

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    let { name, phone, email, vehicle, service, message } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    message = message?.trim();

    if (!name || !phone || !email || !vehicle || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const images =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
      })) || [];

    const contact = await Contact.create({
      name,
      phone,
      email,
      vehicle,
      service,
      message,
      images,
    });

    // 🔥 NON-BLOCKING EMAIL
    sendContactEmail({
      subject: "📩 New Contact Form Submission",
      html: `
        <h2>New Contact Received</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone}</p>
        <p><strong>Vehicle:</strong> ${contact.vehicle}</p>
        <p><strong>Service:</strong> ${contact.service}</p>
        <p>${contact.message}</p>
      `,
    }).catch((err) => {
      console.error("Email failed but contact saved:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Admin (future)
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: contacts.length,
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
