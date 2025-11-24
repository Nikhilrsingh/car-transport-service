// Enhanced Navbar functionality
(function () {
  "use strict";

  function initNavbar() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNav = document.getElementById("mobileNav");
    const mobileCloseBtn = document.getElementById("mobileCloseBtn");
    const navOverlay = document.getElementById("navOverlay");

    // Toggle mobile menu
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", function () {
        this.classList.toggle("active");
        if (mobileNav) mobileNav.classList.toggle("active");
        if (navOverlay) navOverlay.classList.toggle("active");
        document.body.style.overflow =
          mobileNav && mobileNav.classList.contains("active") ? "hidden" : "";
      });
    }

    // Close mobile menu
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", closeMobileMenu);
    }

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener("click", closeMobileMenu);
    }

    function closeMobileMenu() {
      if (mobileMenuBtn) mobileMenuBtn.classList.remove("active");
      if (mobileNav) mobileNav.classList.remove("active");
      if (navOverlay) navOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Active link highlighting based on current page
    function setActiveLink() {
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

      navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (
          linkPage === currentPage ||
          (currentPage === "" && linkPage === "index.html") ||
          (currentPage === "/" && linkPage === "index.html")
        ) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    // Set active link on page load
    setActiveLink();

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector(".header");

    if (header) {
      window.addEventListener("scroll", function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
          header.classList.remove("scroll-up");
          return;
        }

        if (
          currentScroll > lastScroll &&
          !header.classList.contains("scroll-down")
        ) {
          // Scrolling down
          header.classList.remove("scroll-up");
          header.classList.add("scroll-down");
        } else if (
          currentScroll < lastScroll &&
          header.classList.contains("scroll-down")
        ) {
          // Scrolling up
          header.classList.remove("scroll-down");
          header.classList.add("scroll-up");
        }

        lastScroll = currentScroll;
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavbar);
  } else {
    initNavbar();
  }
})();
