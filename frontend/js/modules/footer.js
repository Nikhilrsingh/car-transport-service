// Enhanced Footer Interactions: accordion, collapse toggle, micro-toast, in-view animations, cities search, and mobile FAB
(function () {
  "use strict";

  let allCities = [];
  let defaultCitiesHTML = "";

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
        // Fallback cities data - Alphabetically sorted
        allCities = [
          { slug: "agra", name: "Agra" },
          { slug: "ahmedabad", name: "Ahmedabad" },
          { slug: "amritsar", name: "Amritsar" },
          { slug: "asansol", name: "Asansol" },
          { slug: "bangalore", name: "Bangalore" },
          { slug: "belgaum", name: "Belgaum" },
          { slug: "bhopal", name: "Bhopal" },
          { slug: "bhubaneswar", name: "Bhubaneswar" },
          { slug: "chandigarh", name: "Chandigarh" },
          { slug: "chennai", name: "Chennai" },
          { slug: "coimbatore", name: "Coimbatore" },
          { slug: "cuttack", name: "Cuttack" },
          { slug: "darjeeling", name: "Darjeeling" },
          { slug: "dehradun", name: "Dehradun" },
          { slug: "delhi", name: "Delhi" },
          { slug: "durgapur", name: "Durgapur" },
          { slug: "erode", name: "Erode" },
          { slug: "faridabad", name: "Faridabad" },
          { slug: "ghaziabad", name: "Ghaziabad" },
          { slug: "gurgaon", name: "Gurgaon" },
          { slug: "guwahati", name: "Guwahati" },
          { slug: "haridwar", name: "Haridwar" },
          { slug: "haldwani", name: "Haldwani" },
          { slug: "howrah", name: "Howrah" },
          { slug: "hubli", name: "Hubli" },
          { slug: "hyderabad", name: "Hyderabad" },
          { slug: "indore", name: "Indore" },
          { slug: "jaipur", name: "Jaipur" },
          { slug: "jalandhar", name: "Jalandhar" },
          { slug: "jamshedpur", name: "Jamshedpur" },
          { slug: "kanpur", name: "Kanpur" },
          { slug: "kannur", name: "Kannur" },
          { slug: "kochi", name: "Kochi" },
          { slug: "kolkata", name: "Kolkata" },
          { slug: "kozhikode", name: "Kozhikode" },
          { slug: "lucknow", name: "Lucknow" },
          { slug: "ludhiana", name: "Ludhiana" },
          { slug: "madurai", name: "Madurai" },
          { slug: "mangalore", name: "Mangalore" },
          { slug: "meerut", name: "Meerut" },
          { slug: "mohali", name: "Mohali" },
          { slug: "mumbai", name: "Mumbai" },
          { slug: "mysore", name: "Mysore" },
          { slug: "nagpur", name: "Nagpur" },
          { slug: "nashik", name: "Nashik" },
          { slug: "noida", name: "Noida" },
          { slug: "patna", name: "Patna" },
          { slug: "pune", name: "Pune" },
          { slug: "raipur", name: "Raipur" },
          { slug: "ranchi", name: "Ranchi" },
          { slug: "roorkee", name: "Roorkee" },
          { slug: "salem", name: "Salem" },
          { slug: "siliguri", name: "Siliguri" },
          { slug: "surat", name: "Surat" },
          { slug: "thrissur", name: "Thrissur" },
          { slug: "tiruppur", name: "Tiruppur" },
          { slug: "trichy", name: "Trichy" },
          { slug: "trivandrum", name: "Trivandrum" },
          { slug: "tumkur", name: "Tumkur" },
          { slug: "udupi", name: "Udupi" },
          { slug: "vadodara", name: "Vadodara" },
          { slug: "varanasi", name: "Varanasi" },
          { slug: "vijayawada", name: "Vijayawada" },
          { slug: "visakhapatnam", name: "Visakhapatnam" },
          { slug: "warangal", name: "Warangal" }
        ];
      });
  }

  function renderCityList(cities, popularCitiesEl) {
    if (!popularCitiesEl) return;

    popularCitiesEl.innerHTML = `
      <ul class="footer-links">
        ${cities.map(city => `
          <li>
            <a href="../pages/city.html?city=${city.slug}" class="link-underline">
              <i class="fas fa-city"></i> ${city.name}
            </a>
          </li>
        `).join("")}
      </ul>
    `;

    // Re-render Font Awesome icons for new DOM
    if (window.FontAwesome && window.FontAwesome.dom) {
      window.FontAwesome.dom.i2svg();
    }
  }

  function performSearch(query, popularCitiesEl) {
    if (!popularCitiesEl) return;

    if (query.length === 0) {
      // Restore default cities HTML
      popularCitiesEl.innerHTML = defaultCitiesHTML;
      return;
    }

    // Filter cities that start with the query (alphabet-wise)
    const filteredCities = allCities.filter(city =>
      city.name.toLowerCase().startsWith(query)
    );

    if (filteredCities.length === 0) {
      // Show "No cities found" message
      popularCitiesEl.innerHTML = `
        <ul class="footer-links">
          <li style="color: #999;">No cities found starting with "${query}"</li>
        </ul>
      `;
    } else {
      // Render filtered results in the main list area
      renderCityList(filteredCities, popularCitiesEl);
    }
  }

  function initFooterSearch(footer) {
    const searchInput = footer.querySelector("#footerCitySearch");
    const searchClear = footer.querySelector("#footerSearchClear");
    const popularCities = footer.querySelector("#popularCities");

    if (!searchInput || !popularCities) return;

    // Load cities data
    loadCitiesData();

    // Store default static cities HTML from the page
    defaultCitiesHTML = popularCities.innerHTML;

    // Search input event
    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 0) {
        searchClear.style.display = "flex";
        performSearch(query, popularCities);
      } else {
        searchClear.style.display = "none";
        popularCities.innerHTML = defaultCitiesHTML;
      }
    });

    // Clear search
    if (searchClear) {
      searchClear.addEventListener("click", function () {
        searchInput.value = "";
        searchClear.style.display = "none";
        popularCities.innerHTML = defaultCitiesHTML;
        searchInput.focus();
      });
    }

    // Handle Escape key to clear search
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        if (searchClear) searchClear.style.display = "none";
        popularCities.innerHTML = defaultCitiesHTML;
        searchInput.blur();
      }
    });

    // Prevent form submission on Enter key
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    // Initialize clear button state
    if (searchClear) {
      searchClear.style.display = searchInput.value.trim() ? "flex" : "none";
    }
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