// Enhanced Footer Interactions: accordion, collapse toggle, micro-toast, in-view animations, and cities search
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
      .catch((error) => {
        console.log("Using fallback cities data");
        // Fallback cities data
        const allCities = [
          { slug: "agra", name: "Agra" },
          { slug: "ahmedabad", name: "Ahmedabad" },
          { slug: "aizawl", name: "Aizawl" },
          { slug: "aligarh", name: "Aligarh" },
          { slug: "allahabad", name: "Allahabad" },
          { slug: "amritsar", name: "Amritsar" },
          { slug: "aurangabad", name: "Aurangabad" },
          { slug: "bangalore", name: "Bangalore" },
          { slug: "bareilly", name: "Bareilly" },
          { slug: "bhopal", name: "Bhopal" },
          { slug: "bhubaneswar", name: "Bhubaneswar" },
          { slug: "bikaner", name: "Bikaner" },
          { slug: "bilaspur", name: "Bilaspur" },
          { slug: "chandigarh", name: "Chandigarh" },
          { slug: "chennai", name: "Chennai" },
          { slug: "coimbatore", name: "Coimbatore" },
          { slug: "cuttack", name: "Cuttack" },
          { slug: "dehradun", name: "Dehradun" },
          { slug: "delhi", name: "Delhi" },
          { slug: "dhanbad", name: "Dhanbad" },
          { slug: "durgapur", name: "Durgapur" },
          { slug: "faridabad", name: "Faridabad" },
          { slug: "gandhinagar", name: "Gandhinagar" },
          { slug: "gangtok", name: "Gangtok" },
          { slug: "ghaziabad", name: "Ghaziabad" },
          { slug: "gorakhpur", name: "Gorakhpur" },
          { slug: "gurgaon", name: "Gurgaon" },
          { slug: "guwahati", name: "Guwahati" },
          { slug: "gwalior", name: "Gwalior" },
          { slug: "hyderabad", name: "Hyderabad" },
          { slug: "imphal", name: "Imphal" },
          { slug: "indore", name: "Indore" },
          { slug: "itanagar", name: "Itanagar" },
          { slug: "jabalpur", name: "Jabalpur" },
          { slug: "jaipur", name: "Jaipur" },
          { slug: "jalandhar", name: "Jalandhar" },
          { slug: "kanpur", name: "Kanpur" },
          { slug: "kolkata", name: "Kolkata" },
          { slug: "kota", name: "Kota" },
          { slug: "lucknow", name: "Lucknow" },
          { slug: "ludhiana", name: "Ludhiana" },
          { slug: "madurai", name: "Madurai" },
          { slug: "meerut", name: "Meerut" },
          { slug: "mumbai", name: "Mumbai" },
          { slug: "nagpur", name: "Nagpur" },
          { slug: "nashik", name: "Nashik" },
          { slug: "navi_mumbai", name: "Navi Mumbai" },
          { slug: "patna", name: "Patna" },
          { slug: "pune", name: "Pune" },
          { slug: "puri", name: "Puri" },
          { slug: "raipur", name: "Raipur" },
          { slug: "rajkot", name: "Rajkot" },
          { slug: "ranchi", name: "Ranchi" },
          { slug: "rourkela", name: "Rourkela" },
          { slug: "shimla", name: "Shimla" },
          { slug: "srinagar", name: "Srinagar" },
          { slug: "surat", name: "Surat" },
          { slug: "thane", name: "Thane" },
          { slug: "udaipur", name: "Udaipur" },
          { slug: "vadodara", name: "Vadodara" },
          { slug: "varanasi", name: "Varanasi" },
          { slug: "vijayawada", name: "Vijayawada" },
          { slug: "visakhapatnam", name: "Visakhapatnam" },
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
    const miniUp = footer.querySelector(".mini-sticky-footer .mini-up");

    function setCollapsed(collapsed) {
      if (!footerMain) return;
      if (collapsed) {
        toggleBtn && toggleBtn.setAttribute("aria-expanded", "false");
        miniUp && miniUp.setAttribute("aria-expanded", "false");
        footerMain.style.overflow = "hidden";
        footerMain.style.maxHeight = "0px";
      } else {
        toggleBtn && toggleBtn.setAttribute("aria-expanded", "true");
        miniUp && miniUp.setAttribute("aria-expanded", "true");
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
    miniUp &&
      miniUp.addEventListener("click", () => {
        setCollapsed(false);
        footer.scrollIntoView({ behavior: "smooth", block: "end" });
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
