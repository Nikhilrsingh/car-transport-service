// Enhanced Navigation Functionality
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileCloseBtn = document.getElementById("mobileCloseBtn");
  const mobileNav = document.getElementById("mobileNav");
  const navOverlay = document.getElementById("navOverlay");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  const navbarContainer = document.getElementById("navbar-container");
  
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

  // Real-time clock functionality
  function initializeRealTimeClock() {
    function updateClock() {
      const desktopClock = document.getElementById('realtime-clock-desktop');
      const mobileClock = document.getElementById('realtime-clock-mobile');

      // If we can't find the elements, stop trying.
      if (!desktopClock && !mobileClock) {
        console.warn("Clock elements not found in the loaded navbar.");
        return;
      }

      const now = new Date();
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formattedDateTime = now.toLocaleString('en-US', options);

      if (desktopClock) {
        desktopClock.textContent = formattedDateTime;
      }

      if (mobileClock) {
        mobileClock.innerHTML = `<i class="fas fa-calendar-alt"></i><span>${formattedDateTime}</span>`;
      }
    }

    // Run the clock every second
    setInterval(updateClock, 1000);

    // Run it once immediately to show the time without a 1-second delay
    updateClock();
  }

  // Load navigation component and initialize clock
  if (navbarContainer) {
    fetch('pages/navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
        
        // Initialize clock after navbar is loaded
        setTimeout(initializeRealTimeClock, 100);
      })
      .catch(error => console.error('Error loading navigation:', error));
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