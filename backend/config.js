module.exports = {
  // Get this from Google Cloud Console: https://console.cloud.google.com/
  // 1. Create a project or select existing
  // 2. Go to "Credentials" in APIs & Services
  // 3. Create "OAuth 2.0 Client IDs"
  // 4. Add http://localhost:8000 to authorized origins
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  
  // Generate a secure JWT signing
  JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
  
  // Database configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/car-transport-service',
  
  // Server configuration
  PORT: process.env.PORT || 5000
};