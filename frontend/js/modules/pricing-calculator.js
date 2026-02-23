// Pricing Calculator JavaScript

document.addEventListener('DOMContentLoaded', function () {
    initCalculator();
    initPlanSelection();
    initDiscountButtons();
    initOfferButtons();
    initPricingFaqAccordion();
});

// Calculator Configuration
const PRICING_CONFIG = {
    basePricePerMile: {
        standard: 0.50,
        premium: 0.75,
        express: 1.20
    },
    vehicleTypeMultiplier: {
        sedan: 1.0,
        suv: 1.2,
        luxury: 1.5,
        motorcycle: 0.7,
        classic: 1.8
    },
    nonRunningFee: 150,
    addons: {
        enclosed: 200,
        insurance: 100,
        topload: 150,
        expedited: 250
    },
    bulkDiscounts: {
        2: 0.10,  // 10% off
        4: 0.15,  // 15% off
        7: 0.20   // 20% off
    }
};

// Initialize Calculator
function initCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const inputs = document.querySelectorAll('input, select');

    if (!calculateBtn) return;

    // Add event listeners to all inputs for real-time calculation
    inputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    // Calculate button click
    calculateBtn.addEventListener('click', function (e) {
        e.preventDefault();
        calculatePrice();

        // Scroll to summary
        const summary = document.querySelector('.price-summary');
        if (summary) {
            summary.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });

    // Initial calculation
    calculatePrice();
}

// Calculate Price Function
function calculatePrice() {
    const distanceInput = document.getElementById('distance');
    const vehicleTypeSelect = document.getElementById('vehicleType');
    const vehicleConditionSelect = document.getElementById('vehicleCondition');
    const servicePlanInput = document.querySelector('input[name="servicePlan"]:checked');

    if (!distanceInput || !vehicleTypeSelect || !vehicleConditionSelect || !servicePlanInput) return;

    // Get form values
    const distance = parseFloat(distanceInput.value) || 500;
    const vehicleType = vehicleTypeSelect.value;
    const vehicleCondition = vehicleConditionSelect.value;
    const servicePlan = servicePlanInput.value;

    // Get selected addons
    const selectedAddons = Array.from(document.querySelectorAll('input[name="addon"]:checked'));

    // Calculate base cost
    const pricePerMile = PRICING_CONFIG.basePricePerMile[servicePlan];
    const vehicleMultiplier = PRICING_CONFIG.vehicleTypeMultiplier[vehicleType];
    let baseCost = distance * pricePerMile * vehicleMultiplier;

    // Vehicle type adjustment
    const vehicleTypeAdjustment = baseCost * (vehicleMultiplier - 1);

    // Non-running fee
    const nonRunningFee = vehicleCondition === 'non-running' ? PRICING_CONFIG.nonRunningFee : 0;

    // Calculate addon costs
    let addonTotal = 0;
    const addonsList = document.getElementById('addonsList');
    if (addonsList) {
        addonsList.innerHTML = '';
    }

    selectedAddons.forEach(addon => {
        const addonValue = addon.value;
        const addonPrice = PRICING_CONFIG.addons[addonValue];
        addonTotal += addonPrice;

        if (!addonsList) return;

        // Add to display
        const addonName = addon.parentElement.querySelector('h4').textContent;
        const addonRow = document.createElement('div');
        addonRow.className = 'summary-item';
        addonRow.innerHTML = `
            <span>${addonName}</span>
            <span>$${addonPrice.toFixed(2)}</span>
        `;
        addonsList.appendChild(addonRow);
    });

    // Calculate subtotal
    let subtotal = baseCost + nonRunningFee + addonTotal;

    // Apply discounts (example: 5% discount for distances over 1000 miles)
    let discount = 0;
    if (distance > 1000) {
        discount = subtotal * 0.05;
    }

    // Calculate total
    const total = subtotal - discount;

    // Update display
    const baseCostEl = document.getElementById('baseCost');
    const vehicleTypeRow = document.getElementById('vehicleTypeRow');
    const vehicleTypeCostEl = document.getElementById('vehicleTypeCost');
    const conditionRow = document.getElementById('conditionRow');
    const conditionCostEl = document.getElementById('conditionCost');
    const discountRow = document.getElementById('discountRow');
    const discountAmountEl = document.getElementById('discountAmount');
    const totalCostEl = document.getElementById('totalCost');

    if (baseCostEl) baseCostEl.textContent = `$${baseCost.toFixed(2)}`;

    // Show/hide vehicle type adjustment
    if (vehicleTypeRow && vehicleTypeCostEl) {
        if (vehicleMultiplier !== 1.0) {
            vehicleTypeRow.style.display = 'flex';
            vehicleTypeCostEl.textContent = `$${vehicleTypeAdjustment.toFixed(2)}`;
        } else {
            vehicleTypeRow.style.display = 'none';
        }
    }

    // Show/hide condition fee
    if (conditionRow && conditionCostEl) {
        if (nonRunningFee > 0) {
            conditionRow.style.display = 'flex';
            conditionCostEl.textContent = `$${nonRunningFee.toFixed(2)}`;
        } else {
            conditionRow.style.display = 'none';
        }
    }

    // Show/hide discount
    if (discountRow && discountAmountEl) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            discountAmountEl.textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    // Update total
    if (totalCostEl) {
        totalCostEl.textContent = `$${total.toFixed(2)}`;
    }
}

// Plan Selection from Comparison Table
function initPlanSelection() {
    const planButtons = document.querySelectorAll('.select-plan-btn');

    planButtons.forEach(button => {
        button.addEventListener('click', function () {
            const plan = this.getAttribute('data-plan');

            // Select the corresponding radio button in calculator
            const radioButton = document.querySelector(`input[name="servicePlan"][value="${plan}"]`);
            if (radioButton) {
                radioButton.checked = true;
                calculatePrice();
            }

            // Scroll to calculator
            const calculatorSection = document.querySelector('.price-calculator');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Book Now Button
const bookNowBtn = document.querySelector('.book-now-btn');
if (bookNowBtn) {
    bookNowBtn.addEventListener('click', function () {
        const totalEl = document.getElementById('totalCost');
        const servicePlanInput = document.querySelector('input[name="servicePlan"]:checked');
        const distanceInput = document.getElementById('distance');

        if (!totalEl || !servicePlanInput || !distanceInput) return;

        // Get current quote details
        const total = totalEl.textContent;
        const plan = servicePlanInput.value;
        const distance = distanceInput.value;

        // Store quote data
        const quoteData = {
            total: total,
            plan: plan,
            distance: distance,
            timestamp: new Date().toISOString()
        };

        console.log('Booking with quote:', quoteData);

        // Show success message
        showNotification('Redirecting to booking page...', 'success');

        // In production, redirect to booking page with quote data
        setTimeout(() => {
            window.location.href = 'booking.html?quote=' + btoa(JSON.stringify(quoteData));
        }, 1500);
    });
}

// Save Quote Button
const saveQuoteBtn = document.querySelector('.save-quote-btn');
if (saveQuoteBtn) {
    saveQuoteBtn.addEventListener('click', function () {
        const totalEl = document.getElementById('totalCost');
        const baseCostEl = document.getElementById('baseCost');
        const servicePlanInput = document.querySelector('input[name="servicePlan"]:checked');
        const distanceInput = document.getElementById('distance');
        const vehicleTypeSelect = document.getElementById('vehicleType');
        const fromZipInput = document.getElementById('fromZip');
        const toZipInput = document.getElementById('toZip');

        if (!totalEl || !baseCostEl || !servicePlanInput || !distanceInput || !vehicleTypeSelect) return;

        // Get current quote details
        const quoteData = {
            total: totalEl.textContent,
            baseCost: baseCostEl.textContent,
            plan: servicePlanInput.value,
            distance: distanceInput.value,
            vehicleType: vehicleTypeSelect.value,
            fromZip: fromZipInput ? fromZipInput.value : '',
            toZip: toZipInput ? toZipInput.value : '',
            addons: Array.from(document.querySelectorAll('input[name="addon"]:checked')).map(el => el.value),
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
        savedQuotes.push(quoteData);
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));

        console.log('Quote saved:', quoteData);

        // Show success message
        showNotification('Quote saved successfully!', 'success');

        // Optionally, generate a quote ID and show it
        const quoteId = 'Q' + Date.now().toString(36).toUpperCase();
        setTimeout(() => {
            showNotification(`Quote ID: ${quoteId}`, 'info');
        }, 2000);
    });
}

// Discount Buttons
function initDiscountButtons() {
    const contactBtn = document.querySelector('.contact-btn');
    const referralBtn = document.querySelector('.referral-btn');

    if (contactBtn) {
        contactBtn.addEventListener('click', function () {
            // Navigate to contact page or open modal
            window.location.href = 'contact.html?subject=corporate';
        });
    }

    if (referralBtn) {
        referralBtn.addEventListener('click', function () {
            // Generate referral link
            const referralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const referralLink = `${window.location.origin}/booking.html?ref=${referralCode}`;

            // Copy to clipboard
            navigator.clipboard.writeText(referralLink).then(() => {
                showNotification(`Referral link copied! Code: ${referralCode}`, 'success');
            }).catch(() => {
                // Fallback - show in alert
                prompt('Your referral link (Ctrl+C to copy):', referralLink);
            });
        });
    }
}

// Offer Buttons
function initOfferButtons() {
    const claimOfferBtns = document.querySelectorAll('.claim-offer-btn');
    const notifyBtns = document.querySelectorAll('.notify-btn');

    claimOfferBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const offerCard = this.closest('.offer-card');
            const offerNameEl = offerCard ? offerCard.querySelector('h3') : null;
            const offerName = offerNameEl ? offerNameEl.textContent : 'Offer';

            // Apply offer to calculator (placeholder behaviour)
            showNotification(`${offerName} applied to your quote!`, 'success');

            // Scroll to calculator
            const calculatorSection = document.querySelector('.price-calculator');
            if (calculatorSection) {
                calculatorSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    notifyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const btnText = this.textContent.trim();

            if (btnText === 'Notify Me') {
                const email = prompt('Enter your email to be notified when this offer starts:');
                if (email && isValidEmail(email)) {
                    console.log('Notification signup:', email);
                    showNotification('You will be notified when this offer starts!', 'success');
                    this.textContent = 'Notification Set';
                    this.disabled = true;
                }
            } else if (btnText === 'Learn More') {
                const offerCard = this.closest('.offer-card');
                const offerNameEl = offerCard ? offerCard.querySelector('h3') : null;
                const offerName = offerNameEl ? offerNameEl.textContent : 'This offer';
                alert(`${offerName} - Contact us for more details about this seasonal offer.`);
            }
        });
    });
}

// Pricing FAQ Accordion
function initPricingFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item-accordion');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!button || !answer) return;

        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Optional: single-open behaviour
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    const otherButton = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (!otherButton || !otherAnswer) return;
                    otherButton.setAttribute('aria-expanded', 'false');
                    otherAnswer.hidden = true;
                    otherItem.classList.remove('is-open');
                }
            });

            button.setAttribute('aria-expanded', String(!isExpanded));
            answer.hidden = isExpanded;
            item.classList.toggle('is-open', !isExpanded);
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#2563eb',
        warning: '#ffc107'
    };

    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Validation Helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Indian PIN Code Zones Mapping
const PIN_ZONES = {
    '1': 'North', '2': 'North',
    '3': 'West', '4': 'West',
    '5': 'South', '6': 'South',
    '7': 'East', '8': 'East',
    '9': 'Special'
};

// ZIP Code Auto-Distance Calculation (Pro-Grade)
const fromZipInput = document.getElementById('fromZip');
const toZipInput = document.getElementById('toZip');

if (fromZipInput) fromZipInput.addEventListener('input', updateDistance);
if (toZipInput) toZipInput.addEventListener('input', updateDistance);

async function updateDistance() {
    const fromZipEl = document.getElementById('fromZip');
    const toZipEl = document.getElementById('toZip');
    const distanceInput = document.getElementById('distance');
    const distanceHint = document.querySelector('#distance + small') || createHint(distanceInput);

    if (!fromZipEl || !toZipEl || !distanceInput) return;

    const fromVal = fromZipEl.value.trim();
    const toVal = toZipEl.value.trim();

    // Indian PIN Codes are 6 digits
    if (fromVal.length === 6 && toVal.length === 6) {
        // Show loading state
        distanceHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking route...';
        distanceHint.style.color = 'var(--accent-color, #ff6347)';

        // Small artificial delay for "Realism"
        await new Promise(resolve => setTimeout(resolve, 600));

        // Deterministic logic based on PIN Zones
        const zone1 = fromVal[0];
        const zone2 = toVal[0];

        // Use PIN values for deterministic sub-variance
        const pin1 = parseInt(fromVal);
        const pin2 = parseInt(toVal);
        const subVariance = Math.abs(pin1 - pin2) % 100;

        let distance;
        if (fromVal === toVal) {
            distance = 15; // Same locality
        } else if (zone1 === zone2) {
            // Intrazone (Same region)
            distance = 100 + (Math.abs(pin1 - pin2) % 400);
        } else {
            // Interzone (Different regions)
            const zoneDiff = Math.abs(parseInt(zone1) - parseInt(zone2));
            distance = 400 + (zoneDiff * 350) + subVariance;
        }

        distanceInput.value = distance;
        distanceHint.textContent = `Estimated distance: ${distance} miles (${PIN_ZONES[zone1] || 'Zone'} to ${PIN_ZONES[zone2] || 'Zone'})`;
        distanceHint.style.color = '';

        calculatePrice();
    } else if (fromVal.length > 0 || toVal.length > 0) {
        distanceHint.textContent = "Enter 6-digit PIN codes for auto-calculation";
        distanceHint.style.color = '#888';
    }
}

function createHint(input) {
    const hint = document.createElement('small');
    hint.style.display = 'block';
    hint.style.marginTop = '5px';
    input.parentNode.appendChild(hint);
    return hint;
}



// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Export functions for external use
window.pricingCalculator = {
    calculatePrice,
    showNotification
};
