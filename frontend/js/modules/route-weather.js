/* ============================================
   ROUTE WEATHER CHECK MODULE
   Uses Open-Meteo API (free, no key required)
   ============================================ */

(function () {
  'use strict';

  // ---- Configuration ----
  const CACHE_DURATION = 1800000; // 30 minutes
  const API_BASE = 'https://api.open-meteo.com/v1/forecast';

  // ---- Indian Cities with Coordinates ----
  const cityCoords = {
    'Mumbai': { lat: 19.076, lon: 72.878 },
    'Delhi': { lat: 28.644, lon: 77.216 },
    'Bangalore': { lat: 12.972, lon: 77.595 },
    'Hyderabad': { lat: 17.385, lon: 78.487 },
    'Ahmedabad': { lat: 23.023, lon: 72.571 },
    'Chennai': { lat: 13.083, lon: 80.271 },
    'Kolkata': { lat: 22.573, lon: 88.364 },
    'Pune': { lat: 18.520, lon: 73.857 },
    'Jaipur': { lat: 26.912, lon: 75.787 },
    'Surat': { lat: 21.170, lon: 72.831 },
    'Lucknow': { lat: 26.847, lon: 80.947 },
    'Kanpur': { lat: 26.450, lon: 80.350 },
    'Nagpur': { lat: 21.146, lon: 79.089 },
    'Indore': { lat: 22.720, lon: 75.858 },
    'Thane': { lat: 19.218, lon: 72.978 },
    'Bhopal': { lat: 23.260, lon: 77.413 },
    'Visakhapatnam': { lat: 17.687, lon: 83.218 },
    'Patna': { lat: 25.612, lon: 85.145 },
    'Vadodara': { lat: 22.310, lon: 73.192 },
    'Ghaziabad': { lat: 28.669, lon: 77.438 },
    'Ludhiana': { lat: 30.901, lon: 75.857 },
    'Agra': { lat: 27.177, lon: 78.015 },
    'Nashik': { lat: 19.998, lon: 73.791 },
    'Varanasi': { lat: 25.318, lon: 82.988 },
    'Aurangabad': { lat: 19.876, lon: 75.343 },
    'Amritsar': { lat: 31.634, lon: 74.872 },
    'Ranchi': { lat: 23.344, lon: 85.310 },
    'Coimbatore': { lat: 11.017, lon: 76.956 },
    'Jabalpur': { lat: 23.182, lon: 79.956 },
    'Gwalior': { lat: 26.218, lon: 78.182 },
    'Vijayawada': { lat: 16.506, lon: 80.648 },
    'Jodhpur': { lat: 26.239, lon: 73.024 },
    'Madurai': { lat: 9.925, lon: 78.120 },
    'Raipur': { lat: 21.251, lon: 81.629 },
    'Kota': { lat: 25.180, lon: 75.839 },
    'Chandigarh': { lat: 30.734, lon: 76.779 },
    'Guwahati': { lat: 26.144, lon: 91.736 },
    'Mysore': { lat: 12.296, lon: 76.639 },
    'Noida': { lat: 28.535, lon: 77.391 },
    'Gurgaon': { lat: 28.457, lon: 77.027 },
    'Dehradun': { lat: 30.317, lon: 78.032 },
    'Bhubaneswar': { lat: 20.297, lon: 85.825 },
    'Kochi': { lat: 9.932, lon: 76.267 },
    'Jamshedpur': { lat: 22.805, lon: 86.203 },
    'Allahabad': { lat: 25.431, lon: 81.846 },
    'Meerut': { lat: 28.984, lon: 77.706 },
    'Belgaum': { lat: 15.849, lon: 74.498 },
    'Sangli': { lat: 16.854, lon: 74.564 },
    'Satara': { lat: 17.688, lon: 74.001 },
    'Kurnool': { lat: 15.828, lon: 78.037 },
    'Nandyal': { lat: 15.478, lon: 78.484 },
    'Tandur': { lat: 17.259, lon: 77.582 },
    'Kolar': { lat: 13.137, lon: 78.135 },
    'Gulbarga': { lat: 17.329, lon: 76.834 },
    'Raichur': { lat: 16.212, lon: 77.355 }
  };

  const cityNames = Object.keys(cityCoords);

  // ---- Route Mapping ----
  const routeMapping = {
    'Mumbai-Delhi': ['Surat', 'Vadodara', 'Indore', 'Bhopal', 'Gwalior'],
    'Mumbai-Bangalore': ['Pune', 'Aurangabad', 'Gulbarga', 'Raichur'],
    'Bangalore-Hyderabad': ['Tandur', 'Kurnool', 'Nandyal'],
    'Bangalore-Chennai': ['Kolar'],
    'Chennai-Pune': ['Belgaum', 'Sangli', 'Satara'],
    'Kolkata-Delhi': ['Patna', 'Varanasi', 'Lucknow', 'Kanpur', 'Agra'],
    'Delhi-Mumbai': ['Agra', 'Gwalior', 'Bhopal', 'Indore', 'Vadodara', 'Surat'],
    'Hyderabad-Mumbai': ['Aurangabad', 'Nashik'],
    'Chennai-Delhi': ['Hyderabad', 'Nagpur', 'Bhopal', 'Gwalior', 'Agra']
  };

  // ---- WMO Weather Code Mapping ----
  // https://open-meteo.com/en/docs
  const wmoCodeMap = {
    0: { condition: 'Clear', icon: 'fas fa-sun', group: 'clear' },
    1: { condition: 'Mostly Clear', icon: 'fas fa-sun', group: 'clear' },
    2: { condition: 'Partly Cloudy', icon: 'fas fa-cloud-sun', group: 'clouds' },
    3: { condition: 'Overcast', icon: 'fas fa-cloud', group: 'clouds' },
    45: { condition: 'Foggy', icon: 'fas fa-smog', group: 'fog' },
    48: { condition: 'Icy Fog', icon: 'fas fa-smog', group: 'fog' },
    51: { condition: 'Light Drizzle', icon: 'fas fa-cloud-rain', group: 'drizzle' },
    53: { condition: 'Drizzle', icon: 'fas fa-cloud-rain', group: 'drizzle' },
    55: { condition: 'Heavy Drizzle', icon: 'fas fa-cloud-rain', group: 'drizzle' },
    61: { condition: 'Light Rain', icon: 'fas fa-cloud-rain', group: 'rain' },
    63: { condition: 'Rain', icon: 'fas fa-cloud-showers-heavy', group: 'rain' },
    65: { condition: 'Heavy Rain', icon: 'fas fa-cloud-showers-heavy', group: 'rain' },
    71: { condition: 'Light Snow', icon: 'fas fa-snowflake', group: 'snow' },
    73: { condition: 'Snow', icon: 'fas fa-snowflake', group: 'snow' },
    75: { condition: 'Heavy Snow', icon: 'fas fa-snowflake', group: 'snow' },
    80: { condition: 'Rain Showers', icon: 'fas fa-cloud-rain', group: 'rain' },
    81: { condition: 'Mod. Showers', icon: 'fas fa-cloud-showers-heavy', group: 'rain' },
    82: { condition: 'Heavy Showers', icon: 'fas fa-cloud-showers-heavy', group: 'rain' },
    95: { condition: 'Thunderstorm', icon: 'fas fa-bolt', group: 'thunderstorm' },
    96: { condition: 'T-Storm + Hail', icon: 'fas fa-bolt', group: 'thunderstorm' },
    99: { condition: 'T-Storm + Hail', icon: 'fas fa-bolt', group: 'thunderstorm' }
  };

  // Delay estimation (hours)
  const delayEstimate = {
    clear: 0, clouds: 0, drizzle: 1, rain: 2,
    fog: 3, mist: 2, snow: 5, thunderstorm: 4
  };

  // ---- DOM ----
  let els = {};

  // ---- Init ----
  function init() {
    els = {
      pickupInput: document.getElementById('pickupCity'),
      deliveryInput: document.getElementById('deliveryCity'),
      checkBtn: document.getElementById('checkWeatherBtn'),
      pickupSugg: document.getElementById('pickupSuggestions'),
      deliverySugg: document.getElementById('deliverySuggestions'),
      inputCard: document.getElementById('inputCard'),
      loadingState: document.getElementById('loadingState'),
      errorState: document.getElementById('errorState'),
      errorMsg: document.getElementById('errorMessage'),
      results: document.getElementById('weatherResults'),
      cardsGrid: document.getElementById('weatherCardsGrid'),
      delayWarning: document.getElementById('delayWarning'),
      routeLabel: document.getElementById('routeLabel'),
      monsoonAlert: document.getElementById('monsoonAlert'),
      retryBtn: document.getElementById('retryBtn'),
      newRouteBtn: document.getElementById('newRouteBtn')
    };

    if (!els.pickupInput) return; // safety check

    bindEvents();
    checkMonsoon();
  }

  function bindEvents() {
    els.pickupInput.addEventListener('input', (e) => showSuggestions(e.target.value, els.pickupSugg, 'pickup'));
    els.deliveryInput.addEventListener('input', (e) => showSuggestions(e.target.value, els.deliverySugg, 'delivery'));
    els.checkBtn.addEventListener('click', handleCheck);
    els.retryBtn.addEventListener('click', resetUI);
    els.newRouteBtn.addEventListener('click', resetUI);

    // Enter key triggers check
    els.pickupInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') els.deliveryInput.focus(); });
    els.deliveryInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleCheck(); });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.form-group')) {
        els.pickupSugg.classList.remove('show');
        els.deliverySugg.classList.remove('show');
      }
    });

    // Popular route chips
    document.querySelectorAll('.route-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        els.pickupInput.value = chip.dataset.pickup;
        els.deliveryInput.value = chip.dataset.delivery;
        handleCheck();
      });
    });

    // Famous route buttons
    document.querySelectorAll('.famous-route-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        els.pickupInput.value = btn.dataset.pickup;
        els.deliveryInput.value = btn.dataset.delivery;
        handleCheck();
      });
    });
  }

  // ---- Suggestions ----
  function showSuggestions(value, container, type) {
    const q = value.trim().toLowerCase();
    if (q.length < 1) { container.classList.remove('show'); return; }

    const matches = cityNames.filter(c => c.toLowerCase().startsWith(q)).slice(0, 8);
    if (!matches.length) { container.classList.remove('show'); return; }

    container.innerHTML = matches.map(city =>
      `<div class="city-suggestion-item" data-city="${city}" data-type="${type}">${city}</div>`
    ).join('');

    container.classList.add('show');

    container.querySelectorAll('.city-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const inputEl = type === 'pickup' ? els.pickupInput : els.deliveryInput;
        inputEl.value = item.dataset.city;
        container.classList.remove('show');
      });
    });
  }

  // ---- Route logic ----
  function getRouteCities(pickup, delivery) {
    const key = `${pickup}-${delivery}`;
    const rev = `${delivery}-${pickup}`;

    if (routeMapping[key]) {
      return [pickup, ...routeMapping[key].slice(0, 3), delivery];
    } else if (routeMapping[rev]) {
      return [pickup, ...routeMapping[rev].reverse().slice(0, 3), delivery];
    }
    return [pickup, delivery];
  }

  // ---- Check handler ----
  async function handleCheck() {
    const pickup = els.pickupInput.value.trim();
    const delivery = els.deliveryInput.value.trim();

    if (!pickup || !delivery) {
      showError('Please enter both pickup and delivery cities.'); return;
    }
    if (pickup.toLowerCase() === delivery.toLowerCase()) {
      showError('Pickup and delivery cities must be different.'); return;
    }

    // Validate cities have coordinates
    if (!cityCoords[pickup]) {
      showError(`"${pickup}" is not in our city database. Please pick from suggestions.`); return;
    }
    if (!cityCoords[delivery]) {
      showError(`"${delivery}" is not in our city database. Please pick from suggestions.`); return;
    }

    setView('loading');
    try {
      const routeCities = getRouteCities(pickup, delivery);
      const weatherData = await fetchWeatherForCities(routeCities);
      renderResults(weatherData, pickup, delivery);
    } catch (err) {
      console.error('Weather fetch error:', err);
      showError('Unable to fetch weather data. Please check your connection and try again.');
    }
  }

  // ---- Fetch weather (Open-Meteo — FREE, no API key) ----
  async function fetchWeatherForCities(cities) {
    const results = [];

    for (const city of cities) {
      const coords = cityCoords[city];
      if (!coords) continue;

      // Check cache
      const cached = getCache(city);
      if (cached) { results.push(cached); continue; }

      try {
        const url = `${API_BASE}?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=relative_humidity_2m&timezone=Asia/Kolkata&forecast_days=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const cw = data.current_weather;
        const code = cw.weathercode;
        const wmo = wmoCodeMap[code] || { condition: 'Unknown', icon: 'fas fa-question', group: 'clear' };

        // Get current hour's humidity
        const currentHour = new Date().getHours();
        const humidity = data.hourly && data.hourly.relative_humidity_2m
          ? data.hourly.relative_humidity_2m[currentHour] || '--'
          : '--';

        const weather = {
          city,
          temp: Math.round(cw.temperature),
          windSpeed: Math.round(cw.windspeed),
          condition: wmo.condition,
          icon: wmo.icon,
          group: wmo.group,
          humidity,
          isDay: cw.is_day === 1
        };

        setCache(city, weather);
        results.push(weather);
      } catch (e) {
        console.warn(`Failed for ${city}:`, e);
        // Still add a placeholder so the card shows something
        results.push({
          city, temp: '--', windSpeed: '--', humidity: '--',
          condition: 'Unavailable', icon: 'fas fa-circle-question',
          group: 'clear', isDay: true
        });
      }
    }

    return results;
  }

  // ---- Render results ----
  function renderResults(weatherData, pickup, delivery) {
    if (!weatherData.length) {
      showError('No weather data available for this route.');
      return;
    }

    els.routeLabel.textContent = `${pickup}  →  ${delivery}  •  ${weatherData.length} cities`;

    // Delay calculation
    let totalDelay = 0;
    weatherData.forEach(w => { totalDelay += delayEstimate[w.group] || 0; });
    renderDelayBanner(totalDelay);

    // Cards
    els.cardsGrid.innerHTML = weatherData.map((w, i) => {
      let tag = 'waypoint';
      if (i === 0) tag = 'origin';
      if (i === weatherData.length - 1) tag = 'destination';
      const tagLabel = tag === 'origin' ? 'Pickup' : tag === 'destination' ? 'Delivery' : 'En Route';

      return `
        <div class="weather-city-card weather-${w.group}">
          <div class="city-name">${w.city}</div>
          <span class="city-tag ${tag}">${tagLabel}</span>
          <div class="weather-icon-wrap"><i class="${w.icon}"></i></div>
          <div class="temperature">${w.temp}°C</div>
          <div class="condition-text">${w.condition}</div>
          <div class="weather-meta">
            <span><i class="fas fa-droplet"></i> ${w.humidity}%</span>
            <span><i class="fas fa-wind"></i> ${w.windSpeed} km/h</span>
          </div>
        </div>`;
    }).join('');

    setView('results');
  }

  function renderDelayBanner(hours) {
    let cls, icon, msg;
    if (hours === 0) {
      cls = 'no-delay'; icon = 'fas fa-circle-check';
      msg = 'Clear weather along the route — no delays expected!';
    } else if (hours <= 2) {
      cls = 'delay-minor'; icon = 'fas fa-cloud-rain';
      msg = `Minor weather impact — possible delay of ~${hours} hour(s)`;
    } else if (hours <= 4) {
      cls = 'delay-moderate'; icon = 'fas fa-exclamation-triangle';
      msg = `Moderate weather — expected delay of ~${hours} hour(s)`;
    } else {
      cls = 'delay-heavy'; icon = 'fas fa-triangle-exclamation';
      msg = `Severe weather along the route — expected delay of ${hours}+ hour(s)`;
    }
    els.delayWarning.className = `delay-banner ${cls}`;
    els.delayWarning.innerHTML = `<i class="${icon}"></i> <span>${msg}</span>`;
  }

  // ---- UI State ----
  function setView(view) {
    els.inputCard.style.display = view === 'input' ? 'block' : 'none';
    els.loadingState.style.display = view === 'loading' ? 'flex' : 'none';
    els.errorState.style.display = view === 'error' ? 'block' : 'none';
    els.results.style.display = view === 'results' ? 'block' : 'none';

    if (view === 'loading') {
      els.loadingState.style.display = 'block';
    }
  }

  function showError(msg) {
    els.errorMsg.textContent = msg;
    setView('error');
  }

  function resetUI() {
    els.pickupInput.value = '';
    els.deliveryInput.value = '';
    setView('input');
    els.pickupInput.focus();
  }

  // ---- Cache ----
  function getCache(city) {
    try {
      const raw = localStorage.getItem(`rw_${city}`);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_DURATION) { localStorage.removeItem(`rw_${city}`); return null; }
      return data;
    } catch { return null; }
  }

  function setCache(city, data) {
    try {
      localStorage.setItem(`rw_${city}`, JSON.stringify({ data, ts: Date.now() }));
    } catch { /* quota exceeded — ignore */ }
  }

  // ---- Monsoon check ----
  function checkMonsoon() {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 9 && els.monsoonAlert) {
      els.monsoonAlert.style.display = 'block';
    }
  }

  // ---- Boot ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
