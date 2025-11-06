// Back to Top Functionality - Moved to js/modules/back-to-top-button.js
// This module previously handled back-to-top button logic but is now centralized
// in the dedicated back-to-top-button.js module to avoid duplication
// js/modules/footer.js

document.addEventListener("DOMContentLoaded", () => {
  fetch('./pages/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
      const yearSpan = document.getElementById('current-year');
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    })
    .catch(err => console.error(err));
});
