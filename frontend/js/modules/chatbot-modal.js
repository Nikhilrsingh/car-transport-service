/* ====================================
   SMART CHATBOT MODAL MODULE (AI-Powered)
   ==================================== */

/**
 * THE BRAIN - Local NLP Engine for Chatbot
 * Handles intent recognition, entity extraction, and context management.
 */
const ChatbotBrain = (function () {
    'use strict';

    // Knowledge Base (The "Mind")
    const KNOWLEDGE = {
        services: [
            "door-to-door", "terminal-to-terminal", "open carrier", "enclosed carrier",
            "bike transport", "car transport", "expedited shipping", "insurance"
        ],
        cities: [
            "mumbai", "delhi", "bangalore", "chennai", "kolkata", "hyderabad",
            "pune", "ahmedabad", "jaipur", "surat", "chandigarh", "lucknow"
        ],
        vehicles: [
            "sedan", "suv", "hatchback", "luxury", "bike", "scooter", "motorcycle", "jeep"
        ]
    };

    // Context Memory (The "Short-term Memory")
    let context = {
        lastIntent: null,
        data: {} // Stores extracted entities like { from: 'Delhi', to: 'Mumbai' }
    };

    // 1. INTENT RECOGNITION ENGINE
    // Rules: [Keywords] -> Intent
    const INTENTS = [
        {
            id: 'PRICE',
            keywords: ['price', 'cost', 'much', 'rate', 'quote', 'charge', 'expensive', 'cheap', 'how much', 'pricing', 'estimate', 'fee', 'afford', 'budget', 'fare', 'charges', 'rates', 'money', 'rupees', 'pay'],
            response: (ctx) => {
                if (ctx.data.vehicle && ctx.data.from && ctx.data.to) {
                    return `A rough estimate for shipping a <b>${ctx.data.vehicle}</b> from <b>${ctx.data.from}</b> to <b>${ctx.data.to}</b> would be around <b>₹${calculateMockPrice(ctx.data.from, ctx.data.to)}</b>. <br><br>Would you like to book this now?`;
                }
                if (!ctx.data.vehicle && ctx.data.from && ctx.data.to) {
                    return `Great! I can help with pricing from <b>${ctx.data.from}</b> to <b>${ctx.data.to}</b>. <br><br>What type of vehicle are you shipping? 🚗<br>- Sedan/Hatchback<br>- SUV<br>- Bike/Motorcycle`;
                }
                if (!ctx.data.vehicle) return "I can give you a quote! What type of vehicle are you shipping? (e.g., Sedan, SUV, Bike)";
                if (!ctx.data.from) return "Where are you shipping from?";
                if (!ctx.data.to) return `Shipping from ${ctx.data.from} to where?`;
                return "I can help with pricing. Could you tell me the pickup and drop-off cities?";
            }
        },
        {
            id: 'TRACKING',
            keywords: ['track', 'status', 'where is', 'location', 'order', 'tracking', 'find', 'monitor', 'follow', 'shipment'],
            response: ["You can track your order using the 'Track Order' link in the menu. Do you have a tracking ID?", "Please enter your 10-digit Tracking ID to get live status.", "I can help you track! What's your tracking number?"]
        },
        {
            id: 'SERVICES',
            keywords: ['service', 'offer', 'types', 'method', 'open', 'enclosed', 'what do you', 'provide', 'available', 'which car', 'what kind', 'options', 'transport type'],
            response: ["We offer <b>Open Carrier</b> (standard), <b>Enclosed Carrier</b> (for luxury cars), and <b>Bike Transport</b>. We also provide full door-to-door insurance coverage.", "Our services include door-to-door transport, enclosed carriers for luxury vehicles, and complete insurance. What are you looking to ship?"]
        },
        {
            id: 'TIME',
            keywords: ['long', 'days', 'time', 'duration', 'when', 'fast', 'quick', 'urgent', 'take', 'delivery time', 'how many', 'arrive'],
            response: ["Typically, it takes <b>3-5 days</b> for domestic transport. Expedited shipping can take 24-48 hours within neighboring states.", "Standard delivery is 3-5 days. Need it faster? We offer expedited shipping too!"]
        },
        {
            id: 'SAFETY',
            keywords: ['safe', 'damage', 'insurance', 'secure', 'trust', 'scratch', 'protect', 'reliable', 'careful', 'break'],
            response: ["Safety is our #1 priority. 🛡️ We provide comprehensive insurance coverage and use soft-tie straps to prevent any scratches. Your vehicle is in safe hands!", "Your car's safety is guaranteed! We use professional carriers, soft-tie straps, and provide full insurance coverage."]
        },
        {
            id: 'CONTACT',
            keywords: ['number', 'call', 'phone', 'email', 'talk', 'human', 'support', 'contact', 'reach', 'speak', 'agent', 'help'],
            response: ["You can call our support team 24/7 at <b>+91-9876543210</b> or email us at <b>support@cargotransport.com</b>.", "Need to talk to someone? Call us at <b>+91-9876543210</b> - we're available 24/7!"]
        },
        {
            id: 'BOOKING',
            keywords: ['book', 'reserve', 'order', 'schedule', 'hire', 'want to ship', 'need transport', 'arrange'],
            response: ["Great! You can start a booking by clicking the 'Get Quote' button on the top right. Need help with the form?", "Ready to book? Click 'Get Quote' and I'll guide you through it!"]
        },
        {
            id: 'GREETING',
            keywords: ['hello', 'hi', 'hii', 'hey', 'start', 'good morning', 'good evening', 'hola', 'namaste', 'greetings', 'sup', 'yo'],
            response: ["Hello! 👋 How can I help you transport your vehicle today?", "Hi there! Ready to get moving?", "Hey! Need help shipping your car?"]
        },
        {
            id: 'THANKS',
            keywords: ['thank', 'thanks', 'cool', 'good', 'bye', 'ok', 'great', 'awesome', 'perfect', 'appreciate'],
            response: ["You're welcome! 🚛 Drive safe!", "Glad I could help!", "Have a great day!", "Anytime! Feel free to ask if you need anything else!"]
        }
    ];

    /**
     * Main Processing Function
     * @param {string} message - User's raw text
     * @returns {object} { text: "Response HTML", intent: "ID" }
     */
    function process(message) {
        const cleanMsg = message.toLowerCase().trim();

        // Helper: Check if keyword matches (with word boundary for short words)
        function matchesKeyword(msg, keyword) {
            if (keyword.length <= 3) {
                // For short words like "hi", use word boundaries
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                return regex.test(msg);
            }
            return msg.includes(keyword);
        }

        // 2. Determine Intent
        let matchedIntent = INTENTS.find(intent =>
            intent.keywords.some(k => matchesKeyword(cleanMsg, k))
        );

        // If new intent detected and it's not PRICE, reset context
        if (matchedIntent && matchedIntent.id !== 'PRICE' && matchedIntent.id !== context.lastIntent) {
            context.data = {};
        }

        // 1. Extract Entities (only for PRICE intent)
        if (matchedIntent && matchedIntent.id === 'PRICE') {
            extractEntities(cleanMsg);
        }

        // Fallback: Check context (Follow-up logic)
        if (!matchedIntent && context.lastIntent === 'PRICE') {
            // If user just typed a city or car name to complete the quote
            extractEntities(cleanMsg);
            if (context.data.vehicle || context.data.from || context.data.to) {
                matchedIntent = INTENTS.find(i => i.id === 'PRICE');
            }
        }

        // Default or Match
        if (matchedIntent) {
            context.lastIntent = matchedIntent.id;

            // Handle dynamic response (function) or static array
            let responseText = "";
            if (typeof matchedIntent.response === 'function') {
                responseText = matchedIntent.response(context);
            } else {
                responseText = matchedIntent.response[Math.floor(Math.random() * matchedIntent.response.length)];
            }

            return { text: responseText, intent: matchedIntent.id };
        } else {
            return {
                text: "I'm mostly trained on shipping logistics. 🚚 Could you ask about <b>pricing</b>, <b>tracking</b>, or our <b>services</b>?",
                intent: 'UNKNOWN'
            };
        }
    }

    /**
     * Helper: Entity Extraction
     * Looks for known cities and vehicle types in the message
     */
    function extractEntities(msg) {
        // Find Cities
        KNOWLEDGE.cities.forEach(city => {
            if (msg.includes(city)) {
                if (!context.data.from) context.data.from = capitalize(city);
                else if (context.data.from.toLowerCase() !== city) context.data.to = capitalize(city);
            }
        });

        // Find Vehicles
        KNOWLEDGE.vehicles.forEach(vehicle => {
            if (msg.includes(vehicle)) context.data.vehicle = capitalize(vehicle);
        });
    }

    /**
     * Helper: Mock Pricing Logic
     */
    function calculateMockPrice(from, to) {
        const base = 3000;
        // Simple hash to make the price consistent but "random"
        const hash = (from.length + to.length) * 500;
        return base + hash + (context.data.vehicle === 'Suv' ? 2000 : 0);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Export Public API
    return {
        process,
        getContext: () => context,
        resetContext: () => { context = { lastIntent: null, data: {} }; }
    };

})();

// Export to window (Critical for integration)
window.ChatbotBrain = ChatbotBrain;


(function () {
    'use strict';

    // Greeting message
    const greetingMessage = "Hello 👋 Welcome to Harihar Car Transport! I'm your AI Assistant. You can ask me about <b>pricing</b>, <b>tracking</b>, or our <b>services</b>.";

    /**
     * Initialize Chatbot Modal
     */
    function initChatbotModal() {
        if (document.getElementById('chatbot-modal-overlay')) return;

        // Ensure Brain is loaded
        // NOTE: Since we merged the files, this should always be true.
        if (typeof window.ChatbotBrain === 'undefined') {
            console.error("ChatbotBrain CRITICAL FAILURE: Logic not loaded.");
            return;
        }

        // Create modal HTML
        const modalHTML = `
            <div class="chatbot-modal-overlay" id="chatbot-modal-overlay">
                <div class="chatbot-modal">
                    <!-- Modal Header -->
                    <div class="chatbot-modal-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar pulse-online">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chatbot-header-info">
                                <h3>Smart Assistant</h3>
                                <span class="chatbot-status">
                                    <span class="status-dot"></span>
                                    Online & Ready
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
                                    <p>${greetingMessage}</p>
                                </div>
                                <span class="message-time">Just now</span>
                            </div>
                        </div>
                        <!-- Typing Indicator (Hidden by default) -->
                        <div class="typing-indicator" id="typingIndicator" style="display: none;">
                            <span></span><span></span><span></span>
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
                                >
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                        <div class="chatbot-quick-replies">
                            <button class="quick-reply" data-message="Check Shipping Price">💰 Check Price</button>
                            <button class="quick-reply" data-message="Track my Order">📍 Track Order</button>
                            <button class="quick-reply" data-message="Is it safe?">🛡️ Safety</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        setupEventListeners();
        console.log("Chatbot V2: Fully Loaded & Integrated.");
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

        if (closeBtn) closeBtn.addEventListener('click', closeChatbotModal);

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                sendMessage();
            });
        }

        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        quickReplies.forEach(button => {
            button.addEventListener('click', function () {
                const message = this.getAttribute('data-message');
                // If it's a quick reply, we can skip typing it into the input
                // and just send it directly for better UX
                addUserMessage(message, document.getElementById('chatbot-messages'));
                processBotResponse(message);
            });
        });

        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeChatbotModal();
            });
        }
    }

    /**
     * Send Message Logic
     */
    function sendMessage() {
        const input = document.getElementById('chatbot-input');
        const messagesContainer = document.getElementById('chatbot-messages');

        if (!input || !input.value.trim() || !messagesContainer) return;

        const message = input.value.trim();

        // 1. Add User Message
        addUserMessage(message, messagesContainer);

        // 2. Clear Input
        input.value = '';
        input.focus();

        // 3. Process Response
        processBotResponse(message);
    }

    function addUserMessage(message, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message slide-in-right';
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(message)}</p>
            </div>
            <span class="message-time">${timeNow}</span>
        `;

        // Remove greeting if it's the very first interaction
        const initial = container.querySelector('.initial');
        if (initial) initial.remove();

        container.appendChild(messageDiv);
        scrollToBottom(container);
    }

    /**
     * Process Bot Response with "Network Delay" Simulation
     */
    function processBotResponse(userMessage) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingIndicator = document.getElementById('typingIndicator');
        const sendBtn = document.querySelector('.chatbot-send-btn');

        if (sendBtn) sendBtn.disabled = true;

        // Show Typing Indicator
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            scrollToBottom(messagesContainer);
        }

        // Simulate thinking time (random between 600ms and 1200ms)
        const thinkTime = Math.floor(Math.random() * 600) + 600;

        setTimeout(() => {
            // Hide Typing Indicator
            if (typingIndicator) typingIndicator.style.display = 'none';

            // Get Result from Brain
            const result = window.ChatbotBrain.process(userMessage);

            // Add Bot Message
            addBotMessage(messagesContainer, result.text);

            if (sendBtn) sendBtn.disabled = false;

        }, thinkTime);
    }

    function addBotMessage(container, htmlContent) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message slide-in-left';
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${htmlContent}</p>
            </div>
            <span class="message-time">${timeNow}</span>
        `;

        container.appendChild(messageDiv);
        playSound();
        scrollToBottom(container);
    }

    function scrollToBottom(container) {
        if (container && container.parentElement) {
            setTimeout(() => {
                const scrollContainer = container.parentElement;
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }, 100);
        }
    }

    function closeChatbotModal() {
        const modal = document.getElementById('chatbot-modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    }

    function playSound() {
        // Simple "pop" sound can be added here if audio assets exist
        // const audio = new Audio('assets/sounds/pop.mp3');
        // audio.play().catch(e => console.log("Audio play failed interaction"));
    }

    function escapeHTML(text) {
        return text.replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    // Initialize on load
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChatbotModal);
        } else {
            initChatbotModal();
        }
    }

    window.chatbotModal = {
        close: closeChatbotModal,
        init: initialize
    };

    initialize();
})();
