// Populate environment variables from .env.example so tests don't crash 
// when expecting API keys (like Google OAuth) to be present.
import dotenv from "dotenv";
dotenv.config({ path: ".env.example" });

// If any required variables are missing even from .env.example, provide fallbacks here
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "test-google-client-secret";
process.env.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "test-session-secret";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
