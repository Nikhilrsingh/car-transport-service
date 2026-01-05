// Interactive India Map with Pin Functionality
function initRegionMap() {
  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer) return;

  // Initialize city pins functionality
  initCityPins();
  
  // Initialize connection lines
  initConnectionLines();
  
  // Map controls functionality
  initMapControls();
  
  // Update active filter badge
  updateActiveFilterBadge('all');
  
  // Handle window resize to recalculate connection lines
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initConnectionLines(); // Recalculate connection lines on resize
    }, 250);
  });
}

// Initialize city pins with hover and click functionality
function initCityPins() {
  const cityPins = document.querySelectorAll('.pin-marker');
  
  cityPins.forEach(pin => {
    const cityId = pin.getAttribute('data-city');
    const cityData = getCityData(cityId);
    
    if (!cityData) return;
    
    // Find the tooltip
    const pinContainer = pin.parentElement;
    const tooltip = pinContainer.querySelector('.pin-tooltip');
    
    // Show tooltip on hover
    pin.addEventListener('mouseenter', function(e) {
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
      }
      
      // Add glow effect
      this.style.filter = 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.8))';
    });
    
    // Hide tooltip on mouse leave
    pin.addEventListener('mouseleave', function() {
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateX(-50%)';
      }
      
      // Remove glow effect
      this.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))';
    });
    
    // Click to navigate to city page
    pin.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Add click animation
      this.style.transform = 'translateY(-10px) scale(1.3)';
      setTimeout(() => {
        this.style.transform = 'translateY(-10px) scale(1.2)';
      }, 200);
      
      // Navigate after delay
      setTimeout(() => {
        window.location.href = cityData.link;
      }, 300);
    });
  });
  
  // Legend hover effects
  const legendItems = document.querySelectorAll('.legend-item[data-region]');
  legendItems.forEach(item => {
    const region = item.getAttribute('data-region');
    
    item.addEventListener('mouseenter', () => {
      highlightRegionPins(region);
    });
    
    item.addEventListener('mouseleave', () => {
      resetPins();
    });
    
    item.addEventListener('click', () => {
      const filterTab = document.querySelector(`.filter-tab[data-filter="${region}"]`);
      if (filterTab) {
        filterTab.click();
        updateActiveFilterBadge(region);
      }
    });
  });
}

// Initialize animated connection lines between major cities
function initConnectionLines() {
  // Connection lines disabled to prevent visual clutter
  // Uncomment the code below if you want to re-enable them
  
  /*
  const connectionsOverlay = document.getElementById('connectionsOverlay');
  if (!connectionsOverlay) return;

  // Clear any existing connection lines
  connectionsOverlay.innerHTML = '';

  // Major routes between cities
  const connections = [
    { from: 'delhi', to: 'mumbai' },
    { from: 'delhi', to: 'bangalore' },
    { from: 'delhi', to: 'kolkata' },
    { from: 'mumbai', to: 'bangalore' },
    { from: 'mumbai', to: 'chennai' },
    { from: 'bangalore', to: 'chennai' },
    { from: 'kolkata', to: 'chennai' },
    { from: 'hyderabad', to: 'bangalore' },
    { from: 'hyderabad', to: 'mumbai' }
  ];

  // Wait for map to be fully loaded before calculating positions
  setTimeout(() => {
    connections.forEach(conn => {
      const fromPin = document.querySelector(`.city-pin[data-city="${conn.from}"]`);
      const toPin = document.querySelector(`.city-pin[data-city="${conn.to}"]`);
      
      if (fromPin && toPin) {
        const mapContainer = document.getElementById('indiaMap');
        if (!mapContainer) return;
        
        const mapRect = mapContainer.getBoundingClientRect();
        const fromRect = fromPin.getBoundingClientRect();
        const toRect = toPin.getBoundingClientRect();
        
        // Calculate positions relative to map container
        const x1 = fromRect.left - mapRect.left + fromRect.width / 2;
        const y1 = fromRect.top - mapRect.top + fromRect.height / 2;
        const x2 = toRect.left - mapRect.left + toRect.width / 2;
        const y2 = toRect.top - mapRect.top + toRect.height / 2;
        
        // Ensure positions are within bounds
        if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0) return;
        
        // Create connection line
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        // Calculate length and angle
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        // Set line properties with bounds checking
        line.style.width = `${Math.max(0, length)}px`;
        line.style.left = `${Math.max(0, x1)}px`;
        line.style.top = `${Math.max(0, y1)}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        // Random delay for animation
        line.style.animationDelay = `${Math.random() * 2}s`;
        
        connectionsOverlay.appendChild(line);
      }
    });
  }, 500); // Delay to ensure proper positioning
  */
}

// Helper function to get city data
function getCityData(cityId) {
  const cityDataMap = {
    delhi: { 
      name: "Delhi", 
      region: "north", 
      color: "#4a90e2", 
      transports: "1200+", 
      routes: "150+", 
      link: "./pages/city.html?city=delhi" 
    },
    mumbai: { 
      name: "Mumbai", 
      region: "west", 
      color: "#16a085", 
      transports: "1500+", 
      routes: "200+", 
      link: "./pages/city.html?city=mumbai" 
    },
    bangalore: { 
      name: "Bangalore", 
      region: "south", 
      color: "#e74c3c", 
      transports: "1100+", 
      routes: "140+", 
      link: "./pages/city.html?city=bangalore" 
    },
    kolkata: { 
      name: "Kolkata", 
      region: "east", 
      color: "#f39c12", 
      transports: "900+", 
      routes: "120+", 
      link: "./pages/city.html?city=kolkata" 
    },
    chennai: { 
      name: "Chennai", 
      region: "south", 
      color: "#e74c3c", 
      transports: "1000+", 
      routes: "130+", 
      link: "./pages/city.html?city=chennai" 
    },
    hyderabad: { 
      name: "Hyderabad", 
      region: "south", 
      color: "#e74c3c", 
      transports: "950+", 
      routes: "110+", 
      link: "./pages/city.html?city=hyderabad" 
    },
    pune: { 
      name: "Pune", 
      region: "west", 
      color: "#16a085", 
      transports: "600+", 
      routes: "80+", 
      link: "./pages/city.html?city=pune" 
    },
    ahmedabad: { 
      name: "Ahmedabad", 
      region: "west", 
      color: "#16a085", 
      transports: "700+", 
      routes: "90+", 
      link: "./pages/city.html?city=ahmedabad" 
    },
    jaipur: { 
      name: "Jaipur", 
      region: "north", 
      color: "#4a90e2", 
      transports: "600+", 
      routes: "70+", 
      link: "./pages/city.html?city=jaipur" 
    },
    lucknow: { 
      name: "Lucknow", 
      region: "north", 
      color: "#4a90e2", 
      transports: "450+", 
      routes: "60+", 
      link: "./pages/city.html?city=lucknow" 
    }
  };
  
  return cityDataMap[cityId];
}

// Highlight pins from a specific region
function highlightRegionPins(region) {
  const cityPins = document.querySelectorAll('.pin-marker');
  cityPins.forEach(pin => {
    const cityId = pin.getAttribute('data-city');
    const cityData = getCityData(cityId);
    
    if (cityData && cityData.region === region) {
      pin.style.transform = 'translateY(-10px) scale(1.3)';
      pin.style.filter = 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.8))';
    } else {
      pin.style.opacity = '0.3';
      pin.style.filter = 'none';
    }
  });
}

// Reset all pins to normal state
function resetPins() {
  const cityPins = document.querySelectorAll('.pin-marker');
  cityPins.forEach(pin => {
    pin.style.transform = 'translateY(0) scale(1)';
    pin.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))';
    pin.style.opacity = '1';
  });
}

// Initialize map controls
function initMapControls() {
  const indiaMap = document.getElementById('indiaMap');
  const indiaMapImage = document.getElementById('indiaMapImage');
  
  if (!indiaMap || !indiaMapImage) return;

  // Zoom and Pan Controls
  let currentZoom = 1;
  let currentX = 0;
  let currentY = 0;

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
      const mapLayoutContainer = document.querySelector('.map-layout-container');
      if (!document.fullscreenElement) {
        mapLayoutContainer.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        fullscreenBtn.title = "Exit Fullscreen";
      } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenBtn.title = "Fullscreen";
      }
    });
  }
  
  function updateMapTransform() {
    if (indiaMap) {
      indiaMap.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentZoom})`;
      indiaMap.style.transition = 'transform 0.3s ease';
      
      // Scale the city pins as well
      const cityPins = document.querySelectorAll('.city-pin');
      cityPins.forEach(pin => {
        pin.style.transform = `translate(-50%, -100%) scale(${1/currentZoom})`;
      });
    }
  }
  
  // Pan with mouse drag
  let isDragging = false;
  let startX, startY;
  
  indiaMap.addEventListener('mousedown', (e) => {
    if (currentZoom > 1) {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      indiaMap.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      updateMapTransform();
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    indiaMap.style.cursor = 'grab';
  });
  
  indiaMap.addEventListener('mouseleave', () => {
    isDragging = false;
    indiaMap.style.cursor = 'default';
  });

  // Mouse wheel zoom
  indiaMap.addEventListener('wheel', (e) => {
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initRegionMap);
document.addEventListener('regionSectionLoaded', initRegionMap);