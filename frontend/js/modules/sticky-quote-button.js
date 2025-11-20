(function () {
    'use strict';

    const BUTTON_ID = 'sticky-quote-btn';
    const SCROLL_THRESHOLD = 300;

    function initStickyQuoteButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.innerHTML = `<i class="fas fa-quote-left"></i><span>Get Quote</span>`;
        document.body.appendChild(button);

        button.addEventListener("click", () => {
            if (window.openQuoteModal) window.openQuoteModal();
        });

        checkScroll();
        window.addEventListener("scroll", throttle(checkScroll, 50));
    }

    function checkScroll() {
        const btn = document.getElementById(BUTTON_ID);
        if (!btn) return;

        if (window.scrollY > SCROLL_THRESHOLD) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    }

    function throttle(fn, delay) {
        let allow = true;
        return () => {
            if (!allow) return;
            allow = false;
            fn();
            setTimeout(() => allow = true, delay);
        };
    }

    // Init when DOM is ready
    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", initStickyQuoteButton)
        : initStickyQuoteButton();

})();
