/* ====================================
   CHATBOT MODAL MODULE
   ==================================== */

(function () {
  "use strict";

  // Sample responses for the dummy chatbot
  const botResponses = [
    "Hello! How can I help you today?",
    "I'm here to assist you with any questions about our car transport services.",
    "You can ask me about pricing, booking, tracking, or general inquiries.",
    "Feel free to ask anything - what would you like to know?",
    "Is there anything specific about our services you'd like to know?",
    "Thank you for reaching out! How can we assist you?",
  ];

  let messageCount = 0;

  /**
   * Initialize Chatbot Modal
   */
  function initChatbotModal() {
    // Check if modal already exists
    if (document.getElementById("chatbot-modal-overlay")) {
      return;
    }

    // Create modal HTML
    const modalHTML = `
            <div class="chatbot-modal-overlay" id="chatbot-modal-overlay">
                <div class="chatbot-modal">
                    <!-- Modal Header -->
                    <div class="chatbot-modal-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chatbot-header-info">
                                <h3>Chat Support</h3>
                                <span class="chatbot-status">
                                    <span class="status-dot"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button class="chatbot-modal-close" id="chatbotModalClose" aria-label="Close chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Messages Area -->
                    <div class="chatbot-messages-container">
                        <div class="chatbot-messages" id="chatbot-messages">
                            <div class="message bot-message initial">
                                <div class="message-content">
                                    <p>Hello! 👋 Welcome to Harihar Car Carriers. I'm your AI assistant. How can I help you today?</p>
                                </div>
                                <span class="message-time">Just now</span>
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="chatbot-input-area">
                        <form class="chatbot-form" id="chatbotForm">
                            <div class="chatbot-input-wrapper">
                                <input 
                                    type="text" 
                                    id="chatbot-input" 
                                    class="chatbot-input" 
                                    placeholder="Type your message..." 
                                    aria-label="Message input"
                                    autocomplete="off"
                                />
                                <button 
                                    type="submit" 
                                    class="chatbot-send-btn" 
                                    aria-label="Send message"
                                    title="Send message (Enter)"
                                >
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                        <div class="chatbot-help-text">
                            💡 Tip: Type your question or use quick replies below
                        </div>
                        <div class="chatbot-quick-replies">
                            <button class="quick-reply" data-message="What are your services?">Services</button>
                            <button class="quick-reply" data-message="How much does it cost?">Pricing</button>
                            <button class="quick-reply" data-message="How do I book?">Booking</button>
                            <button class="quick-reply" data-message="How can I track my car?">Tracking</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Initialize event listeners
    setupEventListeners();
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    const closeBtn = document.getElementById("chatbotModalClose");
    const form = document.getElementById("chatbotForm");
    const input = document.getElementById("chatbot-input");
    const quickReplies = document.querySelectorAll(".quick-reply");
    const overlay = document.getElementById("chatbot-modal-overlay");

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener("click", closeChatbotModal);
    }

    // Form submission
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        sendMessage();
      });
    }

    // Enter key to send
    if (input) {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    // Quick replies
    quickReplies.forEach((button) => {
      button.addEventListener("click", function () {
        const message = this.getAttribute("data-message");
        input.value = message;
        sendMessage();
      });
    });

    // Click outside to close
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
          closeChatbotModal();
        }
      });
    }

    // Prevent click propagation inside modal
    const modal = document.querySelector(".chatbot-modal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  }

  /**
   * Send Message
   */
  function sendMessage() {
    const input = document.getElementById("chatbot-input");
    const messagesContainer = document.getElementById("chatbot-messages");
    const form = document.getElementById("chatbotForm");

    if (!input || !input.value.trim() || !messagesContainer) return;

    const message = input.value.trim();

    // Add user message
    addUserMessage(message, messagesContainer);

    // Clear input
    input.value = "";
    input.focus();

    // Disable send button temporarily
    const sendBtn = form.querySelector(".chatbot-send-btn");
    if (sendBtn) {
      sendBtn.disabled = true;
    }

    // Simulate bot response delay
    setTimeout(() => {
      addBotMessage(messagesContainer);
      if (sendBtn) {
        sendBtn.disabled = false;
      }
    }, 800);
  }

  /**
   * Add User Message to Chat
   * @param {string} message - The user's message
   * @param {HTMLElement} container - The messages container
   */
  function addUserMessage(message, container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message user-message";

    const timeNow = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(message)}</p>
            </div>
            <span class="message-time">${timeNow}</span>
        `;

    // Remove initial message if present
    const initialMessage = container.querySelector(".initial");
    if (initialMessage) {
      initialMessage.remove();
    }

    container.appendChild(messageDiv);
    scrollToBottom(container);
  }

  /**
   * Add Bot Message to Chat
   * @param {HTMLElement} container - The messages container
   */
  function addBotMessage(container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";

    // Get a random response
    const response =
      botResponses[Math.floor(Math.random() * botResponses.length)];
    const timeNow = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(response)}</p>
            </div>
            <span class="message-time">${timeNow}</span>
        `;

    container.appendChild(messageDiv);
    scrollToBottom(container);

    messageCount++;
  }

  /**
   * Scroll to Bottom of Messages
   * @param {HTMLElement} container - The messages container
   */
  function scrollToBottom(container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
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
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHTML(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Initialize when DOM is ready
   */
  function initialize() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initChatbotModal);
    } else {
      initChatbotModal();
    }
  }

  // Expose public methods globally
  window.chatbotModal = {
    close: closeChatbotModal,
    sendMessage: sendMessage,
    init: initialize,
  };

  // Initialize on script load
  initialize();
})();
