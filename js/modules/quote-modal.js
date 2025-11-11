/* ====================================
   ENHANCED QUICK QUOTE FORM MODULE (FINAL)
   ==================================== */
(function () {
    'use strict';

    const indianCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
        'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
        'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Chandigarh', 'Gurgaon'
    ];

    const distanceMatrix = {
        'Mumbai': { 'Delhi': 1400, 'Bangalore': 980, 'Hyderabad': 710 },
        'Delhi': { 'Mumbai': 1400, 'Bangalore': 2150, 'Hyderabad': 1570 },
        'Bangalore': { 'Mumbai': 980, 'Delhi': 2150, 'Hyderabad': 570 }
    };

    const pricingRates = {
        'hatchback': 8,
        'sedan': 10,
        'suv': 12,
        'luxury': 15
    };

    let selectedFromCity = '', selectedToCity = '';

    // Initialize Quick Quote Form
    function initQuickQuoteForm() {
        const form = document.getElementById('quickQuoteForm');
        if (!form) return;

        const fromCityInput = document.getElementById('fromCity');
        const toCityInput = document.getElementById('toCity');
        const vehicleTypeSelect = document.getElementById('vehicleType');

        setupAutocomplete(fromCityInput, 'fromCityDropdown');
        setupAutocomplete(toCityInput, 'toCityDropdown');

        vehicleTypeSelect.addEventListener('change', function () {
            if (this.value) this.setAttribute('value', this.value);
            else this.removeAttribute('value');
        });
    }

    // Autocomplete
    function setupAutocomplete(input, dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        input.addEventListener('input', function () {
            const value = this.value.trim();
            if (value.length < 1) return dropdown.classList.remove('active');
            const matches = indianCities.filter(c => c.toLowerCase().startsWith(value.toLowerCase()));
            dropdown.innerHTML = matches.map(c => `<div class="autocomplete-item" data-city="${c}"><i class="fas fa-map-marker-alt"></i><span>${c}</span></div>`).join('');
            dropdown.classList.add('active');
            dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.dataset.city;
                    dropdown.classList.remove('active');
                });
            });
        });
    }

    // Quote Modal
    function initQuoteModal() {
        const modalHTML = `
            <div class="quote-modal-overlay" id="quoteModalOverlay">
                <div class="quote-modal">
                    <button class="quote-modal-close" id="quoteModalClose"><i class="fas fa-times"></i></button>
                    <div class="quote-modal-header">
                        <h2>Get a Quick Quote</h2>
                        <p>Fill in your vehicle details for an instant quote</p>
                    </div>

                    <form class="quote-form" id="quoteForm">
                        <div class="quote-error-message" id="quoteErrorMessage"></div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="quoteName"><i class="fas fa-user"></i> Full Name</label>
                                <input type="text" id="quoteName" placeholder="Your name" required>
                            </div>
                            <div class="form-group">
                                <label for="quotePhone"><i class="fas fa-phone"></i> Phone</label>
                                <input type="tel" id="quotePhone" placeholder="10-digit number" required>
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="quoteEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="quoteEmail" placeholder="your@email.com" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="quoteVehicleType"><i class="fas fa-car"></i> Vehicle Type</label>
                                <select id="quoteVehicleType" required>
                                    <option value="">Select Vehicle Type</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="luxury">Luxury</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="quoteDistance"><i class="fas fa-road"></i> Approx. Distance (km)</label>
                                <input type="number" id="quoteDistance" placeholder="e.g., 500" required>
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="quoteRoute"><i class="fas fa-map-marker-alt"></i> Route (Pickup to Drop)</label>
                            <input type="text" id="quoteRoute" placeholder="e.g., Delhi to Mumbai" required>
                        </div>

                        <div class="form-group full-width">
                            <label for="quoteNotes"><i class="fas fa-comment"></i> Additional Notes</label>
                            <textarea id="quoteNotes" placeholder="Any special requirements..."></textarea>
                        </div>

                        <button type="submit" class="quote-modal-submit" id="quoteSubmitBtn">
                            <i class="fas fa-paper-plane"></i> <span>Get Instant Quote</span>
                        </button>
                    </form>

                    <div class="quote-success-message" id="quoteSuccessMessage">
                        <i class="fas fa-check-circle"></i>
                        <h3>Quote Request Submitted!</h3>
                        <p>Thank you! Our team will get back to you shortly.</p>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('quoteModalOverlay')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = document.getElementById('quoteModalOverlay');
        document.getElementById('quoteModalClose').addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('quoteForm').addEventListener('submit', handleQuoteSubmit);
        window.openQuoteModal = () => modal.classList.add('active');
        window.closeQuoteModal = () => modal.classList.remove('active');
    }

    function handleQuoteSubmit(e) {
        e.preventDefault();
        const successMessage = document.getElementById('quoteSuccessMessage');
        successMessage.classList.add('active');
        document.getElementById('quoteForm').style.display = 'none';
        setTimeout(() => closeQuoteModal(), 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initQuickQuoteForm();
            initQuoteModal();
        });
    } else {
        initQuickQuoteForm();
        initQuoteModal();
    }
})();
