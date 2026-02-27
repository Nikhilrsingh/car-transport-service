// ================= LOCAL STORAGE KEYS =================
const FORM_STORAGE_KEY = "bookingFormData";
const STEP_STORAGE_KEY = "bookingFormStep";
const TOTAL_STEPS = 3;
import { initCustomCursor } from './modules/custom-cursor.js';
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
    message: "Valid phone number"
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

// ================= CONTACT FORM =================
document.addEventListener("DOMContentLoaded", function () {
  
  initCustomCursor();
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    let phoneErrorMsg = null;
    let phoneSuccessIcon = null;

    // Create error message and success icon elements if they don't exist
    if (phoneInput) {
      const inputGroup = phoneInput.closest('.input-group');
      if (inputGroup) {
        // Create error message
        phoneErrorMsg = document.createElement('div');
        phoneErrorMsg.className = 'phone-error-message';
        inputGroup.appendChild(phoneErrorMsg);

        // Create success icon
        phoneSuccessIcon = document.createElement('i');
        phoneSuccessIcon.className = 'fas fa-check-circle phone-success-icon';
        inputGroup.style.position = 'relative';
        inputGroup.appendChild(phoneSuccessIcon);
      }

      // Real-time phone validation
      phoneInput.addEventListener("input", function (e) {
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
          if (phoneErrorMsg) phoneErrorMsg.classList.remove('show');
          if (phoneSuccessIcon) phoneSuccessIcon.classList.remove('show');
        } else if (validation.isValid) {
          // Valid phone number
          e.target.classList.remove('error', 'shake');
          e.target.classList.add('success');
          if (phoneErrorMsg) phoneErrorMsg.classList.remove('show');
          if (phoneSuccessIcon) phoneSuccessIcon.classList.add('show');
        } else {
          // Invalid phone number
          e.target.classList.remove('success');
          e.target.classList.add('error');
          if (phoneErrorMsg) {
            phoneErrorMsg.textContent = validation.message;
            phoneErrorMsg.classList.add('show');
          }
          if (phoneSuccessIcon) phoneSuccessIcon.classList.remove('show');
        }
      });

      // Trigger shake animation on non-numeric input
      phoneInput.addEventListener("keypress", function (e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9]/.test(char)) {
          e.preventDefault();
          phoneInput.classList.add('shake');
          setTimeout(() => phoneInput.classList.remove('shake'), 500);
        }
      });
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('input[type="text"]').value;
      const phone = phoneInput.value;

      // Validate phone before submission
      const validation = validateIndianPhone(phone);
      if (!validation.isValid) {
        phoneInput.classList.add('error', 'shake');
        if (phoneErrorMsg) {
          phoneErrorMsg.textContent = validation.message;
          phoneErrorMsg.classList.add('show');
        }
        setTimeout(() => phoneInput.classList.remove('shake'), 500);
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
          `Thank you ${name}! Your request has been received. We'll contact you at ${phone}.`
        );

        contactForm.reset();
        phoneInput.classList.remove('error', 'success');
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

