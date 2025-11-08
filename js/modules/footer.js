// Back to Top Functionality - Moved to js/modules/back-to-top-button.js
// This module previously handled back-to-top button logic but is now centralized
// in the dedicated back-to-top-button.js module to avoid duplication
// js/modules/footer.js

document.addEventListener("DOMContentLoaded", async () => {
  const footerContainer = document.getElementById("footer-container");

  try {
    const response = await fetch("./pages/footer.html");
    if (!response.ok) throw new Error("Footer file not found");

    const footerHTML = await response.text();
    footerContainer.innerHTML = footerHTML;

    // ✅ Manually set the year since inline script won't run
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  } catch (error) {
    console.error("Error loading footer:", error);
    footerContainer.innerHTML = "<p>⚠️ Unable to load footer</p>";
  }
});
