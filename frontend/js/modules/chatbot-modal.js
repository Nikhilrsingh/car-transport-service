/* ====================================
   CHATBOT MODAL MODULE
   ==================================== */

(function () {
    'use strict';

    // Predefined Questions and Answers for Rule-Based Chatbot
    const predefinedQA = {
        "what services do you provide": "We provide safe and reliable car transportation services across multiple cities in India, including door-to-door pickup and delivery.",
        "how much does car transport cost": "Car transport charges depend on distance, vehicle type, and route. For exact pricing, please contact our support team.",
        "do you provide door-to-door service": "Yes, we offer complete door-to-door car pickup and delivery services.",
        "how long does car delivery take": "Delivery usually takes between 3 to 10 days depending on distance and route conditions.",
        "is my car safe during transport": "Yes. Your car is transported using professional carriers and handled by trained staff to ensure maximum safety.",
        "do you provide insurance coverage": "Yes, insurance coverage is provided to protect your vehicle during transportation.",
        "what documents are required": "A copy of the vehicle RC and a valid ID proof are required at the time of pickup.",
        "can i keep personal items inside the car": "No. Personal belongings should be removed before transportation for safety reasons.",
        "how can i track my car": "Tracking details are shared after booking. For tracking updates, please contact our support team.",
        "which cities do you serve": "We provide car transport services across multiple cities in India. Please contact our team to confirm availability.",
        "how do i book car transport": "You can book our services by contacting our customer support team through the website.",
        "what payment methods are accepted": "Multiple payment methods are accepted. Please contact our support team for payment-related details.",
        "can i cancel my booking": "Yes, booking cancellations are allowed. Cancellation charges may apply. Please contact our support team for details.",
        "what if my car gets damaged": "In rare cases of damage, insurance assistance is provided. Please contact our support team immediately.",
        "how can i contact customer support": "You can contact our customer support team using the phone number or email provided on the website. Support is available 24/7."
    };

    // Fallback response for out-of-scope questions
    const fallbackResponse = "I’m unable to help with this request. Please contact our customer support team using the information available on the website.";

    // Greeting message
    const greetingMessage = "Hello 👋 Welcome to Harihar Car Transport Service. This chatbot can answer basic questions about our services. Please choose a question from the available options.";

    let isFirstMessage = true;

    /**
     * Initialize Chatbot Modal
     */
    function initChatbotModal() {
        // Check if modal already exists
        if (document.getElementById('chatbot-modal-overlay')) {
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
                                    <p>Hello 👋 Welcome to Harihar Car Transport Service. This chatbot can answer basic questions about our services. Please choose a question from the available options.</p>
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
                            💡 Select a question below or type your question
                        </div>
                        <div class="chatbot-quick-replies">
                            <button class="quick-reply" data-message="What services do you provide?">Services</button>
                            <button class="quick-reply" data-message="How much does car transport cost?">Pricing</button>
                            <button class="quick-reply" data-message="Do you provide door-to-door service?">Door-to-Door</button>
                            <button class="quick-reply" data-message="How long does car delivery take?">Delivery Time</button>
                            <button class="quick-reply" data-message="Is my car safe during transport?">Safety</button>
                            <button class="quick-reply" data-message="Do you provide insurance coverage?">Insurance</button>
                            <button class="quick-reply" data-message="What documents are required?">Documents</button>
                            <button class="quick-reply" data-message="How can I track my car?">Tracking</button>
                            <button class="quick-reply" data-message="Which cities do you serve?">Cities</button>
                            <button class="quick-reply" data-message="How do I book car transport?">Booking</button>
                            <button class="quick-reply" data-message="What payment methods are accepted?">Payment</button>
                            <button class="quick-reply" data-message="Can I cancel my booking?">Cancellation</button>
                            <button class="quick-reply" data-message="How can I contact customer support?">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Initialize event listeners
        setupEventListeners();
    }

    /**
     * Setup Event Listeners
     */
    function setupEventListeners() {
        const closeBtn = document.getElementById('chatbotModalClose');
        const form = document.getElementById('chatbotForm');
        const input = document.getElementById('chatbot-input');
        const quickReplies = document.querySelectorAll('.quick-reply');
        const overlay = document.getElementById('chatbot-modal-overlay');

        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeChatbotModal);
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                sendMessage();
            });
        }

        // Enter key to send
        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        // Quick replies
        quickReplies.forEach(button => {
            button.addEventListener('click', function () {
                const message = this.getAttribute('data-message');
                input.value = message;
                sendMessage();
            });
        });

        // Click outside to close
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    closeChatbotModal();
                }
            });
        }

        // Prevent click propagation inside modal
        const modal = document.querySelector('.chatbot-modal');
        if (modal) {
            modal.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }

    /**
     * Send Message
     */
    function sendMessage() {
        const input = document.getElementById('chatbot-input');
        const messagesContainer = document.getElementById('chatbot-messages');
        const form = document.getElementById('chatbotForm');

        if (!input || !input.value.trim() || !messagesContainer) return;

        const message = input.value.trim();

        // Add user message
        addUserMessage(message, messagesContainer);

        // Clear input
        input.value = '';
        input.focus();

        // Disable send button temporarily
        const sendBtn = form.querySelector('.chatbot-send-btn');
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        // Add bot response with slight delay
        setTimeout(() => {
            addBotMessage(messagesContainer, message);
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
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';

        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(message)}</p>
            </div>
            <span class="message-time">${timeNow}</span>
        `;

        // Remove initial message if present
        const initialMessage = container.querySelector('.initial');
        if (initialMessage) {
            initialMessage.remove();
        }

        container.appendChild(messageDiv);
        scrollToBottom(container);
    }

    /**
     * Find matching answer for user question
     * @param {string} userMessage - The user's message
     * @returns {string} Bot response
     */
    function findAnswer(userMessage) {
        const normalizedMessage = userMessage.toLowerCase().trim();
        
        // Check for exact or partial matches in predefined questions
        for (const [question, answer] of Object.entries(predefinedQA)) {
            if (normalizedMessage.includes(question) || question.includes(normalizedMessage)) {
                return answer;
            }
        }
        
        // Check for keyword matches
        const keywords = {
            "service": "We provide safe and reliable car transportation services across multiple cities in India, including door-to-door pickup and delivery.",
            "cost": "Car transport charges depend on distance, vehicle type, and route. For exact pricing, please contact our support team.",
            "price": "Car transport charges depend on distance, vehicle type, and route. For exact pricing, please contact our support team.",
            "pricing": "Car transport charges depend on distance, vehicle type, and route. For exact pricing, please contact our support team.",
            "door": "Yes, we offer complete door-to-door car pickup and delivery services.",
            "delivery": "Delivery usually takes between 3 to 10 days depending on distance and route conditions.",
            "time": "Delivery usually takes between 3 to 10 days depending on distance and route conditions.",
            "safe": "Yes. Your car is transported using professional carriers and handled by trained staff to ensure maximum safety.",
            "safety": "Yes. Your car is transported using professional carriers and handled by trained staff to ensure maximum safety.",
            "insurance": "Yes, insurance coverage is provided to protect your vehicle during transportation.",
            "document": "A copy of the vehicle RC and a valid ID proof are required at the time of pickup.",
            "personal": "No. Personal belongings should be removed before transportation for safety reasons.",
            "items": "No. Personal belongings should be removed before transportation for safety reasons.",
            "track": "Tracking details are shared after booking. For tracking updates, please contact our support team.",
            "cities": "We provide car transport services across multiple cities in India. Please contact our team to confirm availability.",
            "city": "We provide car transport services across multiple cities in India. Please contact our team to confirm availability.",
            "book": "You can book our services by contacting our customer support team through the website.",
            "booking": "You can book our services by contacting our customer support team through the website.",
            "payment": "Multiple payment methods are accepted. Please contact our support team for payment-related details.",
            "cancel": "Yes, booking cancellations are allowed. Cancellation charges may apply. Please contact our support team for details.",
            "damage": "In rare cases of damage, insurance assistance is provided. Please contact our support team immediately.",
            "contact": "You can contact our customer support team using the phone number or email provided on the website. Support is available 24/7.",
            "support": "You can contact our customer support team using the phone number or email provided on the website. Support is available 24/7."
        };
        
        for (const [keyword, answer] of Object.entries(keywords)) {
            if (normalizedMessage.includes(keyword)) {
                return answer;
            }
        }
        
        // Return fallback response if no match found
        return fallbackResponse;
    }

    /**
     * Add Bot Message to Chat
     * @param {HTMLElement} container - The messages container
     * @param {string} userMessage - The user's message to respond to
     */
    function addBotMessage(container, userMessage = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';

        // Get appropriate response based on user message
        const response = findAnswer(userMessage);
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(response)}</p>
            </div>
            <span class="message-time">${timeNow}</span>
        `;

        container.appendChild(messageDiv);
        scrollToBottom(container);
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
        const modal = document.getElementById('chatbot-modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
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
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Initialize when DOM is ready
     */
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChatbotModal);
        } else {
            initChatbotModal();
        }
    }

    // Expose public methods globally
    window.chatbotModal = {
        close: closeChatbotModal,
        sendMessage: sendMessage,
        init: initialize
    };

    // Initialize on script load
    initialize();
})();
