// controllers/feedback.controller.js
import Feedback from "../models/feedback.model.js";

// Create a new feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { picUrl, productImgUrl, username, stars, message } = req.body;

    const feedback = await Feedback.create({
      picUrl,
      productImgUrl,
      username,
      stars,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// Update feedback status (approve/reject)
export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.status = status || feedback.status;
    await feedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
