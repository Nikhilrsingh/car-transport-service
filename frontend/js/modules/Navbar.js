/**
 * Navbar.js - Core logic for Header Search and Authentication
 */

// Initialize all navbar components
function initializeNavbar() {
  initializeAuth();
  initializeSearch();
}

/** 
 * SEARCH FUNCTIONALITY
 */
function initializeSearch() {
  const desktopSearch = document.getElementById('navbarSearch');
  const mobileSearch = document.getElementById('mobileSearch');

  if (desktopSearch) setupSearch(desktopSearch);
  if (mobileSearch) setupSearch(mobileSearch);
}

function setupSearch(input) {
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

  // Logic to handle relative paths based on current page depth
  const isInPages = window.location.pathname.includes('/pages/');
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

/**
 * AUTHENTICATION UI
 */
function initializeAuth() {
  updateAuthUI();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    // Clone to remove previous event listeners
    const freshBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(freshBtn, logoutBtn);

    freshBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const profile = document.getElementById("profile");
  const userEmailSpan = document.getElementById("userEmail");

  if (!loginBtn || !profile) return;

  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");

  if (token && isLoggedIn && userEmail) {
    loginBtn.style.display = "none";
    profile.style.display = "flex";
    profile.classList.remove("hidden");
    if (userEmailSpan) userEmailSpan.textContent = userEmail;
  } else {
    // Clean up stale auth data
    if (!token || !isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("token");
    }
    loginBtn.style.display = "inline-block";
    profile.style.display = "none";
    profile.classList.add("hidden");
  }
}

function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("token");

  updateAuthUI();

  if (typeof showNotification === 'function') {
    showNotification("Logged out successfully", "success");
  }

  const path = window.location.pathname;
  const loginPath = path.toLowerCase().includes('/pages/') ? "./login.html" : "./pages/login.html";

  setTimeout(() => {
    window.location.href = loginPath;
  }, 300);
}

// Export for global use
window.updateAuthUI = updateAuthUI;
window.logout = logoutUser;

// Initialize when navbar script is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavbar);
} else {
  initializeNavbar();
}
