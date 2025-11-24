/* ====================================
   STICKY QUOTE NOW BUTTON MODULE
   ==================================== */

(function () {
  "use strict";

  // Configuration
  const BUTTON_ID = "sticky-quote-btn";
  const SCROLL_THRESHOLD = 300; // pixels to scroll before showing button
  const BUTTON_TEXT = "Get Quote";

  /**
   * Initialize Sticky Quote Button
   */
  function initStickyQuoteButton() {
    // Check if button already exists
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    // Create the button element
    const quoteButton = document.createElement("button");
    quoteButton.id = BUTTON_ID;
    quoteButton.type = "button";
    quoteButton.setAttribute("aria-label", BUTTON_TEXT);
    quoteButton.setAttribute("title", BUTTON_TEXT);

    // Create button content
    const icon = document.createElement("i");
    icon.className = "fas fa-quote-left";

    const text = document.createElement("span");
    text.textContent = BUTTON_TEXT;

    quoteButton.appendChild(icon);
    quoteButton.appendChild(text);

    // Add button to body
    document.body.appendChild(quoteButton);

    // Add event listeners
    addEventListeners(quoteButton);

    // Initial scroll check
    checkScrollPosition();
  }

  /**
   * Add Event Listeners to the button and scroll events
   * @param {HTMLElement} button - The quote button element
   */
  function addEventListeners(button) {
    // Handle keyboard accessibility (Enter and Space keys)
    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        scrollToBooking();
      }
    });

    // Main click handler
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Quote Now button clicked");
      scrollToBooking();
    });

    // Handle mousedown to prevent any dragging
    button.addEventListener("mousedown", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });

    // Handle mouseup
    button.addEventListener("mouseup", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });

    // Handle focus for accessibility
    button.addEventListener("focus", function () {
      console.log("Quote Now button focused");
    });

    // Handle blur
    button.addEventListener("blur", function () {
      console.log("Quote Now button blurred");
    });

    // Handle scroll event with throttling
    let scrollTimeout = null;
    window.addEventListener(
      "scroll",
      function () {
        if (scrollTimeout) {
          window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(checkScrollPosition);
      },
      { passive: true }
    );
  }

  /**
   * Check if user has scrolled past threshold and show/hide button
   */
  function checkScrollPosition() {
    const button = document.getElementById(BUTTON_ID);
    if (!button) return;

    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > SCROLL_THRESHOLD) {
      // Show button with animation
      if (!button.classList.contains("visible")) {
        button.classList.add("animate-in", "visible");
        button.classList.remove("animate-out");
        console.log("Quote button shown");
      }
    } else {
      // Hide button with animation
      if (button.classList.contains("visible")) {
        button.classList.add("animate-out");
        button.classList.remove("visible", "animate-in");
        console.log("Quote button hidden");
      }
    }
  }

  /**
   * Scroll to booking section or open booking modal
   */
  function scrollToBooking() {
    // Open the quote modal
    if (typeof window.openQuoteModal === "function") {
      window.openQuoteModal();
      console.log("Quote modal opened from sticky button");
    } else {
      console.warn("Quote modal function not available");
    }
  }

  /**
   * Initialize on DOM Ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStickyQuoteButton);
  } else {
    // DOM is already loaded
    initStickyQuoteButton();
  }

  /**
   * Reinitialize on dynamic content loading (for SPAs)
   * This ensures the button persists even if page is dynamically updated
   */
  window.reinitializeStickyQuoteButton = function () {
    initStickyQuoteButton();
  };
})();
