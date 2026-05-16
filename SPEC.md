# Specification - Landing Page Performance Optimization

## Problem
The `frontend/index.html` page makes 85+ HTTP requests (49 JS, 36 CSS), leading to:
- High latency.
- FOUC (Flash of Unstyled Content).
- Poor SEO/PageSpeed scores.

## Proposed Fix
1. **CSS Consolidation**: Combine all component-specific CSS files into a single `core.css`.
2. **JS Consolidation**: Create a `main.js` entry point using ES6 modules to manage script loading.

## Implementation Plan

### Phase 1:
- [x] Consolidate 33 component-specific CSS files into `frontend/css/core.css`.
- [x] Create a main JavaScript entry point `frontend/js/main.js` using ES6 modules.
- [x] Modularize inline scripts (city autocomplete, preloader, cookie manager).
- [x] Update `frontend/index.html` to use consolidated assets.
- [ ] Verify functionality in the browser.
- [ ] Finalize documentation.

### Phase 3: Verification
1. Verify the page still looks and functions correctly.
2. Check the network tab to ensure the number of requests has decreased significantly.
