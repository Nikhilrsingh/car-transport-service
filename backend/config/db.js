import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error(
      "MONGO_URI not found. Please copy .env.example to .env and set MongoDB connection string."
    );
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    let detailedMessage = "MongoDB connection failed.\n";

    if (mongoURI.includes("mongodb+srv")) {
      detailedMessage +=
        "You are using MongoDB Atlas. Please check:\n" +
        "- Username & password\n" +
        "- IP whitelist in Atlas Network Access\n" +
        "- Internet connection\n";
    } else {
      detailedMessage +=
        "Please ensure MongoDB is running locally on mongodb://localhost:27017\n";
    }

    detailedMessage += `Error details: ${error.message}`;

    throw new Error(detailedMessage);
  }
};

export default connectDB;
