// Navbar Loader Module - Statically loads navbar on all pages (works with file:// protocol)
(function () {
  'use strict';

  /**
   * Loads the navbar HTML into the page
   */
  function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    
    if (!navbarContainer) {
      console.warn('Navbar container not found. Add <div id="navbar-container"></div> to your page.');
      return;
    }

    // Determine the correct path based on current location
    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');
    
    // Get the navbar HTML template
    const navbarHTML = getNavbarHTML();
    
    // Insert the HTML
    navbarContainer.innerHTML = navbarHTML;
    
    // Fix paths for root pages
    if (!isInPagesFolder) {
      fixPathsForRootPage(navbarContainer);
    }
    
    // Initialize navbar functionality after loading
    initializeNavbar();
    
    // Set active link
    setActiveLink();
  }

  /**
   * Returns the navbar HTML template
   */
  function getNavbarHTML() {
    return `<link rel="stylesheet" href="../css/components/navbar.css">
<header class="header">
  <div class="navbar-container">
    <div class="navbar">
      <!-- Left Logo -->
      <div class="logo-container left-logo">
        <img src="../assets/images/left-logo.jpg" alt="Harihar Car Carriers" class="logo-img" />
      </div>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav" aria-label="Main navigation">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="../index.html" class="nav-link" data-page="home" data-tooltip="Home">
              <i class="fas fa-home"></i>
              <span>Home</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="../pages/about.html" class="nav-link" data-page="about" data-tooltip="About">
              <i class="fas fa-info-circle"></i>
              <span>About</span>
            </a>
          </li>

          <!-- Dropdown for services -->
          <li class="nav-item dropdown-nav" data-dropdown>

            <div class="nav-link" data-dropdown-btn>
              <i class="fas fa-truck-moving"></i>
              <span>Services</span>
              <i class="fa-solid fa-caret-down"></i>
            </div>

            <div class="dropdown-menu">
              <ul style="list-style-type: none;">
                <li class="nav-item">
                  <a href="../services.html" class="nav-link" data-page="services" data-tooltip="Services">
                    <i class="fas fa-truck-moving"></i>
                    <span>Our Services</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="../pages/how-it-works.html" class="nav-link" data-page="how-it-works" data-tooltip="How It Works">
                    <i class="fas fa-tasks"></i>
                    <span>How It Works</span>
                  </a>
                </li>
                <li>
                  <a href="../pages/booking.html" class="nav-link" data-page="booking" data-tooltip="Booking">
                    <i class="fas fa-calendar-check"></i>
                    <span>Booking</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="../pages/pricing.html" class="nav-link" data-page="pricing" data-tooltip="Pricing">
                    <i class="fas fa-tags"></i>
                    <span>Pricing</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="../pages/pricing-calculator.html" class="nav-link" data-page="pricing-calculator" data-tooltip="Pricing Calculator">
                    <i class="fas fa-calculator"></i>
                    <span>Pricing Calculator</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="../pages/tracking.html" class="nav-link" data-page="tracking" data-tooltip="Track Your Car">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Track Your Car</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="../pages/emergency-support.html" class="nav-link" data-page="emergency-support" data-tooltip="Emergency Support">
                    <i class="fas fa-life-ring"></i>
                    <span>Emergency Support</span>
                  </a>
                </li>
              </ul>
            </div>

          </li>

          <li class="nav-item">
            <a href="../pages/contact.html" class="nav-link" data-page="contact" data-tooltip="Contact">
              <i class="fas fa-phone"></i>
              <span>Contact</span>
            </a>
          </li>

          <li class="nav-item dropdown-nav" data-dropdown>
            <div class="nav-link" data-dropdown-btn>
              <i class="fa-solid fa-layer-group"></i>
              <span>More</span>
              <i class="fa-solid fa-caret-down"></i>
            </div>

            <div class="dropdown-menu">
              <ul style="list-style-type: none;">
                <li>
                  <a href="../pages/gallery.html" class="nav-link" data-page="gallery" data-tooltip="Gallery">
                    <i class="fas fa-images"></i>
                    <span>Gallery</span>
                  </a>
                </li>
                <li>
                  <a href="../pages/contributors.html" class="nav-link" data-page="contributors"
                    data-tooltip="Contributors">
                    <i class="fas fa-users"></i>
                    <span>Contributors</span>
                  </a>
                </li>
                <li>
                  <a href="../pages/careers.html" class="nav-link" data-page="careers" data-tooltip="Careers">
                    <i class="fas fa-briefcase"></i>
                    <span>Careers</span>
                  </a>
                </li>
                <li>
                  <a href="../pages/press-media.html" class="nav-link" data-page="press-media" data-tooltip="Press & Media">
                    <i class="fas fa-newspaper"></i>
                    <span>Press & Media</span>
                  </a>
                </li>
                <li>
                  <a href="../pages/blog.html" class="nav-link blog-link" data-tooltip="Blog">
                    <i class="fas fa-blog"></i>
                    <span>Blog</span>
                  </a>
                </li>
              </ul>
            </div>

          </li>
        </ul>

        <!-- creating a div for left align navigation links  -->
        <div class="nav-right-section">
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-bar">
              <input type="text" id="navbarSearch" placeholder="Search services..." aria-label="Search services">
              <i class="fas fa-search"></i>
            </div>
          </div>

          <div class="action-nav">
            <a href="../pages/enquiry.html" class="enquiry-link" data-tooltip="Enquiry">
              <i class="fas fa-question-circle"></i>
            </a>
          </div>
        </div>


        <div class="nav-actions">
          <a href="../pages/login.html" class="login-btn" data-tooltip="Login">
            <i class="fas fa-user"></i>
            <span>Login</span>
          </a>
        </div>
      </nav>
      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle mobile menu">
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
      </button>
    </div>
  </div>

  <!-- Mobile Navigation -->
  <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
    <div class="mobile-nav-header">
      <div class="mobile-logo">
        <img src="../assets/images/left-logo.jpg" alt="Harihar Car Carriers" />
        <span>Harihar Car Carriers</span>
      </div>
      <button class="mobile-close-btn" id="mobileCloseBtn" aria-label="Close mobile menu">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Mobile Search Bar -->
    <div class="mobile-search-container">
      <div class="mobile-search-bar">
        <i class="fas fa-search"></i>
        <input type="text" id="mobileSearch" placeholder="Search services..." aria-label="Search services">
      </div>
    </div>

    <ul class="mobile-nav-list">
      <li class="mobile-nav-item">
        <a href="../index.html" class="mobile-nav-link">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/about.html" class="mobile-nav-link">
          <i class="fas fa-info-circle"></i>
          <span>About</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../services.html" class="mobile-nav-link">
          <i class="fas fa-truck-moving"></i>
          <span>Services</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/how-it-works.html" class="mobile-nav-link">
          <i class="fas fa-tasks"></i>
          <span>How It Works</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/booking.html" class="mobile-nav-link">
          <i class="fas fa-calendar-check"></i>
          <span>Booking</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/contributors.html" class="mobile-nav-link">
          <i class="fas fa-users"></i>
          <span>Contributors</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/pricing.html" class="mobile-nav-link">
          <i class="fas fa-tags"></i>
          <span>Pricing</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/pricing-calculator.html" class="mobile-nav-link">
          <i class="fas fa-calculator"></i>
          <span>Pricing Calculator</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/tracking.html" class="mobile-nav-link">
          <i class="fas fa-map-marker-alt"></i>
          <span>Track Your Car</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/gallery.html" class="mobile-nav-link">
          <i class="fas fa-images"></i>
          <span>Gallery</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/contact.html" class="mobile-nav-link">
          <i class="fas fa-phone"></i>
          <span>Contact</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/emergency-support.html" class="mobile-nav-link">
          <i class="fas fa-life-ring"></i>
          <span>Emergency Support</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/careers.html" class="mobile-nav-link">
          <i class="fas fa-briefcase"></i>
          <span>Careers</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/press-media.html" class="mobile-nav-link">
          <i class="fas fa-newspaper"></i>
          <span>Press & Media</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/enquiry.html" class="mobile-nav-link">
          <i class="fas fa-question-circle"></i>
          <span>Enquiry</span>
        </a>
      </li>
      <li class="mobile-nav-item">
        <a href="../pages/blog.html" class="mobile-nav-link">
          <i class="fas fa-blog"></i>
          <span>Blog</span>
        </a>
      </li>
    </ul>
    <div class="mobile-nav-actions">
      <a href="../pages/login.html" class="mobile-login-btn">
        <i class="fas fa-user"></i>
        <span>Login</span>
      </a>
      <a href="../pages/booking.html" class="mobile-cta-btn">
        <i class="fas fa-truck"></i>
        <span>Book Instantly</span>
      </a>
    </div>
    <div class="mobile-contact-info">
      <div class="contact-item">
        <i class="fas fa-phone"></i>
        <span>+91 98765 43210</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <span>info@hariharcarcarriers.com</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-clock"></i>
        <span>24/7 Support</span>
      </div>
    </div>
  </nav>

  <!-- Navigation Overlay -->
  <div class="nav-overlay" id="navOverlay"></div>
</header>

<!-- Digital Clock (Fixed Top-Right) -->
<link rel="stylesheet" href="../css/components/digital-clock.css">
<div id="mac-clock">
  <span id="clock-full"></span>
</div>`;
  }

  /**
   * Fixes paths in navbar for root-level pages (index.html, services.html)
   */
  function fixPathsForRootPage(container) {
    // Fix image paths
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      const currentSrc = img.getAttribute('src');
      if (currentSrc && currentSrc.startsWith('../')) {
        img.setAttribute('src', currentSrc.replace(/^\.\.\//, './'));
      }
    });

    // Fix link paths
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
      const currentHref = link.getAttribute('href');
      if (currentHref && currentHref.startsWith('../')) {
        link.setAttribute('href', currentHref.replace(/^\.\.\//, './'));
      }
    });

    // Fix CSS link path
    const cssLink = container.querySelector('link[href]');
    if (cssLink) {
      const currentHref = cssLink.getAttribute('href');
      if (currentHref && currentHref.startsWith('../')) {
        cssLink.setAttribute('href', currentHref.replace(/^\.\.\//, './'));
      }
    }
  }

  /**
   * Initialize navbar functionality (mobile menu, dropdowns, etc.)
   */
  function initializeNavbar() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const navOverlay = document.getElementById('navOverlay');

    // Toggle mobile menu
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        if (mobileNav) mobileNav.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        document.body.style.overflow = (mobileNav && mobileNav.classList.contains('active')) ? 'hidden' : '';
      });
    }

    // Close mobile menu
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    function closeMobileMenu() {
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      if (mobileNav) mobileNav.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Dropdown functionality
    document.addEventListener('click', e => {
      const isDropdownButton = e.target.closest("[data-dropdown-btn]");
      if (!isDropdownButton && e.target.closest('[data-dropdown]') != null) return;

      let currentdropdown;
      if (isDropdownButton) {
        currentdropdown = e.target.closest('[data-dropdown]');
        currentdropdown.classList.toggle('active');
      }

      // close all already opened dropdown
      document.querySelectorAll('[data-dropdown].active').forEach(dropdown => {
        if (dropdown === currentdropdown) return;
        dropdown.classList.remove('active');
      });
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');

    if (header) {
      window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
          header.classList.remove('scroll-up');
          return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
          // Scrolling down
          header.classList.remove('scroll-up');
          header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
          // Scrolling up
          header.classList.remove('scroll-down');
          header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
      });
    }
  }

  /**
   * Set active link based on current page
   */
  function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (!linkHref) return;

      const linkPage = linkHref.split('/').pop();

      if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === '/' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Initialize digital clock
   */
  function initializeClock() {
    function updateClock() {
      const clockFull = document.getElementById('clock-full');

      if (clockFull) {
        const now = new Date();

        const day = now.toLocaleDateString('en-US', { weekday: 'short' });
        const date = now.getDate();
        const month = now.toLocaleDateString('en-US', { month: 'short' });
        const time = now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const formatted = `${day} ${date} ${month} ${time}`;
        clockFull.textContent = formatted;
      }
    }

    // Start clock
    setTimeout(() => {
      updateClock();
      setInterval(updateClock, 1000);
    }, 100);
  }

  // Load navbar when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadNavbar();
      initializeClock();
    });
  } else {
    loadNavbar();
    initializeClock();
  }

})();
