/* ====================================
   COMPONENT INITIALIZER
   Ensures FAB, Bottom Action Bar, and Scroll Button are available on all pages
   This is a global safety mechanism that works independently of footer-loader
   ==================================== */

(function () {
  'use strict';

  let initializationAttempts = 0;
  const maxAttempts = 10;
  const retryDelay = 500; // 500ms for faster initialization

  function initializeComponents() {
    initializationAttempts++;
    console.log(`Component Initializer: Attempt ${initializationAttempts}/${maxAttempts}`);

    // Check if components are already loaded (regardless of footer container)
    const fabContainer = document.querySelector('.fab-container');
    const bottomBar = document.querySelector('.bottom-action-bar-fixed');
    const scrollBtn = document.getElementById('smartScrollBtn');

    const componentsLoaded = {
      fab: !!fabContainer,
      bottomBar: !!bottomBar,
      scrollBtn: !!scrollBtn
    };

    console.log('Component Initializer: Component status:', componentsLoaded);

    // If all components are loaded, ensure scripts are initialized
    if (componentsLoaded.fab && componentsLoaded.bottomBar && componentsLoaded.scrollBtn) {
      console.log('Component Initializer: All components loaded successfully');
      // Ensure scripts are loaded even if HTML exists
      loadComponentScripts();
      return;
    }

    // Check if footer container exists
    const footerContainer = document.getElementById('footer-container');
    const hasFooterContent = footerContainer && footerContainer.innerHTML.trim().length > 0;

    // Add missing components regardless of footer state
    console.log('Component Initializer: Adding missing components...');
    
    // Add missing FAB
    if (!componentsLoaded.fab) {
      addFABComponent();
    }

    // Add missing Bottom Action Bar
    if (!componentsLoaded.bottomBar) {
      addBottomActionBar();
    }

    // Add missing Scroll Button
    if (!componentsLoaded.scrollBtn) {
      addScrollButton();
    }

    // Load CSS if not already loaded
    loadComponentCSS();

    // Load the JavaScript for the components
    loadComponentScripts();

    // If footer hasn't loaded yet and we haven't reached max attempts, schedule another check
    if (!hasFooterContent && initializationAttempts < maxAttempts) {
      console.log(`Component Initializer: Footer not loaded yet, will check again in ${retryDelay}ms`);
      setTimeout(initializeComponents, retryDelay);
    }
  }

  function addFABComponent() {
    // Check again to prevent duplicates
    if (document.querySelector('.fab-container')) {
      console.log('Component Initializer: FAB already exists, skipping');
      return;
    }
    
    console.log('Component Initializer: Adding FAB component');
    
    const fabHTML = `
      <div class="fab-container">
        <button class="fab-main" id="fabMain" aria-label="Open actions menu" aria-expanded="false">
          <i class="fas fa-plus fab-icon"></i>
        </button>

        <div class="fab-actions" id="fabActions">
          <button class="fab-action-btn" id="fabQuoteBtn" data-tooltip="Get Quote">
            <i class="fas fa-file-invoice-dollar"></i>
          </button>
          <button class="fab-action-btn" id="fabBookBtn" data-tooltip="Book Now">
            <i class="fas fa-calendar-check"></i>
          </button>
          <a href="https://wa.me/919372693389" class="fab-action-btn" data-tooltip="WhatsApp">
            <i class="fab fa-whatsapp"></i>
          </a>
          <a href="tel:+919372693389" class="fab-action-btn" data-tooltip="Call Us">
            <i class="fas fa-phone"></i>
          </a>
          <button class="fab-action-btn" id="fabFeedbackBtn" data-tooltip="Feedback">
            <i class="fas fa-star"></i>
          </button>
          <button class="fab-action-btn" id="fabChatBtn" data-tooltip="Chat">
            <i class="fas fa-comments"></i>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', fabHTML);
    console.log('Component Initializer: FAB component added');
  }

  function addBottomActionBar() {
    // Check again to prevent duplicates
    if (document.querySelector('.bottom-action-bar-fixed')) {
      console.log('Component Initializer: Bottom Action Bar already exists, skipping');
      return;
    }
    
    console.log('Component Initializer: Adding Bottom Action Bar component');
    
    const bottomBarHTML = `
      <div class="bottom-action-bar-fixed">
        <div class="bottom-bar-left">
          <div class="bottom-bar-clock" id="bottomBarClock"></div>
          <button class="bottom-bar-chat-icon" id="bottomChatBtn" aria-label="Open Chatbot" title="Chat with us">
            <i class="fas fa-comments" aria-hidden="true"></i>
          </button>
        </div>
        <a href="https://wa.me/919372693389" class="bottom-action-btn whatsapp" aria-label="Contact via WhatsApp">
          <i class="fab fa-whatsapp"></i>
        </a>
        <button id="bottomQuoteBtn" class="bottom-action-btn quote" aria-label="Get Quote">
          Get Quote
        </button>
        <a href="tel:+919372693389" class="bottom-action-btn call" aria-label="Call Us">
          <i class="fas fa-phone-alt"></i>
        </a>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bottomBarHTML);
    console.log('Component Initializer: Bottom Action Bar added');
  }

  function addScrollButton() {
    // Check again to prevent duplicates
    if (document.getElementById('smartScrollBtn')) {
      console.log('Component Initializer: Scroll Button already exists, skipping');
      return;
    }
    
    console.log('Component Initializer: Adding Scroll Button component');
    
    const button = document.createElement('button');
    button.className = 'scroll-button';
    button.id = 'smartScrollBtn';
    button.setAttribute('aria-label', 'Scroll');
    button.setAttribute('data-tooltip', 'Back to Top');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(button);
    console.log('Component Initializer: Scroll Button added');
  }

  function loadComponentCSS() {
    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');
    const cssBasePath = isInPagesFolder ? '../css/components/' : './css/components/';
    
    const cssFiles = [
      'floating-action-menu.css',
      'bottom-action-bar.css',
      'scroll-button.css'
    ];
    
    cssFiles.forEach(cssFile => {
      // Check if CSS is already loaded
      const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssBasePath + cssFile;
        document.head.appendChild(link);
        console.log(`Component Initializer: Loaded CSS: ${cssFile}`);
      }
    });
  }

  function loadComponentScripts() {
    console.log('Component Initializer: Loading component scripts');
    
    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');
    const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';

    // Load FAB script
    if (!document.getElementById('fab-script')) {
      loadScript(jsBasePath + 'floating-action-menu.js', 'fab-script');
    }

    // Load Bottom Action Bar script
    if (!document.getElementById('bottom-action-bar-script')) {
      loadScript(jsBasePath + 'bottom-action-bar.js', 'bottom-action-bar-script');
    }

    // Load Scroll Button script
    if (!document.getElementById('scroll-button-script')) {
      loadScript(jsBasePath + 'scroll-button.js', 'scroll-button-script');
    }
  }

  function loadScript(src, id) {
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.onload = function() {
      console.log(`Component Initializer: ${id} loaded successfully`);
    };
    script.onerror = function() {
      console.error(`Component Initializer: Failed to load ${id} from ${src}`);
    };
    document.body.appendChild(script);
  }

  // Initialize immediately if DOM is ready
  function startInitialization() {
    console.log('Component Initializer: Starting initialization...');
    // Run immediately
    initializeComponents();
    // Also run after a short delay as backup
    setTimeout(initializeComponents, 300);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInitialization);
  } else {
    startInitialization();
  }

  // Also initialize when window loads (as a backup)
  window.addEventListener('load', function() {
    setTimeout(initializeComponents, 500);
  });

  // Export for manual initialization if needed
  window.ComponentInitializer = {
    init: initializeComponents,
    addFAB: addFABComponent,
    addBottomBar: addBottomActionBar,
    addScrollButton: addScrollButton
  };
})();