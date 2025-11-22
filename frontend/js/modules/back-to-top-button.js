// 🔝 Back to Top Button - Enhanced Module

const BackToTopButton = (() => {
    const BUTTON_ID = 'backToTop';
    const VISIBLE_CLASS = 'visible';
    const SCROLL_THRESHOLD = 300; // Show button after scrolling 300px
    const SMOOTH_SCROLL_DURATION = 800; // Duration for smooth scroll in ms

    /**
     * Initialize the back to top button
     */
    function init() {
        const button = document.getElementById(BUTTON_ID);
        if (!button) return; // Button doesn't exist on this page

        // Attach event listeners
        attachEventListeners(button);

        // Initial check
        handleScroll(button);
    }

    /**
     * Attach event listeners
     */
    function attachEventListeners(button) {
        // Click event - smooth scroll to top
        button.addEventListener('click', scrollToTop);

        // Scroll event - show/hide button
        window.addEventListener('scroll', () => handleScroll(button), { passive: true });
    }

    /**
     * Handle scroll event to show/hide button
     */
    function handleScroll(button) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > SCROLL_THRESHOLD) {
            showButton(button);
        } else {
            hideButton(button);
        }
    }

    /**
     * Show the button with fade-in effect
     */
    function showButton(button) {
        if (!button.classList.contains(VISIBLE_CLASS)) {
            button.classList.add(VISIBLE_CLASS);
        }
    }

    /**
     * Hide the button with fade-out effect
     */
    function hideButton(button) {
        if (button.classList.contains(VISIBLE_CLASS)) {
            button.classList.remove(VISIBLE_CLASS);
        }
    }

    /**
     * Smooth scroll to top of the page
     */
    function scrollToTop(e) {
        e.preventDefault();

        const startPosition = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        function easeOutQuad(t) {
            return t * (2 - t); // Easing function for smooth animation
        }

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / SMOOTH_SCROLL_DURATION, 1);
            const ease = easeOutQuad(progress);
            const distance = startPosition * ease;

            window.scrollTo(0, startPosition - distance);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }

    return {
        init: init
    };
})();

// Initialize the back to top button when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BackToTopButton.init);
} else {
    BackToTopButton.init();
}
