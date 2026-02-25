// Smart Scroll Button - Switches between up/down based on position

// Prevent duplicate loading
if (typeof SmartScrollButton === 'undefined') {
    const SmartScrollButton = (() => {
        const BUTTON_ID = 'smartScrollBtn';
        const VISIBLE_CLASS = 'visible';
        const LOADED_CLASS = 'loaded';
        const SCROLL_DOWN_CLASS = 'scroll-down';
        const MIDDLE_THRESHOLD = 0.5; // 50% of page
        const SMOOTH_SCROLL_DURATION = 400; // Faster scroll - 400ms instead of 800ms

        let isPageLoaded = false;

        function init() {
            const button = document.getElementById(BUTTON_ID);
            if (!button) {
                console.log('SmartScrollButton: Button not found, will retry...');
                return;
            }

            console.log('SmartScrollButton: Initializing...');

            // Activation logic:
            // Check if page/body is already marked as loaded
            if (document.body.classList.contains('loaded') ||
                document.readyState === 'complete' ||
                document.readyState === 'interactive') {
                isPageLoaded = true;
                button.classList.add(LOADED_CLASS);
            }

            // Listen for when preloader finishes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target === document.body && document.body.classList.contains('loaded')) {
                        isPageLoaded = true;
                        button.classList.add(LOADED_CLASS);
                        handleScroll(button);
                    }
                });
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

            // Also mark as loaded after window load event (fallback for pages without preloader)
            window.addEventListener('load', () => {
                setTimeout(() => {
                    isPageLoaded = true;
                    button.classList.add(LOADED_CLASS);
                    handleScroll(button);
                    console.log('SmartScrollButton: Page loaded, button activated');
                }, 100);
            });

            attachEventListeners(button);
            handleScroll(button);
        }

        function attachEventListeners(button) {
            button.addEventListener('click', handleClick);
            window.addEventListener('scroll', () => handleScroll(button), { passive: true });
        }

        function handleScroll(button) {
            // Don't show until page is loaded
            if (!isPageLoaded) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            // Always show button except when at very top (0-50px) or very bottom (within 50px)
            if (scrollTop > 50 && scrollTop < docHeight - 50) {
                button.classList.add(VISIBLE_CLASS);
            } else if (scrollTop <= 50) {
                // At top - show down arrow
                button.classList.add(VISIBLE_CLASS);
                button.classList.add(SCROLL_DOWN_CLASS);
                button.setAttribute('data-tooltip', 'Go to Bottom');
                return;
            } else if (scrollTop >= docHeight - 50) {
                // At bottom - show up arrow
                button.classList.add(VISIBLE_CLASS);
                button.classList.remove(SCROLL_DOWN_CLASS);
                button.setAttribute('data-tooltip', 'Back to Top');
                return;
            } else {
                button.classList.remove(VISIBLE_CLASS);
            }

            // Change direction based on scroll position (for middle area)
            if (scrollPercent > MIDDLE_THRESHOLD) {
                // Past middle - show up arrow
                button.classList.remove(SCROLL_DOWN_CLASS);
                button.setAttribute('data-tooltip', 'Back to Top');
            } else {
                // Before middle - show down arrow
                button.classList.add(SCROLL_DOWN_CLASS);
                button.setAttribute('data-tooltip', 'Go to Bottom');
            }
        }

        function handleClick(e) {
            e.preventDefault();
            const button = e.currentTarget;

            if (button.classList.contains(SCROLL_DOWN_CLASS)) {
                scrollToBottom();
            } else {
                scrollToTop();
            }
        }

        function scrollToTop() {
            const startPosition = window.scrollY || document.documentElement.scrollTop;
            const startTime = performance.now();

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3); // Faster easing
            }

            function animateScroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / SMOOTH_SCROLL_DURATION, 1);
                const ease = easeOutCubic(progress);
                const distance = startPosition * ease;

                window.scrollTo(0, startPosition - distance);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            }

            requestAnimationFrame(animateScroll);
        }

        function scrollToBottom() {
            const startPosition = window.scrollY || document.documentElement.scrollTop;
            const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3); // Faster easing
            }

            function animateScroll(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / SMOOTH_SCROLL_DURATION, 1);
                const ease = easeOutCubic(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            }

            requestAnimationFrame(animateScroll);
        }

        return { init };
    })();

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', SmartScrollButton.init);
    } else {
        SmartScrollButton.init();
    }

} // End duplicate prevention check
else {
    console.log('SmartScrollButton already loaded, skipping...');
}
