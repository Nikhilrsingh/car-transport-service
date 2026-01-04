// ================= LOCAL STORAGE KEYS =================
const FORM_STORAGE_KEY = "bookingFormData";
const STEP_STORAGE_KEY = "bookingFormStep";
const TOTAL_STEPS = 3;
// ================= LOCAL STORAGE KEYS =================
const FORM_STORAGE_KEY = "bookingFormData";
const STEP_STORAGE_KEY = "bookingFormStep";
const TOTAL_STEPS = 3;


// ================= CONTACT FORM =================
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('input[type="text"]').value;
      const phone = contactForm.querySelector('input[type="tel"]').value;

      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert(
          `Thank you ${name}! Your request has been received. We’ll contact you at ${phone}.`
        );

        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });

    const phoneInput = contactForm.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 0) {
          value = value.match(/.{1,5}/g).join(" ");
        }
        e.target.value = value;
      });
    }
  }
});


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


// ================= VALIDATION =================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
