/**
 * Main Entry Point
 * Consolidates all module loading and manages initialization
 */

// --- Critical Modules (Loaded immediately) ---
import './modules/preloader-logic.js'; // Run first to handle loading screen
import './modules/loading-state-manager.js';
import './modules/page-navigation-loader.js';
import './modules/preloader-meta.js';

// --- Core Functionality ---
import './modules/navbar-loader.js';
import './modules/footer-loader.js';
import './script.js';
import './modules/themes.js';
import './modules/cookie-manager.js';

// --- Hero & Animation ---
import './modules/auto-slider.js';
import './modules/hero-animations.js';
import './modules/scroll-animations.js';
import './modules/city-autocomplete.js';

// --- Page Components ---
import './modules/Services.js';
import './modules/tracking.js';
import './modules/search.js';
import './modules/modal.js';
import './modules/quote-modal.js';
import './modules/comparison-widget.js';
import './modules/chatbot-modal.js';
import './modules/component-initializer.js';
import './modules/testimonial.js';
import './modules/rating.js';

// --- Region & Maps ---
import './modules/region-loader.js';
import './modules/region-search.js';
import './modules/region-map.js';
import './modules/region-enhancements.js';
import './modules/region-pagination.js';

// --- UI Enhancements ---
import './modules/digital-clock.js';
import './modules/glow-inputs.js';
import './modules/floating-book-button.js';
import './modules/floating-call-button.js';
import './modules/floating-whatsapp-button.js';
import './modules/sticky-quote-button.js';
import './modules/floating-chatbot-button.js';
import './modules/sticky-toc.js';
import './modules/keyboard-section-navigation.js';

// --- Reviews ---
import './modules/reviews-loader.js';
import './reviews-data.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

console.log('Main Entry Point: Initialized');
