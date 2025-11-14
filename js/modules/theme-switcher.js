console.log("✨ Theme switcher loaded!");

document.addEventListener("DOMContentLoaded", () => {
  const themeLink = document.getElementById("theme-style");
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  if (!themeLink || !toggleBtn) {
    console.warn("⚠️ Theme switcher: Missing required elements.");
    console.warn("themeLink:", themeLink);
    console.warn("toggleBtn:", toggleBtn);
    return;
  }

  console.log("✅ Theme switcher: All elements found!");

  const LIGHT = "./css/light-mode.css";
  const DARK = "./css/dark-mode.css";

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "light";
  console.log("📋 Saved theme from localStorage:", savedTheme);
  applyTheme(savedTheme);

  // Function to apply theme
  function applyTheme(theme) {
    console.log("🎨 Applying theme:", theme);
    
    if (theme === "dark") {
      themeLink.setAttribute("href", DARK);
      document.body.setAttribute("data-theme", "dark");
      if (themeIcon) {
        themeIcon.className = "fas fa-moon";
      }
    } else {
      themeLink.setAttribute("href", LIGHT);
      document.body.setAttribute("data-theme", "light");
      if (themeIcon) {
        themeIcon.className = "fas fa-sun";
      }
    }
    
    localStorage.setItem("theme", theme);
    console.log("💾 Theme saved to localStorage:", theme);
  }

  // On toggle button click
  toggleBtn.addEventListener("click", () => {
    console.log("🖱️ Theme toggle button clicked!");
    const current = localStorage.getItem("theme") || "light";
    const newTheme = current === "dark" ? "light" : "dark";
    console.log("🔄 Switching from", current, "to", newTheme);
    applyTheme(newTheme);
  });

  console.log("✅ Theme switcher: Event listener attached!");
});