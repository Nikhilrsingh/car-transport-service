import "dotenv/config.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import session from "cookie-session";
import "./config/passport.js";
import contactRoutes from "./routes/contact.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import emergencyRoutes from "./routes/emergencyRequest.routes.js";
import inspectionRoutes from "./routes/inspection.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import reviewRoutes from "./routes/review.routes.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://127.0.0.1:5500",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET || "secretkey"],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }),
);

// Passport 0.6.0+ requires regenerate and save methods, which cookie-session doesn't have.
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

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
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
