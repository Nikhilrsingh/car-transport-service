/* ====================================
   FLOATING ACTION MENU (FAB) SCRIPT
   Handles expand/collapse and integrations
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
    console.log('FAB: Initializing...');
    
    // Check if there's a hash in the URL (e.g., #quote) and scroll to it
    if (window.location.hash === '#quote') {
      setTimeout(() => {
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
      }, 300); // Delay to ensure page is fully loaded
    }
    
    const fabMain = document.getElementById('fabMain');
    const fabActions = document.getElementById('fabActions');
    const fabQuoteBtn = document.getElementById('fabQuoteBtn');
    const fabBookBtn = document.getElementById('fabBookBtn');
    const fabChatBtn = document.getElementById('fabChatBtn');
    const fabFeedbackBtn = document.getElementById('fabFeedbackBtn');

    // Check if FAB exists on this page
    if (!fabMain || !fabActions) {
      console.log('FAB: Elements not found on this page');
      return;
    }

    console.log('FAB: Elements found, setting up event listeners');
    let isOpen = false;

    // Toggle FAB menu
    fabMain.addEventListener('click', toggleFAB);

    // Close FAB when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !e.target.closest('.fab-container')) {
        closeFAB();
      }
    });

    // Close FAB on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeFAB();
      }
    });

    // Action button handlers
    if (fabQuoteBtn) {
      fabQuoteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleQuoteClick();
      });
    }

    if (fabBookBtn) {
      fabBookBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleBookClick();
      });
    }

    if (fabChatBtn) {
      fabChatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleChatClick();
      });
    }

    if (fabFeedbackBtn) {
      fabFeedbackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleFeedbackClick();
      });
    }

    // Functions
    function toggleFAB(e) {
      e.stopPropagation();
      if (isOpen) {
        closeFAB();
      } else {
        openFAB();
      }
    }

    function openFAB() {
      isOpen = true;
      fabMain.setAttribute('aria-expanded', 'true');
      fabActions.classList.add('active');
      console.log('FAB: Menu opened');
    }

    function closeFAB() {
      isOpen = false;
      fabMain.setAttribute('aria-expanded', 'false');
      fabActions.classList.remove('active');
      console.log('FAB: Menu closed');
    }

    function handleQuoteClick() {
      console.log('Quote button clicked');
      closeFAB();
      
      // Small delay to ensure FAB closes smoothly
      setTimeout(() => {
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
          window.location.href = getRelativePath('index.html#quote');
        }
      }, 100);
    }

    function handleBookClick() {
      console.log('Book button clicked');
      closeFAB();
      
      setTimeout(() => {
        // Trigger booking modal or redirect to booking page
        const bookingModal = document.getElementById('bookingModal');
        
        if (bookingModal) {
          console.log('Opening booking modal');
          bookingModal.style.display = 'flex';
        } else {
          console.log('Redirecting to booking page');
          // Redirect to booking page
          window.location.href = getRelativePath('pages/booking.html');
        }
      }, 100);
    }

    function handleChatClick() {
      console.log('Chat button clicked');
      closeFAB();
      
      setTimeout(() => {
        // Trigger chatbot modal if it exists
        const chatbotModal = document.getElementById('chatbotModal');
        
        if (chatbotModal) {
          console.log('Opening chatbot modal');
          chatbotModal.style.display = 'flex';
        } else {
          console.log('Chatbot modal not found');
        }
      }, 100);
    }

    function handleFeedbackClick() {
      console.log('Feedback button clicked');
      closeFAB();
      
      setTimeout(() => {
        // Trigger feedback modal if it exists
        const feedbackModal = document.getElementById('feedbackModal');
        
        if (feedbackModal) {
          console.log('Opening feedback modal');
          feedbackModal.style.display = 'flex';
        } else {
          console.log('Redirecting to feedback page');
          // Redirect to feedback page as fallback
          window.location.href = getRelativePath('pages/Feedback.html');
        }
      }, 100);
    }

    // Helper function to get correct relative path
    function getRelativePath(path) {
      // Check if we're already in a subdirectory
      const currentPath = window.location.pathname;
      if (currentPath.includes('/pages/')) {
        return path.replace('pages/', '');
      }
      return path;
    }

    // Optional: Add pulse animation to main FAB on page load
    setTimeout(() => {
      fabMain.classList.add('pulse');
      setTimeout(() => {
        fabMain.classList.remove('pulse');
      }, 3000);
    }, 1000);
  }
})();
