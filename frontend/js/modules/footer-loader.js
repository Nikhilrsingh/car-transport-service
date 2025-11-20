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

    // Load CSS into head if not already loaded
    loadFooterCSS(isInPagesFolder);

    // Fetch footer.html instead of using hardcoded template
    const footerPath = isInPagesFolder ? '../components/footer.html' : './components/footer.html';
    
    fetch(footerPath)
      .then(response => {
        if (!response.ok) throw new Error('Footer not found');
        return response.text();
      })
      .then(html => {
        // Remove CSS link tags from fetched HTML (we load CSS separately)
        const cleanHTML = html.replace(/<link[^>]*>/gi, '');
        // Remove script tags as they won't execute in innerHTML
        const cleanHTMLNoScripts = cleanHTML.replace(/<script[^>]*>.*?<\/script>/gi, '');
        footerContainer.innerHTML = cleanHTMLNoScripts;

        if (!isInPagesFolder) {
          fixPathsForRootPage(footerContainer);
        }

        // Set current year if element exists
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }

        // Load footer interaction script once
        loadFooterJS(isInPagesFolder);
        
        // Load FAB (Floating Action Menu) script
        loadFABJS(isInPagesFolder);
      })
      .catch(err => {
        console.error('Failed to load footer:', err);
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
      });
  }

  function loadFooterCSS(isInPagesFolder) {
    const cssBasePath = isInPagesFolder ? '../css/components/' : './css/components/';
    const cssFiles = ['footer.css', 'back-to-top-button.css', 'backtoBottom.css', 'floating-action-menu.css'];
    
    cssFiles.forEach(cssFile => {
      const cssPath = cssBasePath + cssFile;
      // Check if CSS is already loaded
      const existingLink = document.querySelector(`link[href*="${cssFile}"]`);
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
    if (existing) return;
    const jsBasePath = isInPagesFolder ? '../js/modules/' : './js/modules/';
    const script = document.createElement('script');
    script.src = jsBasePath + 'floating-action-menu.js';
    script.id = 'fab-script';
    script.onload = function() {
      console.log('FAB script loaded successfully');
    };
    script.onerror = function() {
      console.error('Failed to load FAB script');
    };
    document.body.appendChild(script);
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
</footer>`;
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
})();