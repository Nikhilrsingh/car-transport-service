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

    let currentStep = 1;
    let selectedFromCity = '';
    let selectedToCity = '';

    /**
     * Initialize Quick Quote Form
     */
    function initQuickQuoteForm() {
        const form = document.getElementById('quickQuoteForm');
        if (!form) return;

        const fromCityInput = document.getElementById('fromCity');
        const toCityInput = document.getElementById('toCity');
        const vehicleTypeSelect = document.getElementById('vehicleType');
        const step1Next = document.getElementById('step1Next');
        const step2Back = document.getElementById('step2Back');
        const resetBtn = document.getElementById('resetQuote');
        const bookNowBtn = document.getElementById('bookNowBtn');

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

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateQuote();
        });

        // Update distance when cities change
        fromCityInput.addEventListener('input', () => updateDistance());
        toCityInput.addEventListener('input', () => updateDistance());

        // Handle select focus for floating label
        vehicleTypeSelect.addEventListener('change', function() {
            if (this.value) {
                this.setAttribute('value', this.value);
            } else {
                this.removeAttribute('value');
            }
        });
    }
    
    /**
     * Handle Book Now Click
     */
    function handleBookNow() {
        const fromCity = selectedFromCity;
        const toCity = selectedToCity;
        const vehicleType = document.getElementById('vehicleType').value;
        const amount = document.getElementById('resultAmount').textContent;
        
        // Show confirmation message
        const confirmed = confirm(
            `🚗 Booking Summary\\n\\n` +
            `Route: ${fromCity} → ${toCity}\\n` +
            `Vehicle: ${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}\\n` +
            `Estimated Cost: ${amount}\\n\\n` +
            `Would you like to proceed to the booking page?`
        );
        
        if (confirmed) {
            // Redirect to booking page
            window.location.href = './pages/booking.html';
        }
    }

    /**
     * Setup Autocomplete for City Inputs
     */
    function setupAutocomplete(input, dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        
        input.addEventListener('input', function() {
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
        document.addEventListener('click', function(e) {
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
            const selectCity = function(e) {
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

        // Update result display
        document.getElementById('resultRoute').textContent = `${fromCity} → ${toCity}`;
        document.getElementById('resultDistance').textContent = `${distance} km`;
        document.getElementById('resultVehicle').textContent = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);
        document.getElementById('resultAmount').textContent = `₹${estimatedPrice.toLocaleString('en-IN')}`;

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
        selectedFromCity = '';
        selectedToCity = '';
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
        // Create modal HTML
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

                    <form class="quote-form" id="quoteForm">
                        <div class="quote-error-message" id="quoteErrorMessage"></div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="quoteName"><i class="fas fa-user"></i> Full Name</label>
                                <input type="text" id="quoteName" name="name" required placeholder="Your name">
                            </div>
                            <div class="form-group">
                                <label for="quotePhone"><i class="fas fa-phone"></i> Phone</label>
                                <input type="tel" id="quotePhone" name="phone" required placeholder="10-digit number">
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="quoteEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="quoteEmail" name="email" required placeholder="your@email.com">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="quoteVehicleType"><i class="fas fa-car"></i> Vehicle Type</label>
                                <select id="quoteVehicleType" name="vehicleType" required>
                                    <option value="">Select Vehicle Type</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="luxury">Luxury Car</option>
                                    <option value="bike">Motorcycle</option>
                                    <option value="commercial">Commercial Vehicle</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="quoteDistance"><i class="fas fa-road"></i> Approx. Distance (km)</label>
                                <input type="number" id="quoteDistance" name="distance" required placeholder="e.g., 500">
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="quoteRoute"><i class="fas fa-map-marker-alt"></i> Route (Pickup to Drop)</label>
                            <input type="text" id="quoteRoute" name="route" required placeholder="e.g., Delhi to Mumbai">
                        </div>

                        <div class="form-group full-width">
                            <label for="quoteNotes"><i class="fas fa-comment"></i> Additional Notes</label>
                            <textarea id="quoteNotes" name="notes" placeholder="Any special requirements..."></textarea>
                        </div>

                        <button type="submit" class="quote-modal-submit" id="quoteSubmitBtn">
                            <i class="fas fa-paper-plane"></i>
                            <span>Get Instant Quote</span>
                        </button>
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
     * Open Quote Modal
     */
    function openQuoteModal() {
        const modal = document.getElementById('quoteModalOverlay');
        const form = document.getElementById('quoteForm');
        const successMessage = document.getElementById('quoteSuccessMessage');

        // Reset form
        form.reset();
        form.style.display = 'block';
        successMessage.classList.remove('active');

        // Show modal
        modal.classList.add('active');

        // Focus on first input
        setTimeout(() => {
            const firstInput = form.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);

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

        const form = document.getElementById('quoteForm');
        const submitBtn = document.getElementById('quoteSubmitBtn');
        const errorMessage = document.getElementById('quoteErrorMessage');
        const successMessage = document.getElementById('quoteSuccessMessage');

        // Validate form
        if (!form.checkValidity()) {
            errorMessage.textContent = 'Please fill in all required fields correctly';
            errorMessage.classList.add('active');
            return;
        }

        errorMessage.classList.remove('active');

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Quote form submitted:', data);

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate API call (you can replace with actual API endpoint)
        setTimeout(() => {
            // Here you would send data to your backend
            // For now, we'll just show success message

            form.style.display = 'none';
            successMessage.classList.add('active');

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            // Close modal after 3 seconds
            setTimeout(() => {
                closeQuoteModal();
            }, 3000);
        }, 1500);
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
