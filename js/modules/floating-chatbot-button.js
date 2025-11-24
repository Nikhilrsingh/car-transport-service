/* ====================================
   FLOATING CHATBOT BUTTON MODULE
   ==================================== */

(function () {
  "use strict";

  // Configuration
  const BUTTON_ID = "floating-chatbot-btn";

  /**
   * Initialize Floating Chatbot Button
   */
  function initFloatingChatbotButton() {
    // Check if button already exists
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    // Create the button element
    const chatbotButton = document.createElement("button");
    chatbotButton.id = BUTTON_ID;
    chatbotButton.setAttribute("aria-label", "Open chat support");
    chatbotButton.setAttribute("title", "Chat with us");
    chatbotButton.type = "button";

    // Add chatbot icon (using Font Awesome)
    const icon = document.createElement("i");
    icon.className = "fas fa-comments";
    chatbotButton.appendChild(icon);

    // Add button to body
    document.body.appendChild(chatbotButton);

    // Add event listeners
    addEventListeners(chatbotButton);
  }

  /**
   * Add Event Listeners to the button
   * @param {HTMLElement} button - The chatbot button element
   */
  function addEventListeners(button) {
    // Handle keyboard accessibility (Enter and Space keys)
    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        button.click();
      }
    });

    // Click handler to open chatbot modal
    button.addEventListener("click", function (event) {
      event.preventDefault();
      openChatbotModal();
    });

    // Prevent multiple rapid clicks
    let isClickable = true;
    button.addEventListener("click", function () {
      if (!isClickable) return;
      isClickable = false;
      setTimeout(() => {
        isClickable = true;
      }, 300);
    });
  }

  /**
   * Open Chatbot Modal
   */
  function openChatbotModal() {
    const modal = document.getElementById("chatbot-modal-overlay");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("active");

      // Announce to screen readers
      const chatArea = document.getElementById("chatbot-messages");
      if (chatArea) {
        chatArea.setAttribute("aria-live", "polite");
        chatArea.setAttribute("aria-atomic", "true");
      }

      // Focus on the input field
      setTimeout(() => {
        const input = document.getElementById("chatbot-input");
        if (input) input.focus();
      }, 100);
    }
  }

  /**
   * Close Chatbot Modal
   */
  function closeChatbotModal() {
    const modal = document.getElementById("chatbot-modal-overlay");
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  }

  /**
   * Animate button pulse on load
   */
  function animatePulse() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.classList.add("pulse");
      // Remove pulse after 6 seconds
      setTimeout(() => {
        button.classList.remove("pulse");
      }, 6000);
    }
  }

  /**
   * Initialize when DOM is ready
   */
  function initialize() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initFloatingChatbotButton();
        animatePulse();
      });
    } else {
      initFloatingChatbotButton();
      animatePulse();
    }
  }

  // Expose public methods globally
  window.chatbotUI = {
    open: openChatbotModal,
    close: closeChatbotModal,
    init: initialize,
  };

  // Initialize on script load
  initialize();
})();
