import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import session from "cookie-session";
import "./config/passport.js"; 
import contactRoutes from './routes/contact.routes.js'


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

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
