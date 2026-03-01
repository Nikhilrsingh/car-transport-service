// Navbar Loader Module - Dynamically loads navbar component on all pages
(function () {
  'use strict';

  let retryCount = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

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
    const isInPagesFolder = path.toLowerCase().includes('/pages/');
    const base = isInPagesFolder ? '..' : '.';

    // Fetch the navbar component
    const navbarUrl = `${base}/components/navbar.html?v=${Date.now()}`;
    try {
      const res = await fetch(navbarUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch navbar: ${res.status}`);
      const navbarHTML = await res.text();

      // Reset retry count on success
      retryCount = 0;

      // Insert the HTML
      navbarContainer.innerHTML = navbarHTML;

      // Ensure navbar CSS is loaded from <head>
      ensureNavbarCss(base);
      ensureMiddleNavbarCss(base);

      // Remove any CSS link tags left inside the container to avoid duplicates
      navbarContainer.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
        const href = l.getAttribute('href') || '';
        if (href.includes('css/components/navbar.css') || href.includes('css/components/middle-navbar.css')) {
          l.parentElement && l.parentElement.removeChild(l);
        }
      });

      // Fix paths for root pages
      if (!isInPagesFolder) {
        fixPathsForRootPage(navbarContainer);
      }

      // Initialize navbar functionality after loading
      initializeNavbar();

      // Initialize Search functionality
      initializeSearch(isInPagesFolder);

      // Set active link
      setActiveLink();

      // CRITICAL: Initialize auth UI after navbar is fully loaded
      initializeAuthUI();

      // Ensure digital clock exists on pages that don't include it directly
      ensureClock(base);

    } catch (err) {
      console.error('Navbar load error:', err);

      // Retry loading if retries remaining
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying navbar load (${retryCount}/${MAX_RETRIES})...`);
        setTimeout(loadNavbar, RETRY_DELAY);
      }
    } finally {
      // Initialize Notification Manager - always run regardless of navbar success
      ensureNotificationManager(base);
    }
  }

  // Retry loading navbar when coming back online
  window.addEventListener('online', () => {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer && !navbarContainer.innerHTML.trim()) {
      retryCount = 0;
      loadNavbar();
    }
  });

  // Retry when tab becomes visible if navbar is empty
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      const navbarContainer = document.getElementById('navbar-container');
      if (navbarContainer && !navbarContainer.innerHTML.trim()) {
        retryCount = 0;
        loadNavbar();
      }
    }
  });

  /**
   * Initialize authentication UI
   * This runs AFTER the navbar HTML is loaded into the DOM
   */
  function initializeAuthUI() {
    const loginBtn = document.getElementById("loginBtn");
    const profile = document.getElementById("profile");
    const userEmailSpan = document.getElementById("userEmail");
    const logoutBtn = document.getElementById("logoutBtn");
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    // If navbar auth elements are not present, exit
    if (!loginBtn || !profile) {
      console.warn('Auth elements not found in navbar');
      return;
    }

    // Update the UI based on current auth state
    updateAuthUI();

    // Set up logout button handler (desktop)
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
      });
    }

    // Set up logout button handler (mobile)
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
      });
    }
  }

  /**
   * Update auth UI based on login state
   */
  function updateAuthUI() {
    const loginBtn = document.getElementById("loginBtn");
    const profile = document.getElementById("profile");
    const userEmailSpan = document.getElementById("userEmail");
    const dashboardBtn = document.getElementById("dashboardBtn");

    // Mobile elements
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileDashboardBtn = document.getElementById("mobileDashboardBtn");
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    if (!loginBtn || !profile) return;

    // Check for authentication
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");

    if (token && isLoggedIn && userEmail) {
      // User is logged in - Desktop nav
      loginBtn.style.display = "none";
      profile.style.display = "flex";
      profile.classList.remove("hidden");
      if (userEmailSpan) {
        userEmailSpan.textContent = userEmail;
      }

      // User is logged in - Mobile nav
      if (mobileLoginBtn) {
        mobileLoginBtn.style.display = "none";
        mobileLoginBtn.classList.add("hidden");
      }
      if (mobileLogoutBtn) {
        mobileLogoutBtn.style.display = "flex";
        mobileLogoutBtn.classList.remove("hidden");
      }
    } else {
      // User is not logged in
      if (!token || !isLoggedIn) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }

      // Desktop nav
      loginBtn.style.display = "inline-block";
      profile.style.display = "none";
      profile.classList.add("hidden");

      // Mobile nav
      if (mobileLoginBtn) {
        mobileLoginBtn.style.display = "flex";
        mobileLoginBtn.classList.remove("hidden");
      }
      if (mobileLogoutBtn) {
        mobileLogoutBtn.style.display = "none";
        mobileLogoutBtn.classList.add("hidden");
      }
    }

    // Dashboard button always visible (no login required)
    if (dashboardBtn) {
      dashboardBtn.style.display = "flex";
    }
    if (mobileDashboardBtn) {
      mobileDashboardBtn.style.display = "flex";
      mobileDashboardBtn.classList.remove("hidden");
    }
  }

  /**
   * Handle logout
   */
  function handleLogout() {
    // Clear all auth data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("lastDashboardTab");

    // Update UI immediately
    updateAuthUI();

    // Show notification if available
    if (typeof showNotification === 'function') {
      showNotification("Logged out successfully", "success");
    }

    // Determine correct path for redirect
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.toLowerCase().includes('/pages/');
    const loginPath = isInPagesFolder ? "./login.html" : "./pages/login.html";

    // Redirect to login page
    setTimeout(() => {
      window.location.href = loginPath;
    }, 300);
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
    const middleNavbar = document.querySelector('.middle-navbar');
    const upbar = document.querySelector('.upbar');
    const mainNavbar = document.querySelector('.navbar');

    if (header) {
      window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 100) {
          if (upbar) upbar.classList.remove('hidden');
          if (middleNavbar) middleNavbar.classList.remove('hidden');
          if (mainNavbar) mainNavbar.classList.remove('scrolled');
        } else {
          if (upbar) upbar.classList.add('hidden');
          if (middleNavbar) middleNavbar.classList.add('hidden');
          if (mainNavbar) mainNavbar.classList.add('scrolled');
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
    if (existingClock) return;

    const existingLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => (l.getAttribute('href') || '').includes('digital-clock.css'));
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${basePath}/css/components/digital-clock.css`;
      document.head.appendChild(link);
    }

    const clock = document.createElement('div');
    clock.id = 'mac-clock';
    const span = document.createElement('span');
    span.id = 'clock-full';
    clock.appendChild(span);
    document.body.appendChild(clock);

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

  function ensureMiddleNavbarCss(basePath) {
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => ((l.getAttribute('href') || '').includes('css/components/middle-navbar.css')));
    if (!exists) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${basePath}/css/components/middle-navbar.css`;
      document.head.appendChild(link);
    }
  }

  /**
   * Ensure NotificationManager script is loaded and initialized
   */
  function ensureNotificationManager(basePath) {
    const scriptId = 'notification-manager-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `${basePath}/js/modules/notification-manager.js`;
    script.onload = () => {
      if (window.NotificationManager) {
        window.notificationManager = new window.NotificationManager();
      }
    };
    document.head.appendChild(script);
  }

  // Expose auth functions globally for other scripts to use
  window.updateAuthUI = updateAuthUI;
  window.handleLogout = handleLogout;

  /**
   * Initialize search functionality for desktop and mobile
   */
  function initializeSearch(isInPages) {
    const desktopSearch = document.getElementById('navbarSearch');
    const mobileSearch = document.getElementById('mobileSearch');

    if (desktopSearch) setupSearch(desktopSearch, isInPages);
    if (mobileSearch) setupSearch(mobileSearch, isInPages);
  }

  function setupSearch(input, isInPages) {
    // Check if dropdown already exists, if not create it
    let dropdown = input.parentElement.querySelector('.search-results-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-results-dropdown';
      input.parentElement.appendChild(dropdown);
    }

    // Search Data - Mapping of site content
    const searchData = [
      { title: 'Home', url: 'index.html', keywords: ['home', 'main', 'landing'] },
      { title: 'About Us', url: 'pages/about.html', keywords: ['about', 'company', 'who we are', 'team'] },
      { title: 'Services', url: 'services.html', keywords: ['services', 'what we do', 'offerings'] },
      { title: 'Car Transport', url: 'services.html', keywords: ['car transport', 'vehicle shipping', 'auto transport'] },
      { title: 'Bike Transport', url: 'services.html', keywords: ['bike transport', 'motorcycle shipping', 'two wheeler'] },
      { title: 'Booking', url: 'pages/booking.html', keywords: ['booking', 'book now', 'reserve', 'schedule'] },
      { title: 'Pricing', url: 'pages/pricing.html', keywords: ['pricing', 'rates', 'cost', 'quote', 'price'] },
      { title: 'Track Your Car', url: 'pages/tracking.html', keywords: ['track', 'tracking', 'locate', 'find car'] },
      { title: 'Popular Cities', url: 'pages/city.html', keywords: ['city', 'location', 'agra', 'delhi', 'mumbai', 'popular'] },
      { title: 'Enquiry', url: 'pages/enquiry.html', keywords: ['enquiry', 'inquiry', 'ask', 'question'] },
      { title: 'Contact', url: 'pages/contact.html', keywords: ['contact', 'reach us', 'phone'] },
      { title: 'Feedback', url: 'pages/Feedback.html', keywords: ['feedback', 'rating', 'review'] }
    ];

    // Adjust URLs based on depth
    const processedData = searchData.map(item => {
      let finalUrl = item.url;
      if (isInPages) {
        if (!finalUrl.startsWith('pages/')) {
          finalUrl = '../' + finalUrl;
        } else {
          finalUrl = './' + finalUrl.replace('pages/', '');
        }
      } else {
        finalUrl = './' + finalUrl;
      }
      return { ...item, url: finalUrl };
    });

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      const filtered = processedData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.keywords.some(k => k.includes(query))
      ).slice(0, 6);

      if (filtered.length > 0) {
        dropdown.innerHTML = filtered.map(item => `
          <a href="${item.url}" class="search-result-item">
            <i class="fas fa-search"></i>
            <span>${item.title}</span>
          </a>
        `).join('');
        dropdown.style.display = 'block';
      } else {
        dropdown.innerHTML = '<div class="search-no-results">No results found</div>';
        dropdown.style.display = 'block';
      }
    });

    // UX: Hide results on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    // UX: Handle Enter key for the first result
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const activeItem = dropdown.querySelector('.search-result-item');
        if (activeItem) {
          window.location.href = activeItem.getAttribute('href');
        }
      }
    });
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

