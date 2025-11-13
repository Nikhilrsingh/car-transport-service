// Navbar Loader Module - Dynamically loads navbar component on all pages
(function () {
  'use strict';

  /**
   * Loads the navbar HTML into the page from components/navbar.html
   */
  async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    
    if (!navbarContainer) {
      console.warn('Navbar container not found. Add <div id="navbar-container"></div> to your page.');
      return;
    }

    // Determine the correct path based on current location
    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');
    const base = isInPagesFolder ? '..' : '.';

    // Fetch the navbar component
    const navbarUrl = `${base}/components/navbar.html?v=${Date.now()}`;
    try {
      const res = await fetch(navbarUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch navbar: ${res.status}`);
      const navbarHTML = await res.text();

      // Insert the HTML
      navbarContainer.innerHTML = navbarHTML;

      // Ensure navbar CSS is loaded from <head>
      ensureNavbarCss(base);

      // Remove any CSS link tags left inside the container to avoid duplicates
      navbarContainer.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
        const href = l.getAttribute('href') || '';
        if (href.includes('css/components/navbar.css')) {
          l.parentElement && l.parentElement.removeChild(l);
        }
      });

      // Fix paths for root pages
      if (!isInPagesFolder) {
        fixPathsForRootPage(navbarContainer);
      }

      // Initialize navbar functionality after loading
      initializeNavbar();

      // Set active link
      setActiveLink();

      // Ensure digital clock exists on pages that don't include it directly
      ensureClock(base);
    } catch (err) {
      console.error(err);
    }
  }

  // Removed static HTML template to eliminate duplication with components/navbar.html

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
    container.querySelectorAll('link[href]').forEach(cssLink => {
      const currentHref = cssLink.getAttribute('href');
      if (currentHref && currentHref.startsWith('../')) {
        cssLink.setAttribute('href', currentHref.replace(/^\.{2}\//, './'));
      }
    });
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
        e.preventDefault();
        e.stopPropagation();
        currentdropdown = e.target.closest('[data-dropdown]');
        currentdropdown.classList.toggle('active');
        console.log('Dropdown toggled:', currentdropdown.classList.contains('active') ? 'open' : 'closed');
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
   * Ensure digital clock exists and is running if not present on page
   */
  function ensureClock(basePath) {
    const existingClock = document.getElementById('mac-clock');
    if (existingClock) return; // Page already has a clock

    // Add CSS for clock if not already present
    const existingLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => (l.getAttribute('href') || '').includes('digital-clock.css'));
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${basePath}/css/components/digital-clock.css`;
      document.head.appendChild(link);
    }

    // Add clock markup
    const clock = document.createElement('div');
    clock.id = 'mac-clock';
    const span = document.createElement('span');
    span.id = 'clock-full';
    clock.appendChild(span);
    document.body.appendChild(clock);

    // Start clock updates
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

  function ensureNavbarCss(basePath) {
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => ((l.getAttribute('href') || '').includes('css/components/navbar.css')));
    if (!exists) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${basePath}/css/components/navbar.css`;
      document.head.appendChild(link);
    }
  }

  // Load navbar when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadNavbar();
    });
  } else {
    loadNavbar();
  }

})();
