import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    vehicle: {
      type: String,
      required: [true, "Vehicle type is required"],
    },

    service: {
      type: String,
      required: [true, "Service type is required"],
      enum: [
        "quote",
        "booking",
        "support",
        "complaint",
        "other",
      ],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: 500,
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    ],

    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
