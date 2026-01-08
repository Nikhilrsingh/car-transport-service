# Naming Conventions

> Comprehensive naming standards for files, variables, functions, and components

## 📋 Table of Contents

- [General Rules](#general-rules)
- [Backend Naming](#backend-naming)
- [Frontend Naming](#frontend-naming)
- [Database Naming](#database-naming)
- [API Naming](#api-naming)
- [Examples](#examples)

---

## 🎯 General Rules

### Principles

1. **Be Descriptive**: Names should clearly indicate purpose
2. **Be Consistent**: Follow the same pattern throughout the project
3. **Be Concise**: Avoid unnecessarily long names
4. **Use English**: All names should be in English
5. **Avoid Abbreviations**: Unless widely understood (e.g., `id`, `url`, `api`)

### Common Patterns

- **Files**: `kebab-case` (lowercase with hyphens)
- **Variables/Functions**: `camelCase`
- **Classes/Constructors**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private**: Prefix with underscore `_privateMethod`

---

## 🔧 Backend Naming

### Files

| Type | Convention | Example |
|------|-----------|---------|
| Controllers | `{resource}.controller.js` | `auth.controller.js`, `booking.controller.js` |
| Models | `{ModelName}.model.js` | `User.model.js`, `Booking.model.js` |
| Routes | `{resource}.routes.js` | `auth.routes.js`, `booking.routes.js` |
| Middleware | `{purpose}.middleware.js` | `auth.middleware.js`, `validation.middleware.js` |
| Utils | `{functionality}.js` | `jwt.js`, `validators.js`, `email.js` |
| Config | `{purpose}.js` | `db.js`, `passport.js` |

### Variables & Functions

**✅ DO:**
```javascript
// Descriptive variable names
const userEmail = "user@example.com";
const bookingStatus = "confirmed";
const maxRetryAttempts = 3;

// Clear function names (verb + noun)
const getUserById = async (id) => { /* ... */ };
const validateEmail = (email) => { /* ... */ };
const calculateTotalPrice = (items) => { /* ... */ };

// Boolean variables (is/has/should/can prefix)
const isAuthenticated = true;
const hasPermission = false;
const shouldSendEmail = true;
const canEditBooking = false;
```

**❌ DON'T:**
```javascript
// Vague names
const data = {};
const temp = "";
const x = 1;

// Unclear function names
const get = () => { /* ... */ };
const process = () => { /* ... */ };
const handle = () => { /* ... */ };
```

### Constants

**✅ DO:**
```javascript
// UPPER_SNAKE_CASE for constants
const MAX_LOGIN_ATTEMPTS = 5;
const DEFAULT_PAGE_SIZE = 10;
const TOKEN_EXPIRY_TIME = "24h";
const API_BASE_URL = "https://api.example.com";

// Configuration constants
const DATABASE_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
};
```

**❌ DON'T:**
```javascript
// Don't use camelCase for constants
const maxLoginAttempts = 5;
const defaultPageSize = 10;
```

### Classes & Models

**✅ DO:**
```javascript
// PascalCase for classes and models
class UserService {
  // ...
}

class BookingController {
  // ...
}

// Mongoose models
const UserSchema = new mongoose.Schema({ /* ... */ });
export default mongoose.model("User", UserSchema);
```

### Exports

**✅ DO:**
```javascript
// Named exports for utilities
export const generateToken = (userId) => { /* ... */ };
export const validateEmail = (email) => { /* ... */ };

// Default export for main functionality
export default class UserService {
  // ...
}

// Or for single-purpose modules
export default async function connectDB() {
  // ...
}
```

---

## 🎨 Frontend Naming

### Files

| Type | Convention | Example |
|------|-----------|---------|
| HTML Pages | `{page-name}.html` | `booking.html`, `contact.html` |
| CSS Files | `{component-name}.css` | `booking.css`, `navbar.css` |
| JavaScript Modules | `{feature-name}.js` | `booking.js`, `form-validation.js` |
| Components | `{component-name}.html` | `navbar.html`, `footer.html` |

### HTML Elements & Classes

**✅ DO:**
```html
<!-- Semantic HTML with descriptive classes -->
<section class="booking-section">
  <form class="booking-form" id="bookingForm">
    <div class="booking-form__field">
      <label class="booking-form__label">Pickup Date</label>
      <input class="booking-form__input" type="date" />
    </div>
    <button class="booking-form__submit-btn btn btn--primary">
      Submit Booking
    </button>
  </form>
</section>
```

**BEM Naming Convention:**
- **Block**: `booking-form`
- **Element**: `booking-form__field`, `booking-form__label`
- **Modifier**: `btn--primary`, `btn--secondary`

**❌ DON'T:**
```html
<!-- Generic, non-descriptive classes -->
<div class="section">
  <div class="form">
    <div class="field">
      <input class="input" />
    </div>
  </div>
</div>
```

### CSS Classes

**✅ DO:**
```css
/* BEM methodology */
.booking-form { /* Block */ }
.booking-form__field { /* Element */ }
.booking-form__field--error { /* Modifier */ }

/* Utility classes */
.btn { }
.btn--primary { }
.btn--secondary { }
.btn--large { }

/* State classes */
.is-active { }
.is-hidden { }
.is-loading { }
```

**❌ DON'T:**
```css
/* Inconsistent naming */
.form { }
.formField { }
.form-field-error { }
```

### JavaScript Variables & Functions

**✅ DO:**
```javascript
// Descriptive variable names
const bookingForm = document.querySelector("#bookingForm");
const submitButton = bookingForm.querySelector(".submit-btn");
const isFormValid = validateForm(formData);

// Clear function names
const handleFormSubmit = async (e) => { /* ... */ };
const validateBookingForm = (formData) => { /* ... */ };
const showErrorMessage = (message) => { /* ... */ };
const fetchBookingData = async (id) => { /* ... */ };

// Event handlers (handle prefix)
const handleClick = () => { /* ... */ };
const handleSubmit = () => { /* ... */ };
const handleInputChange = () => { /* ... */ };

// Boolean variables
const isLoading = false;
const hasError = false;
const isVisible = true;
```

**❌ DON'T:**
```javascript
// Vague names
const form = document.querySelector("#form");
const btn = form.querySelector(".btn");
const data = {};

// Unclear function names
const submit = () => { /* ... */ };
const validate = () => { /* ... */ };
const show = () => { /* ... */ };
```

### DOM Element Selectors

**✅ DO:**
```javascript
// Use data attributes for JavaScript hooks
<button data-action="submit-booking" class="btn">Submit</button>

// Selectors
const submitButton = document.querySelector('[data-action="submit-booking"]');

// Or use IDs for unique elements
<form id="bookingForm">
const form = document.getElementById("bookingForm");
```

**❌ DON'T:**
```javascript
// Don't rely on CSS classes for JavaScript
const button = document.querySelector(".btn-primary"); // Fragile!
```

### Constants & Configuration

**✅ DO:**
```javascript
// UPPER_SNAKE_CASE for constants
const API_BASE_URL = "https://api.example.com";
const MAX_FORM_LENGTH = 500;
const DEFAULT_PAGE_SIZE = 10;

// Configuration objects
const FORM_CONFIG = {
  maxLength: 500,
  minLength: 10,
  requiredFields: ["name", "email"]
};
```

---

## 🗄️ Database Naming

### Collections/Tables

**✅ DO:**
```javascript
// Plural, lowercase, snake_case
mongoose.model("User", userSchema);        // Collection: "users"
mongoose.model("Booking", bookingSchema);  // Collection: "bookings"
mongoose.model("Vehicle", vehicleSchema);  // Collection: "vehicles"
```

### Fields/Properties

**✅ DO:**
```javascript
// camelCase for fields
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailAddress: String,
  phoneNumber: String,
  createdAt: Date,
  updatedAt: Date
});
```

**❌ DON'T:**
```javascript
// Don't use snake_case in Mongoose schemas
const userSchema = new mongoose.Schema({
  first_name: String,  // ❌
  email_address: String // ❌
});
```

### Indexes

**✅ DO:**
```javascript
// Descriptive index names
userSchema.index({ email: 1 }, { name: "idx_user_email" });
bookingSchema.index({ userId: 1, status: 1 }, { name: "idx_booking_user_status" });
```

---

## 🌐 API Naming

### Endpoints

**✅ DO:**
```javascript
// RESTful conventions
GET    /api/bookings           // List all bookings
GET    /api/bookings/:id       // Get single booking
POST   /api/bookings           // Create booking
PUT    /api/bookings/:id       // Update booking
DELETE /api/bookings/:id       // Delete booking

// Nested resources
GET    /api/users/:userId/bookings
POST   /api/users/:userId/bookings

// Query parameters
GET    /api/bookings?status=pending&page=1&limit=10
```

**❌ DON'T:**
```javascript
// Non-RESTful, inconsistent
GET    /api/getBookings
POST   /api/createBooking
GET    /api/booking/:id/get
POST   /api/booking/:id/update
```

### Route Names

**✅ DO:**
```javascript
// Descriptive route names
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
```

**❌ DON'T:**
```javascript
// Vague route handlers
router.get("/", get);
router.post("/", create);
```

### Request/Response Properties

**✅ DO:**
```javascript
// Consistent property names
{
  "userId": "123",
  "vehicleId": "456",
  "pickupDate": "2024-12-25",
  "status": "pending"
}

// Response format
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": { /* ... */ }
  }
}
```

---

## 📝 Examples

### Complete Example: Booking Feature

**Backend:**
```
backend/
├── models/
│   └── Booking.model.js          ✅ PascalCase
├── controllers/
│   └── booking.controller.js     ✅ kebab-case
├── routes/
│   └── booking.routes.js         ✅ kebab-case
└── utils/
    └── booking-validators.js      ✅ kebab-case
```

**Frontend:**
```
frontend/
├── pages/
│   └── booking.html              ✅ kebab-case
├── css/
│   ├── pages/
│   │   └── booking.css           ✅ kebab-case
│   └── components/
│       └── booking-modals.css    ✅ kebab-case
└── js/
    └── modules/
        └── booking.js            ✅ kebab-case
```

**Code Example:**
```javascript
// backend/controllers/booking.controller.js
export const createBooking = async (req, res) => {
  const { userId, vehicleId, pickupDate } = req.body;
  const booking = await Booking.create({ userId, vehicleId, pickupDate });
  return success(res, 201, "Booking created", { booking });
};

// frontend/js/modules/booking.js
const BOOKING_FORM_SELECTOR = "#bookingForm";
const handleBookingSubmit = async (e) => {
  const formData = new FormData(e.target);
  // ...
};
```

---

## 🔍 Quick Reference

| Item | Convention | Example |
|------|-----------|---------|
| **Backend Files** | `kebab-case.js` | `auth.controller.js` |
| **Frontend Files** | `kebab-case.ext` | `booking.html` |
| **Variables** | `camelCase` | `userEmail`, `bookingStatus` |
| **Functions** | `camelCase` | `getUserById()`, `validateEmail()` |
| **Classes/Models** | `PascalCase` | `UserService`, `Booking` |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_URL` |
| **CSS Classes** | `kebab-case` (BEM) | `booking-form__field` |
| **HTML IDs** | `camelCase` | `bookingForm`, `submitButton` |
| **Database Collections** | `plural`, `lowercase` | `users`, `bookings` |
| **API Endpoints** | `kebab-case` | `/api/bookings`, `/api/user-bookings` |

---

## ✅ Checklist

Before submitting code, ensure:

- [ ] File names follow `kebab-case`
- [ ] Variables use `camelCase`
- [ ] Classes/Models use `PascalCase`
- [ ] Constants use `UPPER_SNAKE_CASE`
- [ ] CSS classes follow BEM methodology
- [ ] Function names are descriptive (verb + noun)
- [ ] Boolean variables use `is/has/should/can` prefix
- [ ] API endpoints follow RESTful conventions
- [ ] Database collections are plural and lowercase
- [ ] Names are in English and descriptive

---

## 📚 Related Documentation

- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Coding Guidelines](./CODING_GUIDELINES.md)
- [Design Guidelines](./DESIGN_GUIDELINES.md)

---

**Last Updated:** December 2024  
**Version:** 1.0