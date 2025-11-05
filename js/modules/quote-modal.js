/* ====================================
   QUOTE MODAL MODULE
   ==================================== */

(function () {
    'use strict';

    /**
     * Initialize Quote Modal
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
