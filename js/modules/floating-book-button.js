// 🎯 Floating "Book Now" Button Module

const FloatingBookButton = (() => {
  const BUTTON_ID = "floatingBookBtn";
  const MODAL_ID = "bookingModal";
  const BUTTON_CLASS = "floating-book-btn";

  /**
   * Initialize the floating book button
   */
  function init() {
    // Create the floating button if it doesn't exist
    if (!document.getElementById(BUTTON_ID)) {
      createButton();
    }

    // Attach event listeners
    attachEventListeners();

    // Handle page navigation
    handlePageNavigation();
  }

  /**
   * Create the floating button element
   */
  function createButton() {
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.className = BUTTON_CLASS;
    button.innerHTML = '<i class="fas fa-calendar-check"></i>';
    button.setAttribute("aria-label", "Book Now");
    button.setAttribute("title", "Click to book a vehicle");

    document.body.appendChild(button);
  }

  /**
   * Attach event listeners to the button
   */
  function attachEventListeners() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.addEventListener("click", openBookingModal);
    }
  }

  /**
   * Open the booking modal or navigate to booking page
   */
  function openBookingModal() {
    // Check if we're on the booking page
    if (window.location.pathname.includes("booking.html")) {
      // Scroll to the booking form
      const bookingForm = document.querySelector(".booking-form-container");
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
        // Add focus state to form
        bookingForm.style.outline = "2px solid #ff6347";
        bookingForm.style.outlineOffset = "10px";
        setTimeout(() => {
          bookingForm.style.outline = "none";
        }, 3000);
      }
    } else {
      // Navigate to booking page
      window.location.href = "./pages/booking.html";
    }
  }

  /**
   * Handle page navigation and ensure button is visible
   */
  function handlePageNavigation() {
    // Update button visibility based on page
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      // Show on all pages except booking (optional)
      const isBookingPage = window.location.pathname.includes("booking.html");
      if (isBookingPage) {
        button.style.display = "none";
      } else {
        button.style.display = "flex";
      }
    }
  }

  /**
   * Show the floating button
   */
  function show() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.style.display = "flex";
    }
  }

  /**
   * Hide the floating button
   */
  function hide() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.style.display = "none";
    }
  }

  /**
   * Destroy the floating button
   */
  function destroy() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.remove();
    }
  }

  // Public API
  return {
    init,
    show,
    hide,
    destroy,
  };
})();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", FloatingBookButton.init);
} else {
  FloatingBookButton.init();
}
