// ------------------------------------
// AUTO-SAVE + AUTO-FILL + VALIDATION
// ------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("autoSaveForm");
  if (!form) return;

  const formKey = form.id;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ===============================
     AUTO-FILL FROM LOCAL STORAGE
     =============================== */
  const savedData = localStorage.getItem(formKey);
  if (savedData) {
    const values = JSON.parse(savedData);
    Object.keys(values).forEach((key) => {
      const field = form.elements[key];
      if (field) field.value = values[key];
    });
  }

  /* ===============================
     AUTO-SAVE ON INPUT
     =============================== */
  form.addEventListener("input", () => {
    const data = {};
    [...form.elements].forEach((el) => {
      if (el.name) data[el.name] = el.value;
    });
    localStorage.setItem(formKey, JSON.stringify(data));
  });

  /* =================================================
     ✅ LIVE PHONE NUMBER VALIDATION (FIXED PROPERLY)
     ================================================= */
  const phoneInput = form.phone;
  const phoneError = document.getElementById("phoneError");
  const phoneIcon = phoneInput
    .closest(".form-group")
    .querySelector(".validation-icon");

  phoneInput.addEventListener("input", () => {
    const digitsOnly = phoneInput.value.replace(/\D/g, "");

    if (digitsOnly.length === 10) {
      phoneError.style.display = "none";
      phoneInput.classList.remove("invalid");
      phoneInput.classList.add("valid");
      if (phoneIcon) phoneIcon.style.opacity = "1";
    } else {
      phoneError.style.display = "block";
      phoneInput.classList.remove("valid");
      phoneInput.classList.add("invalid");
      if (phoneIcon) phoneIcon.style.opacity = "0";
    }
  });

  /* ===============================
     ERROR HANDLERS
     =============================== */
  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = message;
      el.style.display = "block";
    }
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  }

  /* ===============================
     FINAL FORM VALIDATION (SUBMIT)
     =============================== */
  function validateForm() {
    let valid = true;

    const name = form.fullName.value.trim();
    const phoneDigits = form.phone.value.replace(/\D/g, "");
    const email = form.email.value.trim();
    const vehicle = form.vehicleType.value;
    const pickup = form.pickupCity.value.trim();
    const drop = form.dropCity.value.trim();
    const date = form.pickupDate.value;

    if (!name) {
      showError("nameError", "Please enter your full name");
      valid = false;
    } else clearError("nameError");

    if (phoneDigits.length !== 10) {
      showError(
        "phoneError",
        "Please enter a valid 10-digit Indian phone number"
      );
      valid = false;
    } else clearError("phoneError");

    if (!emailRegex.test(email)) {
      showError("emailError", "Please enter a valid email address");
      valid = false;
    } else clearError("emailError");

    if (!vehicle) {
      showError("vehicleError", "Please select vehicle type");
      valid = false;
    } else clearError("vehicleError");

    if (!pickup) {
      showError("pickupError", "Please select pickup city");
      valid = false;
    } else clearError("pickupError");

    if (!drop) {
      showError("dropError", "Please select drop city");
      valid = false;
    } else clearError("dropError");

    if (!date) {
      showError("dateError", "Please select pickup date");
      valid = false;
    } else clearError("dateError");

    return valid;
  }

  /* ===============================
     FINAL SUBMIT HANDLER
     =============================== */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    alert("✅ Booking submitted successfully!");

    localStorage.removeItem(formKey);
    form.reset();
  });
});
