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
