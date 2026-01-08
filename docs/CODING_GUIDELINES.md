# Coding Guidelines

> Professional coding standards and best practices for Car Transport Service

## 📋 Table of Contents

- [General Principles](#general-principles)
- [Backend Guidelines](#backend-guidelines)
- [Frontend Guidelines](#frontend-guidelines)
- [Code Style](#code-style)
- [Error Handling](#error-handling)
- [Security](#security)
- [Performance](#performance)
- [Documentation](#documentation)
- [Testing](#testing)

---

## 🎯 General Principles

### 1. **Readability First**
- Code should be self-documenting
- Use meaningful variable and function names
- Prefer clarity over cleverness
- Write code as if someone else will maintain it

### 2. **DRY (Don't Repeat Yourself)**
- Extract common functionality into reusable functions
- Create utility modules for shared logic
- Avoid code duplication

### 3. **KISS (Keep It Simple, Stupid)**
- Prefer simple solutions over complex ones
- Don't over-engineer
- Solve the problem at hand, not future problems

### 4. **Consistency**
- Follow established patterns in the codebase
- Use consistent formatting and style
- Maintain consistent naming conventions

### 5. **Separation of Concerns**
- Keep business logic separate from presentation
- Separate data access from business logic
- One function should do one thing well

---

## 🔧 Backend Guidelines

### File Structure

```javascript
// 1. Imports (external packages first)
import express from "express";
import mongoose from "mongoose";

// 2. Imports (internal modules)
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";

// 3. Constants
const MAX_RETRIES = 3;
const TOKEN_EXPIRY = "24h";

// 4. Main code
export const functionName = async (req, res) => {
  // Implementation
};
```

### Controllers

**✅ DO:**
```javascript
// Clear, focused controller function
export const createBooking = async (req, res) => {
  try {
    const { userId, vehicleId, pickupDate } = req.body;

    // Validation
    if (!userId || !vehicleId || !pickupDate) {
      return error(res, 400, "Missing required fields");
    }

    // Business logic
    const booking = await Booking.create({
      userId,
      vehicleId,
      pickupDate: new Date(pickupDate),
      status: "pending"
    });

    // Response
    return success(res, 201, "Booking created", { booking });
  } catch (err) {
    return error(res, 500, err.message);
  }
};
```

**❌ DON'T:**
```javascript
// Too much logic, unclear error handling
export const createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};
```

### Models

**✅ DO:**
```javascript
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },
    pickupDate: {
      type: Date,
      required: true,
      validate: {
        validator: (date) => date > new Date(),
        message: "Pickup date must be in the future"
      }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Indexes
bookingSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
```

**❌ DON'T:**
```javascript
// Missing validation, no indexes, unclear structure
const bookingSchema = new mongoose.Schema({
  userId: String,
  vehicleId: String,
  pickupDate: Date
});
```

### Routes

**✅ DO:**
```javascript
import express from "express";
import { createBooking, getBookings } from "../controllers/booking.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBooking } from "../middleware/validation.middleware.js";

const router = express.Router();

// Protected routes
router.post("/", authenticate, validateBooking, createBooking);
router.get("/", authenticate, getBookings);

export default router;
```

**❌ DON'T:**
```javascript
// Inline logic, no middleware, no structure
router.post("/", async (req, res) => {
  // Logic here
});
```

### Error Handling

**✅ DO:**
```javascript
// Use centralized error handling
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return error(res, 404, "Booking not found");
    }

    return success(res, 200, "Booking retrieved", { booking });
  } catch (err) {
    if (err.name === "CastError") {
      return error(res, 400, "Invalid booking ID");
    }
    return error(res, 500, err.message);
  }
};
```

**❌ DON'T:**
```javascript
// Generic error handling, no specific cases
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
};
```

### Async/Await

**✅ DO:**
```javascript
// Use async/await consistently
export const processBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(id);
    const user = await User.findById(booking.userId);
    const vehicle = await Vehicle.findById(booking.vehicleId);
    
    return success(res, 200, "Data retrieved", { booking, user, vehicle });
  } catch (err) {
    return error(res, 500, err.message);
  }
};
```

**❌ DON'T:**
```javascript
// Mixing promises and callbacks
export const processBooking = (req, res) => {
  Booking.findById(id).then(booking => {
    User.findById(booking.userId).then(user => {
      res.json({ booking, user });
    });
  });
};
```

---

## 🎨 Frontend Guidelines

### HTML Structure

**✅ DO:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking - Car Transport Service</title>
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/pages/booking.css">
</head>
<body>
  <!-- Semantic HTML -->
  <header>
    <!-- Navigation -->
  </header>
  
  <main>
    <section class="booking-section">
      <h1>Book Your Transport</h1>
      <!-- Content -->
    </section>
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
  
  <script type="module" src="../js/modules/booking.js"></script>
</body>
</html>
```

**❌ DON'T:**
```html
<!-- Non-semantic, inline styles, no structure -->
<div>
  <div class="header">
    <div>Nav</div>
  </div>
  <div style="color: red;">Content</div>
</div>
```

### CSS Organization

**✅ DO:**
```css
/* ================= VARIABLES ================= */
:root {
  --primary-color: #ff6b35;
  --spacing-unit: 8px;
}

/* ================= BASE STYLES ================= */
.booking-section {
  padding: var(--spacing-unit) * 3;
  max-width: 1200px;
  margin: 0 auto;
}

/* ================= COMPONENTS ================= */
.booking-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-unit) * 2;
}

.booking-form__input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.booking-form__input--error {
  border-color: var(--error-color);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .booking-section {
    padding: var(--spacing-unit) * 2;
  }
}
```

**❌ DON'T:**
```css
/* No organization, magic numbers, no variables */
.booking {
  padding: 24px;
  width: 1200px;
}

.input {
  padding: 12px;
  border: 1px solid #ddd;
}
```

### JavaScript Modules

**✅ DO:**
```javascript
// booking.js
/**
 * Booking form handler
 * Handles form submission and validation
 */

// ================= CONSTANTS =================
const FORM_SELECTOR = "#bookingForm";
const API_ENDPOINT = "/api/bookings";

// ================= DOM ELEMENTS =================
const form = document.querySelector(FORM_SELECTOR);
const submitButton = form?.querySelector(".submit-btn");

// ================= VALIDATION =================
const validateForm = (formData) => {
  const errors = [];
  
  if (!formData.get("pickupDate")) {
    errors.push("Pickup date is required");
  }
  
  return errors;
};

// ================= FORM SUBMISSION =================
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const errors = validateForm(formData);
  
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }
  
  try {
    submitButton.disabled = true;
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    showSuccess(data.message);
    form.reset();
  } catch (error) {
    showError("Failed to submit booking");
  } finally {
    submitButton.disabled = false;
  }
};

// ================= INITIALIZATION =================
if (form) {
  form.addEventListener("submit", handleSubmit);
}
```

**❌ DON'T:**
```javascript
// No structure, global variables, no error handling
let form = document.getElementById("form");

form.onsubmit = function() {
  fetch("/api/bookings", {
    method: "POST",
    body: new FormData(form)
  }).then(r => r.json()).then(d => alert("Success"));
};
```

### Event Handling

**✅ DO:**
```javascript
// Use event delegation for dynamic content
document.addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) {
    handleDelete(e.target.dataset.id);
  }
});

// Remove event listeners when needed
const cleanup = () => {
  form.removeEventListener("submit", handleSubmit);
};
```

**❌ DON'T:**
```javascript
// Inline handlers, memory leaks
document.getElementById("btn").onclick = function() {
  // Handler
};
```

---

## 💅 Code Style

### Indentation
- **Backend**: 2 spaces
- **Frontend**: 2 spaces
- **Never mix tabs and spaces**

### Semicolons
- **Always use semicolons** in JavaScript
- Consistent with project style

### Quotes
- **Backend**: Single quotes for strings (if consistent)
- **Frontend**: Double quotes for HTML attributes, single for JS strings
- **Be consistent** within files

### Line Length
- Maximum 100 characters per line
- Break long lines logically

### Spacing
```javascript
// ✅ Good spacing
const calculateTotal = (price, quantity) => {
  return price * quantity;
};

// ❌ Bad spacing
const calculateTotal=(price,quantity)=>{
  return price*quantity;
};
```

---

## 🛡️ Error Handling

### Backend Error Responses

```javascript
// Use standardized error responses
export const error = (res, statusCode, message, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details })
  });
};
```

### Frontend Error Handling

```javascript
// Handle errors gracefully
try {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error("Fetch error:", error);
  showUserFriendlyError("Unable to load data. Please try again.");
  return null;
}
```

---

## 🔒 Security

### Backend Security

**✅ DO:**
```javascript
// Validate and sanitize input
import validator from "validator";

const sanitizeInput = (input) => {
  return validator.escape(validator.trim(input));
};

// Use parameterized queries (Mongoose handles this)
const user = await User.findOne({ email: sanitizeInput(email) });

// Hash passwords
const hashedPassword = await bcrypt.hash(password, 12);

// Use environment variables
const dbUrl = process.env.DATABASE_URL;
```

**❌ DON'T:**
```javascript
// Never trust user input
const query = `SELECT * FROM users WHERE email = '${email}'`;
const user = await db.query(query);
```

### Frontend Security

**✅ DO:**
```javascript
// Sanitize user input before display
const sanitizeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

// Use Content Security Policy
// Validate on client AND server
```

**❌ DON'T:**
```javascript
// Never use innerHTML with user input
element.innerHTML = userInput; // XSS vulnerability!
```

---

## ⚡ Performance

### Backend Performance

```javascript
// Use indexes for frequent queries
bookingSchema.index({ userId: 1, status: 1 });

// Paginate large datasets
const getBookings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const bookings = await Booking.find()
    .skip(skip)
    .limit(limit)
    .lean(); // Use lean() for read-only queries
};
```

### Frontend Performance

```javascript
// Lazy load images
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" alt="...">

// Debounce search inputs
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Use event delegation
document.addEventListener("click", handleClick);
```

---

## 📝 Documentation

### Function Documentation

```javascript
/**
 * Creates a new booking for a user
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.userId - User ID
 * @param {string} req.body.vehicleId - Vehicle ID
 * @param {Date} req.body.pickupDate - Pickup date
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Created booking object
 * @throws {Error} If validation fails or database error occurs
 */
export const createBooking = async (req, res) => {
  // Implementation
};
```

### Code Comments

```javascript
// ✅ Good comments
// Calculate total including tax (18% GST)
const totalWithTax = basePrice * 1.18;

// ❌ Bad comments
// Add tax
const total = price * 1.18;
```

---

## 🧪 Testing

### Test Structure

```javascript
// booking.test.js
import { createBooking } from "./booking.controller.js";

describe("Booking Controller", () => {
  describe("createBooking", () => {
    it("should create a booking with valid data", async () => {
      // Test implementation
    });
    
    it("should return error for missing fields", async () => {
      // Test implementation
    });
  });
});
```

---

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Last Updated:** December 2024  
**Version:** 1.0