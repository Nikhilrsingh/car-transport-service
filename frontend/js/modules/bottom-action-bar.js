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

    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('.html');

    if (isIndexPage) {
      // If on index.html, scroll to the quote section
      console.log('Scrolling to quote section on index page');
      const quoteSection = document.querySelector('.hero-quote');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Focus on the first input field
        setTimeout(() => {
          const firstInput = document.getElementById('fromCity');
          if (firstInput) {
            firstInput.focus();
          }
        }, 500);
      }
    } else {
      // If on other pages, navigate to index.html with quote section anchor
      console.log('Navigating to index page quote section');
      if (currentPath.includes('/pages/')) {
        window.location.href = '../index.html#quote';
      } else {
        window.location.href = 'index.html#quote';
      }
    }
  }
})();
