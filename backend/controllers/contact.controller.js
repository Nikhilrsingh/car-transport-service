import Contact from "../models/contact.model.js";

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      vehicle,
      service,
      message,
    } = req.body;

    // Basic validation (extra safety beyond Mongoose)
    if (!name || !phone || !email || !vehicle || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Images placeholder (for future Multer/Cloudinary)
    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
        }))
      : [];

    const contact = await Contact.create({
      name,
      phone,
      email,
      vehicle,
      service,
      message,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages (Admin)
 * @route   GET /api/contact
 * @access  Admin (future)
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

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

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    contact.status = status || contact.status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact status updated",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
