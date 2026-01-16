/* ====================================
   BOTTOM ACTION BAR SCRIPT
   Handles Get Quote button, clock, and body padding
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

    // Initialize clock
    initClock();

    // Handle Get Quote button click
    const bottomQuoteBtn = document.getElementById('bottomQuoteBtn');
    if (bottomQuoteBtn) {
      bottomQuoteBtn.addEventListener('click', handleQuoteClick);
      console.log('Bottom Action Bar: Quote button event listener added');
    }

    // Handle Chatbot button click
    const bottomChatBtn = document.getElementById('bottomChatBtn');
    if (bottomChatBtn) {
      bottomChatBtn.addEventListener('click', handleChatbotClick);
      console.log('Bottom Action Bar: Chatbot button event listener added');
    }
  }

  function initClock() {
    const clockElement = document.getElementById('bottomBarClock');
    if (!clockElement) {
      console.log('Bottom Action Bar: Clock element not found');
      return;
    }

    function updateClock() {
      const now = new Date();
      
      // Format time in 12-hour format with AM/PM
      const time = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // Format date (Mon 5 Jan)
      const day = now.toLocaleDateString('en-US', { weekday: 'short' });
      const date = now.getDate();
      const month = now.toLocaleDateString('en-US', { month: 'short' });
      const dateStr = `${day} ${date} ${month}`;
      
      // Update clock HTML
      clockElement.innerHTML = `
        <span class="clock-time">${time}</span>
        <span class="clock-date">${dateStr}</span>
      `;
    }

    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
    console.log('Bottom Action Bar: Clock initialized');
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

  function handleChatbotClick() {
    console.log('Bottom Action Bar: Chatbot button clicked');
    
    // Try to open the chatbot modal using the correct ID
    const chatbotModal = document.getElementById('chatbot-modal-overlay');
    if (chatbotModal) {
      chatbotModal.classList.add('active');
      chatbotModal.style.display = 'flex';
      
      // Focus on the input field
      setTimeout(() => {
        const chatInput = document.getElementById('chatbot-input');
        if (chatInput) {
          chatInput.focus();
        }
      }, 300);
      
      console.log('Bottom Action Bar: Chatbot modal opened');
    } else {
      // Fallback: trigger the FAB chatbot button if it exists
      const fabChatBtn = document.getElementById('fabChatBtn');
      if (fabChatBtn) {
        fabChatBtn.click();
        console.log('Bottom Action Bar: Triggered FAB chatbot button');
      } else {
        // If no modal exists, try to initialize it
        if (window.chatbotModal && window.chatbotModal.init) {
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
          console.log('Bottom Action Bar: No chatbot modal or FAB button found');
        }
      }
    }
  }
})();
