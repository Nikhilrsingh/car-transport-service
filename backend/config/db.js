import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error(
      "MONGO_URI not found. Please copy .env.example to .env and set MongoDB connection string."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed.");

    if (mongoURI.includes("mongodb+srv")) {
      console.error(
        "You are using MongoDB Atlas. Please check:\n" +
          "- Username & password\n" +
          "- IP whitelist in Atlas Network Access\n" +
          "- Internet connection"
      );
    } else {
      console.error(
        "Please ensure MongoDB is running locally on mongodb://localhost:27017"
      );
    }

    console.error("Error details:", error.message);
    process.exit(1);
  }
};

export default connectDB;
