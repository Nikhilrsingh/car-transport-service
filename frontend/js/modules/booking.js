/**
 * Booking Module - Enhanced Multi-Step Booking System
 * Handles form validation, step management, price calculation, and booking summary
 */

class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.validationRules = {
            fullName: (val) => val.trim().length >= 2,
            phone: (val) => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')),
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            vehicleType: (val) => val.trim() !== '',
            pickupLocation: (val) => val.trim() !== '',
            dropLocation: (val) => val.trim() !== '',
            pickupDate: (val) => val !== ''
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressBar();
        this.initializeDateInput();
    }

    setupEventListeners() {
        // Form input validation
        const validationFields = ['fullName', 'phone', 'email', 'vehicleType', 
                                  'pickupLocation', 'dropLocation', 'pickupDate'];
        
        validationFields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', () => {
                    this.validateField(field, input.value);
                    this.updateBookingSummary();
                });
                
                input.addEventListener('blur', () => {
                    this.validateField(field, input.value);
                });
            }
        });

        // Character counter
        const additionalInfo = document.getElementById('additionalInfo');
        if (additionalInfo) {
            additionalInfo.addEventListener('input', () => this.updateCharacterCount());
        }

        // Phone formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        // Price calculator
        const vehicleType = document.getElementById('vehicleType');
        if (vehicleType) {
            vehicleType.addEventListener('change', () => {
                this.updatePriceCalculation();
                this.updateBookingSummary();
            });
        }

        const distanceSlider = document.getElementById('distanceSlider');
        if (distanceSlider) {
            distanceSlider.addEventListener('input', () => {
                this.updatePriceCalculation();
                this.updateBookingSummary();
            });
        }

        // Date and time changes
        const pickupDate = document.getElementById('pickupDate');
        const pickupTime = document.getElementById('pickupTime');
        
        if (pickupDate) {
            pickupDate.addEventListener('change', () => this.updateBookingSummary());
        }
        
        if (pickupTime) {
            pickupTime.addEventListener('change', () => this.updateBookingSummary());
        }

        // Form submission
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    // Step Management
    nextStep() {
        if (!this.validateStep(this.currentStep)) {
            this.showToast('Validation Error', 'Please fill all required fields correctly', 'error', 3000);
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.updateProgressBar();
            
            if (this.currentStep === 3) {
                this.populateReviewSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgressBar();
        }
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }

        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Scroll to top
        const formContainer = document.querySelector('.booking-form-container');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const percentage = Math.round((this.currentStep / this.totalSteps) * 100);

        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
    }

    // Validation
    validateStep(step) {
        let isValid = true;
        let fields = [];

        if (step === 1) {
            fields = ['fullName', 'phone', 'email', 'vehicleType'];
        } else if (step === 2) {
            fields = ['pickupLocation', 'dropLocation', 'pickupDate'];
        }

        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && !this.validateField(field, input.value)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(fieldName, value) {
        const validator = this.validationRules[fieldName];
        if (!validator) return true;

        const isValid = validator(value);
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = input?.closest('.form-group');
        const validationIcon = formGroup?.querySelector('.validation-icon');

        if (isValid) {
            input?.classList.remove('error');
            formGroup?.classList.add('valid');
            if (errorElement) errorElement.style.display = 'none';
            if (validationIcon) {
                validationIcon.className = 'validation-icon success';
            }
        } else {
            input?.classList.add('error');
            formGroup?.classList.remove('valid');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = this.getErrorMessage(fieldName);
            }
            if (validationIcon) {
                validationIcon.className = 'validation-icon error';
            }
            input?.classList.add('shake');
            setTimeout(() => input?.classList.remove('shake'), 500);
        }

        return isValid;
    }

    getErrorMessage(field) {
        const messages = {
            fullName: 'Please enter your full name (min 2 characters)',
            phone: 'Please enter a valid 10-digit Indian phone number',
            email: 'Please enter a valid email address',
            vehicleType: 'Please select vehicle type',
            pickupLocation: 'Please enter pickup location',
            dropLocation: 'Please enter drop location',
            pickupDate: 'Please select pickup date'
        };
        return messages[field] || 'This field is required';
    }

    // Summary Updates
    updateBookingSummary() {
        const form = document.getElementById('bookingForm');
        if (!form) return;
        
        const formData = new FormData(form);
        
        this.updateSummaryField('summaryName', formData.get('fullName'));
        this.updateSummaryField('summaryPhone', formData.get('phone'));
        this.updateSummaryField('summaryEmail', formData.get('email'));
        this.updateSummaryField('summaryVehicleType', this.formatVehicleType(formData.get('vehicleType')));
        this.updateSummaryField('summaryVehicleModel', formData.get('vehicleModel') || 'Not provided');
        this.updateSummaryField('summaryPickup', formData.get('pickupLocation'), 'Not set');
        this.updateSummaryField('summaryDrop', formData.get('dropLocation'), 'Not set');
        this.updateSummaryField('summaryDate', this.formatDate(formData.get('pickupDate')), 'Not selected');
        this.updateSummaryField('summaryTime', this.formatTime(formData.get('pickupTime')));
        
        this.updateDeliveryEstimate(formData.get('pickupDate'));
    }

    updateSummaryField(elementId, value, defaultText = 'Not provided') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (value && value.trim() !== '') {
            element.textContent = value;
            element.classList.remove('empty');
        } else {
            element.textContent = defaultText;
            element.classList.add('empty');
        }
    }

    updateDeliveryEstimate(pickupDateStr) {
        const estimateEl = document.getElementById('estimatedDelivery');
        if (!estimateEl || !pickupDateStr) return;
        
        const pickupDate = new Date(pickupDateStr);
        const deliveryDate = new Date(pickupDate);
        const distance = parseFloat(document.getElementById('distanceSlider')?.value || 0);
        const days = Math.ceil(distance / 400) + 1;
        deliveryDate.setDate(deliveryDate.getDate() + days);
        
        estimateEl.textContent = deliveryDate.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    }

    populateReviewSummary() {
        const reviewContent = document.getElementById('reviewContent');
        if (!reviewContent) return;
        
        const form = document.getElementById('bookingForm');
        const formData = new FormData(form);
        
        let html = '<div style="display: grid; gap: 15px;">';
        
        html += this.createReviewSection('user', 'Personal Information', [
            { label: 'Name', value: formData.get('fullName') },
            { label: 'Phone', value: formData.get('phone') },
            { label: 'Email', value: formData.get('email') }
        ]);
        
        html += this.createReviewSection('car', 'Vehicle Details', [
            { label: 'Type', value: this.formatVehicleType(formData.get('vehicleType')) },
            { label: 'Model', value: formData.get('vehicleModel') || 'Not specified' }
        ]);
        
        html += this.createReviewSection('route', 'Transport Details', [
            { label: 'From', value: formData.get('pickupLocation') },
            { label: 'To', value: formData.get('dropLocation') },
            { label: 'Date', value: this.formatDate(formData.get('pickupDate')) },
            { label: 'Time', value: this.formatTime(formData.get('pickupTime')) }
        ]);
        
        html += '</div>';
        reviewContent.innerHTML = html;
    }

    createReviewSection(icon, title, items) {
        let html = '<div>';
        html += `<h5 style="color: #ff6347; margin-bottom: 10px;"><i class="fas fa-${icon}"></i> ${title}</h5>`;
        items.forEach(item => {
            html += `<p style="color: #ccc; margin: 5px 0;"><strong>${item.label}:</strong> ${item.value || 'Not provided'}</p>`;
        });
        html += '</div>';
        return html;
    }

    // Price Calculator
    updatePriceCalculation() {
        const distance = parseFloat(document.getElementById('distanceSlider')?.value || 0);
        const vehicleType = document.getElementById('vehicleType')?.value;
        
        const baseFares = {
            'hatchback': 2000,
            'sedan': 2500,
            'suv': 3500,
            'luxury': 5000,
            'bike': 1500,
            'commercial': 4000
        };
        
        const baseFare = baseFares[vehicleType] || 2000;
        const distanceCharge = distance * 15;
        const subtotal = baseFare + distanceCharge;
        const gst = subtotal * 0.18;
        let total = subtotal + gst;
        
        const isFirstBooking = true;
        if (isFirstBooking && distance > 0) {
            total = total * 0.9;
            const discountBadge = document.getElementById('discountBadge');
            if (discountBadge) discountBadge.style.display = 'block';
        } else {
            const discountBadge = document.getElementById('discountBadge');
            if (discountBadge) discountBadge.style.display = 'none';
        }
        
        this.animateValue('baseFare', baseFare);
        this.animateValue('distanceCharge', distanceCharge);
        this.animateValue('gst', gst);
        this.animateValue('totalPrice', total);
        
        const distanceValue = document.getElementById('distanceValue');
        if (distanceValue) distanceValue.textContent = distance + ' km';
    }

    animateValue(elementId, endValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = parseFloat(element.textContent.replace(/[₹,]/g, '')) || 0;
        const duration = 500;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = startValue + (endValue - startValue) * progress;
            element.textContent = '₹ ' + Math.round(currentValue).toLocaleString('en-IN');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

    // Utilities
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.substring(0, 10);
            if (value.length > 5) {
                value = value.substring(0, 5) + ' ' + value.substring(5);
            }
        }
        e.target.value = value;
    }

    updateCharacterCount() {
        const textarea = document.getElementById('additionalInfo');
        const counter = document.getElementById('charCount');
        if (!textarea || !counter) return;
        
        const count = textarea.value.length;
        const maxLength = 500;
        
        counter.textContent = count;
        const counterParent = counter.parentElement;
        counterParent.classList.remove('warning', 'danger');
        
        if (count > maxLength * 0.9) {
            counterParent.classList.add('danger');
        } else if (count > maxLength * 0.7) {
            counterParent.classList.add('warning');
        }
    }

    initializeDateInput() {
        const dateInput = document.getElementById('pickupDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    formatVehicleType(type) {
        const types = {
            'hatchback': 'Hatchback',
            'sedan': 'Sedan',
            'suv': 'SUV',
            'luxury': 'Luxury Car',
            'bike': 'Motorcycle',
            'commercial': 'Commercial Vehicle'
        };
        return types[type] || type;
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Not selected';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    formatTime(time) {
        const times = {
            'any': 'Any Time',
            'morning': 'Morning (8 AM - 12 PM)',
            'afternoon': 'Afternoon (12 PM - 5 PM)',
            'evening': 'Evening (5 PM - 8 PM)'
        };
        return times[time] || 'Any Time';
    }

    // Form Submission
    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateStep(3)) {
            this.showToast('Validation Error', 'Please check all fields', 'error', 3000);
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
        }

        setTimeout(() => {
            const reference = this.generateBookingRef();
            const bookingRef = document.getElementById('bookingRef');
            if (bookingRef) {
                bookingRef.textContent = reference;
            }

            this.createConfetti();

            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.style.display = 'flex';
            }

            const form = document.getElementById('bookingForm');
            if (form) {
                form.reset();
            }

            this.currentStep = 1;
            this.updateStepDisplay();
            this.updateProgressBar();
            this.updateBookingSummary();

            if (window.clearRoute) {
                window.clearRoute();
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Confirm Booking</span>';
            }

            this.showToast('Booking Confirmed!', `Your booking reference is ${reference}`, 'success', 5000);
        }, 2000);
    }

    generateBookingRef() {
        const prefix = 'HC';
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}${year}-${randomNum}`;
    }

    createConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;
        
        const colors = ['#ff6347', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF9800'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
    }

    showToast(title, message, type = 'success', duration = 5000) {
        if (window.showToast) {
            window.showToast(title, message, type, duration);
        }
    }
}

// PDF and Print functions
function downloadPDF() {
    if (window.showToast) {
        window.showToast('Download', 'PDF generation feature coming soon!', 'info', 3000);
    }
}

function printSummary() {
    window.print();
}

// Navigation functions (called from HTML onclick)
function nextStep() {
    if (window.bookingManager) {
        window.bookingManager.nextStep();
    }
}

function prevStep() {
    if (window.bookingManager) {
        window.bookingManager.prevStep();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BookingManager, downloadPDF, printSummary };
}



// ========================================
// GLOBAL VARIABLES
// ========================================
let map;
let pickupMarker;
let dropMarker;
let routingControl;
let pickupCoords = null;
let dropCoords = null;
let selectingPickup = false;
let selectingDrop = false;
let currentStep = 1;
let formData = {};
let autoSaveTimeout = null;
let estimatedDistance = 0;
let estimatedDuration = 0;

// Advanced Map Features
let satelliteLayer = null;
let streetLayer = null;
let trafficLayer = null;
let serviceCentersLayer = null;
let restStopsLayer = null;
let tollPlazasLayer = null;
let is3DView = false;
let showAlternativeRoutes = false;
let alternativeRoutesControls = [];
let currentMapStyle = 'street';
let streetViewActive = false;

// Blackout dates (holidays, maintenance days, etc.)
const blackoutDates = [
    '2025-11-15', // Diwali
    '2025-12-25', // Christmas
    '2025-12-31', // New Year's Eve
    '2026-01-01', // New Year's Day
    '2026-01-26', // Republic Day
    '2026-03-08', // Holi
    '2026-08-15', // Independence Day
    '2026-10-02', // Gandhi Jayanti
];

// City coordinates database for distance calculation
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
    'Panaji': [15.4909, 73.8278]
};

// ========================================
// MULTI-STEP FORM MANAGEMENT
// ========================================
function nextStep() {
    if (!validateStep(currentStep)) {
        showToast('Validation Error', 'Please fill all required fields correctly', 'error', 3000);
        return;
    }

    if (currentStep < 3) {
        currentStep++;
        updateStepDisplay();
        updateProgressBar();
        if (currentStep === 3) {
            populateReviewSummary();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateProgressBar();
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });

    // Scroll to top of form
    document.querySelector('.booking-form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateProgressBar() {
    const progress = ((currentStep - 1) / 2) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressPercentage').textContent = Math.round((currentStep / 3) * 100) + '% Complete';
}

// ========================================
// AUTO-SAVE TO LOCALSTORAGE
// ========================================
function autoSaveForm() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    const data = {
        step: currentStep,
        timestamp: new Date().toISOString(),
        fields: {}
    };

    // Save all form fields
    for (let [key, value] of formData.entries()) {
        data.fields[key] = value;
    }

    // Save coordinates if set
    if (pickupCoords) data.pickupCoords = pickupCoords;
    if (dropCoords) data.dropCoords = dropCoords;

    localStorage.setItem('bookingDraft', JSON.stringify(data));

    // Show auto-save indicator
    const indicator = document.getElementById('autoSaveIndicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

function restoreFormData() {
    const savedData = localStorage.getItem('bookingDraft');
    if (!savedData) return;

    try {
        const data = JSON.parse(savedData);
        const savedTime = new Date(data.timestamp);
        const now = new Date();
        const hoursSinceLastSave = (now - savedTime) / (1000 * 60 * 60);

        // Only restore if saved within last 7 days
        if (hoursSinceLastSave > 168) {
            localStorage.removeItem('bookingDraft');
            return;
        }

        // Ask user if they want to restore
        if (confirm(`Found a draft booking from ${formatTimeAgo(savedTime)}. Would you like to continue where you left off?`)) {
            // Restore form fields
            Object.keys(data.fields).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = data.fields[key];
                    // Trigger validation
                    validateField(key, data.fields[key]);
                }
            });

            // Restore step
            currentStep = data.step || 1;
            updateStepDisplay();
            updateProgressBar();

            // Restore coordinates and map
            // Wait for map to be fully initialized
            const restoreMapData = () => {
                console.log('Restoring map data...', data);

                if (data.pickupCoords) {
                    pickupCoords = data.pickupCoords;
                    console.log('Restoring pickup coords:', pickupCoords);
                    setPickupLocation(pickupCoords[0], pickupCoords[1], data.fields.pickupLocation || data.fields.pickupCity || 'Saved location');
                } else if (data.fields.pickupCity) {
                    // Try to get coordinates from city name
                    const pickupCity = data.fields.pickupCity;
                    console.log('Getting pickup coords for city:', pickupCity);
                    const pickupCoord = cityCoordinates[pickupCity];
                    if (pickupCoord) {
                        console.log('Found pickup coords:', pickupCoord);
                        pickupCoords = pickupCoord;
                        setPickupLocation(pickupCoord[0], pickupCoord[1], pickupCity);
                    }
                }

                if (data.dropCoords) {
                    dropCoords = data.dropCoords;
                    console.log('Restoring drop coords:', dropCoords);
                    setDropLocation(dropCoords[0], dropCoords[1], data.fields.dropLocation || data.fields.dropCity || 'Saved location');
                } else if (data.fields.dropCity) {
                    // Try to get coordinates from city name
                    const dropCity = data.fields.dropCity;
                    console.log('Getting drop coords for city:', dropCity);
                    const dropCoord = cityCoordinates[dropCity];
                    if (dropCoord) {
                        console.log('Found drop coords:', dropCoord);
                        dropCoords = dropCoord;
                        setDropLocation(dropCoord[0], dropCoord[1], dropCity);
                    }
                }

                // Calculate route if both coordinates are available
                setTimeout(() => {
                    if (pickupCoords && dropCoords) {
                        console.log('Calculating route with coords:', pickupCoords, dropCoords);
                        calculateRoute();
                    } else {
                        console.log('Cannot calculate route. Pickup:', pickupCoords, 'Drop:', dropCoords);
                    }
                }, 1500);
            };

            // Ensure map is initialized before restoring markers
            if (map && map._loaded) {
                console.log('Map is ready, restoring data immediately');
                setTimeout(restoreMapData, 500);
            } else {
                console.log('Map not ready, waiting 2 seconds');
                setTimeout(() => {
                    if (map) {
                        console.log('Map ready after wait');
                        restoreMapData();
                    } else {
                        console.error('Map still not initialized');
                    }
                }, 2000);
            }

            // Update summary
            updateBookingSummary();
            calculateDistanceEstimate();

            showToast('Restored', 'Your draft booking has been restored', 'success', 3000);
        } else {
            localStorage.removeItem('bookingDraft');
        }
    } catch (e) {
        console.error('Error restoring form data:', e);
        localStorage.removeItem('bookingDraft');
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function triggerAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(autoSaveForm, 1000); // Debounce by 1 second
}

function validateStep(step) {
    let isValid = true;

    if (step === 1) {
        // Validate personal and vehicle info
        const fields = ['fullName', 'phone', 'email', 'vehicleType'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (!validateField(field, input.value)) {
                isValid = false;
            }
        });
    } else if (step === 2) {
        // Validate location and schedule
        const fields = ['pickupCity', 'dropCity', 'pickupDate'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (!validateField(field, input.value)) {
                isValid = false;
            }
        });
    }

    return isValid;
}

function populateReviewSummary() {
    const reviewContent = document.getElementById('reviewContent');
    const formData = new FormData(document.getElementById('bookingForm'));

    let html = '<div style="display: grid; gap: 15px;">';

    // Personal Info
    html += '<div>';
    html += '<h5 style="color: #ff6347; margin-bottom: 10px;"><i class="fas fa-user"></i> Personal Information</h5>';
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Name:</strong> ${formData.get('fullName') || 'Not provided'}</p>`;
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Phone:</strong> ${formData.get('phone') || 'Not provided'}</p>`;
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Email:</strong> ${formData.get('email') || 'Not provided'}</p>`;
    html += '</div>';

    // Vehicle Info
    html += '<div>';
    html += '<h5 style="color: #ff6347; margin-bottom: 10px;"><i class="fas fa-car"></i> Vehicle Details</h5>';
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Type:</strong> ${formatVehicleType(formData.get('vehicleType'))}</p>`;
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Model:</strong> ${formData.get('vehicleModel') || 'Not specified'}</p>`;
    html += '</div>';

    // Transport Details
    html += '<div>';
    html += '<h5 style="color: #ff6347; margin-bottom: 10px;"><i class="fas fa-route"></i> Transport Details</h5>';
    const pickupCity = formData.get('pickupCity') || formData.get('pickupLocation') || 'Not set';
    const dropCity = formData.get('dropCity') || formData.get('dropLocation') || 'Not set';
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>From:</strong> ${pickupCity}</p>`;
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>To:</strong> ${dropCity}</p>`;
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Date:</strong> ${formatDate(formData.get('pickupDate'))}</p>`;
    html += `<p style="color: #ccc; margin: 5px 0;"><strong>Time:</strong> ${formatTime(formData.get('pickupTime'))}</p>`;
    html += '</div>';

    html += '</div>';
    reviewContent.innerHTML = html;
}

function formatVehicleType(type) {
    const types = {
        'hatchback': 'Hatchback',
        'sedan': 'Sedan',
        'suv': 'SUV',
        'luxury': 'Luxury Car',
        'bike': 'Motorcycle',
        'commercial': 'Commercial Vehicle'
    };
    return types[type] || type;
}

function formatDate(dateStr) {
    if (!dateStr) return 'Not selected';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(time) {
    const times = {
        'any': 'Any Time',
        'morning': 'Morning (8 AM - 12 PM)',
        'afternoon': 'Afternoon (12 PM - 5 PM)',
        'evening': 'Evening (5 PM - 8 PM)'
    };
    return times[time] || 'Any Time';
}

// ========================================
// DISTANCE ESTIMATION
// ========================================
function calculateDistanceEstimate() {
    const pickupCity = document.getElementById('pickupCity').value;
    const dropCity = document.getElementById('dropCity').value;

    if (!pickupCity || !dropCity) {
        estimatedDistance = 0;
        estimatedDuration = 0;
        updateDistanceDisplay();
        return;
    }

    const pickup = cityCoordinates[pickupCity];
    const drop = cityCoordinates[dropCity];

    if (pickup && drop) {
        // Calculate haversine distance
        const R = 6371; // Earth's radius in km
        const lat1 = pickup[0] * Math.PI / 180;
        const lat2 = drop[0] * Math.PI / 180;
        const deltaLat = (drop[0] - pickup[0]) * Math.PI / 180;
        const deltaLon = (drop[1] - pickup[1]) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        estimatedDistance = Math.round(R * c);
        // Estimate driving time at 60 km/h average
        estimatedDuration = Math.round((estimatedDistance / 60) * 10) / 10;

        // Update distance slider
        const distanceSlider = document.getElementById('distanceSlider');
        if (distanceSlider) {
            distanceSlider.value = estimatedDistance;
            document.getElementById('distanceValue').textContent = estimatedDistance + ' km';
        }

        updateDistanceDisplay();
        updatePriceCalculation();
        showToast('Distance Calculated', `Estimated ${estimatedDistance} km (~${estimatedDuration} hours)`, 'success', 3000);
    }
}

function updateDistanceDisplay() {
    const distanceEstimate = document.getElementById('distanceEstimate');
    if (!distanceEstimate) return;

    if (estimatedDistance > 0) {
        distanceEstimate.innerHTML = `
            <div class="label">Estimated Distance</div>
            <div class="distance">${estimatedDistance} km</div>
            <div class="time">~${estimatedDuration} hours drive time</div>
        `;
    } else {
        distanceEstimate.innerHTML = `
            <div class="label">Estimated Distance</div>
            <div class="distance" style="color: #666;">Select cities to calculate</div>
        `;
    }
}

// ========================================
// BLACKOUT DATES VALIDATION
// ========================================
function checkBlackoutDate(dateString) {
    if (!dateString) return false;
    return blackoutDates.includes(dateString);
}

function validatePickupDate() {
    const dateInput = document.getElementById('pickupDate');
    const dateValue = dateInput.value;
    const dateWarning = document.getElementById('dateWarning');

    if (!dateValue) {
        if (dateWarning) dateWarning.classList.remove('show');
        return true;
    }

    // Check if it's a blackout date
    if (checkBlackoutDate(dateValue)) {
        if (dateWarning) {
            dateWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> This date is unavailable due to holiday/maintenance. Please select another date.';
            dateWarning.classList.add('show');
        }
        dateInput.value = '';
        showToast('Date Unavailable', 'Selected date is a blackout date. Please choose another.', 'warning', 4000);
        return false;
    }

    // Check if it's a Sunday (optional restriction)
    const selectedDate = new Date(dateValue);
    if (selectedDate.getDay() === 0) {
        if (dateWarning) {
            dateWarning.innerHTML = '<i class="fas fa-info-circle"></i> Sunday bookings may have limited availability.';
            dateWarning.classList.add('show');
        }
    } else {
        if (dateWarning) dateWarning.classList.remove('show');
    }

    return true;
}

// ========================================
// REAL-TIME VALIDATION
// ========================================
function validateField(fieldName, value) {
    const validators = {
        fullName: (val) => val.trim().length >= 2,
        phone: (val) => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')),
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        vehicleType: (val) => val.trim() !== '',
        pickupCity: (val) => val.trim() !== '',
        dropCity: (val) => val.trim() !== '',
        pickupLocation: (val) => val.trim() !== '',
        dropLocation: (val) => val.trim() !== '',
        pickupDate: (val) => val !== ''
    };

    const validator = validators[fieldName];
    if (!validator) return true;

    const isValid = validator(value);
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    const formGroup = input.closest('.form-group');
    const validationIcon = formGroup.querySelector('.validation-icon');

    if (isValid) {
        input.classList.remove('error');
        formGroup.classList.add('valid');
        if (errorElement) errorElement.style.display = 'none';
        if (validationIcon) {
            validationIcon.className = 'validation-icon success';
        }
    } else {
        input.classList.add('error');
        formGroup.classList.remove('valid');
        if (errorElement) {
            errorElement.style.display = 'block';
            errorElement.textContent = getErrorMessage(fieldName);
        }
        if (validationIcon) {
            validationIcon.className = 'validation-icon error';
        }
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    return isValid;
}

function getErrorMessage(field) {
    const messages = {
        fullName: 'Please enter your full name (min 2 characters)',
        phone: 'Please enter a valid 10-digit Indian phone number',
        email: 'Please enter a valid email address',
        vehicleType: 'Please select vehicle type',
        pickupCity: 'Please select pickup city',
        dropCity: 'Please select drop city',
        pickupLocation: 'Please enter pickup location',
        dropLocation: 'Please enter drop location',
        pickupDate: 'Please select pickup date'
    };
    return messages[field] || 'This field is required';
}

// ========================================
// BOOKING SUMMARY LIVE UPDATE
// ========================================
function updateBookingSummary() {
    const formData = new FormData(document.getElementById('bookingForm'));

    // Update personal info
    updateSummaryField('summaryName', formData.get('fullName'));
    updateSummaryField('summaryPhone', formData.get('phone'));
    updateSummaryField('summaryEmail', formData.get('email'));

    // Update vehicle details
    updateSummaryField('summaryVehicleType', formatVehicleType(formData.get('vehicleType')));
    updateSummaryField('summaryVehicleModel', formData.get('vehicleModel') || 'Not provided');

    // Update transport details (use city names primarily)
    const pickupCity = formData.get('pickupCity') || formData.get('pickupLocation');
    const dropCity = formData.get('dropCity') || formData.get('dropLocation');
    updateSummaryField('summaryPickup', pickupCity, 'Not set');
    updateSummaryField('summaryDrop', dropCity, 'Not set');
    updateSummaryField('summaryDate', formatDate(formData.get('pickupDate')), 'Not selected');
    updateSummaryField('summaryTime', formatTime(formData.get('pickupTime')));

    // Update delivery estimate
    if (formData.get('pickupDate')) {
        const pickupDate = new Date(formData.get('pickupDate'));
        const deliveryDate = new Date(pickupDate);
        const distance = parseFloat(document.getElementById('distanceSlider').value);
        const days = Math.ceil(distance / 400) + 1; // Approx 400km per day
        deliveryDate.setDate(deliveryDate.getDate() + days);

        document.getElementById('estimatedDelivery').textContent =
            deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
}

function updateSummaryField(elementId, value, defaultText = 'Not provided') {
    const element = document.getElementById(elementId);
    if (value && value.trim() !== '') {
        element.textContent = value;
        element.classList.remove('empty');
    } else {
        element.textContent = defaultText;
        element.classList.add('empty');
    }
}

// ========================================
// PRICE CALCULATOR
// ========================================
function updatePriceCalculation() {
    const distance = parseFloat(document.getElementById('distanceSlider').value);
    const vehicleType = document.getElementById('vehicleType').value;

    // Base fare based on vehicle type
    const baseFares = {
        'hatchback': 2000,
        'sedan': 2500,
        'suv': 3500,
        'luxury': 5000,
        'bike': 1500,
        'commercial': 4000
    };

    const baseFare = baseFares[vehicleType] || 2000;
    const distanceCharge = distance * 15; // ₹15 per km
    const subtotal = baseFare + distanceCharge;
    const gst = subtotal * 0.18;
    let total = subtotal + gst;

    // Apply discount for first booking (10%)
    const isFirstBooking = true; // This would be determined by user session/database
    if (isFirstBooking && distance > 0) {
        total = total * 0.9;
        document.getElementById('discountBadge').style.display = 'block';
    } else {
        document.getElementById('discountBadge').style.display = 'none';
    }

    // Update display with animation
    animateValue('baseFare', baseFare);
    animateValue('distanceCharge', distanceCharge);
    animateValue('gst', gst);
    animateValue('totalPrice', total);

    document.getElementById('distanceValue').textContent = distance + ' km';
}

function animateValue(elementId, endValue) {
    const element = document.getElementById(elementId);
    const startValue = parseFloat(element.textContent.replace(/[₹,]/g, '')) || 0;
    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (endValue - startValue) * progress;
        element.textContent = '₹ ' + Math.round(currentValue).toLocaleString('en-IN');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// CONFETTI ANIMATION
// ========================================
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff6347', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF9800'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);

        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 4000);
    }
}

// ========================================
// PDF & PRINT FUNCTIONS
// ========================================
function downloadPDF() {
    showToast('Download', 'PDF generation feature coming soon!', 'info', 3000);
    // This would integrate with a PDF library like jsPDF
}

function printSummary() {
    window.print();
}

// ========================================
// SAVE & CONTINUE LATER
// ========================================
// Functions moved to booking-modals.js

// ========================================
// CHARACTER COUNTER
// ========================================
function updateCharacterCount() {
    const textarea = document.getElementById('additionalInfo');
    const counter = document.getElementById('charCount');
    const count = textarea.value.length;
    const maxLength = 500;

    counter.textContent = count;
    counter.parentElement.classList.remove('warning', 'danger');

    if (count > maxLength * 0.9) {
        counter.parentElement.classList.add('danger');
    } else if (count > maxLength * 0.7) {
        counter.parentElement.classList.add('warning');
    }
}

// ========================================
// MAP FUNCTIONS
// ========================================
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
    'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
    'Siliguri', 'Rourkela', 'Mangalore', 'Tiruppur', 'Belgaum', 'Ujjain', 'Jamnagar'
];

let selectedPickupCity = '';
let selectedDropCity = '';

// Setup autocomplete for city inputs
function setupCityAutocomplete() {
    const pickupInput = document.getElementById('pickupCity');
    const dropInput = document.getElementById('dropCity');

    if (pickupInput) {
        setupAutocomplete(pickupInput, 'pickupCityDropdown', (city) => {
            selectedPickupCity = city;
            document.getElementById('pickupLocation').value = city + ', India';
            updateBookingSummary();
            // Fetch weather for pickup city
            fetchWeatherData(city, 'pickup');
            if (selectedDropCity) {
                calculateRouteForCities();
            }
        });
    }

    if (dropInput) {
        setupAutocomplete(dropInput, 'dropCityDropdown', (city) => {
            selectedDropCity = city;
            document.getElementById('dropLocation').value = city + ', India';
            updateBookingSummary();
            // Fetch weather for drop city
            fetchWeatherData(city, 'drop');
            if (selectedPickupCity) {
                calculateRouteForCities();
            }
        });
    }
}

function setupAutocomplete(inputElement, dropdownId, onSelectCallback) {
    const dropdown = document.getElementById(dropdownId);
    let currentFocus = -1;

    inputElement.addEventListener('input', function () {
        const value = this.value.trim();
        dropdown.innerHTML = '';
        currentFocus = -1;

        if (!value) {
            dropdown.classList.remove('show');
            return;
        }

        const matches = indianCities.filter(city =>
            city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 8);

        if (matches.length === 0) {
            dropdown.classList.remove('show');
            return;
        }

        matches.forEach((city, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';

            const regex = new RegExp(`(${value})`, 'gi');
            const highlightedText = city.replace(regex, '<strong>$1</strong>');
            item.innerHTML = highlightedText;

            item.addEventListener('click', function () {
                inputElement.value = city;
                dropdown.classList.remove('show');
                if (onSelectCallback) {
                    onSelectCallback(city);
                }
            });

            dropdown.appendChild(item);
        });

        dropdown.classList.add('show');
    });

    inputElement.addEventListener('keydown', function (e) {
        const items = dropdown.getElementsByClassName('autocomplete-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            setActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            setActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.remove('show');
        }
    });

    function setActive(items) {
        Array.from(items).forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentFocus) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (e.target !== inputElement) {
            dropdown.classList.remove('show');
        }
    });
}

function calculateRouteForCities() {
    if (!selectedPickupCity || !selectedDropCity) return;

    // Geocode both cities and show route
    geocodeCity(selectedPickupCity, (pickupLatLng) => {
        geocodeCity(selectedDropCity, (dropLatLng) => {
            if (pickupLatLng && dropLatLng) {
                pickupCoords = pickupLatLng;
                dropCoords = dropLatLng;
                setPickupLocation(pickupLatLng[0], pickupLatLng[1], selectedPickupCity + ', India');
                setDropLocation(dropLatLng[0], dropLatLng[1], selectedDropCity + ', India');

                // Estimate distance between cities and update slider
                const distance = estimateDistance(pickupLatLng, dropLatLng);
                const distanceSlider = document.getElementById('distanceSlider');
                if (distanceSlider) {
                    distanceSlider.value = Math.round(distance);
                    updatePriceCalculation();
                }
            }
        });
    });
}

function estimateDistance(coord1, coord2) {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Radius of Earth in km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function geocodeCity(cityName, callback) {
    fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=India&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                callback([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            } else {
                callback(null);
            }
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            callback(null);
        });
}

function initMap() {
    // Create map centered on India
    map = L.map('map').setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tiles (default street layer)
    streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Satellite layer (initially hidden)
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    // Add geocoder (search) control
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Search location...',
        errorMessage: 'Location not found'
    })
        .on('markgeocode', function (e) {
            const latlng = e.geocode.center;
            map.setView(latlng, 13);

            if (selectingPickup) {
                setPickupLocation(latlng.lat, latlng.lng, e.geocode.name);
            } else if (selectingDrop) {
                setDropLocation(latlng.lat, latlng.lng, e.geocode.name);
            }
        })
        .addTo(map);

    // Add click event to map
    map.on('click', function (e) {
        if (streetViewActive) {
            showStreetView(e.latlng.lat, e.latlng.lng);
        } else if (selectingPickup) {
            reverseGeocode(e.latlng.lat, e.latlng.lng, 'pickup');
        } else if (selectingDrop) {
            reverseGeocode(e.latlng.lat, e.latlng.lng, 'drop');
        }
    });

    // Initialize marker cluster groups
    serviceCentersLayer = L.markerClusterGroup();
    restStopsLayer = L.markerClusterGroup();
    tollPlazasLayer = L.markerClusterGroup();
}

// Reverse geocoding
function reverseGeocode(lat, lng, type) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name;
            if (type === 'pickup') {
                setPickupLocation(lat, lng, address);
            } else if (type === 'drop') {
                setDropLocation(lat, lng, address);
            }
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            showToast('Error', 'Could not get address for this location', 'error', 3000);
        });
}

// Set pickup location
function setPickupLocation(lat, lng, address) {
    pickupCoords = [lat, lng];

    if (pickupMarker) {
        map.removeLayer(pickupMarker);
    }

    const pickupIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt" style="color: #4CAF50; font-size: 32px;"></i>',
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    pickupMarker = L.marker([lat, lng], {
        icon: pickupIcon,
        draggable: true
    }).addTo(map);

    pickupMarker.bindPopup('<b>Pickup Location</b><br>' + address).openPopup();

    pickupMarker.on('dragend', function (e) {
        const newPos = e.target.getLatLng();
        reverseGeocode(newPos.lat, newPos.lng, 'pickup');
    });

    document.getElementById('pickupLocation').value = address;
    selectingPickup = false;

    showToast('Success', 'Pickup location set!', 'success', 2000);

    if (dropCoords) {
        calculateRoute();
    }
}

// Set drop location
function setDropLocation(lat, lng, address) {
    dropCoords = [lat, lng];

    if (dropMarker) {
        map.removeLayer(dropMarker);
    }

    const dropIcon = L.divIcon({
        html: '<i class="fas fa-flag-checkered" style="color: #ff6347; font-size: 32px;"></i>',
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    dropMarker = L.marker([lat, lng], {
        icon: dropIcon,
        draggable: true
    }).addTo(map);

    dropMarker.bindPopup('<b>Drop Location</b><br>' + address).openPopup();

    dropMarker.on('dragend', function (e) {
        const newPos = e.target.getLatLng();
        reverseGeocode(newPos.lat, newPos.lng, 'drop');
    });

    document.getElementById('dropLocation').value = address;
    selectingDrop = false;

    showToast('Success', 'Drop location set!', 'success', 2000);

    if (pickupCoords) {
        calculateRoute();
    }
}

// Select pickup on map
function selectPickupOnMap() {
    selectingPickup = true;
    selectingDrop = false;
    showToast('Info', 'Click on the map to select pickup location', 'info', 3000);
}

// Select drop on map
function selectDropOnMap() {
    selectingDrop = true;
    selectingPickup = false;
    showToast('Info', 'Click on the map to select drop location', 'info', 3000);
}

// Calculate and show route
function calculateRoute() {
    if (!pickupCoords || !dropCoords) {
        showToast('Warning', 'Please select both pickup and drop locations', 'warning', 3000);
        return;
    }

    if (routingControl) {
        map.removeControl(routingControl);
    }

    // If alternative routes are shown, don't create standard route
    if (showAlternativeRoutes) {
        return;
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(pickupCoords[0], pickupCoords[1]),
            L.latLng(dropCoords[0], dropCoords[1])
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        lineOptions: {
            styles: [{ color: '#ff6347', opacity: 0.8, weight: 5 }]
        },
        createMarker: function () { return null; }, // Don't create default markers
        addWaypoints: false
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const time = (route.summary.totalTime / 3600).toFixed(1);
        const cost = Math.round(distance * 15); // ₹15 per km estimate

        estimatedDistance = parseFloat(distance);
        estimatedDuration = parseFloat(time);

        document.getElementById('routeDistance').textContent = distance + ' km';
        document.getElementById('routeTime').textContent = time + ' hours';
        document.getElementById('routeCost').textContent = '₹ ' + cost.toLocaleString();

        document.getElementById('routeInfo').classList.add('show');

        showToast('Route Found', `Distance: ${distance}km, Time: ${time}hrs`, 'success', 4000);
    });

    // Fit bounds to show entire route
    const bounds = L.latLngBounds([pickupCoords, dropCoords]);
    map.fitBounds(bounds, { padding: [50, 50] });
}

// Show route
function showRoute() {
    calculateRoute();
}

// Clear route
function clearRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    if (pickupMarker) {
        map.removeLayer(pickupMarker);
        pickupMarker = null;
    }

    if (dropMarker) {
        map.removeLayer(dropMarker);
        dropMarker = null;
    }

    // Clear alternative routes
    clearAlternativeRoutes();

    // Hide alternative routes panel
    if (showAlternativeRoutes) {
        document.getElementById('alternativeRoutesPanel').style.display = 'none';
        document.getElementById('alternativeRoutesBtn').classList.remove('active');
        showAlternativeRoutes = false;
    }

    pickupCoords = null;
    dropCoords = null;

    document.getElementById('pickupLocation').value = '';
    document.getElementById('dropLocation').value = '';
    document.getElementById('routeInfo').classList.remove('show');

    showToast('Cleared', 'Route and markers cleared', 'info', 2000);
}

// Center map
function centerMap() {
    if (pickupCoords && dropCoords) {
        const bounds = L.latLngBounds([pickupCoords, dropCoords]);
        map.fitBounds(bounds, { padding: [50, 50] });
    } else {
        map.setView([20.5937, 78.9629], 5);
    }
}

// ========================================
// ADVANCED MAP FEATURES
// ========================================

// Toggle Satellite View
function toggleSatelliteView() {
    const btn = document.getElementById('satelliteViewBtn');

    if (currentMapStyle === 'street') {
        map.removeLayer(streetLayer);
        map.addLayer(satelliteLayer);
        currentMapStyle = 'satellite';
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-map"></i> Street View';
        showToast('View Changed', 'Switched to satellite view', 'success', 2000);
    } else {
        map.removeLayer(satelliteLayer);
        map.addLayer(streetLayer);
        currentMapStyle = 'street';
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fas fa-satellite"></i> Satellite View';
        showToast('View Changed', 'Switched to street view', 'success', 2000);
    }
}

// Toggle 3D View (Tilt effect simulation)
function toggle3DView() {
    const btn = document.getElementById('enable3DBtn');
    const mapContainer = document.getElementById('map');
    const indicator = document.getElementById('map3DIndicator');

    is3DView = !is3DView;

    if (is3DView) {
        mapContainer.style.transform = 'perspective(1000px) rotateX(30deg)';
        mapContainer.style.transition = 'transform 0.5s ease';
        btn.classList.add('active');
        indicator.classList.add('show');
        showToast('3D View', '3D perspective enabled', 'success', 2000);
    } else {
        mapContainer.style.transform = 'none';
        btn.classList.remove('active');
        indicator.classList.remove('show');
        showToast('3D View', '3D perspective disabled', 'info', 2000);
    }
}

// Toggle Traffic Layer (Mock implementation - would need real traffic API)
function toggleTrafficLayer() {
    const btn = document.getElementById('trafficLayerBtn');

    if (!trafficLayer) {
        // Mock traffic layer - in production, use Google Maps Traffic Layer or similar
        // For demonstration, we'll show a toast
        trafficLayer = true;
        btn.classList.add('active');
        showToast('Traffic Layer', 'Traffic layer enabled (demo mode)', 'success', 2000);

        // In production, you would integrate with a real traffic API:
        // Example: Google Maps, TomTom, HERE Maps, etc.
    } else {
        trafficLayer = null;
        btn.classList.remove('active');
        showToast('Traffic Layer', 'Traffic layer disabled', 'info', 2000);
    }
}

// Toggle Service Centers
function toggleServiceCenters() {
    const btn = document.getElementById('serviceCentersBtn');

    if (!map.hasLayer(serviceCentersLayer)) {
        // Add service centers to map
        loadServiceCenters();
        map.addLayer(serviceCentersLayer);
        btn.classList.add('active');
        showToast('Service Centers', 'Showing nearby service centers', 'success', 2000);
    } else {
        map.removeLayer(serviceCentersLayer);
        btn.classList.remove('active');
        showToast('Service Centers', 'Service centers hidden', 'info', 2000);
    }
}

// Load Service Centers (mock data - would fetch from API in production)
function loadServiceCenters() {
    serviceCentersLayer.clearLayers();

    // Mock service center locations across India
    const serviceCenters = [
        { name: 'Harihar Service Center - Mumbai', lat: 19.0760, lng: 72.8777, phone: '+91 9876543210' },
        { name: 'Harihar Service Center - Delhi', lat: 28.7041, lng: 77.1025, phone: '+91 9876543211' },
        { name: 'Harihar Service Center - Bangalore', lat: 12.9716, lng: 77.5946, phone: '+91 9876543212' },
        { name: 'Harihar Service Center - Pune', lat: 18.5204, lng: 73.8567, phone: '+91 9876543213' },
        { name: 'Harihar Service Center - Chennai', lat: 13.0827, lng: 80.2707, phone: '+91 9876543214' },
        { name: 'Harihar Service Center - Hyderabad', lat: 17.3850, lng: 78.4867, phone: '+91 9876543215' }
    ];

    const serviceIcon = L.divIcon({
        html: '<i class=\"fas fa-tools\" style=\"color: #2196F3; font-size: 24px;\"></i>',
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    serviceCenters.forEach(center => {
        const marker = L.marker([center.lat, center.lng], { icon: serviceIcon });
        marker.bindPopup(`
            <div class=\"custom-marker-popup\">
                <h5><i class=\"fas fa-tools\"></i> ${center.name}</h5>
                <p><i class=\"fas fa-phone\"></i> ${center.phone}</p>
                <p><i class=\"fas fa-clock\"></i> 24/7 Service</p>
            </div>
        `);
        serviceCentersLayer.addLayer(marker);
    });
}

// Toggle Rest Stops
function toggleRestStops() {
    const btn = document.getElementById('restStopsBtn');

    if (!map.hasLayer(restStopsLayer)) {
        loadRestStops();
        map.addLayer(restStopsLayer);
        btn.classList.add('active');
        showToast('Rest Stops', 'Showing recommended rest stops', 'success', 2000);
    } else {
        map.removeLayer(restStopsLayer);
        btn.classList.remove('active');
        showToast('Rest Stops', 'Rest stops hidden', 'info', 2000);
    }
}

// Load Rest Stops (mock data)
function loadRestStops() {
    restStopsLayer.clearLayers();

    // Mock rest stop locations
    const restStops = [
        { name: 'Highway Dhaba - NH48', lat: 19.5, lng: 73.2, amenities: 'Food, Washroom, Fuel' },
        { name: 'Rest Area - NH44', lat: 15.3, lng: 75.7, amenities: 'Food, Washroom, Parking' },
        { name: 'Service Plaza - NH1', lat: 29.5, lng: 76.8, amenities: 'Food, Fuel, ATM' },
        { name: 'Roadside Cafe - NH27', lat: 24.5, lng: 73.7, amenities: 'Food, Washroom' },
        { name: 'Highway Rest Stop - NH66', lat: 11.2, lng: 75.8, amenities: 'Food, Washroom, Fuel' }
    ];

    const restIcon = L.divIcon({
        html: '<i class=\"fas fa-coffee\" style=\"color: #795548; font-size: 24px;\"></i>',
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    restStops.forEach(stop => {
        const marker = L.marker([stop.lat, stop.lng], { icon: restIcon });
        marker.bindPopup(`
            <div class=\"custom-marker-popup\">
                <h5><i class=\"fas fa-coffee\"></i> ${stop.name}</h5>
                <p><i class=\"fas fa-map-marker-alt\"></i> Highway Rest Stop</p>
                <p><i class=\"fas fa-check-circle\"></i> ${stop.amenities}</p>
            </div>
        `);
        restStopsLayer.addLayer(marker);
    });
}

// Toggle Toll Plazas
function toggleTollPlazas() {
    const btn = document.getElementById('tollPlazasBtn');

    if (!map.hasLayer(tollPlazasLayer)) {
        loadTollPlazas();
        map.addLayer(tollPlazasLayer);
        btn.classList.add('active');
        showToast('Toll Plazas', 'Showing toll plaza locations', 'success', 2000);
    } else {
        map.removeLayer(tollPlazasLayer);
        btn.classList.remove('active');
        showToast('Toll Plazas', 'Toll plazas hidden', 'info', 2000);
    }
}

// Load Toll Plazas (mock data)
function loadTollPlazas() {
    tollPlazasLayer.clearLayers();

    // Mock toll plaza locations
    const tollPlazas = [
        { name: 'Khalapur Toll Plaza', lat: 18.8329, lng: 73.1986, cost: '₹145', highway: 'Mumbai-Pune Expressway' },
        { name: 'Sriperumbudur Toll Plaza', lat: 12.9634, lng: 79.9406, cost: '₹85', highway: 'NH48' },
        { name: 'Kherki Daula Toll Plaza', lat: 28.3820, lng: 76.8450, cost: '₹95', highway: 'NH48' },
        { name: 'Panipat Toll Plaza', lat: 29.3909, lng: 76.9635, cost: '₹120', highway: 'NH44' },
        { name: 'Vadodara Toll Plaza', lat: 22.3072, lng: 73.1812, cost: '₹75', highway: 'NH48' }
    ];

    let totalTollCost = 0;

    const tollIcon = L.divIcon({
        html: '<i class=\"fas fa-coins\" style=\"color: #FFC107; font-size: 24px;\"></i>',
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    tollPlazas.forEach(toll => {
        const marker = L.marker([toll.lat, toll.lng], { icon: tollIcon });
        marker.bindPopup(`
            <div class=\"custom-marker-popup\">
                <h5><i class=\"fas fa-coins\"></i> ${toll.name}</h5>
                <p><i class=\"fas fa-road\"></i> ${toll.highway}</p>
                <p><i class=\"fas fa-rupee-sign\"></i> Estimated: ${toll.cost}</p>
            </div>
        `);
        tollPlazasLayer.addLayer(marker);

        // Extract numeric value for total
        const costValue = parseInt(toll.cost.replace(/[^0-9]/g, ''));
        totalTollCost += costValue;
    });

    // Update toll cost in route info
    document.getElementById('routeTollCost').textContent = '₹ ' + totalTollCost;
}

// Toggle Alternative Routes
function toggleAlternativeRoutes() {
    const btn = document.getElementById('alternativeRoutesBtn');
    const panel = document.getElementById('alternativeRoutesPanel');

    showAlternativeRoutes = !showAlternativeRoutes;

    if (showAlternativeRoutes) {
        if (!pickupCoords || !dropCoords) {
            showToast('Error', 'Please select pickup and drop locations first', 'error', 3000);
            return;
        }

        loadAlternativeRoutes();
        panel.style.display = 'block';
        btn.classList.add('active');
        showToast('Alternative Routes', 'Showing route options', 'success', 2000);
    } else {
        panel.style.display = 'none';
        btn.classList.remove('active');
        clearAlternativeRoutes();
    }
}

// Load Alternative Routes
function loadAlternativeRoutes() {
    const panel = document.getElementById('routesComparison');

    // Clear existing routes
    clearAlternativeRoutes();

    // Mock alternative routes data
    const routes = [
        {
            id: 'route-1',
            label: 'Route 1 - Fastest',
            distance: '450 km',
            time: '6.5 hours',
            toll: '₹340',
            badge: 'fastest',
            waypoints: [pickupCoords, dropCoords],
            color: '#4CAF50'
        },
        {
            id: 'route-2',
            label: 'Route 2 - Shortest',
            distance: '420 km',
            time: '7.2 hours',
            toll: '₹280',
            badge: 'shortest',
            waypoints: [pickupCoords, dropCoords],
            color: '#2196F3'
        },
        {
            id: 'route-3',
            label: 'Route 3 - Toll-Free',
            distance: '485 km',
            time: '8.5 hours',
            toll: '₹0',
            badge: 'toll-free',
            waypoints: [pickupCoords, dropCoords],
            color: '#FFC107'
        }
    ];

    panel.innerHTML = routes.map((route, index) => `
        <div class=\"route-option ${index === 0 ? 'active' : ''}\" onclick=\"selectAlternativeRoute('${route.id}', ${index})\">\n                    <div class=\"route-option-info\">\n                        <div class=\"route-option-label\">${route.label}</div>\n                        <div class=\"route-option-details\">\n                            <span><i class=\"fas fa-road\"></i> ${route.distance}</span>\n                            <span><i class=\"fas fa-clock\"></i> ${route.time}</span>\n                            <span><i class=\"fas fa-coins\"></i> ${route.toll}</span>\n                        </div>\n                    </div>\n                    <div class=\"route-option-badge ${route.badge}\">\n                        ${route.badge.charAt(0).toUpperCase() + route.badge.slice(1).replace('-', ' ')}\n                    </div>\n                </div>\n            `).join('');

    // Display all routes on map
    routes.forEach((route, index) => {
        displayRouteOnMap(route, index === 0);
    });
}

// Display individual route on map
function displayRouteOnMap(route, isActive) {
    const routeControl = L.Routing.control({
        waypoints: route.waypoints.map(coords => L.latLng(coords[0], coords[1])),
        routeWhileDragging: false,
        showAlternatives: false,
        lineOptions: {
            styles: [{
                color: route.color,
                opacity: isActive ? 0.8 : 0.4,
                weight: isActive ? 5 : 3
            }]
        },
        createMarker: function () { return null; },
        addWaypoints: false
    }).addTo(map);

    alternativeRoutesControls.push(routeControl);
}

// Select alternative route
function selectAlternativeRoute(routeId, index) {
    // Update active state
    document.querySelectorAll('.route-option').forEach((el, i) => {
        el.classList.remove('active');
        if (i === index) {
            el.classList.add('active');
        }
    });

    // Clear and redisplay routes with updated active state
    clearAlternativeRoutes();
    loadAlternativeRoutes();

    showToast('Route Selected', `Switched to ${routeId}`, 'success', 2000);
}

// Clear alternative routes from map
function clearAlternativeRoutes() {
    alternativeRoutesControls.forEach(control => {
        map.removeControl(control);
    });
    alternativeRoutesControls = [];
}

// Open Street View Panel
function openStreetViewPanel() {
    const panel = document.getElementById('streetViewPanel');
    const btn = document.getElementById('streetViewBtn');

    streetViewActive = !streetViewActive;

    if (streetViewActive) {
        panel.style.display = 'block';
        btn.classList.add('active');
        showToast('Street View', 'Click on the map to preview street view', 'info', 3000);
    } else {
        closeStreetViewPanel();
    }
}

// Close Street View Panel
function closeStreetViewPanel() {
    const panel = document.getElementById('streetViewPanel');
    const btn = document.getElementById('streetViewBtn');

    panel.style.display = 'none';
    btn.classList.remove('active');
    streetViewActive = false;
}

// Show Street View at location
function showStreetView(lat, lng) {
    const frame = document.getElementById('streetViewFrame');

    // Google Street View embed URL
    const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=YOUR_GOOGLE_MAPS_API_KEY&location=${lat},${lng}&heading=0&pitch=0&fov=90`;

    // For demo without API key, show OpenStreetMap instead
    const demoUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

    frame.src = demoUrl;

    showToast('Street View', 'Loading street view preview...', 'success', 2000);
}

// ========================================
// END OF ADVANCED MAP FEATURES
// ========================================

// Toast Notification System
function showToast(title, message, type = 'success', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = toastId;

    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'info') icon = 'fa-info-circle';

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast('${toastId}')">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    if (duration > 0) {
        setTimeout(() => {
            removeToast(toastId);
        }, duration);
    }

    return toastId;
}

function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// ========================================
// WEATHER FORECAST FUNCTIONS
// ========================================
let weatherData = {};

async function fetchWeatherData(city, type) {
    try {
        // Using OpenWeatherMap API - replace with your API key
        const API_KEY = 'demo'; // Replace with actual API key or use demo data

        // For demo purposes, generate mock weather data
        const mockWeather = generateMockWeather(city);
        weatherData[type] = mockWeather;
        updateWeatherDisplay();

        // Uncomment below for real API integration
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`);
        // if (response.ok) {
        //     const data = await response.json();
        //     weatherData[type] = {
        //         temp: Math.round(data.main.temp),
        //         feels_like: Math.round(data.main.feels_like),
        //         description: data.weather[0].description,
        //         icon: data.weather[0].main,
        //         humidity: data.main.humidity,
        //         wind: Math.round(data.wind.speed * 3.6),
        //         city: city
        //     };
        //     updateWeatherDisplay();
        // }
    } catch (error) {
        console.error('Error fetching weather:', error);
        showWeatherError();
    }
}

function generateMockWeather(city) {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Sunny'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
        temp: Math.round(20 + Math.random() * 15),
        feels_like: Math.round(20 + Math.random() * 15),
        description: condition.toLowerCase(),
        icon: condition,
        humidity: Math.round(40 + Math.random() * 40),
        wind: Math.round(5 + Math.random() * 20),
        city: city
    };
}

function updateWeatherDisplay() {
    const weatherSection = document.getElementById('weatherSection');
    const weatherGrid = document.getElementById('weatherGrid');

    if (!weatherData.pickup && !weatherData.drop) {
        weatherSection.style.display = 'none';
        return;
    }

    weatherSection.style.display = 'block';
    weatherGrid.innerHTML = '';

    if (weatherData.pickup) {
        weatherGrid.appendChild(createWeatherCard(weatherData.pickup, 'Pickup Location'));
    }

    if (weatherData.drop) {
        weatherGrid.appendChild(createWeatherCard(weatherData.drop, 'Drop Location'));
    }
}

function createWeatherCard(data, label) {
    const card = document.createElement('div');
    card.className = 'weather-card';

    const iconMap = {
        'Clear': '☀️',
        'Sunny': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️'
    };

    card.innerHTML = `
        <div class="weather-card-header">
            <div>
                <div class="weather-location">${label}</div>
                <div style="font-weight: 600; color: white; margin-top: 5px;">${data.city}</div>
            </div>
            <div class="weather-icon">${iconMap[data.icon] || '🌤️'}</div>
        </div>
        <div class="weather-temp">${data.temp}°C</div>
        <div class="weather-desc">${data.description.charAt(0).toUpperCase() + data.description.slice(1)}</div>
        <div class="weather-details">
            <div class="weather-detail">
                <i class="fas fa-temperature-high"></i>
                <span>Feels like ${data.feels_like}°C</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-tint"></i>
                <span>Humidity ${data.humidity}%</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-wind"></i>
                <span>Wind ${data.wind} km/h</span>
            </div>
        </div>
    `;

    return card;
}

function showWeatherError() {
    const weatherGrid = document.getElementById('weatherGrid');
    weatherGrid.innerHTML = `
        <div class="weather-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to load weather data. Please try again later.</p>
        </div>
    `;
}

// ========================================
// ROUTE OPTIMIZATION WITH WAYPOINTS
// ========================================
let waypoints = [];
let waypointMarkers = [];

function addWaypoint() {
    const waypointId = 'waypoint-' + Date.now();
    const waypointNumber = waypoints.length + 1;

    waypoints.push({
        id: waypointId,
        city: '',
        coords: null
    });

    const waypointsList = document.getElementById('waypointsList');
    const waypointItem = document.createElement('div');
    waypointItem.className = 'waypoint-item';
    waypointItem.id = waypointId;
    waypointItem.innerHTML = `
        <div class="waypoint-number">${waypointNumber}</div>
        <div class="waypoint-input autocomplete-wrapper">
            <input type="text" 
                   id="${waypointId}-input" 
                   placeholder="Enter stop location..." 
                   autocomplete="off"
                   onchange="updateWaypoint('${waypointId}', this.value)">
            <div class="autocomplete-dropdown" id="${waypointId}-dropdown"></div>
        </div>
        <div class="waypoint-actions">
            <button type="button" class="waypoint-action-btn" onclick="moveWaypointUp('${waypointId}')" title="Move up">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button type="button" class="waypoint-action-btn" onclick="moveWaypointDown('${waypointId}')" title="Move down">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button type="button" class="waypoint-action-btn delete" onclick="removeWaypoint('${waypointId}')" title="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    waypointsList.appendChild(waypointItem);

    // Setup autocomplete for this waypoint
    setupWaypointAutocomplete(waypointId);

    // Show optimize button if we have waypoints
    updateOptimizeButton();

    showToast('Waypoint Added', 'Add a stop location along your route', 'success', 2000);
}

function setupWaypointAutocomplete(waypointId) {
    const input = document.getElementById(waypointId + '-input');
    const dropdown = document.getElementById(waypointId + '-dropdown');

    if (!input || !dropdown) return;

    input.addEventListener('input', function () {
        const query = this.value.toLowerCase();

        if (query.length < 2) {
            dropdown.classList.remove('show');
            return;
        }

        const cities = Object.keys(cityCoordinates);
        const matches = cities.filter(city => city.toLowerCase().includes(query));

        if (matches.length > 0) {
            dropdown.innerHTML = matches.slice(0, 5).map(city => `
                <div class="autocomplete-item" onclick="selectWaypointCity('${waypointId}', '${city}')">
                    <i class="fas fa-map-marker-alt"></i> ${city}
                </div>
            `).join('');
            dropdown.classList.add('show');
        } else {
            dropdown.classList.remove('show');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function selectWaypointCity(waypointId, city) {
    const input = document.getElementById(waypointId + '-input');
    const dropdown = document.getElementById(waypointId + '-dropdown');

    if (input) input.value = city;
    if (dropdown) dropdown.classList.remove('show');

    updateWaypoint(waypointId, city);
}

function updateWaypoint(waypointId, city) {
    const waypoint = waypoints.find(w => w.id === waypointId);
    if (waypoint) {
        waypoint.city = city;
        waypoint.coords = cityCoordinates[city] || null;

        if (waypoint.coords) {
            // Add marker to map
            addWaypointMarker(waypoint);
            // Recalculate route
            if (pickupCoords && dropCoords) {
                calculateRouteWithWaypoints();
            }
        }
    }
    triggerAutoSave();
}

function addWaypointMarker(waypoint) {
    // Remove existing marker if any
    const existingMarker = waypointMarkers.find(m => m.id === waypoint.id);
    if (existingMarker && existingMarker.marker) {
        map.removeLayer(existingMarker.marker);
    }

    if (!waypoint.coords) return;

    const waypointIcon = L.divIcon({
        className: 'custom-waypoint-icon',
        html: '<div style="background: #FFC107; color: #000; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">•</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const marker = L.marker(waypoint.coords, { icon: waypointIcon }).addTo(map);
    marker.bindPopup('<b>Stop:</b><br>' + waypoint.city);

    // Store marker reference
    const markerIndex = waypointMarkers.findIndex(m => m.id === waypoint.id);
    if (markerIndex >= 0) {
        waypointMarkers[markerIndex].marker = marker;
    } else {
        waypointMarkers.push({ id: waypoint.id, marker: marker });
    }
}

function removeWaypoint(waypointId) {
    // Remove from array
    waypoints = waypoints.filter(w => w.id !== waypointId);

    // Remove marker from map
    const markerData = waypointMarkers.find(m => m.id === waypointId);
    if (markerData && markerData.marker) {
        map.removeLayer(markerData.marker);
    }
    waypointMarkers = waypointMarkers.filter(m => m.id !== waypointId);

    // Remove DOM element
    const element = document.getElementById(waypointId);
    if (element) element.remove();

    // Renumber remaining waypoints
    renumberWaypoints();

    // Update route
    if (pickupCoords && dropCoords) {
        calculateRouteWithWaypoints();
    }

    updateOptimizeButton();
    showToast('Removed', 'Waypoint removed', 'info', 2000);
}

function moveWaypointUp(waypointId) {
    const index = waypoints.findIndex(w => w.id === waypointId);
    if (index > 0) {
        [waypoints[index], waypoints[index - 1]] = [waypoints[index - 1], waypoints[index]];
        renumberWaypoints();
        if (pickupCoords && dropCoords) {
            calculateRouteWithWaypoints();
        }
    }
}

function moveWaypointDown(waypointId) {
    const index = waypoints.findIndex(w => w.id === waypointId);
    if (index < waypoints.length - 1) {
        [waypoints[index], waypoints[index + 1]] = [waypoints[index + 1], waypoints[index]];
        renumberWaypoints();
        if (pickupCoords && dropCoords) {
            calculateRouteWithWaypoints();
        }
    }
}

function renumberWaypoints() {
    const waypointsList = document.getElementById('waypointsList');
    const items = Array.from(waypointsList.children);

    waypoints.forEach((waypoint, index) => {
        const element = document.getElementById(waypoint.id);
        if (element) {
            const numberEl = element.querySelector('.waypoint-number');
            if (numberEl) numberEl.textContent = index + 1;

            // Reorder in DOM
            waypointsList.appendChild(element);
        }
    });
}

function updateOptimizeButton() {
    const optimizeBtn = document.getElementById('optimizeRouteBtn');
    if (waypoints.length > 0) {
        optimizeBtn.style.display = 'flex';
    } else {
        optimizeBtn.style.display = 'none';
    }
}

function optimizeRoute() {
    if (waypoints.length === 0) return;

    // Simple optimization: calculate all permutations and find shortest
    // For production, use a proper TSP solver or Google Maps Directions API

    showToast('Optimizing', 'Calculating optimal route...', 'info', 2000);

    // Simulate optimization delay
    setTimeout(() => {
        // Mock optimization - in reality, this would calculate distances
        const originalDistance = estimatedDistance;
        const saved = Math.round(Math.random() * 50 + 10);
        const timeSaved = Math.round(saved / 60 * 60);

        document.getElementById('distanceSaved').textContent = saved + ' km';
        document.getElementById('timeSaved').textContent = timeSaved + ' mins';
        document.getElementById('optimizationResult').classList.add('show');

        showToast('Optimized!', `Route optimized to save ${saved}km`, 'success', 3000);

        // Recalculate route with optimized order
        calculateRouteWithWaypoints();
    }, 1500);
}

function calculateRouteWithWaypoints() {
    if (!pickupCoords || !dropCoords) return;

    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Build waypoints array: pickup -> all stops -> drop
    const routeWaypoints = [L.latLng(pickupCoords[0], pickupCoords[1])];

    waypoints.forEach(wp => {
        if (wp.coords) {
            routeWaypoints.push(L.latLng(wp.coords[0], wp.coords[1]));
        }
    });

    routeWaypoints.push(L.latLng(dropCoords[0], dropCoords[1]));

    routingControl = L.Routing.control({
        waypoints: routeWaypoints,
        routeWhileDragging: false,
        showAlternatives: false,
        lineOptions: {
            styles: [{ color: '#ff6347', opacity: 0.8, weight: 5 }]
        },
        createMarker: function () { return null; },
        addWaypoints: false
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const time = (route.summary.totalTime / 3600).toFixed(1);
        const cost = Math.round(distance * 15);

        document.getElementById('routeDistance').textContent = distance + ' km';
        document.getElementById('routeTime').textContent = time + ' hours';
        document.getElementById('routeCost').textContent = '₹ ' + cost.toLocaleString();

        document.getElementById('routeInfo').classList.add('show');

        const stopsText = waypoints.length > 0 ? ` with ${waypoints.length} stop(s)` : '';
        showToast('Route Updated', `Distance: ${distance}km${stopsText}`, 'success', 3000);
    });

    const bounds = L.latLngBounds(routeWaypoints);
    map.fitBounds(bounds, { padding: [50, 50] });
}

// ========================================
// DOM CONTENT LOADED - INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize map first
    initMap();

    // Setup city autocomplete
    setupCityAutocomplete();

    // Initialize BookingManager (if using modular approach)
    // window.bookingManager = new BookingManager();

    const bookingForm = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const bookingRef = document.getElementById('bookingRef');

    // Check for resume link first
    checkResumeLink();

    // Try to restore saved form data
    restoreFormData();

    // Initialize date input minimum value
    const dateInput = document.getElementById('pickupDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Add date validation for blackout dates
    dateInput.addEventListener('change', function () {
        validatePickupDate();
        updateBookingSummary();
        triggerAutoSave();
    });

    // Add input event listeners for real-time validation
    const validationFields = ['fullName', 'phone', 'email', 'vehicleType', 'pickupCity', 'dropCity', 'pickupDate'];

    validationFields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', function () {
                validateField(field, this.value);
                updateBookingSummary();
            });

            input.addEventListener('blur', function () {
                validateField(field, this.value);
            });
        }
    });

    // Character counter for textarea
    const additionalInfo = document.getElementById('additionalInfo');
    additionalInfo.addEventListener('input', updateCharacterCount);

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.substring(0, 10);
            if (value.length > 5) {
                value = value.substring(0, 5) + ' ' + value.substring(5);
            }
        }
        e.target.value = value;
    });

    // Vehicle type change - update pricing
    document.getElementById('vehicleType').addEventListener('change', function () {
        updatePriceCalculation();
        updateBookingSummary();
    });

    // Distance slider - initialize with estimated distance if cities selected
    const distanceSlider = document.getElementById('distanceSlider');
    distanceSlider.addEventListener('input', function () {
        updatePriceCalculation();
        updateBookingSummary();
    });

    // Initialize price calculation on load
    updatePriceCalculation();

    // Pickup date change
    document.getElementById('pickupDate').addEventListener('change', function () {
        updateBookingSummary();
    });

    // Pickup time change
    document.getElementById('pickupTime').addEventListener('change', function () {
        updateBookingSummary();
    });

    // Form submission
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateStep(3)) {
            showToast('Validation Error', 'Please check all fields', 'error', 3000);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';

        // Simulate API call
        setTimeout(() => {
            const reference = generateBookingRef();
            bookingRef.textContent = reference;

            // Create confetti
            createConfetti();

            // Show success modal
            successModal.style.display = 'flex';

            // Reset form
            bookingForm.reset();
            currentStep = 1;
            updateStepDisplay();
            updateProgressBar();
            clearRoute();
            updateBookingSummary();

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Confirm Booking</span>';

            showToast(
                'Booking Confirmed!',
                `Your booking reference is ${reference}`,
                'success',
                5000
            );
        }, 2000);
    });

    function generateBookingRef() {
        const prefix = 'HC';
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}${year}-${randomNum}`;
    }
});

// ========================================
// MODAL FUNCTIONS
// ========================================
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

window.addEventListener('click', function (e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========================================
// ADD-ON SERVICES
// ========================================
let selectedAddons = [];
let addonsTotalPrice = 0;

function toggleAddon(element, addonId, price) {
    const checkbox = element.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        element.classList.add('selected');
        selectedAddons.push({ id: addonId, price: price });
        addonsTotalPrice += price;
    } else {
        element.classList.remove('selected');
        selectedAddons = selectedAddons.filter(a => a.id !== addonId);
        addonsTotalPrice -= price;
    }

    updateAddonsDisplay();
    updatePriceCalculation();
    triggerAutoSave();
}

function updateAddonsDisplay() {
    const addonsTotal = document.getElementById('addonsTotal');
    const addonsPrice = document.getElementById('addonsPrice');

    if (addonsTotalPrice > 0) {
        addonsTotal.style.display = 'flex';
        addonsPrice.textContent = '₹ ' + addonsTotalPrice.toLocaleString();
    } else {
        addonsTotal.style.display = 'none';
    }
}

// ========================================
// POPULAR ROUTES - QUICK FILL
// ========================================
function fillRoute(fromCity, toCity) {
    document.getElementById('pickupCity').value = fromCity;
    document.getElementById('dropCity').value = toCity;

    selectedPickupCity = fromCity;
    selectedDropCity = toCity;

    // Trigger validations
    validateField('pickupCity', fromCity);
    validateField('dropCity', toCity);

    // Fetch weather for both cities
    fetchWeatherData(fromCity, 'pickup');
    fetchWeatherData(toCity, 'drop');

    // Calculate distance
    calculateDistanceEstimate();

    // Update summary
    updateBookingSummary();

    // Auto-save
    triggerAutoSave();

    // First, try to use city coordinates from our database
    const pickupCoord = cityCoordinates[fromCity];
    const dropCoord = cityCoordinates[toCity];

    if (pickupCoord && dropCoord) {
        // Use coordinates from database
        setPickupLocation(pickupCoord[0], pickupCoord[1], fromCity);
        setDropLocation(dropCoord[0], dropCoord[1], toCity);

        // Calculate and show route
        setTimeout(() => {
            calculateRoute();
        }, 500);

        // Scroll to map section
        setTimeout(() => {
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1000);
    } else {
        // Fallback to geocoding API
        geocodeCity(fromCity, (pickupLatLng) => {
            if (pickupLatLng) {
                setPickupLocation(pickupLatLng[0], pickupLatLng[1], fromCity);

                // Then geocode drop city
                geocodeCity(toCity, (dropLatLng) => {
                    if (dropLatLng) {
                        setDropLocation(dropLatLng[0], dropLatLng[1], toCity);

                        // Calculate and show route
                        setTimeout(() => {
                            calculateRoute();
                        }, 500);
                    }
                });
            }
        });

        // Scroll to map section
        setTimeout(() => {
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1000);
    }

    // Show toast
    showToast('Route Selected', `${fromCity} → ${toCity}`, 'success', 2000);

    // Track analytics
    trackAnalytics('route_select', { from: fromCity, to: toCity });

    // Jump to step 2 if on step 1
    if (currentStep === 1) {
        setTimeout(() => {
            const vehicleType = document.getElementById('vehicleType').value;
            if (vehicleType) {
                nextStep();
            }
        }, 500);
    }
}

// ========================================
// BOOKING MANAGEMENT FUNCTIONS
// ========================================
// Functions moved to booking-modals.js

// ========================================
// CART ABANDONMENT RECOVERY
// ========================================
// Functions moved to booking-modals.js

// ========================================
// ANALYTICS TRACKING
// ========================================
const analyticsData = {
    pageViews: 0,
    formStarts: 0,
    step1Completions: 0,
    step2Completions: 0,
    bookingSubmissions: 0,
    abandonments: 0,
    popularRoutes: {},
    conversionRate: 0
};

function trackAnalytics(event, data = {}) {
    // Update analytics data
    switch (event) {
        case 'page_view':
            analyticsData.pageViews++;
            break;
        case 'form_start':
            analyticsData.formStarts++;
            break;
        case 'step_1_complete':
            analyticsData.step1Completions++;
            break;
        case 'step_2_complete':
            analyticsData.step2Completions++;
            break;
        case 'booking_submit':
            analyticsData.bookingSubmissions++;
            break;
        case 'cart_abandonment':
            analyticsData.abandonments++;
            break;
        case 'route_select':
            const route = `${data.from}_${data.to}`;
            analyticsData.popularRoutes[route] = (analyticsData.popularRoutes[route] || 0) + 1;
            break;
    }

    // Calculate conversion rate
    if (analyticsData.formStarts > 0) {
        analyticsData.conversionRate = (analyticsData.bookingSubmissions / analyticsData.formStarts * 100).toFixed(2);
    }

    // Save to localStorage
    localStorage.setItem('bookingAnalytics', JSON.stringify(analyticsData));

    // In production, send to analytics service (Google Analytics, Mixpanel, etc.)
    console.log('Analytics Event:', event, data, analyticsData);
}

// Track page view on load
trackAnalytics('page_view');

// Track when user starts filling the form
let formStartTracked = false;
document.querySelectorAll('#bookingForm input, #bookingForm select').forEach(input => {
    input.addEventListener('focus', function () {
        if (!formStartTracked) {
            trackAnalytics('form_start');
            formStartTracked = true;
        }
    });
});

// ========================================
// ENHANCED PRICE CALCULATION WITH ADDONS
// ========================================
const originalUpdatePriceCalculation = updatePriceCalculation;
updatePriceCalculation = function () {
    originalUpdatePriceCalculation();

    // Add addons to total
    if (addonsTotalPrice > 0) {
        const currentTotal = parseFloat(document.getElementById('totalPrice').textContent.replace(/[₹,]/g, '')) || 0;
        const newTotal = currentTotal + addonsTotalPrice;
        document.getElementById('totalPrice').textContent = '₹ ' + newTotal.toLocaleString();
    }
};
