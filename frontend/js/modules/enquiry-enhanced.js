// Enhanced Enquiry Form Module
(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        autoSaveInterval: 3000, // 3 seconds
        maxFileSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5,
        charLimit: 500,
        blackoutDates: [
            '12-25', // Christmas
            '01-01', // New Year
            '01-26', // Republic Day
            '08-15', // Independence Day
            '10-02'  // Gandhi Jayanti
        ],
        emailDomains: [
            'gmail.com',
            'yahoo.com',
            'outlook.com',
            'hotmail.com',
            'rediffmail.com',
            'protonmail.com'
        ],
        enquiryTypes: [
            { value: 'quote', label: 'Get Quote', icon: 'fa-calculator' },
            { value: 'booking', label: 'Booking Inquiry', icon: 'fa-calendar-check' },
            { value: 'support', label: 'Customer Support', icon: 'fa-headset' },
            { value: 'tracking', label: 'Track Shipment', icon: 'fa-map-marker-alt' },
            { value: 'complaint', label: 'Complaint/Feedback', icon: 'fa-comment-dots' },
            { value: 'partnership', label: 'Partnership/Business', icon: 'fa-handshake' },
            { value: 'other', label: 'Other', icon: 'fa-ellipsis-h' }
        ],
        vehicleTypes: [
            { value: 'hatchback', label: 'Hatchback', basePrice: 5000 },
            { value: 'sedan', label: 'Sedan', basePrice: 7000 },
            { value: 'suv', label: 'SUV', basePrice: 10000 },
            { value: 'luxury', label: 'Luxury Car', basePrice: 15000 },
            { value: 'bike', label: 'Motorcycle', basePrice: 3000 },
            { value: 'commercial', label: 'Commercial Vehicle', basePrice: 12000 }
        ]
    };

    // State
    let state = {
        currentStep: 1,
        totalSteps: 3,
        formData: {},
        cities: [],
        uploadedFiles: [],
        autoSaveTimer: null,
        estimatedPrice: 0,
        dynamicHolidays: [] // Stores fetched holidays from API
    };

    /**
     * Fetches real-time holidays from Nager.Date API
     */
    async function fetchDynamicHolidays() {
        const year = new Date().getFullYear();
        const nextYear = year + 1;

        const fetchYearHolidays = async (y) => {
            try {
                const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/IN/${y}`);
                if (response.ok) {
                    const holidays = await response.json();
                    return holidays.map(h => h.date.substring(5)); // Extract MM-DD
                }
            } catch (e) {
                console.warn(`Failed to fetch holidays for ${y}:`, e);
            }
            return [];
        };

        const [holidaysThisYear, holidaysNextYear] = await Promise.all([
            fetchYearHolidays(year),
            fetchYearHolidays(nextYear)
        ]);

        // Merge and unique
        state.dynamicHolidays = [...new Set([...holidaysThisYear, ...holidaysNextYear])];

        if (state.dynamicHolidays.length > 0) {
            console.log('✅ Real-time holidays loaded:', state.dynamicHolidays.length, 'dates');
            // Re-initialize calendar if holidays change
            setupYearAgnosticCalendar();
        }
    }

    /**
     * Setup Flatpickr for a premium, real-time calendar experience
     */
    function setupYearAgnosticCalendar() {
        const dateInput = document.getElementById('pickupDate');
        if (!dateInput || typeof flatpickr === 'undefined') return;

        // Combine hardcoded and dynamic holidays
        const allHolidays = [...new Set([...CONFIG.blackoutDates, ...state.dynamicHolidays])];

        flatpickr("#pickupDate", {
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [
                function (date) {
                    // Visually disable holidays
                    const monthDay = date.toISOString().substring(5, 10);
                    return allHolidays.includes(monthDay);
                }
            ],
            onChange: function (selectedDates, dateStr) {
                validateDate();
            },
            onDayCreate: function (dObj, dStr, fp, dayElem) {
                if (dayElem.dateObj) {
                    const dateStr = dayElem.dateObj.toISOString().substring(5, 10);
                    if (allHolidays.includes(dateStr)) {
                        dayElem.classList.add('holiday-date');
                        dayElem.title = "Public Holiday - Service may be limited";
                    }
                }
            }
        });
    }

    // Load cities data
    async function loadCities() {
        try {
            const response = await fetch('../assets/data/cities.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            state.cities = data;
            console.log('✅ Cities loaded successfully:', state.cities.length, 'cities');
        } catch (error) {
            console.error('❌ Error loading cities:', error);
            // Fallback to a sample list if fetch fails
            state.cities = [
                { name: 'Mumbai', slug: 'mumbai' },
                { name: 'Delhi', slug: 'delhi' },
                { name: 'Bangalore', slug: 'bangalore' },
                { name: 'Pune', slug: 'pune' },
                { name: 'Hyderabad', slug: 'hyderabad' },
                { name: 'Chennai', slug: 'chennai' },
                { name: 'Kolkata', slug: 'kolkata' },
                { name: 'Ahmedabad', slug: 'ahmedabad' },
                { name: 'Nagpur', slug: 'nagpur' },
                { name: 'Jaipur', slug: 'jaipur' }
            ];
            console.log('Using fallback cities list');
        }
    }

    // Initialize
    async function init() {
        setupFAQs();

        // Load cities and holidays
        await Promise.all([
            loadCities(),
            fetchDynamicHolidays()
        ]);

        setupEventListeners();
        loadSavedData();
        updateOperatingHours();
        setupYearAgnosticCalendar();

        // Native fallbacks if flatpickr fails
        const dateInput = document.getElementById('pickupDate');
        if (dateInput && !dateInput._flatpickr) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        const form = document.getElementById('enquiryForm');
        if (form) {
            form.addEventListener('submit', handleSubmit);

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => handleInputChange(input));
            });

            // Email suggestion
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.addEventListener('input', checkEmailTypo);
            }

            // Phone formatting
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                phoneInput.addEventListener('input', formatPhoneNumber);
            }

            // Character counter
            const messageInput = document.getElementById('message');
            if (messageInput) {
                messageInput.addEventListener('input', updateCharCounter);
            }

            // Date validation
            const dateInput = document.getElementById('pickupDate');
            if (dateInput) {
                dateInput.addEventListener('change', validateDate);
            }

            // City autocomplete
            setupCityAutocomplete('pickupCity');
            setupCityAutocomplete('dropCity');

            // File upload
            setupFileUpload();

            // Navigation buttons
            const nextButtons = document.querySelectorAll('.btn-next');
            nextButtons.forEach(btn => {
                btn.addEventListener('click', () => nextStep());
            });

            const prevButtons = document.querySelectorAll('.btn-prev');
            prevButtons.forEach(btn => {
                btn.addEventListener('click', () => previousStep());
            });
        }
    }

    // Field Validation
    function validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous validation
        field.classList.remove('valid', 'error');
        const validationIcon = field.parentElement.querySelector('.validation-icon');
        const errorElement = field.parentElement.querySelector('.error-message');

        switch (fieldName) {
            case 'name':
            case 'fullName':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter your full name';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name should contain only letters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please enter your email';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                const cleaned = value.replace(/\D/g, '');

                // Reject repeating digits (0000000000, 9999999999)
                if (!cleaned) {
                    isValid = false;
                    errorMessage = 'Please enter your phone number';
                } else if (!/^[6-9]\d{9}$/.test(cleaned)) {
                    isValid = false;
                    errorMessage = 'Enter a valid 10-digit Indian mobile number';
                } else if (/^(\d)\1{9}$/.test(cleaned)) {
                    isValid = false;
                    errorMessage = 'Invalid phone number';
                }
                break;


            case 'message':
                if (!value || value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter at least 10 characters';
                }
                break;

            case 'enquiryType':
            case 'vehicleType':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select an option';
                }
                break;

            case 'pickupCity':
            case 'dropCity':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a city';
                }
                break;
        }

        // Update UI
        if (field.hasAttribute('required')) {
            if (isValid && value) {
                field.classList.add('valid');
                if (validationIcon) {
                    validationIcon.className = 'validation-icon success';
                    validationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                }
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            } else if (!isValid) {
                field.classList.add('error');
                if (validationIcon) {
                    validationIcon.className = 'validation-icon error';
                    validationIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                }
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                    errorElement.classList.add('show');
                }
            }
        }

        return isValid;
    }

    // Email Typo Detection
    function checkEmailTypo() {
        const emailInput = document.getElementById('email');
        const suggestionElement = emailInput.parentElement.querySelector('.email-suggestion');

        if (!emailInput || !suggestionElement) return;

        const email = emailInput.value.trim();
        const parts = email.split('@');

        if (parts.length === 2) {
            const domain = parts[1].toLowerCase();

            // Common typos
            const typos = {
                'gmial.com': 'gmail.com',
                'gmai.com': 'gmail.com',
                'gmil.com': 'gmail.com',
                'yahooo.com': 'yahoo.com',
                'yaho.com': 'yahoo.com',
                'outlok.com': 'outlook.com',
                'hotmial.com': 'hotmail.com'
            };

            if (typos[domain]) {
                const suggestedEmail = parts[0] + '@' + typos[domain];
                suggestionElement.innerHTML = `Did you mean <strong>${suggestedEmail}</strong>? Click to use.`;
                suggestionElement.classList.add('show');
                suggestionElement.onclick = () => {
                    emailInput.value = suggestedEmail;
                    suggestionElement.classList.remove('show');
                    validateField(emailInput);
                };
            } else {
                suggestionElement.classList.remove('show');
            }
        }
    }



    // Character Counter
    function updateCharCounter() {
        const messageInput = document.getElementById('message');
        const counterElement = document.querySelector('.char-counter');

        if (!messageInput || !counterElement) return;

        const length = messageInput.value.length;
        const limit = CONFIG.charLimit;

        counterElement.textContent = `${length}/${limit} characters`;

        // Update styling based on length
        counterElement.classList.remove('warning', 'danger');
        if (length > limit * 0.8) {
            counterElement.classList.add('warning');
        }
        if (length >= limit) {
            counterElement.classList.add('danger');
            messageInput.value = messageInput.value.substring(0, limit);
        }
    }

    // Date Validation
    function validateDate() {
        const dateInput = document.getElementById('pickupDate');
        const warningElement = document.getElementById('dateWarning');

        if (!dateInput) return;

        const selectedDate = dateInput.value; // YYYY-MM-DD
        if (!selectedDate) return;

        // Combine hardcoded and dynamic holidays
        const allHolidays = [...new Set([...CONFIG.blackoutDates, ...state.dynamicHolidays])];

        // Extract MM-DD for year-agnostic holiday check
        const parts = selectedDate.split('-');
        if (parts.length < 3) return;

        const monthDay = `${parts[1]}-${parts[2]}`;

        if (allHolidays.includes(monthDay)) {
            if (warningElement) {
                warningElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> This is a holiday. Service may be limited.';
                warningElement.classList.add('show');
            }
        } else {
            if (warningElement) {
                warningElement.classList.remove('show');
            }
        }
    }

    // City Autocomplete
    function setupCityAutocomplete(inputId) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId + 'Dropdown');

        if (!input || !dropdown) {
            console.warn(`Autocomplete setup failed for ${inputId}`);
            return;
        }

        console.log(`Setting up autocomplete for ${inputId}`); // Debug log

        input.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();

            // Show dropdown even with 1 character
            if (query.length < 1) {
                dropdown.classList.remove('show');
                return;
            }

            // Check if cities are loaded
            if (!state.cities || state.cities.length === 0) {
                console.warn('Cities not loaded yet');
                dropdown.innerHTML = '<div class="autocomplete-item">Loading cities...</div>';
                dropdown.classList.add('show');
                return;
            }

            const filtered = state.cities.filter(city =>
                city.name.toLowerCase().includes(query) ||
                city.slug.toLowerCase().includes(query)
            ).slice(0, 10);

            if (filtered.length > 0) {
                dropdown.innerHTML = filtered.map(city => `
                    <div class="autocomplete-item" data-value="${city.name}">
                        <strong>${highlightMatch(city.name, query)}</strong>
                    </div>
                `).join('');

                dropdown.classList.add('show');

                // Add click handlers
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', function () {
                        input.value = this.dataset.value;
                        dropdown.classList.remove('show');
                        validateField(input);
                        calculateEstimate();
                    });
                });
            } else {
                dropdown.innerHTML = '<div class="autocomplete-item">No cities found</div>';
                dropdown.classList.add('show');
            }
        });

        // Show all cities on focus (optional: show top 10 when clicking the input)
        input.addEventListener('focus', function () {
            if (this.value.trim().length === 0 && state.cities && state.cities.length > 0) {
                // Show first 10 cities when clicking empty field
                const topCities = state.cities.slice(0, 10);
                dropdown.innerHTML = topCities.map(city => `
                    <div class="autocomplete-item" data-value="${city.name}">
                        <strong>${city.name}</strong>
                    </div>
                `).join('');

                dropdown.classList.add('show');

                // Add click handlers
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', function () {
                        input.value = this.dataset.value;
                        dropdown.classList.remove('show');
                        validateField(input);
                        calculateEstimate();
                    });
                });
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // Highlight matching text
    function highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;

        return text.substring(0, index) +
            '<span style="color: #ff6347">' +
            text.substring(index, index + query.length) +
            '</span>' +
            text.substring(index + query.length);
    }

    // File Upload
    function setupFileUpload() {
        const fileInput = document.getElementById('fileUpload');
        const uploadArea = document.querySelector('.file-upload-area');
        const previewContainer = document.querySelector('.file-preview-container');

        if (!fileInput || !uploadArea) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', function () {
            handleFiles(this.files);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
    }

    // Handle File Upload
    function handleFiles(files) {
        const previewContainer = document.querySelector('.file-preview-container');
        if (!previewContainer) return;

        Array.from(files).forEach(file => {
            // Validate file
            if (!file.type.startsWith('image/')) {
                showToast('Error', 'Please upload only image files', 'error');
                return;
            }

            if (file.size > CONFIG.maxFileSize) {
                showToast('Error', 'File size should not exceed 5MB', 'error');
                return;
            }

            if (state.uploadedFiles.length >= CONFIG.maxFiles) {
                showToast('Error', `Maximum ${CONFIG.maxFiles} files allowed`, 'error');
                return;
            }

            // Add to state
            state.uploadedFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'file-preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button class="file-remove-btn" type="button">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                // Remove button
                previewItem.querySelector('.file-remove-btn').addEventListener('click', function (e) {
                    e.stopPropagation();
                    const index = state.uploadedFiles.indexOf(file);
                    if (index > -1) {
                        state.uploadedFiles.splice(index, 1);
                    }
                    previewItem.remove();
                });

                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Input Change Handler
    function handleInputChange(input) {
        // Auto-save
        clearTimeout(state.autoSaveTimer);
        state.autoSaveTimer = setTimeout(() => {
            saveFormData();
        }, CONFIG.autoSaveInterval);

        // Update progress
        updateProgress();
    }

    // Update Progress
    function updateProgress() {
        const form = document.getElementById('enquiryForm');
        if (!form) return;

        const requiredFields = form.querySelectorAll('[required]');
        let filledFields = 0;

        requiredFields.forEach(field => {
            if (field.value.trim()) {
                filledFields++;
            }
        });

        const percentage = Math.round((filledFields / requiredFields.length) * 100);

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }

        if (progressText) {
            progressText.textContent = percentage + '% Complete';
        }
    }

    // Step Navigation
    function nextStep() {
        if (!validateCurrentStep()) {
            showToast('Validation Error', 'Please fill all required fields correctly', 'error');
            return;
        }

        if (state.currentStep < state.totalSteps) {
            state.currentStep++;
            updateStepDisplay();
        }
    }

    function previousStep() {
        if (state.currentStep > 1) {
            state.currentStep--;
            updateStepDisplay();
        }
    }

    function updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${state.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update step header if exists
        const stepHeader = document.querySelector('.step-header');
        if (stepHeader) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${state.currentStep}"]`);
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Calculate Price Estimate
    function calculateEstimate() {
        const pickupCity = document.getElementById('pickupCity')?.value;
        const dropCity = document.getElementById('dropCity')?.value;
        const vehicleType = document.getElementById('vehicleType')?.value;

        if (!pickupCity || !dropCity || !vehicleType) return;

        // Simple distance estimation (this would be more accurate with actual API)
        const baseDistance = 500; // km
        const pricePerKm = 10;

        const vehicleConfig = CONFIG.vehicleTypes.find(v => v.value === vehicleType);
        const basePrice = vehicleConfig ? vehicleConfig.basePrice : 5000;

        state.estimatedPrice = basePrice + (baseDistance * pricePerKm);

        // Update UI if price widget exists
        updatePriceDisplay();
    }

    function updatePriceDisplay() {
        const priceElement = document.getElementById('estimatedPrice');
        if (priceElement) {
            priceElement.textContent = '₹' + state.estimatedPrice.toLocaleString('en-IN');
        }
    }

    // Save Form Data
    function saveFormData() {
        const form = document.getElementById('enquiryForm');
        if (!form) return;

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        localStorage.setItem('enquiryFormData', JSON.stringify(data));

        showAutoSaveIndicator();
    }

    function loadSavedData() {
        const savedData = localStorage.getItem('enquiryFormData');
        if (!savedData) return;

        try {
            const data = JSON.parse(savedData);

            Object.keys(data).forEach(key => {
                const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });

            updateProgress();
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    function clearSavedData() {
        localStorage.removeItem('enquiryFormData');
    }

    // Auto-save Indicator
    function showAutoSaveIndicator() {
        const indicator = document.querySelector('.auto-save-indicator');
        if (!indicator) return;

        indicator.classList.add('show');

        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    // Form Submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const form = e.target;
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showToast('Validation Error', 'Please fill all required fields correctly', 'error');
            return;
        }

        // Show loading
        showLoading(true);

        // Collect form data
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Add uploaded files info
        data.attachments = state.uploadedFiles.map(f => f.name);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate reference number
            const referenceNumber = generateReferenceNumber();

            // Store form data before resetting for PDF generation
            state.submittedData = { ...data };

            // Show success modal
            showSuccessModal(referenceNumber);

            // Clear form and saved data
            form.reset();
            clearSavedData();
            state.uploadedFiles = [];
            const previewContainer = document.querySelector('.file-preview-container');
            if (previewContainer) {
                previewContainer.innerHTML = '';
            }

            // Reset progress
            updateProgress();

        } catch (error) {
            showToast('Error', 'Failed to submit enquiry. Please try again.', 'error');
        } finally {
            showLoading(false);
        }
    }

    // Generate Reference Number
    function generateReferenceNumber() {
        const prefix = 'ENQ';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Success Modal
    function showSuccessModal(referenceNumber) {
        const modal = document.getElementById('successModal');
        if (!modal) return;

        const refElement = modal.querySelector('.reference-number .number');
        if (refElement) {
            refElement.textContent = referenceNumber;
        }

        modal.classList.add('show');

        // Close button
        const closeBtn = modal.querySelector('.btn-close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.remove('show');
            };
        }

        // Download PDF button
        const downloadBtn = modal.querySelector('.btn-download-pdf');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                downloadEnquiryPDF(referenceNumber);
            };
        }

        // Share button
        const shareBtn = modal.querySelector('.btn-share');
        if (shareBtn) {
            shareBtn.onclick = () => {
                shareEnquiry(referenceNumber);
            };
        }
    }

    // Download PDF
    function downloadEnquiryPDF(referenceNumber) {
        // Get stored form data
        const data = state.submittedData || {};

        if (!data || Object.keys(data).length === 0) {
            showToast('Error', 'Form data not found', 'error');
            return;
        }

        // Create PDF content as HTML
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Enquiry Receipt - ${referenceNumber}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        background: #fff;
                        color: #000;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #ff6347;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #ff6347;
                        margin: 0;
                        font-size: 28px;
                    }
                    .header p {
                        margin: 5px 0;
                        color: #666;
                    }
                    .reference {
                        background: #f5f5f5;
                        padding: 20px;
                        border-left: 4px solid #ff6347;
                        margin: 20px 0;
                        text-align: center;
                    }
                    .reference .label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .reference .number {
                        font-size: 24px;
                        font-weight: bold;
                        color: #ff6347;
                        font-family: monospace;
                        letter-spacing: 2px;
                    }
                    .section {
                        margin: 30px 0;
                    }
                    .section h2 {
                        color: #333;
                        border-bottom: 2px solid #ddd;
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                        font-size: 18px;
                    }
                    .field {
                        display: flex;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .field-label {
                        flex: 0 0 200px;
                        font-weight: bold;
                        color: #555;
                    }
                    .field-value {
                        flex: 1;
                        color: #333;
                    }
                    .footer {
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                    }
                    .timestamp {
                        text-align: center;
                        color: #999;
                        font-size: 12px;
                        margin: 20px 0;
                    }
                    @media print {
                        body { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Harihar Car Carriers</h1>
                    <p>Enquiry Receipt</p>
                    <p>📧 info@hariharcarcarriers.com | 📞 +91 98765 43210</p>
                </div>

                <div class="reference">
                    <div class="label">Reference Number</div>
                    <div class="number">${referenceNumber}</div>
                </div>

                <div class="timestamp">
                    Generated on: ${new Date().toLocaleString('en-IN', {
            dateStyle: 'full',
            timeStyle: 'short'
        })}
                </div>

                <div class="section">
                    <h2>Personal Information</h2>
                    <div class="field">
                        <div class="field-label">Name:</div>
                        <div class="field-value">${data.name || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">${data.email || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Phone:</div>
                        <div class="field-value">${data.phone || 'N/A'}</div>
                    </div>
                </div>

                <div class="section">
                    <h2>Enquiry Details</h2>
                    <div class="field">
                        <div class="field-label">Enquiry Type:</div>
                        <div class="field-value">${getEnquiryTypeLabel(data.enquiryType)}</div>
                    </div>
                    ${data.vehicleType ? `
                    <div class="field">
                        <div class="field-label">Vehicle Type:</div>
                        <div class="field-value">${getVehicleTypeLabel(data.vehicleType)}</div>
                    </div>
                    ` : ''}
                    ${data.pickupCity ? `
                    <div class="field">
                        <div class="field-label">Pickup City:</div>
                        <div class="field-value">${data.pickupCity}</div>
                    </div>
                    ` : ''}
                    ${data.dropCity ? `
                    <div class="field">
                        <div class="field-label">Drop City:</div>
                        <div class="field-value">${data.dropCity}</div>
                    </div>
                    ` : ''}
                    ${data.pickupDate ? `
                    <div class="field">
                        <div class="field-label">Preferred Pickup Date:</div>
                        <div class="field-value">${new Date(data.pickupDate).toLocaleDateString('en-IN')}</div>
                    </div>
                    ` : ''}
                    ${data.urgency ? `
                    <div class="field">
                        <div class="field-label">Urgency Level:</div>
                        <div class="field-value">${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}</div>
                    </div>
                    ` : ''}
                    <div class="field">
                        <div class="field-label">Message:</div>
                        <div class="field-value">${data.message || 'N/A'}</div>
                    </div>
                </div>

                ${data.contactMethod || data.callbackTime || data.vehicleValue ? `
                <div class="section">
                    <h2>Additional Information</h2>
                    ${data.contactMethod ? `
                    <div class="field">
                        <div class="field-label">Preferred Contact Method:</div>
                        <div class="field-value">${data.contactMethod.charAt(0).toUpperCase() + data.contactMethod.slice(1)}</div>
                    </div>
                    ` : ''}
                    ${data.callbackTime ? `
                    <div class="field">
                        <div class="field-label">Best Time to Call:</div>
                        <div class="field-value">${data.callbackTime === 'any' ? 'Any Time' : data.callbackTime.charAt(0).toUpperCase() + data.callbackTime.slice(1)}</div>
                    </div>
                    ` : ''}
                    ${data.vehicleValue ? `
                    <div class="field">
                        <div class="field-label">Vehicle Value:</div>
                        <div class="field-value">₹${parseFloat(data.vehicleValue).toLocaleString('en-IN')}</div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Harihar Car Carriers</strong></p>
                    <p>123 Transport Nagar, Sitabuldi, Nagpur, Maharashtra - 440001</p>
                    <p>For any queries, please contact us at info@hariharcarcarriers.com</p>
                    <p style="margin-top: 20px;">Thank you for choosing Harihar Car Carriers!</p>
                </div>
            </body>
            </html>
        `;

        // Create a blob and download
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Enquiry_${referenceNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Success', 'Enquiry receipt downloaded successfully', 'success');
    }

    // Helper function to get enquiry type label
    function getEnquiryTypeLabel(value) {
        const type = CONFIG.enquiryTypes.find(t => t.value === value);
        return type ? type.label : value || 'N/A';
    }

    // Helper function to get vehicle type label
    function getVehicleTypeLabel(value) {
        const type = CONFIG.vehicleTypes.find(t => t.value === value);
        return type ? type.label : value || 'N/A';
    }

    // Share Enquiry
    function shareEnquiry(referenceNumber) {
        const message = `My enquiry reference: ${referenceNumber}\nTrack status: ${window.location.origin}/tracking.html`;

        if (navigator.share) {
            navigator.share({
                title: 'Enquiry Reference',
                text: message
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
                showToast('Success', 'Reference number copied to clipboard', 'success');
            });
        }
    }

    // Operating Hours
    function updateOperatingHours() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        const statusBadge = document.querySelector('.status-badge');
        if (!statusBadge) return;

        // Check if currently open (assuming 8 AM - 10 PM on weekdays)
        let isOpen = false;
        if (day >= 1 && day <= 5) {
            isOpen = hour >= 8 && hour < 22;
        } else if (day === 6) {
            isOpen = hour >= 9 && hour < 20;
        } else {
            isOpen = hour >= 9 && hour < 18;
        }

        statusBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
        statusBadge.innerHTML = `
            <span class="status-indicator"></span>
            ${isOpen ? 'Open Now' : 'Closed'}
        `;
    }


    // Setup FAQs
    function setupFAQs() {
        const faqItems = document.querySelectorAll('.faq-widget .faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all items first (accordion behaviour)
                faqItems.forEach(other => other.classList.remove('active'));

                // Re-open only if it was closed before this click
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // Auto-expand first FAQ
        if (faqItems.length > 0) {
            faqItems[0].classList.add('active');
        }
    }

    // Loading Overlay
    function showLoading(show) {
        const overlay = document.querySelector('.loading-overlay');
        if (!overlay) return;

        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    // Toast Notification
    function showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        // Show animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            removeToast(toast);
        });

        // Auto remove after 5 seconds
        setTimeout(() => removeToast(toast), 5000);
    }

    function removeToast(toast) {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
