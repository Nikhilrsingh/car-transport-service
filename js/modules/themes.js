// Theme switcher module
// - Applies theme by setting `data-theme` on <html>
// - Persists selection to localStorage ('site-theme')
// - Supports 'auto' which follows prefers-color-scheme and responds to changes
// - Injects the widget into the page if it's not already present

(function () {
  const STORAGE_KEY = 'site-theme';
  const SELECT_ID = 'themeWidgetSelect';
  const WIDGET_ID = 'themeWidget';

  // Options available in the select (must match index.html options)
  const OPTIONS = [
    { value: 'auto', label: 'Theme' },
    { value: 'default', label: 'Default' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'glass', label: 'Glass' }
  ];

  function createWidget() {
    // If widget already exists, just return its select element
    let widget = document.getElementById(WIDGET_ID);
    if (widget) {
      // ensure widget is attached to <body> so fixed positioning is reliable
      try { document.body.appendChild(widget); } catch (e) { /* ignore */ }
      return widget.querySelector('#' + SELECT_ID);
    }

    widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.className = 'theme-widget';
    widget.setAttribute('aria-hidden', 'false');

    const label = document.createElement('label');
    label.className = 'sr-only';
    label.htmlFor = SELECT_ID;
    label.textContent = 'Choose theme';

    const select = document.createElement('select');
    select.id = SELECT_ID;
    select.setAttribute('aria-label', 'Choose theme');

    OPTIONS.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    });

    widget.appendChild(label);
    widget.appendChild(select);

    // append to body to avoid being inside transformed containers
    document.body.appendChild(widget);

    // also apply inline positioning to be resilient against CSS containing blocks
    // widget.style.position = 'fixed';
    // widget.style.top = '14px';
    // widget.style.left = '14px';
    // widget.style.zIndex = '2147483647';

    return select;
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', theme);
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 350);
  }

  function loadStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* noop */ }
  }

  function init() {
    const select = document.getElementById(SELECT_ID) || createWidget();

    if (!select) {
      console.error('Theme select element not found!');
      return;
    }

    const stored = loadStoredTheme();
    select.value = stored;
    applyTheme(stored);

    select.addEventListener('change', (e) => {
      const val = e.target.value;
      saveTheme(val);
      applyTheme(val);
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', () => {
        const current = loadStoredTheme();
        if (current === 'auto') applyTheme('auto');
      });
    }
  }

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
