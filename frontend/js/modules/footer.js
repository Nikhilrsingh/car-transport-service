// Enhanced Footer Interactions: accordion, collapse toggle, micro-toast, in-view animations, cities search, and mobile FAB
(function () {
  "use strict";

  let allCities = [];

  function ready(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function loadCitiesData() {
    // Try to load from cities.json
    fetch("../assets/data/cities.json")
      .then((response) => {
        if (!response.ok) throw new Error("Cities data not found");
        return response.json();
      })
      .then((cities) => {
        allCities = cities;
      })
      .catch(() => {
        console.log("Using fallback cities data");
        // Fallback cities data
        allCities = [
          { slug: "agra", name: "Agra" },
          { slug: "ahmedabad", name: "Ahmedabad" },
          { slug: "bangalore", name: "Bangalore" },
          { slug: "chennai", name: "Chennai" },
          { slug: "delhi", name: "Delhi" },
          { slug: "hyderabad", name: "Hyderabad" },
          { slug: "kolkata", name: "Kolkata" },
          { slug: "mumbai", name: "Mumbai" },
          { slug: "nagpur", name: "Nagpur" },
          { slug: "pune", name: "Pune" },
        ];
      });
  }

  function performSearch(query) {
    const searchResults = document.getElementById("footerSearchResults");
    const popularCities = document.getElementById("popularCities");

    if (!searchResults) return;

    if (query.length < 2) {
      hideSearchResults();
      return;
    }

    const filteredCities = allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.slug.toLowerCase().includes(query)
    );

    displaySearchResults(filteredCities, searchResults, popularCities);
  }

  function displaySearchResults(cities, searchResults, popularCities) {
    if (cities.length === 0) {
      searchResults.innerHTML =
        '<div class="city-search-item">No cities found</div>';
    } else {
      searchResults.innerHTML = cities
        .slice(0, 8)
        .map(
          (city) => `
        <a href="./pages/city.html?city=${city.slug}" class="city-search-item">
          <i class="fas fa-map-marker-alt" style="margin-right: 8px;"></i>
          ${city.name}
        </a>
      `
        )
        .join("");
    }

    searchResults.classList.add("active");
    if (popularCities) {
      popularCities.style.display = "none";
    }
  }

  function hideSearchResults() {
    const searchResults = document.getElementById("footerSearchResults");
    const popularCities = document.getElementById("popularCities");

    if (searchResults) {
      searchResults.classList.remove("active");
    }
    if (popularCities) {
      popularCities.style.display = "block";
    }
  }

  function initFooterSearch(footer) {
    const searchInput = footer.querySelector("#footerCitySearch");
    const searchClear = footer.querySelector("#footerSearchClear");

    if (!searchInput) return;

    // Load cities data
    loadCitiesData();

    // Search input event
    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 0) {
        searchClear.style.display = "flex";
        performSearch(query);
      } else {
        searchClear.style.display = "none";
        hideSearchResults();
      }
    });

    // Clear search
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      searchClear.style.display = "none";
      hideSearchResults();
      searchInput.focus();
    });

    // Click outside to close results
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".cities-search-container")) {
        hideSearchResults();
      }
    });
  }

  // Mobile FAB functionality
  function initMobileFAB() {
    const miniFabTrigger = document.getElementById("miniFabTrigger");
    const mobileFabActions = document.getElementById("mobileFabActions");
    
    if (!miniFabTrigger || !mobileFabActions) return;
    
    let isOpen = false;
    
    // Toggle mobile FAB
    miniFabTrigger.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (isOpen) {
        closeMobileFAB();
      } else {
        openMobileFAB();
      }
    });
    
    // Close when clicking outside
    document.addEventListener("click", function(e) {
      if (isOpen && !e.target.closest(".mobile-fab-actions") && !e.target.closest(".mini-fab-trigger")) {
        closeMobileFAB();
      }
    });
    
    // Close on ESC
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && isOpen) {
        closeMobileFAB();
      }
    });
    
    function openMobileFAB() {
      isOpen = true;
      miniFabTrigger.classList.add("active");
      miniFabTrigger.setAttribute("aria-expanded", "true");
      mobileFabActions.classList.add("active");
      
      // Update button text
      const span = miniFabTrigger.querySelector("span");
      if (span) span.textContent = "Close";
    }
    
    function closeMobileFAB() {
      isOpen = false;
      miniFabTrigger.classList.remove("active");
      miniFabTrigger.setAttribute("aria-expanded", "false");
      mobileFabActions.classList.remove("active");
      
      // Update button text
      const span = miniFabTrigger.querySelector("span");
      if (span) span.textContent = "More";
    }
    
    // Mobile FAB action handlers
    const mobileFabQuote = document.getElementById("mobileFabQuote");
    const mobileFabBook = document.getElementById("mobileFabBook");
    const mobileFabFeedback = document.getElementById("mobileFabFeedback");
    const mobileFabChat = document.getElementById("mobileFabChat");
    
    if (mobileFabQuote) {
      mobileFabQuote.addEventListener("click", function() {
        closeMobileFAB();
        setTimeout(() => {
          const currentPath = window.location.pathname;
          const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('.html');
          
          if (isIndexPage) {
            const quoteSection = document.querySelector('.hero-quote');
            if (quoteSection) {
              quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setTimeout(() => {
                const firstInput = document.getElementById('fromCity');
                if (firstInput) firstInput.focus();
              }, 500);
            }
          } else {
            window.location.href = '../index.html#quote';
          }
        }, 100);
      });
    }
    
    if (mobileFabBook) {
      mobileFabBook.addEventListener("click", function() {
        closeMobileFAB();
        setTimeout(() => {
          window.location.href = '../pages/booking.html';
        }, 100);
      });
    }
    
    if (mobileFabFeedback) {
      mobileFabFeedback.addEventListener("click", function() {
        closeMobileFAB();
        setTimeout(() => {
          const feedbackModal = document.getElementById('feedbackModal');
          if (feedbackModal) {
            feedbackModal.style.display = 'flex';
          }
        }, 100);
      });
    }
    
    if (mobileFabChat) {
      mobileFabChat.addEventListener("click", function() {
        closeMobileFAB();
        setTimeout(() => {
          const chatbotModal = document.getElementById('chatbotModal');
          if (chatbotModal) {
            chatbotModal.style.display = 'flex';
          }
        }, 100);
      });
    }
  }

  function showToast(stack, message) {
    if (!stack) return alert(message);
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = message;
    stack.appendChild(t);
    setTimeout(() => {
      try {
        stack.removeChild(t);
      } catch (_) {}
    }, 2500);
  }

  ready(function () {
    const footer = document.querySelector("#footer-container .footer, .footer");
    if (!footer) return;

    // Initialize footer search functionality
    initFooterSearch(footer);
    
    // Initialize mobile FAB
    initMobileFAB();

    // IntersectionObserver to toggle in-view state for animations & car
    try {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              footer.classList.add("in-view");
            } else {
              footer.classList.remove("in-view");
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(footer);
    } catch (_) {}

    // Accordion: allow only one open at a time
    const headers = footer.querySelectorAll(
      ".footer-accordion .accordion-header"
    );
    headers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        headers.forEach((h) => h.setAttribute("aria-expanded", "false"));
        if (!expanded) {
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    // Footer collapse/expand toggle
    const footerMain = document.getElementById("footer-main");
    const toggleBtn = footer.querySelector(".footer-toggle");

    function setCollapsed(collapsed) {
      if (!footerMain) return;
      if (collapsed) {
        toggleBtn && toggleBtn.setAttribute("aria-expanded", "false");
        footerMain.style.overflow = "hidden";
        footerMain.style.maxHeight = "0px";
      } else {
        toggleBtn && toggleBtn.setAttribute("aria-expanded", "true");
        footerMain.style.overflow = "hidden";
        const h = footerMain.scrollHeight;
        footerMain.style.maxHeight = h + "px";
        setTimeout(() => {
          footerMain.style.overflow = "";
          footerMain.style.maxHeight = "";
        }, 350);
      }
    }

    if (footerMain) {
      footerMain.style.transition = "max-height 0.3s ease";
    }
    // Start collapsed on small screens to shorten vertical height
    try {
      if (window.innerWidth <= 640) setCollapsed(true);
    } catch (_) {}
    toggleBtn &&
      toggleBtn.addEventListener("click", () => {
        const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
        setCollapsed(expanded);
      });

    // Newsletter subscribe micro-toast
    const form = footer.querySelector("#footerNewsletter");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email =
          (form.querySelector('input[name="email"]') || {}).value || "";
        const stack =
          form.parentElement.querySelector(".toast-stack") ||
          footer.querySelector(".toast-stack");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showToast(stack, "Please enter a valid email");
          return;
        }
        showToast(stack, "Subscribed! 🎉");
        form.reset();
      });
    }
  });
})();
