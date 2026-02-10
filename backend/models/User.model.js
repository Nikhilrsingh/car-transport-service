import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      minlength: 8,
      select: false, // never return password
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\+91[6-9]\d{9}$/, "Invalid Indian phone number"],
    },

    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },

    profilePicture: {
      type: String,
      default: "",
    },

    googleId: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
