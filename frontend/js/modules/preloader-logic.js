/**
 * Preloader Logic Module
 */

export function initPreloader() {
    const preloader = document.getElementById("preloader");
    let preloaderHidden = false;
    let hideTimeout = null;

    function hidePreloader() {
        if (preloaderHidden || !preloader) return;
        preloaderHidden = true;
        if (hideTimeout) clearTimeout(hideTimeout);
        preloader.classList.add("fade-out");
        setTimeout(() => {
            if (preloader) preloader.style.display = "none";
        }, 800);
    }

    function shouldShowPreloader() {
        if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) return false;
        if (document.readyState === 'complete') return false;
        if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
            if (new URL(document.referrer).pathname.includes('login.html')) return false;
        }
        return true;
    }

    if (!shouldShowPreloader()) {
        hidePreloader();
        return;
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && document.readyState === 'complete') hidePreloader();
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted || document.readyState === 'complete') hidePreloader();
    });

    window.addEventListener("load", () => {
        hideTimeout = setTimeout(hidePreloader, 300);
    });

    document.addEventListener("DOMContentLoaded", () => {
        if (document.readyState === 'complete') {
            hideTimeout = setTimeout(hidePreloader, 100);
        } else {
            hideTimeout = setTimeout(hidePreloader, 2000);
        }
    });

    setTimeout(hidePreloader, 4000);

    window.addEventListener('beforeunload', () => {
        if (hideTimeout) clearTimeout(hideTimeout);
    });
}

initPreloader();
