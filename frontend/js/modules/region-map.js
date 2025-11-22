// Interactive India Map and Pagination Functionality

function initRegionMap() {
  const indiaMap = document.getElementById('indiaMap');
  if (!indiaMap) return;

  const states = indiaMap.querySelectorAll('.state');
  const markers = indiaMap.querySelectorAll('.office-marker');
  const tooltip = indiaMap.getElementById('tooltip');
  
  // Zoom and Pan Controls
  let currentZoom = 1;
  let currentX = 0;
  let currentY = 0;
  const mapContainer = document.getElementById('mapContainer');

  let tooltipHideTimer = null;
const TOOLTIP_HIDE_DELAY = 100;
  
  // City statistics (you can make this dynamic)
  const cityStats = {
    delhi: { transports: '1200+', routes: '150+' },
    mumbai: { transports: '1500+', routes: '200+' },
    bangalore: { transports: '1100+', routes: '140+' },
    kolkata: { transports: '900+', routes: '120+' },
    chennai: { transports: '1000+', routes: '130+' },
    hyderabad: { transports: '950+', routes: '110+' },
    pune: { transports: '600+', routes: '80+' },
    ahmedabad: { transports: '700+', routes: '90+' }
  };
  
  function updateMapTransform() {
    indiaMap.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentZoom})`;
    indiaMap.style.transition = 'transform 0.3s ease';
  }
  
  // Zoom In
  const zoomInBtn = document.getElementById('zoomInBtn');
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (currentZoom < 3) {
        currentZoom += 0.3;
        updateMapTransform();
      }
    });
  }
  
  // Zoom Out
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (currentZoom > 0.5) {
        currentZoom -= 0.3;
        updateMapTransform();
      }
    });
  }
  
  // Reset Map
  const resetMapBtn = document.getElementById('resetMapBtn');
  if (resetMapBtn) {
    resetMapBtn.addEventListener('click', () => {
      currentZoom = 1;
      currentX = 0;
      currentY = 0;
      updateMapTransform();
    });
  }
  
  // Fullscreen Toggle
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      }
    });
  }
  
  // Pan with mouse drag
  let isDragging = false;
  let startX, startY;
  
  mapContainer?.addEventListener('mousedown', (e) => {
    if (currentZoom > 1) {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      mapContainer.style.cursor = 'grabbing';
    }
  });
  
  mapContainer?.addEventListener('mousemove', (e) => {
    if (isDragging) {
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      updateMapTransform();
    }
  });
  
  mapContainer?.addEventListener('mouseup', () => {
    isDragging = false;
    if (mapContainer) mapContainer.style.cursor = 'grab';
  });
  
  mapContainer?.addEventListener('mouseleave', () => {
    isDragging = false;
    if (mapContainer) mapContainer.style.cursor = 'default';
  });

  // State hover effects with highlighting
  states.forEach(state => {
    state.addEventListener('mouseenter', function() {
      const stateName = this.getAttribute('data-state');
      const region = this.closest('.region-group').getAttribute('data-region');
      
      // Highlight state with glow effect
      this.style.strokeWidth = '3';
      this.style.stroke = '#fff';
      this.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.8))';
      this.style.opacity = '1';
      
      // Highlight corresponding region in legend
      const legendItem = document.querySelector(`.legend-item[data-region="${region}"]`);
      if (legendItem) {
        legendItem.style.transform = 'scale(1.1)';
        legendItem.style.fontWeight = 'bold';
      }
    });

    state.addEventListener('mouseleave', function() {
      this.style.strokeWidth = '1.5';
      this.style.stroke = '#333';
      this.style.filter = 'none';
      this.style.opacity = '0.7';
      
      // Reset legend item
      const region = this.closest('.region-group').getAttribute('data-region');
      const legendItem = document.querySelector(`.legend-item[data-region="${region}"]`);
      if (legendItem) {
        legendItem.style.transform = 'scale(1)';
        legendItem.style.fontWeight = 'normal';
      }
    });

    state.addEventListener('click', function() {
      const region = this.closest('.region-group').getAttribute('data-region');

      // Toggle behavior: clicking the same region again clears filter to 'all'
      const activeTab = document.querySelector('.filter-tab.active');
      const activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
      const allTab = document.querySelector('.filter-tab[data-filter="all"]');
      const regionTab = document.querySelector(`.filter-tab[data-filter="${region}"]`);

      if (activeFilter === region && allTab) {
        allTab.click();
        updateActiveFilterBadge('all');
      } else if (regionTab) {
        regionTab.click();
        updateActiveFilterBadge(region);
      }

      // Keep map in view (do not auto-scroll)
    });
  });

  // Marker interactions with enhanced tooltips
  markers.forEach(marker => {
        const cityName = marker.getAttribute('data-city');
        const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        
        marker.addEventListener('mouseenter', function(e) {
            if (!tooltip) return;
            
            // --- FIX STEP 1: Clear the hide timer on mouse enter ---
            clearTimeout(tooltipHideTimer);
            // --------------------------------------------------------
            
            const region = this.closest('.region-group')?.getAttribute('data-region') || 
                            this.closest('svg').querySelector('.state[data-state="' + cityName.toLowerCase() + '"]')?.closest('.region-group')?.getAttribute('data-region') || 'india';
            const regionName = region.charAt(0).toUpperCase() + region.slice(1) + ' India';
            
            // Get stats for this city
            const stats = cityStats[cityName] || { transports: '500+', routes: '50+' };
            
            // Position tooltip
            const x = parseFloat(this.getAttribute('cx'));
            const y = parseFloat(this.getAttribute('cy'));
            
            tooltip.style.display = 'block';
            // Position the tooltip group relative to the marker
            tooltip.setAttribute('transform', `translate(${x - 80}, ${y - 80})`);
            
            // Update tooltip content with stats
            const cityText = tooltip.querySelector('.tooltip-city');
            const regionText = tooltip.querySelector('.tooltip-region');
            const statsText = tooltip.querySelector('.tooltip-stats');
            
            if (cityText) cityText.textContent = city;
            if (regionText) regionText.textContent = regionName;
            if (statsText) statsText.textContent = `${stats.transports} transports | ${stats.routes} routes`;
            
            // Add pulse effect to marker
          
            this.style.filter = 'drop-shadow(0 0 8px #ff6b35)';
        });

        marker.addEventListener('mouseleave', function() {
            if (tooltip) {
                // --- FIX STEP 2: Use setTimeout to delay hiding ---
                tooltipHideTimer = setTimeout(() => {
                    tooltip.style.display = 'none';
                }, TOOLTIP_HIDE_DELAY);
                // ----------------------------------------------------
            }
            
            this.style.filter = 'none';
        });

        marker.addEventListener('click', function() {
            // Navigate to city page
            const cityUrl = `./pages/city.html?city=${cityName}`;
            window.location.href = cityUrl;
        });
    });

    // --- FIX STEP 3: Add event listeners to the tooltip itself ---
    if (tooltip) {
        tooltip.addEventListener('mouseenter', () => {
            // Clear hide timer if cursor enters the tooltip
            clearTimeout(tooltipHideTimer);
        });

        tooltip.addEventListener('mouseleave', () => {
            // Hide the tooltip after a delay when leaving it
            tooltipHideTimer = setTimeout(() => {
                tooltip.style.display = 'none';
            }, TOOLTIP_HIDE_DELAY);
        });
    }
  // Make regions clickable for filtering
  const regionGroups = indiaMap.querySelectorAll('.region-group');
  regionGroups.forEach(group => {
    group.style.cursor = 'pointer';
  });
  
  // Legend hover effects - highlight corresponding regions on map
  const legendItems = document.querySelectorAll('.legend-item[data-region]');
  legendItems.forEach(item => {
    const region = item.getAttribute('data-region');
    
    item.addEventListener('mouseenter', () => {
      // Highlight corresponding region on map
      const regionGroup = indiaMap.querySelector(`.region-group[data-region="${region}"]`);
      if (regionGroup) {
        const states = regionGroup.querySelectorAll('.state');
        states.forEach(state => {
          state.style.opacity = '1';
          state.style.filter = 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.6))';
        });
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const regionGroup = indiaMap.querySelector(`.region-group[data-region="${region}"]`);
      if (regionGroup) {
        const states = regionGroup.querySelectorAll('.state');
        states.forEach(state => {
          state.style.opacity = '0.7';
          state.style.filter = 'none';
        });
      }
    });
    
    item.addEventListener('click', () => {
      const filterTab = document.querySelector(`.filter-tab[data-filter="${region}"]`);
      if (filterTab) {
        filterTab.click();
        updateActiveFilterBadge(region);
      }
    });
  });
  
  // Mouse wheel zoom
  mapContainer?.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0 && currentZoom < 3) {
      currentZoom += 0.1;
    } else if (e.deltaY > 0 && currentZoom > 0.5) {
      currentZoom -= 0.1;
    }
    updateMapTransform();
  }, { passive: false });
}

// Update active filter badge on map legend
function updateActiveFilterBadge(filter) {
  const badge = document.getElementById('activeFilterBadge');
  const text = document.getElementById('activeFilterText');
  
  if (!badge || !text) return;
  
  const filterNames = {
    'all': 'All Regions',
    'north': 'North India',
    'south': 'South India',
    'east': 'East India',
    'west': 'West India'
  };
  
  if (filter === 'all') {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'inline-flex';
    text.textContent = filterNames[filter] || filter;
    
    // Update badge color based on region
    const colors = {
      'north': '#4a90e2',
      'south': '#e74c3c',
      'east': '#f39c12',
      'west': '#16a085'
    };
    badge.style.background = colors[filter] || '#ff6b35';
  }
}

function initPagination() {
  const regionGrid = document.getElementById('regionGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const currentCountEl = document.getElementById('currentCount');
  const totalCountEl = document.getElementById('totalCount');

  if (!regionGrid || !loadMoreBtn) return;

  const allCards = Array.from(regionGrid.querySelectorAll('.region-card.enhanced'));
  const attrItems = parseInt(regionGrid.getAttribute('data-items-per-page') || '6', 10);
  const itemsPerPage = isNaN(attrItems) ? 6 : attrItems; // 6 cards per page by config
  let currentPage = 1;
  let filteredCards = [...allCards];

  // Add data-index to all cards
  allCards.forEach((card, index) => {
    card.setAttribute('data-index', index);
  });

  // Get total count
  const totalCount = allCards.length;
  if (totalCountEl) {
    totalCountEl.textContent = totalCount;
  }

  // Function to show cards
  function showCards() {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;

    // Get currently filtered cards (not hidden by region-search)
    filteredCards = allCards.filter(card => !card.classList.contains('hidden'));

    // Hide ALL cards first
    allCards.forEach(card => {
      card.classList.remove('visible');
      card.style.display = 'none';
    });

    // Show only paginated subset of filtered cards
    filteredCards.forEach((card, index) => {
      if (index < endIndex) {
        card.classList.add('visible');
        card.style.display = 'flex';
      }
    });

    // Update counter
    const visibleCount = Math.min(endIndex, filteredCards.length);
    if (currentCountEl) {
      currentCountEl.textContent = visibleCount;
    }

    // Hide/show load more button
    if (endIndex >= filteredCards.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
    }

    // Update total count to match filtered results
    if (totalCountEl) {
      totalCountEl.textContent = filteredCards.length;
    }
  }

  // Load more button click
  loadMoreBtn.addEventListener('click', function() {
    // Add loading state
    this.classList.add('loading');
    this.innerHTML = '<i class="fas fa-spinner"></i> Loading...';

    // Simulate loading delay
    setTimeout(() => {
      currentPage++;
      showCards();

      // Remove loading state
      this.classList.remove('loading');
      this.innerHTML = '<i class="fas fa-plus-circle"></i> Load More Cities';

      // Smooth scroll to newly loaded items
      const firstNewCard = filteredCards[Math.min((currentPage - 1) * itemsPerPage, filteredCards.length - 1)];
      if (firstNewCard) {
        setTimeout(() => {
          firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }, 500);
  });

  // Respond to filter/search changes from region-search
  function resetPagination() {
    currentPage = 1;
    showCards();
  }

  document.addEventListener('regionFilterChanged', () => {
    // slight delay to allow DOM/class updates from filtering
    setTimeout(resetPagination, 50);
  });

  // Listen for filter changes
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('regionSearch');

  function resetPagination() {
    currentPage = 1;
    showCards();
  }

  // Watch for filter changes
  if (filterTabs) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        setTimeout(resetPagination, 100);
      });
    });
  }

  // Watch for search changes
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      setTimeout(resetPagination, 300);
    });
  }

  // Initial show
  showCards();

  // Re-initialize on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      showCards();
    }, 250);
  });
}

// Initialize both features
function initRegionFeatures() {
  initRegionMap();
  initPagination();
}

// Initialize on DOM load or when region section is loaded
document.addEventListener('DOMContentLoaded', initRegionFeatures);
document.addEventListener('regionSectionLoaded', initRegionFeatures);
