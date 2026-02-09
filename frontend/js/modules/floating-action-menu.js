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
    const fabContainer = document.querySelector('.fab-container');
    const fabQuoteBtn = document.getElementById('fabQuoteBtn');
    const fabBookBtn = document.getElementById('fabBookBtn');
    const fabChatBtn = document.getElementById('fabChatBtn');
    const fabFeedbackBtn = document.getElementById('fabFeedbackBtn');

    // Check if FAB exists on this page
    if (!fabMain || !fabActions) {
      console.log('FAB: Elements not found on this page');
      return;
    }

    // Make FAB visible (in case preloader hasn't done it)
    // Wait for page to be loaded or after a short delay
    function showFAB() {
      if (fabContainer) {
        fabContainer.classList.add('visible');
        console.log('FAB: Made visible');
      }
    }

    // Show FAB when page is loaded or after delay
    if (document.body.classList.contains('loaded')) {
      showFAB();
    } else {
      // Wait for loaded class or timeout
      const observer = new MutationObserver((mutations) => {
        if (document.body.classList.contains('loaded')) {
          showFAB();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

      // Fallback: show after 2 seconds regardless
      setTimeout(showFAB, 2000);

      // Also show on window load
      window.addEventListener('load', () => setTimeout(showFAB, 500));
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
      const quoteSection = document.querySelector('.hero-quote');

      if (quoteSection) {
        // If we are on index.html, just scroll down
        closeFAB();
        quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Focus the first input for better UX
        setTimeout(() => {
          const firstInput = document.getElementById('fromCity');
          if (firstInput) firstInput.focus();
        }, 600);
      } else {
        // If we are on booking.html or any other page, redirect to home with hash
        window.location.href = '../index.html#quote';
      }
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
        // Trigger chatbot modal using the correct ID
        const chatbotModal = document.getElementById('chatbot-modal-overlay');

        if (chatbotModal) {
          console.log('Opening chatbot modal');
          chatbotModal.classList.add('active');
          chatbotModal.style.display = 'flex';

          // Focus on the input field
          setTimeout(() => {
            const chatInput = document.getElementById('chatbot-input');
            if (chatInput) {
              chatInput.focus();
            }
          }, 300);
        } else {
          // Try to initialize the chatbot modal if it doesn't exist
          if (window.chatbotModal && window.chatbotModal.init) {
            console.log('Initializing chatbot modal');
            window.chatbotModal.init();
            // Try again after initialization
            setTimeout(() => {
              const modal = document.getElementById('chatbot-modal-overlay');
              if (modal) {
                modal.classList.add('active');
                modal.style.display = 'flex';
              }
            }, 100);
          } else {
            console.log('Chatbot modal not found and cannot be initialized');
          }
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
