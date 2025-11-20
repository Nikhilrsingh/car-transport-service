console.log("✨ Global themes.js loaded!");

document.addEventListener("DOMContentLoaded", () => {
  const head = document.head || document.getElementsByTagName("head")[0];

  // Detect if we are inside /pages/ (e.g. /pages/pricing.html) or at root
  const isSubPage = window.location.pathname.includes("/pages/");

  // Resolve correct CSS paths based on current location
  const LIGHT = isSubPage ? "../css/light-mode.css" : "./css/light-mode.css";
  const DARK = isSubPage ? "../css/dark-mode.css" : "./css/dark-mode.css";

  // Ensure there is a <link id="theme-style"> tag
  let themeLink = document.getElementById("theme-style");
  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.id = "theme-style";
    themeLink.rel = "stylesheet";
    themeLink.href = LIGHT;
    head.appendChild(themeLink);
    console.log("🧩 themes.js: Injected missing <link id=\"theme-style\">");
  }

  // Ensure there is a theme toggle button
  let toggleBtn = document.getElementById("theme-toggle");
  let themeIcon = document.getElementById("theme-icon");

  if (!toggleBtn) {
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "theme-toggle";

    toggleBtn = document.createElement("button");
    toggleBtn.id = "theme-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle theme");

    themeIcon = document.createElement("i");
    themeIcon.id = "theme-icon";
    themeIcon.className = "fas fa-sun";

    toggleBtn.appendChild(themeIcon);
    toggleWrapper.appendChild(toggleBtn);
    document.body.appendChild(toggleWrapper);

    console.log("🧩 themes.js: Injected missing theme toggle button");
  }

  if (!themeLink || !toggleBtn) {
    console.warn("⚠️ themes.js: Missing required elements.");
    console.warn("themeLink:", themeLink);
    console.warn("toggleBtn:", toggleBtn);
    return;
  }

  console.log("✅ themes.js: All elements ready");

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "light";
  console.log("📋 themes.js: Saved theme from localStorage:", savedTheme);
  applyTheme(savedTheme);

  function applyTheme(theme) {
    console.log("🎨 themes.js: Applying theme:", theme);

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
    console.log("💾 themes.js: Theme saved to localStorage:", theme);
  }

  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    console.log("🖱️ themes.js: Theme toggle clicked");
    const current = localStorage.getItem("theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
});


