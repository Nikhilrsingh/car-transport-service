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

  // Helper function to extract city name from "Car Transport in CityName" format
  function extractCityName(fullName) {
    // Check if the name follows the pattern "Car Transport in [City]"
    const match = fullName.match(/Car Transport in (.+)/i);
    return match ? match[1] : fullName;
  }

  function loadCitiesData() {
    // Try to load from cities.json
    fetch("./assets/data/cities.json")
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
          {
            "slug": "agra",
            "name": "Car Transport in Agra",
            "description": "Offering reliable and secure car transport services from Agra to all major cities across India. Ensure safe and timely doorstep delivery for your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "ahmedabad",
            "name": "Car Transport in Ahmedabad",
            "description": "Fast, safe, and reliable car transportation services from Ahmedabad across India. Experience secure pickup and insured doorstep delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "aizawl",
            "name": "Car Transport in Aizawl",
            "description": "Specialized car transport services connecting Aizawl to various Indian cities. We guarantee secure handling and timely delivery of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "aligarh",
            "name": "Car Transport in Aligarh",
            "description": "Reliable car moving services available from Aligarh to destinations nationwide. Trust us for professional handling and secure transportation of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "allahabad",
            "name": "Car Transport in Allahabad",
            "description": "Efficient car transport from Allahabad (Prayagraj) to major cities. We offer professional, safe, and trackable vehicle relocation services.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "amritsar",
            "name": "Car Transport in Amritsar",
            "description": "Secure and hassle-free car transport services starting from Amritsar. We provide insured, door-to-door vehicle delivery across India.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "aurangabad",
            "name": "Car Transport in Aurangabad",
            "description": "Professional car shifting solutions from Aurangabad to all Indian metro cities. We ensure vehicle safety and offer real-time shipment updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "bangalore",
            "name": "Car Transport in Bangalore",
            "description": "Quick and secure car relocation from Bangalore (Bengaluru) to anywhere in India. We provide door-to-door transport with tracking updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "bareilly",
            "name": "Car Transport in Bareilly",
            "description": "Offering efficient and affordable car transport options from Bareilly. Get your vehicle moved safely and on time to any part of the country.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "bhopal",
            "name": "Car Transport in Bhopal",
            "description": "Reliable vehicle transportation services in Bhopal with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "bhubaneswar",
            "name": "Car Transport in Bhubaneswar",
            "description": "Secure car shipping from Bhubaneswar to all over India. We focus on vehicle safety and timely, trackable delivery to your doorstep.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "bikaner",
            "name": "Car Transport in Bikaner",
            "description": "Hassle-free car moving solutions from Bikaner to other major Indian cities. We guarantee professional service and damage-free vehicle delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "bilaspur",
            "name": "Car Transport in Bilaspur",
            "description": "Efficient and secure car transport services from Bilaspur. We ensure professional handling and reliable door-to-door delivery across India.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "chandigarh",
            "name": "Car Transport in Chandigarh",
            "description": "Professional car transport solutions from Chandigarh to any part of India. Your car's safety and timely delivery are our top priorities.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "chennai",
            "name": "Car Transport in Chennai",
            "description": "We offer fast, safe, and reliable car transportation services from Chennai to major cities across India. Experience secure pickup and doorstep delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "coimbatore",
            "name": "Car Transport in Coimbatore",
            "description": "Top-rated vehicle movers in Coimbatore with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "cuttack",
            "name": "Car Transport in Cuttack",
            "description": "Secure car shipping from Cuttack to all over India. We focus on vehicle safety and timely, trackable delivery to your doorstep.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "dehradun",
            "name": "Car Transport in Dehradun",
            "description": "Affordable and professional car transport solutions from Dehradun to any part of India. Your car's safety, our priority.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "delhi",
            "name": "Car Transport in Delhi",
            "description": "Affordable and professional car transport solutions from Delhi to any part of India. Your car's safety, our priority.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "dhanbad",
            "name": "Car Transport in Dhanbad",
            "description": "Reliable car transport services available from Dhanbad to destinations nationwide. Trust us for professional handling and secure transportation of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "durgapur",
            "name": "Car Transport in Durgapur",
            "description": "Efficient car transport from Durgapur to major cities. We offer professional, safe, and trackable vehicle relocation services.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "faridabad",
            "name": "Car Transport in Faridabad",
            "description": "Professional car transport solutions from Faridabad to any part of India. Your car's safety and timely delivery are our top priorities.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "gandhinagar",
            "name": "Car Transport in Gandhinagar",
            "description": "Secure and hassle-free car transport services starting from Gandhinagar. We provide insured, door-to-door vehicle delivery across India.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "gangtok",
            "name": "Car Transport in Gangtok",
            "description": "Specialized car transport services connecting Gangtok to various Indian cities. We guarantee secure handling and timely delivery of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "ghaziabad",
            "name": "Car Transport in Ghaziabad",
            "description": "Reliable car moving services available from Ghaziabad to destinations nationwide. Trust us for professional handling and secure transportation of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "gorakhpur",
            "name": "Car Transport in Gorakhpur",
            "description": "Offering efficient and affordable car transport options from Gorakhpur. Get your vehicle moved safely and on time to any part of the country.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "gurgaon",
            "name": "Car Transport in Gurgaon",
            "description": "Quick and secure car relocation from Gurgaon (Gurugram) to anywhere in India. We provide door-to-door transport with tracking updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "guwahati",
            "name": "Car Transport in Guwahati",
            "description": "Specialized car transport services connecting Guwahati to various Indian cities. We guarantee secure handling and timely delivery of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "gwalior",
            "name": "Car Transport in Gwalior",
            "description": "Reliable vehicle transportation services in Gwalior with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "hyderabad",
            "name": "Car Transport in Hyderabad",
            "description": "Top-rated vehicle transport services in Hyderabad. Book hassle-free and track your shipment easily.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "imphal",
            "name": "Car Transport in Imphal",
            "description": "Specialized car transport services connecting Imphal to various Indian cities. We guarantee secure handling and timely delivery of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "indore",
            "name": "Car Transport in Indore",
            "description": "Trusted vehicle movers in Indore with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "itanagar",
            "name": "Car Transport in Itanagar",
            "description": "Specialized car transport services connecting Itanagar to various Indian cities. We guarantee secure handling and timely delivery of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "jabalpur",
            "name": "Car Transport in Jabalpur",
            "description": "Reliable vehicle transportation services in Jabalpur with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "jaipur",
            "name": "Car Transport in Jaipur",
            "description": "Secure and hassle-free car transport services starting from Jaipur. We provide insured, door-to-door vehicle delivery across India.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "jalandhar",
            "name": "Car Transport in Jalandhar",
            "description": "Offering reliable and secure car transport services from Jalandhar to all major cities across India. Ensure safe and timely doorstep delivery for your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "kanpur",
            "name": "Car Transport in Kanpur",
            "description": "Efficient car transport from Kanpur to major cities. We offer professional, safe, and trackable vehicle relocation services.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "kolkata",
            "name": "Car Transport in Kolkata",
            "description": "We offer fast, safe, and reliable car transportation services from Kolkata to major cities across India. Experience secure pickup and doorstep delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "kota",
            "name": "Car Transport in Kota",
            "description": "Hassle-free car moving solutions from Kota to other major Indian cities. We guarantee professional service and damage-free vehicle delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "lucknow",
            "name": "Car Transport in Lucknow",
            "description": "Professional car shifting solutions from Lucknow to all Indian metro cities. We ensure vehicle safety and offer real-time shipment updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "ludhiana",
            "name": "Car Transport in Ludhiana",
            "description": "Offering reliable and secure car transport services from Ludhiana to all major cities across India. Ensure safe and timely doorstep delivery for your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "madurai",
            "name": "Car Transport in Madurai",
            "description": "Top-rated vehicle movers in Madurai with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "meerut",
            "name": "Car Transport in Meerut",
            "description": "Affordable and professional car transport solutions from Meerut to any part of India. Your car's safety, our priority.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "mumbai",
            "name": "Car Transport in Mumbai",
            "description": "Trusted vehicle movers in Mumbai with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "nagpur",
            "name": "Car Transport in Nagpur",
            "description": "Reliable vehicle transportation services in Nagpur with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "nashik",
            "name": "Car Transport in Nashik",
            "description": "Secure and hassle-free car transport services starting from Nashik. We provide insured, door-to-door vehicle delivery across India.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "navi_mumbai",
            "name": "Car Transport in Navi Mumbai",
            "description": "Professional car shifting solutions from Navi Mumbai to all Indian metro cities. We ensure vehicle safety and offer real-time shipment updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "patna",
            "name": "Car Transport in Patna",
            "description": "Reliable car moving services available from Patna to destinations nationwide. Trust us for professional handling and secure transportation of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "pune",
            "name": "Car Transport in Pune",
            "description": "Top-rated vehicle transport services in Pune. Book hassle-free and track your shipment easily.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "puri",
            "name": "Car Transport in Puri",
            "description": "Secure car shipping from Puri to all over India. We focus on vehicle safety and timely, trackable delivery to your doorstep.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "raipur",
            "name": "Car Transport in Raipur",
            "description": "Efficient and secure car transport services from Raipur. We ensure professional handling and reliable door-to-door delivery across India.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "rajkot",
            "name": "Car Transport in Rajkot",
            "description": "Offering reliable and secure car transport services from Rajkot to all major cities across India. Ensure safe and timely doorstep delivery for your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "ranchi",
            "name": "Car Transport in Ranchi",
            "description": "Reliable vehicle transportation services in Ranchi with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "rourkela",
            "name": "Car Transport in Rourkela",
            "description": "Secure car shipping from Rourkela to all over India. We focus on vehicle safety and timely, trackable delivery to your doorstep.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "shimla",
            "name": "Car Transport in Shimla",
            "description": "Affordable and professional car transport solutions from Shimla to any part of India. Your car's safety, our priority.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "srinagar",
            "name": "Car Transport in Srinagar",
            "description": "Specialized car transport services connecting Srinagar to various Indian cities. We guarantee secure handling and timely delivery of your vehicle.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "surat",
            "name": "Car Transport in Surat",
            "description": "Fast, safe, and reliable car transportation services from Surat across India. Experience secure pickup and insured doorstep delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "thane",
            "name": "Car Transport in Thane",
            "description": "Professional car shifting solutions from Thane to all Indian metro cities. We ensure vehicle safety and offer real-time shipment updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "udaipur",
            "name": "Car Transport in Udaipur",
            "description": "Hassle-free car moving solutions from Udaipur to other major Indian cities. We guarantee professional service and damage-free vehicle delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "vadodara",
            "name": "Car Transport in Vadodara",
            "description": "Trusted vehicle movers in Vadodara (Baroda) with seamless city-to-city transport options and real-time updates for every delivery.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "varanasi",
            "name": "Car Transport in Varanasi",
            "description": "Efficient car transport from Varanasi to major cities. We offer professional, safe, and trackable vehicle relocation services.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "vijayawada",
            "name": "Car Transport in Vijayawada",
            "description": "Quick and secure car relocation from Vijayawada to anywhere in India. We provide door-to-door transport with tracking updates.",
            "image": "/assets/images/right-logo.jpg"
          },
          {
            "slug": "visakhapatnam",
            "name": "Car Transport in Visakhapatnam",
            "description": "Top-rated vehicle transport services in Visakhapatnam. Book hassle-free and track your shipment easily.",
            "image": "/assets/images/right-logo.jpg"
          }
        ];
      });
  }

  function renderCityList(cities, popularCitiesEl) {
    if (!popularCitiesEl) return;

    const BASE_PATH = "/frontend";
    function cityUrl(slug) {
      return `${BASE_PATH}/pages/city.html?city=${slug}`;
    }

    popularCitiesEl.innerHTML = `
      <ul class="footer-links">
        ${cities.map(city => `
          <li>
            <a href="${cityUrl(city.slug)}" class="link-underline">
              <i class="fas fa-city"></i> ${extractCityName(city.name)}
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

    // Filter cities - search in the extracted city name
    const filteredCities = allCities.filter(city => {
      const cityName = extractCityName(city.name);
      return cityName.toLowerCase().startsWith(query);
    });

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

    const defaultCities = [
      { slug: "mumbai", name: "Car Transport in Mumbai" },
      { slug: "delhi", name: "Car Transport in Delhi" },
      { slug: "bangalore", name: "Car Transport in Bangalore" },
      { slug: "hyderabad", name: "Car Transport in Hyderabad" },
      { slug: "kolkata", name: "Car Transport in Kolkata" }
    ];

    // Store default HTML for restoration
    renderCityList(defaultCities, popularCities);
    defaultCitiesHTML = popularCities.innerHTML;

    // Search input event
    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 0) {
        if (searchClear) searchClear.style.display = "flex";
        performSearch(query, popularCities);
      } else {
        if (searchClear) searchClear.style.display = "none";
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
    miniFabTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (isOpen) {
        closeMobileFAB();
      } else {
        openMobileFAB();
      }
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
      if (isOpen && !e.target.closest(".mobile-fab-actions") && !e.target.closest(".mini-fab-trigger")) {
        closeMobileFAB();
      }
    });

    // Close on ESC
    document.addEventListener("keydown", function (e) {
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
      mobileFabQuote.addEventListener("click", function () {
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
      mobileFabBook.addEventListener("click", function () {
        closeMobileFAB();
        setTimeout(() => {
          window.location.href = '../pages/booking.html';
        }, 100);
      });
    }

    if (mobileFabFeedback) {
      mobileFabFeedback.addEventListener("click", function () {
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
      mobileFabChat.addEventListener("click", function () {
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
      } catch (_) { }
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
    } catch (_) { }

  const footerMain = document.getElementById("footer-main");
const footerBottom = document.querySelector(".footer-bottom");

function handleFooterResponsiveUI() {
  if (!footerMain) return;

  const isSmallScreen = window.innerWidth <= 768;

  if (isSmallScreen) {
  
    footerMain.style.display = "none";
  } else {
    
    footerMain.style.display = "block";
    footerMain.style.maxHeight = "none";
    footerMain.style.opacity = "1";
  }

  
  if (footerBottom) {
  footerBottom.style.display = "block"; 
  }
}


handleFooterResponsiveUI();
window.addEventListener("resize", handleFooterResponsiveUI);    

    // Newsletter subscribe micro-toast
    const form = footer.querySelector("#footerNewsletter");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[name="email"]');
        const email = emailInput ? emailInput.value : "";
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
