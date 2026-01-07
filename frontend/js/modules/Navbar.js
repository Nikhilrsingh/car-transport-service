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