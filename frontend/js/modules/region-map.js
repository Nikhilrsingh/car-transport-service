// Leaflet India Map with City Markers
let map = null;
let markers = [];
let currentFilter = 'all';

// India bounds for fitting the whole country
const indiaBounds = [
  [6.5, 68.0],   // Southwest corner (bottom-left)
  [35.5, 97.5]   // Northeast corner (top-right)
];

// City data with coordinates
const mapCities = [
  // North India
  { id: 'delhi', name: 'Delhi', lat: 28.6139, lng: 77.2090, region: 'north', major: true, transports: '1000+', price: '₹4,999' },
  { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lng: 75.7873, region: 'north', major: false, transports: '600+', price: '₹4,299' },
  { id: 'lucknow', name: 'Lucknow', lat: 26.8467, lng: 80.9462, region: 'north', major: false, transports: '450+', price: '₹4,799' },
  { id: 'chandigarh', name: 'Chandigarh', lat: 30.7333, lng: 76.7794, region: 'north', major: false, transports: '400+', price: '₹4,499' },
  { id: 'agra', name: 'Agra', lat: 27.1767, lng: 78.0081, region: 'north', major: false, transports: '500+', price: '₹3,999' },
  { id: 'amritsar', name: 'Amritsar', lat: 31.6340, lng: 74.8723, region: 'north', major: false, transports: '300+', price: '₹5,299' },
  { id: 'varanasi', name: 'Varanasi', lat: 25.3176, lng: 82.9739, region: 'north', major: false, transports: '350+', price: '₹5,699' },

  // South India
  { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946, region: 'south', major: true, transports: '900+', price: '₹6,999' },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707, region: 'south', major: true, transports: '800+', price: '₹7,499' },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867, region: 'south', major: true, transports: '850+', price: '₹6,499' },
  { id: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lng: 76.9558, region: 'south', major: false, transports: '400+', price: '₹6,799' },
  { id: 'kochi', name: 'Kochi', lat: 9.9312, lng: 76.2673, region: 'south', major: false, transports: '350+', price: '₹7,299' },
  { id: 'madurai', name: 'Madurai', lat: 9.9252, lng: 78.1198, region: 'south', major: false, transports: '300+', price: '₹7,299' },

  // East India
  { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lng: 88.3639, region: 'east', major: true, transports: '800+', price: '₹5,999' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, region: 'east', major: false, transports: '400+', price: '₹6,799' },
  { id: 'patna', name: 'Patna', lat: 25.5941, lng: 85.1376, region: 'east', major: false, transports: '450+', price: '₹5,799' },
  { id: 'guwahati', name: 'Guwahati', lat: 26.1445, lng: 91.7362, region: 'east', major: false, transports: '250+', price: '₹7,999' },
  { id: 'ranchi', name: 'Ranchi', lat: 23.3441, lng: 85.3096, region: 'east', major: false, transports: '300+', price: '₹6,299' },

  // West India
  { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lng: 72.8777, region: 'west', major: true, transports: '1200+', price: '₹5,499' },
  { id: 'pune', name: 'Pune', lat: 18.5204, lng: 73.8567, region: 'west', major: true, transports: '700+', price: '₹5,299' },
  { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, region: 'west', major: true, transports: '650+', price: '₹5,799' },
  { id: 'surat', name: 'Surat', lat: 21.1702, lng: 72.8311, region: 'west', major: false, transports: '500+', price: '₹5,699' },
  { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lng: 79.0882, region: 'west', major: false, transports: '450+', price: '₹5,999' },
  { id: 'vadodara', name: 'Vadodara', lat: 22.3072, lng: 73.1812, region: 'west', major: false, transports: '380+', price: '₹6,199' },
  { id: 'goa', name: 'Goa', lat: 15.2993, lng: 74.1240, region: 'west', major: false, transports: '300+', price: '₹6,499' }
];

// Region colors
const regionColors = {
  north: '#4a90e2',
  south: '#e74c3c',
  east: '#f39c12',
  west: '#16a085'
};

// Event listener for section loaded
document.addEventListener('regionSectionLoaded', () => {
  console.log('Region section loaded event received, initializing map...');
  initRegionMap();
});

function initRegionMap() {
  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) {
    console.log('Leaflet map container not found yet, will retry...');
    return;
  }

  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded');
    mapContainer.innerHTML = '<p style="text-align: center; padding: 100px 20px; color: #666;">Map loading failed. Please refresh the page.</p>';
    return;
  }

  // Prevent double initialization
  if (map) {
    map.remove();
  }

  try {
    // Initialize Leaflet map centered on India
    map = L.map('leafletMap', {
      center: [22.5, 78.9],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      scrollWheelZoom: true
    });

    // Determine which tiles to use based on theme
    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = isDarkMode
      ? '© OpenStreetMap contributors © CARTO'
      : '© OpenStreetMap contributors';

    // Add appropriate tiles
    L.tileLayer(tileUrl, {
      attribution: attribution,
      maxZoom: 19
    }).addTo(map);

    // Robust size invalidation
    const invalidate = () => {
      if (map) {
        map.invalidateSize();
        // If map bounds are very small or center is 0,0, refit
        const center = map.getCenter();
        if (center.lat === 22.5 && center.lng === 78.9 || Math.abs(center.lat) < 0.1) {
          map.fitBounds(indiaBounds, { padding: [20, 20] });
        }
      }
    };

    // Use ResizeObserver for more reliable size management
    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        if (map) map.invalidateSize();
      }).observe(mapContainer);
    }

    setTimeout(invalidate, 100);
    setTimeout(invalidate, 500);
    setTimeout(invalidate, 1000);
    setTimeout(invalidate, 2000);

    // Add city markers
    addCityMarkers();

    // Initialize custom controls
    initMapControls();

    // Initialize legend interactions
    initLegendInteractions();

    // Handle window resize
    window.addEventListener('resize', () => {
      if (map) map.invalidateSize();
    });

    console.log(`Leaflet map initialized successfully (${isDarkMode ? 'Dark' : 'Light'} mode)`);
  } catch (error) {
    console.error('Error initializing map:', error);
    mapContainer.innerHTML = '<p style="text-align: center; padding: 100px 20px; color: #666;">Map loading failed. Please refresh the page.</p>';
  }
}

// Safety check: if container is already in DOM, init immediately
if (document.getElementById('leafletMap')) {
  console.log('Map container already present, initializing...');
  initRegionMap();
}

function createCustomIcon(city) {
  const color = city.major ? '#ff6b35' : regionColors[city.region];

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="custom-pin ${city.major ? 'major' : city.region}">
        <div class="pin-head" style="background: linear-gradient(135deg, ${color}, ${lightenColor(color, 20)});">
          <i class="fas fa-map-marker-alt"></i>
        </div>
      </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function addCityMarkers() {
  markers = [];

  mapCities.forEach(city => {
    const marker = L.marker([city.lat, city.lng], {
      icon: createCustomIcon(city)
    });

    const popupContent = `
      <div class="city-popup">
        <h4>${city.name}</h4>
        <span class="region-badge ${city.region}">${city.region.charAt(0).toUpperCase() + city.region.slice(1)} India</span>
        <p style="margin: 8px 0; font-size: 0.85rem; color: #666;">
          <i class="fas fa-truck-moving"></i> ${city.transports} transports<br>
          <strong>From ${city.price}</strong>
        </p>
        <a href="./pages/city.html?city=${city.id}" class="view-city-btn">
          View Details <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 200,
      className: 'city-popup-wrapper'
    });

    marker.cityData = city;
    markers.push(marker);
    marker.addTo(map);
  });
}

function filterMarkers(region) {
  currentFilter = region;

  markers.forEach(marker => {
    const city = marker.cityData;

    if (region === 'all' || city.region === region) {
      marker.addTo(map);
      marker.setOpacity(1);
    } else {
      marker.setOpacity(0.3);
    }
  });

  // Update legend active state
  document.querySelectorAll('.legend-item[data-region]').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.region === region) {
      item.classList.add('active');
    }
  });
}

function initMapControls() {
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const resetMapBtn = document.getElementById('resetMapBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      map.zoomIn();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      map.zoomOut();
    });
  }

  if (resetMapBtn) {
    resetMapBtn.addEventListener('click', () => {
      // Fit entire India in view
      map.fitBounds(indiaBounds, { padding: [20, 20] });
      filterMarkers('all');
      resetMarkerStyles();
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const mapLayoutContainer = document.querySelector('.map-layout-container');

      if (!document.fullscreenElement) {
        mapLayoutContainer.requestFullscreen().then(() => {
          fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          fullscreenBtn.title = "Exit Fullscreen";
          // Invalidate map size after fullscreen
          setTimeout(() => map.invalidateSize(), 100);
        }).catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen().then(() => {
          fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          fullscreenBtn.title = "Fullscreen";
          setTimeout(() => map.invalidateSize(), 100);
        });
      }
    });
  }

  // Handle fullscreen change
  document.addEventListener('fullscreenchange', () => {
    setTimeout(() => map.invalidateSize(), 100);
  });
}

function initLegendInteractions() {
  const legendItems = document.querySelectorAll('.legend-item[data-region]');

  legendItems.forEach(item => {
    // Hover effect - make pins pop out
    item.addEventListener('mouseenter', () => {
      const region = item.dataset.region;
      highlightRegionMarkers(region);
    });

    // Mouse leave - reset pins
    item.addEventListener('mouseleave', () => {
      if (currentFilter === 'all') {
        resetMarkerStyles();
      } else {
        // Keep the filtered state
        highlightRegionMarkers(currentFilter);
      }
    });

    // Click to filter
    item.addEventListener('click', () => {
      const region = item.dataset.region;

      // Toggle filter
      if (currentFilter === region) {
        filterMarkers('all');
        resetMarkerStyles();
        // Reset view to show all India
        map.fitBounds(indiaBounds, { padding: [20, 20] });
      } else {
        filterMarkers(region);
        highlightRegionMarkers(region);

        // Zoom to region
        const regionCities = mapCities.filter(c => c.region === region);
        if (regionCities.length > 0) {
          const bounds = L.latLngBounds(regionCities.map(c => [c.lat, c.lng]));
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    });
  });
}

// Highlight markers for a specific region (make them pop out)
function highlightRegionMarkers(region) {
  markers.forEach(marker => {
    const city = marker.cityData;
    const markerElement = marker.getElement();

    if (markerElement) {
      const pinElement = markerElement.querySelector('.custom-pin');

      if (city.region === region) {
        // Make this region's pins pop out
        marker.setZIndexOffset(1000);
        if (pinElement) {
          pinElement.classList.add('highlighted');
        }
      } else {
        // Dim other pins
        marker.setZIndexOffset(0);
        if (pinElement) {
          pinElement.classList.remove('highlighted');
          pinElement.classList.add('dimmed');
        }
      }
    }
  });
}

// Reset all marker styles
function resetMarkerStyles() {
  markers.forEach(marker => {
    const markerElement = marker.getElement();
    marker.setZIndexOffset(0);

    if (markerElement) {
      const pinElement = markerElement.querySelector('.custom-pin');
      if (pinElement) {
        pinElement.classList.remove('highlighted', 'dimmed');
      }
    }
  });
}

// Initialize when region section is loaded (it's loaded dynamically)
document.addEventListener('regionSectionLoaded', initRegionMap);

// Also try on DOMContentLoaded in case the element already exists
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure element is ready
  setTimeout(() => {
    if (document.getElementById('leafletMap') && !map) {
      initRegionMap();
    }
  }, 500);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initRegionMap };
}
