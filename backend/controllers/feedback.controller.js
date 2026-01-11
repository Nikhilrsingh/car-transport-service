import Feedback from "../models/feedback.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

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

// CREATE FEEDBACK
export const createFeedback = async (req, res, next) => {
  try {
    console.log("BODY:", req.body); // Check what's in body
    console.log("FILES:", req.files);

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
        ? {
            url: profilePicData.secure_url,
            public_id: profilePicData.public_id,
          }
        : undefined,
      productImage: productImageData
        ? {
            url: productImageData.secure_url,
            public_id: productImageData.public_id,
          }
        : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};




// GET ALL FEEDBACKS
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    next(error);
  }
};

// UPDATE STATUS
export const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    feedback.status = status || feedback.status;
    await feedback.save();

    res.json({
      success: true,
      message: "Status updated",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE FEEDBACK + CLOUDINARY CLEANUP
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (feedback.profilePic?.public_id) {
      await cloudinary.uploader.destroy(String(feedback.profilePic.public_id));
    }

    if (feedback.productImage?.public_id) {
      await cloudinary.uploader.destroy(String(feedback.productImage.public_id));
    }

    await feedback.deleteOne();

    res.json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    next(error);
  }
};
