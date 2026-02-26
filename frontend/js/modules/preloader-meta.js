/* 🌟 Preloader & Theme Meta-Component 
   Included in <head> to prevent FOUC and ensure consistent loading experience.
*/
(function () {
  // 1. Instant Theme Application (Prevents FOUC)
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

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

  // Attempt injection as soon as body is available
  if (document.body) {
    injectPreloader();
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      if (document.body) {
        injectPreloader();
        obs.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }
})();
