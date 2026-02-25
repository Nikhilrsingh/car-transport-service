/**
 * Theme Switcher Module
 * Handles light/dark mode toggling with persistence and dynamic pathing
 */
(function() {
  'use strict';

  console.log("✨ Theme switcher loaded!");

  // Define paths dynamically based on current folder depth
  const path = window.location.pathname;
  const isInPagesFolder = path.toLowerCase().includes('/pages/');
  const base = isInPagesFolder ? '..' : '.';

  const LIGHT_PATH = `${base}/css/light-mode.css`;
  const DARK_PATH = `${base}/css/dark-mode.css`;

  /**
   * Applies the selected theme to the DOM
   */
  function applyTheme(theme) {
    const themeLink = document.getElementById("theme-style");
    const themeIcon = document.getElementById("theme-icon");

    if (!themeLink) {
      console.warn("⚠️ Theme switcher: Hook #theme-style not found.");
      return;
    }

    if (theme === "dark") {
      themeLink.setAttribute("href", DARK_PATH);
      document.body.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.className = "fas fa-moon";
    } else {
      themeLink.setAttribute("href", LIGHT_PATH);
      document.body.setAttribute("data-theme", "light");
      if (themeIcon) themeIcon.className = "fas fa-sun";
    }
    
    localStorage.setItem("theme", theme);
  }

  // 1. Initialize theme immediately
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  // 2. Handle the toggle button using Event Delegation
  // This handles the button even if navbar-loader.js adds it later
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("#theme-toggle");
    
    if (toggleBtn) {
      e.preventDefault();
      const current = localStorage.getItem("theme") || "light";
      const newTheme = current === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    }
  });

  // 3. Ensure icons are correct once the navbar is injected
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(localStorage.getItem("theme") || "light");
  });

})();