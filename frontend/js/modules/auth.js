// Fixed auth.js - Replace your existing auth.js with this

const API_BASE = "http://localhost:3000/api/auth";

// Show notifications
function showNotification(message, type = "info") {
  const existing = document.querySelector(".auth-notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `auth-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Handle Login Form Submission
async function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value.trim();
  
  if (!email || !password) {
    return showNotification("Fill all fields!", "error");
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("isLoggedIn", "true");
      showNotification("Login successful!", "success");
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 500);
    } else {
      showNotification(data.message || "Login failed", "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("Server error!", "error");
  }
}

// Handle Signup Form Submission
async function handleSignup(e) {
  e.preventDefault();
  
  const form = e.target;
  const firstName = form.querySelector('input[placeholder="First name"]').value.trim();
  const lastName = form.querySelector('input[placeholder="Last name"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const phone = form.querySelector('input[type="tel"]').value.trim();
  const password = form.querySelector('#signup-password').value.trim();
  const confirmPassword = form.querySelector('#confirm-password').value.trim();
  const termsAccepted = form.querySelector('#terms').checked;

  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    return showNotification("Fill all fields!", "error");
  }

  if (password !== confirmPassword) {
    return showNotification("Passwords don't match!", "error");
  }

  if (!termsAccepted) {
    return showNotification("Please accept Terms & Conditions", "error");
  }

  const name = `${firstName} ${lastName}`;
  showNotification("Creating account...", "info");

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      return showNotification(data.message || "Signup failed", "error");
    }

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    showNotification(`Account created for ${name}!`, "success");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  } catch (err) {
    console.error(err);
    showNotification("Something went wrong!", "error");
  }
}

// Handle Social Login
function handleSocialLogin(provider) {
  showNotification(`${provider} login coming soon!`, "info");
}

// Password toggle
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const eyeIcon = button.querySelector('.eye-icon');
  
  if (input.type === "password") {
    input.type = "text";
    eyeIcon.textContent = "🙈";
  } else {
    input.type = "password";
    eyeIcon.textContent = "👁️";
  }
}

// Switch tabs
function switchTab(tab) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const tabButtons = document.querySelectorAll(".login-tab-btn");

  if (tab === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    tabButtons[0].classList.add("active");
    tabButtons[1].classList.remove("active");
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    tabButtons[1].classList.add("active");
    tabButtons[0].classList.remove("active");
  }
}

// Expose functions globally
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleSocialLogin = handleSocialLogin;
window.togglePassword = togglePassword;
window.switchTab = switchTab;