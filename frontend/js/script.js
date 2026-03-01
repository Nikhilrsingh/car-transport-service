// ================= LOCAL STORAGE KEYS =================
const FORM_STORAGE_KEY = "bookingFormData";
const STEP_STORAGE_KEY = "bookingFormStep";
const TOTAL_STEPS = 3;

// ================= PHONE VALIDATION UTILITY =================
/**
 * Validates Indian mobile phone numbers
 * @param {string} phone - The phone number to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
function validateIndianPhone(phone) {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Check if exactly 10 digits
  if (digitsOnly.length !== 10) {
    return {
      isValid: false,
      message: "Please enter a valid 10-digit mobile number"
    };
  }

  // Check if starts with 6, 7, 8, or 9 (Indian mobile standard)
  if (!/^[6-9]/.test(digitsOnly)) {
    return {
      isValid: false,
      message: "Mobile number must start with 6, 7, 8, or 9"
    };
  }

  return {
    isValid: true,
    message: ""
  };
}


// ================= CUSTOM TOAST FUNCTION =================
function showContactToast(title, message) {
  let container = document.querySelector('.custom-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'custom-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';

  toast.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <div class="custom-toast-content">
      <span class="custom-toast-title">${title}</span>
      <span class="custom-toast-message">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => {
      toast.remove();
      if (container.children.length === 0) {
        // keep container or remove? keeping is fine
      }
    });
  }, 4000);
}

// ================= PHONE INPUT GLOBAL HANDLER =================
document.addEventListener("DOMContentLoaded", function () {
  const allSplitPhones = document.querySelectorAll('#splitPhone');

  allSplitPhones.forEach(splitPhoneInput => {
    const inputGrid = splitPhoneInput.closest('.phone-input-grid');
    if (!inputGrid) return;

    // Create error message if it doesn't exist
    let phoneErrorMsg = inputGrid.parentElement.querySelector('.phone-error-message');
    if (!phoneErrorMsg) {
      phoneErrorMsg = document.createElement('div');
      phoneErrorMsg.className = 'phone-error-message';
      inputGrid.parentElement.appendChild(phoneErrorMsg);
    }

    // Create success icon if it doesn't exist
    let phoneSuccessIcon = splitPhoneInput.parentElement.querySelector('.phone-success-icon');
    if (!phoneSuccessIcon) {
      phoneSuccessIcon = document.createElement('i');
      phoneSuccessIcon.className = 'fas fa-check-circle phone-success-icon';
      splitPhoneInput.parentElement.style.position = 'relative';
      splitPhoneInput.parentElement.appendChild(phoneSuccessIcon);
    }

    // Real-time phone validation
    splitPhoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.substring(0, 10);
      e.target.value = value;

      const validation = validateIndianPhone(e.target.value);

      if (e.target.value.length === 0) {
        e.target.classList.remove('error', 'success', 'shake');
        phoneErrorMsg.classList.remove('show');
        phoneSuccessIcon.classList.remove('show');
      } else if (validation.isValid) {
        e.target.classList.remove('error', 'shake');
        e.target.classList.add('success');
        phoneErrorMsg.classList.remove('show');
        phoneSuccessIcon.classList.add('show');
      } else {
        e.target.classList.remove('success');
        e.target.classList.add('error');
        phoneErrorMsg.textContent = validation.message;
        phoneErrorMsg.classList.add('show');
        phoneSuccessIcon.classList.remove('show');
      }
    });

    // Shake on invalid keypress
    splitPhoneInput.addEventListener("keypress", function (e) {
      if (!/[0-9]/.test(String.fromCharCode(e.which))) {
        e.preventDefault();
        splitPhoneInput.classList.add('shake');
        setTimeout(() => splitPhoneInput.classList.remove('shake'), 500);
      }
    });
  });
});

// ================= CONTACT FORM =================
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('input[type="text"]').value;
      const splitPhoneInput = contactForm.querySelector('#splitPhone');
      const countryCodeSelect = contactForm.querySelector('#countryCode');
      const phoneErrorMsg = contactForm.parentElement.querySelector('.phone-error-message');
      const phoneSuccessIcon = splitPhoneInput?.parentElement.querySelector('.phone-success-icon');

      if (!splitPhoneInput || !countryCodeSelect) return;

      const phoneDigits = splitPhoneInput.value;
      const prefix = countryCodeSelect.value;
      const fullPhone = prefix + phoneDigits;

      // Validate phone before submission
      const validation = validateIndianPhone(phoneDigits);
      if (!validation.isValid) {
        splitPhoneInput.classList.add('error', 'shake');
        if (phoneErrorMsg) {
          phoneErrorMsg.textContent = validation.message;
          phoneErrorMsg.classList.add('show');
        }
        setTimeout(() => splitPhoneInput.classList.remove('shake'), 500);
        return; // Prevent form submission
      }

      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        showContactToast(
          "Request Received",
          `Thank you ${name}! Your request has been received. We'll contact you at ${fullPhone}.`
        );

        contactForm.reset();
        splitPhoneInput.classList.remove('error', 'success');
        if (phoneErrorMsg) phoneErrorMsg.classList.remove('show');
        if (phoneSuccessIcon) phoneSuccessIcon.classList.remove('show');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Initialize Coming Soon Handler for all dead links
  initComingSoonHandler();
});

/**
 * Intercepts all clicks on href="#" and shows a "Coming Soon" notification
 */
function initComingSoonHandler() {
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (anchor && anchor.getAttribute('href') === '#') {
      e.preventDefault();

      const featureName = anchor.getAttribute('aria-label') ||
        anchor.innerText.trim() ||
        "This feature";

      showContactToast(
        "Coming Soon",
        `${featureName} is currently in development. Stay tuned!`
      );
    }
  });
}


// ================= INPUT ANIMATIONS =================
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".input-group input, .input-group select")
    .forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.style.transform = "scale(1.02)";
      });

      input.addEventListener("blur", function () {
        this.parentElement.style.transform = "scale(1)";
      });
    });
});

// ================= FORM DATA PERSISTENCE =================
function saveFormData() {
  const bookingForm = document.getElementById("autoSaveForm");
  if (!bookingForm) return;

  const data = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY)) || {};

  bookingForm.querySelectorAll("input, select, textarea").forEach(field => {
    if (field.name) {
      data[field.name] = field.value;
    }
  });

  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
}

function restoreFormData() {
  const bookingForm = document.getElementById("autoSaveForm");
  if (!bookingForm) return;

  const savedData = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY));
  if (!savedData) return;

  bookingForm.querySelectorAll("input, select, textarea").forEach(field => {
    if (field.name && savedData[field.name] !== undefined) {
      field.value = savedData[field.name];
    }
  });
}


// ================= STEP UI + PERCENTAGE (BULLETPROOF) =================
function updateStepUI(stepNumber) {
  // Update step indicators
  document.querySelectorAll(".step").forEach((step, index) => {
    step.classList.remove("active", "completed");

    if (index + 1 < stepNumber) {
      step.classList.add("completed");
    } else if (index + 1 === stepNumber) {
      step.classList.add("active");
    }
  });

  // Percentage mapping (UX-based)
  let percent = 33;
  if (stepNumber === 2) percent = 66;
  if (stepNumber === 3) percent = 100;

  // Update visible "% Complete" text (selector-independent)
  document.querySelectorAll("body *").forEach(el => {
    if (
      el.childNodes.length === 1 &&
      typeof el.textContent === "string" &&
      el.textContent.trim().endsWith("% Complete")
    ) {
      el.textContent = `${percent}% Complete`;
    }
  });
}

//Progress Bar
function handleScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  if (height > 0) {
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  }
}

window.addEventListener('scroll', handleScrollProgress);

document.addEventListener('DOMContentLoaded', handleScrollProgress);


// ================= VALIDATION =================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================= BOOKING FORM PHONE VALIDATION =================
document.addEventListener("DOMContentLoaded", function () {
  const bookingPhoneInput = document.getElementById("phone");

  if (bookingPhoneInput) {
    const phoneErrorMsg = document.getElementById("phoneError");
    const validationIcon = bookingPhoneInput.parentElement.querySelector('.validation-icon');

    // Real-time phone validation for booking form
    bookingPhoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Limit to 10 digits
      if (value.length > 10) {
        value = value.substring(0, 10);
      }

      // Format with spaces every 5 digits
      if (value.length > 0) {
        value = value.match(/.{1,5}/g).join(" ");
      }
      e.target.value = value;

      // Validate the phone number
      const validation = validateIndianPhone(e.target.value);

      if (e.target.value.replace(/\D/g, "").length === 0) {
        // Empty input - reset to neutral state
        e.target.classList.remove('error', 'success', 'shake');
        if (phoneErrorMsg) phoneErrorMsg.style.display = 'none';
        if (validationIcon) validationIcon.classList.remove('success', 'error');
      } else if (validation.isValid) {
        // Valid phone number
        e.target.classList.remove('error', 'shake');
        e.target.classList.add('success');
        if (phoneErrorMsg) phoneErrorMsg.style.display = 'none';
        if (validationIcon) {
          validationIcon.classList.remove('error');
          validationIcon.classList.add('success');
        }
      } else {
        // Invalid phone number
        e.target.classList.remove('success');
        e.target.classList.add('error');
        if (phoneErrorMsg) {
          phoneErrorMsg.textContent = validation.message;
          phoneErrorMsg.style.display = 'block';
        }
        if (validationIcon) {
          validationIcon.classList.remove('success');
          validationIcon.classList.add('error');
        }
      }
    });

    // Trigger shake animation on non-numeric input
    bookingPhoneInput.addEventListener("keypress", function (e) {
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
        bookingPhoneInput.classList.add('shake');
        setTimeout(() => bookingPhoneInput.classList.remove('shake'), 500);
      }
    });
  }
});

function validateStep(step) {
  let isValid = true;

  const currentStep = document.querySelector(
    `.form-step[data-step="${step}"]`
  );

  const fields = currentStep.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );

  fields.forEach((field) => {
    const errorMsg = field.parentElement.querySelector(".error-message");

    if (!field.value.trim()) {
      field.classList.add("error");
      if (errorMsg) errorMsg.style.display = "block";
      isValid = false;
    } else {
      field.classList.remove("error");
      if (errorMsg) errorMsg.style.display = "none";
    }

    // Email validation
    if (
      field.type === "email" &&
      field.value &&
      !validateEmail(field.value)
    ) {
      field.classList.add("error");
      if (errorMsg) {
        errorMsg.textContent = "Please enter a valid email address";
        errorMsg.style.display = "block";
      }
      isValid = false;
    }

    // Phone validation
    if (
      field.type === "tel" &&
      field.value
    ) {
      const validation = validateIndianPhone(field.value);
      if (!validation.isValid) {
        field.classList.add("error", "shake");
        if (errorMsg) {
          errorMsg.textContent = validation.message;
          errorMsg.style.display = "block";
        }
        setTimeout(() => field.classList.remove('shake'), 500);
        isValid = false;
      }
    }
  });

  return isValid;
}


// ================= STEP NAVIGATION =================
function nextStep() {
  const currentStep = document.querySelector(".form-step.active");
  if (!currentStep) return;

  const stepNumber = parseInt(currentStep.dataset.step);
  if (!validateStep(stepNumber)) return;

  currentStep.classList.remove("active");

  const nextStepElement = document.querySelector(
    `.form-step[data-step="${stepNumber + 1}"]`
  );

  if (nextStepElement) {
    nextStepElement.classList.add("active");
    localStorage.setItem(STEP_STORAGE_KEY, stepNumber + 1);
    updateStepUI(stepNumber + 1);
  }
}

function prevStep() {
  const currentStep = document.querySelector(".form-step.active");
  if (!currentStep) return;

  const stepNumber = parseInt(currentStep.dataset.step);

  currentStep.classList.remove("active");

  const prevStepElement = document.querySelector(
    `.form-step[data-step="${stepNumber - 1}"]`
  );

  if (prevStepElement) {
    prevStepElement.classList.add("active");
    localStorage.setItem(STEP_STORAGE_KEY, stepNumber - 1);
    updateStepUI(stepNumber - 1);
  }
}


// ================= PAGE LOAD RESTORE =================
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("autoSaveForm");
  if (!bookingForm) return;

  bookingForm.addEventListener("input", saveFormData);
  bookingForm.addEventListener("change", saveFormData);

  restoreFormData();

  let stepToActivate = 1;
  const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
  if (savedStep) stepToActivate = parseInt(savedStep);

  document.querySelectorAll(".form-step").forEach(step =>
    step.classList.remove("active")
  );

  const activeStepEl = document.querySelector(
    `.form-step[data-step="${stepToActivate}"]`
  );

  if (activeStepEl) {
    activeStepEl.classList.add("active");
    updateStepUI(stepToActivate);
    localStorage.setItem(STEP_STORAGE_KEY, stepToActivate);
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(TOTAL_STEPS)) return;

    alert("Booking confirmed successfully!");

    bookingForm.reset();
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);

    document.querySelectorAll(".form-step").forEach(step =>
      step.classList.remove("active")
    );

    document
      .querySelector('.form-step[data-step="1"]')
      .classList.add("active");

    updateStepUI(1);

  });
});


// ================= EASTER EGG =================
document.addEventListener("DOMContentLoaded", () => {
  const car = document.querySelector(".car");
  if (!car) return;

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && (event.key === "?" || event.key === "/")) {
      car.classList.remove("animate");
      void car.offsetWidth;
      car.classList.add("animate");
    }
  });
});

// ================= PRELOADER =================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";

      // Show floating elements after preloader is done
      document.body.classList.add('loaded');

      // Show FAB container
      const fabContainer = document.querySelector('.fab-container');
      if (fabContainer) fabContainer.classList.add('visible');

      // Show scroll button
      const scrollBtn = document.getElementById('smartScrollBtn');
      if (scrollBtn) scrollBtn.classList.add('loaded');

      // Show TOC sidebar
      const tocSidebar = document.querySelector('.sticky-toc');
      if (tocSidebar) tocSidebar.classList.add('loaded');

    }, 800);
  }, 1000);
});

// ============= HERO STATS COUNTER =============
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 3000;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target; // ensure exact final value
    };

    requestAnimationFrame(step);
  };

  // Trigger only when stats are visible
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target); // run once per element
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
});

// ================= PWA SETUP =================
let deferredPrompt;
let pwaHideTimeout;

// Create PWA prompt early so it's ready when user clicks install button
if ('serviceWorker' in navigator) {
  // Create the prompt structure early
  setTimeout(() => {
    if (!document.getElementById('custom-pwa-prompt')) {
      createPWAFloatingBanner();
    }
  }, 2000);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    let swPath = 'service-worker.js';
    if (window.location.pathname.includes('/pages/')) {
      swPath = '../' + swPath;
    }

    // Register the service worker
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });

  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('App is already installed/running in standalone mode');
  }

  // Handle appinstalled event
  window.addEventListener('appinstalled', (evt) => {
    console.log('PWA was installed');
    hidePWAPrompt();
  });
}

function createPWAFloatingBanner() {
  if (document.getElementById('custom-pwa-prompt')) return;

  const style = document.createElement('style');
  style.textContent = `
    .custom-pwa-prompt {
      position: fixed;
      bottom: 110px;
      right: 24px;
      width: 380px;
      max-width: calc(100% - 48px);
      background: #11131c;
      border: 1px solid #2a2d3d;
      border-radius: 16px;
      padding: 20px;
      color: #fff;
      z-index: 999999;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transform: translateY(150%);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
      pointer-events: none;
      overflow: hidden;
    }
    .custom-pwa-prompt.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    .custom-pwa-prompt.minimized {
      width: 60px;
      height: 60px;
      padding: 0;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #7a5af8;
      border: 3px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 25px rgba(122, 90, 248, 0.4);
    }
    .custom-pwa-prompt.minimized:hover {
      transform: scale(1.1);
      background: #6246d8;
    }
    .pwa-mini-icon {
      display: none;
      font-size: 24px;
      color: #fff;
      animation: pwa-bounce 2s infinite;
    }
    .custom-pwa-prompt.minimized .pwa-mini-icon {
      display: block;
    }
    .custom-pwa-prompt.minimized .pwa-content-wrapper {
      display: none;
    }
    @keyframes pwa-bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-6px);}
      60% {transform: translateY(-3px);}
    }
    .pwa-header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .pwa-app-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pwa-app-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
      background: #1e2133;
    }
    .pwa-titles h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }
    .pwa-titles p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #9ba1b0;
    }
    .pwa-close-btn {
      background: transparent;
      border: none;
      color: #6c7185;
      font-size: 24px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      transition: color 0.2s;
    }
    .pwa-close-btn:hover {
      color: #fff;
    }
    .pwa-desc {
      font-size: 14px;
      line-height: 1.5;
      color: #d1d5db;
      margin: 0 0 16px;
    }
    .pwa-badges {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .pwa-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #1e2133;
      border: 1px solid #2a2d3d;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      color: #d1d5db;
      white-space: nowrap;
    }
    .pwa-badge i.fa-bolt { color: #ff8a00; }
    .pwa-badge i.fa-mobile-alt { color: #ff8a00; }
    .pwa-badge i.fa-bell { color: #ecc94b; }
    .pwa-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .pwa-install-action-btn {
      flex: 1;
      background: #7a5af8;
      color: #fff;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .pwa-install-action-btn:hover {
      background: #6246d8;
    }
    .pwa-not-now-action-btn {
      background: transparent;
      color: #9ba1b0;
      border: 1px solid #2a2d3d;
      padding: 11px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .pwa-not-now-action-btn:hover {
      color: #fff;
      background: #2a2d3d;
    }

    /* ========== LIGHT THEME SUPPORT ========== */
    body[data-theme="light"] .custom-pwa-prompt {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: #333;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
    body[data-theme="light"] .custom-pwa-prompt.minimized {
      background: #ff6347;
      border: 3px solid rgba(255, 99, 71, 0.2);
      box-shadow: 0 8px 25px rgba(255, 99, 71, 0.4);
    }
    body[data-theme="light"] .custom-pwa-prompt.minimized:hover {
      background: #ff4500;
    }
    body[data-theme="light"] .pwa-app-icon {
      background: #f5f5f5;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
    body[data-theme="light"] .pwa-titles h3 {
      color: #1a1a1a;
    }
    body[data-theme="light"] .pwa-titles p {
      color: #666;
    }
    body[data-theme="light"] .pwa-close-btn {
      color: #999;
    }
    body[data-theme="light"] .pwa-close-btn:hover {
      color: #333;
    }
    body[data-theme="light"] .pwa-desc {
      color: #555;
    }
    body[data-theme="light"] .pwa-badge {
      background: #f9f9f9;
      border: 1px solid rgba(0, 0, 0, 0.08);
      color: #333;
    }
    body[data-theme="light"] .pwa-install-action-btn {
      background: linear-gradient(135deg, #ff6347 0%, #ff4500 100%);
      color: #fff;
    }
    body[data-theme="light"] .pwa-install-action-btn:hover {
      background: linear-gradient(135deg, #ff4500 0%, #ff2800 100%);
    }
    body[data-theme="light"] .pwa-not-now-action-btn {
      background: transparent;
      color: #666;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
    body[data-theme="light"] .pwa-not-now-action-btn:hover {
      color: #333;
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 480px) {
      .custom-pwa-prompt {
        right: 16px;
        left: 16px;
        width: auto;
        bottom: 100px;
      }
      .custom-pwa-prompt.minimized {
        width: 56px;
        height: 56px;
        left: auto;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  let iconPath = 'assets/icons/favicon.png';
  if (window.location.pathname.includes('/pages/')) {
    iconPath = '../' + iconPath;
  }

  const prompt = document.createElement('div');
  prompt.id = 'custom-pwa-prompt';
  prompt.className = 'custom-pwa-prompt';
  prompt.innerHTML = `
    <div class="pwa-mini-icon">
      <i class="fas fa-download"></i>
    </div>
    <div class="pwa-content-wrapper">
      <div class="pwa-header-top">
        <div class="pwa-app-info">
          <img src="${iconPath}" alt="App Icon" class="pwa-app-icon" onerror="this.src='https://via.placeholder.com/48/1e2133/ffffff?text=HCC'">
          <div class="pwa-titles">
            <h3>Install App</h3>
            <p>Harihar Car Carriers</p>
          </div>
        </div>
        <button class="pwa-close-btn" aria-label="Close" onclick="event.stopPropagation(); dismissPWAPrompt()">&times;</button>
      </div>
      <div class="pwa-desc">
        Get instant access with offline support, push notifications, and a native app experience.
      </div>
      <div class="pwa-badges">
        <span class="pwa-badge"><i class="fas fa-bolt"></i> Instant Load</span>
        <span class="pwa-badge"><i class="fas fa-mobile-alt"></i> Works Offline</span>
        <span class="pwa-badge"><i class="fas fa-bell"></i> Notifications</span>
      </div>
      <div class="pwa-actions">
        <button class="pwa-install-action-btn" onclick="installPWA()">
          <i class="fas fa-download"></i> Install App
        </button>
        <button class="pwa-not-now-action-btn" onclick="event.stopPropagation(); dismissPWAPrompt()">Not now</button>
      </div>
    </div>
  `;

  // Pause auto-hide on hover
  prompt.addEventListener('mouseenter', () => {
    if (pwaHideTimeout) clearTimeout(pwaHideTimeout);
  });
  prompt.addEventListener('mouseleave', () => {
    if (!prompt.classList.contains('minimized')) {
      pwaHideTimeout = setTimeout(minimizePWAPrompt, 5000);
    }
  });

  // Restore on click if minimized
  prompt.addEventListener('click', (e) => {
    // Ignore clicks on buttons to prevent immediate re-opening when clicking 'Not now' or 'X'
    if (e.target.closest('button')) return;

    if (prompt.classList.contains('minimized')) {
      restorePWAPrompt();
    }
  });

  document.body.appendChild(prompt);
}

// Handle the install prompt for PWA
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  // Prevent showing if already installed/standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) return;

  // Create the PWA prompt but don't auto-show it
  // User can trigger it via the FAB Install button
  createPWAFloatingBanner();

  // Auto-show disabled - prompt will be triggered from FAB menu
  /*
  const promptEl = document.getElementById('custom-pwa-prompt');
  if (promptEl) {
    setTimeout(() => {
      promptEl.classList.add('show');

      // Auto disappearing feature after 5 sec
      if (pwaHideTimeout) clearTimeout(pwaHideTimeout);
      pwaHideTimeout = setTimeout(() => {
        minimizePWAPrompt();
      }, 5000);
    }, 500);
  }
  */
});

function installPWA() {
  if (!deferredPrompt) return;

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      hidePWAPrompt();
    } else {
      console.log('User dismissed the install prompt');
    }
    // Clear the deferred prompt variable
    deferredPrompt = null;
  });
}

window.minimizePWAPrompt = function () {
  const promptEl = document.getElementById('custom-pwa-prompt');
  if (promptEl && promptEl.classList.contains('show')) {
    promptEl.classList.add('minimized');
  }
};

window.restorePWAPrompt = function () {
  const promptEl = document.getElementById('custom-pwa-prompt');
  if (promptEl) {
    promptEl.classList.remove('minimized');
    // Set auto-minimize again after 5 seconds as requested
    if (pwaHideTimeout) clearTimeout(pwaHideTimeout);
    pwaHideTimeout = setTimeout(minimizePWAPrompt, 5000);
  }
};

window.dismissPWAPrompt = function () {
  if (pwaHideTimeout) clearTimeout(pwaHideTimeout);
  minimizePWAPrompt();
};

window.hidePWAPrompt = function () {
  // Actually hide it (e.g. after successful installation)
  const promptEl = document.getElementById('custom-pwa-prompt');
  if (promptEl) {
    promptEl.classList.remove('show');
    promptEl.classList.remove('minimized');
  }
};

window.showPWAPrompt = function () {
  // Function to trigger PWA prompt from FAB button
  console.log('showPWAPrompt called');

  // Check if prompt element exists
  let promptEl = document.getElementById('custom-pwa-prompt');

  if (!promptEl) {
    // Create the prompt if it doesn't exist
    console.log('Creating PWA prompt');
    createPWAFloatingBanner();
    promptEl = document.getElementById('custom-pwa-prompt');
  }

  if (promptEl) {
    // Show the prompt
    console.log('Showing PWA prompt');
    promptEl.classList.add('show');
    promptEl.classList.remove('minimized');

    // Set auto-minimize after 8 seconds
    if (pwaHideTimeout) clearTimeout(pwaHideTimeout);
    pwaHideTimeout = setTimeout(minimizePWAPrompt, 8000);
  } else {
    console.log('PWA prompt element not available');
    // Fallback: try direct install if deferredPrompt is available
    if (deferredPrompt) {
      installPWA();
    } else {
      alert('App installation is not available on this device or browser.');
    }
  }
};

window.installPWA = installPWA;
