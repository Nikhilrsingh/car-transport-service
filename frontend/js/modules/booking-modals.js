// ============================================
// BOOKING MODALS MANAGEMENT
// ============================================

// ========================================
// BOOKING MANAGEMENT FUNCTIONS
// ========================================
function openManageBooking() {
    document.getElementById('manageBookingModal').classList.add('show');
}

function closeManageBooking() {
    document.getElementById('manageBookingModal').classList.remove('show');
}

function editBooking() {
    closeManageBooking();
    showToast('Edit Mode', 'You can now edit your booking details', 'info', 3000);
    // Enable all form fields
    const inputs = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
    inputs.forEach(input => input.disabled = false);
}

// ========================================
// RESCHEDULE FUNCTIONS
// ========================================
function openRescheduleModal() {
    closeManageBooking();
    document.getElementById('rescheduleModal').classList.add('show');
    
    // Set minimum date to today
    const dateInput = document.getElementById('newPickupDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function closeRescheduleModal() {
    document.getElementById('rescheduleModal').classList.remove('show');
}

function confirmReschedule() {
    const newDate = document.getElementById('newPickupDate').value;
    const newTime = document.getElementById('newPickupTime').value;
    
    if (!newDate) {
        showToast('Error', 'Please select a new pickup date', 'error', 3000);
        return;
    }
    
    // Calculate fee based on time difference
    const currentDate = new Date(document.getElementById('pickupDate').value);
    const selectedDate = new Date(newDate);
    const hoursDiff = (selectedDate - currentDate) / (1000 * 60 * 60);
    
    let fee = 0;
    if (hoursDiff < 24) fee = 1000;
    else if (hoursDiff < 48) fee = 500;
    
    const message = fee === 0 
        ? 'Booking rescheduled successfully! No fee charged.'
        : `Booking rescheduled successfully! Fee: ₹${fee}`;
    
    // Update the form
    document.getElementById('pickupDate').value = newDate;
    document.getElementById('pickupTime').value = newTime;
    
    closeRescheduleModal();
    showToast('Rescheduled', message, 'success', 4000);
    updateBookingSummary();
    triggerAutoSave();
}

// ========================================
// CANCEL BOOKING FUNCTIONS
// ========================================
function openCancelModal() {
    closeManageBooking();
    document.getElementById('cancelModal').classList.add('show');
}

function closeCancelModal() {
    document.getElementById('cancelModal').classList.remove('show');
}

function confirmCancellation() {
    const reason = document.getElementById('cancelReason').value;
    
    if (!reason.trim()) {
        showToast('Error', 'Please provide a reason for cancellation', 'error', 3000);
        return;
    }
    
    // Calculate refund percentage
    const pickupDate = new Date(document.getElementById('pickupDate').value);
    const now = new Date();
    const hoursDiff = (pickupDate - now) / (1000 * 60 * 60);
    
    let refundPercentage = 25;
    if (hoursDiff > 72) refundPercentage = 100;
    else if (hoursDiff > 48) refundPercentage = 75;
    else if (hoursDiff > 24) refundPercentage = 50;
    
    closeCancelModal();
    
    // Clear form and localStorage
    document.getElementById('bookingForm').reset();
    localStorage.removeItem('bookingDraft');
    clearRoute();
    
    showToast(
        'Booking Cancelled',
        `Your booking has been cancelled. ${refundPercentage}% refund will be processed in 5-7 business days.`,
        'success',
        5000
    );
    
    // Reset to step 1
    currentStep = 1;
    updateStepDisplay();
    updateProgressBar();
}

// ========================================
// TRANSFER BOOKING FUNCTIONS
// ========================================
function openTransferModal() {
    closeManageBooking();
    document.getElementById('transferModal').classList.add('show');
}

function closeTransferModal() {
    document.getElementById('transferModal').classList.remove('show');
}

function confirmTransfer() {
    const name = document.getElementById('transferName').value;
    const email = document.getElementById('transferEmail').value;
    const phone = document.getElementById('transferPhone').value;
    
    if (!name || !email || !phone) {
        showToast('Error', 'Please fill all recipient details', 'error', 3000);
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Error', 'Please enter a valid email address', 'error', 3000);
        return;
    }
    
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
        showToast('Error', 'Please enter a valid 10-digit phone number', 'error', 3000);
        return;
    }
    
    closeTransferModal();
    showToast(
        'Transfer Initiated',
        `Booking transfer to ${name} initiated. They will receive confirmation via email and SMS.`,
        'success',
        5000
    );
}

// ========================================
// UPGRADE/DOWNGRADE FUNCTIONS
// ========================================
function openUpgradeModal() {
    closeManageBooking();
    const currentType = document.getElementById('vehicleType').value;
    document.getElementById('currentVehicleType').textContent = formatVehicleType(currentType);
    document.getElementById('upgradeModal').classList.add('show');
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').classList.remove('show');
}

function calculateUpgradeFee() {
    const currentType = document.getElementById('vehicleType').value;
    const newType = document.getElementById('newVehicleType').value;
    
    if (!newType || newType === currentType) {
        document.getElementById('upgradeFeeStructure').style.display = 'none';
        return;
    }
    
    const prices = {
        'hatchback': 2000,
        'sedan': 2500,
        'suv': 3500,
        'luxury': 5000,
        'bike': 1500,
        'commercial': 4000
    };
    
    const currentPrice = prices[currentType] || 2500;
    const newPrice = prices[newType] || 2500;
    const difference = newPrice - currentPrice;
    
    document.getElementById('upgradeFeeStructure').style.display = 'block';
    document.getElementById('originalPrice').textContent = '₹ ' + currentPrice.toLocaleString();
    
    const adjustmentLabel = document.getElementById('adjustmentLabel');
    const adjustmentAmount = document.getElementById('adjustmentAmount');
    
    if (difference > 0) {
        adjustmentLabel.textContent = 'Upgrade Fee';
        adjustmentAmount.textContent = '+₹ ' + difference.toLocaleString();
        adjustmentAmount.style.color = '#ff6347';
    } else if (difference < 0) {
        adjustmentLabel.textContent = 'Downgrade Refund';
        adjustmentAmount.textContent = '-₹ ' + Math.abs(difference).toLocaleString();
        adjustmentAmount.style.color = '#4CAF50';
    } else {
        adjustmentLabel.textContent = 'No Change';
        adjustmentAmount.textContent = '₹ 0';
    }
    
    const newTotal = currentPrice + difference;
    document.getElementById('newTotalPrice').textContent = '₹ ' + newTotal.toLocaleString();
}

function confirmVehicleChange() {
    const newType = document.getElementById('newVehicleType').value;
    
    if (!newType) {
        showToast('Error', 'Please select a vehicle type', 'error', 3000);
        return;
    }
    
    // Update the vehicle type
    document.getElementById('vehicleType').value = newType;
    
    closeUpgradeModal();
    showToast('Vehicle Updated', 'Vehicle type changed successfully', 'success', 3000);
    updatePriceCalculation();
    updateBookingSummary();
    triggerAutoSave();
}

function openAddonsModal() {
    closeManageBooking();
    showToast('Add Services', 'Select add-on services from Step 1', 'info', 3000);
    currentStep = 1;
    updateStepDisplay();
    updateProgressBar();
}

// ========================================
// SAVE & CONTINUE LATER
// ========================================
function openSaveEmailModal() {
    const modal = document.getElementById('saveEmailModal');
    const emailInput = document.getElementById('saveEmail');
    
    // Pre-fill with form email if available
    const formEmail = document.getElementById('email').value;
    if (formEmail) {
        emailInput.value = formEmail;
    }
    
    modal.classList.add('show');
}

function closeSaveEmailModal() {
    document.getElementById('saveEmailModal').classList.remove('show');
}

function sendSaveLink() {
    const emailInput = document.getElementById('saveEmail');
    const email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Invalid Email', 'Please enter a valid email address', 'error', 3000);
        emailInput.focus();
        return;
    }

    // Save current form state
    autoSaveForm();

    // Generate a unique link token
    const token = generateToken();
    const linkData = {
        token: token,
        email: email,
        formData: localStorage.getItem('bookingDraft'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    // Save to localStorage (in production, this would be sent to server)
    localStorage.setItem('saveLink_' + token, JSON.stringify(linkData));

    // Generate the link
    const currentUrl = window.location.href.split('?')[0];
    const saveLink = `${currentUrl}?resume=${token}`;

    // In production, send email via backend API
    // For demo, show the link
    showToast('Link Generated', 'In production, an email would be sent. Link copied to clipboard!', 'success', 5000);
    
    // Copy to clipboard
    navigator.clipboard.writeText(saveLink).then(() => {
        console.log('Resume link:', saveLink);
    });

    closeSaveEmailModal();

    // Simulate email sending (in production, call backend API)
    setTimeout(() => {
        showToast('Email Sent', `Resume link sent to ${email}`, 'success', 4000);
    }, 1000);
}

function generateToken() {
    return 'BK' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function checkResumeLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeToken = urlParams.get('resume');

    if (resumeToken) {
        const linkData = localStorage.getItem('saveLink_' + resumeToken);
        if (linkData) {
            try {
                const data = JSON.parse(linkData);
                const expiresAt = new Date(data.expiresAt);
                
                if (new Date() > expiresAt) {
                    showToast('Link Expired', 'This resume link has expired', 'error', 4000);
                    localStorage.removeItem('saveLink_' + resumeToken);
                    return;
                }

                // Restore the form data
                if (data.formData) {
                    localStorage.setItem('bookingDraft', data.formData);
                    restoreFormData();
                    showToast('Booking Restored', 'Your booking has been restored from the link', 'success', 4000);
                }

                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error('Error restoring from link:', e);
            }
        }
    }
}

// ========================================
// CART ABANDONMENT RECOVERY
// ========================================
let abandonmentTimer = null;
let abandonmentShown = false;

function startAbandonmentTimer() {
    // Show abandonment banner after 2 minutes of inactivity
    clearTimeout(abandonmentTimer);
    abandonmentTimer = setTimeout(() => {
        if (!abandonmentShown && currentStep > 1) {
            showAbandonmentBanner();
        }
    }, 120000); // 2 minutes
}

function showAbandonmentBanner() {
    const banner = document.getElementById('abandonmentBanner');
    const totalPrice = parseFloat(document.getElementById('totalPrice').textContent.replace(/[₹,]/g, '')) || 0;
    const discount = Math.round(totalPrice * 0.1);
    
    document.getElementById('discountAmount').textContent = discount;
    banner.classList.add('show');
    abandonmentShown = true;
    
    // Track abandonment
    trackAnalytics('cart_abandonment', {
        step: currentStep,
        total: totalPrice,
        discount_offered: discount
    });
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
        closeAbandonmentBanner();
    }, 30000);
}

function closeAbandonmentBanner() {
    document.getElementById('abandonmentBanner').classList.remove('show');
}

// Reset timer on user activity
document.addEventListener('mousemove', startAbandonmentTimer);
document.addEventListener('keypress', startAbandonmentTimer);
document.addEventListener('click', startAbandonmentTimer);

// Export functions for global access
if (typeof window !== 'undefined') {
    window.openManageBooking = openManageBooking;
    window.closeManageBooking = closeManageBooking;
    window.editBooking = editBooking;
    window.openRescheduleModal = openRescheduleModal;
    window.closeRescheduleModal = closeRescheduleModal;
    window.confirmReschedule = confirmReschedule;
    window.openCancelModal = openCancelModal;
    window.closeCancelModal = closeCancelModal;
    window.confirmCancellation = confirmCancellation;
    window.openTransferModal = openTransferModal;
    window.closeTransferModal = closeTransferModal;
    window.confirmTransfer = confirmTransfer;
    window.openUpgradeModal = openUpgradeModal;
    window.closeUpgradeModal = closeUpgradeModal;
    window.calculateUpgradeFee = calculateUpgradeFee;
    window.confirmVehicleChange = confirmVehicleChange;
    window.openAddonsModal = openAddonsModal;
    window.openSaveEmailModal = openSaveEmailModal;
    window.closeSaveEmailModal = closeSaveEmailModal;
    window.sendSaveLink = sendSaveLink;
    window.checkResumeLink = checkResumeLink;
    window.closeAbandonmentBanner = closeAbandonmentBanner;
}
