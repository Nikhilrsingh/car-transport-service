/* ====================================
   FLOATING CALL US BUTTON MODULE
   ==================================== */

(function () {
    'use strict';

    // Configuration
    const PHONE_NUMBER = '+91 98765 43210';
    const PHONE_NUMBER_TEL = 'tel:+919876543210';
    const BUTTON_ID = 'floating-call-btn';

    /**
     * Initialize Floating Call Button
     */
    function initFloatingCallButton() {
        // Check if button already exists
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        // Create the button element
        const callButton = document.createElement('a');
        callButton.id = BUTTON_ID;
        callButton.href = PHONE_NUMBER_TEL;
        callButton.setAttribute('aria-label', `Call us at ${PHONE_NUMBER}`);
        callButton.setAttribute('title', `Call us at ${PHONE_NUMBER}`);
        callButton.setAttribute('rel', 'noopener noreferrer');

        // Add phone icon (using Font Awesome if available, fallback to Unicode)
        const icon = document.createElement('i');
        icon.className = 'fas fa-phone';
        callButton.appendChild(icon);

        // Add button to body
        document.body.appendChild(callButton);

        // Add event listeners
        addEventListeners(callButton);
    }

    /**
     * Add Event Listeners to the button
     * @param {HTMLElement} button - The call button element
     */
    function addEventListeners(button) {
        // Handle keyboard accessibility (Enter and Space keys)
        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = this.href;
            }
        });

        // Log when button is clicked (for analytics if needed)
        button.addEventListener('click', function (event) {
            console.log('Call Us button clicked');
            // The href with tel: protocol will automatically handle the call action
        });

        // Handle focus for accessibility
        button.addEventListener('focus', function () {
            console.log('Call Us button focused');
        });

        // Handle blur
        button.addEventListener('blur', function () {
            console.log('Call Us button blurred');
        });
    }

    /**
     * Initialize on DOM Ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingCallButton);
    } else {
        // DOM is already loaded
        initFloatingCallButton();
    }

    /**
     * Reinitialize on dynamic content loading (for SPAs)
     * This ensures the button persists even if page is dynamically updated
     */
    window.reinitializeCallButton = function () {
        initFloatingCallButton();
    };

})();
