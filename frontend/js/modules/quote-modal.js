/* ====================================
   ENHANCED QUICK QUOTE FORM MODULE
   ==================================== */

(function () {
    'use strict';

    // Indian Cities Database for Autocomplete
    const indianCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
        'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
        'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
        'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
        'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
        'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
        'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh',
        'Guwahati', 'Solapur', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly',
        'Moradabad', 'Mysuru', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Bhubaneswar',
        'Salem', 'Mira-Bhayandar', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
        'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
        'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol'
    ];

    // Distance matrix (approximate distances in km between major cities)
    const distanceMatrix = {
        'Mumbai': { 'Delhi': 1400, 'Bangalore': 980, 'Hyderabad': 710, 'Chennai': 1330, 'Kolkata': 1960, 'Pune': 150, 'Ahmedabad': 530 },
        'Delhi': { 'Mumbai': 1400, 'Bangalore': 2150, 'Hyderabad': 1570, 'Chennai': 2180, 'Kolkata': 1480, 'Jaipur': 280, 'Chandigarh': 250 },
        'Bangalore': { 'Mumbai': 980, 'Delhi': 2150, 'Hyderabad': 570, 'Chennai': 350, 'Kolkata': 1880, 'Pune': 840, 'Mysore': 140 },
        'Hyderabad': { 'Mumbai': 710, 'Delhi': 1570, 'Bangalore': 570, 'Chennai': 630, 'Kolkata': 1500, 'Pune': 560, 'Vijayawada': 270 },
        'Chennai': { 'Mumbai': 1330, 'Delhi': 2180, 'Bangalore': 350, 'Hyderabad': 630, 'Kolkata': 1670, 'Coimbatore': 500, 'Madurai': 460 },
        'Kolkata': { 'Mumbai': 1960, 'Delhi': 1480, 'Bangalore': 1880, 'Hyderabad': 1500, 'Chennai': 1670, 'Bhubaneswar': 440, 'Patna': 550 },
        'Pune': { 'Mumbai': 150, 'Delhi': 1470, 'Bangalore': 840, 'Hyderabad': 560, 'Chennai': 1120, 'Goa': 460, 'Nashik': 210 },
        'Ahmedabad': { 'Mumbai': 530, 'Delhi': 950, 'Bangalore': 1640, 'Hyderabad': 1270, 'Jaipur': 660, 'Surat': 270, 'Rajkot': 220 }
    };

    // Pricing per km based on vehicle type
    const pricingRates = {
        'hatchback': 8,
        'sedan': 10,
        'suv': 12,
        'luxury': 15
    };

    // Transport options with different service levels
    const transportOptions = {
        'hatchback': [
            { name: 'Economy', rate: 7, deliveryDays: '5-7', description: 'Standard carrier, budget-friendly' },
            { name: 'Standard', rate: 8, deliveryDays: '3-5', description: 'Covered carrier, insured', bestValue: true },
            { name: 'Express', rate: 10, deliveryDays: '2-3', description: 'Priority delivery, premium service' }
        ],
        'sedan': [
            { name: 'Economy', rate: 9, deliveryDays: '5-7', description: 'Standard carrier, budget-friendly' },
            { name: 'Standard', rate: 10, deliveryDays: '3-5', description: 'Covered carrier, insured', bestValue: true },
            { name: 'Express', rate: 12, deliveryDays: '2-3', description: 'Priority delivery, premium service' }
        ],
        'suv': [
            { name: 'Economy', rate: 11, deliveryDays: '5-7', description: 'Standard carrier, budget-friendly' },
            { name: 'Standard', rate: 12, deliveryDays: '3-5', description: 'Covered carrier, insured', bestValue: true },
            { name: 'Express', rate: 14, deliveryDays: '2-3', description: 'Priority delivery, premium service' }
        ],
        'luxury': [
            { name: 'Premium', rate: 15, deliveryDays: '3-5', description: 'Enclosed carrier, fully insured' },
            { name: 'VIP', rate: 18, deliveryDays: '2-3', description: 'White-glove service, door-to-door', bestValue: true }
        ]
    };

    let currentStep = 1;
    let selectedFromCity = '';
    let selectedToCity = '';
    let currentQuoteData = null;

    /**
     * Initialize Quick Quote Form
     */
    function initQuickQuoteForm() {
        const form = document.getElementById('quickQuoteForm');
        if (!form) return;

        injectQuoteEnhancementStyles();

        const fromCityInput = document.getElementById('fromCity');
        const toCityInput = document.getElementById('toCity');
        const vehicleTypeSelect = document.getElementById('vehicleType');
        const step1Next = document.getElementById('step1Next');
        const step2Back = document.getElementById('step2Back');
        const resetBtn = document.getElementById('resetQuote');
        const bookNowBtn = document.getElementById('bookNowBtn');
        const saveLaterBtn = document.getElementById('saveLaterBtn');

        // Setup autocomplete
        setupAutocomplete(fromCityInput, 'fromCityDropdown');
        setupAutocomplete(toCityInput, 'toCityDropdown');

        // Step navigation
        step1Next.addEventListener('click', () => validateAndNextStep());
        step2Back.addEventListener('click', () => goToStep(1));
        resetBtn.addEventListener('click', () => resetForm());

        // Book Now handler
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', () => handleBookNow());
        }

        // Save for Later handler
        if (saveLaterBtn) {
            saveLaterBtn.addEventListener('click', () => handleSaveForLater());
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateQuote();
        });

        // Update distance when cities change
        fromCityInput.addEventListener('input', () => updateDistance());
        toCityInput.addEventListener('input', () => updateDistance());

        // Handle select focus for floating label
        vehicleTypeSelect.addEventListener('change', function () {
            if (this.value) {
                this.setAttribute('value', this.value);
            } else {
                this.removeAttribute('value');
            }
        });
        const actions = document.querySelector('.quote-result .result-actions');
        if (actions && !document.getElementById('shareQuoteBtn')) {
            const shareBtn = document.createElement('button');
            shareBtn.type = 'button';
            shareBtn.id = 'shareQuoteBtn';
            shareBtn.className = 'quote-save-later-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i><span>Share Quote</span>';
            shareBtn.addEventListener('click', () => handleShareQuote());
            actions.appendChild(shareBtn);
        }
        if (actions && !document.getElementById('copyQuoteBtn')) {
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.id = 'copyQuoteBtn';
            copyBtn.className = 'quote-save-later-btn';
            copyBtn.innerHTML = '<i class="fas fa-link"></i><span>Copy Link</span>';
            copyBtn.addEventListener('click', () => { if (currentQuoteData) copyQuoteLink(currentQuoteData); });
            actions.appendChild(copyBtn);
        }
        applyQuoteFromQuery();
    }

    /**
     * Handle Book Now Click
     */
    /**
 * Handle Book Now Click - Smooth Transition to Booking Page
 */
    function handleBookNow() {
        const fromCity = selectedFromCity;
        const toCity = selectedToCity;
        const vehicleType = document.getElementById('vehicleType').value;

        const bookingDraft = {
            step: 1,
            timestamp: new Date().toISOString(),
            fields: {
                pickupCity: fromCity,
                dropCity: toCity,
                vehicleType: vehicleType
            }
        };

        localStorage.setItem('bookingDraft', JSON.stringify(bookingDraft));

        showNotification('Redirecting to secure booking page...', 'success');

        setTimeout(() => {
            window.location.href = './pages/booking.html';
        }, 800);
    }

    /**
     * Handle Save for Later
     */
    function handleSaveForLater() {
        if (!currentQuoteData) return;

        const saveLaterBtn = document.getElementById('saveLaterBtn');

        // Get existing saved quotes
        let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');

        // Add current quote with timestamp
        const quoteToSave = {
            ...currentQuoteData,
            savedAt: new Date().toISOString(),
            id: Date.now()
        };

        savedQuotes.push(quoteToSave);

        // Limit to 10 saved quotes
        if (savedQuotes.length > 10) {
            savedQuotes = savedQuotes.slice(-10);
        }

        // Save to localStorage
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));

        // Update button state
        saveLaterBtn.classList.add('saved');
        saveLaterBtn.innerHTML = '<i class="fas fa-check"></i><span>Saved!</span>';

        // Show notification
        showNotification('Quote saved successfully! You can access it later from your saved quotes.', 'success');

        // Reset button after 3 seconds
        setTimeout(() => {
            saveLaterBtn.classList.remove('saved');
            saveLaterBtn.innerHTML = '<i class="fas fa-bookmark"></i><span>Save for Later</span>';
        }, 3000);
    }

    /**
     * Show Notification
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-family: "Poppins", sans-serif;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function injectQuoteEnhancementStyles() {
        if (document.getElementById('quoteEnhanceStyles')) return;
        const style = document.createElement('style');
        style.id = 'quoteEnhanceStyles';
        style.textContent = `
            .amount-bump { animation: amountBump .6s ease; }
            @keyframes amountBump { 0%{transform:scale(1)} 40%{transform:scale(1.08)} 100%{transform:scale(1)} }
            .price-option { transition: transform .2s, box-shadow .2s; }
            .price-option:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,.08); }
            .price-option.selected { box-shadow: 0 12px 24px rgba(34,197,94,.25); transform: translateY(-2px); }
            .result-actions button { transition: transform .2s, box-shadow .2s; }
            .result-actions button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,.1); }
        `;
        document.head.appendChild(style);
    }

    function animateAmount(selector) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.classList.add('amount-bump');
        setTimeout(() => el.classList.remove('amount-bump'), 600);
    }

    function shareQuote(data) {
        if (!data) return;
        const link = generateQuoteLink(data);
        const title = 'Your Car Transport Quote';
        const text = `${data.fromCity} → ${data.toCity} • ${data.vehicleType} • ₹${data.price.toLocaleString('en-IN')}`;
        if (navigator.share) {
            navigator.share({ title, text, url: link }).catch(() => { });
            return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link).then(() => {
                showNotification('Share link copied to clipboard', 'info');
            }).catch(() => { });
        }
        const wa = `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`;
        const mail = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n' + link)}`;
        window.open(wa, '_blank');
        window.open(mail, '_self');
    }

    function copyQuoteLink(data) {
        if (!data || !navigator.clipboard || !navigator.clipboard.writeText) return;
        const link = generateQuoteLink(data);
        navigator.clipboard.writeText(link).then(() => {
            showNotification('Link copied to clipboard', 'info');
        }).catch(() => { });
    }

    function generateQuoteLink(data) {
        const url = new URL(window.location.href);
        url.searchParams.set('from', data.fromCity);
        url.searchParams.set('to', data.toCity);
        url.searchParams.set('vehicle', data.vehicleType);
        url.searchParams.set('distance', String(data.distance));
        url.searchParams.set('price', String(data.price));
        return url.toString();
    }

    function handleShareQuote() {
        if (!currentQuoteData) {
            alert('Please complete the quote first');
            return;
        }
        const link = generateQuoteLink(currentQuoteData);
        const title = 'Your Car Transport Quote';
        const text = `${currentQuoteData.fromCity} → ${currentQuoteData.toCity} • ${currentQuoteData.vehicleType} • ₹${currentQuoteData.price.toLocaleString('en-IN')}`;
        if (navigator.share) {
            navigator.share({ title, text, url: link }).catch(() => { });
            return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link).then(() => {
                showNotification('Share link copied to clipboard', 'info');
            }).catch(() => { });
        }
        const wa = `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`;
        const mail = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n' + link)}`;
        window.open(wa, '_blank');
        window.open(mail, '_self');
    }

    function applyQuoteFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const from = params.get('from');
        const to = params.get('to');
        const vehicle = params.get('vehicle');
        if (from) {
            const fromInput = document.getElementById('fromCity');
            fromInput.value = from;
            selectedFromCity = from;
        }
        if (to) {
            const toInput = document.getElementById('toCity');
            toInput.value = to;
            selectedToCity = to;
        }
        if (from && to) updateDistance();
        if (vehicle) {
            const select = document.getElementById('vehicleType');
            select.value = vehicle;
            select.setAttribute('value', vehicle);
        }
        if (from && to && vehicle) {
            calculateQuote();
        }
    }

    /**
     * Calculate Delivery Time
     */
    function calculateDeliveryTime(distance) {
        // Estimate delivery based on distance as per issue #910
        // Realistic transport distance: 200-300km per day
        // Base buffer: 1-2 days for processing/pickup

        const minTravelDays = Math.ceil(distance / 300);
        const maxTravelDays = Math.ceil(distance / 200);

        const minTotalDays = minTravelDays + 1;
        const maxTotalDays = maxTravelDays + 2;

        return `${minTotalDays}–${maxTotalDays} Days`;
    }

    /**
     * Display Compare Prices
     */
    function displayComparePrices(vehicleType, distance) {
        const comparePricesSection = document.getElementById('comparePricesSection');
        const priceOptions = document.getElementById('priceOptions');

        if (!transportOptions[vehicleType]) {
            comparePricesSection.style.display = 'none';
            return;
        }

        const options = transportOptions[vehicleType];

        // Generate price option cards
        priceOptions.innerHTML = options.map((option, index) => {
            const price = Math.round(option.rate * distance);

            // Calculate dynamic delivery days based on service level
            let deliveryDays = '';
            const minDays = Math.ceil(distance / 300);
            const maxDays = Math.ceil(distance / 200);

            if (option.name === 'Economy') {
                deliveryDays = `${minDays + 3}–${maxDays + 5}`;
            } else if (option.name === 'Express' || option.name === 'VIP' || option.name === 'Premium') {
                deliveryDays = `${Math.max(1, minDays)}–${Math.max(2, maxDays + 1)}`;
            } else { // Standard
                deliveryDays = `${minDays + 1}–${maxDays + 2}`;
            }

            // Update option object for the click handler
            option.calculatedDeliveryDays = deliveryDays;

            return `
                <div class="price-option ${option.bestValue ? 'best-value' : ''}" data-option-index="${index}">
                    <div class="price-option-info">
                        <div class="price-option-name">${option.name}</div>
                        <div class="price-option-details">
                            <i class="fas fa-clock"></i> ${deliveryDays} Days • ${option.description}
                        </div>
                    </div>
                    <div class="price-option-amount">₹${price.toLocaleString('en-IN')}</div>
                </div>
            `;
        }).join('');

        comparePricesSection.style.display = 'block';

        // Add click handlers for price options
        document.querySelectorAll('.price-option').forEach((optionEl, index) => {
            optionEl.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.price-option').forEach(opt => opt.classList.remove('selected'));

                // Select this option
                optionEl.classList.add('selected');

                // Update main price display
                const selectedOption = options[index];
                const price = Math.round(selectedOption.rate * distance);
                document.getElementById('resultAmount').textContent = `₹${price.toLocaleString('en-IN')}`;

                // Update delivery time using the calculated value
                const deliveryTimeDisplay = selectedOption.calculatedDeliveryDays + ' Days';
                document.getElementById('deliveryTime').textContent = deliveryTimeDisplay;

                // Update current quote data
                if (currentQuoteData) {
                    currentQuoteData.selectedOption = selectedOption.name;
                    currentQuoteData.price = price;
                    currentQuoteData.deliveryTime = deliveryTimeDisplay;
                }
            });
        });
    }

    /**
     * Setup Autocomplete for City Inputs
     */
    function setupAutocomplete(input, dropdownId) {
        const dropdown = document.getElementById(dropdownId);

        input.addEventListener('input', function () {
            const value = this.value.trim();

            if (value.length < 1) {
                dropdown.classList.remove('active');
                return;
            }

            const matches = indianCities.filter(city =>
                city.toLowerCase().startsWith(value.toLowerCase())
            );

            if (matches.length === 0) {
                dropdown.classList.remove('active');
                return;
            }

            displayAutocomplete(matches, dropdown, input);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    /**
     * Display Autocomplete Results
     */
    function displayAutocomplete(cities, dropdown, input) {
        // Filter out the other city if already selected
        const otherInput = input.id === 'fromCity'
            ? document.getElementById('toCity')
            : document.getElementById('fromCity');
        const otherCity = otherInput ? otherInput.value.trim() : '';

        const filteredCities = otherCity
            ? cities.filter(city => city !== otherCity)
            : cities;

        dropdown.innerHTML = filteredCities.map(city => `
            <div class="autocomplete-item" data-city="${city}">
                <i class="fas fa-map-marker-alt"></i>
                <span>${city}</span>
            </div>
        `).join('');

        dropdown.classList.add('active');

        // Add click handlers
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            const selectCity = function (e) {
                e.preventDefault();
                e.stopPropagation();
                const city = item.dataset.city;
                input.value = city;
                dropdown.classList.remove('active');

                // Store selected city
                if (input.id === 'fromCity') {
                    selectedFromCity = city;
                } else {
                    selectedToCity = city;
                }

                updateDistance();
            };

            item.addEventListener('click', selectCity);
            item.addEventListener('mousedown', selectCity);
        });
    }

    /**
     * Calculate and Update Distance
     */
    function updateDistance() {
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();
        const distanceValue = document.getElementById('distanceValue');

        if (!fromCity || !toCity) {
            distanceValue.textContent = '---';
            return;
        }

        // Check if cities are the same
        if (fromCity.toLowerCase() === toCity.toLowerCase()) {
            distanceValue.textContent = 'Same city!';
            distanceValue.style.color = '#ef4444';
            return;
        }

        const distance = calculateDistance(fromCity, toCity);

        if (distance) {
            distanceValue.textContent = `${distance} km`;
            distanceValue.style.color = '#4ade80';
        } else {
            // Estimate based on random if not in matrix
            const estimatedDistance = Math.floor(Math.random() * 1500) + 300;
            distanceValue.textContent = `~${estimatedDistance} km (estimated)`;
            distanceValue.style.color = '#fbbf24';
        }
    }

    /**
     * Calculate Distance Between Cities
     */
    function calculateDistance(from, to) {
        if (distanceMatrix[from] && distanceMatrix[from][to]) {
            return distanceMatrix[from][to];
        }
        if (distanceMatrix[to] && distanceMatrix[to][from]) {
            return distanceMatrix[to][from];
        }
        return null;
    }

    /**
     * Validate and Move to Next Step
     */
    function validateAndNextStep() {
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();

        if (!fromCity || !toCity) {
            alert('Please select both pickup and drop cities');
            return;
        }

        if (fromCity === toCity) {
            alert('Pickup and drop cities cannot be the same');
            return;
        }

        selectedFromCity = fromCity;
        selectedToCity = toCity;
        goToStep(2);
    }

    /**
     * Go to Specific Step
     */
    function goToStep(step) {
        currentStep = step;

        // Update step indicators
        document.querySelectorAll('.step').forEach((el, index) => {
            el.classList.remove('active', 'completed');
            if (index + 1 < step) {
                el.classList.add('completed');
            } else if (index + 1 === step) {
                el.classList.add('active');
            }
        });

        // Update form steps
        document.querySelectorAll('.form-step').forEach((el) => {
            el.classList.remove('active');
            if (parseInt(el.dataset.step) === step) {
                el.classList.add('active');
            }
        });
    }

    /**
     * Calculate Quote
     */
    function calculateQuote() {
        const vehicleType = document.getElementById('vehicleType').value;
        const fromCity = selectedFromCity;
        const toCity = selectedToCity;

        if (!vehicleType) {
            alert('Please select a vehicle type');
            return;
        }

        const distance = calculateDistance(fromCity, toCity) || Math.floor(Math.random() * 1500) + 300;
        const rate = pricingRates[vehicleType];
        const basePrice = distance * rate;
        const estimatedPrice = Math.round(basePrice);
        const deliveryTime = calculateDeliveryTime(distance);

        // Update result display
        document.getElementById('resultRoute').textContent = `${fromCity} → ${toCity}`;
        document.getElementById('resultDistance').textContent = `${distance} km`;
        document.getElementById('resultVehicle').textContent = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);
        document.getElementById('resultAmount').textContent = `₹${estimatedPrice.toLocaleString('en-IN')}`;
        animateAmount('#resultAmount');
        document.getElementById('deliveryTime').textContent = deliveryTime;

        // Store current quote data
        currentQuoteData = {
            fromCity,
            toCity,
            distance,
            vehicleType,
            price: estimatedPrice,
            deliveryTime,
            selectedOption: 'Standard'
        };

        // Display compare prices
        displayComparePrices(vehicleType, distance);

        // Go to result step
        goToStep(3);
    }

    /**
     * Reset Form
     */
    function resetForm() {
        document.getElementById('quickQuoteForm').reset();
        document.getElementById('fromCity').value = '';
        document.getElementById('toCity').value = '';
        document.getElementById('vehicleType').value = '';
        document.getElementById('vehicleType').removeAttribute('value');
        document.getElementById('distanceValue').textContent = '---';
        document.getElementById('deliveryTime').textContent = '---';

        // Hide compare prices section
        const comparePricesSection = document.getElementById('comparePricesSection');
        if (comparePricesSection) {
            comparePricesSection.style.display = 'none';
        }

        selectedFromCity = '';
        selectedToCity = '';
        currentQuoteData = null;
        goToStep(1);
    }

    /**
     * Initialize on DOM Ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initQuickQuoteForm);
    } else {
        initQuickQuoteForm();
    }

    /**
     * Initialize Quote Modal (existing functionality)
     */
    function initQuoteModal() {
        // Create modal HTML with enhanced features
        const modalHTML = `
            <div class="quote-modal-overlay" id="quoteModalOverlay">
                <div class="quote-modal">
                    <button class="quote-modal-close" id="quoteModalClose" aria-label="Close quote modal">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="quote-modal-header">
                        <h2>Get a Quick Quote</h2>
                        <p>Fill in your vehicle details for an instant quote</p>
                    </div>

                    <!-- Step Progress Indicator -->
                    <div class="step-progress" id="modalStepProgress">
                        <div class="step active" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-label">Route</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-label">Vehicle</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-label">Quote</div>
                        </div>
                    </div>

                    <form class="quote-form" id="quoteForm">
                        <div class="quote-error-message" id="quoteErrorMessage"></div>

                        <!-- Step 1: Route -->
                        <div class="form-step active" data-step="1" id="modalStep1">
                            <div class="form-group floating-label">
                                <input type="text" id="modalFromCity" required autocomplete="off" />
                                <label for="modalFromCity"><i class="fas fa-map-marker-alt"></i> Pickup City</label>
                                <div class="autocomplete-dropdown" id="modalFromCityDropdown"></div>
                            </div>
                            <div class="form-group floating-label">
                                <input type="text" id="modalToCity" required autocomplete="off" />
                                <label for="modalToCity"><i class="fas fa-flag-checkered"></i> Drop City</label>
                                <div class="autocomplete-dropdown" id="modalToCityDropdown"></div>
                            </div>
                            <div class="distance-display" id="modalDistanceDisplay">
                                <i class="fas fa-route"></i>
                                <span>Distance: <strong id="modalDistanceValue">---</strong></span>
                            </div>
                            <button type="button" class="quote-next" id="modalStep1Next">
                                <span>Next</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>

                        <!-- Step 2: Vehicle Type & Contact -->
                        <div class="form-step" data-step="2" id="modalStep2">
                            <div class="form-group floating-label">
                                <select id="modalVehicleType" required>
                                    <option value=""></option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="luxury">Luxury Car</option>
                                </select>
                                <label for="modalVehicleType"><i class="fas fa-car"></i> Vehicle Type</label>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="quoteName"><i class="fas fa-user"></i> Full Name</label>
                                    <input type="text" id="quoteName" name="name" placeholder="Your name">
                                </div>
                                <div class="form-group">
                                    <label for="quotePhone"><i class="fas fa-phone"></i> Phone</label>
                                    <input type="tel" id="quotePhone" name="phone" placeholder="10-digit number">
                                </div>
                            </div>
                            <div class="form-group full-width">
                                <label for="quoteEmail"><i class="fas fa-envelope"></i> Email</label>
                                <input type="email" id="quoteEmail" name="email" placeholder="your@email.com">
                            </div>
                            <div class="form-actions">
                                <button type="button" class="quote-form-back-btn" id="modalStep2Back">
                                    <i class="fas fa-arrow-left"></i>
                                    <span>Back</span>
                                </button>
                                <button type="submit" class="quote-form-submit-btn">
                                    <span>Calculate Price</span>
                                    <i class="fas fa-calculator"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Step 3: Result -->
                        <div class="form-step" data-step="3" id="modalStep3">
                            <div class="quote-result" id="modalQuoteResult">
                                <div class="result-details">
                                    <div class="result-row">
                                        <span class="result-label">Route:</span>
                                        <span class="result-value" id="modalResultRoute">---</span>
                                    </div>
                                    <div class="result-row">
                                        <span class="result-label">Distance:</span>
                                        <span class="result-value" id="modalResultDistance">---</span>
                                    </div>
                                    <div class="result-row">
                                        <span class="result-label">Vehicle:</span>
                                        <span class="result-value" id="modalResultVehicle">---</span>
                                    </div>
                                </div>

                                <!-- Estimated Delivery Time -->
                                <div class="delivery-time-display" id="modalDeliveryTimeDisplay">
                                    <i class="fas fa-clock"></i>
                                    <div class="time-info">
                                        <span class="time-label">Expected Delivery:</span>
                                        <span class="time-value" id="modalDeliveryTime">---</span>
                                    </div>
                                </div>

                                <!-- Compare Prices Section -->
                                <div class="compare-prices-section" id="modalComparePricesSection" style="display: none;">
                                    <div class="compare-prices-header">
                                        <h4><i class="fas fa-layer-group"></i> Transport Options</h4>
                                    </div>
                                    <div class="price-options" id="modalPriceOptions">
                                        <!-- Price options will be dynamically inserted here -->
                                    </div>
                                </div>

                                <div class="result-price">
                                    <span class="label">Estimated Cost</span>
                                    <span class="amount" id="modalResultAmount">₹0</span>
                                </div>
                                <div class="result-actions">
                                    <button type="button" class="quote-result-book-btn" id="modalBookNowBtn">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Book Now</span>
                                    </button>
                                    <button type="button" class="quote-save-later-btn" id="modalSaveLaterBtn">
                                        <i class="fas fa-bookmark"></i>
                                        <span>Save for Later</span>
                                    </button>
                                    <button type="button" class="quote-result-reset-btn" id="modalResetQuote">
                                        <i class="fas fa-redo"></i> New Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div class="quote-success-message" id="quoteSuccessMessage">
                        <i class="fas fa-check-circle"></i>
                        <h3>Quote Request Submitted!</h3>
                        <p>Thank you! Our team will send you a detailed quote within 30 minutes. Check your email for updates.</p>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body if not already present
        if (!document.getElementById('quoteModalOverlay')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Get modal elements
        const modal = document.getElementById('quoteModalOverlay');
        const closeBtn = document.getElementById('quoteModalClose');
        const form = document.getElementById('quoteForm');

        // Initialize modal form functionality
        initModalForm();

        // Event listeners
        closeBtn.addEventListener('click', closeQuoteModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeQuoteModal();
            }
        });

        form.addEventListener('submit', handleQuoteSubmit);

        // Expose function to open modal
        window.openQuoteModal = openQuoteModal;
        window.closeQuoteModal = closeQuoteModal;
    }

    /**
     * Initialize Modal Form - Enhanced functionality for modal version
     */
    function initModalForm() {
        let modalStep = 1;
        let modalSelectedFromCity = '';
        let modalSelectedToCity = '';
        let modalQuoteData = null;

        const modalFromCity = document.getElementById('modalFromCity');
        const modalToCity = document.getElementById('modalToCity');
        const modalVehicleType = document.getElementById('modalVehicleType');
        const modalStep1Next = document.getElementById('modalStep1Next');
        const modalStep2Back = document.getElementById('modalStep2Back');
        const modalResetBtn = document.getElementById('modalResetQuote');
        const modalBookNowBtn = document.getElementById('modalBookNowBtn');
        const modalSaveLaterBtn = document.getElementById('modalSaveLaterBtn');

        injectQuoteEnhancementStyles();

        const modalActions = document.querySelector('#modalQuoteResult .result-actions');
        if (modalActions) {
            if (!document.getElementById('modalShareQuoteBtn')) {
                const shareBtn = document.createElement('button');
                shareBtn.type = 'button';
                shareBtn.id = 'modalShareQuoteBtn';
                shareBtn.className = 'quote-save-later-btn';
                shareBtn.innerHTML = '<i class="fas fa-share-alt"></i><span>Share Quote</span>';
                shareBtn.addEventListener('click', () => { if (modalQuoteData) shareQuote(modalQuoteData); });
                modalActions.appendChild(shareBtn);
            }
            if (!document.getElementById('modalCopyQuoteBtn')) {
                const copyBtn = document.createElement('button');
                copyBtn.type = 'button';
                copyBtn.id = 'modalCopyQuoteBtn';
                copyBtn.className = 'quote-save-later-btn';
                copyBtn.innerHTML = '<i class="fas fa-link"></i><span>Copy Link</span>';
                copyBtn.addEventListener('click', () => { if (modalQuoteData) copyQuoteLink(modalQuoteData); });
                modalActions.appendChild(copyBtn);
            }
        }

        // Setup autocomplete for modal
        if (modalFromCity) setupAutocomplete(modalFromCity, 'modalFromCityDropdown');
        if (modalToCity) setupAutocomplete(modalToCity, 'modalToCityDropdown');

        // Update distance when cities change
        if (modalFromCity) {
            modalFromCity.addEventListener('input', () => updateModalDistance());
        }
        if (modalToCity) {
            modalToCity.addEventListener('input', () => updateModalDistance());
        }

        // Handle select focus for floating label
        if (modalVehicleType) {
            modalVehicleType.addEventListener('change', function () {
                if (this.value) {
                    this.setAttribute('value', this.value);
                } else {
                    this.removeAttribute('value');
                }
            });
        }

        // Step navigation
        if (modalStep1Next) {
            modalStep1Next.addEventListener('click', () => {
                const fromCity = modalFromCity.value.trim();
                const toCity = modalToCity.value.trim();

                if (!fromCity || !toCity) {
                    alert('Please select both pickup and drop cities');
                    return;
                }

                if (fromCity === toCity) {
                    alert('Pickup and drop cities cannot be the same');
                    return;
                }

                modalSelectedFromCity = fromCity;
                modalSelectedToCity = toCity;
                goToModalStep(2);
            });
        }

        if (modalStep2Back) {
            modalStep2Back.addEventListener('click', () => goToModalStep(1));
        }

        if (modalResetBtn) {
            modalResetBtn.addEventListener('click', () => {
                document.getElementById('quoteForm').reset();
                modalFromCity.value = '';
                modalToCity.value = '';
                modalVehicleType.value = '';
                modalVehicleType.removeAttribute('value');
                document.getElementById('modalDistanceValue').textContent = '---';
                document.getElementById('modalDeliveryTime').textContent = '---';

                const comparePricesSection = document.getElementById('modalComparePricesSection');
                if (comparePricesSection) {
                    comparePricesSection.style.display = 'none';
                }

                modalSelectedFromCity = '';
                modalSelectedToCity = '';
                modalQuoteData = null;
                goToModalStep(1);
            });
        }

        if (modalBookNowBtn) {
            modalBookNowBtn.addEventListener('click', () => {
                const confirmed = confirm(
                    `🚗 Booking Summary\\n\\n` +
                    `Route: ${modalSelectedFromCity} → ${modalSelectedToCity}\\n` +
                    `Vehicle: ${modalVehicleType.value.charAt(0).toUpperCase() + modalVehicleType.value.slice(1)}\\n` +
                    `Estimated Cost: ${document.getElementById('modalResultAmount').textContent}\\n\\n` +
                    `Would you like to proceed to the booking page?`
                );

                if (confirmed) {
                    window.location.href = './pages/booking.html';
                }
            });
        }

        if (modalSaveLaterBtn) {
            modalSaveLaterBtn.addEventListener('click', () => {
                if (!modalQuoteData) return;

                let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
                const quoteToSave = {
                    ...modalQuoteData,
                    savedAt: new Date().toISOString(),
                    id: Date.now()
                };

                savedQuotes.push(quoteToSave);
                if (savedQuotes.length > 10) {
                    savedQuotes = savedQuotes.slice(-10);
                }

                localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));

                modalSaveLaterBtn.classList.add('saved');
                modalSaveLaterBtn.innerHTML = '<i class="fas fa-check"></i><span>Saved!</span>';

                showNotification('Quote saved successfully!', 'success');

                setTimeout(() => {
                    modalSaveLaterBtn.classList.remove('saved');
                    modalSaveLaterBtn.innerHTML = '<i class="fas fa-bookmark"></i><span>Save for Later</span>';
                }, 3000);
            });
        }

        function updateModalDistance() {
            const fromCity = modalFromCity.value.trim();
            const toCity = modalToCity.value.trim();
            const distanceValue = document.getElementById('modalDistanceValue');

            if (!fromCity || !toCity) {
                distanceValue.textContent = '---';
                return;
            }

            if (fromCity.toLowerCase() === toCity.toLowerCase()) {
                distanceValue.textContent = 'Same city!';
                distanceValue.style.color = '#ef4444';
                return;
            }

            const distance = calculateDistance(fromCity, toCity);

            if (distance) {
                distanceValue.textContent = `${distance} km`;
                distanceValue.style.color = '#4ade80';
            } else {
                const estimatedDistance = Math.floor(Math.random() * 1500) + 300;
                distanceValue.textContent = `~${estimatedDistance} km (estimated)`;
                distanceValue.style.color = '#fbbf24';
            }
        }

        function goToModalStep(step) {
            modalStep = step;

            console.log('Going to modal step:', step);

            // Update step indicators in modal
            const modalSteps = document.querySelectorAll('#modalStepProgress .step');
            modalSteps.forEach((el, index) => {
                el.classList.remove('active', 'completed');
                if (index + 1 < step) {
                    el.classList.add('completed');
                } else if (index + 1 === step) {
                    el.classList.add('active');
                }
            });

            // Update form steps in modal
            const modalFormSteps = document.querySelectorAll('#quoteForm .form-step');
            console.log('Modal form steps found:', modalFormSteps.length);

            modalFormSteps.forEach((el) => {
                el.classList.remove('active');
                const elStep = parseInt(el.dataset.step);
                console.log('Form step data-step:', elStep, 'target step:', step);
                if (elStep === step) {
                    el.classList.add('active');
                    el.style.display = 'block';
                    console.log('Activated step', elStep);
                }
            });
        }

        // Store functions for modal quote calculation
        window.calculateModalQuote = function () {
            const vehicleType = modalVehicleType.value;
            const fromCity = modalSelectedFromCity;
            const toCity = modalSelectedToCity;

            console.log('Calculating modal quote:', { vehicleType, fromCity, toCity });

            if (!vehicleType) {
                alert('Please select a vehicle type');
                return;
            }

            const distance = calculateDistance(fromCity, toCity) || Math.floor(Math.random() * 1500) + 300;
            const rate = pricingRates[vehicleType];
            const basePrice = distance * rate;
            const estimatedPrice = Math.round(basePrice);
            const deliveryTime = calculateDeliveryTime(distance);

            console.log('Quote calculated:', { distance, estimatedPrice, deliveryTime });

            // Update result display
            document.getElementById('modalResultRoute').textContent = `${fromCity} → ${toCity}`;
            document.getElementById('modalResultDistance').textContent = `${distance} km`;
            document.getElementById('modalResultVehicle').textContent = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);
            document.getElementById('modalResultAmount').textContent = `₹${estimatedPrice.toLocaleString('en-IN')}`;
            animateAmount('#modalResultAmount');
            document.getElementById('modalDeliveryTime').textContent = deliveryTime;

            // Store modal quote data
            modalQuoteData = {
                fromCity,
                toCity,
                distance,
                vehicleType,
                price: estimatedPrice,
                deliveryTime,
                selectedOption: 'Standard'
            };

            // Display compare prices
            displayModalComparePrices(vehicleType, distance);

            // Go to result step
            console.log('Moving to step 3');
            goToModalStep(3);
        };

        function displayModalComparePrices(vehicleType, distance) {
            const comparePricesSection = document.getElementById('modalComparePricesSection');
            const priceOptions = document.getElementById('modalPriceOptions');

            if (!transportOptions[vehicleType]) {
                comparePricesSection.style.display = 'none';
                return;
            }

            const options = transportOptions[vehicleType];

            priceOptions.innerHTML = options.map((option, index) => {
                const price = Math.round(option.rate * distance);

                // Calculate dynamic delivery days based on service level
                let deliveryDays = '';
                const minDays = Math.ceil(distance / 300);
                const maxDays = Math.ceil(distance / 200);

                if (option.name === 'Economy') {
                    deliveryDays = `${minDays + 3}–${maxDays + 5}`;
                } else if (option.name === 'Express' || option.name === 'VIP' || option.name === 'Premium') {
                    deliveryDays = `${Math.max(1, minDays)}–${Math.max(2, maxDays + 1)}`;
                } else { // Standard
                    deliveryDays = `${minDays + 1}–${maxDays + 2}`;
                }

                // Update option object for the click handler
                option.calculatedDeliveryDays = deliveryDays;

                return `
                    <div class="price-option ${option.bestValue ? 'best-value' : ''}" data-option-index="${index}">
                        <div class="price-option-info">
                            <div class="price-option-name">${option.name}</div>
                            <div class="price-option-details">
                                <i class="fas fa-clock"></i> ${deliveryDays} Days • ${option.description}
                            </div>
                        </div>
                        <div class="price-option-amount">₹${price.toLocaleString('en-IN')}</div>
                    </div>
                `;
            }).join('');

            comparePricesSection.style.display = 'block';

            document.querySelectorAll('#modalPriceOptions .price-option').forEach((optionEl, index) => {
                optionEl.addEventListener('click', () => {
                    document.querySelectorAll('#modalPriceOptions .price-option').forEach(opt => opt.classList.remove('selected'));
                    optionEl.classList.add('selected');

                    const selectedOption = options[index];
                    const price = Math.round(selectedOption.rate * distance);
                    document.getElementById('modalResultAmount').textContent = `₹${price.toLocaleString('en-IN')}`;
                    // Update delivery time using the calculated value
                    const deliveryTimeDisplay = selectedOption.calculatedDeliveryDays + ' Days';
                    document.getElementById('modalDeliveryTime').textContent = deliveryTimeDisplay;

                    if (modalQuoteData) {
                        modalQuoteData.selectedOption = selectedOption.name;
                        modalQuoteData.price = price;
                        modalQuoteData.deliveryTime = deliveryTimeDisplay;
                    }
                });
            });
        }
    }

    /**
     * Open Quote Modal
     */
    function openQuoteModal() {
        const modal = document.getElementById('quoteModalOverlay');
        const form = document.getElementById('quoteForm');

        // Reset form
        if (form) {
            form.reset();

            // Reset modal fields
            const modalFromCity = document.getElementById('modalFromCity');
            const modalToCity = document.getElementById('modalToCity');
            const modalVehicleType = document.getElementById('modalVehicleType');

            if (modalFromCity) modalFromCity.value = '';
            if (modalToCity) modalToCity.value = '';
            if (modalVehicleType) {
                modalVehicleType.value = '';
                modalVehicleType.removeAttribute('value');
            }

            const modalDistanceValue = document.getElementById('modalDistanceValue');
            if (modalDistanceValue) modalDistanceValue.textContent = '---';

            // Reset to step 1
            const modalSteps = document.querySelectorAll('#modalStepProgress .step');
            modalSteps.forEach((el, index) => {
                el.classList.remove('active', 'completed');
                if (index === 0) {
                    el.classList.add('active');
                }
            });

            const modalFormSteps = document.querySelectorAll('#quoteForm .form-step');
            modalFormSteps.forEach((el) => {
                el.classList.remove('active');
                if (el.dataset.step === '1') {
                    el.classList.add('active');
                }
            });
        }

        // Show modal
        if (modal) {
            modal.classList.add('active');

            // Focus on first input
            setTimeout(() => {
                const firstInput = document.getElementById('modalFromCity');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 300);
        }

        console.log('Quote modal opened');
    }

    /**
     * Close Quote Modal
     */
    function closeQuoteModal() {
        const modal = document.getElementById('quoteModalOverlay');
        modal.classList.remove('active');
        console.log('Quote modal closed');
    }

    /**
     * Handle Quote Form Submission
     */
    function handleQuoteSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        // Check if we're in modal and calculate quote
        if (typeof window.calculateModalQuote === 'function') {
            window.calculateModalQuote();
        }
    }

    /**
     * Initialize on DOM Ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initQuoteModal);
    } else {
        initQuoteModal();
    }
})();
