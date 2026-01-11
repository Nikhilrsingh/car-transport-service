# Project Folder Structure

> Complete directory structure and organization guidelines for Car Transport Service

## 📁 Root Directory Structure

```
car-transport-service/
│
├── api/                          # API Gateway & Microservices (Planned)
│   └── README.md                 # API documentation
│
├── backend/                      # Backend Node.js/Express Application
│   ├── config/                   # Configuration files
│   │   ├── db.js                 # Database connection configuration
│   │   └── passport.js           # Passport.js authentication config
│   │
│   ├── controllers/              # Request handlers (business logic)
│   │   ├── auth.controller.js    # Authentication controllers
│   │   ├── contact.controller.js # Contact form handlers
│   │   └── feedback.controller.js # Feedback handlers
│   │
│   ├── middleware/               # Express middleware functions
│   │   ├── auth.middleware.js   # Authentication middleware
│   │   └── error.middleware.js  # Error handling middleware
│   │
│   ├── models/                   # Database models (Mongoose schemas)
│   │   ├── User.model.js         # User schema
│   │   ├── contact.model.js      # Contact form schema
│   │   └── feedback.model.js     # Feedback schema
│   │
│   ├── routes/                   # API route definitions
│   │   ├── auth.routes.js        # Authentication routes
│   │   ├── contact.routes.js     # Contact routes
│   │   └── feedback.routes.js    # Feedback routes
│   │
│   ├── utils/                    # Utility functions & helpers
│   │   ├── jwt.js                # JWT token utilities
│   │   ├── response.js           # Standardized response helpers
│   │   ├── sendEmail.js          # Email sending utilities
│   │   └── validators.js         # Input validation functions
│   │
│   ├── node_modules/             # Dependencies (gitignored)
│   ├── package.json              # Backend dependencies & scripts
│   ├── package-lock.json         # Lock file for dependencies
│   ├── server.js                 # Main entry point
│   ├── README.md                 # Backend-specific documentation
│   └── CHANGES.md                # Backend changelog
│
├── frontend/                     # Frontend Application (HTML/CSS/JS)
│   ├── assets/                   # Static assets
│   │   ├── data/                 # JSON data files
│   │   │   └── cities.json       # City/location data
│   │   │
│   │   ├── fonts/                # Custom font files
│   │   │   ├── Inter-Regular.woff2
│   │   │   ├── Poppins-Bold.woff
│   │   │   └── Poppins-Regular.woff2
│   │   │
│   │   ├── gallery/              # Gallery images
│   │   │   ├── gal1.png
│   │   │   ├── gal2.png
│   │   │   └── ... (more images)
│   │   │
│   │   ├── icons/                # Icon files (logos, favicons)
│   │   │   ├── favicon.png
│   │   │   └── hcc logo.png
│   │   │
│   │   └── images/               # General images
│   │       ├── banner.jpg
│   │       ├── car1.png
│   │       └── ... (more images)
│   │
│   ├── components/               # Reusable HTML components
│   │   ├── navbar.html           # Navigation bar component
│   │   ├── footer.html           # Footer component
│   │   ├── bottom-action-bar.html
│   │   ├── digital-clock.html
│   │   ├── floating-action-menu.html
│   │   └── region-section.html
│   │
│   ├── css/                      # Stylesheets
│   │   ├── components/           # Component-specific CSS
│   │   │   ├── about.css
│   │   │   ├── animations.css
│   │   │   ├── booking-modals.css
│   │   │   ├── contact.css
│   │   │   ├── footer.css
│   │   │   ├── navbar.css
│   │   │   └── ... (more component CSS)
│   │   │
│   │   ├── pages/                # Page-specific CSS
│   │   │   ├── about.css
│   │   │   ├── booking.css
│   │   │   ├── contact.css
│   │   │   └── ... (more page CSS)
│   │   │
│   │   ├── responsive/           # Responsive design CSS
│   │   │   └── 360px-500px.css   # Mobile breakpoint styles
│   │   │
│   │   ├── dark-mode.css         # Dark theme styles
│   │   ├── light-mode.css        # Light theme styles
│   │   └── styles.css            # Main/global stylesheet
│   │
│   ├── js/                       # JavaScript files
│   │   ├── modules/              # Modular JavaScript files
│   │   │   ├── auth.js           # Authentication logic
│   │   │   ├── booking.js        # Booking functionality
│   │   │   ├── contact-enhanced.js
│   │   │   ├── form-validation.js
│   │   │   ├── navbar-loader.js
│   │   │   ├── theme-switcher.js
│   │   │   └── ... (more modules)
│   │   │
│   │   ├── auto-save.js          # Auto-save functionality
│   │   └── script.js             # Main JavaScript entry point
│   │
│   ├── pages/                    # HTML page files
│   │   ├── about.html
│   │   ├── booking.html
│   │   ├── contact.html
│   │   ├── careers.html
│   │   ├── Feedback.html
│   │   ├── gallery.html
│   │   ├── how-it-works.html
│   │   ├── pricing.html
│   │   ├── tracking.html
│   │   └── ... (more pages)
│   │
│   ├── index.html                # Main landing page
│   ├── login.html                # Login/Signup page
│   ├── services.html             # Services page
│   └── README.md                 # Frontend-specific documentation
│
├── docs/                         # Project documentation
│   ├── API_DOCS.md               # API endpoint documentation
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── DESIGN_GUIDELINES.md      # UI/UX design standards
│   ├── FOLDER_STRUCTURE.md       # This file
│   ├── NAMING_CONVENTIONS.md     # Naming convention guidelines
│   ├── CODING_GUIDELINES.md      # Code style and best practices
│   ├── ROADMAP.md                # Project roadmap
│   └── CONTACT_CSS_REFERENCE.css # CSS reference documentation
│
├── mobile-app/                   # Mobile Application (Planned)
│   └── README.md                 # Mobile app documentation
│
├── scripts/                      # Build & deployment scripts
│   └── README.md                 # Scripts documentation
│
├── .github/                      # GitHub configuration (if exists)
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   ├── PULL_REQUEST_TEMPLATE.md  # PR template
│   └── workflows/                # GitHub Actions workflows
│
├── .gitignore                    # Git ignore rules
├── LICENSE                       # Project license (MIT)
├── README.md                     # Main project README
├── SECURITY.md                   # Security policy
└── MIGRATION_COMPLETE.md         # Migration notes
```

---

## 📂 Directory Descriptions

### `/backend`
Contains all server-side code, API logic, database models, and business logic.

**Key Subdirectories:**
- `config/`: Environment-specific configurations (database, authentication)
- `controllers/`: Request handlers that process business logic
- `middleware/`: Express middleware for authentication, error handling, etc.
- `models/`: Mongoose schemas defining data structures
- `routes/`: API endpoint definitions and route handlers
- `utils/`: Reusable utility functions

### `/frontend`
Contains all client-side code, HTML pages, stylesheets, and JavaScript.

**Key Subdirectories:**
- `assets/`: Static files (images, fonts, icons, data files)
- `components/`: Reusable HTML component templates
- `css/`: Stylesheets organized by component and page
- `js/`: JavaScript organized into modules
- `pages/`: Individual HTML page files

### `/docs`
Project documentation including guidelines, API docs, and contribution guides.

### `/api` (Planned)
Future API gateway and microservices architecture.

### `/mobile-app` (Planned)
Future React Native mobile application.

---

## 📋 File Organization Rules

### Backend Files

1. **Controllers** (`controllers/`)
   - One file per resource/feature
   - Named: `{resource}.controller.js`
   - Example: `auth.controller.js`, `booking.controller.js`

2. **Models** (`models/`)
   - One file per database collection
   - Named: `{ModelName}.model.js` (PascalCase)
   - Example: `User.model.js`, `Booking.model.js`

3. **Routes** (`routes/`)
   - One file per resource group
   - Named: `{resource}.routes.js`
   - Example: `auth.routes.js`, `booking.routes.js`

4. **Middleware** (`middleware/`)
   - Named: `{purpose}.middleware.js`
   - Example: `auth.middleware.js`, `validation.middleware.js`

5. **Utils** (`utils/`)
   - Grouped by functionality
   - Named: `{functionality}.js`
   - Example: `jwt.js`, `validators.js`, `email.js`

### Frontend Files

1. **HTML Pages** (`pages/` or root)
   - Named: `{page-name}.html` (kebab-case)
   - Example: `booking.html`, `contact.html`

2. **CSS Files** (`css/`)
   - Component CSS: `css/components/{component-name}.css`
   - Page CSS: `css/pages/{page-name}.css`
   - Global: `css/styles.css`

3. **JavaScript Modules** (`js/modules/`)
   - Named: `{feature-name}.js` (kebab-case)
   - Example: `booking-modals.js`, `form-validation.js`

4. **Assets** (`assets/`)
   - Images: `assets/images/`
   - Icons: `assets/icons/`
   - Fonts: `assets/fonts/`
   - Data: `assets/data/`

---

## 🔄 Adding New Features

### Adding a New Backend Feature

1. Create model: `backend/models/{Feature}.model.js`
2. Create controller: `backend/controllers/{feature}.controller.js`
3. Create routes: `backend/routes/{feature}.routes.js`
4. Add route to `server.js`
5. Add validation in `utils/validators.js` if needed

### Adding a New Frontend Page

1. Create HTML: `frontend/pages/{page-name}.html`
2. Create CSS: `frontend/css/pages/{page-name}.css`
3. Create JS module: `frontend/js/modules/{page-name}.js`
4. Link files in HTML page
5. Update navigation if needed

### Adding a New Component

1. Create HTML: `frontend/components/{component-name}.html`
2. Create CSS: `frontend/css/components/{component-name}.css`
3. Create JS (if needed): `frontend/js/modules/{component-name}.js`
4. Document usage in component file

---

## 📝 File Naming Conventions

See [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) for detailed naming rules.

**Quick Reference:**
- **Backend**: `camelCase.js` for files, `PascalCase` for models
- **Frontend**: `kebab-case.html`, `kebab-case.css`, `kebab-case.js`
- **Components**: `kebab-case.component.html`

---

## 🚫 What NOT to Include

### Never Commit:
- `node_modules/` directories
- `.env` files (use `.env.example`)
- Build artifacts (`dist/`, `build/`)
- IDE configuration (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Log files (`*.log`)
- Temporary files (`*.tmp`, `*.temp`)

### Use `.gitignore`:
Ensure sensitive files and dependencies are properly ignored.

---

## 📐 Directory Depth Guidelines

- **Maximum depth**: 4 levels from root
- **Preferred depth**: 2-3 levels
- **Example**: `frontend/css/components/` ✅ (3 levels)
- **Avoid**: `frontend/css/components/modals/booking/` ❌ (too deep)

---

## 🔍 Finding Files

### Quick Reference:

| What You Need | Where to Look |
|--------------|---------------|
| API endpoints | `backend/routes/` |
| Database schemas | `backend/models/` |
| Business logic | `backend/controllers/` |
| HTML pages | `frontend/pages/` |
| Reusable components | `frontend/components/` |
| Styles | `frontend/css/` |
| JavaScript logic | `frontend/js/modules/` |
| Images | `frontend/assets/images/` |
| Documentation | `docs/` |

---

## 📚 Related Documentation

- [Naming Conventions](./NAMING_CONVENTIONS.md)
- [Coding Guidelines](./CODING_GUIDELINES.md)
- [Design Guidelines](./DESIGN_GUIDELINES.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

**Last Updated:** December 2024  
**Version:** 1.0