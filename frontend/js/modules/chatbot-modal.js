/* ====================================
   SMART CHATBOT MODAL MODULE
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

    // ✅ Single source of truth for default context shape
    function DEFAULT_CONTEXT() {
        return {
            lastIntent: null,
            data: {
                from: null,
                to: null,
                vehicle: null,
                unsupported_source: null,
                unsupported_destination: null
            }
        };
    }

    let context = DEFAULT_CONTEXT();

    // INTENT RECOGNITION ENGINE
    const INTENTS = [
        {
            id: 'PRICE',
            keywords: [
                'price', 'cost', 'much', 'rate', 'quote', 'charge', 'expensive',
                'cheap', 'how much', 'pricing', 'estimate', 'fee', 'afford', 'budget',
                'fare', 'charges', 'rates', 'money', 'rupees', 'pay'
            ],
            response: (ctx) => {
                // Unsupported source takes priority
                if (ctx.data.unsupported_source) {
                    return `Sorry! Our pickup service is not available in <b>${ctx.data.unsupported_source}</b>. 😔<br><br>
We currently serve:<br>
<b>Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, Surat, Chandigarh and Lucknow</b>.<br><br>
Please enter a supported city to continue.`;
                }

                if (ctx.data.unsupported_destination) {
                    return `Sorry! Our delivery service is not available in <b>${ctx.data.unsupported_destination}</b>. 😔<br><br>
We currently serve:<br>
<b>Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, Surat, Chandigarh and Lucknow</b>.<br><br>
Please enter a supported destination city.`;
                }

                // All three pieces of info collected
                if (ctx.data.vehicle && ctx.data.from && ctx.data.to) {
                    return `A rough estimate for shipping a <b>${ctx.data.vehicle}</b> from <b>${ctx.data.from}</b> to <b>${ctx.data.to}</b> would be around <b>₹${calculateMockPrice(ctx.data.from, ctx.data.to)}</b>.<br><br>Would you like to book this now?`;
                }

                // Have route but no vehicle
                if (!ctx.data.vehicle && ctx.data.from && ctx.data.to) {
                    return `Great! I can help with pricing from <b>${ctx.data.from}</b> to <b>${ctx.data.to}</b>.<br><br>What type of vehicle are you shipping? 🚗<br>- Sedan / Hatchback<br>- SUV<br>- Bike / Motorcycle`;
                }

                // Have vehicle and source, need destination
                if (ctx.data.vehicle && ctx.data.from && !ctx.data.to) {
                    return `Got it! Shipping a <b>${ctx.data.vehicle}</b> from <b>${ctx.data.from}</b>. Where are you shipping <b>to</b>?`;
                }

                // Have vehicle, need source
                if (ctx.data.vehicle && !ctx.data.from) {
                    return `Sure! Shipping a <b>${ctx.data.vehicle}</b>. Which city are you shipping <b>from</b>?`;
                }

                // Have source only
                if (ctx.data.from && !ctx.data.to) {
                    return `Shipping from <b>${ctx.data.from}</b> — great! Which city are you shipping <b>to</b>?`;
                }

                // Nothing collected yet — ask for vehicle first
                if (!ctx.data.vehicle) {
                    return "I can give you a quote! What type of vehicle are you shipping? (e.g., Sedan, SUV, Bike)";
                }

                return "I can help with pricing. Could you tell me the pickup and drop-off cities?";
            }
        },
        {
            id: 'TRACKING',
            keywords: [
                'track', 'status', 'where is', 'location', 'tracking',
                'find', 'monitor', 'follow', 'shipment'
            ],
            response: [
                "You can track your order using the 'Track Order' link in the menu. Do you have a tracking ID?",
                "Please enter your 10-digit Tracking ID to get live status.",
                "I can help you track! What's your tracking number?"
            ]
        },
        {
            id: 'SERVICES',
            keywords: [
                'service', 'offer', 'types', 'method', 'open', 'enclosed',
                'what do you', 'provide', 'available', 'which car', 'what kind',
                'options', 'transport type'
            ],
            response: [
                "We offer <b>Open Carrier</b> (standard), <b>Enclosed Carrier</b> (for luxury cars), and <b>Bike Transport</b>. We also provide full door-to-door insurance coverage.",
                "Our services include door-to-door transport, enclosed carriers for luxury vehicles, and complete insurance. What are you looking to ship?"
            ]
        },
        {
            id: 'TIME',
            keywords: [
                'long', 'days', 'duration', 'fast', 'quick', 'urgent',
                'take', 'delivery time', 'how many', 'arrive', 'how long'
            ],
            response: [
                "Typically, it takes <b>3-5 days</b> for domestic transport. Expedited shipping can take 24-48 hours within neighboring states.",
                "Standard delivery is 3-5 days. Need it faster? We offer expedited shipping too!"
            ]
        },
        {
            id: 'SAFETY',
            keywords: [
                'safe', 'damage', 'insurance', 'secure', 'trust',
                'scratch', 'protect', 'reliable', 'careful', 'break'
            ],
            response: [
                "Safety is our #1 priority. 🛡️ We provide comprehensive insurance coverage and use soft-tie straps to prevent any scratches. Your vehicle is in safe hands!",
                "Your car's safety is guaranteed! We use professional carriers, soft-tie straps, and provide full insurance coverage."
            ]
        },
        {
            id: 'CONTACT',
            keywords: [
                'number', 'call', 'phone', 'email', 'talk', 'human',
                'support', 'contact', 'reach', 'speak', 'agent'
            ],
            response: [
                "You can call our support team 24/7 at <b>+91-9876543210</b> or email us at <b>support@hariharcarTransport.com</b>.",
                "Need to talk to someone? Call us at <b>+91-9876543210</b> — we're available 24/7!"
            ]
        },
        {
            id: 'BOOKING',
            keywords: [
                'book', 'reserve', 'schedule', 'hire', 'want to ship',
                'need transport', 'arrange', 'start'
            ],
            response: [
                "Great! You can start a booking by clicking the <b>'Get Quote'</b> button on the top right. Need help with the form?",
                "Ready to book? Click <b>'Get Quote'</b> and I'll guide you through it!"
            ]
        },
        {
            id: 'GREETING',
            keywords: [
                'hello', 'hii', 'hey', 'good morning', 'good evening',
                'hola', 'namaste', 'greetings', 'sup', 'yo'
            ],
            response: [
                "Hello! 👋 How can I help you transport your vehicle today?",
                "Hi there! Ready to get moving? 🚛",
                "Hey! Need help shipping your car or bike?"
            ]
        },
        {
            id: 'THANKS',
            keywords: [
                'thank', 'thanks', 'bye', 'great', 'awesome',
                'perfect', 'appreciate', 'wonderful', 'superb'
            ],
            response: [
                "You're welcome! 🚛 Drive safe!",
                "Glad I could help!",
                "Have a great day!",
                "Anytime! Feel free to ask if you need anything else!"
            ]
        }
    ];

    /**
     * Main Processing Function
     */
    function process(message) {
        const cleanMsg = message.toLowerCase().trim();

        // Word-boundary aware keyword matcher
        function matchesKeyword(msg, keyword) {
            if (keyword.length <= 3) {
                return new RegExp(`\\b${keyword}\\b`, 'i').test(msg);
            }
            return msg.includes(keyword);
        }

        // Detect intent
        let matchedIntent = INTENTS.find(intent =>
            intent.keywords.some(k => matchesKeyword(cleanMsg, k))
        );

        // Switching to a completely different intent — full reset
        if (matchedIntent && matchedIntent.id !== 'PRICE' && matchedIntent.id !== context.lastIntent) {
            context = DEFAULT_CONTEXT();
        }

        // PRICE flow: extract entities from the message
        if (matchedIntent && matchedIntent.id === 'PRICE') {
            extractEntities(cleanMsg);
        }

        // No intent matched but we're mid-PRICE conversation — treat as follow-up
        if (!matchedIntent && context.lastIntent === 'PRICE') {
            // If stuck on an unsupported source, allow the user to correct it
            if (context.data.unsupported_source && !context.data.from) {
                context.data.unsupported_source = null;
            }
            // If stuck on an unsupported destination, allow the user to correct it
            if (context.data.unsupported_destination && !context.data.to) {
                context.data.unsupported_destination = null;
            }

            extractEntities(cleanMsg);

            // Only re-trigger PRICE intent if we actually extracted something useful
            const hasUsefulData = context.data.vehicle || context.data.from ||
                                  context.data.to || context.data.unsupported_source ||
                                  context.data.unsupported_destination;
            if (hasUsefulData) {
                matchedIntent = INTENTS.find(i => i.id === 'PRICE');
            }
        }

        if (matchedIntent) {
            context.lastIntent = matchedIntent.id;

            const responseText = typeof matchedIntent.response === 'function'
                ? matchedIntent.response(context)
                : matchedIntent.response[Math.floor(Math.random() * matchedIntent.response.length)];

            return { text: responseText, intent: matchedIntent.id };
        }

        return {
            text: "I'm mostly trained on shipping logistics. 🚚 Could you ask about <b>pricing</b>, <b>tracking</b>, or our <b>services</b>?",
            intent: 'UNKNOWN'
        };
    }

    /**
     * Entity Extraction
     * Extracts cities and vehicle types. Detects unsupported cities when applicable.
     */
    function extractEntities(msg) {
        // Skip quick-reply trigger phrases
        const quickReplies = [
            "check shipping price",
            "track my order",
            "is it safe",
            "check price"   // covers the button's data-message
        ];
        if (quickReplies.includes(msg.trim().toLowerCase())) return;

        let foundSupportedCity = false;

        // --- Extract supported cities ---
        KNOWLEDGE.cities.forEach(city => {
            if (msg.includes(city)) {
                foundSupportedCity = true;

                if (!context.data.from) {
                    context.data.from = capitalize(city);
                    context.data.unsupported_source = null;       // ✅ Clear stale error
                } else if (!context.data.to && context.data.from.toLowerCase() !== city) {
                    context.data.to = capitalize(city);
                    context.data.unsupported_destination = null;  // ✅ Clear stale error
                }
            }
        });

        // --- Extract vehicle types ---
        KNOWLEDGE.vehicles.forEach(vehicle => {
            if (msg.includes(vehicle)) {
                context.data.vehicle = capitalize(vehicle);
            }
        });

        // --- Detect unsupported city (only when we still need a city) ---
        const expectingSource = !context.data.from;
        const expectingDestination = context.data.from && !context.data.to;
        const expectingCity = expectingSource || expectingDestination;

        // If we already found a supported city, or we don't need a city, stop here
        if (!expectingCity || foundSupportedCity) return;

        const ignoreWords = new Set([
            "from", "to", "price", "cost", "quote", "shipping", "transport",
            "vehicle", "car", "bike", "suv", "sedan", "hatchback", "motorcycle",
            "scooter", "luxury", "please", "help", "yes", "no", "ok", "okay",
            "need", "check", "track", "order", "status", "safe", "safety",
            "insurance", "service", "services", "book", "booking", "my", "is",
            "it", "what", "where", "when", "how", "much", "do", "can", "i",
            "want", "get", "give", "tell", "send", "show", "and", "the",
            "for", "are", "was", "but", "not", "this", "that", "with", "jeep"
        ]);

        const words = msg
            .toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(Boolean);

        const candidate = words.find(word =>
            word.length > 2 &&
            !ignoreWords.has(word) &&
            !KNOWLEDGE.vehicles.includes(word) &&
            !KNOWLEDGE.cities.includes(word)
        );

        if (!candidate) return;

        if (expectingSource) {
            context.data.unsupported_source = capitalize(candidate);
        } else if (expectingDestination) {
            context.data.unsupported_destination = capitalize(candidate);
        }
    }

    /**
     * Mock Pricing — consistent but varied per route
     */
    function calculateMockPrice(from, to) {
        const base = 3000;
        const hash = (from.length + to.length) * 500;
        const vehicleExtra = context.data.vehicle === 'Suv' ? 2000
            : context.data.vehicle === 'Luxury' ? 5000
            : context.data.vehicle === 'Jeep' ? 3000
            : 0;
        return base + hash + vehicleExtra;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Public API
    return {
        process,
        getContext: () => context,
        resetContext: () => { context = DEFAULT_CONTEXT(); }
    };

})();

// Expose globally
window.ChatbotBrain = ChatbotBrain;


/* ====================================
   CHATBOT MODAL UI
   ==================================== */
(function () {
    'use strict';

    const greetingMessage = "Hello 👋 Welcome to <b>Harihar Car Transport</b>! I'm your AI Assistant.<br>Ask me about <b>pricing</b>, <b>tracking</b>, or our <b>services</b>.";

    function initChatbotModal() {
        if (document.getElementById('chatbot-modal-overlay')) return;

        if (typeof window.ChatbotBrain === 'undefined') {
            console.error("ChatbotBrain CRITICAL FAILURE: Logic not loaded.");
            return;
        }

        const modalHTML = `
            <div class="chatbot-modal-overlay" id="chatbot-modal-overlay">
                <div class="chatbot-modal">
                    <!-- Header -->
                    <div class="chatbot-modal-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar pulse-online">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chatbot-header-info">
                                <h3>Smart Assistant</h3>
                                <span class="chatbot-status">
                                    <span class="status-dot"></span>
                                    Online &amp; Ready
                                </span>
                            </div>
                        </div>
                        <button class="chatbot-modal-close" id="chatbotModalClose" aria-label="Close chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div class="chatbot-messages-container">
                        <div class="chatbot-messages" id="chatbot-messages">
                            <div class="message bot-message initial">
                                <div class="message-content">
                                    <p>${greetingMessage}</p>
                                </div>
                                <span class="message-time">Just now</span>
                            </div>
                        </div>
                        <div class="typing-indicator" id="typingIndicator" style="display: none;">
                            <span></span><span></span><span></span>
                        </div>
                    </div>

                    <!-- Input -->
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
                                <button type="submit" class="chatbot-send-btn" aria-label="Send message">
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
        console.log("Chatbot: Fully Loaded.");
    }

    function setupEventListeners() {
        const closeBtn  = document.getElementById('chatbotModalClose');
        const form      = document.getElementById('chatbotForm');
        const input     = document.getElementById('chatbot-input');
        const overlay   = document.getElementById('chatbot-modal-overlay');
        const quickBtns = document.querySelectorAll('.quick-reply');

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

        quickBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const msg = this.getAttribute('data-message');
                const container = document.getElementById('chatbot-messages');
                addUserMessage(msg, container);
                processBotResponse(msg);
            });
        });

        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeChatbotModal();
            });
        }
    }

    function sendMessage() {
        const input     = document.getElementById('chatbot-input');
        const container = document.getElementById('chatbot-messages');

        if (!input || !input.value.trim() || !container) return;

        const message = input.value.trim();
        addUserMessage(message, container);
        input.value = '';
        input.focus();
        processBotResponse(message);
    }

    function addUserMessage(message, container) {
        const div = document.createElement('div');
        div.className = 'message user-message slide-in-right';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="message-content"><p>${escapeHTML(message)}</p></div>
            <span class="message-time">${time}</span>
        `;

        // Remove greeting on first real interaction
        const initial = container.querySelector('.initial');
        if (initial) initial.remove();

        container.appendChild(div);
        scrollToBottom(container);
    }

    function processBotResponse(userMessage) {
        const container = document.getElementById('chatbot-messages');
        const typing    = document.getElementById('typingIndicator');
        const sendBtn   = document.querySelector('.chatbot-send-btn');

        if (sendBtn) sendBtn.disabled = true;
        if (typing)  { typing.style.display = 'flex'; scrollToBottom(container); }

        const thinkTime = Math.floor(Math.random() * 600) + 600;

        setTimeout(() => {
            if (typing) typing.style.display = 'none';

            const result = window.ChatbotBrain.process(userMessage);
            addBotMessage(container, result.text);

            if (sendBtn) sendBtn.disabled = false;
        }, thinkTime);
    }

    function addBotMessage(container, htmlContent) {
        const div = document.createElement('div');
        div.className = 'message bot-message slide-in-left';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="message-content"><p>${htmlContent}</p></div>
            <span class="message-time">${time}</span>
        `;

        container.appendChild(div);
        scrollToBottom(container);
    }

    function scrollToBottom(container) {
        if (container && container.parentElement) {
            setTimeout(() => {
                container.parentElement.scrollTop = container.parentElement.scrollHeight;
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

    function escapeHTML(text) {
        return text.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#039;'
        }[m]));
    }

    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChatbotModal);
        } else {
            initChatbotModal();
        }
    }

    window.chatbotModal = { close: closeChatbotModal, init: initialize };
    initialize();

})();