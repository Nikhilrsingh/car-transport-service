// Search functionality for navbar search bar
(function () {
  'use strict';

  // Determine base path based on current page location
  function getBasePath() {
    const path = window.location.pathname;
    // If we're in a subdirectory (pages/), go up one level
    return path.includes('/pages/') ? '../' : './';
  }

  // Search data - services and pages that can be searched
  function getSearchData() {
    const base = getBasePath();
    return [
      { title: 'Home', url: base + 'index.html', keywords: ['home', 'main', 'landing'] },
      { title: 'About Us', url: base + 'pages/about.html', keywords: ['about', 'company', 'who we are', 'team'] },
      { title: 'Services', url: base + 'services.html', keywords: ['services', 'what we do', 'offerings'] },
      { title: 'Car Transport', url: base + 'services.html', keywords: ['car transport', 'vehicle shipping', 'auto transport'] },
      { title: 'Bike Transport', url: base + 'services.html', keywords: ['bike transport', 'motorcycle shipping', 'two wheeler'] },
      { title: 'Door to Door Service', url: base + 'services.html', keywords: ['door to door', 'pickup', 'delivery'] },
      { title: 'Booking', url: base + 'pages/booking.html', keywords: ['booking', 'book now', 'reserve', 'schedule'] },
      { title: 'Contributors', url: base + 'pages/contributors.html', keywords: ['contributors', 'team', 'developers'] },
      { title: 'Pricing', url: base + 'pages/pricing.html', keywords: ['pricing', 'rates', 'cost', 'quote', 'price'] },
      { title: 'Track Your Car', url: base + 'pages/tracking.html', keywords: ['track', 'tracking', 'locate', 'find car'] },
      { title: 'Gallery', url: base + 'pages/gallery.html', keywords: ['gallery', 'photos', 'images', 'pictures'] },
      { title: 'Contact', url: base + 'pages/contact.html', keywords: ['contact', 'reach us', 'get in touch', 'phone', 'email'] },
      { title: 'Enquiry', url: base + 'pages/enquiry.html', keywords: ['enquiry', 'inquiry', 'ask', 'question'] },
      { title: 'Blog', url: base + 'pages/blog.html', keywords: ['blog', 'news', 'articles', 'posts'] },
      { title: 'Login', url: base + 'pages/login.html', keywords: ['login', 'sign in', 'account'] },
      { title: 'Insurance', url: base + 'services.html', keywords: ['insurance', 'coverage', 'protection'] },
      { title: 'Safe Transport', url: base + 'services.html', keywords: ['safe', 'secure', 'reliable'] },
    ];
  }

  // Initialize search functionality
  function initSearch() {
    console.log('Initializing search functionality...');

    const desktopSearchInput = document.getElementById('navbarSearch');
    const mobileSearchInput = document.getElementById('mobileSearch');

    if (desktopSearchInput) {
      console.log('Desktop search input found, setting up...');
      setupSearchInput(desktopSearchInput);
    } else {
      console.warn('Desktop search input not found');
    }

    if (mobileSearchInput) {
      console.log('Mobile search input found, setting up...');
      setupSearchInput(mobileSearchInput);
    } else {
      console.warn('Mobile search input not found');
    }
  }

  // Setup search input with event listeners
  function setupSearchInput(inputElement) {
    if (inputElement.dataset.searchInitialized) return;

    const isMobile = inputElement.id === 'mobileSearch';
    let resultsDropdown = null;

    // ONLY create dropdown for desktop. Mobile wants "simple search field" (no cards).
    if (!isMobile) {
      resultsDropdown = inputElement.parentElement.querySelector('.search-results-dropdown');
      if (!resultsDropdown) {
        resultsDropdown = createResultsDropdown();
        inputElement.parentElement.appendChild(resultsDropdown);
      }
    }

    inputElement.dataset.searchInitialized = 'true';

    // Search on input
    inputElement.addEventListener('input', function (e) {
      if (isMobile) return; // Disable live results on mobile

      const query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        const results = performSearch(query);
        displayResults(resultsDropdown, results);
      } else {
        hideResults(resultsDropdown);
      }
    });

    // Handle Enter key - Navigation only on mobile
    inputElement.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
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

    // Handle focus
    inputElement.addEventListener('focus', function (e) {
      if (isMobile) return; // Disable popular searches on mobile focus

      const query = e.target.value.trim().toLowerCase();
      if (query.length === 0) {
        const popularResults = getPopularSearches();
        displayResults(resultsDropdown, popularResults);
      } else {
        const results = performSearch(query);
        displayResults(resultsDropdown, results);
      }
    });

    // Hide results when clicking outside
    document.addEventListener('click', function (e) {
      if (resultsDropdown && !inputElement.parentElement.contains(e.target)) {
        hideResults(resultsDropdown);
      }
    });
  }

  // Create results dropdown element
  function createResultsDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    // Remove inline styles that override CSS classes
    return dropdown;
  }

  // Get popular/default searches
  function getPopularSearches() {
    const base = getBasePath();
    return [
      { title: 'Services', url: base + 'services.html', keywords: ['services'] },
      { title: 'Booking', url: base + 'pages/booking.html', keywords: ['booking'] },
      { title: 'Track Your Car', url: base + 'pages/tracking.html', keywords: ['track'] },
      { title: 'Pricing', url: base + 'pages/pricing.html', keywords: ['pricing'] },
      { title: 'Contact', url: base + 'pages/contact.html', keywords: ['contact'] }
    ];
  }

  // Perform search based on query
  function performSearch(query) {
    console.log('Searching for:', query);
    const searchData = getSearchData();
    const filtered = searchData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const keywordMatch = item.keywords.some(keyword => keyword.includes(query));
      return titleMatch || keywordMatch;
    }).slice(0, 5);
    console.log('Results found:', filtered.length);
    return filtered;
  }

  // Display search results
  function displayResults(dropdown, results) {
    if (results.length === 0) {
      dropdown.innerHTML = `
        <div class="search-no-results" style="padding: 15px; text-align: center; color: rgba(255, 255, 255, 0.6);">
          <i class="fas fa-search" style="margin-right: 8px;"></i>
          No results found
        </div>
      `;
    } else {
      dropdown.innerHTML = results.map((result, index) => `
        <a href="${result.url}" class="search-result-item" data-index="${index}">
          <i class="fas fa-chevron-right"></i>
          <span>${result.title}</span>
        </a>
      `).join('');

      // Add proper click handling and hover effects
      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        // Enhanced click handling
        item.addEventListener('click', function (e) {
          e.preventDefault();
          const url = this.getAttribute('href');
          console.log('Navigating to:', url);
          window.location.href = url;
        });

        // Hover effects
        item.addEventListener('mouseenter', function () {
          this.style.background = 'rgba(255, 99, 71, 0.15)';
          this.style.paddingLeft = '20px';
        });
        item.addEventListener('mouseleave', function () {
          this.style.background = 'transparent';
          this.style.paddingLeft = '15px';
        });
      });
    }

    dropdown.style.display = 'block';
  }

  // Hide search results
  function hideResults(dropdown) {
    dropdown.style.display = 'none';
  }

  // Expose globally to allow re-initialization if navbar is loaded dynamically
  window.initSearch = initSearch;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();

// Mic button implementation
const micButton = document.getElementById("micButton");

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition && micButton) {
  const recognition = new SpeechRecognition();
  recognition.lang = navigator.language || "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  let isListening = false;

  micButton.addEventListener("click", () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
      micButton.style.color = "#ff6347";
      micButton.classList.add('listening');
    } else {
      recognition.stop();
    }
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();

    // Find the currently visible search input
    const isMobile = window.innerWidth <= 1024;
    const searchInput = isMobile
      ? document.getElementById("mobileSearch")
      : document.getElementById("navbarSearch");

    if (searchInput) {
      searchInput.focus();
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event("input"));
    }
  });

  recognition.addEventListener("end", () => {
    isListening = false;
    micButton.style.color = "";
    micButton.classList.remove('listening');
  });

  recognition.addEventListener("error", () => {
    isListening = false;
    micButton.style.color = "";
    micButton.classList.remove('listening');
  });
}
