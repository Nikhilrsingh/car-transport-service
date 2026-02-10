import dotenv from "dotenv";
dotenv.config();

import { notFound, errorHandler } from "./middleware/error.middleware.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import session from "cookie-session";
import "./config/passport.js";
import contactRoutes from './routes/contact.routes.js'
import feedbackRoutes from "./routes/feedback.routes.js";
import enquiryRoutes from './routes/enquiry.routes.js'
import emergencyRoutes from './routes/emergencyRequest.routes.js'
import inspectionRoutes from './routes/inspection.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import profileRoutes from './routes/profile.routes.js'



// Optional: check if env vars are loaded
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

connectDB();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET || "secretkey"],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);

app.use(notFound)
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
