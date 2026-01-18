import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    profilePic: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    productImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    username: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    stars: {
      type: Number,
      required: [true, "Star rating is required"],
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
