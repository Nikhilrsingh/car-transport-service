/**
 * Login & Signup Module
 * Handles authentication, password management, and user interactions
 */

const API_BASE = "http://localhost:3000/api/auth";


// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

/**
 * Check and load remembered user credentials on page load
 */
function loadRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe && rememberedEmail) {
        const emailInput = document.querySelector('#login-form input[type="email"]');
        const rememberCheckbox = document.getElementById('remember');
        
        if (emailInput) emailInput.value = rememberedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
}

/**
 * Save or remove remembered user email based on checkbox
 */
function saveRememberMe(email, remember) {
    if (remember) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
    }
}

// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

/**
 * Toggle password visibility
 * @param {string} inputId - ID of the password input field
 * @param {HTMLElement} button - Toggle button element
 */
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const eyeIcon = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.textContent = '👁️‍🗨️';
        button.setAttribute('aria-label', 'Hide password');
    } else {
        input.type = 'password';
        eyeIcon.textContent = '👁️';
        button.setAttribute('aria-label', 'Show password');
    }
}

// ============================================
// PASSWORD STRENGTH METER
// ============================================

/**
 * Check password strength and update UI
 * @param {string} password - Password to check
 */
function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    if (!strengthFill || !strengthText) return;

    // Calculate strength score
    let strength = 0;
    let strengthLabel = '';
    let color = '';
    let width = 0;

    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = '';
        strengthFill.className = 'strength-fill';
        return;
    }

    // Criteria checks
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Determine strength level
    if (strength <= 2) {
        strengthLabel = 'Weak';
        color = '#ff4444';
        width = 33;
    } else if (strength <= 4) {
        strengthLabel = 'Medium';
        color = '#ffa500';
        width = 66;
    } else {
        strengthLabel = 'Strong';
        color = '#00cc66';
        width = 100;
    }

    // Update UI
    strengthFill.style.width = width + '%';
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = color;
}

// ============================================
// TAB SWITCHING
// ============================================

/**
 * Switch between login and signup tabs
 * @param {string} tab - Tab to switch to ('login' or 'signup')
 */
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        tabBtns[0].classList.add('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        tabBtns[1].classList.add('active');
    }
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value.trim();
    const rememberMe = document.getElementById('remember').checked;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Invalid email address', 'error');
        return;
    }

    saveRememberMe(email, rememberMe);

    try {
        showNotification('Logging in...', 'info');

        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            showNotification(data.message || 'Login failed', 'error');
            return;
        }

        // Save token
        localStorage.setItem('token', data.data.token);

        showNotification(`Welcome back, ${email}!`, 'success');

        // Redirect to dashboard or homepage
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);

    } catch (err) {
        console.error(err);
        showNotification('Something went wrong. Try again!', 'error');
    }
}


/**
 * Handle signup form submission
 * @param {Event} event - Form submit event
 */
async function handleSignup(event) {
    event.preventDefault();

    const form = event.target;
    const firstName = form.querySelectorAll('input[type="text"]')[0].value.trim();
    const lastName = form.querySelectorAll('input[type="text"]')[1].value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const termsAccepted = document.getElementById('terms').checked;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!termsAccepted) {
        showNotification('Please accept the Terms & Conditions', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Invalid email address', 'error');
        return;
    }

    if (!isValidPhone(phone)) {
        showNotification('Enter a valid 10-digit phone number', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    try {
        showNotification('Creating account...', 'info');

        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: firstName + " " + lastName,
                email,
                phone,
                password
            })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            showNotification(data.message || 'Signup failed', 'error');
            return;
        }

        localStorage.setItem('token', data.data.token);

        showNotification(`Account created for ${firstName}!`, 'success');

        setTimeout(() => {
            switchTab('login');
            const loginEmail = document.querySelector('#login-form input[type="email"]');
            if (loginEmail) loginEmail.value = email;
        }, 1000);

    } catch (err) {
        console.error(err);
        showNotification('Something went wrong. Try again!', 'error');
    }
}


// ============================================
// SOCIAL LOGIN HANDLERS
// ============================================

/**
 * Handle social login (Google, Facebook, Phone)
 * @param {string} provider - Social login provider
 */
function handleSocialLogin(provider) {

        if (provider === "google") {
            const redirectUri = encodeURIComponent(window.location.origin + "/auth-callback.html"); // your redirect page
            window.location.href = `${API_BASE}/google`

        }
    
     else if (provider === 'phone') {
        // Prompt for phone number and send OTP via backend
        const phone = prompt("Enter your 10-digit phone number:");
        if (!phone) return;

        if (!isValidPhone(phone)) {
            showNotification("Enter a valid 10-digit phone number", "error");
            return;
        }

        showNotification("Sending OTP...", "info");

        fetch(`${API_BASE}/phone-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                showNotification(data.message || "OTP send failed", "error");
                return;
            }

            const otp = prompt("Enter the OTP sent to your phone:");
            if (!otp) return;

            // Verify OTP with backend
            fetch(`${API_BASE}/phone-verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp })
            })
            .then(res => res.json())
            .then(result => {
                if (!result.success) {
                    showNotification(result.message || "OTP verification failed", "error");
                    return;
                }

                localStorage.setItem("token", result.data.token);
                showNotification("Login successful!", "success");
                setTimeout(() => window.location.href = "../index.html", 1000);
            })
            .catch(err => {
                console.error(err);
                showNotification("Something went wrong. Try again!", "error");
            });
        })
        .catch(err => {
            console.error(err);
            showNotification("Something went wrong. Try again!", "error");
        });
    }
}

// ============================================
// HANDLE GOOGLE OAUTH TOKEN ON LOGIN PAGE
// ============================================

// Check if redirected from Google OAuth with a token
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

if (token) {
    // Save token to localStorage
    localStorage.setItem("token", token);

    // Optional: clean up URL by removing the token query
    window.history.replaceState({}, document.title, window.location.pathname);

    // Redirect to dashboard
    window.location.href = "../index.html";
}



// ============================================
// PASSWORD RESET
// ============================================

/**
 * Handle forgot password functionality
 */
function handleForgotPassword() {
    const email = prompt('Enter your email address to reset password:');
    
    if (!email) return;
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showNotification('Sending password reset link...', 'info');
    
    // TODO: Implement actual password reset API
    setTimeout(() => {
        showNotification('Password reset link sent to your email!', 'success');
    }, 1000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.auth-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Navigate back to previous page
 */
function goBack() {
    window.history.back();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize login page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load remembered user if exists
    loadRememberedUser();
    
    // Add forgot password link handler
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    // Focus first input on page load
    const firstInput = document.querySelector('#login-form input[type="email"]');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt+L to switch to login tab
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            switchTab('login');
        }
        // Alt+S to switch to signup tab
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            switchTab('signup');
        }
    });
});

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================

// Make functions available globally for inline event handlers
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.switchTab = switchTab;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleSocialLogin = handleSocialLogin;
window.goBack = goBack;
