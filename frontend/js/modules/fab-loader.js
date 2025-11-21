/* ====================================
   FAB LOADER - Loads Floating Action Menu
   Dynamically loads FAB on all pages
   ==================================== */

(function () {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFAB);
  } else {
    loadFAB();
  }

  function loadFAB() {
    // Check if FAB already exists (to avoid duplicates)
    if (document.getElementById('fabMain')) {
      console.log('FAB already exists on page');
      return;
    }

    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    const basePath = currentPath.includes('/pages/') ? '../' : '';

    // Create FAB HTML
    const fabHTML = `
      <!-- 🚀 Modern Floating Action Menu (FAB) -->
      <div class="fab-container">
        <button class="fab-main" id="fabMain" aria-label="Open actions menu" aria-expanded="false">
          <i class="fas fa-plus fab-icon"></i>
        </button>

        <!-- Action Buttons (hidden by default) -->
        <div class="fab-actions" id="fabActions">
          <!-- Get Quote -->
          <button class="fab-action-btn" id="fabQuoteBtn" data-tooltip="Get Quote">
            <i class="fas fa-file-invoice-dollar"></i>
          </button>

          <!-- Book Now -->
          <button class="fab-action-btn" id="fabBookBtn" data-tooltip="Book Now">
            <i class="fas fa-calendar-check"></i>
          </button>

          <!-- WhatsApp -->
          <a href="https://wa.me/919999999999" class="fab-action-btn" data-tooltip="WhatsApp">
            <i class="fab fa-whatsapp"></i>
          </a>

          <!-- Call -->
          <a href="tel:+919876543210" class="fab-action-btn" data-tooltip="Call Us">
            <i class="fas fa-phone"></i>
          </a>

          <!-- Chatbot -->
          <button class="fab-action-btn" id="fabChatBtn" data-tooltip="Chat with us">
            <i class="fas fa-comments"></i>
          </button>

          <!-- Feedback -->
          <button class="fab-action-btn" id="fabFeedbackBtn" data-tooltip="Give Feedback">
            <i class="fas fa-comment-dots"></i>
          </button>
        </div>
      </div>
    `;

    // Inject FAB into the page
    document.body.insertAdjacentHTML('beforeend', fabHTML);

    // Load the FAB CSS if not already loaded
    if (!document.querySelector('link[href*="floating-action-menu.css"]')) {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = `${basePath}css/components/floating-action-menu.css`;
      document.head.appendChild(cssLink);
    }

    // Load the FAB JavaScript functionality
    const script = document.createElement('script');
    script.src = `${basePath}js/modules/floating-action-menu.js`;
    script.async = true;
    document.body.appendChild(script);

    console.log('FAB loaded successfully');
  }
})();
