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

    // Get footer HTML without CSS links (CSS is handled separately)
    const footerHTML = getFooterHTML();
    footerContainer.innerHTML = footerHTML;

    if (!isInPagesFolder) {
      fixPathsForRootPage(footerContainer);
    }

    // Set current year if element exists
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  function loadFooterCSS(isInPagesFolder) {
    const cssBasePath = isInPagesFolder ? '../css/components/' : './css/components/';
    const cssFiles = ['footer.css', 'back-to-top-button.css', 'backtoBottom.css'];
    
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

  function getFooterHTML() {
    function getFooterHTML() {
    return `
      <footer class="footer-section-enhanced">
        <div class="footer-container">
          
          <div class="footer-section about-us">
            <h2>About Us</h2>
            <p>We are a leading car transport service, dedicated to providing safe, reliable, and affordable vehicle shipping solutions. Our team of experts ensures your vehicle is handled with the utmost care.</p>
            <div class="social-links">
              <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" title="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
          </div>

          <div class="footer-section quick-links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="pages/about.html">About Us</a></li>
              <li><a href="pages/contact.html">Contact</a></li>
              <li><a href="pages/tracking.html">Tracking</a></li>
              <li><a href="pages/blog.html">Blog</a></li>
            </ul>
          </div>

          <div class="footer-section contact-info">
            <h2>Contact Info</h2>
            <ul>
              <li><i class="fas fa-map-marker-alt"></i> 123 Transport St, City, Country</li>
              <li><i class="fas fa-phone-alt"></i> +123 456 7890</li>
              <li><i class="fas fa-envelope"></i> info@cartransport.com</li>
            </ul>
          </div>

          <div class="footer-section newsletter">
            <h2>Newsletter</h2>
            <p>Subscribe to our newsletter for updates.</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Your Email" required>
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>
        <div class="footer-bottom">

      <div class="footer-road"></div>
      <div class="car-carrier-animation">
        <img
          class="moving-car-carrier"
          src="../assets/images/car-carrier.png"
          alt="Moving car across footer"
        />
      </div>

      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-content">
            <div class="copyright">
              &copy; <span id="current-year"></span> Harihar Car Carriers. All rights reserved.
            </div>
            <div class="footer-bottom-links">
              <a href="../pages/privacy-policy.html">Privacy Policy</a>
              <a href="../pages/Terms of Services.html">Terms of Service</a>
              <a href="#sitemap">Sitemap</a>
            </div>
            <div class="payment-methods">
              <i class="fab fa-cc-visa" title="Visa"></i>
              <i class="fab fa-cc-mastercard" title="MasterCard"></i>
              <i class="fab fa-cc-paypal" title="PayPal"></i>
              <i class="fas fa-university" title="Net Banking"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>`;
  }

          <div class="footer-section newsletter">
            <h2>Newsletter</h2>
            <p>Subscribe to our newsletter for updates.</p>
            <form class="newsletter-form">
              <input type="email" placeholder="Your Email" required>
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>
        <div class="footer-bottom">

      <div class="footer-column">
        <h3>Quick Links</h3>
        <ul class="footer-links">
          <li><a href="../index.html"><i class="fas fa-home"></i> Home</a></li>
          <li><a href="../pages/about.html"><i class="fas fa-info-circle"></i> About Us</a></li>
          <li><a href="../index.html#services"><i class="fas fa-truck-moving"></i> Services</a></li>
          <li><a href="../pages/gallery.html"><i class="fas fa-images"></i> Gallery</a></li>
          <li><a href="../pages/contact.html"><i class="fas fa-phone"></i> Contact</a></li>
          <li><a href="../pages/enquiry.html"><i class="fas fa-question-circle"></i> Enquiry</a></li>
          <li><a href="../pages/blog.html"><i class="fas fa-blog"></i> Blog</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h3>Our Services</h3>
        <ul class="footer-links">
          <li><a href="#door-to-door"><i class="fas fa-door-open"></i> Door-to-Door Transport</a></li>
          <li><a href="#nationwide"><i class="fas fa-map-marked-alt"></i> Nationwide Coverage</a></li>
          <li><a href="#commercial"><i class="fas fa-truck"></i> Commercial Vehicles</a></li>
          <li><a href="#personal"><i class="fas fa-car"></i> Personal Vehicles</a></li>
          <li><a href="#luxury"><i class="fas fa-gem"></i> Luxury Cars</a></li>
          <li><a href="#bikes"><i class="fas fa-motorcycle"></i> Bike Transport</a></li>
          <li><a href="#insurance"><i class="fas fa-shield-alt"></i> Insurance Coverage</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h3>Contact Info</h3>
        <ul class="contact-info">
          <li><i class="fas fa-map-marker-alt"></i><span>Nagpur, Maharashtra, India - 440001</span></li>
          <li><i class="fas fa-phone"></i><span>+91 XXXXX XXXXX</span></li>
          <li><i class="fas fa-envelope"></i><span>info@hariharcarcarriers.com</span></li>
          <li><i class="fas fa-clock"></i><span>24/7 Customer Support<br/>Emergency Services Available</span></li>
        </ul>
        <div class="newsletter-form">
          <p>Subscribe for updates & offers</p>
          <div class="newsletter-input">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Car Animation -->
  <div class="footer-road"></div>
  <div class="car-carrier-animation">
    <img
      class="moving-car-carrier"
      src="../assets/images/car-carrier.png"
      alt="Moving car across footer"
    />
  </div>

  <div class="footer-bottom">
    <div class="container">
      <div class="footer-bottom-content">
        <div class="copyright">
          &copy; <span id="current-year"></span> Harihar Car Carriers. All rights reserved.
        </div>
        <div class="footer-bottom-links">
          <a href="../pages/privacy-policy.html">Privacy Policy</a>
          <a href="../pages/Terms of Services.html">Terms of Service</a>
          <a href="#sitemap">Sitemap</a>
        </div>
        <div class="payment-methods">
          <i class="fab fa-cc-visa" title="Visa"></i>
          <i class="fab fa-cc-mastercard" title="MasterCard"></i>
          <i class="fab fa-cc-paypal" title="PayPal"></i>
          <i class="fas fa-university" title="Net Banking"></i>
        </div>
      </div>
    </div>
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


