/* ====================================
   FLOATING WHATSAPP BUTTON MODULE
   ==================================== */

(function () {
    'use strict';

    // Configuration
    const WHATSAPP_NUMBER = '+91 98765 43210';
    const WHATSAPP_NUMBER_URL = 'https://wa.me/919876543210';
    const BUTTON_ID = 'floating-whatsapp-btn';

    /**
     * Initialize Floating WhatsApp Button
     */
    function initFloatingWhatsAppButton() {
        // Check if button already exists
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        // Create the button element
        const whatsappButton = document.createElement('a');
        whatsappButton.id = BUTTON_ID;
        whatsappButton.href = WHATSAPP_NUMBER_URL;
        whatsappButton.setAttribute('aria-label', `Chat with us on WhatsApp at ${WHATSAPP_NUMBER}`);
        whatsappButton.setAttribute('title', `Chat with us on WhatsApp at ${WHATSAPP_NUMBER}`);
        whatsappButton.setAttribute('rel', 'noopener noreferrer');
        whatsappButton.setAttribute('target', '_blank');

        // Add WhatsApp icon (using Font Awesome)
        const icon = document.createElement('i');
        icon.className = 'fab fa-whatsapp';
        whatsappButton.appendChild(icon);

        // Add button to body
        document.body.appendChild(whatsappButton);

        // Add event listeners
        addEventListeners(whatsappButton);
    }

    /**
     * Add Event Listeners to the button
     * @param {HTMLElement} button - The WhatsApp button element
     */
    function addEventListeners(button) {
        // Handle keyboard accessibility (Enter and Space keys)
        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.open(this.href, '_blank', 'noopener,noreferrer');
            }
        });

        // Log when button is clicked (for analytics if needed)
        button.addEventListener('click', function (event) {
            console.log('WhatsApp button clicked');
            // The href will open WhatsApp in a new window/tab
        });

        // Handle focus for accessibility
        button.addEventListener('focus', function () {
            console.log('WhatsApp button focused');
        });

        // Handle blur
        button.addEventListener('blur', function () {
            console.log('WhatsApp button blurred');
        });
    }

    /**
     * Initialize on DOM Ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingWhatsAppButton);
    } else {
        // DOM is already loaded
        initFloatingWhatsAppButton();
    }

    /**
     * Reinitialize on dynamic content loading (for SPAs)
     * This ensures the button persists even if page is dynamically updated
     */
    window.reinitializeWhatsAppButton = function () {
        initFloatingWhatsAppButton();
    };

})();
