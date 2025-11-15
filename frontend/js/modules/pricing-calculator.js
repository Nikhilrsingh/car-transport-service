// Pricing Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
    initPlanSelection();
    initDiscountButtons();
    initOfferButtons();
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
    
    // Add event listeners to all inputs for real-time calculation
    inputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });
    
    // Calculate button click
    calculateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calculatePrice();
        
        // Scroll to summary
        document.querySelector('.price-summary').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    });
    
    // Initial calculation
    calculatePrice();
}

// Calculate Price Function
function calculatePrice() {
    // Get form values
    const distance = parseFloat(document.getElementById('distance').value) || 500;
    const vehicleType = document.getElementById('vehicleType').value;
    const vehicleCondition = document.getElementById('vehicleCondition').value;
    const servicePlan = document.querySelector('input[name="servicePlan"]:checked').value;
    
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
    addonsList.innerHTML = '';
    
    selectedAddons.forEach(addon => {
        const addonValue = addon.value;
        const addonPrice = PRICING_CONFIG.addons[addonValue];
        addonTotal += addonPrice;
        
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
    
    // Apply discounts (could be based on promo codes, bulk orders, etc.)
    let discount = 0;
    // Example: 5% discount for distances over 1000 miles
    if (distance > 1000) {
        discount = subtotal * 0.05;
    }
    
    // Calculate total
    const total = subtotal - discount;
    
    // Update display
    document.getElementById('baseCost').textContent = `$${baseCost.toFixed(2)}`;
    
    // Show/hide vehicle type adjustment
    const vehicleTypeRow = document.getElementById('vehicleTypeRow');
    if (vehicleMultiplier !== 1.0) {
        vehicleTypeRow.style.display = 'flex';
        document.getElementById('vehicleTypeCost').textContent = `$${vehicleTypeAdjustment.toFixed(2)}`;
    } else {
        vehicleTypeRow.style.display = 'none';
    }
    
    // Show/hide condition fee
    const conditionRow = document.getElementById('conditionRow');
    if (nonRunningFee > 0) {
        conditionRow.style.display = 'flex';
        document.getElementById('conditionCost').textContent = `$${nonRunningFee.toFixed(2)}`;
    } else {
        conditionRow.style.display = 'none';
    }
    
    // Show/hide discount
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-$${discount.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }
    
    // Update total
    document.getElementById('totalCost').textContent = `$${total.toFixed(2)}`;
}

// Plan Selection from Comparison Table
function initPlanSelection() {
    const planButtons = document.querySelectorAll('.select-plan-btn');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            
            // Select the corresponding radio button in calculator
            const radioButton = document.querySelector(`input[name="servicePlan"][value="${plan}"]`);
            if (radioButton) {
                radioButton.checked = true;
                calculatePrice();
            }
            
            // Scroll to calculator
            document.querySelector('.price-calculator').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
}

// Book Now Button
const bookNowBtn = document.querySelector('.book-now-btn');
if (bookNowBtn) {
    bookNowBtn.addEventListener('click', function() {
        // Get current quote details
        const total = document.getElementById('totalCost').textContent;
        const plan = document.querySelector('input[name="servicePlan"]:checked').value;
        const distance = document.getElementById('distance').value;
        
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
    saveQuoteBtn.addEventListener('click', function() {
        // Get current quote details
        const quoteData = {
            total: document.getElementById('totalCost').textContent,
            baseCost: document.getElementById('baseCost').textContent,
            plan: document.querySelector('input[name="servicePlan"]:checked').value,
            distance: document.getElementById('distance').value,
            vehicleType: document.getElementById('vehicleType').value,
            fromZip: document.getElementById('fromZip').value,
            toZip: document.getElementById('toZip').value,
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
        contactBtn.addEventListener('click', function() {
            // Navigate to contact page or open modal
            window.location.href = 'contact.html?subject=corporate';
        });
    }
    
    if (referralBtn) {
        referralBtn.addEventListener('click', function() {
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
        btn.addEventListener('click', function() {
            const offerCard = this.closest('.offer-card');
            const offerName = offerCard.querySelector('h3').textContent;
            
            // Apply offer to calculator
            showNotification(`${offerName} applied to your quote!`, 'success');
            
            // Scroll to calculator
            document.querySelector('.price-calculator').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    notifyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            
            if (btnText === 'Notify Me') {
                // Email notification signup
                const email = prompt('Enter your email to be notified when this offer starts:');
                if (email && isValidEmail(email)) {
                    console.log('Notification signup:', email);
                    showNotification('You will be notified when this offer starts!', 'success');
                    this.textContent = 'Notification Set';
                    this.disabled = true;
                }
            } else if (btnText === 'Learn More') {
                // Show more info
                const offerCard = this.closest('.offer-card');
                const offerName = offerCard.querySelector('h3').textContent;
                alert(`${offerName} - Contact us for more details about this seasonal offer.`);
            }
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
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
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
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Validation Helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ZIP Code Auto-Distance Calculation (Mock)
// In production, this would use a real geocoding API
document.getElementById('fromZip').addEventListener('blur', updateDistance);
document.getElementById('toZip').addEventListener('blur', updateDistance);

function updateDistance() {
    const fromZip = document.getElementById('fromZip').value;
    const toZip = document.getElementById('toZip').value;
    
    if (fromZip && toZip && fromZip.length >= 5 && toZip.length >= 5) {
        // Mock distance calculation
        // In production, use Google Maps Distance Matrix API or similar
        const mockDistance = Math.floor(Math.random() * 2000) + 100;
        document.getElementById('distance').value = mockDistance;
        document.querySelector('#distance + small').textContent = `Approximately ${mockDistance} miles`;
        
        // Recalculate price
        calculatePrice();
    }
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export functions for external use
window.pricingCalculator = {
    calculatePrice,
    showNotification
};
