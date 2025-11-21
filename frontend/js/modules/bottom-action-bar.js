/* ====================================
   BOTTOM ACTION BAR SCRIPT
   Handles Get Quote button and body padding
   ==================================== */

(function () {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Bottom Action Bar: Initializing...');

    // Add class to body for proper padding
    document.body.classList.add('has-bottom-bar');

    // Handle Get Quote button click
    const bottomQuoteBtn = document.getElementById('bottomQuoteBtn');
    if (bottomQuoteBtn) {
      bottomQuoteBtn.addEventListener('click', handleQuoteClick);
      console.log('Bottom Action Bar: Quote button event listener added');
    }
  }

  function handleQuoteClick() {
    console.log('Bottom Action Bar: Quote button clicked');

    // Try to open quote modal if it exists
    const quoteModal = document.getElementById('quoteModal');
    const openQuoteModalBtn = document.getElementById('openQuoteModal');

    if (quoteModal) {
      console.log('Opening quote modal');
      quoteModal.classList.remove('hidden');
      quoteModal.style.display = 'flex';
    } else if (openQuoteModalBtn) {
      console.log('Clicking existing quote button');
      openQuoteModalBtn.click();
    } else {
      // Redirect to booking page as fallback
      console.log('Redirecting to booking page');
      const currentPath = window.location.pathname;
      if (currentPath.includes('/pages/')) {
        window.location.href = 'booking.html';
      } else {
        window.location.href = 'pages/booking.html';
      }
    }
  }
})();
