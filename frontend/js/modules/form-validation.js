/**
 * Enhanced Form Validation Module
 * Provides comprehensive validation for booking form with error handling
 */

class FormValidator {
    constructor() {
        this.validationRules = {
            fullName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid full name (2-50 characters, letters only)'
            },
            phone: {
                required: true,
                pattern: /^[6-9]\d{9}$/,
                message: 'Please enter a valid 10-digit Indian phone number starting with 6-9'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            vehicleType: {
                required: true,
                message: 'Please select a vehicle type'
            },
            pickupCity: {
                required: true,
                minLength: 2,
                message: 'Please select a pickup city'
            },
            dropCity: {
                required: true,
                minLength: 2,
                message: 'Please select a drop city'
            },
            pickupDate: {
                required: true,
                custom: this.validateDate.bind(this),
                message: 'Please select a valid pickup date'
            }
        };
        
        this.errors = {};
        this.isValid = true;
    }

    validateField(fieldName, value) {
        const rule = this.validationRules[fieldName];
        if (!rule) return true;

        const errors = [];

        // Required validation
        if (rule.required && (!value || value.toString().trim() === '')) {
            errors.push('This field is required');
        }

        if (value && value.toString().trim() !== '') {
            // Length validations
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(`Minimum ${rule.minLength} characters required`);
            }
            if (rule.maxLength && value.length > rule.maxLength) {
                errors.push(`Maximum ${rule.maxLength} characters allowed`);
            }

            // Pattern validation
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(rule.message || 'Invalid format');
            }

            // Custom validation
            if (rule.custom) {
                const customError = rule.custom(value);
                if (customError) errors.push(customError);
            }
        }

        this.errors[fieldName] = errors;
        this.updateFieldUI(fieldName, errors.length === 0);
        
        return errors.length === 0;
    }

    validateDate(dateStr) {
        if (!dateStr) return 'Date is required';
        
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return 'Pickup date cannot be in the past';
        }
        
        // Check blackout dates
        const blackoutDates = [
            '2025-11-15', '2025-12-25', '2025-12-31', '2026-01-01',
            '2026-01-26', '2026-03-08', '2026-08-15', '2026-10-02'
        ];
        
        if (blackoutDates.includes(dateStr)) {
            return 'Selected date is unavailable due to holiday/maintenance';
        }
        
        return null;
    }

    validateStep(stepNumber) {
        let stepFields = [];
        
        switch(stepNumber) {
            case 1:
                stepFields = ['fullName', 'phone', 'email', 'vehicleType'];
                break;
            case 2:
                stepFields = ['pickupCity', 'dropCity', 'pickupDate'];
                break;
            case 3:
                // Review step - validate all previous fields
                stepFields = ['fullName', 'phone', 'email', 'vehicleType', 'pickupCity', 'dropCity', 'pickupDate'];
                break;
        }

        let isStepValid = true;
        const stepErrors = {};

        stepFields.forEach(fieldName => {
            const input = document.getElementById(fieldName);
            const value = input ? input.value : '';
            
            if (!this.validateField(fieldName, value)) {
                isStepValid = false;
                stepErrors[fieldName] = this.errors[fieldName];
            }
        });

        if (!isStepValid) {
            this.showValidationSummary(stepErrors);
        }

        return isStepValid;
    }

    updateFieldUI(fieldName, isValid) {
        const input = document.getElementById(fieldName);
        const formGroup = input?.closest('.form-group');
        const errorElement = document.getElementById(fieldName + 'Error');
        const validationIcon = formGroup?.querySelector('.validation-icon');

        if (!input || !formGroup) return;

        if (isValid) {
            input.classList.remove('error');
            formGroup.classList.add('valid');
            formGroup.classList.remove('invalid');
            
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            
            if (validationIcon) {
                validationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                validationIcon.className = 'validation-icon success';
            }
        } else {
            input.classList.add('error');
            formGroup.classList.remove('valid');
            formGroup.classList.add('invalid');
            
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = this.errors[fieldName][0] || 'Invalid input';
            }
            
            if (validationIcon) {
                validationIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                validationIcon.className = 'validation-icon error';
            }

            // Add shake animation
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    }

    showValidationSummary(errors) {
        const errorCount = Object.keys(errors).length;
        const errorFields = Object.keys(errors).join(', ');
        
        if (window.showToast) {
            window.showToast(
                'Validation Error', 
                `Please fix ${errorCount} error(s) in: ${errorFields}`, 
                'error', 
                5000
            );
        }
    }

    validateForm(formElement) {
        const formData = new FormData(formElement);
        let isFormValid = true;
        
        // Validate all fields
        for (const [fieldName] of formData.entries()) {
            if (this.validationRules[fieldName]) {
                if (!this.validateField(fieldName, formData.get(fieldName))) {
                    isFormValid = false;
                }
            }
        }

        return isFormValid;
    }

    getValidationErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = {};
        this.isValid = true;
    }
}

// API Error Handler
class APIErrorHandler {
    constructor() {
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async handleRequest(requestFn, options = {}) {
        const { showLoader = true, retries = this.retryAttempts } = options;
        
        if (showLoader) this.showLoader();
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await requestFn();
                
                if (showLoader) this.hideLoader();
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return await response.json();
                
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);
                
                if (attempt === retries) {
                    if (showLoader) this.hideLoader();
                    this.handleError(error);
                    throw error;
                }
                
                // Wait before retry
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    handleError(error) {
        let message = 'An unexpected error occurred. Please try again.';
        let title = 'Error';
        
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            title = 'Connection Error';
            message = 'Please check your internet connection and try again.';
        } else if (error.message.includes('400')) {
            title = 'Invalid Request';
            message = 'Please check your input and try again.';
        } else if (error.message.includes('500')) {
            title = 'Server Error';
            message = 'Our servers are experiencing issues. Please try again later.';
        }
        
        if (window.showToast) {
            window.showToast(title, message, 'error', 8000);
        }
        
        // Log error for debugging
        console.error('API Error:', error);
    }

    showLoader() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
        }
    }

    hideLoader() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Confirm Booking</span>';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Enhanced Booking Form Handler
class BookingFormHandler {
    constructor() {
        this.validator = new FormValidator();
        this.apiHandler = new APIErrorHandler();
        this.currentStep = 1;
        this.totalSteps = 3;
    }

    async submitBooking(formData) {
        try {
            // Validate form before submission
            const form = document.getElementById('bookingForm');
            if (!this.validator.validateForm(form)) {
                throw new Error('Form validation failed');
            }

            // Prepare booking data
            const bookingData = this.prepareBookingData(formData);
            
            // Submit to API
            const response = await this.apiHandler.handleRequest(
                () => fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingData)
                })
            );

            // Handle successful submission
            this.handleSuccessfulSubmission(response);
            
        } catch (error) {
            this.handleSubmissionError(error);
        }
    }

    prepareBookingData(formData) {
        return {
            personalInfo: {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email')
            },
            vehicleInfo: {
                type: formData.get('vehicleType'),
                model: formData.get('vehicleModel') || ''
            },
            transportInfo: {
                pickupCity: formData.get('pickupCity'),
                dropCity: formData.get('dropCity'),
                pickupDate: formData.get('pickupDate'),
                pickupTime: formData.get('pickupTime') || 'any'
            },
            additionalInfo: formData.get('additionalInfo') || '',
            addons: formData.getAll('addons'),
            timestamp: new Date().toISOString()
        };
    }

    handleSuccessfulSubmission(response) {
        // Prefer server-provided booking reference; fall back to client-generated
        const reference = (response && (response.bookingRef || response.reference)) || this.generateBookingRef();
        
        // Update UI
        const bookingRef = document.getElementById('bookingRef');
        if (bookingRef) bookingRef.textContent = reference;
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) successModal.style.display = 'flex';
        
        // Create confetti effect
        if (window.createConfetti) window.createConfetti();
        
        // Clear form and reset state
        this.resetForm();
        
        // Show success toast
        if (window.showToast) {
            window.showToast(
                'Booking Confirmed!', 
                `Your booking reference is ${reference}`, 
                'success', 
                8000
            );
        }
        
        // Clear saved draft
        localStorage.removeItem('bookingDraft');
    }

    handleSubmissionError(error) {
        console.error('Booking submission failed:', error);
        
        if (error.message === 'Form validation failed') {
            // Validation errors already shown by validator
            return;
        }
        
        // Show generic error message
        if (window.showToast) {
            window.showToast(
                'Submission Failed', 
                'Unable to submit your booking. Please try again.', 
                'error', 
                8000
            );
        }
    }

    generateBookingRef() {
        const prefix = 'HC';
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}${year}-${randomNum}`;
    }

    resetForm() {
        const form = document.getElementById('bookingForm');
        if (form) form.reset();
        
        this.currentStep = 1;
        if (window.updateStepDisplay) window.updateStepDisplay();
        if (window.updateProgressBar) window.updateProgressBar();
        if (window.clearRoute) window.clearRoute();
        if (window.updateBookingSummary) window.updateBookingSummary();
        
        this.validator.clearErrors();
    }

    validateStep(stepNumber) {
        return this.validator.validateStep(stepNumber);
    }

    validateField(fieldName, value) {
        return this.validator.validateField(fieldName, value);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormValidator, APIErrorHandler, BookingFormHandler };
}

// Global instance for immediate use
window.formValidator = new FormValidator();
window.apiHandler = new APIErrorHandler();
window.bookingFormHandler = new BookingFormHandler();