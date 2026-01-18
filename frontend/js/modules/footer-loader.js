// Footer Loader Module - Statically loads footer on all pages (works with file:// protocol)
(function () {
  'use strict';

  function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) {
      // Silently ignore if page doesn't have a footer container
      return;
    }

    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');

    console.log('Footer Loader: Starting load process...');
    console.log('Footer Loader: Current path:', path);
    console.log('Footer Loader: Is in pages folder:', isInPagesFolder);

    // Load CSS into head if not already loaded
    loadFooterCSS(isInPagesFolder);

    // Fetch footer.html instead of using hardcoded template
    const footerPath = isInPagesFolder ? '../components/footer.html' : './components/footer.html';
    console.log('Footer Loader: Attempting to fetch:', footerPath);
    
    fetch(footerPath)
      .then(response => {
        console.log('Footer Loader: Fetch response status:', response.status);
        if (!response.ok) throw new Error('Footer not found');
        return response.text();
      })
      .then(html => {
        console.log('Footer Loader: Footer HTML loaded successfully');
        // Remove CSS link tags from fetched HTML (we load CSS separately)
        const cleanHTML = html.replace(/<link[^>]*>/gi, '');
        // Remove script tags as they won't execute in innerHTML
        const cleanHTMLNoScripts = cleanHTML.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        footerContainer.innerHTML = cleanHTMLNoScripts;

        if (!isInPagesFolder) {
          fixPathsForRootPage(footerContainer);
        }

        // Set current year if element exists
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }

        console.log('Footer Loader: Loading additional components...');
        
        // Load footer interaction script once
        loadFooterJS(isInPagesFolder);
        
        // Load FAB (Floating Action Menu) script
        loadFABJS(isInPagesFolder);
        
        // Load Bottom Action Bar script
        loadBottomActionBarJS(isInPagesFolder);
        
        // Load Smart Scroll Button script
        loadScrollButtonJS(isInPagesFolder);
        
        console.log('Footer Loader: All components loaded successfully');
      })
      .catch(err => {
        console.error('Failed to load footer:', err);
        console.log('Footer Loader: Using fallback template');
        // Fallback to inline template if fetch fails
        footerContainer.innerHTML = getFooterHTML();
        if (!isInPagesFolder) {
          fixPathsForRootPage(footerContainer);
        }
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
        loadFooterJS(isInPagesFolder);
        loadFABJS(isInPagesFolder);
        loadBottomActionBarJS(isInPagesFolder);
        loadScrollButtonJS(isInPagesFolder);
      });
  }

  function loadFooterCSS(isInPagesFolder) {
    const cssBasePath = isInPagesFolder ? '../css/components/' : './css/components/';
    const cssFiles = ['footer.css', 'scroll-button.css?v=5', 'floating-action-menu.css?v=6', 'bottom-action-bar.css?v=4'];
    
    cssFiles.forEach(cssFile => {
      const cssPath = cssBasePath + cssFile;
      // Check if CSS is already loaded (without version)
      const baseFileName = cssFile.split('?')[0];
      const existingLink = document.querySelector(`link[href*="${baseFileName}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        document.head.appendChild(link);
      }
    });
  }

  function loadFooterJS(isInPagesFolder) {
    const existing = document.getElementById('footer-enhancements');
    if (existing) return;
    const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';
    const script = document.createElement('script');
    script.src = jsBasePath + 'footer.js';
    script.id = 'footer-enhancements';
    document.body.appendChild(script);
  }

  function loadFABJS(isInPagesFolder) {
    const existing = document.getElementById('fab-script');
    if (existing) {
      console.log('FAB script already loaded');
      return;
    }
    
    // Small delay to ensure HTML is in DOM
    setTimeout(() => {
      const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';
      const script = document.createElement('script');
      script.src = jsBasePath + 'floating-action-menu.js';
      script.id = 'fab-script';
      console.log('Loading FAB script from:', script.src);
      script.onload = function() {
        console.log('FAB script loaded successfully');
      };
      script.onerror = function() {
        console.error('Failed to load FAB script from:', script.src);
      };
      document.body.appendChild(script);
    }, 100);
  }

  function loadBottomActionBarJS(isInPagesFolder) {
    const existing = document.getElementById('bottom-action-bar-script');
    if (existing) {
      console.log('Bottom Action Bar script already loaded');
      return;
    }
    
    // Small delay to ensure HTML is in DOM
    setTimeout(() => {
      const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';
      const script = document.createElement('script');
      script.src = jsBasePath + 'bottom-action-bar.js';
      script.id = 'bottom-action-bar-script';
      console.log('Loading Bottom Action Bar script from:', script.src);
      script.onload = function() {
        console.log('Bottom Action Bar script loaded successfully');
      };
      script.onerror = function() {
        console.error('Failed to load Bottom Action Bar script from:', script.src);
      };
      document.body.appendChild(script);
    }, 100);
  }

  function loadScrollButtonJS(isInPagesFolder) {
    // First create the button element if it doesn't exist
    if (!document.getElementById('smartScrollBtn')) {
      console.log('Creating smart scroll button element');
      const button = document.createElement('button');
      button.className = 'scroll-button';
      button.id = 'smartScrollBtn';
      button.setAttribute('aria-label', 'Scroll');
      button.setAttribute('data-tooltip', 'Back to Top');
      button.innerHTML = '<i class="fas fa-arrow-up"></i>';
      document.body.appendChild(button);
    }
    
    const existing = document.getElementById('scroll-button-script');
    if (existing) {
      console.log('Scroll Button script already loaded');
      return;
    }
    
    // Small delay to ensure HTML is in DOM
    setTimeout(() => {
      const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';
      const script = document.createElement('script');
      script.src = jsBasePath + 'scroll-button.js?v=4';
      script.id = 'scroll-button-script';
      console.log('Loading Scroll Button script from:', script.src);
      script.onload = function() {
        console.log('Scroll Button script loaded successfully');
      };
      script.onerror = function() {
        console.error('Failed to load Scroll Button script from:', script.src);
      };
      document.body.appendChild(script);
    }, 100);
  }

  // This is the single, correct function for your footer HTML
function getFooterHTML() {
  return `<footer class="footer" aria-label="Site footer">
  <div class="footer-accent" aria-hidden="true"></div>
  <button class="footer-toggle" aria-expanded="true" aria-controls="footer-main">
    <span class="toggle-label">Footer</span>
    <i class="fas fa-chevron-down"></i>
  </button>

  <div id="footer-main" class="container">
    <div class="footer-content footer-grid">

      <section class="footer-card footer-about footer-accordion" aria-labelledby="footer-about-header">
        <button class="accordion-header" id="footer-about-header" aria-expanded="false" aria-controls="footer-about-panel">
          <div class="footer-logo-group">
            <img src="../assets/images/left-logo.jpg" alt="Harihar Car Carriers" />
            <span class="footer-brand">Harihar Car Carriers</span>
          </div>
          <i class="fas fa-chevron-down accordion-icon" aria-hidden="true"></i>
        </button>
        <div id="footer-about-panel" class="accordion-panel" role="region" aria-labelledby="footer-about-header">
          <p>
            Your trusted partner for safe and reliable vehicle transportation across India. With over 12 years of experience, we ensure your vehicles reach their destination securely and on time.
          </p>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </section>

      <section class="footer-card footer-links-card footer-accordion" aria-labelledby="footer-links-header">
        <button class="accordion-header" id="footer-links-header" aria-expanded="false" aria-controls="footer-links-panel">
          <h3 class="footer-heading">Links</h3>
          <i class="fas fa-chevron-down accordion-icon" aria-hidden="true"></i>
        </button>
        <div id="footer-links-panel" class="accordion-panel two-col" role="region" aria-labelledby="footer-links-header">
          <ul class="footer-links">
            <li><a href="../index.html" class="link-underline"><i class="fas fa-home"></i> Home</a></li>
            <li><a href="../pages/about.html" class="link-underline"><i class="fas fa-info-circle"></i> About</a></li>
            <li><a href="../pages/how-it-works.html" class="link-underline"><i class="fas fa-tasks"></i> How It Works</a></li>
            <li><a href="../pages/gallery.html" class="link-underline"><i class="fas fa-images"></i> Gallery</a></li>
            <li><a href="../pages/pricing.html" class="link-underline"><i class="fas fa-tags"></i> Pricing</a></li>
            <li><a href="../pages/booking.html" class="link-underline"><i class="fas fa-calendar-check"></i> Book Now</a></li>
            <li><a href="../pages/enquiry.html" class="link-underline"><i class="fas fa-question-circle"></i> Enquiry</a></li>
            <li><a href="../pages/blog.html" class="link-underline"><i class="fas fa-blog"></i> Blog</a></li>
          </ul>
        </div>
      </section>

      <section class="footer-card footer-contact footer-accordion" aria-labelledby="footer-contact-header">
        <button class="accordion-header" id="footer-contact-header" aria-expanded="false" aria-controls="footer-contact-panel">
          <h3 class="footer-heading">Contact</h3>
          <i class="fas fa-chevron-down accordion-icon" aria-hidden="true"></i>
        </button>
        <div id="footer-contact-panel" class="accordion-panel" role="region" aria-labelledby="footer-contact-header">
          <ul class="contact-info">
            <li><i class="fas fa-map-marker-alt"></i><span>Nagpur, Maharashtra, India - 440001</span></li>
            <li><i class="fas fa-phone"></i><a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a></li>
            <li><i class="fas fa-envelope"></i><a href="mailto:info@hariharcarcarriers.com">info@hariharcarcarriers.com</a></li>
            <li><i class="fas fa-clock"></i><span>24/7 Customer Support</span></li>
          </ul>

          <div class="footer-cta">
            <a class="cta-primary" href="../pages/booking.html" aria-label="Get Instant Quote">
              <span>Get Instant Quote</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <form class="newsletter-animated" id="footerNewsletter" novalidate>
            <label for="newsletterEmail" class="sr-only">Email address</label>
            <input id="newsletterEmail" name="email" type="email" placeholder="Your email" required />
            <button type="submit" aria-label="Subscribe"><i class="fas fa-paper-plane"></i></button>
          </form>

          <div class="toast-stack" aria-live="polite" aria-atomic="true"></div>
        </div>
      </section>

    </div>
  </div>

  <div class="footer-road" aria-hidden="true"></div>
  <div class="car-carrier-animation" aria-hidden="true">
    <img class="moving-car-carrier" src="../assets/images/car-carrier.png" alt="" />
  </div>

  <div class="footer-bottom" role="contentinfo">
    <div class="footer-bottom-content">
      <div class="copyright">© <span id="current-year">2025</span> Harihar Car Carriers</div>
      <div class="footer-bottom-links">
        <a class="link-underline" href="../pages/privacy-policy.html">Privacy</a>
        <a class="link-underline" href="../pages/Terms of Services.html">Terms</a>
        <a class="link-underline" href="#sitemap">Sitemap</a>
      </div>
      <div class="payment-methods" aria-label="Payment methods">
        <i class="fab fa-cc-visa" title="Visa"></i>
        <i class="fab fa-cc-mastercard" title="MasterCard"></i>
        <i class="fab fa-cc-paypal" title="PayPal"></i>
        <i class="fas fa-university" title="Net Banking"></i>
      </div>
    </div>
  </div>

  <div class="mini-sticky-footer" role="region" aria-label="Quick contact bar">
    <a href="tel:+91XXXXXXXXXX" class="mini-call">
      <i class="fas fa-phone"></i>
      <span>Call</span>
    </a>
    <a href="../pages/booking.html" class="mini-quote">
      <i class="fas fa-bolt"></i>
      <span>Quote</span>
    </a>
    <button class="mini-up" aria-controls="footer-main" aria-expanded="false">
      <i class="fas fa-chevron-up"></i>
      <span>Open</span>
    </button>
  </div>
</footer>

<!-- 🚀 Modern Floating Action Menu (FAB) -->
<div class="fab-container">
  <button class="fab-main" id="fabMain" aria-label="Open actions menu" aria-expanded="false">
    <i class="fas fa-plus fab-icon"></i>
  </button>

  <!-- Action Buttons (hidden by default) -->
  <div class="fab-actions" id="fabActions">
    <!-- Get Quote -->
    <button class="fab-action-btn" id="fabQuoteBtn" data-tooltip="Get Quote">
      <i class="fas fa-file-invoice-dollar"></i>
    </button>

    <!-- Book Now -->
    <button class="fab-action-btn" id="fabBookBtn" data-tooltip="Book Now">
      <i class="fas fa-calendar-check"></i>
    </button>

    <!-- WhatsApp -->
    <a href="https://wa.me/919372693389" class="fab-action-btn" data-tooltip="WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>

    <!-- Call -->
    <a href="tel:+919372693389" class="fab-action-btn" data-tooltip="Call Us">
      <i class="fas fa-phone"></i>
    </a>

    <!-- Feedback -->
    <button class="fab-action-btn" id="fabFeedbackBtn" data-tooltip="Feedback">
      <i class="fas fa-star"></i>
    </button>

    <!-- Chatbot -->
    <button class="fab-action-btn" id="fabChatBtn" data-tooltip="Chat">
      <i class="fas fa-comments"></i>
    </button>
  </div>
</div>

<!-- Bottom Action Bar (desktop only) -->
<div class="bottom-action-bar-fixed">
  <!-- Left Section: Clock and Chatbot -->
  <div class="bottom-bar-left">
    <!-- Digital Clock -->
    <div class="bottom-bar-clock" id="bottomBarClock"></div>
    
    <!-- Chatbot Icon (next to clock) -->
    <button class="bottom-bar-chat-icon" id="bottomChatBtn" aria-label="Open Chatbot" title="Chat with us">
      <i class="fas fa-comments" aria-hidden="true"></i>
    </button>
  </div>

  <!-- WhatsApp Button -->
  <a href="https://wa.me/919372693389" class="bottom-action-btn whatsapp" aria-label="Contact via WhatsApp">
    <i class="fab fa-whatsapp"></i>
  </a>

  <!-- Get Quote Button (Center) -->
  <button id="bottomQuoteBtn" class="bottom-action-btn quote" aria-label="Get Quote">
    Get Quote
  </button>

  <!-- Call Button -->
  <a href="tel:+919372693389" class="bottom-action-btn call" aria-label="Call Us">
    <i class="fas fa-phone-alt"></i>
  </a>
</div>`;
}

  function fixPathsForRootPage(container) {
    // Fix image paths
    const images = container.querySelectorAll('img[src^="../"]');
    images.forEach((img) => {
      const currentSrc = img.getAttribute('src');
      if (currentSrc && currentSrc.startsWith('../')) {
        img.setAttribute('src', currentSrc.replace(/^\.\.\//, './'));
      }
    });

    // Fix link paths - handle both ../ and pages/ paths
    const links = container.querySelectorAll('a[href]');
    links.forEach((link) => {
      const currentHref = link.getAttribute('href');
      if (!currentHref || currentHref.startsWith('#') || currentHref.startsWith('http')) {
        return; // Skip anchors and external links
      }
      
      if (currentHref.startsWith('../pages/')) {
        // Convert ../pages/ to ./pages/ for root pages
        link.setAttribute('href', currentHref.replace(/^\.\.\/pages\//, './pages/'));
      } else if (currentHref.startsWith('../')) {
        // Convert other ../ paths to ./
        link.setAttribute('href', currentHref.replace(/^\.\.\//, './'));
      } else if (currentHref.startsWith('pages/')) {
        // Keep pages/ as is for root pages
        // No change needed
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
  
  // Also load the component initializer as a safety mechanism
  function loadComponentInitializer() {
    const existing = document.getElementById('component-initializer-script');
    if (existing) return;
    
    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');
    const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';
    
    const script = document.createElement('script');
    script.src = jsBasePath + 'component-initializer.js';
    script.id = 'component-initializer-script';
    script.onload = function() {
      console.log('Component Initializer script loaded');
    };
    document.body.appendChild(script);
  }
  
  // Load component initializer after a short delay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(loadComponentInitializer, 100);
    });
  } else {
    setTimeout(loadComponentInitializer, 100);
  }
})();