// Accent color settings module
(function () {
  const STORAGE_KEY = 'siteAccentColor';
  const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff6347';

  function applyColor(color) {
    if (!color) return;
    document.documentElement.style.setProperty('--accent', color);
    // derive a darker secondary for gradients (simple approach)
    try {
      const c = color.replace('#','');
      const r = parseInt(c.substring(0,2),16);
      const g = parseInt(c.substring(2,4),16);
      const b = parseInt(c.substring(4,6),16);
      const darker = '#'+[r,g,b].map(v=>Math.max(0,Math.floor(v*0.78)).toString(16).padStart(2,'0')).join('');
      document.documentElement.style.setProperty('--accent-600', darker);
      // expose RGB for rgba(...) usages in CSS
      document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    } catch(e) {
      document.documentElement.style.setProperty('--accent-600', color);
    }
  }

  function saveColor(color) {
    try { localStorage.setItem(STORAGE_KEY, color); } catch(e) {}
  }

  function loadSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }

  // UI wiring
  function init() {
    console.log('[settings] init');
    const toggle = document.getElementById('settingsToggle');
    const panel = document.getElementById('settingsPanel');
    const swatches = document.getElementById('settingsSwatches');

    if (!toggle || !panel || !swatches) return;

    // Apply saved color on load
    const saved = loadSaved();
    if (saved) applyColor(saved);

    // Mark active swatch if present
    function markActive(color) {
      Array.from(swatches.querySelectorAll('.swatch')).forEach(s => {
        s.classList.toggle('active', s.dataset.color.toLowerCase() === color.toLowerCase());
      });
    }
    markActive(saved || defaultColor);

    function openPanel() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      // focus first swatch for keyboard users
      const first = panel.querySelector('.swatch');
      if (first) first.focus();
      document.addEventListener('click', outsideClick);
      document.addEventListener('keydown', onKeyDown);
    }

    function closePanel() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      document.removeEventListener('click', outsideClick);
      document.removeEventListener('keydown', onKeyDown);
    }

    function outsideClick(e) {
      if (!panel.contains(e.target) && !toggle.contains(e.target)) closePanel();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') closePanel();
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });

    swatches.addEventListener('click', (e) => {
      const target = e.target.closest('.swatch');
      if (!target) return;
      const color = target.dataset.color;
      applyColor(color);
      saveColor(color);
      markActive(color);
    });

    // keyboard support for swatches
    swatches.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('swatch') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  // Run init immediately if DOM already loaded, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
