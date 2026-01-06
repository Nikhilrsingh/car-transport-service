# Backend Code Documentation

This document provides a comprehensive explanation of the backend codebase for the Car Transport Service platform. This is an open-source authentication system built with Node.js, Express.js, and MongoDB.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Structure](#architecture--structure)
- [File-by-File Documentation](#file-by-file-documentation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Dependencies](#dependencies)
- [Setup Instructions](#setup-instructions)

---

## Project Overview

This backend implements a robust authentication system supporting:
- **Email/Password Authentication**: Traditional registration and login with password hashing
- **Google OAuth 2.0**: Social authentication via Google
- **JWT Token-Based Authentication**: Stateless authentication using JSON Web Tokens
- **Session Management**: Cookie-based sessions for OAuth flow

### Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (via Mongoose)
- **Authentication**: 
  - JWT (jsonwebtoken)
  - Passport.js with Google OAuth 2.0 strategy
  - bcryptjs for password hashing
- **Session**: cookie-session
- **Security**: CORS enabled, environment-based configuration

---

## Architecture & Structure

The project follows a **MVC (Model-View-Controller)** pattern with clear separation of concerns:

```
backend/
├── config/          # Configuration files (DB, Passport)
├── controllers/     # Business logic handlers
├── middleware/      # Request middleware (auth, validation)
├── models/          # Database schemas (Mongoose models)
├── routes/          # API route definitions
├── utils/           # Helper functions (JWT, validators, responses)
└── server.js        # Application entry point
```

---

## File-by-File Documentation

### 1. `server.js` - Application Entry Point

**Purpose**: Main server file that initializes the Express application and configures middleware.

**Key Components**:

- **Environment Configuration**: 
  - Uses `dotenv` to load environment variables (MUST be loaded first)
  - Logs Google OAuth credentials for debugging (remove in production)

- **Express Setup**:
  - Creates Express application instance
  - Configures CORS with wildcard origin and credentials enabled
  - Parses JSON request bodies

- **Session Configuration**:
  - Uses `cookie-session` middleware for session management
  - Session keys from environment (falls back to "secretkey")
  - 24-hour session expiration (1 day)

- **Passport Integration**:
  - Initializes Passport middleware
  - Enables Passport session support for OAuth flow

- **Routes**:
  - Mounts authentication routes at `/api/auth`
  - 404 handler for undefined routes

- **Server Startup**:
  - Connects to MongoDB database
  - Starts server on port from environment (default: 3000)

**Important Notes**:
- Environment variables must be loaded before importing Passport config
- The debug console.logs for Google credentials should be removed in production

---

### 2. `config/db.js` - Database Connection

**Purpose**: Establishes connection to MongoDB database using Mongoose.

**Functionality**:
- Asynchronously connects to MongoDB using connection string from `MONGO_URI`
- Logs success message on connection
- Exits process with code 1 if connection fails (prevents server from running without DB)

**Error Handling**:
- Catches connection errors and logs them
- Process exits to prevent server from starting without database

---

### 3. `config/passport.js` - Passport Strategy Configuration

**Purpose**: Configures Google OAuth 2.0 authentication strategy using Passport.js.

**Components**:

- **Google Strategy Setup**:
  - Client ID: Hardcoded (consider moving to env)
  - Client Secret: From `GOOGLE_CLIENT_SECRET` environment variable
  - Callback URL: From `GOOGLE_CALLBACK_URL` environment variable

- **Strategy Callback Function**:
  - Receives user profile from Google
  - Checks if user exists by `googleId`
  - Creates new user if doesn't exist (name, email, googleId)
  - Returns user to Passport (via `done()`)

- **Session Serialization**:
  - `serializeUser`: Stores user ID in session
  - `deserializeUser`: Retrieves full user object from database using session ID

**Important Notes**:
- Google Client ID is hardcoded - consider moving to environment variables
- User creation is automatic on first Google login

---

### 4. `models/User.model.js` - User Schema Definition

**Purpose**: Defines the User data model/schema for MongoDB using Mongoose.

**Schema Fields**:

- **name** (String):
  - Trimmed (whitespace removed)
  - Min length: 2 characters
  - Max length: 50 characters

- **email** (String):
  - Lowercase automatically
  - Unique constraint (sparse index - allows null/undefined)
  - Regex validation: Standard email format (`/^\S+@\S+\.\S+$/`)

- **password** (String):
  - Min length: 4 characters
  - **`select: false`**: Never returned in queries (security feature)
  - Must use `.select("+password")` to include in queries

- **phone** (String):
  - Unique constraint (sparse index)
  - Regex validation: Indian phone format (`/^\+91[6-9]\d{9}$/`)
  - Must start with +91, followed by 6-9, then 9 digits

- **googleId** (String):
  - Stores Google user ID for OAuth users
  - No validation constraints

- **timestamps**: Automatically adds `createdAt` and `updatedAt` fields

**Features**:
- Sparse indexes allow multiple null values while enforcing uniqueness for non-null values
- Password field is excluded from queries by default for security

---

### 5. `controllers/auth.controller.js` - Authentication Business Logic

**Purpose**: Contains all authentication-related controller functions (register, login, logout, Google login).

#### 5.1 `register()` - User Registration

**Flow**:
1. Validates required fields (name, email, password)
2. Validates email format using validator utility
3. Validates password strength (8+ chars, uppercase, number, symbol)
4. Checks if user already exists
5. Hashes password using bcryptjs (12 rounds)
6. Creates new user in database
7. Generates JWT token
8. Returns token and user info (without password)

**Error Handling**:
- 400: Missing fields or invalid input
- 409: User already exists (conflict)
- 500: Server errors

**Security**:
- Password hashed with 12 bcrypt rounds (strong security)
- Password never returned in response
- Email validation prevents invalid formats

#### 5.2 `login()` - User Login

**Flow**:
1. Validates email and password are provided
2. Finds user by email (explicitly selects password field with `.select("+password")`)
3. Compares provided password with hashed password using bcrypt
4. Generates JWT token on success
5. Returns token and user info

**Error Handling**:
- 400: Missing credentials
- 401: Invalid credentials (user not found or wrong password)
- 500: Server errors

**Security**:
- Uses bcrypt comparison (timing-safe)
- Generic "Invalid credentials" message (prevents user enumeration)
- Password field explicitly selected for comparison

#### 5.3 `logout()` - User Logout

**Flow**:
1. Clears the token cookie
2. Sets cookie options (httpOnly, secure in production)
3. Returns success message

**Security**:
- Cookie cleared client-side
- `httpOnly: true` prevents JavaScript access
- `secure: true` in production (HTTPS only)

#### 5.4 `googleLogin()` - Google OAuth Success Handler

**Flow**:
1. Receives authenticated user from Passport (via `req.user`)
2. Generates JWT token
3. Returns token and user info (id, email, name)

**Usage**:
- Called after successful Google OAuth authentication
- User object is provided by Passport middleware

---

### 6. `routes/auth.routes.js` - Authentication Routes

**Purpose**: Defines HTTP routes for authentication endpoints.

**Routes**:

- **POST `/api/auth/register`**: User registration
- **POST `/api/auth/login`**: User login
- **POST `/api/auth/logout`**: User logout
- **GET `/api/auth/google`**: Initiates Google OAuth flow
- **GET `/api/auth/google/callback`**: Google OAuth callback handler

**OAuth Flow**:
1. User visits `/api/auth/google`
2. Passport redirects to Google login
3. Google redirects back to `/api/auth/google/callback`
4. Passport authenticates and calls callback handler
5. Callback handler generates token and redirects to frontend

**Important Note**:
- The callback route references `generateToken` but doesn't import it - this will cause a runtime error. The import should be added: `import { generateToken } from "../utils/jwt.js";`

---

### 7. `middleware/auth.middleware.js` - JWT Authentication Middleware

**Purpose**: Protects routes by verifying JWT tokens in request headers.

**Functionality**:
- Extracts token from `Authorization` header (format: `Bearer <token>`)
- Verifies token using JWT_SECRET
- Attaches decoded token (user ID) to `req.user`
- Calls `next()` to continue request chain

**Error Handling**:
- 401: Missing or invalid Authorization header format
- 403: Invalid or expired token

**Usage**:
```javascript
import authMiddleware from "./middleware/auth.middleware.js";
router.get("/protected", authMiddleware, protectedController);
```

---

### 8. `utils/jwt.js` - JWT Token Generation

**Purpose**: Utility function for generating JSON Web Tokens.

**Function**: `generateToken(userId)`
- Creates JWT token with user ID as payload
- Signs with `JWT_SECRET` from environment
- Sets expiration to 7 days
- Returns signed token string

**Security**:
- Token contains minimal payload (only user ID)
- Secret key stored in environment variables
- 7-day expiration balances security and user experience

---

### 9. `utils/response.js` - Standardized Response Helpers

**Purpose**: Provides consistent API response format.

**Functions**:

- **`success(res, status, message, data = {})`**:
  - Sends success response with status code, message, and optional data
  - Format: `{ success: true, message: "...", data: {...} }`

- **`error(res, status, message)`**:
  - Sends error response with status code and message
  - Format: `{ success: false, message: "..." }`

**Benefits**:
- Consistent response structure across all endpoints
- Easier frontend integration
- Standardized error handling

---

### 10. `utils/validators.js` - Input Validation Utilities

**Purpose**: Reusable validation functions for user input.

**Functions**:

- **`isEmailValid(email)`**:
  - Regex: `/^\S+@\S+\.\S+$/`
  - Checks for valid email format (no spaces, @ symbol, domain)

- **`isStrongPassword(password)`**:
  - Regex: `/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/`
  - Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one digit
    - At least one special character (@$!%*?&)

- **`isValidPhone(phone)`**:
  - Regex: `/^\+91[6-9]\d{9}$/`
  - Validates Indian phone numbers
  - Format: +91 followed by 6-9, then 9 digits

**Usage**:
- Used in controllers for input validation
- Centralized validation logic for reusability

---

## Environment Variables

All environment variables are defined in `.env` file (use `.env.example` as template).

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_key_here` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxxx` |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | `http://localhost:3000/api/auth/google/callback` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `NODE_ENV` | Environment (development/production) | - |
| `SESSION_SECRET` | Secret for session encryption | `secretkey` |

**Note**: See `.env.example` file for complete template with descriptions.

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com"
    }
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com"
    }
  }
}
```

#### POST `/api/auth/logout`
Logout and clear authentication cookie.

**Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/api/auth/google`
Initiates Google OAuth authentication flow.

**Response**: Redirects to Google login page.

#### GET `/api/auth/google/callback`
Google OAuth callback endpoint (handled by Passport).

**Response**: Redirects to frontend with token.

---

## Security Features

### 1. Password Security
- **Hashing**: bcryptjs with 12 rounds (strong encryption)
- **Storage**: Passwords never stored in plain text
- **Validation**: Strong password requirements enforced
- **Query Exclusion**: Password field excluded from queries by default

### 2. JWT Authentication
- **Stateless**: No server-side session storage
- **Signed**: Tokens cryptographically signed
- **Expiration**: 7-day token expiration
- **Secret**: Secret key stored in environment variables

### 3. Input Validation
- **Email**: Regex validation for format
- **Password**: Complexity requirements
- **Phone**: Indian phone number format validation
- **Sanitization**: Name trimming, email lowercasing

### 4. CORS Configuration
- **Enabled**: Cross-origin requests allowed
- **Credentials**: Credentials support enabled
- **Wildcard Origin**: Currently allows all origins (consider restricting in production)

### 5. Session Security
- **Cookie Sessions**: Encrypted cookie-based sessions
- **HttpOnly**: Cookies not accessible via JavaScript
- **Secure Flag**: HTTPS-only in production

### 6. Error Handling
- **Generic Messages**: Prevents user enumeration (e.g., "Invalid credentials")
- **Status Codes**: Proper HTTP status codes
- **Error Logging**: Server errors logged (consider adding proper logging)

---

## Dependencies

### Core Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing

### Authentication Dependencies

- **jsonwebtoken**: JWT token creation and verification
- **passport**: Authentication middleware
- **passport-google-oauth20**: Google OAuth 2.0 strategy
- **bcryptjs**: Password hashing
- **cookie-session**: Session management

### Development Dependencies

None specified (consider adding nodemon, jest, etc.)

---

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB database (local or Atlas)
- Google OAuth credentials (for Google login)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd car-transport-service/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MongoDB**:
   - Create MongoDB database (local or Atlas)
   - Update `MONGO_URI` in `.env`

5. **Configure Google OAuth**:
   - Create Google OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
   - Add callback URL: `http://localhost:3000/api/auth/google/callback`
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

6. **Generate JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Add output to `JWT_SECRET` in `.env`

7. **Start the server**:
   ```bash
   npm start
   ```

8. **Verify**:
   - Server should log: "MongoDB connected" and "Server running on port 3000"

### Testing the API

Use tools like Postman, curl, or your frontend application:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!@#"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

---

## Known Issues & Recommendations

### Issues

1. **Routes Bug**: `auth.routes.js` uses `generateToken` without importing it
   - **Fix**: Add `import { generateToken } from "../utils/jwt.js";`

2. **Hardcoded Google Client ID**: Client ID is hardcoded in `config/passport.js`
   - **Recommendation**: Move to `GOOGLE_CLIENT_ID` environment variable

3. **Debug Logs**: Console.logs for Google credentials in `server.js`
   - **Recommendation**: Remove in production or use proper logging library

4. **Wildcard CORS**: Currently allows all origins
   - **Recommendation**: Restrict to specific frontend URL in production

### Recommendations for Production

1. **Error Logging**: Implement proper logging (Winston, Pino, etc.)
2. **Rate Limiting**: Add rate limiting for authentication endpoints
3. **Input Sanitization**: Add input sanitization library (express-validator)
4. **HTTPS**: Ensure HTTPS in production
5. **Environment Variables**: Use environment-specific `.env` files
6. **Testing**: Add unit and integration tests
7. **Documentation**: Consider adding Swagger/OpenAPI documentation
8. **Database Indexing**: Add indexes for frequently queried fields
9. **Password Reset**: Implement password reset functionality
10. **Email Verification**: Add email verification for new registrations

---

## Contributing

This is an open-source project. When contributing:

1. Follow the existing code structure
2. Add proper error handling
3. Use the response utilities for consistency
4. Validate all inputs
5. Update this documentation for new features
6. Test your changes thoroughly

---

## License

See LICENSE file in the root directory.

---

## Support

For issues, questions, or contributions, please refer to the main project README or open an issue on the repository.

