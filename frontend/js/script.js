// Testimonial Slider Functionality now created seperately in js/modules/testimonial.js


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
const inputs = document.querySelectorAll(
  ".input-group input, .input-group select"
);

inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1.02)";
  });

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)";
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
    }, 800);
  }, 1000);
});


// ================= MULTI-STEP FORM VALIDATION =================

// Email validation helper (REQUIRED)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Step validation (already correct – kept unchanged)
function validateStep(step) {
  let isValid = true;

  const currentStep = document.querySelector(
    `.form-step[data-step="${step}"]`
  );

  const fields = currentStep.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );

  fields.forEach((field) => {
    const errorMsg =
      field.parentElement.querySelector(".error-message");

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

// Next step navigation (MISSING – FIXED)
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
  }
}

// Previous step navigation (MISSING – FIXED)
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
  }
}

// Final submit validation (MISSING – FIXED)
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("autoSaveForm");
  if (!bookingForm) return;

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateStep(3)) return;

    alert("Booking confirmed successfully!");

    bookingForm.reset();

    document.querySelectorAll(".form-step").forEach(step =>
      step.classList.remove("active")
    );

    document
      .querySelector('.form-step[data-step="1"]')
      .classList.add("active");
  });
});
