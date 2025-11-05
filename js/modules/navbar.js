// Enhanced Navbar Module with Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
  if (window.__navbarInitialized) {
    return;
  }
  window.__navbarInitialized = true;

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const navOverlay = document.getElementById('navOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenuBtn || !mobileNav || !navOverlay) {
    console.warn('Navbar: required elements missing, skipping initialisation.');
    return;
  }

  const setMenuState = (shouldOpen) => {
    mobileMenuBtn.classList.toggle('active', shouldOpen);
    mobileNav.classList.toggle('active', shouldOpen);
    navOverlay.classList.toggle('active', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
    document.body.classList.toggle('mobile-nav-open', shouldOpen);
  };

  const closeMobileMenu = () => setMenuState(false);

  const toggleMobileMenu = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const shouldOpen = !mobileNav.classList.contains('active');
    setMenuState(shouldOpen);
  };

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  navOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  const currentPath = window.location.pathname.replace(/index\.html$/, '/');
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
    try {
      const linkPath = new URL(
        link.href,
        window.location.origin
      ).pathname.replace(/index\.html$/, '/');
      link.classList.toggle('active', linkPath === currentPath);
    } catch {
      // Ignore non-http(s) links
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') {
        return;
      }

      const target = document.querySelector(hash);
      if (target) {
        event.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const header = document.querySelector('.header');
  let lastScroll = 0;

  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
          header.classList.remove('scroll-up');
          return;
        }

        if (
          currentScroll > lastScroll &&
          !header.classList.contains('scroll-down')
        ) {
          header.classList.remove('scroll-up');
          header.classList.add('scroll-down');
        } else if (
          currentScroll < lastScroll &&
          header.classList.contains('scroll-down')
        ) {
          header.classList.remove('scroll-down');
          header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
      },
      { passive: true }
    );
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    }, 250);
  });

  let touchStartX = 0;
  let touchEndX = 0;

  mobileNav.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  mobileNav.addEventListener(
    'touchend',
    (event) => {
      touchEndX = event.changedTouches[0].screenX;
      if (touchEndX > touchStartX + 50) {
        closeMobileMenu();
      }
    },
    { passive: true }
  );
});
