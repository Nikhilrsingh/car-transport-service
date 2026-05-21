/* 🌟 Preloader & Theme Meta-Component 
   Included in <head> to prevent FOUC and ensure consistent loading experience.
*/
(function () {
  const CSS_VERSION = "25"; // Increment this to force global stylesheet reload and purge active caches/service worker

  // Automatic Aggressive Cache Purging & Service Worker Unregistration on Version Change
  try {
    const lastVersion = localStorage.getItem('site_version');
    if (lastVersion !== CSS_VERSION) {
      console.log(`🚨 Site version mismatch (local: ${lastVersion}, current: ${CSS_VERSION}). Initiating aggressive cache purge...`);
      
      // 1. Clear all Cache Storage caches (Service Worker cache)
      if ('caches' in window) {
        caches.keys().then((keys) => {
          Promise.all(keys.map(key => caches.delete(key))).then(() => {
            console.log("🧹 Cache Storage successfully cleared!");
          });
        });
      }
      
      // 2. Unregister all Service Workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          Promise.all(registrations.map(reg => reg.unregister())).then(() => {
            console.log("🔓 Service Workers successfully unregistered!");
          });
        });
      }
      
      // Save the new version key to prevent infinite loops
      localStorage.setItem('site_version', CSS_VERSION);
      
      // 3. HARD reload using URL timestamp — bypasses HTTP disk cache completely
      setTimeout(() => {
        console.log("🔄 Hard reloading page to fetch pristine network assets...");
        const url = window.location.href.split('?')[0].split('#')[0];
        window.location.replace(url + '?_cache=' + CSS_VERSION);
      }, 300);
      
      return; // Stop execution until reloaded
    }
  } catch (e) {
    console.error("Cache purge failed:", e);
  }


  // 1. Instant Theme Application (Prevents FOUC)
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // 1b. Global Stylesheet Cache Buster (Bypasses aggressive browser caching)
  const bustStylesheetCaches = () => {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external CDN stylesheets
      if (href.indexOf('http') === 0 || href.indexOf('//') === 0 || href.includes('cdnjs.cloudflare.com') || href.includes('unpkg.com') || href.includes('fonts.googleapis.com')) {
        return;
      }
      
      // Check if version is already matching
      if (href.includes(`v=${CSS_VERSION}`)) {
        return;
      }
      
      const cleanHref = href.split('?')[0];
      const finalHref = cleanHref + `?v=${CSS_VERSION}`;
      
      link.setAttribute('href', finalHref);
      console.log(`♻️ Cache-Busted stylesheet: ${href} -> ${finalHref}`);
    });
  };

  // Run immediately for stylesheets already in DOM
  bustStylesheetCaches();

  // Run on DOMContentLoaded to catch any stylesheet links parsed after this script
  document.addEventListener('DOMContentLoaded', bustStylesheetCaches);

  // Set up MutationObserver to instantly intercept any dynamically added stylesheets (e.g. from navbar-loader.js)
  const observeHeadStylesheets = () => {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
            const href = node.getAttribute('href');
            if (href) {
              // Skip external CDNs
              if (href.indexOf('http') === 0 || href.indexOf('//') === 0 || href.includes('cdnjs.cloudflare.com') || href.includes('unpkg.com') || href.includes('fonts.googleapis.com')) {
                return;
              }
              if (!href.includes(`v=${CSS_VERSION}`)) {
                const cleanHref = href.split('?')[0];
                node.setAttribute('href', cleanHref + `?v=${CSS_VERSION}`);
                console.log(`♻️ Dynamic Cache-Busted stylesheet: ${href} -> ${cleanHref}?v=${CSS_VERSION}`);
              }
            }
          }
        });
      });
    });
    
    observer.observe(head, { childList: true });
  };
  
  if (document.head) {
    observeHeadStylesheets();
  } else {
    document.addEventListener('DOMContentLoaded', observeHeadStylesheets);
  }

  // 2. Preloader Injection Helper
  const injectPreloader = () => {
    if (document.getElementById('preloader')) return;

    const isSubPage = window.location.pathname.includes("/pages/");
    const logoPath = isSubPage ? "../assets/images/left-logo-w-bt.png" : "assets/images/left-logo-w-bt.png";

    const preloaderHTML = `
            <div id="preloader">
                <div class="preloader-content">
                    <div class="logo-container">
                        <img src="${logoPath}" alt="Harihar Car Carriers" />
                    </div>
                    <div class="loading-text">Loading</div>
                    <div class="dots"><span></span><span></span><span></span></div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>`;

    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

    // 3. Fallback Hiding Logic (Backup for script.js)
    window.addEventListener('load', () => {
      const pre = document.getElementById('preloader');
      if (pre) {
        pre.classList.add('fade-out');
        setTimeout(() => { pre.style.display = 'none'; }, 800);
      }
    });
  };

  // Attempt injection and instant body theme application as soon as body is available
  if (document.body) {
    document.body.setAttribute('data-theme', savedTheme);
    injectPreloader();
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      if (document.body) {
        document.body.setAttribute('data-theme', savedTheme);
        injectPreloader();
        obs.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }
})();
