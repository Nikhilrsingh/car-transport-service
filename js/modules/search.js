// Search functionality for navbar search bar
(function () {
  "use strict";

  // Determine base path based on current page location
  function getBasePath() {
    const path = window.location.pathname;
    // If we're in a subdirectory (pages/), go up one level
    return path.includes("/pages/") ? "../" : "./";
  }

  // Search data - services and pages that can be searched
  function getSearchData() {
    const base = getBasePath();
    return [
      {
        title: "Home",
        url: base + "index.html",
        keywords: ["home", "main", "landing"],
      },
      {
        title: "About Us",
        url: base + "pages/about.html",
        keywords: ["about", "company", "who we are", "team"],
      },
      {
        title: "Services",
        url: base + "services.html",
        keywords: ["services", "what we do", "offerings"],
      },
      {
        title: "Car Transport",
        url: base + "services.html",
        keywords: ["car transport", "vehicle shipping", "auto transport"],
      },
      {
        title: "Bike Transport",
        url: base + "services.html",
        keywords: ["bike transport", "motorcycle shipping", "two wheeler"],
      },
      {
        title: "Door to Door Service",
        url: base + "services.html",
        keywords: ["door to door", "pickup", "delivery"],
      },
      {
        title: "Booking",
        url: base + "pages/booking.html",
        keywords: ["booking", "book now", "reserve", "schedule"],
      },
      {
        title: "Contributors",
        url: base + "pages/contributors.html",
        keywords: ["contributors", "team", "developers"],
      },
      {
        title: "Pricing",
        url: base + "pages/pricing.html",
        keywords: ["pricing", "rates", "cost", "quote", "price"],
      },
      {
        title: "Track Your Car",
        url: base + "pages/tracking.html",
        keywords: ["track", "tracking", "locate", "find car"],
      },
      {
        title: "Gallery",
        url: base + "pages/gallery.html",
        keywords: ["gallery", "photos", "images", "pictures"],
      },
      {
        title: "Contact",
        url: base + "pages/contact.html",
        keywords: ["contact", "reach us", "get in touch", "phone", "email"],
      },
      {
        title: "Enquiry",
        url: base + "pages/enquiry.html",
        keywords: ["enquiry", "inquiry", "ask", "question"],
      },
      {
        title: "Blog",
        url: base + "pages/blog.html",
        keywords: ["blog", "news", "articles", "posts"],
      },
      {
        title: "Login",
        url: base + "pages/login.html",
        keywords: ["login", "sign in", "account"],
      },
      {
        title: "Insurance",
        url: base + "services.html",
        keywords: ["insurance", "coverage", "protection"],
      },
      {
        title: "Safe Transport",
        url: base + "services.html",
        keywords: ["safe", "secure", "reliable"],
      },
    ];
  }

  // Initialize search functionality
  function initSearch() {
    const desktopSearchInput = document.getElementById("navbarSearch");
    const mobileSearchInput = document.getElementById("mobileSearch");

    if (desktopSearchInput) {
      setupSearchInput(desktopSearchInput);
    }

    if (mobileSearchInput) {
      setupSearchInput(mobileSearchInput);
    }
  }

  // Setup search input with event listeners
  function setupSearchInput(inputElement) {
    // Create search results dropdown
    const resultsDropdown = createResultsDropdown();
    inputElement.parentElement.appendChild(resultsDropdown);

    // Search on input
    inputElement.addEventListener("input", function (e) {
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 0) {
        const results = performSearch(query);
        displayResults(resultsDropdown, results);
      } else {
        hideResults(resultsDropdown);
      }
    });

    // Handle Enter key
    inputElement.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = e.target.value.trim().toLowerCase();

        if (query.length > 0) {
          const results = performSearch(query);
          if (results.length > 0) {
            window.location.href = results[0].url;
          }
        }
      }
    });

    // Hide results when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !inputElement.contains(e.target) &&
        !resultsDropdown.contains(e.target)
      ) {
        hideResults(resultsDropdown);
      }
    });
  }

  // Create results dropdown element
  function createResultsDropdown() {
    const dropdown = document.createElement("div");
    dropdown.className = "search-results-dropdown";
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(43, 43, 43, 0.98);
      border: 1px solid rgba(255, 99, 71, 0.3);
      border-radius: 8px;
      margin-top: 8px;
      max-height: 300px;
      overflow-y: auto;
      display: none;
      z-index: 1000;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    `;
    return dropdown;
  }

  // Perform search based on query
  function performSearch(query) {
    const searchData = getSearchData();
    return searchData
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const keywordMatch = item.keywords.some((keyword) =>
          keyword.includes(query)
        );
        return titleMatch || keywordMatch;
      })
      .slice(0, 5); // Limit to 5 results
  }

  // Display search results
  function displayResults(dropdown, results) {
    if (results.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 15px; text-align: center; color: rgba(255, 255, 255, 0.6);">
          <i class="fas fa-search" style="margin-right: 8px;"></i>
          No results found
        </div>
      `;
    } else {
      dropdown.innerHTML = results
        .map(
          (result) => `
        <a href="${result.url}" class="search-result-item" style="
          display: flex;
          align-items: center;
          padding: 12px 15px;
          color: white;
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        ">
          <i class="fas fa-chevron-right" style="margin-right: 10px; color: #ff6347; font-size: 0.8rem;"></i>
          <span>${result.title}</span>
        </a>
      `
        )
        .join("");

      // Add hover effects
      dropdown.querySelectorAll(".search-result-item").forEach((item) => {
        item.addEventListener("mouseenter", function () {
          this.style.background = "rgba(255, 99, 71, 0.1)";
          this.style.paddingLeft = "20px";
        });
        item.addEventListener("mouseleave", function () {
          this.style.background = "transparent";
          this.style.paddingLeft = "15px";
        });
      });
    }

    dropdown.style.display = "block";
  }

  // Hide search results
  function hideResults(dropdown) {
    dropdown.style.display = "none";
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();
