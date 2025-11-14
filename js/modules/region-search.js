// Enhanced Region Search Functionality with Auto-complete and Filters
function initRegionSearch() {
  const searchInput = document.getElementById('regionSearch');
  const regionGrid = document.getElementById('regionGrid');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  if (!searchInput || !regionGrid) return;
  
  const regionCards = regionGrid.querySelectorAll('.region-card.enhanced');
  
  // City data for autocomplete
  const cities = Array.from(regionCards).map(card => ({
    name: card.querySelector('.city-name').textContent,
    region: card.getAttribute('data-region'),
    element: card,
    url: card.href
  }));
  
  let currentFilter = 'all';
  let currentSearch = '';
  
  // Search input with autocomplete
  searchInput.addEventListener('input', function(e) {
    currentSearch = e.target.value.toLowerCase().trim();
    
    if (currentSearch.length > 0) {
      showSuggestions(currentSearch);
    } else {
      hideSuggestions();
    }
    
    filterCards();
  });
  
  // Show autocomplete suggestions
  function showSuggestions(searchTerm) {
    const matches = cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm)
    ).slice(0, 5);
    
    if (matches.length > 0) {
      searchSuggestions.innerHTML = matches.map(city => `
        <div class="suggestion-item" data-city="${city.name}" data-url="${city.url}">
          <span class="suggestion-icon">${getRegionIcon(city.region)}</span>
          <span>${highlightMatch(city.name, searchTerm)}</span>
        </div>
      `).join('');
      
      searchSuggestions.classList.add('active');
      
      // Add click handlers to suggestions
      searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
          window.location.href = this.getAttribute('data-url');
        });
      });
    } else {
      hideSuggestions();
    }
  }
  
  // Hide suggestions
  function hideSuggestions() {
    searchSuggestions.classList.remove('active');
    searchSuggestions.innerHTML = '';
  }
  
  // Highlight matching text
  function highlightMatch(text, search) {
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }
  
  // Get region icon
  function getRegionIcon(region) {
    const icons = {
      north: '🏔️',
      south: '🌴',
      east: '🌅',
      west: '🌊',
      central: '🏛️'
    };
    return icons[region] || '🏙️';
  }
  
  // Regional filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update current filter
      currentFilter = this.getAttribute('data-filter');
      
      // Filter cards
      filterCards();
    });
  });
  
  // Filter cards based on search and region filter
  function filterCards() {
    let visibleCount = 0;
    
    regionCards.forEach(card => {
      const cityName = card.querySelector('.city-name').textContent.toLowerCase();
      const region = card.getAttribute('data-region');
      
      const matchesSearch = currentSearch === '' || cityName.includes(currentSearch);
      const matchesFilter = currentFilter === 'all' || region === currentFilter;
      
      if (matchesSearch && matchesFilter) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Show/hide no results message
    showNoResults(visibleCount === 0);

    // Notify pagination to recalc visibility
    document.dispatchEvent(new CustomEvent('regionFilterChanged'));
  }
  
  // Show no results message
  function showNoResults(show) {
    let noResultsEl = regionGrid.querySelector('.no-results');
    
    if (show && !noResultsEl) {
      noResultsEl = document.createElement('div');
      noResultsEl.className = 'no-results';
      noResultsEl.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>No Cities Found</h3>
        <p>Try adjusting your search or filter criteria</p>
      `;
      regionGrid.appendChild(noResultsEl);
    } else if (!show && noResultsEl) {
      noResultsEl.remove();
    }
  }
  
  // Close suggestions when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
      hideSuggestions();
    }
  });
  
  // Handle keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
    if (suggestions.length === 0) return;
    
    let currentIndex = Array.from(suggestions).findIndex(s => s.classList.contains('selected'));
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < suggestions.length - 1) {
        if (currentIndex >= 0) suggestions[currentIndex].classList.remove('selected');
        suggestions[currentIndex + 1].classList.add('selected');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        suggestions[currentIndex].classList.remove('selected');
        suggestions[currentIndex - 1].classList.add('selected');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex >= 0) {
        suggestions[currentIndex].click();
      }
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });
  
  // Add hover effect for suggestions
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.suggestion-item')) {
      searchSuggestions.querySelectorAll('.suggestion-item').forEach(s => {
        s.classList.remove('selected');
      });
      e.target.closest('.suggestion-item').classList.add('selected');
    }
  });
  
  // Analytics tracking (optional)
  regionCards.forEach(card => {
    card.addEventListener('click', function() {
      const cityName = this.querySelector('.city-name').textContent;
      console.log(`City clicked: ${cityName}`);
      // You can add analytics tracking here
      // Example: gtag('event', 'city_click', { city: cityName });
    });
  });
  
  // Initialize - show all cards
  filterCards();
}

// Initialize on DOM load or when region section is loaded
document.addEventListener('DOMContentLoaded', initRegionSearch);
document.addEventListener('regionSectionLoaded', initRegionSearch);

