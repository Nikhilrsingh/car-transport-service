// Fixed Navbar.js - Replace the auth check section in your Navbar.js

// Initialize auth UI when DOM is ready or navbar is loaded
function initializeAuth() {
  // Auth state check - runs on every page load
  updateAuthUI();

  // Logout button handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    // Remove existing listeners to avoid duplicates
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

    newLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initializeAuth);
} else {
  // DOM already loaded
  initializeAuth();
}

// Also expose for manual calling after navbar loads
window.initializeAuth = initializeAuth;

// Global Search Focus Logic (Ctrl + K)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('navbarSearch') || document.getElementById('mobileSearch');
    if (searchInput) {
      searchInput.focus();
    }
  }
});

// Function to update auth UI based on login state
function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const profile = document.getElementById("profile");
  const userEmailSpan = document.getElementById("userEmail");

  // If navbar elements are not present, exit safely
  if (!loginBtn || !profile) return;

  // Check for token existence (primary check) and isLoggedIn flag (secondary check)
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");

  // User is logged in if token exists and isLoggedIn flag is true
  if (token && isLoggedIn && userEmail) {
    // User is logged in - show profile, hide login
    loginBtn.style.display = "none";
    profile.style.display = "flex";
    profile.classList.remove("hidden");
    if (userEmailSpan) {
      userEmailSpan.textContent = userEmail;
    }
  } else {
    // User is not logged in - show login, hide profile
    // Clear any stale data
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

// Logout function
function logout() {
  // Clear all auth data
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("token");

  // Update UI immediately
  updateAuthUI();

  // Show notification if available
  if (typeof showNotification === 'function') {
    showNotification("Logged out successfully", "success");
  } else {
    console.log("Logged out successfully");
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

// Expose functions globally
window.updateAuthUI = updateAuthUI;
window.logout = logout;

// Mobile Search Handler
function handleMobileSearch() {
  // Get search input or create a prompt
  const query = prompt("Enter search terms:");
  if (query && query.trim()) {
    // Redirect to search results or handle search
    console.log("Searching for:", query);
    // You can implement actual search functionality here
    // For now, let's redirect to services page as fallback
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.toLowerCase().includes('/pages/');
    const servicesPath = isInPagesFolder ? "./services.html" : "./services.html";
    window.location.href = servicesPath;
  }
}

// Expose mobile search handler globally
window.handleMobileSearch = handleMobileSearch;

// Mobile Navigation Scroll Fix
document.addEventListener('DOMContentLoaded', function () {
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavList = document.querySelector('.mobile-nav-list');

  if (mobileNav && mobileNavList) {
    // Enable smooth scrolling
    mobileNavList.style.scrollBehavior = 'smooth';

    // Prevent body scroll when mobile nav is open
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');

    function toggleBodyScroll(disable) {
      if (disable) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    }

    // When mobile nav opens
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          toggleBodyScroll(false);
        } else {
          mobileNav.classList.add('active');
          toggleBodyScroll(true);
        }
      });
    }

    // When mobile nav closes
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        toggleBodyScroll(false);
      });
    }

    // Close on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-overlay')) {
        mobileNav.classList.remove('active');
        toggleBodyScroll(false);
      }
    });
  }
});

