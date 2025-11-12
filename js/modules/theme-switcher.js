console.log(" Theme switcher loaded!");

document.addEventListener("DOMContentLoaded", () => {
  const themeLink = document.getElementById("theme-style");
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  if (!themeLink || !toggleBtn) {
    console.warn("Theme switcher: Missing required elements.");
    return;
  }

  const LIGHT = "./css/light-mode.css";
  const DARK = "./css/dark-mode.css";

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  // Function to apply theme
  function applyTheme(theme) {
    if (theme === "dark") {
      themeLink.setAttribute("href", DARK);
      themeIcon.className = "fas fa-moon";
    } else {
      themeLink.setAttribute("href", LIGHT);
      themeIcon.className = "fas fa-sun";
    }
    localStorage.setItem("theme", theme);
  }

  // On toggle click
  toggleBtn.addEventListener("click", () => {
    const current = localStorage.getItem("theme") || "light";
    const newTheme = current === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
});