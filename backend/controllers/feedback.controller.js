import Feedback from "../models/feedback.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { success, error } from "../utils/response.js";

/**
 * Upload an in-memory file buffer to Cloudinary.
 * Returns a Promise that resolves with the upload result object.
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
 * @desc    Submit a new feedback entry (with optional image uploads)
 * @route   POST /api/feedbacks
 * @access  Public
 */
export const createFeedback = async (req, res, next) => {
  try {
    const { username, stars, message } = req.body;

    let profilePicData, productImageData;

    if (req.files?.profilePic?.[0]) {
      profilePicData = await uploadToCloudinary(
        req.files.profilePic[0].buffer,
        "Car_transport_feedback/profile"
      );
    }

    if (req.files?.productImage?.[0]) {
      productImageData = await uploadToCloudinary(
        req.files.productImage[0].buffer,
        "Car_transport_feedback/product"
      );
    }

    const feedback = await Feedback.create({
      username,
      stars,
      message,
      profilePic: profilePicData
        ? { url: profilePicData.secure_url, public_id: profilePicData.public_id }
        : undefined,
      productImage: productImageData
        ? { url: productImageData.secure_url, public_id: productImageData.public_id }
        : undefined,
    });

    return success(res, 201, "Feedback submitted", feedback);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all feedbacks (admin dashboard)
 * @route   GET /api/feedbacks
 * @access  Admin (future)
 */
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status, stars } = req.query;

    const query = {};

    // Search by username or message
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    if (stars) query.stars = Number(stars);
    if (status) query.status = status;

    const total = await Feedback.countDocuments(query);

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return success(res, 200, "Feedbacks fetched successfully", {
      total,
      page: Number(page),
      limit: Number(limit),
      data: feedbacks,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update feedback status (approve / reject / pending)
 * @route   PATCH /api/feedbacks/:id/status
 * @access  Admin (future)
 */
export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return error(res, 404, "Feedback not found");
    }

    feedback.status = status || feedback.status;
    await feedback.save();

    return success(res, 200, "Status updated", feedback);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a feedback entry and its Cloudinary images
 * @route   DELETE /api/feedbacks/:id
 * @access  Admin (future)
 */
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return error(res, 404, "Feedback not found");
    }

    // Clean up Cloudinary assets before removing the DB document
    if (feedback.profilePic?.public_id) {
      await cloudinary.uploader.destroy(String(feedback.profilePic.public_id));
    }

    if (feedback.productImage?.public_id) {
      await cloudinary.uploader.destroy(String(feedback.productImage.public_id));
    }

    await feedback.deleteOne();

    return success(res, 200, "Feedback deleted");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single feedback by ID
 * @route   GET /api/feedbacks/:id
 * @access  Admin (future)
 */
export const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return error(res, 404, "Feedback not found");
    }

    return success(res, 200, "Feedback fetched successfully", feedback);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all approved feedbacks for public display
 * @route   GET /api/feedbacks/public
 * @access  Public
 */
export const getPublicFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .select("username stars message profilePic productImage");

    return success(res, 200, "Public feedbacks fetched successfully", feedbacks);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get feedback statistics grouped by status and star rating
 * @route   GET /api/feedbacks/stats
 * @access  Admin (future)
 */
export const getFeedbackStats = async (req, res, next) => {
  try {
    const total = await Feedback.countDocuments();

    const byStatus = await Feedback.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byStars = await Feedback.aggregate([
      { $group: { _id: "$stars", count: { $sum: 1 } } },
    ]);

    return success(res, 200, "Feedback stats fetched successfully", {
      total,
      byStatus,
      byStars,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle the featured flag on a feedback entry
 * @route   PATCH /api/feedbacks/:id/featured
 * @access  Admin (future)
 */
export const toggleFeaturedFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return error(res, 404, "Feedback not found");
    }

    feedback.isFeatured = !feedback.isFeatured;
    await feedback.save();

    return success(res, 200, "Featured status updated", feedback);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get the average star rating for approved feedbacks
 * @route   GET /api/feedbacks/average-rating
 * @access  Public
 */
export const getAverageRating = async (req, res, next) => {
  try {
    const result = await Feedback.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$stars" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    return success(res, 200, "Average rating fetched", result[0] || { avgRating: 0, totalRatings: 0 });
  } catch (err) {
    next(err);
  }
};
