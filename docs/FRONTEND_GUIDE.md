# Frontend Development Guide

This guide outlines the standards, best practices, and design tokens for frontend development in the **Car Transport Service** project. Following these guidelines ensures consistency, maintainability, and accessibility across all contributions.

---

## 🎨 Design Tokens (CSS Variables)

We use a centralized Design Token system defined in `frontend/css/styles.css`. Always use these variables instead of hardcoded values.

### 1. Colors
| Variable | Value | Description |
| :--- | :--- | :--- |
| `--primary-color` | `#ff6347` | Primary brand color (Tomato Orange) |
| `--text-color` | `#333` | Default text color (Light Mode) |
| `--background-light` | `#ffffff` | Primary background color |
| `--input-bg` | `#fff` / `#1a1a1a` | Background for form inputs |

### 2. Typography
We use **Poppins** as the primary font family.

| Variable | Description |
| :--- | :--- |
| `--h1-size` | Responsive H1 size using `clamp()` |
| `--h2-size` | Responsive H2 size |
| `--text-base` | Default body text size (approx. 16px) |
| `--text-small` | Smaller helper text |

### 3. Spacing System
Based on a 4px/8px incremental scale.

| Variable | Value | Usage |
| :--- | :--- | :--- |
| `--space-xs` | `8px` | Tight spacing, small paddings |
| `--space-md` | `16px` | Standard gutter, component padding |
| `--space-lg` | `24px` | Section margins, large paddings |
| `--space-xl` | `32px` | Large section spacing |

### 4. Motion & Transitions
| Variable | Value | Description |
| :--- | :--- | :--- |
| `--motion-fast` | `150ms` | Hover states, simple toggles |
| `--motion-medium` | `250ms` | Card transitions, modal fades |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard natural easing |

### 5. Elevation (Shadows)
| Variable | Usage |
| :--- | :--- |
| `--shadow-sm` | Default button shadow |
| `--shadow-card` | Standard card elevation |
| `--shadow-lg` | Hover states and active modals |

### 6. Z-Index Layers
Ensures consistent UI stacking across the application.
- `--z-sticky-header`: 100
- `--z-dropdown`: 300
- `--z-modal`: 600
- `--z-loader`: 999

---

## 🏗️ Component Structure

### Semantic HTML
Always use semantic elements to improve SEO and accessibility:
- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- `<article>` for blog posts or reviews.
- `<button>` for actions, `<a>` for navigation.

### Class Naming
We follow a semantic naming convention. Use descriptive, kebab-case classes.
```html
<section class="service-box">
  <div class="service-icon">...</div>
  <h3 class="service-title">Car Transport</h3>
  <p class="service-description">...</p>
</section>
```

### Accessibility (A11y)
1. **Focus States**: Use `:focus-visible` to provide clear focus indicators.
2. **Screen Readers**: Use the `.sr-only` class for content that should only be read by screen readers.
3. **ARIA Labels**: Use `aria-label` for icon-only buttons.
4. **Keyboard Nav**: Ensure all interactive elements are reachable via Tab.

---

## ⚡ JavaScript Best Practices

### 1. Module Pattern (IIFE)
All JavaScript files in `js/modules/` must use an Immediately Invoked Function Expression (IIFE) to avoid polluting the global namespace.

```javascript
(function() {
  'use strict';
  
  // Module logic here
  function init() { ... }
  
  document.addEventListener('DOMContentLoaded', init);
})();
```

### 2. DOM Selection & Manipulation
- Cache DOM selections if used multiple times.
- Use `addEventListener` instead of inline `onclick` attributes.
- Prefer `textContent` over `innerHTML` when handling user-provided data.

### 3. Directory Structure
- **Global Scripts**: `frontend/js/script.js`
- **Modules**: `frontend/js/modules/` (Encapsulated features like `search.js`, `navbar-loader.js`)
- **Pages**: `frontend/js/pages/` (Page-specific logic)

---

## 📝 File & Folder Conventions

- **HTML**: Located in `frontend/` (root) or `frontend/pages/`.
- **CSS**: Located in `frontend/css/components/` for reusable components.
- **Assets**: All images in `frontend/assets/images/`, icons in `frontend/assets/icons/`.
- **Naming**: Use `kebab-case` for all files and directories (e.g., `car-carrier.png`, `about-us.html`).

---

## ✨ Contribution Checklist
- [ ] Uses CSS variables from `styles.css`.
- [ ] Follows the IIFE pattern for JS modules.
- [ ] Tested for Responsive Design (Mobile First).
- [ ] Includes appropriate ARIA labels and semantic HTML.
- [ ] File names are in `kebab-case`.
