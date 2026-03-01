/**
 * Route Guard - Smart Redirect for Authenticated Users
 * Prevents logged-in users from accessing login/signup pages
 * Automatically redirects them to dashboard
 */

(function initRouteGuard() {
  console.log('[Route Guard] Initializing authentication check...');

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('jwt_token') || null;
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = getAuthToken();
    const userData = getUserData();
    return !!(token && userData);
  };

  // Redirect to dashboard
  const redirectToDashboard = () => {
    console.log('[Route Guard] User is already authenticated. Redirecting to dashboard...');

    // Show a brief loading message
    const body = document.body;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: 'Poppins', sans-serif;
    `;

    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <div style="font-size: 3rem; margin-bottom: 20px;">
          <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
        </div>
        <h2 style="margin: 0 0 10px 0; font-size: 1.5rem;">Welcome Back!</h2>
        <p style="margin: 0; opacity: 0.8;">Redirecting to your dashboard...</p>
      </div>
    `;

    body.appendChild(overlay);

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = '../../admin/html/dashboard.html';
    }, 1000);
  };

  // Check if current page is login/signup page
  const isLoginPage = () => {
    const currentPath = window.location.pathname.toLowerCase();
    return currentPath.includes('login') || currentPath.includes('signup');
  };

  // Initialize guard on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', performGuardCheck);
  } else {
    performGuardCheck();
  }

  function performGuardCheck() {
    console.log('[Route Guard] Checking authentication status...');

    if (isLoginPage() && isAuthenticated()) {
      console.log('[Route Guard] ✓ Authentication verified');
      redirectToDashboard();
    } else {
      console.log('[Route Guard] ✓ No active session or not on login page');
    }
  }

  // Expose auth check functions globally for other scripts to use
  window.authGuard = {
    isAuthenticated,
    getAuthToken,
    getUserData,
    redirectToDashboard
  };
})();
