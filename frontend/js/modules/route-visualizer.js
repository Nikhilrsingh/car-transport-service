/* ====================================
   ROUTE & DISTANCE VISUALIZER MODULE
   ==================================== */

(function () {
  'use strict';

  // Indian Cities GPS Coordinates Database (matches quote-modal.js)
  const cityCoordinates = {
    'Mumbai': [19.0760, 72.8777],
    'Delhi': [28.7041, 77.1025],
    'Bangalore': [12.9716, 77.5946],
    'Hyderabad': [17.3850, 78.4867],
    'Ahmedabad': [23.0225, 72.5714],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639],
    'Pune': [18.5204, 73.8567],
    'Jaipur': [26.9124, 75.7873],
    'Surat': [21.1702, 72.8311],
    'Lucknow': [26.8467, 80.9462],
    'Kanpur': [26.4499, 80.3319],
    'Nagpur': [21.1458, 79.0882],
    'Indore': [22.7196, 75.8577],
    'Thane': [19.2183, 72.9781],
    'Bhopal': [23.2599, 77.4126],
    'Visakhapatnam': [17.6868, 83.2185],
    'Patna': [25.5941, 85.1376],
    'Vadodara': [22.3072, 73.1812],
    'Ghaziabad': [28.6692, 77.4538],
    'Ludhiana': [30.9010, 75.8573],
    'Agra': [27.1767, 78.0081],
    'Nashik': [19.9975, 73.7898],
    'Meerut': [28.9845, 77.7064],
    'Rajkot': [22.3039, 70.8022],
    'Varanasi': [25.3176, 82.9739],
    'Srinagar': [34.0837, 74.7973],
    'Amritsar': [31.6340, 74.8723],
    'Coimbatore': [11.0168, 76.9558],
    'Jodhpur': [26.2389, 73.0243],
    'Madurai': [9.9252, 78.1198],
    'Chandigarh': [30.7333, 76.7794],
    'Guwahati': [26.1445, 91.7362],
    'Mysore': [12.2958, 76.6394],
    'Gurgaon': [28.4595, 77.0266],
    'Bhubaneswar': [20.2961, 85.8245],
    'Kochi': [9.9312, 76.2673],
    'Dehradun': [30.3165, 78.0322],
    'Mangalore': [12.9141, 74.8560],
    'Goa': [15.2993, 74.1240],
    'Panaji': [15.4909, 73.8278],
    'Vijayawada': [16.5062, 80.6480],
    'Pimpri-Chinchwad': [18.6212, 73.8027],
    'Faridabad': [28.4089, 77.3178],
    'Kalyan-Dombivali': [19.2403, 73.1305],
    'Vasai-Virar': [19.4558, 72.8110],
    'Aurangabad': [19.8762, 75.3433],
    'Dhanbad': [23.7957, 86.4304],
    'Navi Mumbai': [19.0330, 73.0299],
    'Allahabad': [25.4444, 81.8432],
    'Ranchi': [23.3441, 85.3095],
    'Howrah': [22.5958, 88.2639],
    'Jabalpur': [23.1815, 79.9864],
    'Gwalior': [26.2163, 78.1772],
    'Raipur': [21.2514, 81.6296],
    'Kota': [25.2138, 75.8648],
    'Solapur': [17.6599, 75.9063],
    'Hubli-Dharwad': [15.3647, 75.1249],
    'Tiruchirappalli': [10.7905, 78.7045],
    'Bareilly': [28.3274, 79.4319],
    'Moradabad': [28.8441, 78.7768],
    'Mysuru': [12.2958, 76.6394],
    'Aligarh': [27.8815, 78.0794],
    'Jalandhar': [31.3260, 75.5763],
    'Salem': [11.6643, 78.1460],
    'Mira-Bhayandar': [19.2819, 72.8677],
    'Warangal': [17.9784, 79.5941],
    'Guntur': [16.2992, 80.4573],
    'Bhiwandi': [19.3002, 73.0647],
    'Saharanpur': [29.9670, 77.5512],
    'Gorakhpur': [26.8467, 83.3705],
    'Bikaner': [28.0229, 73.3119],
    'Amravati': [20.9335, 77.7750],
    'Noida': [28.5355, 77.2100],
    'Jamshedpur': [22.8268, 86.2031],
    'Bhilai': [20.8972, 81.3390],
    'Cuttack': [20.4625, 85.8831],
    'Firozabad': [27.1492, 78.2832],
    'Nellore': [14.4426, 79.9865],
    'Bhavnagar': [21.7645, 72.1519],
    'Durgapur': [23.5204, 87.3119],
    'Asansol': [23.6738, 86.9524]
  };

  let map = null;
  let tileLayer = null;
  let pickupMarker = null;
  let dropMarker = null;
  let routePolyline = null;
  let transitMarker = null;
  let animationFrameId = null;

  /**
   * Initialize Leaflet Map Instance
   * @param {string} theme - 'dark' or 'light'
   */
  function initMap(theme) {
    const mapContainer = document.getElementById('route-map');
    if (!mapContainer || typeof L === 'undefined') return;

    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    map = L.map('route-map', {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5
    }).setView([20.5937, 78.9629], 4.5); // Centers on India

    tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    console.log("🗺️ Route Map Initialized with", theme, "theme");
  }

  /**
   * Update map tiles based on current theme selection
   * @param {string} theme - 'dark' or 'light'
   */
  function updateMapTheme(theme) {
    if (!map || !tileLayer) return;

    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayer.setUrl(tileUrl);
  }

  /**
   * Smoothly animates a truck icon along the polyline path
   */
  function animateVehicle(startCoords, endCoords) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (transitMarker) {
      transitMarker.remove();
    }

    // Create transit truck marker using DivIcon for custom styling and scalability
    const transitIcon = L.divIcon({
      className: 'custom-transit-div-icon',
      html: '<div class="animated-transit-marker"><i class="fas fa-truck"></i></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    transitMarker = L.marker(startCoords, { icon: transitIcon }).addTo(map);

    let startTime = null;
    const duration = 6000; // 6 seconds for transit progression

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      let progress = (timestamp - startTime) / duration;

      if (progress > 1) {
        startTime = timestamp; // Reset start time to loop animation
        progress = 0;
      }

      // Linear interpolation (lerp) for smooth lat/lng slide
      const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
      const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;

      if (transitMarker && map.hasLayer(transitMarker)) {
        transitMarker.setLatLng([lat, lng]);
      }

      animationFrameId = requestAnimationFrame(step);
    }

    animationFrameId = requestAnimationFrame(step);
  }

  /**
   * Destroys existing map elements and resets state to prevent memory leaks
   */
  function clearMapLayers() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (pickupMarker) {
      pickupMarker.remove();
      pickupMarker = null;
    }
    if (dropMarker) {
      dropMarker.remove();
      dropMarker = null;
    }
    if (routePolyline) {
      routePolyline.remove();
      routePolyline = null;
    }
    if (transitMarker) {
      transitMarker.remove();
      transitMarker = null;
    }
  }

  /**
   * Updates display and renders route path/markers
   */
  function updateVisualizer(fromCity, toCity, distance) {
    const container = document.getElementById('routeVisualizerContainer');
    if (!container) return;

    // Reset when selections are empty or invalid
    if (!fromCity || !toCity || distance <= 0) {
      container.classList.remove('active');
      setTimeout(() => {
        if (!container.classList.contains('active')) {
          container.style.display = 'none';
        }
      }, 500);
      clearMapLayers();
      return;
    }

    const fromCoords = cityCoordinates[fromCity];
    const toCoords = cityCoordinates[toCity];

    // Hide map if coords are missing for either city
    if (!fromCoords || !toCoords) {
      container.classList.remove('active');
      container.style.display = 'none';
      clearMapLayers();
      return;
    }

    // Make container visible
    container.style.display = 'block';
    // Trigger reflow for CSS transitions
    container.offsetHeight;
    container.classList.add('active');

    const theme = document.body.getAttribute('data-theme') || 'light';
    if (!map) {
      initMap(theme);
    } else {
      updateMapTheme(theme);
    }

    // Re-adjust map sizing constraints after display changes
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
        if (fromCoords && toCoords) {
          const bounds = L.latLngBounds([fromCoords, toCoords]);
          map.fitBounds(bounds, {
            padding: [45, 45],
            maxZoom: 7,
            animate: true,
            duration: 0.8
          });
        }
      }
    }, 550); // Fires after the 0.5s transition completes to ensure accurate dimensions

    clearMapLayers();

    // Center map view on coordinates with padding bounds
    if (map) {
      const bounds = L.latLngBounds([fromCoords, toCoords]);
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 7,
        animate: false
      });

      // Render custom pins
      const pickupIcon = L.divIcon({
        className: 'custom-pickup-div-icon',
        html: '<div class="custom-pin-marker" title="Pickup: ' + fromCity + '"><div class="pin-ring pickup-pin"><div class="pin-center"></div></div></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const dropIcon = L.divIcon({
        className: 'custom-drop-div-icon',
        html: '<div class="custom-pin-marker" title="Destination: ' + toCity + '"><div class="pin-ring drop-pin"><div class="pin-center"></div></div></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      pickupMarker = L.marker(fromCoords, { icon: pickupIcon }).addTo(map)
        .bindTooltip(`<b>Pickup:</b> ${fromCity}`, { direction: 'top', className: 'route-tooltip', offset: [0, -5] });

      dropMarker = L.marker(toCoords, { icon: dropIcon }).addTo(map)
        .bindTooltip(`<b>Destination:</b> ${toCity}`, { direction: 'top', className: 'route-tooltip', offset: [0, -5] });

      // Render polyline connecting points
      routePolyline = L.polyline([fromCoords, toCoords], {
        color: '#ff6b35',
        weight: 3,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Start live cargo transit animation along path
      animateVehicle(fromCoords, toCoords);
    }

    // Update details card info
    const distEl = document.getElementById('routeDistanceVal');
    const durEl = document.getElementById('routeDurationVal');

    if (distEl) {
      distEl.textContent = `${distance} km`;
    }

    if (durEl) {
      const minTravelDays = Math.ceil(distance / 300);
      const maxTravelDays = Math.ceil(distance / 200);
      const minTotalDays = minTravelDays + 1;
      const maxTotalDays = maxTravelDays + 2;
      durEl.textContent = `${minTotalDays}–${maxTotalDays} Days`;
    }
  }

  // Hook into custom events sent by the Quick Quote module
  document.addEventListener('routeDetailsUpdated', (e) => {
    if (e.detail) {
      const { from, to, distance } = e.detail;
      updateVisualizer(from, to, distance);
    }
  });

  // Track page theme toggle clicks and swap map skin on-the-fly
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle, #mobile-theme-toggle');
    if (themeBtn) {
      setTimeout(() => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        updateMapTheme(currentTheme);
      }, 100);
    }
  });

  console.log("🚀 Route & Distance Visualizer Module loaded!");
})();
