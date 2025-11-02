// Enhanced Navigation Functionality
  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileCloseBtn = document.getElementById("mobileCloseBtn");
    const mobileNav = document.getElementById("mobileNav");
    const navOverlay = document.getElementById("navOverlay");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    // Add main content spacing
    function addContentSpacing() {
      const navbarHeight = header.offsetHeight;
      document.body.style.paddingTop = navbarHeight + "px";
    }

    // Mobile menu functionality
    function openMobileMenu() {
      mobileNav.classList.add("active");
      navOverlay.classList.add("active");
      mobileMenuBtn.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
      mobileNav.classList.remove("active");
      navOverlay.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Set active page based on current URL
    function setActivePage() {
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");
        if (
          linkPage === currentPage ||
          (currentPage === "index.html" && linkPage === "/") ||
          (linkPage.includes(currentPage.replace(".html", "")) &&
            currentPage !== "index.html")
        ) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    // Event listeners
    mobileMenuBtn.addEventListener("click", openMobileMenu);
    mobileCloseBtn.addEventListener("click", closeMobileMenu);
    navOverlay.addEventListener("click", closeMobileMenu);

    // Close mobile menu when clicking on links
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Initialize
    addContentSpacing();
    setActivePage();

    // Recalculate on resize
    window.addEventListener("resize", addContentSpacing);

    // Keyboard navigation
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    });
  });

    // Load navigation component
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
      })
      .catch(error => console.error('Error loading navigation:', error));