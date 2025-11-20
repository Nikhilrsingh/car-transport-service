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

  // Safe localStorage helpers
  const safeGet = (k) => {
    try { return window.localStorage.getItem(k); } catch (_) { return null; }
  };
  const safeSet = (k, v) => {
    try { window.localStorage.setItem(k, v); } catch (_) {}
  };

  // Load saved theme
  const savedTheme = safeGet("theme") || "light";
  console.log("📋 themes.js: Saved theme from localStorage:", savedTheme);
  applyTheme(savedTheme);

  function applyTheme(theme) {
    console.log("🎨 themes.js: Applying theme:", theme);

    if (theme === "dark") {
      themeLink.setAttribute("href", DARK);
      document.body.setAttribute("data-theme", "dark");
      const iconEl = document.getElementById("theme-icon");
      if (iconEl) iconEl.className = "fas fa-moon";
    } else {
      themeLink.setAttribute("href", LIGHT);
      document.body.setAttribute("data-theme", "light");
      const iconEl = document.getElementById("theme-icon");
      if (iconEl) iconEl.className = "fas fa-sun";
    }

    safeSet("theme", theme);
    console.log("💾 themes.js: Theme saved to localStorage:", theme);
  }

  // Delegate click to handle dynamically loaded navbar button
  // Capture phase to avoid other listeners stopping propagation
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#theme-toggle");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    console.log("🖱️ themes.js: Theme toggle clicked (delegated)");
    const current = safeGet("theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }, true);

  // Extra safety: bind directly when the button becomes available
  const directBind = () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn || btn.dataset.themeBound === "1") return false;
    console.log("🔗 themes.js: Binding directly to theme-toggle button");
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      console.log("🖱️ themes.js: Theme toggle clicked (direct)");
      const current = safeGet("theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    }, true);
    btn.dataset.themeBound = "1";
    return true;
  };
  if (!directBind()) {
    console.log("⏳ themes.js: Waiting for theme-toggle button via MutationObserver...");
    const obs = new MutationObserver(() => {
      if (directBind()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
});


